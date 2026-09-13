<?php

namespace App\Providers;

use App\Shared\Outbox\ConfiguredOutboxTransport;
use App\Shared\Outbox\OutboxTransport;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

final class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(OutboxTransport::class, ConfiguredOutboxTransport::class);
    }

    public function boot(): void
    {
        RateLimiter::for('identity-login', fn (Request $request) => Limit::perMinute(10)->by(
            $this->rateKey('login', $request, (string) $request->input('email'))
        ));
        RateLimiter::for('identity-mfa-challenge', fn (Request $request) => Limit::perMinute(10)->by(
            $this->rateKey('mfa-challenge', $request, (string) $request->input('challenge_id'))
        ));
        RateLimiter::for('identity-email', fn (Request $request) => Limit::perMinute(5)->by(
            $this->rateKey((string) $request->route()?->uri(), $request, (string) $request->input('email'))
        ));
        RateLimiter::for('identity-link-read', fn (Request $request) => Limit::perMinute(30)->by(
            $this->rateKey('link-read', $request, (string) $request->route('token'))
        ));
        RateLimiter::for('identity-link-consume', fn (Request $request) => Limit::perMinute(10)->by(
            $this->rateKey((string) $request->route()?->uri(), $request, (string) $request->input('token'))
        ));
        RateLimiter::for('identity-account-security', fn (Request $request) => Limit::perMinute(10)->by(
            $this->rateKey(
                (string) $request->route()?->uri(),
                $request,
                (string) ($request->user()?->getAuthIdentifier() ?? 'guest')
            )
        ));
    }

    private function rateKey(string $operation, Request $request, string $identity): string
    {
        return hash('sha256', implode('|', [
            $operation,
            Str::lower(trim($identity)),
            (string) $request->ip(),
        ]));
    }
}
