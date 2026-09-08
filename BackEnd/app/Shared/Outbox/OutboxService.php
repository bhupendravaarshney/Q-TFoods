<?php

namespace App\Shared\Outbox;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class OutboxService
{
    public function append(
        string $eventType,
        string $aggregateType,
        string $aggregateId,
        string $businessKey,
        array $payload,
        ?string $correlationId = null,
    ): string {
        $id = (string) Str::uuid();

        DB::table('outbox_events')->insert([
            'id' => $id,
            'event_type' => $eventType,
            'aggregate_type' => $aggregateType,
            'aggregate_id' => $aggregateId,
            'business_key' => $businessKey,
            'payload_json' => json_encode($payload, JSON_THROW_ON_ERROR),
            'correlation_id' => $correlationId,
            'status' => 'PENDING',
            'attempts' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $id;
    }
}
