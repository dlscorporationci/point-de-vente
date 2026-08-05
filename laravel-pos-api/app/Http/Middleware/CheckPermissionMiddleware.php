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
     * Usage: ->middleware('permission:sales.discount') or ->middleware('permission:stock.adjust')
     */
    public function handle(Request $request, Closure $next, string $permissionSlug): Response
    {
        $user = $request->user('sanctum') ?: auth('sanctum')->user();
        if (!$user) {
            return response()->json(['error' => 'Accès non authentifié.'], 401);
        }

        if ($this->authService->isSuperAdmin($user)) {
            return $next($request);
        }

        if (!$this->authService->hasPermission($user, $permissionSlug)) {
            return response()->json([
                'error' => "Accès refusé. La permission granulaire '{$permissionSlug}' est obligatoire pour effectuer cette action.",
                'required_permission' => $permissionSlug
            ], 403);
        }

        return $next($request);
    }
}
