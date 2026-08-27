<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(\App\Services\TenantManager::class, function ($app) {
            return new \App\Services\TenantManager();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Allow Sanctum to read token from query parameter (for SSE EventSource)
        \Laravel\Sanctum\Sanctum::getAccessTokenFromRequestUsing(function ($request) {
            return $request->bearerToken() ?: $request->query('token');
        });
    }
}
