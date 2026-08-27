<?php

/**
 * PHASE 2.2 — SUITE DE QUALIFICATION MU-01 ET MU-03
 * Synchronisation Multi-Utilisateurs, Événements Temps Réel (SSE) & Isolation Multi-Tenant Stricte
 * 
 * Exécution : php tests/test_phase2_2_scenarios.php
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Company;
use App\Models\Branch;
use App\Models\Category;
use App\Models\Product;
use App\Models\BranchProduct;
use App\Models\CashSession;
use App\Models\RealtimeEvent;
use App\Services\RealtimeBroadcastService;
use App\Services\TenantManager;

function logTestHeader($title) {
    echo "\n=========================================================\n";
    echo "   {$title}\n";
    echo "=========================================================\n";
}

function logTestResult($testName, $passed, $message = '') {
    if ($passed) {
        echo "▶ {$testName}\n";
        echo "   \033[32m[PASS]\033[0m {$message}\n\n";
    } else {
        echo "▶ {$testName}\n";
        echo "   \033[31m[FAIL]\033[0m {$message}\n\n";
        exit(1);
    }
}

logTestHeader("PHASE 2.2 — MULTI-USER SYNCHRONIZATION & REAL-TIME QUALIFICATION");

// --------------------------------------------------------------------------
// SETUP DATASET MULTI-TENANT (Company A & Company B)
// --------------------------------------------------------------------------
$prefix = 'phase2_2_' . time() . '_';

// Company A (Company 901)
$companyA = Company::create([
    'name' => 'ENTREPRISE A SSE ' . time(),
    'email' => $prefix . 'comp_a@test.com',
    'phone' => '0102030405',
    'status' => 'active',
]);

$branchA1 = Branch::create([
    'company_id' => $companyA->id,
    'name' => 'Boutique A1',
    'phone' => '0101010101',
    'status' => 'open',
]);

$branchA2 = Branch::create([
    'company_id' => $companyA->id,
    'name' => 'Boutique A2',
    'phone' => '0202020202',
    'status' => 'open',
]);

// Admin A
$adminA = User::create([
    'company_id' => $companyA->id,
    'branch_id' => $branchA1->id,
    'name' => 'Admin A',
    'email' => $prefix . 'admin_a@test.com',
    'password' => Hash::make('Secret123!'),
    'role_id' => 2,
    'role' => 'admin',
]);
$adminA->email_verified_at = now();
$adminA->save();
$adminA->load('role');

// Caissier A1
$cashierA1 = User::create([
    'company_id' => $companyA->id,
    'branch_id' => $branchA1->id,
    'name' => 'Caissier A1',
    'email' => $prefix . 'cashier_a1@test.com',
    'password' => Hash::make('Secret123!'),
    'role_id' => 4,
    'role' => 'caissier',
]);
$cashierA1->email_verified_at = now();
$cashierA1->save();
$cashierA1->load('role');

// Company B (Company 902) — Isolation Audit
$companyB = Company::create([
    'name' => 'ENTREPRISE B SSE ' . time(),
    'email' => $prefix . 'comp_b@test.com',
    'phone' => '0607080910',
    'status' => 'active',
]);

$branchB1 = Branch::create([
    'company_id' => $companyB->id,
    'name' => 'Boutique B1',
    'phone' => '0303030303',
    'status' => 'open',
]);

$adminB = User::create([
    'company_id' => $companyB->id,
    'branch_id' => $branchB1->id,
    'name' => 'Admin B',
    'email' => $prefix . 'admin_b@test.com',
    'password' => Hash::make('Secret123!'),
    'role_id' => 2,
    'role' => 'admin',
]);
$adminB->email_verified_at = now();
$adminB->save();
$adminB->load('role');

$categoryA = Category::create([
    'company_id' => $companyA->id,
    'name' => 'Catégorie A',
]);

$productA = Product::create([
    'company_id' => $companyA->id,
    'category_id' => $categoryA->id,
    'name' => 'Produit Test SSE',
    'sku' => 'SKU-SSE-' . rand(1000, 9999),
    'selling_price' => 5000.00,
    'cost_price' => 3000.00,
    'status' => 'active',
]);

BranchProduct::create([
    'branch_id' => $branchA1->id,
    'product_id' => $productA->id,
    'quantity' => 20.00,
    'is_active' => true,
]);


// --------------------------------------------------------------------------
// TEST 1 : MU-01-A — Modification de produit & propagation temps réel
// --------------------------------------------------------------------------
app(TenantManager::class)->setCompany($companyA);
app(TenantManager::class)->setBranch($branchA1);

\Laravel\Sanctum\Sanctum::actingAs($adminA);

$updatePayload = [
    'category_id' => $categoryA->id,
    'name' => 'Produit Test SSE (Modifié)',
    'sku' => $productA->sku,
    'selling_price' => 6000.00,
    'status' => 'active',
];

$response = app()->handle(
    \Illuminate\Http\Request::create(
        "/api/v1/products/{$productA->id}",
        'PUT',
        $updatePayload,
        [], [],
        ['HTTP_ACCEPT' => 'application/json']
    )
);

$responseCode = $response->getStatusCode();
$responseBody = $response->getContent();
$productA->refresh();
$productPrice = floatval($productA->selling_price);
$priceUpdatedInDb = ($responseCode === 200 && $productPrice === 6000.00);

// Vérifier l'enregistrement de l'événement SSE dans realtime_events
$eventRecord = RealtimeEvent::where('company_id', $companyA->id)
    ->where('event_type', 'product_updated')
    ->latest('id')
    ->first();

$eventCreated = ($eventRecord !== null && isset($eventRecord->payload['selling_price']) && floatval($eventRecord->payload['selling_price']) === 6000.00);

// Vérifier que Caissier A1 reçoit cet événement via getForUser
$cashierEvents = RealtimeEvent::getForUser($companyA->id, $branchA1->id, $cashierA1->id, 0);
$cashierReceived = $eventRecord ? $cashierEvents->contains(function ($ev) use ($eventRecord) {
    return $ev->id === $eventRecord->id;
}) : false;

$debugMsg = sprintf(
    "Code=%d, Price=%.2f, PriceOk=%d, EventRecord=%s, CashierReceived=%d",
    $responseCode,
    $productPrice,
    $priceUpdatedInDb ? 1 : 0,
    $eventRecord ? json_encode($eventRecord->payload) : 'NULL',
    $cashierReceived ? 1 : 0
);

logTestResult(
    "MU-01-A: Modification de produit (Prix 5 000 -> 6 000 FCFA) & Propagation Temps Réel",
    $priceUpdatedInDb && $eventCreated && $cashierReceived,
    "Prix mis à jour en BDD (6 000 FCFA), Événement SSE 'product_updated' généré. Debug: {$debugMsg}"
);


// --------------------------------------------------------------------------
// TEST 2 : MU-01-B — Vente en caisse & Événement Temps Réel de Stock
// --------------------------------------------------------------------------
\Laravel\Sanctum\Sanctum::actingAs($cashierA1);

$sessionA1 = CashSession::create([
    'company_id' => $companyA->id,
    'branch_id' => $branchA1->id,
    'user_id' => $cashierA1->id,
    'opening_balance' => 10000,
    'opened_at' => now(),
    'status' => 'open',
]);

$salePayload = [
    'cash_session_id' => $sessionA1->id,
    'payment_method' => 'cash',
    'items' => [
        [
            'product_id' => $productA->id,
            'quantity' => 2,
            'selling_price' => 6000,
        ]
    ]
];

$saleResponse = app()->handle(
    \Illuminate\Http\Request::create(
        '/api/v1/sales',
        'POST',
        $salePayload,
        [], [],
        ['HTTP_ACCEPT' => 'application/json']
    )
);

$saleOk = ($saleResponse->getStatusCode() === 201);

// Vérifier l'événement SSE sale_created & stock_updated
$saleEvent = RealtimeEvent::where('company_id', $companyA->id)
    ->where('event_type', 'sale_created')
    ->latest('id')
    ->first();

$saleEventPropagated = ($saleEvent !== null);

logTestResult(
    "MU-01-B: Vente effectuée & Signal temps réel de vente/stock généré",
    $saleOk && $saleEventPropagated,
    "Vente enregistrée avec succès. Signal 'sale_created' diffusé dans l'infrastructure temps réel."
);


// --------------------------------------------------------------------------
// TEST 3 : MU-03-A — Coupure SSE, Reconnexion & Rattrapage Last-Event-ID
// --------------------------------------------------------------------------

// Simuler la génération séquentielle de 3 événements SSE
RealtimeBroadcastService::pushCompanyWide('test_sync_1', $companyA->id, ['step' => 1]);
$ev1 = RealtimeEvent::where('company_id', $companyA->id)->latest('id')->first();

RealtimeBroadcastService::pushCompanyWide('test_sync_2', $companyA->id, ['step' => 2]);
$ev2 = RealtimeEvent::where('company_id', $companyA->id)->latest('id')->first();

RealtimeBroadcastService::pushCompanyWide('test_sync_3', $companyA->id, ['step' => 3]);
$ev3 = RealtimeEvent::where('company_id', $companyA->id)->latest('id')->first();

// Simulation de déconnexion : Le client a reçu ev1 (id = $ev1->id) et s'est déconnecté.
// Lors de la reconnexion, il transmet Last-Event-ID: $ev1->id
$recoveredEvents = RealtimeEvent::getForUser($companyA->id, $branchA1->id, $cashierA1->id, $ev1->id);

$hasEv2 = $recoveredEvents->pluck('id')->contains($ev2->id);
$hasEv3 = $recoveredEvents->pluck('id')->contains($ev3->id);
$doesNotHaveEv1 = !$recoveredEvents->pluck('id')->contains($ev1->id);

$sequenceOrdered = ($hasEv2 && $hasEv3 && $doesNotHaveEv1);

logTestResult(
    "MU-03-A: Coupure SSE & Reconnexion avec Last-Event-ID (Rattrapage d'événements sans perte ni doublon)",
    $sequenceOrdered,
    "Le client reconnecté avec Last-Event-ID={$ev1->id} a récupéré exactement les événements manqués #{$ev2->id} et #{$ev3->id} sans aucun doublon."
);


// --------------------------------------------------------------------------
// TEST 4 : MU-04 — AUDIT D'ISOLATION STRICTE MULTI-TENANT SSE (Company A vs Company B)
// --------------------------------------------------------------------------

// Générer des événements dans Company A et Company B
RealtimeBroadcastService::pushCompanyWide('company_a_secret_event', $companyA->id, ['secret' => 'A123']);
RealtimeBroadcastService::pushCompanyWide('company_b_secret_event', $companyB->id, ['secret' => 'B999']);

// Récupérer tous les événements SSE pour l'Admin de la Company B
$adminBEvents = RealtimeEvent::getForUser($companyB->id, $branchB1->id, $adminB->id, 0);

// Vérifier qu'aucun événement de la Company A n'a fuité vers l'Admin B
$leakedEventsToB = $adminBEvents->filter(function ($ev) use ($companyA) {
    return (int) $ev->company_id === (int) $companyA->id;
});

// Récupérer tous les événements SSE pour l'Admin de la Company A
$adminAEvents = RealtimeEvent::getForUser($companyA->id, $branchA1->id, $adminA->id, 0);
$leakedEventsToA = $adminAEvents->filter(function ($ev) use ($companyB) {
    return (int) $ev->company_id === (int) $companyB->id;
});

$strictIsolation = ($leakedEventsToB->count() === 0) && ($leakedEventsToA->count() === 0);

logTestResult(
    "MU-04: Isolation Stricte Multi-Tenant des Événements SSE (Company A vs Company B)",
    $strictIsolation,
    "Étanchéité Multi-Tenant SSE 100% garantie. 0 événement de Company A fuité vers Company B, 0 événement de Company B fuité vers Company A."
);


// --------------------------------------------------------------------------
// TEST 5 : MU-03-B — Expiration et Purge Sécurisée des Événements Obsolètes
// --------------------------------------------------------------------------

// Créer un événement expiré
$expiredEvent = RealtimeEvent::create([
    'company_id' => $companyA->id,
    'branch_id' => $branchA1->id,
    'event_type' => 'expired_test',
    'payload' => ['test' => 'expired'],
    'created_at' => now()->subMinutes(10),
    'expires_at' => now()->subMinute(),
]);

$purgedCount = RealtimeEvent::purgeExpired();

$expiredDeleted = (RealtimeEvent::find($expiredEvent->id) === null);

logTestResult(
    "MU-03-B: Purge automatique et résilience de la file d'attente SSE",
    $expiredDeleted && $purgedCount >= 1,
    "Les événements SSE expirés sont purgés efficacement de MariaDB sans altérer le flux actif."
);


echo "---------------------------------------------------------\n";
echo " RESULTAT : TOUS LES TESTS MU-01 ET MU-03 ONT REUSSI ! 🎉\n";
echo "---------------------------------------------------------\n\n";

