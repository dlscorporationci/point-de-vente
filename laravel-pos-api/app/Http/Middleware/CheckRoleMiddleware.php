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

        if (!$user || !$user->role) {
            return response()->json([
                'error' => 'Accès refusé. Authentification requise.'
            ], 401);
        }

        // Le super-admin a toujours accès à toutes les routes
        if ($user->role->slug === 'super-admin') {
            return $next($request);
        }

        // Vérifier que le rôle de l'utilisateur est dans la liste des rôles autorisés
        if (!in_array($user->role->slug, $roles)) {
            return response()->json([
                'error' => 'Accès refusé. Vous ne disposez pas des droits suffisants pour effectuer cette action.',
                'required_roles' => $roles,
                'your_role' => $user->role->slug,
            ], 403);
        }

        return $next($request);
    }
}
