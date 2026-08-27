<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HealthCheckController extends Controller
{
    /**
     * Liveness Check (Public, light, HTTP 200).
     */
    public function liveness(Request $request)
    {
        return response()->json([
            'status'    => 'ok',
            'timestamp' => now()->toIso8601String(),
        ], 200);
    }

    /**
     * Readiness Check (Public, verifies DB and storage, HTTP 200 or 503).
     */
    public function readiness(Request $request)
    {
        $reqId = $request->attributes->get('request_id')
            ?? $request->header('X-Request-ID')
            ?? (app()->bound('request_id') ? app('request_id') : null);

        $dbStatus = 'ok';
        $storageStatus = 'ok';
        $isDegraded = false;

        // 1. Check DB Connection
        try {
            DB::connection()->getPdo();
        } catch (\Throwable $e) {
            $dbStatus = 'unavailable';
            $isDegraded = true;
            Log::error("[HealthCheck] DB Unavailable: " . $e->getMessage());
        }

        // 2. Check Storage Writability
        try {
            $testFile = storage_path('app/health_readiness_check.tmp');
            $writeResult = @file_put_contents($testFile, 'ready');
            if ($writeResult === false) {
                $storageStatus = 'unavailable';
                $isDegraded = true;
            } else {
                @unlink($testFile);
            }
        } catch (\Throwable $e) {
            $storageStatus = 'unavailable';
            $isDegraded = true;
            Log::error("[HealthCheck] Storage Unavailable: " . $e->getMessage());
        }

        if ($isDegraded) {
            return response()->json([
                'status'     => 'degraded',
                'checks'     => [
                    'database' => $dbStatus,
                    'storage'  => $storageStatus,
                ],
                'timestamp'  => now()->toIso8601String(),
                'request_id' => $reqId,
            ], 503);
        }

        return response()->json([
            'status'    => 'ready',
            'checks'    => [
                'database' => 'ok',
                'storage'  => 'ok',
            ],
            'timestamp' => now()->toIso8601String(),
        ], 200);
    }
}
