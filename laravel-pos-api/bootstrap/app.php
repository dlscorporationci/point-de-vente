<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'tenant' => \App\Http\Middleware\TenantScopeMiddleware::class,
            'role'   => \App\Http\Middleware\CheckRoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        // Traduction des erreurs fréquentes en français
        $exceptions->render(function (\Illuminate\Http\Exceptions\ThrottleRequestsException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'error' => 'Trop de tentatives de connexion. Veuillez patienter 1 minute avant de réessayer.'
                ], 429);
            }
        });

        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'error' => 'Session expirée ou accès non autorisé. Veuillez vous re-connecter.'
                ], 401);
            }
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'error' => 'La ressource ou la page demandée est introuvable.'
                ], 404);
            }
        });

        $exceptions->report(function (\Throwable $e) {
            try {
                if (request()->is('api/*')) {
                    $user = request()->user('sanctum') ?: auth('sanctum')->user();
                    $tenantManager = app(\App\Services\TenantManager::class);
                    $userAgent = request()->userAgent();
                    $device = 'Web Client';
                    if ($userAgent) {
                        if (str_contains($userAgent, 'Mobile') || str_contains($userAgent, 'Android')) {
                            $device = 'Mobile Client';
                        }
                    }

                    \App\Models\SystemErrorLog::create([
                        'company_id' => $tenantManager->getCompanyId() ?: ($user ? $user->company_id : null),
                        'branch_id' => $tenantManager->getBranchId() ?: ($user ? $user->branch_id : null),
                        'user_id' => $user ? $user->id : null,
                        'module' => class_basename($e),
                        'error_message' => substr($e->getMessage(), 0, 1000) ?: get_class($e),
                        'stack_trace' => substr($e->getTraceAsString(), 0, 3000),
                        'ip_address' => request()->ip(),
                        'user_agent' => $userAgent,
                        'device' => $device,
                    ]);
                }
            } catch (\Throwable $ex) {
                // Silencieux
            }
        });
    })->create();
