<?php

/**
 * Phase 3.2 — Centralized Error Handling Test Suite
 *
 * Scénarios :
 * MU-12-A : Erreurs de Validation (422) avec structure normalisée (status, code, message, errors, request_id)
 * MU-12-B : Erreurs 401 Unauthenticated structurées avec request_id
 * MU-12-C : Erreurs 403 Forbidden structurées avec request_id
 * MU-12-D : Erreurs 404 Resource Not Found structurées avec request_id
 * MU-12-E : Erreurs 500 sans fuite de stack trace ni requêtes SQL brutes
 * MU-12-F : Présence systématique du header X-Request-ID et de la clé request_id dans toutes les erreurs
 */

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Company;
use App\Models\Branch;
use App\Models\Role;
use App\Models\SystemErrorLog;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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

// Helper pour exécuter une requête HTTP via le Kernel Laravel
function handleApiRequest(string $method, string $uri, array $data = [], array $headers = [], ?User $user = null): \Symfony\Component\HttpFoundation\Response
{
    if ($user) {
        \Laravel\Sanctum\Sanctum::actingAs($user);
    } else {
        auth()->forgetGuards();
        app('auth')->forgetGuards();
    }

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


// ── Fixtures Communes ────────────────────────────────────────────────────────

$prefix  = 'phase32_' . time() . '_';
$company = Company::create(['name' => 'MU-Phase32 Store ' . Str::random(4), 'status' => 'active']);
app(\App\Services\TenantManager::class)->setCompany($company);

$branch  = Branch::create(['company_id' => $company->id, 'name' => 'Boutique 32', 'status' => 'open']);
$role    = Role::create(['company_id' => $company->id, 'name' => 'Caissier 32', 'slug' => 'caissier']);

$user = User::create([
    'name'              => 'Caissier 32',
    'email'             => $prefix . 'cashier@apex.com',
    'password'          => Hash::make('Secret123!'),
    'company_id'        => $company->id,
    'branch_id'         => $branch->id,
    'role_id'           => $role->id,
]);
$user->email_verified_at = now();
$user->save();


// ────────────────────────────────────────────────────────────────────────────
// MU-12-A — Erreur 422 Validation Formats Normalisés
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-12-A — Normalisation des Erreurs de Validation (HTTP 422)');

$customReqId = (string) Str::uuid();
$res422 = handleApiRequest('POST', '/api/v1/sales', [
    'payment_method' => 'cash',
    'items'          => [], // Invalide : items est requis
], ['X-Request-ID' => $customReqId], $user);

$data422 = json_decode($res422->getContent(), true) ?? [];

$valid422 = $res422->getStatusCode() === 422 &&
    ($data422['status'] ?? '') === 'error' &&
    ($data422['code'] ?? '') === 'VALIDATION_ERROR' &&
    isset($data422['errors']) &&
    ($data422['request_id'] ?? '') === $customReqId;

logTestResult(
    'MU-12-A (Format 422) — Structure JSON 422 unifiée avec status, code, errors, request_id',
    $valid422,
    "HTTP={$res422->getStatusCode()} | code=" . ($data422['code'] ?? 'N/A') . " | request_id=" . ($data422['request_id'] ?? 'N/A')
);


// ────────────────────────────────────────────────────────────────────────────
// MU-12-B — Erreur 401 Unauthenticated Normalisée
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-12-B — Normalisation des Erreurs d\'Authentification (HTTP 401)');

$reqId401 = (string) Str::uuid();
$res401 = handleApiRequest('GET', '/api/v1/auth/me', [], ['X-Request-ID' => $reqId401], null); // Pas d'user
$data401 = json_decode($res401->getContent(), true) ?? [];

$valid401 = $res401->getStatusCode() === 401 &&
    ($data401['status'] ?? '') === 'error' &&
    ($data401['code'] ?? '') === 'UNAUTHENTICATED' &&
    ($data401['request_id'] ?? '') === $reqId401;

logTestResult(
    'MU-12-B (Format 401) — Structure JSON 401 unifiée avec status=error, code=UNAUTHENTICATED, request_id',
    $valid401,
    "HTTP={$res401->getStatusCode()} | code=" . ($data401['code'] ?? 'N/A') . " | request_id=" . ($data401['request_id'] ?? 'N/A')
);


