<?php

/**
 * Phase 3.8 — Capacity & Scalability Qualification Suite
 *
 * Qualification de capacité SaaS et de montée en charge jusqu'à 500 requêtes simultanées
 * sur le stack de production Nginx + PHP-FPM (50 Workers).
 *
 * Paliers de charge :
 * - Palier 1 :  50 requêtes simultanées
 * - Palier 2 : 100 requêtes simultanées
 * - Palier 3 : 200 requêtes simultanées
 * - Palier 4 : 500 requêtes simultanées
 *
 * Mix de charge réaliste SaaS Multi-Tenant :
 * - 20% POST /sales (Ventes directes en caisse)
 * - 20% POST /sync/push (PUSH synchronisation hors-ligne)
 * - 40% GET /sync/pull (PULL synchronisation de fond)
 * - 20% GET /reports/summary (Consultations de rapports & tableaux de bord)
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

function printScalabilityHeader(string $title): void
{
    echo "\n=========================================================\n";
    echo "   {$title}\n";
    echo "=========================================================\n";
}

function calculateScalabilityPercentile(array $sortedValues, float $percentile): float
{
    $count = count($sortedValues);
    if ($count === 0) return 0.0;
    if ($count === 1) return (float) $sortedValues[0];
    
    $index = (int) floor(($count - 1) * ($percentile / 100.0));
    return (float) $sortedValues[$index];
}

/**
 * Moteur de charge scalable via cURL multi-exec avec contrôle du niveau de concurrence.
 */
function runScalabilityBatch(array $requestConfigs, int $concurrencyLimit): array
{
    $mh = curl_multi_init();
    $results = [];
    $startTimeAll = microtime(true);

    $totalRequests = count($requestConfigs);
    $activeIndices = range(0, $totalRequests - 1);
    $inFlight = [];

    while (!empty($activeIndices) || !empty($inFlight)) {
        while (count($inFlight) < $concurrencyLimit && !empty($activeIndices)) {
            $idx = array_shift($activeIndices);
            $cfg = $requestConfigs[$idx];

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $cfg['url']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HEADER, true);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $cfg['method']);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
            curl_setopt($ch, CURLOPT_TIMEOUT, 60);

            $headers = $cfg['headers'] ?? [];
            $headers[] = 'Accept: application/json';
            if (!empty($cfg['body'])) {
                $headers[] = 'Content-Type: application/json';
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($cfg['body']));
            }
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

            $cfg['_start_time'] = microtime(true);
            $cfg['_ch'] = $ch;
            $cfg['_idx'] = $idx;

            curl_multi_add_handle($mh, $ch);
            $inFlight[(int)$ch] = $cfg;
        }

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
            ];

            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);
        }
    }

    curl_multi_close($mh);
    $totalDuration = microtime(true) - $startTimeAll;

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
        'concurrency'    => $concurrencyLimit,
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
        'latency_p50'    => round(calculateScalabilityPercentile($latencies, 50), 2),
        'latency_p95'    => round(calculateScalabilityPercentile($latencies, 95), 2),
        'latency_p99'    => round(calculateScalabilityPercentile($latencies, 99), 2),
        'total_duration' => round($totalDuration, 3),
        'throughput'     => $totalDuration > 0 ? round($successCount / $totalDuration, 2) : 0,
        'results'        => $results,
    ];
}


// ── Création de Multiples Entreprises et Boutiques (Contexte Multi-Tenant SaaS) ──

$companies = [];
$users = [];
$tokens = [];
$products = [];
$branchProducts = [];

