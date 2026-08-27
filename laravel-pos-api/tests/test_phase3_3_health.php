<?php

/**
 * Phase 3.3 — Health Checks & Readiness Qualification Suite
 *
 * Scénarios :
 * MU-13-A : Liveness Check (GET /api/v1/health -> HTTP 200, status=ok, ISO timestamp, X-Request-ID)
 * MU-13-B : Transmission et propagation de X-Request-ID
 * MU-13-C : Readiness Nominale (GET /api/v1/ready -> HTTP 200, status=ready, database=ok, storage=ok)
 * MU-13-D : Simulation de défaillance BDD (HTTP 503, status=degraded, database=unavailable, 0 secret leak)
 * MU-13-E : Simulation de défaillance Storage (HTTP 503, status=degraded, storage=unavailable)
 * MU-13-F : Endpoints publics (Aucun token Sanctum, aucun tenant context requis)
 */

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$globalPassed = true;

function logTestHeader(string $title): void
{
    echo "\n=========================================================\n";
    echo "   {$title}\n";
    echo "=========================================================\n";
}

function logTestResult(string $testName, bool $passed, string $message = ''): void
{
    global $globalPassed;
    if ($passed) {
        echo "▶ {$testName}\n";
        echo "   \033[32m[PASS]\033[0m {$message}\n\n";
    } else {
        echo "▶ {$testName}\n";
        echo "   \033[31m[FAIL]\033[0m {$message}\n\n";
        $globalPassed = false;
    }
}

function handleApiRequest(string $method, string $uri, array $data = [], array $headers = []): \Symfony\Component\HttpFoundation\Response
{
    auth()->forgetGuards();
    app('auth')->forgetGuards();

    $req = Illuminate\Http\Request::create($uri, $method, $data);
    $req->headers->set('Accept', 'application/json');
    foreach ($headers as $k => $v) {
        $req->headers->set($k, $v);
    }

    $app = app();
    $middleware = new \App\Http\Middleware\CorrelationIdMiddleware();
    return $middleware->handle($req, function ($request) use ($app) {
        return $app->handle($request);
    });
}


// ────────────────────────────────────────────────────────────────────────────
// MU-13-A — Liveness Check (/health)
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-13-A — Liveness Check (GET /api/v1/health)');

$resHealth = handleApiRequest('GET', '/api/v1/health');
$dataHealth = json_decode($resHealth->getContent(), true) ?? [];
$headerReqId = $resHealth->headers->get('X-Request-ID');

$validHealth = $resHealth->getStatusCode() === 200 &&
    ($dataHealth['status'] ?? '') === 'ok' &&
    !empty($dataHealth['timestamp']) &&
    !empty($headerReqId);

logTestResult(
    'MU-13-A (Liveness Check) — HTTP 200, status=ok, timestamp ISO-8601 et header X-Request-ID',
    $validHealth,
    "HTTP={$resHealth->getStatusCode()} | status=" . ($dataHealth['status'] ?? 'N/A') . " | ReqID={$headerReqId}"
);


// ────────────────────────────────────────────────────────────────────────────
// MU-13-B — Request ID Propagé
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-13-B — Transmission & Propagation du X-Request-ID');

$customReqId = 'test-health-phase3-3';
$resPropagated = handleApiRequest('GET', '/api/v1/health', [], ['X-Request-ID' => $customReqId]);
$returnedHeader = $resPropagated->headers->get('X-Request-ID');

logTestResult(
    'MU-13-B (Propagated ReqID) — Le header X-Request-ID transmis est exactement restitué',
    $returnedHeader === $customReqId,
    "Transmis={$customReqId} | Restitué={$returnedHeader}"
);


// ────────────────────────────────────────────────────────────────────────────
// MU-13-C — Readiness Nominale (/ready)
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-13-C — Readiness Check Nominal (GET /api/v1/ready)');

$resReady = handleApiRequest('GET', '/api/v1/ready');
$dataReady = json_decode($resReady->getContent(), true) ?? [];

$validReady = $resReady->getStatusCode() === 200 &&
    ($dataReady['status'] ?? '') === 'ready' &&
    ($dataReady['checks']['database'] ?? '') === 'ok' &&
    ($dataReady['checks']['storage'] ?? '') === 'ok' &&
    !empty($dataReady['timestamp']);

