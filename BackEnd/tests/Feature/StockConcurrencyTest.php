<?php

namespace Tests\Feature;

use App\Modules\Inventory\Application\StockPostingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

final class StockConcurrencyTest extends TestCase
{
    use RefreshDatabase;

    public function test_two_commands_cannot_consume_more_than_available_stock(): void
    {
        [$command, $sourceId, $targetId] = $this->stockCommand('7');
        $service = $this->app->make(StockPostingService::class);

        $service->move($command);

        try {
            $service->move([
                ...$command,
                'idempotency_key' => (string) Str::uuid(),
            ]);
            $this->fail('The second movement should have been rejected.');
        } catch (ValidationException) {
            $this->assertSame(3.0, (float) DB::table('stock_positions')->where('id', $sourceId)->value('quantity_base'));
            $this->assertSame(7.0, (float) DB::table('stock_positions')->where('id', $targetId)->value('quantity_base'));
        }
    }

    public function test_movement_quantity_must_be_positive(): void
    {
        [$command] = $this->stockCommand('-1');

        $this->expectException(ValidationException::class);
        $this->app->make(StockPostingService::class)->move($command);
    }

    public function test_source_and_target_must_be_different(): void
    {
        [$command, $sourceId] = $this->stockCommand('1');
        $command['target_position_id'] = $sourceId;

        $this->expectException(ValidationException::class);
        $this->app->make(StockPostingService::class)->move($command);
    }

    public function test_positions_must_match_the_command_plant(): void
    {
        [$command, , $targetId] = $this->stockCommand('1');
        DB::table('stock_positions')->where('id', $targetId)->update([
            'plant_id' => (string) Str::uuid(),
        ]);

        $this->expectException(ValidationException::class);
        $this->app->make(StockPostingService::class)->move($command);
    }

    public function test_issue_posts_one_idempotent_outbound_movement(): void
    {
        [$command, $sourceId] = $this->stockCommand('6');
        unset($command['target_position_id']);
        $command['movement_type'] = 'DISPOSAL';
        $service = $this->app->make(StockPostingService::class);

        $first = $service->issue($command);
        $replay = $service->issue([
            ...$command,
            'correlation_id' => (string) Str::uuid(),
        ]);

        $this->assertSame($first['movement_id'], $replay['movement_id']);
        $this->assertSame(4.0, (float) DB::table('stock_positions')->where('id', $sourceId)->value('quantity_base'));
        $this->assertDatabaseCount('stock_movements', 1);
        $this->assertDatabaseHas('stock_movements', [
            'id' => $first['movement_id'],
            'from_position_id' => $sourceId,
            'to_position_id' => null,
            'quantity_base' => 6,
        ]);
    }

    private function stockCommand(string $quantity): array
    {
        $companyId = (string) Str::uuid();
        $plantId = (string) Str::uuid();
        $itemId = (string) Str::uuid();
        $lotId = (string) Str::uuid();
        $sourceId = (string) Str::uuid();
        $targetId = (string) Str::uuid();
        $now = now();

        foreach ([[$sourceId, '10'], [$targetId, '0']] as [$id, $stock]) {
            DB::table('stock_positions')->insert([
                'id' => $id,
                'company_id' => $companyId,
                'plant_id' => $plantId,
                'item_id' => $itemId,
                'lot_id' => $lotId,
                'owner_party_id' => null,
                'location_id' => (string) Str::uuid(),
                'quality_status' => 'RELEASED',
                'quantity_base' => $stock,
                'uom_code' => 'KG',
                'record_version' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        return [[
            'company_id' => $companyId,
            'plant_id' => $plantId,
            'source_position_id' => $sourceId,
            'target_position_id' => $targetId,
            'quantity_base' => $quantity,
            'uom_code' => 'KG',
            'movement_type' => 'TRANSFER',
            'source_type' => 'TEST',
            'source_id' => (string) Str::uuid(),
            'actor_id' => (string) Str::uuid(),
            'idempotency_key' => (string) Str::uuid(),
        ], $sourceId, $targetId];
    }
}
