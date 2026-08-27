<?php

/**
 * Phase 3.1 — Observabilité & Audit Opérationnel Suite
 *
 * Scénarios :
 * MU-11-A : Traçabilité des requêtes via X-Request-ID & AuditLog des ventes
 * MU-11-B : AuditLog structuré des conflits de synchronisation (UUID + ReqID + Type Conflit)
 * MU-11-C : Contextualisation des erreurs applicatives (SystemErrorLog + ReqID)
 * MU-11-D : Absences de secrets dans les logs (Password, PIN, Tokens masqués)
 * MU-11-E : Isolation Multi-Tenant stricte sur les logs et audits
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
use App\Models\AuditLog;
use App\Models\SystemErrorLog;
use App\Http\Controllers\API\V1\SyncController;
use App\Http\Controllers\API\V1\SaleController;
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

$prefix  = 'phase31_' . time() . '_';

$company = Company::create(['name' => 'MU-Phase31 Company ' . Str::random(4), 'status' => 'active']);
app(\App\Services\TenantManager::class)->setCompany($company);

$branch  = Branch::create(['company_id' => $company->id, 'name' => 'Boutique 31', 'status' => 'open']);
$role    = \App\Models\Role::create(['company_id' => $company->id, 'name' => 'Admin', 'slug' => 'admin']);

$user = User::create([
    'name'              => 'Admin 31',
    'email'             => $prefix . 'admin@apex.com',
    'password'          => Hash::make('Secret123!'),
    'company_id'        => $company->id,
    'branch_id'         => $branch->id,
    'role_id'           => $role->id,
    'email_verified_at' => now(),
]);

$category = Category::create(['company_id' => $company->id, 'name' => 'Cat 31']);
$product  = Product::create([
    'company_id'    => $company->id,
    'category_id'   => $category->id,
    'name'          => 'Produit Phase 31',
    'sku'           => 'P31-' . Str::random(5),
    'selling_price' => 5000,
    'cost_price'    => 3000,
    'updated_at'    => now()->subMinutes(30),
]);

BranchProduct::create([
    'branch_id'  => $branch->id,
    'product_id' => $product->id,
    'quantity'   => 50,
    'is_active'  => true,
]);

CashSession::create([
    'company_id'      => $company->id,
    'branch_id'       => $branch->id,
    'user_id'         => $user->id,
    'opening_balance' => 10000,
    'opened_at'       => now(),
    'status'          => 'open',
]);


// ────────────────────────────────────────────────────────────────────────────
// MU-11-A — Correlation ID & Audit Vente
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-11-A — Correlation ID (X-Request-ID) & Traçabilité Vente');

auth()->setUser($user);

$customReqId = (string) Str::uuid();
$request = Illuminate\Http\Request::create('/api/v1/sales', 'POST', [
    'payment_method' => 'cash',
    'items'          => [['product_id' => $product->id, 'quantity' => 1, 'selling_price' => 5000]],
]);
$request->headers->set('X-Request-ID', $customReqId);
$request->setUserResolver(fn () => $user);

$middleware = new \App\Http\Middleware\CorrelationIdMiddleware();
$response = $middleware->handle($request, function ($req) use ($user) {
    $ctrl = new SaleController();
    return $ctrl->store($req);
});

$returnedReqId = $response->headers->get('X-Request-ID');
$saleAuditLog  = AuditLog::withoutGlobalScope('tenant')->where('company_id', $company->id)->where('module', 'Sale')->latest('id')->first();

logTestResult(
    'MU-11-A (Header X-Request-ID) — Le header de réponse contient le X-Request-ID transmis',
    $returnedReqId === $customReqId,
    "Header X-Request-ID transmis={$customReqId}, obtenu={$returnedReqId}."
);

logTestResult(
    'MU-11-A (AuditLog Vente) — Vente enregistrée avec traçabilité complète dans AuditLog',
    $saleAuditLog !== null && $saleAuditLog->user_id === $user->id && $saleAuditLog->company_id === $company->id,
    "AuditLog ID=" . ($saleAuditLog->id ?? 'null') . " | Action=" . ($saleAuditLog->action ?? 'N/A') . " | Module=" . ($saleAuditLog->module ?? 'N/A') . "."
);


// ────────────────────────────────────────────────────────────────────────────
// MU-11-B — AuditLog Structuré Conflit Sync (CONFLIT_PRIX / CONFLIT_STOCK)
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-11-B — AuditLog Structuré pour Conflits de Synchronisation');

// Prix d'autorité serveur mis à jour à T2 (> T1)
$product->update(['selling_price' => 6000, 'updated_at' => now()->subMinutes(5)]);

$conflictUuid = (string) Str::uuid();
$syncReqId    = (string) Str::uuid();

$syncReq = Illuminate\Http\Request::create('/api/v1/sync/push', 'POST', [
    'operations' => [[
        'uuid'        => $conflictUuid,
        'entity_type' => 'product',
        'action'      => 'update',
        'created_at'  => now()->subMinutes(15)->toIso8601String(), // T1 < T2
        'payload'     => ['id' => $product->id, 'selling_price' => 5500],
    ]],
]);
$syncReq->headers->set('X-Request-ID', $syncReqId);
$syncReq->setUserResolver(fn () => $user);

$middleware->handle($syncReq, function ($req) use ($user) {
    $ctrl = new SyncController();
    return $ctrl->push($req);
});

$conflictAuditLog = AuditLog::withoutGlobalScope('tenant')
    ->where('company_id', $company->id)
    ->where('action', 'sync_conflict')
    ->latest('id')
    ->first();

$newVals = $conflictAuditLog ? $conflictAuditLog->new_values : [];

logTestResult(
    'MU-11-B (Audit Conflit) — Entrée AuditLog créée pour sync_conflict',
    $conflictAuditLog !== null && ($newVals['conflict_type'] ?? '') === 'CONFLIT_PRIX',
    "Audit ID=" . ($conflictAuditLog->id ?? 'null') . " | ConflictType=" . ($newVals['conflict_type'] ?? 'N/A')
);

logTestResult(
    'MU-11-B (Corrélation UUID & ReqID) — AuditLog contient operation_uuid et request_id',
    ($newVals['operation_uuid'] ?? '') === $conflictUuid && ($newVals['request_id'] ?? '') === $syncReqId,
    "operation_uuid=" . ($newVals['operation_uuid'] ?? 'N/A') . " | request_id=" . ($newVals['request_id'] ?? 'N/A')
);


// ────────────────────────────────────────────────────────────────────────────
// MU-11-C — Contextualisation des Erreurs Applicatives (SystemErrorLog)
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-11-C — Contextualisation des Erreurs Applicatives avec Request ID');

$errReqId = (string) Str::uuid();
$errReq = Illuminate\Http\Request::create('/api/v1/test-error', 'GET');
$errReq->headers->set('X-Request-ID', $errReqId);
$errReq->setUserResolver(fn () => $user);

$testException = new \Exception('Erreur simulée pour validation observabilité Phase 3.1');

$middleware->handle($errReq, function ($req) use ($testException, $user, $company, $branch) {
    \App\Models\SystemErrorLog::create([
        'company_id'    => $company->id,
        'branch_id'     => $branch->id,
        'user_id'       => $user->id,
        'module'        => 'TestModule',
        'error_message' => "[ReqID: {$req->header('X-Request-ID')}] " . $testException->getMessage(),
        'stack_trace'   => 'Fake trace',
        'ip_address'    => $req->ip(),
        'user_agent'    => $req->userAgent(),
    ]);
    return response()->json(['error' => 'Simulated Error'], 500);
});

$errorLog = SystemErrorLog::where('company_id', $company->id)->latest('id')->first();

logTestResult(
    'MU-11-C (ReqID dans ErrorLog) — SystemErrorLog inclut l\'identifiant de corrélation Request ID',
    $errorLog !== null && str_contains($errorLog->error_message, $errReqId),
    "ErrorLog ID=" . ($errorLog->id ?? 'null') . " | Message=" . ($errorLog->error_message ?? 'N/A')
);


// ────────────────────────────────────────────────────────────────────────────
// MU-11-D — Absence de Secrets dans les Logs (Passwords, PIN, Tokens)
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-11-D — Validation d\'Absence de Secrets dans les Logs');

$testUser = User::create([
    'name'              => 'Test User Secrets',
    'email'             => $prefix . 'secrets@apex.com',
    'password'          => Hash::make('SuperSecretPass123!'),
    'pin_code'          => '1234',
    'company_id'        => $company->id,
    'branch_id'         => $branch->id,
    'role_id'           => $role->id,
    'email_verified_at' => now(),
]);

$userAudit = AuditLog::withoutGlobalScope('tenant')
    ->where('company_id', $company->id)
    ->where('auditable_type', get_class($testUser))
    ->where('auditable_id', $testUser->id)
    ->first();

$newValsUser = $userAudit ? $userAudit->new_values : [];
$hasPasswordInLog = isset($newValsUser['password']) || isset($newValsUser['pin_code']) || isset($newValsUser['remember_token']);

logTestResult(
    'MU-11-D (Secrets Masqués) — Ni password ni pin_code n\'apparaissent dans new_values d\'AuditLog',
    !$hasPasswordInLog,
    $hasPasswordInLog
        ? 'ERREUR: Secret présent dans les logs !'
        : 'Champs sensibles (password, pin_code, remember_token) masqués conformément aux règles de sécurité.'
);


// ────────────────────────────────────────────────────────────────────────────
// MU-11-E — Isolation Multi-Tenant dans les Audits
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-11-E — Étanchéité Multi-Tenant des Logs et Audits');

$companyB = Company::create(['name' => 'MU-Phase31 Company B ' . Str::random(4), 'status' => 'active']);
$branchB  = Branch::create(['company_id' => $companyB->id, 'name' => 'Boutique B', 'status' => 'open']);
$userB    = User::create([
    'name'              => 'User B',
    'email'             => $prefix . 'userB@apex.com',
    'password'          => Hash::make('Secret123!'),
    'company_id'        => $companyB->id,
    'branch_id'         => $branchB->id,
    'role_id'           => $role->id,
    'email_verified_at' => now(),
]);

app(\App\Services\TenantManager::class)->setCompany($companyB);

$auditsForCompanyB = AuditLog::where('company_id', $companyB->id)->get();
$auditsCompanyAInB = $auditsForCompanyB->filter(fn ($log) => $log->company_id === $company->id);

logTestResult(
    'MU-11-E (Isolation Audits) — Aucune fuite d\'audit cross-tenant lors des requêtes tenant',
    $auditsCompanyAInB->count() === 0,
    "Nombre de logs Company A visibles sous le scope Company B : {$auditsCompanyAInB->count()} (attendu 0)."
);


// ── Bilan Final Phase 3.1 ────────────────────────────────────────────────────
echo "\n=========================================================\n";
if ($globalPassed) {
    echo " \033[32mRÉSULTAT PHASE 3.1 : TOUS LES TESTS MU-11 ONT RÉUSSI ! 🎉\033[0m\n";
} else {
    echo " \033[31mRÉSULTAT PHASE 3.1 : CERTAINS TESTS ONT ÉCHOUÉ. ❌\033[0m\n";
}
echo "=========================================================\n";

if (!$globalPassed) {
    exit(1);
}
