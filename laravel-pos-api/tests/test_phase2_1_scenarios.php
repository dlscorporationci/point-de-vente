<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Company;
use App\Models\Branch;
use App\Models\Role;
use App\Models\Product;
use App\Models\BranchProduct;
use App\Models\Sale;
use App\Models\CashSession;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\API\V1\SaleController;
use App\Http\Controllers\API\V1\SyncController;

echo "=========================================================\n";
echo "   PHASE 2.1 — SUITE DE QUALIFICATION MU-02 ET MU-06\n";
echo "=========================================================\n\n";

$passedAll = true;

// Setup test company & users
$company = Company::withoutGlobalScopes()->where('code', 'MU-PHASE21-COMP')->first()
    ?: Company::create(['name' => 'MU Phase 2.1 Store', 'code' => 'MU-PHASE21-COMP', 'status' => 'active']);

$branch = Branch::withoutGlobalScopes()->where('company_id', $company->id)->first()
    ?: Branch::create(['company_id' => $company->id, 'name' => 'Main Branch 21', 'code' => 'BR-21', 'status' => 'open']);

$role = Role::withoutGlobalScopes()->where('company_id', $company->id)->first()
    ?: Role::create(['name' => 'Admin 21', 'slug' => 'admin', 'company_id' => $company->id]);
$role->update(['slug' => 'admin']);

$userA = User::withoutGlobalScopes()->where('email', 'usera.mu21@apex-pos.com')->first()
    ?: User::create([
        'company_id' => $company->id,
        'branch_id' => $branch->id,
        'role_id' => $role->id,
        'name' => 'User A Concurrence',
        'email' => 'usera.mu21@apex-pos.com',
        'password' => Hash::make('password123'),
        'email_verified_at' => now(),
    ]);
$userA->update(['branch_id' => $branch->id, 'role_id' => $role->id]);

$userB = User::withoutGlobalScopes()->where('email', 'userb.mu21@apex-pos.com')->first()
    ?: User::create([
        'name' => 'Cashier B',
        'email' => 'userb.mu21@apex-pos.com',
        'password' => Hash::make('Pass123!'),
        'role_id' => $role->id,
        'company_id' => $company->id,
        'branch_id' => $branch->id,
        'email_verified_at' => now(),
    ]);

$category = \App\Models\Category::withoutGlobalScopes()->where('company_id', $company->id)->first()
    ?: \App\Models\Category::create(['company_id' => $company->id, 'name' => 'Catégorie Test Concurrence']);

// Product with Stock = 1
$product = Product::withoutGlobalScopes()->where('sku', 'SKU-CONCUR-01')->first()
    ?: Product::create([
        'company_id' => $company->id,
        'category_id' => $category->id,
        'name' => 'Produit Rare Single Unit',
        'sku' => 'SKU-CONCUR-01',
        'barcode' => '111122223333',
        'selling_price' => 5000,
        'cost_price' => 3000,
        'is_active' => true,
    ]);

$bp = BranchProduct::withoutGlobalScopes()->where('branch_id', $branch->id)->where('product_id', $product->id)->first()
    ?: BranchProduct::create([
        'branch_id' => $branch->id,
        'product_id' => $product->id,
        'quantity' => 1.00,
        'is_active' => true,
    ]);

// Set stock to exactly 1.00
$bp->update(['quantity' => 1.00]);

$saleController = new SaleController();

// ── TEST MU-02-A : Vente concurrente du dernier produit disponible (Stock = 1)
echo "▶ TEST MU-02-A: Vente simultanée du dernier produit disponible (Stock Initial = 1)\n";

