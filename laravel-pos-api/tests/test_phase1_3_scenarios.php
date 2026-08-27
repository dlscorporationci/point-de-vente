<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Company;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Http\Controllers\API\V1\AuthController;
use Illuminate\Validation\ValidationException;

echo "=========================================================\n";
echo "       PHASE 1.3 — SÉCURISATION & VALIDATION SESSION LOCK\n";
echo "=========================================================\n\n";

// Setup
$companyA = Company::withoutGlobalScopes()->where('code', 'LOCK-COMP-A')->first()
    ?: Company::create(['name' => 'Lock Store A', 'code' => 'LOCK-COMP-A', 'status' => 'active']);

$companyB = Company::withoutGlobalScopes()->where('code', 'LOCK-COMP-B')->first()
    ?: Company::create(['name' => 'Lock Store B', 'code' => 'LOCK-COMP-B', 'status' => 'active']);

$roleA = Role::withoutGlobalScopes()->where('company_id', $companyA->id)->first()
    ?: Role::create(['name' => 'Cashier Lock A', 'slug' => 'cashier-lock-a', 'company_id' => $companyA->id]);

$roleB = Role::withoutGlobalScopes()->where('company_id', $companyB->id)->first()
    ?: Role::create(['name' => 'Cashier Lock B', 'slug' => 'cashier-lock-b', 'company_id' => $companyB->id]);

// Nettoyage
User::withoutGlobalScopes()->whereIn('email', ['user_a@lock.test', 'user_b@lock.test', 'nopin@lock.test'])->delete();

// Utilisateur A chez Company A avec PIN '7890'
$userA = User::create([
    'name' => 'Utilisateur A (Lock Test)',
    'email' => 'user_a@lock.test',
    'password' => Hash::make('PassUserA123!'),
    'pin_code' => Hash::make('7890'), // Vrai PIN est 7890 (PAS 1234)
    'role_id' => $roleA->id,
    'company_id' => $companyA->id,
    'status' => 'active',
]);

// Utilisateur B chez Company B avec PIN '4321'
$userB = User::create([
    'name' => 'Utilisateur B (Lock Test)',
    'email' => 'user_b@lock.test',
    'password' => Hash::make('PassUserB123!'),
    'pin_code' => Hash::make('4321'),
    'role_id' => $roleB->id,
    'company_id' => $companyB->id,
    'status' => 'active',
]);

// Utilisateur sans PIN configuré
$userNoPin = User::create([
    'name' => 'Utilisateur Sans PIN',
    'email' => 'nopin@lock.test',
    'password' => Hash::make('PassUserNoPin123!'),
    'pin_code' => null,
    'role_id' => $roleA->id,
    'company_id' => $companyA->id,
    'status' => 'active',
]);

$controller = new AuthController();

function attemptVerifyPin($controller, ?User $user, string $pinCode) {
    $req = Request::create('/api/v1/auth/unlock-session', 'POST', ['pin_code' => $pinCode]);
    if ($user) {
        $req->setUserResolver(fn() => $user);
    }
    try {
        $res = $controller->verifyPin($req);
        $status = $res->getStatusCode();
        return [
            'success' => ($status === 200),
            'status' => $status,
            'data' => json_decode($res->getContent(), true)
        ];
    } catch (ValidationException $e) {
        return ['success' => false, 'status' => 422, 'error' => $e->getMessage()];
    } catch (\Exception $e) {
        return ['success' => false, 'status' => $e->getCode() ?: 500, 'error' => $e->getMessage()];
    }
}

$passedAll = true;

// SCÉNARIO SL-01 & SL-03 : User A avec son vrai PIN ('7890')
echo "▶ SCÉNARIO SL-03: User A déverrouille sa session avec son vrai PIN ('7890')\n";
$resA = attemptVerifyPin($controller, $userA, '7890');
if ($resA['success'] && $resA['status'] === 200 && ($resA['data']['verified'] ?? false) === true) {
    echo "   [PASS] Session déverrouillée avec succès (HTTP 200, verified: true).\n";
} else {
    echo "   [FAIL] Échec du déverrouillage valide: " . json_encode($resA) . "\n";
    $passedAll = false;
}

