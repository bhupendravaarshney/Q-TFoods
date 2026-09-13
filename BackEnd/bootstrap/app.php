<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Middleware\EnsureContextSelected;
use App\Http\Middleware\EnsureActiveDeviceSession;
use App\Http\Middleware\EnsurePermission;
use App\Http\Middleware\EnsureScreenAccess;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'erp.device' => EnsureActiveDeviceSession::class,
            'erp.context' => EnsureContextSelected::class,
            'erp.permission' => EnsurePermission::class,
            'erp.screen' => EnsureScreenAccess::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson()
        );

        $exceptions->respond(function (Response $response) {
            if (! request()->is('api/*') || ! $response instanceof JsonResponse || $response->getStatusCode() < 400) {
                return $response;
            }

            $payload = $response->getData(true);
            if (isset($payload['error'])) {
                return $response;
            }

            $status = $response->getStatusCode();
            $codes = [
                401 => 'UNAUTHENTICATED',
                403 => 'FORBIDDEN',
                404 => 'NOT_FOUND',
                409 => 'CONFLICT',
                422 => 'VALIDATION_FAILED',
                429 => 'TOO_MANY_REQUESTS',
            ];

            $message = $status >= 500
                ? 'An unexpected server error occurred.'
                : ($payload['message'] ?? Response::$statusTexts[$status] ?? 'Request failed.');

            $error = [
                'code' => $codes[$status] ?? 'HTTP_'.$status,
                'message' => $message,
            ];

            if (! empty($payload['errors'])) {
                $error['fields'] = $payload['errors'];
            }

            if ($requestId = request()->header('X-Request-ID')) {
                $error['request_id'] = $requestId;
            }

            $response->setData(['error' => $error]);

            return $response;
        });
    })
    ->create();
