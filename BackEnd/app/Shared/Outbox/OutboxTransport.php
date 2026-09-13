<?php

namespace App\Shared\Outbox;

interface OutboxTransport
{
    public function name(): string;

    /**
     * @return array{acknowledgement_id:string,response:array<string,mixed>}
     */
    public function deliver(array $event): array;
}
