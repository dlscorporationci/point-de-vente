<?php

/**
 * Phase 3.6 — Real HTTP Load & Performance Qualification Suite
 *
 * Exécute de véritables requêtes HTTP simultanées via curl_multi_exec()
 * sur le serveur HTTP http://127.0.0.1:8000.
 */

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Company;
use App\Models\Branch;
use App\Models\Product;
use App\Models\Category;
use App\Models\BranchProduct;
use App\Models\CashSession;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

$globalPassed = true;
$baseUrl = 'http://127.0.0.1:8080/api/v1';

// S'assurer que le serveur HTTP est actif sur port 8000
$serverCheck = @fsockopen('127.0.0.1', 8000);
if (!$serverCheck) {
    echo "▶ Démarrage du serveur HTTP (http://127.0.0.1:8000)...\n";
    exec('php artisan serve --host=127.0.0.1 --port=8000 > /dev/null 2>&1 &');
    sleep(2);
} else {
    fclose($serverCheck);
}

function logSectionHeader(string $title): void
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

function calculatePercentile(array $sortedValues, float $percentile): float
{
    $count = count($sortedValues);
    if ($count === 0) return 0.0;
    if ($count === 1) return (float) $sortedValues[0];
    
    $index = (int) floor(($count - 1) * ($percentile / 100.0));
    return (float) $sortedValues[$index];
}

/**
 * Moteur générique de charge HTTP via curl_multi_exec()
 */
function runConcurrentRequests(array $requestConfigs, int $concurrencyLimit = 50): array
{
    $mh = curl_multi_init();
    $curly = [];
    $results = [];
    $startTimeAll = microtime(true);

    $totalRequests = count($requestConfigs);
    $activeIndices = range(0, $totalRequests - 1);
    
    $inFlight = [];

    // Lancer les requêtes par vagues d'au plus $concurrencyLimit
    while (!empty($activeIndices) || !empty($inFlight)) {
        while (count($inFlight) < $concurrencyLimit && !empty($activeIndices)) {
            $idx = array_shift($activeIndices);
            $cfg = $requestConfigs[$idx];

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $cfg['url']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HEADER, true);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $cfg['method']);

            $headers = $cfg['headers'] ?? [];
            $headers[] = 'Accept: application/json';
            if (!empty($cfg['body'])) {
                $headers[] = 'Content-Type: application/json';
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($cfg['body']));
            }
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

            // Horodatage précis du départ
            $cfg['_start_time'] = microtime(true);
            $cfg['_ch'] = $ch;
            $cfg['_idx'] = $idx;

            curl_multi_add_handle($mh, $ch);
            $inFlight[(int)$ch] = $cfg;
        }

        // Exécuter les requêtes en cours
        do {
            $mrc = curl_multi_exec($mh, $active);
        } while ($active && $mrc == CURLM_OK);

        while ($active && $mrc == CURLM_OK) {
            if (curl_multi_select($mh, 0.05) === -1) {
                usleep(5000);
            }
            do {
                $mrc = curl_multi_exec($mh, $active);
            } while ($active && $mrc == CURLM_OK);
        }

        // Récupérer les requêtes terminées
        while ($done = curl_multi_info_read($mh)) {
            $ch = $done['handle'];
            $cfg = $inFlight[(int)$ch];
            unset($inFlight[(int)$ch]);

            $endTime = microtime(true);
            $latencyMs = ($endTime - $cfg['_start_time']) * 1000.0;

            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
            $rawResponse = curl_multi_getcontent($ch);
            $curlError = curl_error($ch);

            $rawHeaders = substr($rawResponse, 0, $headerSize);
            $body = substr($rawResponse, $headerSize);

            // Parser X-Request-ID
            $reqId = '';
            if (preg_match('/X-Request-ID:\s*([^\r\n]+)/i', $rawHeaders, $matches)) {
                $reqId = trim($matches[1]);
            }

            $jsonBody = json_decode($body, true) ?? [];

            $results[$cfg['_idx']] = [
                'request_number' => $cfg['_idx'] + 1,
                'method'         => $cfg['method'],
                'url'            => $cfg['url'],
                'http_status'    => $httpCode,
                'success'        => ($httpCode >= 200 && $httpCode < 300),
                'curl_error'     => $curlError,
                'latency_ms'     => $latencyMs,
                'request_id'     => $reqId,
                'json'           => $jsonBody,
                'raw_body'       => $body,
            ];

            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);
        }
    }

    curl_multi_close($mh);
    $totalDuration = microtime(true) - $startTimeAll;

    // Calcul des statistiques
    ksort($results);
    $latencies = array_column($results, 'latency_ms');
    sort($latencies);

    $http2xx = 0; $http4xx = 0; $http5xx = 0; $netErr = 0; $successCount = 0;
    foreach ($results as $res) {
        if ($res['success']) $successCount++;
        if ($res['http_status'] >= 200 && $res['http_status'] < 300) $http2xx++;
        elseif ($res['http_status'] >= 400 && $res['http_status'] < 500) $http4xx++;
        elseif ($res['http_status'] >= 500) $http5xx++;
        else $netErr++;
    }

    return [
        'total_requests' => $totalRequests,
        'success_count'  => $successCount,
        'failed_count'   => $totalRequests - $successCount,
        'success_rate'   => $totalRequests > 0 ? round(($successCount / $totalRequests) * 100, 2) : 0,
        'http_2xx'       => $http2xx,
        'http_4xx'       => $http4xx,
        'http_5xx'       => $http5xx,
        'net_errors'     => $netErr,
        'latency_min'    => round(min($latencies), 2),
        'latency_avg'    => round(array_sum($latencies) / count($latencies), 2),
        'latency_max'    => round(max($latencies), 2),
        'latency_p50'    => round(calculatePercentile($latencies, 50), 2),
        'latency_p95'    => round(calculatePercentile($latencies, 95), 2),
        'latency_p99'    => round(calculatePercentile($latencies, 99), 2),
        'total_duration' => round($totalDuration, 3),
        'throughput'     => $totalDuration > 0 ? round($successCount / $totalDuration, 2) : 0,
        'results'        => $results,
    ];
}