// SCÉNARIO SL-04 : User A avec un mauvais PIN ('9999')
echo "\n▶ SCÉNARIO SL-04: User A tente un PIN incorrect ('9999')\n";
$resBad = attemptVerifyPin($controller, $userA, '9999');
if (!$resBad['success'] && $resBad['status'] === 401 && ($resBad['data']['verified'] ?? true) === false) {
    echo "   [PASS] Déverrouillage refusé avec HTTP 401 (verified: false).\n";
} else {
    echo "   [FAIL] Le mauvais PIN a été accepté ou mal géré: " . json_encode($resBad) . "\n";
    $passedAll = false;
}

// SCÉNARIO SL-05 : Tentative avec la backdoor universelle '1234' sur User A (dont le vrai PIN est 7890)
echo "\n▶ SCÉNARIO SL-05: Tentative de déverrouillage avec '1234' sur User A\n";
$res1234 = attemptVerifyPin($controller, $userA, '1234');
if (!$res1234['success'] && $res1234['status'] === 401) {
    echo "   [PASS] REFUS ABSOLU. Le PIN universel '1234' est rejeté par le serveur.\n";
} else {
    echo "   [FAIL] VULNÉRABILITÉ CRITIQUE : Le PIN 1234 a déverrouillé la session !\n";
    $passedAll = false;
}

// SCÉNARIO SL-06 : User B tente de déverrouiller la session active de User A avec le PIN de User B ('4321')
echo "\n▶ SCÉNARIO SL-06: Isolation Utilisateur (Token User A avec PIN de B '4321')\n";
$resCrossUser = attemptVerifyPin($controller, $userA, '4321');
if (!$resCrossUser['success'] && $resCrossUser['status'] === 401) {
    echo "   [PASS] REFUS. Le PIN d'un autre utilisateur ne peut pas déverrouiller la session de User A.\n";
} else {
    echo "   [FAIL] Échec isolation utilisateur: User B a pu déverrouiller la session A!\n";
    $passedAll = false;
}

// SCÉNARIO SL-07 : Multi-Tenant Isolation
echo "\n▶ SCÉNARIO SL-07: Isolation Multi-Tenant (Compte Company B vs Session Company A)\n";
$resB = attemptVerifyPin($controller, $userB, '4321');
if ($resB['success'] && $resB['data']['verified'] === true) {
    echo "   [PASS] User B déverrouille uniquement SA propre session Company B avec SON PIN.\n";
} else {
    echo "   [FAIL] Échec déverrouillage légitime User B.\n";
    $passedAll = false;
}

// SCÉNARIO SL-08 : Utilisateur sans PIN configuré
echo "\n▶ SCÉNARIO SL-08: Utilisateur sans PIN configuré\n";
$resNoPin = attemptVerifyPin($controller, $userNoPin, '1234');
if (!$resNoPin['success'] && $resNoPin['status'] === 422) {
    echo "   [PASS] Rejeté avec HTTP 422 (Aucun PIN configuré pour ce compte).\n";
} else {
    echo "   [FAIL] Mauvaise gestion compte sans PIN: " . json_encode($resNoPin) . "\n";
    $passedAll = false;
}

// SCÉNARIO SL-Unauthenticated : Requête sans jeton d'accès
echo "\n▶ SCÉNARIO Non-Authentifié: Déverrouillage sans jeton Sanctum\n";
$resUnauth = attemptVerifyPin($controller, null, '7890');
if (!$resUnauth['success'] && $resUnauth['status'] === 401) {
    echo "   [PASS] Rejeté immédiatement avec HTTP 401 (Session expirée).\n";
} else {
    echo "   [FAIL] Requête non-authentifiée acceptée anormalement.\n";
    $passedAll = false;
}

echo "\n=========================================================\n";
if ($passedAll) {
    echo "   RÉSULTAT GLOBAL PHASE 1.3: TOUS LES SCÉNARIOS SL SONT VALIDÉS (PASS)\n";
} else {
    echo "   RÉSULTAT GLOBAL PHASE 1.3: ÉCHEC (FAIL)\n";
}
echo "=========================================================\n";

// Nettoyage
User::withoutGlobalScopes()->where('email', 'like', '%@lock.test')->delete();
$companyA->delete();
$companyB->delete();