for ($c = 1; $c <= 3; $c++) {
    $comp = Company::create(['name' => "SaaS Company {$c} " . Str::random(4), 'status' => 'active']);
    app(\App\Services\TenantManager::class)->setCompany($comp);

    $br = Branch::create(['company_id' => $comp->id, 'name' => "Boutique {$c}", 'status' => 'open']);
    $r  = \App\Models\Role::create(['company_id' => $comp->id, 'name' => 'Admin', 'slug' => 'admin']);

    $u = User::create([
        'name'              => "Admin Company {$c}",
        'email'             => "phase38_c{$c}_" . time() . "@apex.com",
        'password'          => Hash::make('Secret123!'),
        'company_id'        => $comp->id,
        'branch_id'         => $br->id,
        'role_id'           => $r->id,
    ]);
    $u->email_verified_at = now();
    $u->save();

    $tk = $u->createToken("saas-token-{$c}")->plainTextToken;

    $cat = Category::create(['company_id' => $comp->id, 'name' => "Cat {$c}"]);
    $p = Product::create([
        'company_id'    => $comp->id,
        'category_id'   => $cat->id,
        'name'          => "Produit Stock SaaS {$c}",
        'sku'           => "SAAS{$c}-" . Str::random(5),
        'selling_price' => 4000,
        'cost_price'    => 2500,
    ]);

    $bp = BranchProduct::create([
        'branch_id'  => $br->id,
        'product_id' => $p->id,
        'quantity'   => 10000, // Stock suffisant pour absorber les 500 ventes du test
        'is_active'  => true,
    ]);

    CashSession::create([
        'company_id'      => $comp->id,
        'branch_id'       => $br->id,
        'user_id'         => $u->id,
        'opening_balance' => 100000,
        'opened_at'       => now(),
        'status'          => 'open',
    ]);

    $companies[] = $comp;
    $users[] = $u;
    $tokens[] = $tk;
    $products[] = $p;
    $branchProducts[] = $bp;
}

/**
 * Génère le mix de requêtes concourantes pour un nombre total de requêtes donné.
 */
function buildScalabilityRequests(int $totalRequests, array $companies, array $users, array $tokens, array $products, string $baseUrl): array
{
    $requests = [];
    
    // Proportion : 20% Sales, 20% Push, 40% Pull, 20% Reports
    $numSales   = (int) round($totalRequests * 0.20);
    $numPush    = (int) round($totalRequests * 0.20);
    $numPull    = (int) round($totalRequests * 0.40);
    $numReports = $totalRequests - ($numSales + $numPush + $numPull);

    // Sales
    for ($i = 0; $i < $numSales; $i++) {
        $idx = $i % count($companies);
        $requests[] = [
            'method'  => 'POST',
            'url'     => $baseUrl . '/sales',
            'headers' => [
                'Authorization: Bearer ' . $tokens[$idx],
                'X-Company-ID: ' . $companies[$idx]->id,
                'X-Branch-ID: ' . $users[$idx]->branch_id,
                'X-Request-ID: scale-sale-' . $totalRequests . '-' . $i,
            ],
            'body'    => [
                'idempotency_key' => (string) Str::uuid(),
                'payment_method'  => 'cash',
                'items'           => [['product_id' => $products[$idx]->id, 'quantity' => 1, 'selling_price' => 4000]],
            ],
        ];
    }

    // Push
    for ($i = 0; $i < $numPush; $i++) {
        $idx = $i % count($companies);
        $requests[] = [
            'method'  => 'POST',
            'url'     => $baseUrl . '/sync/push',
            'headers' => [
                'Authorization: Bearer ' . $tokens[$idx],
                'X-Company-ID: ' . $companies[$idx]->id,
                'X-Branch-ID: ' . $users[$idx]->branch_id,
                'X-Request-ID: scale-push-' . $totalRequests . '-' . $i,
            ],
            'body'    => [
                'operations' => [[
                    'uuid'        => (string) Str::uuid(),
                    'entity_type' => 'sale',
                    'action'      => 'create',
                    'created_at'  => now()->toIso8601String(),
                    'payload'     => [
                        'items'          => [['product_id' => $products[$idx]->id, 'quantity' => 1, 'selling_price' => 4000]],
                        'payment_method' => 'cash',
                    ],
                ]],
            ],
        ];
    }

    // Pull
    for ($i = 0; $i < $numPull; $i++) {
        $idx = $i % count($companies);
        $requests[] = [
            'method'  => 'GET',
            'url'     => $baseUrl . '/sync/pull',
            'headers' => [
                'Authorization: Bearer ' . $tokens[$idx],
                'X-Company-ID: ' . $companies[$idx]->id,
                'X-Branch-ID: ' . $users[$idx]->branch_id,
                'X-Request-ID: scale-pull-' . $totalRequests . '-' . $i,
            ],
        ];
    }

    // Reports
    for ($i = 0; $i < $numReports; $i++) {
        $idx = $i % count($companies);
        $requests[] = [
            'method'  => 'GET',
            'url'     => $baseUrl . '/reports/summary',
            'headers' => [
                'Authorization: Bearer ' . $tokens[$idx],
                'X-Company-ID: ' . $companies[$idx]->id,
                'X-Branch-ID: ' . $users[$idx]->branch_id,
                'X-Request-ID: scale-reports-' . $totalRequests . '-' . $i,
            ],
        ];
    }

    shuffle($requests);
    return $requests;
}


