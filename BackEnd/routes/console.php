<?php

use App\Jobs\ProcessOutboxBatch;
use App\Shared\Outbox\OutboxProcessor;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Storage;

Artisan::command('qt:status', function () { $this->info('Q & T FOODS ERP backend ready.'); });

Artisan::command('qt:outbox:process {--limit=}', function () {
    $limit = $this->option('limit');
    $result = app(OutboxProcessor::class)->process(
        $limit === null || $limit === '' ? null : (int) $limit
    );
    $this->line(json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
})->purpose('Synchronously deliver due transactional-outbox events.');

Artisan::command('qt:evidence:migrate-object-storage {--source=evidence_legacy}', function () {
    $source = (string) $this->option('source');
    $target = (string) config('qtfoods.evidence_disk', 'evidence');
    if ($source === $target) {
        $this->error('Source and target evidence disks must be different.');
        return 1;
    }

    $copied = 0;
    $verified = 0;
    $missing = [];
    DB::table('unsold_return_evidence')->orderBy('uploaded_at')->get()
        ->each(function (object $evidence) use ($source, $target, &$copied, &$verified, &$missing): void {
            $path = (string) $evidence->storage_path;
            if (! Storage::disk($target)->exists($path)) {
                if (! Storage::disk($source)->exists($path)) {
                    $missing[] = $path;
                    return;
                }
                $stream = Storage::disk($source)->readStream($path);
                try {
                    Storage::disk($target)->writeStream($path, $stream, ['visibility' => 'private']);
                } finally {
                    if (is_resource($stream)) {
                        fclose($stream);
                    }
                }
                $copied++;
            }

            $actual = hash('sha256', Storage::disk($target)->get($path));
            if (! hash_equals((string) $evidence->sha256, $actual)) {
                Storage::disk($target)->delete($path);
                throw new RuntimeException('Integrity verification failed for evidence '.$evidence->id.'.');
            }
            $verified++;
        });

    if ($missing !== []) {
        $this->error(count($missing).' evidence object(s) were absent from both disks.');
        foreach ($missing as $path) {
            $this->line($path);
        }
        return 1;
    }
    $this->info("Evidence migration complete: {$copied} copied, {$verified} verified.");
    return 0;
})->purpose('Copy legacy private evidence into the configured object-storage disk and verify SHA-256 hashes.');

Schedule::job(new ProcessOutboxBatch())
    ->name('qt-outbox-delivery')
    ->everyMinute()
    ->withoutOverlapping(5);