function printStatsSummary(string $title, array $stats, bool $dataIntegrityPass): void
{
    global $globalPassed;
    echo "\n=========================================================\n";
    echo "   {$title}\n";
    echo "=========================================================\n";
    echo "Total Requests : {$stats['total_requests']}\n";
    echo "Success        : {$stats['success_count']}\n";
    echo "Failed         : {$stats['failed_count']}\n";
    echo "Success Rate   : {$stats['success_rate']}%\n\n";
    echo "HTTP 2xx       : {$stats['http_2xx']}\n";
    echo "HTTP 4xx       : {$stats['http_4xx']}\n";
    echo "HTTP 5xx       : {$stats['http_5xx']}\n";
    echo "Network Errors : {$stats['net_errors']}\n\n";
    echo "Latency Min    : {$stats['latency_min']} ms\n";
    echo "Latency Avg    : {$stats['latency_avg']} ms\n";
    echo "Latency P50    : {$stats['latency_p50']} ms\n";
    echo "Latency P95    : {$stats['latency_p95']} ms\n";
    echo "Latency P99    : {$stats['latency_p99']} ms\n";
    echo "Latency Max    : {$stats['latency_max']} ms\n\n";
    echo "Total Duration : {$stats['total_duration']} s\n";
    echo "Throughput     : {$stats['throughput']} req/sec\n\n";
    echo "Data Integrity :\n";

    if ($stats['success_rate'] === 100.0 && $dataIntegrityPass) {
        echo "   \033[32m[PASS]\033[0m Intégrité transactionnelle & performances validées.\n";
    } else {
        echo "   \033[31m[FAIL]\033[0m Taux de succès ou intégrité non satisfaits.\n";
        $globalPassed = false;
    }
}


// ── Fixtures Communes ────────────────────────────────────────────────────────

$prefix  = 'phase36_' . time() . '_';

$company = Company::create(['name' => 'MU-Phase36 Enterprise ' . Str::random(4), 'status' => 'active']);
app(\App\Services\TenantManager::class)->setCompany($company);

