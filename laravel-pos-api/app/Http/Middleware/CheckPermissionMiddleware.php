<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\AuthorizationService;

class CheckPermissionMiddleware
{
    protected AuthorizationService $authService;

    public function __construct(AuthorizationService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $permissionSlug): Response
    {
        $user = $request->user('sanctum') ?: auth('sanctum')->user();
        $reqId = $request->attributes->get('request_id') ?? $request->header('X-Request-ID') ?? (app()->bound('request_id') ? app('request_id') : null);

        if (!$user) {
            $msg = 'Accès non authentifié.';
            return response()->json([
                'status'     => 'error',
                'code'       => 'UNAUTHENTICATED',
                'message'    => $msg,
                'error'      => $msg,
                'request_id' => $reqId,
            ], 401);
        }

        if ($this->authService->isSuperAdmin($user)) {
            return $next($request);
        }

        if (!$this->authService->hasPermission($user, $permissionSlug)) {
            $msg = "Accès refusé. La permission granulaire '{$permissionSlug}' est obligatoire pour effectuer cette action.";
            return response()->json([
                'status'              => 'error',
                'code'                => 'FORBIDDEN',
                'message'             => $msg,
                'error'               => $msg,
                'required_permission' => $permissionSlug,
                'request_id'          => $reqId,
            ], 403);
        }

        return $next($request);
    }
}
