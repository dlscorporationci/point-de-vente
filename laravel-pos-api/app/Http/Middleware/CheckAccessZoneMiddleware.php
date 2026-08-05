<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\AuthorizationService;

class CheckAccessZoneMiddleware
{
    protected AuthorizationService $authService;

    public function __construct(AuthorizationService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Handle an incoming request.
     * Usage: ->middleware('access.zone:pos') or ->middleware('access.zone:stocks')
     */
    public function handle(Request $request, Closure $next, string $moduleKey): Response
    {
        $user = $request->user('sanctum') ?: auth('sanctum')->user();
        if (!$user) {
            return response()->json(['error' => 'Accès non authentifié.'], 401);
        }

        // Branch check from header or body
        $branchId = $request->header('X-Branch-ID') ?: $request->input('branch_id');

        $evaluation = $this->authService->authorize($user, $moduleKey, null, $branchId);
        if (!$evaluation['allowed']) {
            return response()->json(['error' => $evaluation['message']], $evaluation['code']);
        }

        return $next($request);
    }
}