$branch  = Branch::create(['company_id' => $company->id, 'name' => 'Boutique Performance 36', 'status' => 'open']);
$role    = \App\Models\Role::create(['company_id' => $company->id, 'name' => 'Admin', 'slug' => 'admin']);

$user = User::create([
    'name'              => 'Admin 36',
    'email'             => $prefix . 'admin@apex.com',
    'password'          => Hash::make('Secret123!'),
    'company_id'        => $company->id,
    'branch_id'         => $branch->id,
    'role_id'           => $role->id,
]);
$user->email_verified_at = now();
$user->save();

// Token Sanctum pour les requêtes HTTP
$token = $user->createToken('load-test-token')->plainTextToken;
$authHeader = 'Authorization: Bearer ' . $token;
$tenantHeaders = [
    $authHeader,
    'X-Company-ID: ' . $company->id,
    'X-Branch-ID: ' . $branch->id,
];

$category = Category::create(['company_id' => $company->id, 'name' => 'Cat Load 36']);
$product  = Product::create([
    'company_id'    => $company->id,
    'category_id'   => $category->id,
    'name'          => 'Produit Charge HTTP 36',
    'sku'           => 'LOAD36-' . Str::random(5),
    'selling_price' => 2500,
    'cost_price'    => 1500,
]);

// Stock élevé (1000 unités) pour éviter rupture sous charge
$branchProduct = BranchProduct::create([
    'branch_id'  => $branch->id,
    'product_id' => $product->id,
    'quantity'   => 1000,
    'is_active'  => true,
]);

CashSession::create([
    'company_id'      => $company->id,
    'branch_id'       => $branch->id,
    'user_id'         => $user->id,
    'opening_balance' => 50000,
    'opened_at'       => now(),
    'status'          => 'open',
]);


// ────────────────────────────────────────────────────────────────────────────
// MU-16-A — Charge HTTP POST /sales (10 & 25 concurrents)
// ────────────────────────────────────────────────────────────────────────────
$stockBeforeA = BranchProduct::where('id', $branchProduct->id)->value('quantity');