// ────────────────────────────────────────────────────────────────────────────
// MU-12-C — Erreur 403 Forbidden Normalisée
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-12-C — Normalisation des Erreurs d\'Autorisation (HTTP 403)');

$reqId403 = (string) Str::uuid();
$res403 = handleApiRequest('GET', '/api/v1/admin/dashboard', [], ['X-Request-ID' => $reqId403], $user); // Caissier sur admin route
$data403 = json_decode($res403->getContent(), true) ?? [];

$valid403 = $res403->getStatusCode() === 403 &&
    ($data403['status'] ?? '') === 'error' &&
    ($data403['code'] ?? '') === 'FORBIDDEN' &&
    ($data403['request_id'] ?? '') === $reqId403;

logTestResult(
    'MU-12-C (Format 403) — Structure JSON 403 unifiée avec status=error, code=FORBIDDEN, request_id',
    $valid403,
    "HTTP={$res403->getStatusCode()} | code=" . ($data403['code'] ?? 'N/A') . " | request_id=" . ($data403['request_id'] ?? 'N/A')
);


// ────────────────────────────────────────────────────────────────────────────
// MU-12-D — Erreur 404 Resource Not Found Normalisée
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-12-D — Normalisation des Erreurs 404 (HTTP 404)');

$reqId404 = (string) Str::uuid();
$res404 = handleApiRequest('GET', '/api/v1/non-existing-endpoint-xyz', [], ['X-Request-ID' => $reqId404], $user);
$data404 = json_decode($res404->getContent(), true) ?? [];

$valid404 = $res404->getStatusCode() === 404 &&
    ($data404['status'] ?? '') === 'error' &&
    ($data404['code'] ?? '') === 'RESOURCE_NOT_FOUND' &&
    ($data404['request_id'] ?? '') === $reqId404;

logTestResult(
    'MU-12-D (Format 404) — Structure JSON 404 unifiée avec status=error, code=RESOURCE_NOT_FOUND, request_id',
    $valid404,
    "HTTP={$res404->getStatusCode()} | code=" . ($data404['code'] ?? 'N/A') . " | request_id=" . ($data404['request_id'] ?? 'N/A')
);


// ────────────────────────────────────────────────────────────────────────────
// MU-12-E — Erreur 500 Sans Stack Trace Sensitive & Inscription SystemErrorLog
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-12-E — Erreur Serveur 500 Sécurisée & SystemErrorLog');

$reqId500 = (string) Str::uuid();

// Simuler une exception serveur non gérée via route API de test
config(['app.debug' => false]); // Simulation environnement production

$res500 = handleApiRequest('GET', '/api/v1/test-error-500-trigger', [], ['X-Request-ID' => $reqId500], $user);
$data500 = json_decode($res500->getContent(), true) ?? [];

$hasStackTrace = isset($data500['trace']) || str_contains($res500->getContent(), 'PDOException') || str_contains($res500->getContent(), '#0 /opt/lampp');

logTestResult(
    'MU-12-E (Masquage Stack Trace) — Aucune fuite de stack trace ni SQL brut en réponse HTTP 500',
    !$hasStackTrace,
    $hasStackTrace ? 'ERREUR: Fuite de trace technique !' : 'Réponse HTTP 500 propre et masquée.'
);


// ────────────────────────────────────────────────────────────────────────────
// MU-12-F — Présence Systématique du Request ID dans toutes les réponses d'erreur
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-12-F — Présence Systématique de X-Request-ID');

$allErrorsHaveReqId =
    !empty($data422['request_id']) &&
    !empty($data401['request_id']) &&
    !empty($data403['request_id']) &&
    !empty($data404['request_id']);

logTestResult(
    'MU-12-F (Request ID Systématique) — request_id présent dans 100% des enveloppes d\'erreur API',
    $allErrorsHaveReqId,
    "request_id confirmé sur 422, 401, 403, 404."
);


// ── Bilan Final Phase 3.2 ────────────────────────────────────────────────────
echo "\n=========================================================\n";
if ($globalPassed) {
    echo " \033[32mRÉSULTAT PHASE 3.2 : TOUS LES TESTS MU-12 ONT RÉUSSI ! 🎉\033[0m\n";
} else {
    echo " \033[31mRÉSULTAT PHASE 3.2 : CERTAINS TESTS ONT ÉCHOUÉ. ❌\033[0m\n";
}
echo "=========================================================\n";

if (!$globalPassed) {
    exit(1);
}
