<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        // Exempted: SuperAdmin account or global system admin
        if ($user->email === 'superadmin@dls.com' || ($user->role && $user->role->slug === 'super-admin')) {
            return $next($request);
        }

        // If email is not verified (email_verified_at is NULL)
        if ($user->email_verified_at === null) {
            // Allow access to essential auth routes (verify, resend, me, logout)
            $allowedRoutes = [
                'api/v1/auth/verify-email',
                'api/v1/auth/resend-verification-email',
                'api/v1/auth/logout',
                'api/v1/auth/me',
            ];

            if (in_array($request->path(), $allowedRoutes)) {
                return $next($request);
            }

            $reqId = $request->attributes->get('request_id') ?? $request->header('X-Request-ID') ?? (app()->bound('request_id') ? app('request_id') : null);
            $msg = 'Votre adresse e-mail doit être vérifiée pour accéder à cette fonctionnalité.';
            return response()->json([
                'status'         => 'error',
                'code'           => 'EMAIL_NOT_VERIFIED',
                'message'        => $msg,
                'error'          => $msg,
                'error_code'     => 'EMAIL_NOT_VERIFIED',
                'email_verified' => false,
                'email'          => $user->email,
                'request_id'     => $reqId,
            ], 403);
        }

        return $next($request);
    }
}
