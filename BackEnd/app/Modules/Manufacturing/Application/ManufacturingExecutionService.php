<?php

namespace App\Modules\Manufacturing\Application;

use App\Modules\Inventory\Application\StockPostingService;
use App\Shared\Audit\AuditService;
use App\Shared\Idempotency\IdempotencyService;
use App\Shared\Outbox\OutboxService;
use Carbon\CarbonImmutable;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class ManufacturingExecutionService
{
    public const ORDER_STATUSES = ['DRAFT', 'RELEASED', 'IN_PROCESS', 'COMPLETED', 'CANCELLED'];
    public const OUTPUT_TYPES = ['GOOD', 'LOSS', 'REWORK'];
    public const REWORK_DISPOSITIONS = ['RECOVERED', 'SCRAPPED'];

    public function __construct(
        private readonly IdempotencyService $idempotency,
        private readonly AuditService $audit,
        private readonly OutboxService $outbox,
        private readonly StockPostingService $stock,
    ) {}

    public function createOrder(array $data): array
    {
        return DB::transaction(function () use ($data): array {
            $namespace = 'manufacturing.production-order.create';
            if ($replay = $this->begin($namespace, $data)) {
                return $replay;
            }
            $this->assertUniqueNumber('order_number', $data['order_number'], $data);
            $this->assertUniqueNumber('batch_number', $data['batch_number'], $data);

            $line = DB::table('production_schedule_lines as line')
                ->join('production_schedules as schedule', 'schedule.id', '=', 'line.production_schedule_id')
                ->where('line.id', $data['production_schedule_line_id'])
                ->where('line.company_id', $data['company_id'])->where('line.plant_id', $data['plant_id'])
                ->lockForUpdate()->first([
                    'line.*', 'schedule.status as schedule_status', 'schedule.schedule_number',
                ]);
            if (! $line) {
                throw ValidationException::withMessages(['production_schedule_line_id' => ['Released production schedule line not found in the selected plant.']]);
            }
            if ($line->schedule_status !== 'RELEASED' || ! $line->is_active) {
                throw ValidationException::withMessages(['production_schedule_line_id' => ['Only an active line on a released schedule can become a production order.']]);
            }
            if (DB::table('production_orders')->where('production_schedule_line_id', $line->id)
                ->where('status', '<>', 'CANCELLED')->exists()) {
                throw ValidationException::withMessages(['production_schedule_line_id' => ['This schedule line already has an active production order.']]);
            }

            $materials = DB::table('mrp_material_requirements')
                ->where('mrp_planned_order_id', $line->mrp_planned_order_id)
                ->orderBy('line_number')->get();
            $stages = DB::table('production_schedule_operations')
                ->where('production_schedule_line_id', $line->id)
                ->orderBy('sequence_no')->get();
            if ($materials->isEmpty() || $stages->isEmpty()) {
                throw new ConflictHttpException('The released schedule line is missing its material or route-operation snapshot.');
            }

            $id = (string) Str::uuid();
            $now = CarbonImmutable::now();
            DB::table('production_orders')->insert([
                'id' => $id, 'company_id' => $data['company_id'], 'plant_id' => $data['plant_id'],
                'order_number' => $data['order_number'], 'batch_number' => $data['batch_number'],
                'production_schedule_id' => $line->production_schedule_id,
                'production_schedule_line_id' => $line->id, 'output_sku_id' => $line->output_sku_id,
                'recipe_id' => $line->recipe_id, 'route_id' => $line->route_id,
                'planned_quantity' => $this->decimal($line->planned_quantity), 'uom_code' => $line->uom_code,
                'planned_start_date' => $data['planned_start_date'] ?? $line->planned_start_date,
                'planned_end_date' => $data['planned_end_date'] ?? $line->planned_end_date,
                'status' => 'DRAFT', 'quality_status' => 'PENDING', 'record_version' => 1,
                'notes' => $this->nullable($data['notes'] ?? null), 'created_by' => $data['actor_id'],
                'created_at' => $now, 'updated_at' => $now,
            ]);
            foreach ($materials as $index => $material) {
                DB::table('production_order_materials')->insert([
                    'id' => (string) Str::uuid(), 'production_order_id' => $id,
                    'company_id' => $data['company_id'], 'plant_id' => $data['plant_id'],
                    'line_number' => $index + 1, 'mrp_material_requirement_id' => $material->id,
                    'component_sku_id' => $material->component_sku_id,
                    'required_quantity' => $this->decimal($material->gross_requirement),
                    'issued_quantity' => '0.000000', 'uom_code' => $material->uom_code,
                    'created_at' => $now, 'updated_at' => $now,
                ]);
            }
            foreach ($stages as $stage) {
                DB::table('production_order_stages')->insert([
                    'id' => (string) Str::uuid(), 'production_order_id' => $id,
                    'company_id' => $data['company_id'], 'plant_id' => $data['plant_id'],
                    'production_schedule_operation_id' => $stage->id, 'sequence_no' => $stage->sequence_no,
                    'operation_name' => $stage->operation_name, 'work_center_code' => $stage->work_center_code,
                    'planned_minutes' => $this->decimal($stage->required_minutes), 'status' => 'PENDING',
                    'record_version' => 1, 'created_at' => $now, 'updated_at' => $now,
                ]);
            }

            $result = $this->orderResult($id, 'DRAFT', 1);
            $this->record('CREATE_PRODUCTION_ORDER', 'manufacturing.production-order.created', 'production_order', $id, $data, 1, [
                'schedule_number' => $line->schedule_number, 'material_count' => $materials->count(), 'stage_count' => $stages->count(),
            ], $result);
            $this->idempotency->complete($namespace, $data['idempotency_key'], $result);

            return $result;
        }, 3);
    }

    public function releaseOrder(string $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data): array {
            $namespace = 'manufacturing.production-order.release.'.$id;
            if ($replay = $this->begin($namespace, $data + ['production_order_id' => $id])) {
                return $replay;
            }
            $order = $this->findOrder($id, $data, true);
            $this->assertVersion($order, $data['expected_version'], 'production order');
            $this->assertStatus($order, ['DRAFT'], 'Only a draft production order can be released.');

            $reservations = DB::table('production_material_reservations as link')
                ->join('stock_reservations as reservation', 'reservation.id', '=', 'link.stock_reservation_id')
                ->where('link.production_schedule_line_id', $order->production_schedule_line_id)
                ->where('link.company_id', $data['company_id'])->where('link.plant_id', $data['plant_id'])
                ->whereNull('link.released_at')->where('reservation.status', 'ACTIVE')->get([
                    'link.mrp_material_requirement_id', 'link.quantity_base',
                ])->groupBy('mrp_material_requirement_id');
            $materials = DB::table('production_order_materials')->where('production_order_id', $id)->get();
            foreach ($materials as $material) {
                $reserved = $this->decimal($reservations->get($material->mrp_material_requirement_id)?->sum('quantity_base') ?? 0);
                if (bccomp($reserved, $this->decimal($material->required_quantity), 6) !== 0) {
                    throw ValidationException::withMessages([
                        'materials' => ["Material line {$material->line_number} is not backed by the exact active planning reservation."],
                    ]);
                }
            }

            $now = CarbonImmutable::now();
            $version = (int) $order->record_version + 1;
            DB::table('production_orders')->where('id', $id)->update([
                'status' => 'RELEASED', 'record_version' => $version,
                'released_at' => $now, 'released_by' => $data['actor_id'], 'updated_at' => $now,
            ]);
            $result = $this->orderResult($id, 'RELEASED', $version);
            $this->record('RELEASE_PRODUCTION_ORDER', 'manufacturing.production-order.released', 'production_order', $id, $data, $version, [
                'status' => ['from' => 'DRAFT', 'to' => 'RELEASED'], 'reservation_count' => $reservations->flatten()->count(),
            ], $result);
            $this->idempotency->complete($namespace, $data['idempotency_key'], $result);

            return $result;
        }, 3);
    }

    public function issueMaterials(string $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data): array {
            $namespace = 'manufacturing.production-order.issue-materials.'.$id;
            if ($replay = $this->begin($namespace, $data + ['production_order_id' => $id])) {
                return $replay;
            }
            $order = $this->findOrder($id, $data, true);
            $this->assertVersion($order, $data['expected_version'], 'production order');
            $this->assertStatus($order, ['RELEASED'], 'Material can only be issued to a released production order.');

            $rows = DB::table('production_material_reservations as link')
                ->join('stock_reservations as reservation', 'reservation.id', '=', 'link.stock_reservation_id')
                ->join('stock_positions as position', 'position.id', '=', 'reservation.stock_position_id')
                ->join('production_order_materials as material', function ($join) use ($id): void {
                    $join->on('material.mrp_material_requirement_id', '=', 'link.mrp_material_requirement_id')
                        ->where('material.production_order_id', '=', $id);
                })
                ->where('link.production_schedule_line_id', $order->production_schedule_line_id)
                ->where('link.company_id', $data['company_id'])->where('link.plant_id', $data['plant_id'])
                ->orderBy('reservation.stock_position_id')->orderBy('reservation.id')->lockForUpdate()
                ->get([
                    'link.id as link_id', 'link.quantity_base as link_quantity',
                    'reservation.id as reservation_id', 'reservation.quantity_base as reserved_quantity',
                    'reservation.status as reservation_status', 'reservation.record_version as reservation_version',
                    'position.id as position_id', 'position.item_id', 'position.lot_id', 'position.inventory_owner_id',
                    'position.quality_status', 'position.uom_code', 'position.quantity_base as position_quantity',
                    'position.reserved_quantity_base', 'position.record_version as position_version',
                    'material.id as material_id', 'material.component_sku_id',
                ]);
            if ($rows->isEmpty()) {
                throw new ConflictHttpException('No planning reservations remain for this production order.');
            }

            $now = CarbonImmutable::now();
            $issuedTotal = '0.000000';
            foreach ($rows as $row) {
                if ($row->reservation_status !== 'ACTIVE' || DB::table('production_material_issues')
                    ->where('production_material_reservation_id', $row->link_id)->exists()) {
                    throw new ConflictHttpException('A production reservation was already consumed or released. Refresh the order.');
                }
                $quantity = $this->decimal($row->reserved_quantity);
                if (bccomp($quantity, $this->decimal($row->link_quantity), 6) !== 0
                    || bccomp($this->decimal($row->reserved_quantity_base), $quantity, 6) < 0
                    || $row->item_id !== $row->component_sku_id) {
                    throw new ConflictHttpException('The material reservation and stock projection are inconsistent.');
                }

                DB::table('stock_reservations')->where('id', $row->reservation_id)->update([
                    'status' => 'RELEASED', 'record_version' => (int) $row->reservation_version + 1,
                    'released_at' => $now, 'released_by' => $data['actor_id'],
                    'release_reason' => "Consumed by production order {$order->order_number}", 'updated_at' => $now,
                ]);
                DB::table('stock_positions')->where('id', $row->position_id)->update([
                    'reserved_quantity_base' => bcsub($this->decimal($row->reserved_quantity_base), $quantity, 6),
                    'record_version' => (int) $row->position_version + 1, 'updated_at' => $now,
                ]);

                $movement = $this->stock->issue([
                    'company_id' => $data['company_id'], 'plant_id' => $data['plant_id'],
                    'source_position_id' => $row->position_id, 'quantity_base' => $quantity,
                    'uom_code' => $row->uom_code, 'expected_item_id' => $row->component_sku_id,
                    'expected_lot_id' => $row->lot_id, 'expected_owner_id' => $row->inventory_owner_id,
                    'expected_quality_status' => $row->quality_status, 'movement_type' => 'PRODUCTION_ISSUE',
                    'source_type' => 'production_order', 'source_id' => $id,
                    'source_version' => (int) $order->record_version, 'actor_id' => $data['actor_id'],
                    'reason_code' => 'MATERIAL_CONSUMPTION',
                    'idempotency_key' => "production-order:{$id}:reservation:{$row->reservation_id}",
                    'correlation_id' => $data['correlation_id'] ?? null,
                ]);
                DB::table('production_material_issues')->insert([
                    'id' => (string) Str::uuid(), 'production_order_id' => $id,
                    'production_order_material_id' => $row->material_id,
                    'company_id' => $data['company_id'], 'plant_id' => $data['plant_id'],
                    'production_material_reservation_id' => $row->link_id,
                    'stock_reservation_id' => $row->reservation_id, 'source_position_id' => $row->position_id,
                    'input_lot_id' => $row->lot_id, 'stock_movement_id' => $movement['movement_id'],
                    'quantity' => $quantity, 'uom_code' => $row->uom_code,
                    'issued_by' => $data['actor_id'], 'issued_at' => $now, 'created_at' => $now,
                ]);
                DB::table('production_material_reservations')->where('id', $row->link_id)->update([
                    'released_at' => $now, 'updated_at' => $now,
                ]);
                DB::table('production_order_materials')->where('id', $row->material_id)->increment('issued_quantity', $quantity, [
                    'updated_at' => $now,
                ]);
                $issuedTotal = bcadd($issuedTotal, $quantity, 6);
            }
            if (DB::table('production_order_materials')->where('production_order_id', $id)
                ->whereColumn('issued_quantity', '<', 'required_quantity')->exists()) {
                throw new ConflictHttpException('The atomic material issue did not satisfy every production requirement.');
            }

            $version = (int) $order->record_version + 1;
            DB::table('production_orders')->where('id', $id)->update([
                'status' => 'IN_PROCESS', 'record_version' => $version,
                'started_at' => $now, 'updated_at' => $now,
            ]);
            $result = $this->orderResult($id, 'IN_PROCESS', $version) + [
                'issue_count' => $rows->count(), 'issued_quantity' => $issuedTotal,
            ];
            $this->record('ISSUE_PRODUCTION_MATERIALS', 'manufacturing.production-materials.issued', 'production_order', $id, $data, $version, [
                'status' => ['from' => 'RELEASED', 'to' => 'IN_PROCESS'], 'issue_count' => $rows->count(),
            ], $result);
            $this->idempotency->complete($namespace, $data['idempotency_key'], $result);

            return $result;
        }, 3);
    }

    public function startStage(string $stageId, array $data): array
    {
        return DB::transaction(function () use ($stageId, $data): array {
            $namespace = 'manufacturing.production-stage.start.'.$stageId;
            if ($replay = $this->begin($namespace, $data + ['production_stage_id' => $stageId])) {
                return $replay;
            }
            $stage = $this->findStage($stageId, $data, true);
            $this->assertVersion($stage, $data['expected_version'], 'production stage');
            if ($stage->status !== 'PENDING' || $stage->order_status !== 'IN_PROCESS') {
                throw ValidationException::withMessages(['status' => ['Only a pending stage on an in-process order can be started.']]);
            }
            if (DB::table('production_order_stages')->where('production_order_id', $stage->production_order_id)
                ->where('status', 'IN_PROGRESS')->exists()) {
                throw ValidationException::withMessages(['status' => ['Complete the current in-progress stage before starting another.']]);
            }
            if (DB::table('production_order_stages')->where('production_order_id', $stage->production_order_id)
                ->where('sequence_no', '<', $stage->sequence_no)->where('status', '<>', 'COMPLETED')->exists()) {
                throw ValidationException::withMessages(['sequence' => ['Every preceding production stage must be completed first.']]);
            }
            $now = CarbonImmutable::now();
            $version = (int) $stage->record_version + 1;
            DB::table('production_order_stages')->where('id', $stageId)->update([
                'status' => 'IN_PROGRESS', 'record_version' => $version,
                'started_at' => $now, 'started_by' => $data['actor_id'], 'updated_at' => $now,
            ]);
            DB::table('stage_events')->insert([
                'id' => (string) Str::uuid(), 'company_id' => $data['company_id'], 'plant_id' => $data['plant_id'],
                'status' => 'POSTED', 'record_version' => 1, 'created_by' => $data['actor_id'],
                'production_order_id' => $stage->production_order_id, 'production_order_stage_id' => $stageId,
                'event_type' => 'STARTED', 'event_at' => $now, 'actual_minutes' => null, 'notes' => null,
                'created_at' => $now, 'updated_at' => $now,
            ]);
            $result = $this->stageResult($stageId, $stage->production_order_id, 'IN_PROGRESS', $version);
            $this->record('START_PRODUCTION_STAGE', 'manufacturing.production-stage.started', 'production_stage', $stageId, $data, $version, [
                'status' => ['from' => 'PENDING', 'to' => 'IN_PROGRESS'], 'sequence_no' => (int) $stage->sequence_no,
            ], $result);
            $this->idempotency->complete($namespace, $data['idempotency_key'], $result);

            return $result;
        }, 3);
    }

    public function completeStage(string $stageId, array $data): array
    {
        return DB::transaction(function () use ($stageId, $data): array {
            $namespace = 'manufacturing.production-stage.complete.'.$stageId;
            if ($replay = $this->begin($namespace, $data + ['production_stage_id' => $stageId])) {
                return $replay;
            }
            $stage = $this->findStage($stageId, $data, true);
            $this->assertVersion($stage, $data['expected_version'], 'production stage');
            if ($stage->status !== 'IN_PROGRESS' || $stage->order_status !== 'IN_PROCESS') {
                throw ValidationException::withMessages(['status' => ['Only an in-progress stage can be completed.']]);
            }
            $minutes = $this->nonNegative($data['actual_minutes'], 'actual_minutes', 'Actual minutes');
            $now = CarbonImmutable::now();
            $version = (int) $stage->record_version + 1;
            DB::table('production_order_stages')->where('id', $stageId)->update([
                'status' => 'COMPLETED', 'record_version' => $version, 'actual_minutes' => $minutes,
                'completed_at' => $now, 'completed_by' => $data['actor_id'],
                'notes' => $this->nullable($data['notes'] ?? null), 'updated_at' => $now,
            ]);
            DB::table('stage_events')->insert([
                'id' => (string) Str::uuid(), 'company_id' => $data['company_id'], 'plant_id' => $data['plant_id'],
                'status' => 'POSTED', 'record_version' => 1, 'created_by' => $data['actor_id'],
                'production_order_id' => $stage->production_order_id, 'production_order_stage_id' => $stageId,
                'event_type' => 'COMPLETED', 'event_at' => $now, 'actual_minutes' => $minutes,
                'notes' => $this->nullable($data['notes'] ?? null), 'created_at' => $now, 'updated_at' => $now,
            ]);
            $result = $this->stageResult($stageId, $stage->production_order_id, 'COMPLETED', $version) + [
                'actual_minutes' => $minutes,
            ];
            $this->record('COMPLETE_PRODUCTION_STAGE', 'manufacturing.production-stage.completed', 'production_stage', $stageId, $data, $version, [
                'status' => ['from' => 'IN_PROGRESS', 'to' => 'COMPLETED'], 'actual_minutes' => $minutes,
            ], $result);
            $this->idempotency->complete($namespace, $data['idempotency_key'], $result);

            return $result;
        }, 3);
    }

    public function recordOutput(string $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data): array {
            $namespace = 'manufacturing.production-output.record.'.$id;
            if ($replay = $this->begin($namespace, $data + ['production_order_id' => $id])) {
                return $replay;
            }
            $order = $this->findOrder($id, $data, true);
            $this->assertVersion($order, $data['expected_version'], 'production order');
            $this->assertStatus($order, ['IN_PROCESS'], 'Output can only be declared for an in-process production order.');
            $quantity = $this->positive($data['quantity'], 'quantity', 'Output quantity');
            $type = Str::upper($data['event_type']);
            if ($type !== 'GOOD' && trim((string) ($data['reason_code'] ?? '')) === '') {
                throw ValidationException::withMessages(['reason_code' => ['Loss and rework declarations require a reason code.']]);
            }
            $already = $this->decimal(DB::table('production_output_events')->where('production_order_id', $id)->sum('quantity'));
            if (bccomp(bcadd($already, $quantity, 6), $this->decimal($order->planned_quantity), 6) > 0) {
                throw ValidationException::withMessages(['quantity' => ['Declared good, loss, and rework quantity cannot exceed the planned batch quantity.']]);
            }
            $sequence = (int) DB::table('production_output_events')->where('production_order_id', $id)->max('sequence_no') + 1;
            $eventId = (string) Str::uuid();
            $now = CarbonImmutable::now();
            DB::table('production_output_events')->insert([
                'id' => $eventId, 'production_order_id' => $id,
                'company_id' => $data['company_id'], 'plant_id' => $data['plant_id'],
                'sequence_no' => $sequence, 'event_type' => $type, 'quantity' => $quantity,
                'uom_code' => $order->uom_code, 'reason_code' => $type === 'GOOD' ? null : Str::upper(trim($data['reason_code'])),
                'notes' => $this->nullable($data['notes'] ?? null),
                'rework_status' => $type === 'REWORK' ? 'OPEN' : 'NA',
                'recorded_by' => $data['actor_id'], 'recorded_at' => $now,
                'created_at' => $now, 'updated_at' => $now,
            ]);
            $version = (int) $order->record_version + 1;
            DB::table('production_orders')->where('id', $id)->update(['record_version' => $version, 'updated_at' => $now]);
            $metrics = $this->outputMetrics($id);
            $result = $this->orderResult($id, 'IN_PROCESS', $version) + ['output_event_id' => $eventId] + $metrics;
            $this->record('RECORD_PRODUCTION_OUTPUT', 'manufacturing.production-output.recorded', 'production_order', $id, $data, $version, [
                'event_type' => $type, 'quantity' => $quantity, 'accounted_quantity' => $metrics['accounted_quantity'],
            ], $result);
            $this->idempotency->complete($namespace, $data['idempotency_key'], $result);

            return $result;
        }, 3);
    }

    public function resolveRework(string $eventId, array $data): array
    {
        return DB::transaction(function () use ($eventId, $data): array {
            $namespace = 'manufacturing.production-rework.resolve.'.$eventId;
            if ($replay = $this->begin($namespace, $data + ['production_output_event_id' => $eventId])) {
                return $replay;
            }
            $event = DB::table('production_output_events')->where('id', $eventId)
                ->where('company_id', $data['company_id'])->where('plant_id', $data['plant_id'])
                ->lockForUpdate()->first();
            if (! $event) {
                throw new NotFoundHttpException('Production output event not found.');
            }
            if ($event->event_type !== 'REWORK' || $event->rework_status !== 'OPEN') {
                throw ValidationException::withMessages(['status' => ['Only an open rework declaration can be resolved.']]);
            }
            $order = $this->findOrder($event->production_order_id, $data, true);
            if ($order->status !== 'IN_PROCESS') {
                throw ValidationException::withMessages(['status' => ['Rework must be resolved before the production order is completed.']]);
            }
            $now = CarbonImmutable::now();
            DB::table('production_output_events')->where('id', $eventId)->update([
                'rework_status' => Str::upper($data['disposition']), 'resolved_at' => $now,
                'resolved_by' => $data['actor_id'], 'resolution_notes' => trim($data['notes']), 'updated_at' => $now,
            ]);
            $version = (int) $order->record_version + 1;
            DB::table('production_orders')->where('id', $order->id)->update(['record_version' => $version, 'updated_at' => $now]);
            $metrics = $this->outputMetrics($order->id);
            $result = $this->orderResult($order->id, 'IN_PROCESS', $version) + ['output_event_id' => $eventId] + $metrics;
            $this->record('RESOLVE_PRODUCTION_REWORK', 'manufacturing.production-rework.resolved', 'production_order', $order->id, $data, $version, [
                'rework_status' => ['from' => 'OPEN', 'to' => Str::upper($data['disposition'])],
            ], $result);
            $this->idempotency->complete($namespace, $data['idempotency_key'], $result);

            return $result;
        }, 3);
    }

    public function completeOrder(string $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data): array {
            $namespace = 'manufacturing.production-order.complete.'.$id;
            if ($replay = $this->begin($namespace, $data + ['production_order_id' => $id])) {
                return $replay;
            }
            $order = $this->findOrder($id, $data, true);
            $this->assertVersion($order, $data['expected_version'], 'production order');
            $this->assertStatus($order, ['IN_PROCESS'], 'Only an in-process production order can be completed.');
            if (DB::table('production_order_materials')->where('production_order_id', $id)
                ->whereColumn('issued_quantity', '<', 'required_quantity')->exists()) {
                throw ValidationException::withMessages(['materials' => ['Issue every planned material quantity before completing production.']]);
            }
            if (DB::table('production_order_stages')->where('production_order_id', $id)->where('status', '<>', 'COMPLETED')->exists()) {
                throw ValidationException::withMessages(['stages' => ['Complete every route stage before completing production.']]);
            }
            $metrics = $this->outputMetrics($id);
            if (bccomp($metrics['accounted_quantity'], $this->decimal($order->planned_quantity), 6) !== 0) {
                throw ValidationException::withMessages(['output' => ['Good, loss, and rework declarations must account for the exact planned batch quantity.']]);
            }
            if ($metrics['open_rework_count'] > 0) {
                throw ValidationException::withMessages(['rework' => ['Resolve every rework declaration before completing production.']]);
            }
            if (bccomp($metrics['good_quantity'], '0', 6) <= 0) {
                throw ValidationException::withMessages(['output' => ['A completed production order must have positive recoverable good output.']]);
            }
            $now = CarbonImmutable::now();
            $version = (int) $order->record_version + 1;
            DB::table('production_orders')->where('id', $id)->update([
                'status' => 'COMPLETED', 'record_version' => $version,
                'completed_at' => $now, 'completed_by' => $data['actor_id'], 'updated_at' => $now,
            ]);
            $result = $this->orderResult($id, 'COMPLETED', $version) + $metrics;
            $this->record('COMPLETE_PRODUCTION_ORDER', 'manufacturing.production-order.completed', 'production_order', $id, $data, $version, [
                'status' => ['from' => 'IN_PROCESS', 'to' => 'COMPLETED'],
                'good_quantity' => $metrics['good_quantity'], 'loss_quantity' => $metrics['loss_quantity'],
            ], $result);
            $this->idempotency->complete($namespace, $data['idempotency_key'], $result);

            return $result;
        }, 3);
    }

    public function cancelOrder(string $id, string $reason, array $data): array
    {
        return DB::transaction(function () use ($id, $reason, $data): array {
            $namespace = 'manufacturing.production-order.cancel.'.$id;
            if ($replay = $this->begin($namespace, $data + ['production_order_id' => $id, 'reason' => $reason])) {
                return $replay;
            }
            $order = $this->findOrder($id, $data, true);
            $this->assertVersion($order, $data['expected_version'], 'production order');
            $this->assertStatus($order, ['DRAFT', 'RELEASED'], 'Only an unstarted production order can be cancelled.');
            $now = CarbonImmutable::now();
            $version = (int) $order->record_version + 1;
            DB::table('production_orders')->where('id', $id)->update([
                'status' => 'CANCELLED', 'record_version' => $version,
                'cancelled_at' => $now, 'cancelled_by' => $data['actor_id'],
                'cancellation_reason' => trim($reason), 'updated_at' => $now,
            ]);
            $result = $this->orderResult($id, 'CANCELLED', $version);
            $this->record('CANCEL_PRODUCTION_ORDER', 'manufacturing.production-order.cancelled', 'production_order', $id, $data, $version, [
                'status' => ['from' => $order->status, 'to' => 'CANCELLED'], 'reason' => trim($reason),
            ], $result);
            $this->idempotency->complete($namespace, $data['idempotency_key'], $result);

            return $result;
        }, 3);
    }

    public function outputMetrics(string $orderId): array
    {
        $events = DB::table('production_output_events')->where('production_order_id', $orderId)->get();
        $directGood = $this->decimal($events->where('event_type', 'GOOD')->sum('quantity'));
        $loss = $this->decimal($events->where('event_type', 'LOSS')->sum('quantity'));
        $rework = $this->decimal($events->where('event_type', 'REWORK')->sum('quantity'));
        $recovered = $this->decimal($events->where('rework_status', 'RECOVERED')->sum('quantity'));
        $scrapped = $this->decimal($events->where('rework_status', 'SCRAPPED')->sum('quantity'));

        return [
            'accounted_quantity' => bcadd(bcadd($directGood, $loss, 6), $rework, 6),
            'good_quantity' => bcadd($directGood, $recovered, 6),
            'loss_quantity' => bcadd($loss, $scrapped, 6),
            'rework_quantity' => $rework,
            'open_rework_count' => $events->where('event_type', 'REWORK')->where('rework_status', 'OPEN')->count(),
        ];
    }

    private function findOrder(string $id, array $scope, bool $lock = false): object
    {
        $query = DB::table('production_orders')->where('id', $id)
            ->where('company_id', $scope['company_id'])->where('plant_id', $scope['plant_id']);
        $order = ($lock ? $query->lockForUpdate() : $query)->first();
        if (! $order) {
            throw new NotFoundHttpException('Production order not found.');
        }

        return $order;
    }

    private function findStage(string $id, array $scope, bool $lock = false): object
    {
        $query = DB::table('production_order_stages as stage')
            ->join('production_orders as order', 'order.id', '=', 'stage.production_order_id')
            ->where('stage.id', $id)->where('stage.company_id', $scope['company_id'])
            ->where('stage.plant_id', $scope['plant_id']);
        $stage = ($lock ? $query->lockForUpdate() : $query)->first([
            'stage.*', 'order.status as order_status', 'order.order_number',
        ]);
        if (! $stage) {
            throw new NotFoundHttpException('Production stage not found.');
        }

        return $stage;
    }

    private function assertUniqueNumber(string $column, string $number, array $scope): void
    {
        if (DB::table('production_orders')->where('company_id', $scope['company_id'])
            ->where('plant_id', $scope['plant_id'])->where($column, $number)->exists()) {
            throw ValidationException::withMessages([$column => ['That production identifier already exists in the selected plant.']]);
        }
    }

    private function assertVersion(object $record, int $expected, string $label): void
    {
        if ((int) $record->record_version !== $expected) {
            throw new ConflictHttpException("The {$label} changed from version {$expected} to {$record->record_version}. Refresh it before continuing.");
        }
    }

    private function assertStatus(object $record, array $statuses, string $message): void
    {
        if (! in_array($record->status, $statuses, true)) {
            throw ValidationException::withMessages(['status' => [$message]]);
        }
    }

    private function orderResult(string $id, string $status, int $version): array
    {
        return ['entity_type' => 'production_order', 'id' => $id, 'status' => $status, 'record_version' => $version];
    }

    private function stageResult(string $id, string $orderId, string $status, int $version): array
    {
        return ['entity_type' => 'production_stage', 'id' => $id, 'production_order_id' => $orderId, 'status' => $status, 'record_version' => $version];
    }

    private function record(string $command, string $event, string $entityType, string $id, array $data, int $version, array $safeDiff, array $result): void
    {
        $this->audit->record($command, $entityType, $id, $data['actor_id'], $data['company_id'], $data['plant_id'], 'SUCCESS', [
            'entity_version' => $version, 'correlation_id' => $data['correlation_id'] ?? null, 'safe_diff' => $safeDiff,
        ]);
        $this->outbox->append($event, $entityType, $id, $id.':'.$version, $result + [
            'company_id' => $data['company_id'], 'plant_id' => $data['plant_id'],
        ], $data['correlation_id'] ?? null, $data['company_id'], $data['plant_id']);
    }

    private function begin(string $namespace, array $data): ?array
    {
        return $this->idempotency->begin($namespace, $data['idempotency_key'], Arr::except($data, [
            'actor_id', 'permissions', 'idempotency_key', 'correlation_id',
        ]));
    }

    private function positive(mixed $value, string $field, string $label): string
    {
        $value = (string) $value;
        if (! preg_match('/^\d{1,14}(?:\.\d{1,6})?$/', $value) || bccomp($value, '0', 6) <= 0) {
            throw ValidationException::withMessages([$field => ["{$label} must be positive with at most 6 decimal places."]]);
        }

        return $this->decimal($value);
    }

    private function nonNegative(mixed $value, string $field, string $label): string
    {
        $value = (string) $value;
        if (! preg_match('/^\d{1,14}(?:\.\d{1,6})?$/', $value)) {
            throw ValidationException::withMessages([$field => ["{$label} must be non-negative with at most 6 decimal places."]]);
        }

        return $this->decimal($value);
    }

    private function decimal(mixed $value): string
    {
        return bcadd((string) ($value ?? 0), '0', 6);
    }

    private function nullable(mixed $value): ?string
    {
        $value = $value === null ? '' : trim((string) $value);

        return $value === '' ? null : $value;
    }
}