// ── Exécution des Paliers de Charge : 50 -> 100 -> 200 -> 500 Concurrents ──

$tierResults = [];
$tiers = [50, 100, 200, 500];

printScalabilityHeader('PHASE 3.8 — EXPÉRIMENTATION DE CHARGE PROGRESSIVE SAAS (50 -> 500 CONCURRENTS)');

foreach ($tiers as $tierCount) {
    echo "\n▶ Lancement du Palier {$tierCount} requêtes concourantes simultanées...\n";
    
    // Mesure du stock initial
    $stocksBefore = array_map(fn($bp) => BranchProduct::where('id', $bp->id)->value('quantity'), $branchProducts);
    
    $reqConfigs = buildScalabilityRequests($tierCount, $companies, $users, $tokens, $products, $baseUrl);
    $batchRes = runScalabilityBatch($reqConfigs, $tierCount);
    
    // Mesure du stock final post-batch
    $stocksAfter = array_map(fn($bp) => BranchProduct::where('id', $bp->id)->value('quantity'), $branchProducts);
    
    // Décrémentations attendues : numSales + numPush sur chaque boutique
    $numSalesTier = (int) round($tierCount * 0.20);
    $numPushTier  = (int) round($tierCount * 0.20);
    $totalWrites  = $numSalesTier + $numPushTier;
    
    $actualDecrements = array_sum($stocksBefore) - array_sum($stocksAfter);
    $integrityOk = ($actualDecrements == $totalWrites) && ($batchRes['success_rate'] >= 98.0);
    
    $tierResults[] = array_merge($batchRes, [
        'actual_decrements' => $actualDecrements,
        'expected_writes'   => $totalWrites,
        'integrity_ok'      => $integrityOk,
    ]);

    echo "----------------------------------------------------------------------------------\n";
    echo "Palier {$tierCount} Concurrents : Success Rate = {$batchRes['success_rate']}% | Throughput = {$batchRes['throughput']} req/s\n";
    echo "Latences : P50 = {$batchRes['latency_p50']} ms | P95 = {$batchRes['latency_p95']} ms | P99 = {$batchRes['latency_p99']} ms\n";
    echo "Intégrité Stock : Décrémentations réelles={$actualDecrements} (attendues={$totalWrites}) -> " . ($integrityOk ? "\033[32m[PASS]\033[0m" : "\033[31m[FAIL]\033[0m") . "\n";
}


// ── Tableau Récapitulatif Final ──

printScalabilityHeader('SYNTHÈSE FINALE SCALABILITÉ SAAS (P50 / P95 / P99 & THROUGHPUT)');

echo sprintf("%-12s | %-10s | %-12s | %-10s | %-10s | %-10s | %-16s | %-10s\n",
    "Concurrence", "Requests", "Success Rate", "P50 (ms)", "P95 (ms)", "P99 (ms)", "Throughput (req/s)", "Integrity");
echo "----------------------------------------------------------------------------------------------------\n";

foreach ($tierResults as $tr) {
    echo sprintf("%-12d | %-10d | %-12s | %-10.2f | %-10.2f | %-10.2f | %-16.2f | %-10s\n",
        $tr['concurrency'],
        $tr['total_requests'],
        $tr['success_rate'] . "%",
        $tr['latency_p50'],
        $tr['latency_p95'],
        $tr['latency_p99'],
        $tr['throughput'],
        $tr['integrity_ok'] ? "[PASS]" : "[FAIL]"
    );

    if (!$tr['integrity_ok']) {
        $globalPassed = false;
    }
}

echo "\n=========================================================\n";
if ($globalPassed) {
    echo " \033[32mRÉSULTAT PHASE 3.8 : QUALIFICATION DE SCALABILITÉ SAAS VALIDÉE JUSQU'À 500 CONCURRENTS ! 🎉\033[0m\n";
} else {
    echo " \033[31mRÉSULTAT PHASE 3.8 : SEUILS DE SCALABILITÉ NON ATTEINTS. ❌\033[0m\n";
}
echo "=========================================================\n";

if (!$globalPassed) {
    exit(1);
}
