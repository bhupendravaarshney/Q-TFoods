<?php

namespace App\Http\Middleware;

use App\Modules\Foundation\Application\DeviceSessionService;
use App\Modules\Foundation\Domain\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureActiveDeviceSession
{
    public function __construct(private readonly DeviceSessionService $sessions) {}

    public function handle(Request $request, Closure $next): Response
    {
        /** @var User $user */
        $user = $request->user();
        $this->sessions->ensure($user, $request);

        return $next($request);
    }
}