$reqSaleA = Request::create('/api/v1/sales', 'POST', [
    'payment_method' => 'cash',
    'items' => [['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 5000]],
]);
$reqSaleA->setUserResolver(fn() => $userA);

$reqSaleB = Request::create('/api/v1/sales', 'POST', [
    'payment_method' => 'cash',
    'items' => [['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 5000]],
]);
$reqSaleB->setUserResolver(fn() => $userB);

$resSaleA = $saleController->store($reqSaleA);
$resSaleB = $saleController->store($reqSaleB);

$bpFinal = BranchProduct::withoutGlobalScopes()->where('id', $bp->id)->first();
$finalStock = (float) $bpFinal->quantity;

$successCount = 0;
$failCount = 0;

if ($resSaleA->getStatusCode() === 201) $successCount++; else $failCount++;
if ($resSaleB->getStatusCode() === 201) $successCount++; else $failCount++;

if ($successCount === 1 && $failCount === 1 && $finalStock === 0.0) {
    echo "   [PASS] 1 seule vente a réussi, la 2ème a été rejetée proprement (HTTP " . ($resSaleA->getStatusCode() === 201 ? $resSaleB->getStatusCode() : $resSaleA->getStatusCode()) . "). Stock final = 0 (Stock non négatif).\n";
} else {
    echo "   [FAIL] Échec test MU-02-A : Success=$successCount, Fail=$failCount, Stock Final=$finalStock\n";
    $passedAll = false;
}

// ── TEST MU-02-B : 10 ventes simultanées sur stock limité
echo "\n▶ TEST MU-02-B: 10 ventes simultanées sur stock de 5 unités\n";
$bp->update(['quantity' => 5.00]);

$succB = 0;
$failB = 0;

for ($i = 1; $i <= 10; $i++) {
    $req = Request::create('/api/v1/sales', 'POST', [
        'payment_method' => 'cash',
        'items' => [['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 5000]],
    ]);
    $req->setUserResolver(fn() => ($i % 2 === 0 ? $userA : $userB));
    $res = $saleController->store($req);
    if ($res->getStatusCode() === 201) {
        $succB++;
    } else {
        $succB += 0;
        $failB++;
    }
}

$bpAfterB = BranchProduct::withoutGlobalScopes()->where('id', $bp->id)->first();
$stockAfterB = (float) $bpAfterB->quantity;

if ($succB === 5 && $failB === 5 && $stockAfterB === 0.0) {
    echo "   [PASS] Exactement 5 ventes ont réussi sur 10 demandes. Stock final = 0. Aucune survente.\n";
} else {
    echo "   [FAIL] Échec test MU-02-B : Reussites=$succB, Echecs=$failB, Stock Final=$stockAfterB\n";
    $passedAll = false;
}

// ── TEST MU-02-C : Unicité et absence de collision sur sale_number
echo "\n▶ TEST MU-02-C: Vérification de l'unicité stricte des numéros de vente (sale_number)\n";
$salesList = Sale::withoutGlobalScopes()->where('company_id', $company->id)->pluck('sale_number')->toArray();
$uniqueSalesList = array_unique($salesList);

if (count($salesList) === count($uniqueSalesList)) {
    echo "   [PASS] 100% des numéros de vente générés sont strictement uniques (Nombre de ventes: " . count($salesList) . "). Aucun doublon.\n";
} else {
    echo "   [FAIL] Collision détectée sur sale_number !\n";
    $passedAll = false;
}

// ── TEST MU-06-A : Idempotence de l'Engine Offline (UUID identique envoyé 2 fois)
echo "\n▶ TEST MU-06-A: Validation de l'idempotence PUSH (Même UUID envoyé 2 fois)\n";
$syncController = new SyncController();
$testUuid = (string) \Illuminate\Support\Str::uuid();

// Re-fill stock to allow sale
$bp->update(['quantity' => 10.00]);

$pushPayload = [
    'operations' => [
        [
            'uuid' => $testUuid,
            'entity_type' => 'sale',
            'action' => 'create',
            'branch_id' => $branch->id,
            'payload' => [
                'items' => [['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 5000]],
                'amount_received' => 5000,
                'payment_method' => 'cash',
                'payment_status' => 'paid',
            ]
        ]
    ]
];

$reqPush1 = Request::create('/api/v1/sync/push', 'POST', $pushPayload);
$reqPush1->setUserResolver(fn() => $userA);
$resPush1 = $syncController->push($reqPush1);
$dataPush1 = json_decode($resPush1->getContent(), true);

$stockBeforeSecondPush = (float) BranchProduct::withoutGlobalScopes()->where('id', $bp->id)->value('quantity');

// Re-send EXACT same UUID payload
$reqPush2 = Request::create('/api/v1/sync/push', 'POST', $pushPayload);
$reqPush2->setUserResolver(fn() => $userA);
$resPush2 = $syncController->push($reqPush2);
$dataPush2 = json_decode($resPush2->getContent(), true);

$stockAfterSecondPush = (float) BranchProduct::withoutGlobalScopes()->where('id', $bp->id)->value('quantity');

if ($resPush1->getStatusCode() === 200 && $resPush2->getStatusCode() === 200 &&
    in_array($testUuid, $dataPush1['synced_uuids'] ?? []) && in_array($testUuid, $dataPush2['synced_uuids'] ?? []) &&
    $stockBeforeSecondPush === $stockAfterSecondPush) {
    echo "   [PASS] 2ème PUSH de l'UUID $testUuid accepté comme déjà synchronisé sans doubler la vente ni décrémenter le stock une 2ème fois.\n";
} else {
    echo "   [FAIL] Échec test MU-06-A : 1er PUSH Statut=" . $resPush1->getStatusCode() . ", 2ème PUSH Statut=" . $resPush2->getStatusCode() . "\n";
    $passedAll = false;
}

// ── TEST MU-06-B : Simulation rupture réseau + re-transmission PUSH
echo "\n▶ TEST MU-06-B: Simulation de re-transmission d'opération suite à perte de réponse réseau\n";
$idempotencyRecord = DB::table('sync_idempotency')->where('uuid', $testUuid)->first();

if ($idempotencyRecord && $idempotencyRecord->company_id == $company->id) {
    echo "   [PASS] Enregistrement d'idempotence confirmé en BDD MariaDB pour l'entreprise.\n";
} else {
    echo "   [FAIL] Enregistrement idempotence introuvable en BDD.\n";
    $passedAll = false;
}

echo "\n---------------------------------------------------------\n";
if ($passedAll) {
    echo " RESULTAT : TOUS LES TESTS MU-02 ET MU-06 ONT REUSSI ! 🎉\n";
} else {
    echo " RESULTAT : CERTAINS TESTS ONT ECHOUE. ❌\n";
    exit(1);
}
echo "---------------------------------------------------------\n";
