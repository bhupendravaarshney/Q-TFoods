<?php

namespace App\Jobs;

use App\Shared\Outbox\OutboxProcessor;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

final class ProcessOutboxBatch implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public function __construct(public readonly ?int $limit = null)
    {
        $this->onQueue('outbox');
    }

    public function handle(OutboxProcessor $processor): void
    {
        $processor->process($this->limit);
    }
}
