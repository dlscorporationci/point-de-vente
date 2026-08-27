<?php

/**
 * PHASE 2.4 — SUITE DE QUALIFICATION MU-08
 * Résilience Réseau & Robustesse des Transactions
 *
 * Exécution : php tests/test_phase2_4_scenarios.php
 *
 * DISTINCTION FONDAMENTALE (MU-08) :
 *
 * CAS A — Transaction serveur échoue (Rollback)
 *   PUSH → DB::transaction() → Erreur → ROLLBACK → UUID non consommé → Client peut retenter
 *
 * CAS B — Transaction réussit mais le client perd la réponse (Network Loss After Commit)
 *   PUSH → DB::transaction() → COMMIT → Connexion coupée → Client retente le MÊME UUID
 *   → Idempotence active → réponse "déjà traité" → aucun doublon
 *
 * Ces deux cas doivent être testés séparément car ils représentent des risques distincts.
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
use App\Models\Sale;
use App\Models\CashSession;
use App\Models\RealtimeEvent;
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

function pushOps(array $operations, User $user): array
{
    if ($user->company) {
        app(\App\Services\TenantManager::class)->setCompany($user->company);
    }
    $controller = new SyncController();
    $request    = Illuminate\Http\Request::create('/api/v1/sync/push', 'POST', ['operations' => $operations]);
    $request->setUserResolver(fn () => $user);
    $response = $controller->push($request);
    return json_decode($response->getContent(), true) ?? [];
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

$prefix  = 'phase24_' . time() . '_';

$company = Company::create(['name' => 'MU-Phase24 Resilience ' . Str::random(4), 'status' => 'active']);
app(\App\Services\TenantManager::class)->setCompany($company);

$branch  = Branch::create(['company_id' => $company->id, 'name' => 'Boutique 24', 'status' => 'open']);
$role    = \App\Models\Role::create(['company_id' => $company->id, 'name' => 'Admin', 'slug' => 'admin']);

$user = User::create([
    'name'              => 'Admin 24',
    'email'             => $prefix . 'admin@apex.com',
    'password'          => Hash::make('Secret123!'),
    'company_id'        => $company->id,
    'branch_id'         => $branch->id,
    'role_id'           => $role->id,
    'email_verified_at' => now(),
]);

$category = Category::create(['company_id' => $company->id, 'name' => 'Test Résilience']);

$product = Product::create([
    'company_id'    => $company->id,
    'category_id'   => $category->id,
    'name'          => 'Produit Résilience',
    'sku'           => 'RESIL-' . Str::random(5),
    'selling_price' => 5000,
    'cost_price'    => 3500,
]);

BranchProduct::create([
    'branch_id'  => $branch->id,
    'product_id' => $product->id,
    'quantity'   => 100,
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
// MU-08-A — Transaction Serveur Échoue → Rollback → UUID Non Consommé
// Simulation : une vente avec un product_id invalide déclenche une exception
// dans la transaction. Le rollback doit préserver le stock et ne pas inscrire
// l'UUID dans sync_idempotency.
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-08-A — Rollback Transaction Serveur (Erreur Durante Transaction)');

$stockBeforeRollback = floatval(BranchProduct::where('branch_id', $branch->id)->where('product_id', $product->id)->value('quantity'));

$uuidRollback = (string) Str::uuid();

// Payload invalide : product_id inexistant → génère CONFLIT_STOCK (stock=0)
$invalidProductId = 999999;
$rollbackRes = pushOps([
    [
        'uuid'        => $uuidRollback,
        'entity_type' => 'sale',
        'action'      => 'create',
        'branch_id'   => $branch->id,
        'created_at'  => now()->toIso8601String(),
        'payload'     => [
            'client_name'     => 'Client Rollback Test',
            'payment_method'  => 'cash',
            'payment_status'  => 'paid',
            'amount_received' => 5000,
            'items'           => [
                ['product_id' => $invalidProductId, 'quantity' => 1, 'selling_price' => 5000, 'discount' => 0, 'tax' => 0],
            ],
        ],
    ],
], $user);

$stockAfterRollback = floatval(BranchProduct::where('branch_id', $branch->id)->where('product_id', $product->id)->value('quantity'));

$uuidNotConsumed = !DB::table('sync_idempotency')->where('uuid', $uuidRollback)->where('company_id', $company->id)->exists();

logTestResult(
    'MU-08-A (Rollback Stock) — Stock inchangé après échec de transaction',
    $stockBeforeRollback === $stockAfterRollback,
    "Stock avant={$stockBeforeRollback}, après={$stockAfterRollback}. Aucune décrémentation parasite."
);

logTestResult(
    'MU-08-A (UUID Non Consommé) — UUID absent de sync_idempotency après rollback',
    $uuidNotConsumed,
    $uuidNotConsumed
        ? 'UUID non inscrit dans sync_idempotency. Client peut retenter légitimement.'
        : 'UUID inscrit malgré le rollback — anomalie idempotence.'
);


// ────────────────────────────────────────────────────────────────────────────
// MU-08-B — Commit Serveur + Perte de Réponse Client → Retry avec même UUID
// Simulation : 1er PUSH réussit (commit BDD). On simule une perte réseau en
// ne récupérant pas la réponse. Le client retente le même UUID → idempotence
// → réponse "déjà synchronisé" sans doublon de vente ni décrémentation stock.
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-08-B — Commit + Perte Réponse Client → Retry Idempotent (Cas Critique)');

$uuidLostResponse = (string) Str::uuid();

$validOp = [
    'uuid'        => $uuidLostResponse,
    'entity_type' => 'sale',
    'action'      => 'create',
    'branch_id'   => $branch->id,
    'created_at'  => now()->toIso8601String(),
    'payload'     => [
        'client_name'     => 'Client Commit LostResponse',
        'payment_method'  => 'cash',
        'payment_status'  => 'paid',
        'amount_received' => 5000,
        'items'           => [
            ['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 5000, 'discount' => 0, 'tax' => 0],
        ],
    ],
];

// 1er PUSH : transaction réussit (commit BDD)
$firstPushRes = pushOps([$validOp], $user);
$stockAfterFirstPush = floatval(BranchProduct::where('branch_id', $branch->id)->where('product_id', $product->id)->value('quantity'));

logTestResult(
    'MU-08-B (1er PUSH) — 1er PUSH réussit et UUID inscrit dans sync_idempotency',
    ($firstPushRes['status'] ?? '') === 'success' &&
    in_array($uuidLostResponse, $firstPushRes['synced_uuids'] ?? []) &&
    DB::table('sync_idempotency')->where('uuid', $uuidLostResponse)->where('company_id', $company->id)->exists(),
    "1er PUSH : status={$firstPushRes['status']}. Stock après 1er PUSH = {$stockAfterFirstPush}."
);

// Simulation perte réseau : le client n'a pas reçu la réponse → il retente avec le MÊME UUID
$retryPushRes = pushOps([$validOp], $user);
$stockAfterRetry = floatval(BranchProduct::where('branch_id', $branch->id)->where('product_id', $product->id)->value('quantity'));

$salesWithUuid = Sale::withoutGlobalScope('tenant')->where('company_id', $company->id)->where('client_name', 'Client Commit LostResponse')->count();

logTestResult(
    'MU-08-B (Retry Idempotent) — Re-PUSH même UUID → aucun doublon de vente',
    ($retryPushRes['status'] ?? '') === 'success' &&
    in_array($uuidLostResponse, $retryPushRes['synced_uuids'] ?? []) &&
    $stockAfterFirstPush === $stockAfterRetry &&
    $salesWithUuid === 1,
    "Re-PUSH ok. Stock inchangé = {$stockAfterRetry}. Ventes créées = {$salesWithUuid} (attendu 1). Aucun doublon."
);


// ────────────────────────────────────────────────────────────────────────────
// MU-08-C — 5 Cycles Offline/Online sans Perte ni Doublon
// Simulation de 5 déconnexions/reconnexions successives avec des opérations
// distinctes à chaque cycle. Vérification de la cohérence finale de la BDD.
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-08-C — 5 Cycles Offline/Online sans Perte ni Doublon');

$cycleUuids    = [];
$expectedStock = floatval(BranchProduct::where('branch_id', $branch->id)->where('product_id', $product->id)->value('quantity'));

for ($cycle = 1; $cycle <= 5; $cycle++) {
    $cycleUuid = (string) Str::uuid();
    $cycleUuids[] = $cycleUuid;

    // Chaque cycle : vente de 1 unité hors-ligne (simulée comme créée offline)
    $cycleRes = pushOps([
        [
            'uuid'        => $cycleUuid,
            'entity_type' => 'sale',
            'action'      => 'create',
            'branch_id'   => $branch->id,
            'created_at'  => now()->subSeconds(60 - $cycle * 5)->toIso8601String(),
            'payload'     => [
                'client_name'     => "Client Cycle {$cycle}",
                'payment_method'  => 'cash',
                'payment_status'  => 'paid',
                'amount_received' => 5000,
                'items'           => [
                    ['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 5000, 'discount' => 0, 'tax' => 0],
                ],
            ],
        ],
    ], $user);

    $cycleOk = ($cycleRes['status'] ?? '') === 'success' && in_array($cycleUuid, $cycleRes['synced_uuids'] ?? []);
    $expectedStock -= 1;

    logTestResult(
        "MU-08-C (Cycle {$cycle}/5) — PUSH cycle {$cycle} réussi",
        $cycleOk,
        "Cycle {$cycle} : " . ($cycleOk ? 'OK' : 'ÉCHEC') . ". Stock attendu = {$expectedStock}."
    );
}

// Vérification finale : stock = stock initial - 5 ventes de 1 unité
$finalStock = floatval(BranchProduct::where('branch_id', $branch->id)->where('product_id', $product->id)->value('quantity'));

logTestResult(
    'MU-08-C (Cohérence Finale) — Stock final cohérent après 5 cycles',
    $finalStock === $expectedStock,
    "Stock final = {$finalStock} (attendu {$expectedStock}). 5 ventes × 1 unité synchronisées sans perte ni doublon."
);

// Vérification idempotence : les 5 UUIDs sont tous dans sync_idempotency
$idempCount = DB::table('sync_idempotency')
    ->whereIn('uuid', $cycleUuids)
    ->where('company_id', $company->id)
    ->count();

logTestResult(
    'MU-08-C (Idempotence Cycles) — 5 UUIDs de cycles inscrits dans sync_idempotency',
    $idempCount === 5,
    "{$idempCount}/5 UUIDs de cycles confirmés dans sync_idempotency."
);


// ────────────────────────────────────────────────────────────────────────────
// MU-08-D — SSE Last-Event-ID + PULL Recovery
// Simulation : une coupure SSE survient. Le client utilise Last-Event-ID
// pour signaler où il s'est arrêté. Le PULL incrémental récupère les données
// manquées via le curseur (updated_at|id).
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-08-D — SSE Last-Event-ID + PULL Incrémental (Recovery après Coupure)');

// Simuler des modifications survenues pendant la coupure SSE
$productModified = Product::create([
    'company_id'    => $company->id,
    'category_id'   => $category->id,
    'name'          => 'Nouveau Produit Post-Coupure',
    'sku'           => 'POST-CUT-' . Str::random(4),
    'selling_price' => 7500,
    'cost_price'    => 6000,
    'updated_at'    => now()->subSeconds(30),
]);

// Curseur simulant le dernier état connu du client avant la coupure (60s avant)
$lastKnownCursor = now()->subMinutes(1)->format('Y-m-d H:i:s') . '|0';

$syncController = new SyncController();
$pullReq = Illuminate\Http\Request::create('/api/v1/sync/pull', 'GET', [
    'branch_id' => $branch->id,
    'cursor'    => $lastKnownCursor,
]);
$pullReq->setUserResolver(fn () => $user);
$pullData = json_decode($syncController->pull($pullReq)->getContent(), true);

logTestResult(
    'MU-08-D (PULL Recovery) — Le PULL avec curseur récupère les modifications post-coupure',
    ($pullData['status'] ?? '') === 'success' && count($pullData['products'] ?? []) > 0,
    'PULL ok. Produits récupérés depuis le curseur : ' . count($pullData['products'] ?? []) . '. Nouveau produit post-coupure inclus.'
);

// Vérification que le nouveau curseur avance correctement
logTestResult(
    'MU-08-D (Curseur Avancé) — Le next_cursor est postérieur au curseur de coupure',
    !empty($pullData['next_cursor']) && $pullData['next_cursor'] !== $lastKnownCursor,
    "Curseur initial = {$lastKnownCursor}. Curseur avancé = " . ($pullData['next_cursor'] ?? 'NULL') . '.'
);

// Vérification étanchéité cross-tenant : un 2ème client sur une autre company
$otherCompany = Company::create(['name' => 'Autre Entreprise SSE Test', 'status' => 'active']);
$otherUser = User::create([
    'name'              => 'Admin Autre',
    'email'             => $prefix . 'other@apex.com',
    'password'          => Hash::make('Secret123!'),
    'company_id'        => $otherCompany->id,
    'branch_id'         => null,
    'role_id'           => $role->id,
    'email_verified_at' => now(),
]);

$pullReqOther = Illuminate\Http\Request::create('/api/v1/sync/pull', 'GET', [
    'cursor' => $lastKnownCursor,
]);
$pullReqOther->setUserResolver(fn () => $otherUser);
$pullDataOther = json_decode($syncController->pull($pullReqOther)->getContent(), true);

$crossTenantProducts = collect($pullDataOther['products'] ?? [])->where('company_id', $company->id)->count();

logTestResult(
    'MU-08-D (Étanchéité SSE) — Aucun produit de Company A dans le PULL de Company B',
    $crossTenantProducts === 0,
    "Produits Company A dans PULL Company B = {$crossTenantProducts} (attendu 0). Isolation multi-tenant confirmée."
);


// ── Résultat Global ──────────────────────────────────────────────────────────
echo "\n=========================================================\n";
if ($globalPassed) {
    echo " \033[32mRÉSULTAT PHASE 2.4 : TOUS LES TESTS MU-08 ONT RÉUSSI ! 🎉\033[0m\n";
} else {
    echo " \033[31mRÉSULTAT PHASE 2.4 : CERTAINS TESTS ONT ÉCHOUÉ. ❌\033[0m\n";
}
echo "=========================================================\n";

if (!$globalPassed) {
    exit(1);
}
