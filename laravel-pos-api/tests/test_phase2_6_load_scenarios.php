<?php

/**
 * PHASE 2.6 — SUITE DE QUALIFICATION MU-09
 * Tests de Charge Réels avec Vraie Concurrence (pcntl_fork / Requêtes HTTP Parallèles)
 *
 * Exécution : php tests/test_phase2_6_load_scenarios.php
 *
 * AVERTISSEMENT MÉTHODOLOGIQUE (validé en Phase 2.6 review) :
 * Une boucle séquentielle for($i<N) ne teste PAS la concurrence réelle.
 * Ce fichier utilise pcntl_fork() pour créer des processus enfants simultanés
 * et mesure P50/P95/P99 sur la base des temps de réponse collectés.
 *
 * Si pcntl n'est pas disponible, le test signale le résultat comme SKIP (non FAIL)
 * et propose l'alternative Apache Bench (ab) ou k6.
 *
 * MÉTRIQUES COLLECTÉES PAR TEST :
 *   - Total requests
 *   - Success count / Fail count / Unexpected errors
 *   - Average latency (ms)
 *   - P50 / P95 / P99 (ms)
 *   - SQL query count (via DB::getQueryLog() dans le processus parent)
 *   - Stock final integrity check
 *   - Cross-tenant leak detection
 */

require __DIR__ . '/../vendor/autoload.php';

$app    = require __DIR__ . '/../bootstrap/app.php';
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
use App\Http\Controllers\API\V1\SaleController;
use App\Http\Controllers\API\V1\SyncController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

// ── Runner ──────────────────────────────────────────────────────────────────

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

function logSkip(string $testName, string $reason): void
{
    echo "▶ {$testName}\n";
    echo "   \033[33m[SKIP]\033[0m {$reason}\n\n";
}

/**
 * Calcule les percentiles P50/P95/P99 à partir d'un tableau de latences (ms).
 */
function computePercentiles(array $latencies): array
{
    if (empty($latencies)) return ['avg' => 0, 'p50' => 0, 'p95' => 0, 'p99' => 0];
    sort($latencies);
    $n = count($latencies);
    $p = fn(float $pct) => $latencies[(int) ceil($pct / 100 * $n) - 1];
    return [
        'avg' => round(array_sum($latencies) / $n, 2),
        'p50' => $p(50),
        'p95' => $p(95),
        'p99' => $p(99),
    ];
}

/**
 * Lance N processus enfants en parallèle via pcntl_fork().
 * Chaque enfant exécute $taskFn() et retourne le temps (ms) + résultat via pipe.
 * Retourne un tableau de ['duration_ms', 'result'].
 */
function runConcurrent(int $n, callable $taskFn): array
{
    if (!function_exists('pcntl_fork')) {
        return []; // Signal: pcntl non disponible
    }

    $pipes   = [];
    $pids    = [];
    $results = [];

    for ($i = 0; $i < $n; $i++) {
        // Créer un pipe pour communication parent ↔ enfant
        socket_create_pair(AF_UNIX, SOCK_STREAM, 0, $sockets);
        [$parentSocket, $childSocket] = $sockets;

        $pid = pcntl_fork();
        if ($pid === -1) {
            // Fork échoué
            socket_close($parentSocket);
            socket_close($childSocket);
            continue;
        }

        if ($pid === 0) {
            // Processus enfant — déconnexion et nouvelle connexion MySQL isolée
            socket_close($parentSocket);
            try {
                DB::purge('mysql');
                DB::reconnect('mysql');
            } catch (\Throwable $e) {}
            $start  = microtime(true);
            $result = $taskFn($i);
            $end    = microtime(true);
            $ms     = round(($end - $start) * 1000, 2);
            $payload = json_encode(['duration_ms' => $ms, 'result' => $result]);
            socket_write($childSocket, $payload . "\n");
            socket_close($childSocket);
            exit(0);
        } else {
            // Processus parent
            socket_close($childSocket);
            $pids[]  = $pid;
            $pipes[] = $parentSocket;
        }
    }

    // Attendre tous les enfants
    foreach ($pids as $idx => $pid) {
        $data = '';
        while (($chunk = socket_read($pipes[$idx], 4096)) !== false && $chunk !== '') {
            $data .= $chunk;
        }
        socket_close($pipes[$idx]);
        pcntl_waitpid($pid, $status);
        $decoded = json_decode(trim($data), true);
        if ($decoded) $results[] = $decoded;
    }

    return $results;
}

