<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRoleMiddleware
{
    /**
     * Vérifie que l'utilisateur connecté possède l'un des rôles autorisés.
     *
     * Usage dans les routes : ->middleware('role:admin,gerant')
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  Liste des slugs de rôles autorisés (ex: 'admin', 'super-admin')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user('sanctum') ?: auth('sanctum')->user();

        $reqId = $request->attributes->get('request_id') ?? $request->header('X-Request-ID') ?? (app()->bound('request_id') ? app('request_id') : null);

        if (!$user) {
            $msg = 'Accès refusé. Authentification requise.';
            return response()->json([
                'status'     => 'error',
                'code'       => 'UNAUTHENTICATED',
                'message'    => $msg,
                'error'      => $msg,
                'request_id' => $reqId,
            ], 401);
        }

        $userRoleSlug = is_object($user->role) ? ($user->role->slug ?? '') : (string)$user->role;
        $userRoleName = is_object($user->role) ? ($user->role->name ?? '') : (string)$user->role;

        // Le super-admin (par slug de rôle ou adresse email) a toujours accès à toutes les routes
        if ($user->email === 'superadmin@dls.com' || in_array($userRoleSlug, ['super-admin', 'superadmin']) || in_array($userRoleName, ['super-admin', 'Super Admin', 'Super-Admin'])) {
            return $next($request);
        }

        // Vérifier que le rôle de l'utilisateur est dans la liste des rôles autorisés
        if (!in_array($userRoleSlug, $roles) && !in_array($userRoleName, $roles)) {
            $msg = 'Accès refusé. Vous ne disposez pas des droits suffisants pour effectuer cette action.';
            return response()->json([
                'status'         => 'error',
                'code'           => 'FORBIDDEN',
                'message'        => $msg,
                'error'          => $msg,
                'required_roles' => $roles,
                'your_role'      => $userRoleSlug,
                'request_id'     => $reqId,
            ], 403);
        }

        return $next($request);
    }
}
