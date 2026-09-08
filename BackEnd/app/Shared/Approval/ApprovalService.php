<?php

namespace App\Shared\Approval;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

final class ApprovalService
{
    public function request(
        string $entityType,
        string $entityId,
        int $entityVersion,
        string $makerId,
        string $companyId,
        ?string $plantId,
        string $ruleCode,
        array $summary = [],
    ): string {
        $id = (string) Str::uuid();

        DB::table('approval_requests')->insert([
            'id' => $id,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'entity_version' => $entityVersion,
            'maker_id' => $makerId,
            'company_id' => $companyId,
            'plant_id' => $plantId,
            'rule_code' => $ruleCode,
            'status' => 'PENDING',
            'summary_json' => json_encode($summary, JSON_THROW_ON_ERROR),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $id;
    }

    public function decide(string $requestId, string $reviewerId, string $decision, ?string $reason = null): void
    {
        if (! in_array($decision, ['APPROVE', 'REJECT'], true)) {
            throw ValidationException::withMessages([
                'decision' => ['Decision must be APPROVE or REJECT.'],
            ]);
        }

        DB::transaction(function () use ($requestId, $reviewerId, $decision, $reason) {
            $request = DB::table('approval_requests')->where('id', $requestId)->lockForUpdate()->first();

            if (! $request || $request->status !== 'PENDING') {
                throw ValidationException::withMessages([
                    'approval' => ['Approval request is no longer pending.'],
                ]);
            }

            if ($request->maker_id === $reviewerId) {
                throw ValidationException::withMessages([
                    'approval' => ['Maker cannot approve the same controlled transaction.'],
                ]);
            }

            DB::table('approval_decisions')->insert([
                'id' => (string) Str::uuid(),
                'approval_request_id' => $requestId,
                'reviewer_id' => $reviewerId,
                'decision' => $decision,
                'reason' => $reason,
                'created_at' => now(),
            ]);

            DB::table('approval_requests')->where('id', $requestId)->update([
                'status' => $decision === 'APPROVE' ? 'APPROVED' : 'REJECTED',
                'record_version' => $request->record_version + 1,
                'updated_at' => now(),
            ]);
        });
    }
}
