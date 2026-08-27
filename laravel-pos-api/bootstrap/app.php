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
        $middleware->prepend(\App\Http\Middleware\CorrelationIdMiddleware::class);
        $middleware->redirectGuestsTo(fn () => null);

        $middleware->alias([
            'tenant'      => \App\Http\Middleware\TenantScopeMiddleware::class,
            'role'        => \App\Http\Middleware\CheckRoleMiddleware::class,
            'access.zone' => \App\Http\Middleware\CheckAccessZoneMiddleware::class,
            'permission'  => \App\Http\Middleware\CheckPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        // Traduction et normalisation des réponses d'erreur API (Phase 3.2)
        $getReqId = function (Request $request) {
            return $request->attributes->get('request_id')
                ?? $request->header('X-Request-ID')
                ?? (app()->bound('request_id') ? app('request_id') : null);
        };

        // 422 — Erreurs de validation
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, Request $request) use ($getReqId) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status'     => 'error',
                    'code'       => 'VALIDATION_ERROR',
                    'message'    => 'Les données fournies sont invalides.',
                    'error'      => 'Les données fournies sont invalides.',
                    'errors'     => $e->errors(),
                    'request_id' => $getReqId($request),
                ], 422);
            }
        });

        // 429 — Rate Limiting
        $exceptions->render(function (\Illuminate\Http\Exceptions\ThrottleRequestsException $e, Request $request) use ($getReqId) {
            if ($request->is('api/*/auth/google/callback') && $request->isMethod('get')) {
                $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173'));
                $msg = 'Trop de tentatives de connexion. Veuillez patienter 1 minute avant de réessayer.';
                return redirect()->away($frontendUrl . '?google_error=' . urlencode($msg));
            }
            if ($request->is('api/*')) {
                return response()->json([
                    'status'     => 'error',
                    'code'       => 'TOO_MANY_REQUESTS',
                    'message'    => 'Trop de tentatives de connexion. Veuillez patienter 1 minute avant de réessayer.',
                    'error'      => 'Trop de tentatives de connexion. Veuillez patienter 1 minute avant de réessayer.',
                    'request_id' => $getReqId($request),
                ], 429);
            }
        });

        // 401 — Authentification requise
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) use ($getReqId) {
            \Illuminate\Support\Facades\Log::warning('401 Unauthenticated error', [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'auth_header' => $request->header('Authorization'),
                'token' => $request->bearerToken()
            ]);
            if ($request->is('api/*')) {
                return response()->json([
                    'status'     => 'error',
                    'code'       => 'UNAUTHENTICATED',
                    'message'    => 'Session expirée ou accès non autorisé. Veuillez vous re-connecter.',
                    'error'      => 'Session expirée ou accès non autorisé. Veuillez vous re-connecter.',
                    'request_id' => $getReqId($request),
                ], 401);
            }
        });

        $exceptions->render(function (\Symfony\Component\Routing\Exception\RouteNotFoundException $e, Request $request) use ($getReqId) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status'     => 'error',
                    'code'       => 'UNAUTHENTICATED',
                    'message'    => 'Session expirée ou non authentifié. Veuillez vous re-connecter.',
                    'error'      => 'Session expirée ou non authentifié. Veuillez vous re-connecter.',
                    'request_id' => $getReqId($request),
                ], 401);
            }
        });

        // 403 — Droits d'accès / Autorisation
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException $e, Request $request) use ($getReqId) {
            if ($request->is('api/*')) {
                $msg = $e->getMessage() ?: 'Accès refusé. Vous n\'avez pas les permissions requises.';
                return response()->json([
                    'status'     => 'error',
                    'code'       => 'FORBIDDEN',
                    'message'    => $msg,
                    'error'      => $msg,
                    'request_id' => $getReqId($request),
                ], 403);
            }
        });

        // 404 — Ressource introuvable
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, Request $request) use ($getReqId) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status'     => 'error',
                    'code'       => 'RESOURCE_NOT_FOUND',
                    'message'    => 'La ressource ou la page demandée est introuvable.',
                    'error'      => 'La ressource ou la page demandée est introuvable.',
                    'request_id' => $getReqId($request),
                ], 404);
            }
        });

        // 500 — Erreurs non gérées (masquage stack trace en production)
        $exceptions->render(function (\Throwable $e, Request $request) use ($getReqId) {
            if ($request->is('api/*') && !($e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface)) {
                $safeMsg = config('app.debug') ? $e->getMessage() : 'Une erreur interne s\'est produite sur le serveur.';
                return response()->json([
                    'status'     => 'error',
                    'code'       => 'INTERNAL_SERVER_ERROR',
                    'message'    => $safeMsg,
                    'error'      => $safeMsg,
                    'request_id' => $getReqId($request),
                ], 500);
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

                    $requestId = request()->attributes->get('request_id') ?? request()->header('X-Request-ID') ?? (app()->bound('request_id') ? app('request_id') : null);
                    $msgPrefix = $requestId ? "[ReqID: {$requestId}] " : '';

                    \App\Models\SystemErrorLog::create([
                        'company_id' => $tenantManager->getCompanyId() ?: ($user ? $user->company_id : null),
                        'branch_id' => $tenantManager->getBranchId() ?: ($user ? $user->branch_id : null),
                        'user_id' => $user ? $user->id : null,
                        'module' => class_basename($e),
                        'error_message' => $msgPrefix . (substr($e->getMessage(), 0, 950) ?: get_class($e)),
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
