<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Shared interfaces and module adapters can be bound here.
    }

    public function boot(): void
    {
        // Module bootstrapping, observers and policy registration can be added here.
    }
}
