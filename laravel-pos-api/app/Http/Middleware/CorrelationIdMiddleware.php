<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class CorrelationIdMiddleware
{
    /**
     * Handle an incoming request and ensure X-Request-ID header/attribute is set.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $incomingRequestId = $request->header('X-Request-ID');

        if ($incomingRequestId && is_string($incomingRequestId) && preg_match('/^[a-zA-Z0-9\-]{1,64}$/', $incomingRequestId)) {
            $requestId = $incomingRequestId;
        } else {
            $requestId = (string) Str::uuid();
        }

        $request->headers->set('X-Request-ID', $requestId);
        $request->attributes->set('request_id', $requestId);
        app()->instance('request_id', $requestId);

        $response = $next($request);

        $response->headers->set('X-Request-ID', $requestId);

        return $response;
    }
}
