<?php

/**
 * Phase 3.5 — Application Resilience & Recovery Qualification Suite
 *
 * Scénarios :
 * MU-15-A : Échec Critique & Rollback Atomique (0 vente partielle, 0 décrémentation parasite)
 * MU-15-B : Retry Contrôlé sur Verrouillage Temporaire (Borné à 3 tentatives, pas de boucle infinie)
 * MU-15-C : Défaillance de Service Secondaire (Échec notification non bloquant pour la vente)
 * MU-15-D : Recovery de Synchronisation & Retries Idempotents (UUID reconnu, 0 doublon)
 * MU-15-E : Recovery après Interruption via SSE Last-Event-ID & PULL Incrémental
 * MU-15-F : Dégradation Contrôlée (Readiness HTTP 503, format JSON Phase 3.2, X-Request-ID, 0 fuite)
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
use App\Models\RealtimeEvent;
use App\Http\Controllers\API\V1\SyncController;
use App\Http\Controllers\API\V1\SaleController;
use App\Http\Controllers\API\V1\SseController;
use App\Http\Controllers\API\V1\HealthCheckController;
use Illuminate\Support\Facades\DB;
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

// ── Fixtures Communes ────────────────────────────────────────────────────────

$prefix  = 'phase35_' . time() . '_';

$company = Company::create(['name' => 'MU-Phase35 Company ' . Str::random(4), 'status' => 'active']);
app(\App\Services\TenantManager::class)->setCompany($company);

$branch  = Branch::create(['company_id' => $company->id, 'name' => 'Boutique 35', 'status' => 'open']);
$role    = \App\Models\Role::create(['company_id' => $company->id, 'name' => 'Admin', 'slug' => 'admin']);

$user = User::create([
    'name'              => 'Admin 35',
    'email'             => $prefix . 'admin@apex.com',
    'password'          => Hash::make('Secret123!'),
    'company_id'        => $company->id,
    'branch_id'         => $branch->id,
    'role_id'           => $role->id,
]);
$user->email_verified_at = now();
$user->save();

auth()->setUser($user);

$category = Category::create(['company_id' => $company->id, 'name' => 'Cat 35']);
$product  = Product::create([
    'company_id'    => $company->id,
    'category_id'   => $category->id,
    'name'          => 'Produit Phase 35',
    'sku'           => 'P35-' . Str::random(5),
    'selling_price' => 5000,
    'cost_price'    => 3000,
]);

$branchProduct = BranchProduct::create([
    'branch_id'  => $branch->id,
    'product_id' => $product->id,
    'quantity'   => 50,
    'is_active'  => true,
]);

$session = CashSession::create([
    'company_id'      => $company->id,
    'branch_id'       => $branch->id,
    'user_id'         => $user->id,
    'opening_balance' => 10000,
    'opened_at'       => now(),
    'status'          => 'open',
]);


// ────────────────────────────────────────────────────────────────────────────
// MU-15-A — Échec Critique & Rollback Atomique
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-15-A — Échec Critique & Rollback Atomique');

$stockBefore = BranchProduct::where('id', $branchProduct->id)->value('quantity');
$salesBefore = Sale::withoutGlobalScope('tenant')->where('company_id', $company->id)->count();

$invalidReq = Illuminate\Http\Request::create('/api/v1/sales', 'POST', [
    'payment_method' => 'cash',
    'items'          => [
        ['product_id' => $product->id, 'quantity' => 2, 'selling_price' => 5000],
        ['product_id' => $product->id, 'quantity' => 999, 'selling_price' => 5000], // Survente -> Exception
    ],
]);
$invalidReq->setUserResolver(fn () => $user);

$saleCtrl = new SaleController();
$resInvalid = $saleCtrl->store($invalidReq);

$stockAfter = BranchProduct::where('id', $branchProduct->id)->value('quantity');
$salesAfter = Sale::withoutGlobalScope('tenant')->where('company_id', $company->id)->count();

logTestResult(
    'MU-15-A (Rollback Stock & Vente) — 0 vente partielle, stock inchangé après échec critique',
    $stockBefore == $stockAfter && $salesBefore == $salesAfter,
    "Stock avant={$stockBefore}, après={$stockAfter} | Ventes avant={$salesBefore}, après={$salesAfter}."
);


// ────────────────────────────────────────────────────────────────────────────
// MU-15-B — Retry Contrôlé (Deadlock / Lock Wait)
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-15-B — Retry Contrôlé sur Verrouillage Temporaire');

$attemptCount = 0;
try {
    DB::transaction(function () use (&$attemptCount) {
        $attemptCount++;
        if ($attemptCount < 3) {
            throw new \Illuminate\Database\QueryException(
                'mysql',
                'SELECT * FROM test',
                [],
                new \Exception('Deadlock found when trying to get lock; try restarting transaction', 1213)
            );
        }
        return true;
    }, 3);
} catch (\Throwable $e) {}

logTestResult(
    'MU-15-B (Retry Borné à 3) — Nombre de tentatives limité à 3 avec résolution finale',
    $attemptCount === 3,
    "Nombre de tentatives exécutées : {$attemptCount} (attendu 3)."
);


// ────────────────────────────────────────────────────────────────────────────
// MU-15-C — Isolation des Services Secondaires (Listeners / Notification)
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-15-C — Défaillance d\'un Service Secondaire (Non Bloquant)');

$validReq = Illuminate\Http\Request::create('/api/v1/sales', 'POST', [
    'payment_method' => 'cash',
    'items'          => [['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 5000]],
]);
$validReq->setUserResolver(fn () => $user);

// Attacher un listener secondaire défaillant sur l'événement SaleCreated
\Illuminate\Support\Facades\Event::listen(\App\Events\SaleCreated::class, function () {
    throw new \Exception('Service de notification externe totalement indisponible !');
});

$resValid = $saleCtrl->store($validReq);
$dataValid = json_decode($resValid->getContent(), true) ?? [];
$saleCreated = isset($dataValid['sale']['id']);

$stockPostSale = BranchProduct::where('id', $branchProduct->id)->value('quantity');

logTestResult(
    'MU-15-C (Isolation Service Secondaire) — Vente enregistrée et stock décrémenté malgré l\'échec du service externe',
    $saleCreated && $stockPostSale == ($stockBefore - 1),
    "Vente ID=" . ($dataValid['sale']['id'] ?? 'null') . " | Stock après vente={$stockPostSale} (attendu " . ($stockBefore - 1) . ")."
);


// ────────────────────────────────────────────────────────────────────────────
// MU-15-D — Recovery Synchronisation (UUID & Idempotence PUSH)
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-15-D — Recovery de Synchronisation & Retries Idempotents');

$pushUuid = (string) Str::uuid();
$syncCtrl = new SyncController();

$pushReq1 = Illuminate\Http\Request::create('/api/v1/sync/push', 'POST', [
    'operations' => [[
        'uuid'        => $pushUuid,
        'entity_type' => 'sale',
        'action'      => 'create',
        'created_at'  => now()->toIso8601String(),
        'payload'     => [
            'items'          => [['product_id' => $product->id, 'quantity' => 2, 'selling_price' => 5000]],
            'payment_method' => 'cash',
            'client_name'    => 'Client Retry Test',
        ],
    ]],
]);
$pushReq1->setUserResolver(fn () => $user);

$resPush1 = $syncCtrl->push($pushReq1);
$dataPush1 = json_decode($resPush1->getContent(), true) ?? [];
$stockAfterPush1 = BranchProduct::where('id', $branchProduct->id)->value('quantity');

// Re-PUSH avec le MÊME UUID (Simulation perte de réponse client + Retry)
$resPush2 = $syncCtrl->push($pushReq1);
$dataPush2 = json_decode($resPush2->getContent(), true) ?? [];
$stockAfterPush2 = BranchProduct::where('id', $branchProduct->id)->value('quantity');

$isIdempotent = in_array($pushUuid, $dataPush1['synced_uuids'] ?? []) &&
    in_array($pushUuid, $dataPush2['synced_uuids'] ?? []) &&
    ($stockAfterPush1 == $stockAfterPush2);

logTestResult(
    'MU-15-D (Recovery Idempotent) — Même UUID ré-émis -> 0 double décrémentation de stock, status=success',
    $isIdempotent,
    "Stock 1er PUSH={$stockAfterPush1} | Stock Retry={$stockAfterPush2} | Synced UUID=" . (in_array($pushUuid, $dataPush2['synced_uuids'] ?? []) ? 'OUI' : 'NON')
);


// ────────────────────────────────────────────────────────────────────────────
// MU-15-E — Recovery après Interruption (SSE Last-Event-ID & PULL Cursor)
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-15-E — Recovery après Interruption via SSE Last-Event-ID');

$event1 = RealtimeEvent::create([
    'company_id' => $company->id,
    'branch_id'  => $branch->id,
    'event_type' => 'product_updated',
    'payload'    => ['product_id' => $product->id, 'name' => 'Event 1'],
]);

$event2 = RealtimeEvent::create([
    'company_id' => $company->id,
    'branch_id'  => $branch->id,
    'event_type' => 'product_updated',
    'payload'    => ['product_id' => $product->id, 'name' => 'Event 2'],
]);

// Récupération des événements avec Last-Event-ID = event1->id (rattrapage post-interruption)
$recoveredEvents = RealtimeEvent::getForUser($company->id, $branch->id, $user->id, $event1->id);
$hasEvent2Only   = count($recoveredEvents) === 1 && $recoveredEvents[0]->id === $event2->id;

logTestResult(
    'MU-15-E (SSE Rattrapage) — Reconnexion avec Last-Event-ID restitue uniquement les événements manqués',
    $hasEvent2Only,
    "Événements récupérés=" . count($recoveredEvents) . " | Event ID=" . ($recoveredEvents[0]->id ?? 'none')
);


// ────────────────────────────────────────────────────────────────────────────
// MU-15-F — Dégradation Contrôlée (Readiness HTTP 503 & JSON Phase 3.2)
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-15-F — Dégradation Contrôlée & Error Envelope Phase 3.2');

$origHost = config('database.connections.mysql.host');
config(['database.connections.mysql.host' => 'invalid_unreachable_host_123']);
DB::purge('mysql');

$healthCtrl = new HealthCheckController();
$reqDegraded = Illuminate\Http\Request::create('/api/v1/ready', 'GET');
$reqDegraded->headers->set('X-Request-ID', 'resilience-test-reqid-15f');

$resDegraded = $healthCtrl->readiness($reqDegraded);
$dataDegraded = json_decode($resDegraded->getContent(), true) ?? [];

config(['database.connections.mysql.host' => $origHost]);
DB::purge('mysql');
DB::reconnect('mysql');

$validDegraded = $resDegraded->getStatusCode() === 503 &&
    ($dataDegraded['status'] ?? '') === 'degraded' &&
    ($dataDegraded['checks']['database'] ?? '') === 'unavailable' &&
    ($dataDegraded['request_id'] ?? '') === 'resilience-test-reqid-15f';

logTestResult(
    'MU-15-F (Dégradation Contrôlée) — HTTP 503, status=degraded, database=unavailable, X-Request-ID présent',
    $validDegraded,
    "HTTP={$resDegraded->getStatusCode()} | status=" . ($dataDegraded['status'] ?? 'N/A') . " | ReqID=" . ($dataDegraded['request_id'] ?? 'N/A')
);


// ── Bilan Final Phase 3.5 ────────────────────────────────────────────────────
echo "\n=========================================================\n";
if ($globalPassed) {
    echo " \033[32mRÉSULTAT PHASE 3.5 : TOUS LES TESTS MU-15 ONT RÉUSSI ! 🎉\033[0m\n";
} else {
    echo " \033[31mRÉSULTAT PHASE 3.5 : CERTAINS TESTS ONT ÉCHOUÉ. ❌\033[0m\n";
}
echo "=========================================================\n";

if (!$globalPassed) {
    exit(1);
}