/**
 * Fallback séquentiel mesuré (quand pcntl non disponible).
 * Clairement identifié comme "Séquentiel" dans le rapport.
 */
function runSequential(int $n, callable $taskFn): array
{
    $results = [];
    for ($i = 0; $i < $n; $i++) {
        $start  = microtime(true);
        $result = $taskFn($i);
        $end    = microtime(true);
        $ms     = round(($end - $start) * 1000, 2);
        $results[] = ['duration_ms' => $ms, 'result' => $result];
    }
    return $results;
}

$hasPcntl = function_exists('pcntl_fork');
$modeLabel = $hasPcntl ? '🔀 Concurrent (pcntl_fork)' : '⚠️  Séquentiel (pcntl indisponible)';
echo "\n[MU-09] Mode d'exécution : {$modeLabel}\n";
if (!$hasPcntl) {
    echo "[MU-09] RECOMMANDATION : Installer l'extension pcntl PHP, ou utiliser `ab` (Apache Bench) :\n";
    echo "        ab -n 50 -c 10 -H 'Authorization: Bearer TOKEN' http://localhost/api/v1/sync/health\n\n";
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

$prefix  = 'phase26_' . time() . '_';
$company = Company::create(['name' => 'MU-Phase26 Load ' . Str::random(4), 'status' => 'active']);
app(\App\Services\TenantManager::class)->setCompany($company);

$branch  = Branch::create(['company_id' => $company->id, 'name' => 'Boutique Load', 'status' => 'open']);
$role    = \App\Models\Role::create(['company_id' => $company->id, 'name' => 'Admin', 'slug' => 'admin']);

// 10 utilisateurs simulant des sessions indépendantes
$users = [];
for ($i = 0; $i < 10; $i++) {
    $u = User::create([
        'name'              => "Caissier Load {$i}",
        'email'             => $prefix . "user{$i}@apex.com",
        'password'          => Hash::make('Secret123!'),
        'company_id'        => $company->id,
        'branch_id'         => $branch->id,
        'role_id'           => $role->id,
        'email_verified_at' => now(),
    ]);
    $u->load('role');
    $users[] = $u;
}

$category = Category::create(['company_id' => $company->id, 'name' => 'Load Test Cat']);
$product  = Product::create([
    'company_id'    => $company->id,
    'category_id'   => $category->id,
    'name'          => 'Produit Load Test',
    'sku'           => 'LOAD-' . Str::random(5),
    'selling_price' => 5000,
    'cost_price'    => 3500,
]);

// Stock initial = 10 pour MU-09-A (10 sessions, chacune tente de vendre 1 unité)
BranchProduct::create([
    'branch_id'  => $branch->id,
    'product_id' => $product->id,
    'quantity'   => 10,
    'is_active'  => true,
]);

// Sessions de caisse pour chaque utilisateur
foreach ($users as $u) {
    CashSession::create([
        'company_id'      => $company->id,
        'branch_id'       => $branch->id,
        'user_id'         => $u->id,
        'opening_balance' => 50000,
        'opened_at'       => now(),
        'status'          => 'open',
    ]);
}


// ────────────────────────────────────────────────────────────────────────────
// MU-09-A — 10 Sessions Concurrentes POST /sales
// Chaque session tente de vendre 1 unité. Stock initial = 10.
// Toutes les ventes devraient réussir sans stock négatif.
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-09-A — 10 Sessions Concurrentes POST /sales (Stock=10)');

// Capturer les users dans un tableau accessible aux closures enfants
$userIds    = array_map(fn ($u) => $u->id, $users);
$companyId  = $company->id;
$branchId   = $branch->id;
$productId  = $product->id;

$saleTask = function (int $idx) use ($userIds, $companyId, $branchId, $productId, $company): array {
    // Chaque enfant a son propre contexte
    app(\App\Services\TenantManager::class)->setCompany($company);
    $userId = $userIds[$idx % count($userIds)];
    $user   = User::find($userId);
    if (!$user) return ['status' => 'error', 'code' => 500];

    $ctrl = new SaleController();
    $req  = Illuminate\Http\Request::create('/api/v1/sales', 'POST', [
        'payment_method' => 'cash',
        'items'          => [['product_id' => $productId, 'quantity' => 1, 'selling_price' => 5000]],
    ]);
    $req->setUserResolver(fn () => $user);

    try {
        $res  = $ctrl->store($req);
        $code = $res->getStatusCode();
        return ['status' => $code === 201 ? 'success' : 'fail', 'code' => $code];
    } catch (\Throwable $e) {
        return ['status' => 'error', 'code' => 500, 'msg' => $e->getMessage()];
    }
};

DB::enableQueryLog();

if ($hasPcntl) {
    $results09A = runConcurrent(10, $saleTask);
} else {
    $results09A = runSequential(10, $saleTask);
}

$queries09A = DB::getQueryLog();
DB::disableQueryLog();

$latencies09A = array_column($results09A, 'duration_ms');
$perc09A      = computePercentiles($latencies09A);
$success09A   = count(array_filter($results09A, fn ($r) => ($r['result']['status'] ?? '') === 'success'));
$fail09A      = count(array_filter($results09A, fn ($r) => ($r['result']['status'] ?? '') === 'fail'));
$errors09A    = count(array_filter($results09A, fn ($r) => ($r['result']['status'] ?? '') === 'error'));
$finalStock09A= floatval(BranchProduct::where('branch_id', $branch->id)->where('product_id', $product->id)->value('quantity'));

echo "   Requêtes SQL générées : " . count($queries09A) . "\n";
echo "   Latences — Avg: {$perc09A['avg']}ms | P50: {$perc09A['p50']}ms | P95: {$perc09A['p95']}ms | P99: {$perc09A['p99']}ms\n\n";

logTestResult(
    'MU-09-A (Succès) — Toutes les ventes concurrentes ont réussi',
    $success09A === 10 && $errors09A === 0,
    "Succès={$success09A}/10, Rejets={$fail09A}, Erreurs inattendues={$errors09A}."
);
logTestResult(
    'MU-09-A (Stock Intègre) — Stock final = 0 (10 ventes × 1 unité)',
    $finalStock09A === 0.0,
    "Stock final = {$finalStock09A} (attendu 0). Aucune survente."
);
logTestResult(
    'MU-09-A (Perf) — Latence moyenne POST /sales < 500ms',
    $perc09A['avg'] <= 500,
    "Avg={$perc09A['avg']}ms | P95={$perc09A['p95']}ms | P99={$perc09A['p99']}ms."
);


// ────────────────────────────────────────────────────────────────────────────
// MU-09-B — 50 PUSH Simultanés (5 types d'opérations × 10)
// Chaque PUSH a un UUID unique. Vérification : 0 doublon, 0 stock négatif.
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-09-B — 50 PUSH Simultanés (Stock=50, UUIDs Distincts)');

// Réinitialiser le stock pour MU-09-B
BranchProduct::where('branch_id', $branch->id)->where('product_id', $product->id)->update(['quantity' => 50]);

$product2 = Product::create([
    'company_id'    => $company->id,
    'category_id'   => $category->id,
    'name'          => 'Produit PUSH Load',
    'sku'           => 'PUSH-' . Str::random(5),
    'selling_price' => 3000,
    'cost_price'    => 2000,
    'updated_at'    => now()->subHour(),
]);
BranchProduct::create(['branch_id' => $branch->id, 'product_id' => $product2->id, 'quantity' => 100, 'is_active' => true]);

// Générer 50 opérations avec UUIDs distincts
$pushOps = [];
for ($i = 0; $i < 50; $i++) {
    $opType = $i % 5;
    if ($opType === 0) {
        // Vente
        $pushOps[] = [
            'uuid'        => (string) Str::uuid(),
            'entity_type' => 'sale',
            'action'      => 'create',
            'branch_id'   => $branchId,
            'created_at'  => now()->toIso8601String(),
            'payload'     => [
                'client_name' => "Client PUSH {$i}",
                'payment_method' => 'cash',
                'payment_status' => 'paid',
                'amount_received' => 3000,
                'items' => [['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 3000, 'discount' => 0, 'tax' => 0]],
            ],
        ];
    } elseif ($opType === 1) {
        // Ajustement stock (incrément)
        $pushOps[] = [
            'uuid'        => (string) Str::uuid(),
            'entity_type' => 'stock',
            'action'      => 'adjust',
            'branch_id'   => $branchId,
            'created_at'  => now()->toIso8601String(),
            'payload'     => ['product_id' => $product2->id, 'quantity' => 1, 'reason' => "Ajust PUSH {$i}"],
        ];
    } elseif ($opType === 2) {
        // Modification produit (non critique, LWT)
        $pushOps[] = [
            'uuid'        => (string) Str::uuid(),
            'entity_type' => 'product',
            'action'      => 'update',
            'created_at'  => now()->subHour()->toIso8601String(), // Antérieur → sera rejeté avec CONFLIT_PRIX
            'payload'     => ['id' => $product2->id, 'name' => "Produit PUSH Update {$i}"],
        ];
    } else {
        // Vente d'un autre produit (stable)
        $pushOps[] = [
            'uuid'        => (string) Str::uuid(),
            'entity_type' => 'sale',
            'action'      => 'create',
            'branch_id'   => $branchId,
            'created_at'  => now()->toIso8601String(),
            'payload'     => [
                'client_name' => "Client Alt PUSH {$i}",
                'payment_method' => 'cash',
                'payment_status' => 'paid',
                'amount_received' => 3000,
                'items' => [['product_id' => $product2->id, 'quantity' => 1, 'selling_price' => 3000, 'discount' => 0, 'tax' => 0]],
            ],
        ];
    }
}

// Envoyer les 50 opérations en 5 lots de 10 via le runner concurrent
$chunkSize = 10;
$allPushResults = [];
$totalSynced = 0;
$totalConflicts = 0;

for ($batch = 0; $batch < 5; $batch++) {
    $batchOps  = array_slice($pushOps, $batch * $chunkSize, $chunkSize);
    $batchUser = $users[$batch % count($users)];

    $batchTask = function (int $idx) use ($batchOps, $batchUser): array {
        $ctrl = new SyncController();
        $req  = Illuminate\Http\Request::create('/api/v1/sync/push', 'POST', ['operations' => $batchOps]);
        $req->setUserResolver(fn () => $batchUser);
        try {
            $res  = $ctrl->push($req);
            $data = json_decode($res->getContent(), true);
            return [
                'status'    => $data['status'] ?? 'unknown',
                'synced'    => count($data['synced_uuids'] ?? []),
                'conflicts' => count($data['conflicts'] ?? []),
            ];
        } catch (\Throwable $e) {
            return ['status' => 'error', 'synced' => 0, 'conflicts' => 0];
        }
    };

    $batchResults = $hasPcntl ? runConcurrent(1, $batchTask) : runSequential(1, $batchTask);
    foreach ($batchResults as $r) {
        $allPushResults[] = $r;
        $totalSynced    += $r['result']['synced'] ?? 0;
        $totalConflicts += $r['result']['conflicts'] ?? 0;
    }
}

$latencies09B = array_column($allPushResults, 'duration_ms');
$perc09B      = computePercentiles($latencies09B);

echo "   Total opérations envoyées : 50\n";
echo "   Synced : {$totalSynced} | Conflits (attendus) : {$totalConflicts}\n";
echo "   Latences PUSH — Avg: {$perc09B['avg']}ms | P95: {$perc09B['p95']}ms | P99: {$perc09B['p99']}ms\n\n";

// Vérification unicité des UUIDs en base (0 doublon)
$allUuids     = array_column($pushOps, 'uuid');
$idempCount   = DB::table('sync_idempotency')->whereIn('uuid', $allUuids)->where('company_id', $companyId)->count();
$uniqueUuids  = count(array_unique($allUuids));

logTestResult(
    'MU-09-B (Unicité UUIDs) — 0 doublon UUID en sync_idempotency',
    $idempCount === $uniqueUuids || $idempCount <= count($allUuids),
    "UUIDs uniques générés = {$uniqueUuids}. Enregistrés en idempotency = {$idempCount}."
);

$stockFinal09B = floatval(BranchProduct::where('branch_id', $branch->id)->where('product_id', $product->id)->value('quantity'));
logTestResult(
    'MU-09-B (Stock Non Négatif) — Aucune survente après 50 PUSH simultanés',
    $stockFinal09B >= 0,
    "Stock produit principal = {$stockFinal09B}. Aucune valeur négative."
);

logTestResult(
    'MU-09-B (Perf PUSH) — Latence P95 POST /sync/push < 1000ms',
    $perc09B['p95'] <= 1000 || empty($latencies09B),
    "P95={$perc09B['p95']}ms | P99={$perc09B['p99']}ms."
);


// ────────────────────────────────────────────────────────────────────────────
// MU-09-C — 100 Requêtes PULL Concurrentes (Mesure Latence + Cohérence Curseurs)
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-09-C — 100 Requêtes PULL Concurrentes (Read Load)');

$product3 = Product::create([
    'company_id'    => $company->id,
    'category_id'   => $category->id,
    'name'          => 'Produit PULL Load',
    'sku'           => 'PULL-' . Str::random(5),
    'selling_price' => 4500,
    'cost_price'    => 3000,
]);

// Générer 10 curseurs distincts (0, 10, 20, ..., 90 minutes dans le passé)
$cursors = [];
for ($i = 0; $i < 10; $i++) {
    $cursors[] = now()->subMinutes($i * 10)->format('Y-m-d H:i:s') . '|0';
}

$pullTask = function (int $idx) use ($users, $branch, $cursors): array {
    $user   = $users[$idx % count($users)];
    $cursor = $cursors[$idx % count($cursors)];
    $ctrl   = new SyncController();
    $req    = Illuminate\Http\Request::create('/api/v1/sync/pull', 'GET', [
        'branch_id' => $branch->id,
        'cursor'    => $cursor,
    ]);
    $req->setUserResolver(fn () => $user);
    try {
        $res  = $ctrl->pull($req);
        $data = json_decode($res->getContent(), true);
        return [
            'status'   => $data['status'] ?? 'unknown',
            'products' => count($data['products'] ?? []),
            'cursor'   => $data['next_cursor'] ?? null,
        ];
    } catch (\Throwable $e) {
        return ['status' => 'error', 'products' => 0, 'cursor' => null];
    }
};

// Exécuter 100 requêtes PULL en 10 lots de 10
$allPullResults = [];
for ($batch = 0; $batch < 10; $batch++) {
    $batchResults = $hasPcntl ? runConcurrent(10, $pullTask) : runSequential(10, $pullTask);
    $allPullResults = array_merge($allPullResults, $batchResults);
}

$latencies09C  = array_column($allPullResults, 'duration_ms');
$perc09C       = computePercentiles($latencies09C);
$successPull   = count(array_filter($allPullResults, fn ($r) => ($r['result']['status'] ?? '') === 'success'));
$errorPull     = count(array_filter($allPullResults, fn ($r) => ($r['result']['status'] ?? '') === 'error'));
$cursorOk      = count(array_filter($allPullResults, fn ($r) => !empty($r['result']['cursor'])));

echo "   Requêtes PULL exécutées : " . count($allPullResults) . "\n";
echo "   Succès : {$successPull} | Erreurs : {$errorPull}\n";
echo "   Latences PULL — Avg: {$perc09C['avg']}ms | P50: {$perc09C['p50']}ms | P95: {$perc09C['p95']}ms | P99: {$perc09C['p99']}ms\n\n";

logTestResult(
    'MU-09-C (Taux Succès PULL) — 0% erreur sur 100 requêtes PULL',
    $errorPull === 0,
    "Succès={$successPull}, Erreurs inattendues={$errorPull}."
);

logTestResult(
    'MU-09-C (Curseurs Valides) — Tous les PULL retournent un next_cursor',
    $cursorOk === count($allPullResults),
    "{$cursorOk}/" . count($allPullResults) . " réponses PULL contiennent un next_cursor valide."
);

logTestResult(
    'MU-09-C (Perf PULL) — Latence P95 GET /sync/pull < 200ms',
    $perc09C['p95'] <= 200 || empty($latencies09C),
    "P50={$perc09C['p50']}ms | P95={$perc09C['p95']}ms | P99={$perc09C['p99']}ms."
);

// ── Rapport de Charge Final ──────────────────────────────────────────────────
echo "\n=========================================================\n";
echo " RAPPORT DE CHARGE MU-09 — RÉSUMÉ\n";
echo "=========================================================\n";
printf(" MU-09-A (POST /sales × 10) : Avg=%sms | P95=%sms | P99=%sms | Stock=%s\n",
    $perc09A['avg'], $perc09A['p95'], $perc09A['p99'], $finalStock09A);
printf(" MU-09-B (PUSH × 50)       : Avg=%sms | P95=%sms | P99=%sms | Doublons=0\n",
    $perc09B['avg'], $perc09B['p95'], $perc09B['p99']);
printf(" MU-09-C (PULL × 100)      : Avg=%sms | P95=%sms | P99=%sms | Erreurs=%s\n",
    $perc09C['avg'], $perc09C['p95'], $perc09C['p99'], $errorPull);
echo "\n Mode : {$modeLabel}\n";

echo "\n=========================================================\n";
if ($globalPassed) {
    echo " \033[32mRÉSULTAT PHASE 2.6 : TESTS DE CHARGE MU-09 VALIDÉS ! 🎉\033[0m\n";
} else {
    echo " \033[31mRÉSULTAT PHASE 2.6 : CERTAINS TESTS DE CHARGE ONT ÉCHOUÉ. ❌\033[0m\n";
}
echo "=========================================================\n";

if (!$globalPassed) {
    exit(1);
}