// Scenario A1: 10 Ventes
$reqsA1 = [];
for ($i = 0; $i < 10; $i++) {
    $reqsA1[] = [
        'method'  => 'POST',
        'url'     => $baseUrl . '/sales',
        'headers' => array_merge($tenantHeaders, ['X-Request-ID: req-sales-a1-' . $i]),
        'body'    => [
            'idempotency_key' => (string) Str::uuid(),
            'payment_method'  => 'cash',
            'items'           => [['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 2500]],
        ],
    ];
}

$statsA1 = runConcurrentRequests($reqsA1, 10);
$stockAfterA1 = BranchProduct::where('id', $branchProduct->id)->value('quantity');
$integrityA1  = ($stockAfterA1 == ($stockBeforeA - 10));
printStatsSummary('MU-16-A — POST /sales — 10 Concurrent Requests', $statsA1, $integrityA1);

// Scenario A2: 25 Ventes
$reqsA2 = [];
for ($i = 0; $i < 25; $i++) {
    $reqsA2[] = [
        'method'  => 'POST',
        'url'     => $baseUrl . '/sales',
        'headers' => array_merge($tenantHeaders, ['X-Request-ID: req-sales-a2-' . $i]),
        'body'    => [
            'idempotency_key' => (string) Str::uuid(),
            'payment_method'  => 'cash',
            'items'           => [['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 2500]],
        ],
    ];
}

$statsA2 = runConcurrentRequests($reqsA2, 25);
$stockAfterA2 = BranchProduct::where('id', $branchProduct->id)->value('quantity');
$integrityA2  = ($stockAfterA2 == ($stockAfterA1 - 25));
printStatsSummary('MU-16-A — POST /sales — 25 Concurrent Requests', $statsA2, $integrityA2);


// ────────────────────────────────────────────────────────────────────────────
// MU-16-B — Charge HTTP POST /sync/push (10 & 25 concurrents)
// ────────────────────────────────────────────────────────────────────────────
$stockBeforeB = BranchProduct::where('id', $branchProduct->id)->value('quantity');

// Scenario B1: 10 PUSH
$reqsB1 = [];
for ($i = 0; $i < 10; $i++) {
    $reqsB1[] = [
        'method'  => 'POST',
        'url'     => $baseUrl . '/sync/push',
        'headers' => array_merge($tenantHeaders, ['X-Request-ID: req-push-b1-' . $i]),
        'body'    => [
            'operations' => [[
                'uuid'        => (string) Str::uuid(),
                'entity_type' => 'sale',
                'action'      => 'create',
                'created_at'  => now()->toIso8601String(),
                'payload'     => [
                    'items'          => [['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 2500]],
                    'payment_method' => 'cash',
                ],
            ]],
        ],
    ];
}

$statsB1 = runConcurrentRequests($reqsB1, 10);
$stockAfterB1 = BranchProduct::where('id', $branchProduct->id)->value('quantity');
$integrityB1  = ($stockAfterB1 == ($stockBeforeB - 10));
printStatsSummary('MU-16-B — POST /sync/push — 10 Concurrent Requests', $statsB1, $integrityB1);

// Scenario B2: 25 PUSH
$reqsB2 = [];
for ($i = 0; $i < 25; $i++) {
    $reqsB2[] = [
        'method'  => 'POST',
        'url'     => $baseUrl . '/sync/push',
        'headers' => array_merge($tenantHeaders, ['X-Request-ID: req-push-b2-' . $i]),
        'body'    => [
            'operations' => [[
                'uuid'        => (string) Str::uuid(),
                'entity_type' => 'sale',
                'action'      => 'create',
                'created_at'  => now()->toIso8601String(),
                'payload'     => [
                    'items'          => [['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 2500]],
                    'payment_method' => 'cash',
                ],
            ]],
        ],
    ];
}

$statsB2 = runConcurrentRequests($reqsB2, 25);
$stockAfterB2 = BranchProduct::where('id', $branchProduct->id)->value('quantity');
$integrityB2  = ($stockAfterB2 == ($stockAfterB1 - 25));
printStatsSummary('MU-16-B — POST /sync/push — 25 Concurrent Requests', $statsB2, $integrityB2);


// ────────────────────────────────────────────────────────────────────────────
// MU-16-C — Charge HTTP GET /sync/pull (25 & 50 concurrents)
// ────────────────────────────────────────────────────────────────────────────
$reqsC1 = [];
for ($i = 0; $i < 25; $i++) {
    $reqsC1[] = [
        'method'  => 'GET',
        'url'     => $baseUrl . '/sync/pull',
        'headers' => array_merge($tenantHeaders, ['X-Request-ID: req-pull-c1-' . $i]),
    ];
}
$statsC1 = runConcurrentRequests($reqsC1, 25);
printStatsSummary('MU-16-C — GET /sync/pull — 25 Concurrent Requests', $statsC1, true);

$reqsC2 = [];
for ($i = 0; $i < 50; $i++) {
    $reqsC2[] = [
        'method'  => 'GET',
        'url'     => $baseUrl . '/sync/pull',
        'headers' => array_merge($tenantHeaders, ['X-Request-ID: req-pull-c2-' . $i]),
    ];
}
$statsC2 = runConcurrentRequests($reqsC2, 50);
printStatsSummary('MU-16-C — GET /sync/pull — 50 Concurrent Requests', $statsC2, true);


// ────────────────────────────────────────────────────────────────────────────
// MU-16-D — Charge HTTP GET /reports/summary (25 concurrents)
// ────────────────────────────────────────────────────────────────────────────
$reqsD = [];
for ($i = 0; $i < 25; $i++) {
    $reqsD[] = [
        'method'  => 'GET',
        'url'     => $baseUrl . '/reports/summary',
        'headers' => array_merge($tenantHeaders, ['X-Request-ID: req-reports-d-' . $i]),
    ];
}
$statsD = runConcurrentRequests($reqsD, 25);
printStatsSummary('MU-16-D — GET /reports/summary — 25 Concurrent Requests', $statsD, true);


// ────────────────────────────────────────────────────────────────────────────
// MU-16-E — Test Mixte (50 requêtes combinées)
// ────────────────────────────────────────────────────────────────────────────
$stockBeforeE = BranchProduct::where('id', $branchProduct->id)->value('quantity');

$reqsE = [];
for ($i = 0; $i < 10; $i++) {
    $reqsE[] = [
        'method'  => 'POST',
        'url'     => $baseUrl . '/sales',
        'headers' => array_merge($tenantHeaders, ['X-Request-ID: req-mix-sales-' . $i]),
        'body'    => [
            'idempotency_key' => (string) Str::uuid(),
            'payment_method'  => 'cash',
            'items'           => [['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 2500]],
        ],
    ];
}
for ($i = 0; $i < 10; $i++) {
    $reqsE[] = [
        'method'  => 'POST',
        'url'     => $baseUrl . '/sync/push',
        'headers' => array_merge($tenantHeaders, ['X-Request-ID: req-mix-push-' . $i]),
        'body'    => [
            'operations' => [[
                'uuid'        => (string) Str::uuid(),
                'entity_type' => 'sale',
                'action'      => 'create',
                'created_at'  => now()->toIso8601String(),
                'payload'     => [
                    'items'          => [['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 2500]],
                    'payment_method' => 'cash',
                ],
            ]],
        ],
    ];
}
for ($i = 0; $i < 20; $i++) {
    $reqsE[] = [
        'method'  => 'GET',
        'url'     => $baseUrl . '/sync/pull',
        'headers' => array_merge($tenantHeaders, ['X-Request-ID: req-mix-pull-' . $i]),
    ];
}
for ($i = 0; $i < 10; $i++) {
    $reqsE[] = [
        'method'  => 'GET',
        'url'     => $baseUrl . '/reports/summary',
        'headers' => array_merge($tenantHeaders, ['X-Request-ID: req-mix-reports-' . $i]),
    ];
}

// Mélanger aléatoirement les 50 requêtes mixtes
shuffle($reqsE);
$statsE = runConcurrentRequests($reqsE, 50);

$stockAfterE = BranchProduct::where('id', $branchProduct->id)->value('quantity');
$integrityE  = ($stockAfterE == ($stockBeforeE - 20)); // 10 sales + 10 pushes = 20 décrémentations
printStatsSummary('MU-16-E — Mixed Load (50 Concurrent Combined Requests)', $statsE, $integrityE);


// ────────────────────────────────────────────────────────────────────────────
// MU-16-F — Observabilité & Sécurité sous charge
// ────────────────────────────────────────────────────────────────────────────
logSectionHeader('MU-16-F — Observabilité & Sécurité sous Charge');

$allHeadersHaveReqId = true;
$noSecretsExposed    = true;

foreach ([$statsA1, $statsA2, $statsB1, $statsB2, $statsC1, $statsC2, $statsD, $statsE] as $statGroup) {
    foreach ($statGroup['results'] as $res) {
        if (empty($res['request_id'])) {
            $allHeadersHaveReqId = false;
        }
        $raw = $res['raw_body'];
        if (str_contains($raw, 'password') || str_contains($raw, 'Secret123!') || str_contains($raw, 'remember_token')) {
            $noSecretsExposed = false;
        }
    }
}

logTestResult(
    'MU-16-F (X-Request-ID sous charge) — Header X-Request-ID présent sur 100% des réponses HTTP sous charge',
    $allHeadersHaveReqId,
    "Présence X-Request-ID confirmée sur l'ensemble des réponses d'échantillon."
);

logTestResult(
    'MU-16-F (Zéro secret exposé) — Aucun mot de passe, secret ou token exposé dans les corps de réponse',
    $noSecretsExposed,
    "Vérification de sécurité masquage des secrets validée."
);


// ── Bilan Final Phase 3.6 ────────────────────────────────────────────────────
echo "\n=========================================================\n";
if ($globalPassed) {
    echo " \033[32mRÉSULTAT PHASE 3.6 : TOUS LES TESTS DE CHARGE HTTP REELLE MU-16 ONT RÉUSSI ! 🎉\033[0m\n";
} else {
    echo " \033[31mRÉSULTAT PHASE 3.6 : CERTAINS TESTS DE CHARGE ONT ÉCHOUÉ. ❌\033[0m\n";
}
echo "=========================================================\n";

if (!$globalPassed) {
    exit(1);
}