logTestResult(
    'MU-13-C (Readiness Nominale) — HTTP 200, status=ready, database=ok, storage=ok',
    $validReady,
    "HTTP={$resReady->getStatusCode()} | status=" . ($dataReady['status'] ?? 'N/A') . " | db=" . ($dataReady['checks']['database'] ?? 'N/A') . " | storage=" . ($dataReady['checks']['storage'] ?? 'N/A')
);


// ────────────────────────────────────────────────────────────────────────────
// MU-13-D — Défaillance Database Simulée
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-13-D — Simulation de Défaillance Base de Données');

// Altération temporaire de la configuration DB pour simuler une indisponibilité
$origHost = config('database.connections.mysql.host');
config(['database.connections.mysql.host' => 'invalid_unreachable_host_123']);
DB::purge('mysql');

$resDbFail = handleApiRequest('GET', '/api/v1/ready');
$dataDbFail = json_decode($resDbFail->getContent(), true) ?? [];
$rawBodyFail = $resDbFail->getContent();

// Restauration immédiate de la BDD
config(['database.connections.mysql.host' => $origHost]);
DB::purge('mysql');
DB::reconnect('mysql');

$hasNoSecrets = !str_contains($rawBodyFail, 'invalid_unreachable_host') &&
    !str_contains($rawBodyFail, 'root') &&
    !str_contains($rawBodyFail, 'PDOException') &&
    !str_contains($rawBodyFail, 'password');

$validDbFail = $resDbFail->getStatusCode() === 503 &&
    ($dataDbFail['status'] ?? '') === 'degraded' &&
    ($dataDbFail['checks']['database'] ?? '') === 'unavailable' &&
    ($dataDbFail['checks']['storage'] ?? '') === 'ok' &&
    $hasNoSecrets;

logTestResult(
    'MU-13-D (Défaillance BDD) — HTTP 503, status=degraded, database=unavailable, aucun secret divulgué',
    $validDbFail,
    "HTTP={$resDbFail->getStatusCode()} | status=" . ($dataDbFail['status'] ?? 'N/A') . " | db=" . ($dataDbFail['checks']['database'] ?? 'N/A') . " | SecretsMasqués=" . ($hasNoSecrets ? 'OUI' : 'NON')
);


// ────────────────────────────────────────────────────────────────────────────
// MU-13-E — Défaillance Storage Simulée
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-13-E — Simulation de Défaillance Stockage');

$storagePath = storage_path('app');
@chmod($storagePath, 0555); // Mode lecture seule temporaire

$resStorageFail = handleApiRequest('GET', '/api/v1/ready');
$dataStorageFail = json_decode($resStorageFail->getContent(), true) ?? [];

@chmod($storagePath, 0775); // Restauration immédiate des permissions

$validStorageFail = $resStorageFail->getStatusCode() === 503 &&
    ($dataStorageFail['status'] ?? '') === 'degraded' &&
    ($dataStorageFail['checks']['storage'] ?? '') === 'unavailable';

logTestResult(
    'MU-13-E (Défaillance Storage) — HTTP 503, status=degraded, storage=unavailable',
    $validStorageFail,
    "HTTP={$resStorageFail->getStatusCode()} | status=" . ($dataStorageFail['status'] ?? 'N/A') . " | storage=" . ($dataStorageFail['checks']['storage'] ?? 'N/A')
);


// ────────────────────────────────────────────────────────────────────────────
// MU-13-F — Endpoints Publics (Aucun token / Aucune entreprise)
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-13-F — Accessible Sans Authentification Ni Tenant Context');

$resPublicHealth = handleApiRequest('GET', '/api/v1/health');
$resPublicReady  = handleApiRequest('GET', '/api/v1/ready');

$isPublicOk = $resPublicHealth->getStatusCode() === 200 && $resPublicReady->getStatusCode() === 200;

logTestResult(
    'MU-13-F (Endpoints Publics) — Accessible sans token Sanctum ni headers de tenant',
    $isPublicOk,
    "Health HTTP={$resPublicHealth->getStatusCode()} | Ready HTTP={$resPublicReady->getStatusCode()}"
);


// ── Bilan Final Phase 3.3 ────────────────────────────────────────────────────
echo "\n=========================================================\n";
if ($globalPassed) {
    echo " \033[32mRÉSULTAT PHASE 3.3 : TOUS LES TESTS MU-13 ONT RÉUSSI ! 🎉\033[0m\n";
} else {
    echo " \033[31mRÉSULTAT PHASE 3.3 : CERTAINS TESTS ONT ÉCHOUÉ. ❌\033[0m\n";
}
echo "=========================================================\n";

if (!$globalPassed) {
    exit(1);
}
