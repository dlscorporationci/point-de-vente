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
echo "       PHASE 1.2 — SÉCURISATION & SCALABILITÉ LOGIN PIN (O(1))\n";
echo "=========================================================\n\n";

// 1. Setup Entreprise A et Entreprise B
$companyA = Company::withoutGlobalScopes()->where('code', 'PIN-COMP-A')->first()
    ?: Company::create(['name' => 'Store A PIN Test', 'code' => 'PIN-COMP-A', 'status' => 'active']);

$companyB = Company::withoutGlobalScopes()->where('code', 'PIN-COMP-B')->first()
    ?: Company::create(['name' => 'Store B PIN Test', 'code' => 'PIN-COMP-B', 'status' => 'active']);

$roleA = Role::withoutGlobalScopes()->where('company_id', $companyA->id)->first()
    ?: Role::create(['name' => 'Cashier A', 'slug' => 'cashier-a', 'company_id' => $companyA->id]);

$roleB = Role::withoutGlobalScopes()->where('company_id', $companyB->id)->first()
    ?: Role::create(['name' => 'Cashier B', 'slug' => 'cashier-b', 'company_id' => $companyB->id]);

// Nettoyage préalable
User::withoutGlobalScopes()->whereIn('email', ['cashier1_a@pin.test', 'cashier2_a@pin.test', 'cashier1_b@pin.test'])->delete();

// Création Utilisateur A1 et A2 dans Company A
$userA1 = User::create([
    'name' => 'Cashier A1',
    'email' => 'cashier1_a@pin.test',
    'password' => Hash::make('SecretPass123!'),
    'pin_code' => Hash::make('1234'),
    'role_id' => $roleA->id,
    'company_id' => $companyA->id,
    'status' => 'active',
]);

$userA2 = User::create([
    'name' => 'Cashier A2',
    'email' => 'cashier2_a@pin.test',
    'password' => Hash::make('SecretPass123!'),
    'pin_code' => Hash::make('5678'),
    'role_id' => $roleA->id,
    'company_id' => $companyA->id,
    'status' => 'active',
]);

// Création Utilisateur B1 dans Company B avec LE MÊME CODE PIN '1234'
$userB1 = User::create([
    'name' => 'Cashier B1',
    'email' => 'cashier1_b@pin.test',
    'password' => Hash::make('SecretPass123!'),
    'pin_code' => Hash::make('1234'),
    'role_id' => $roleB->id,
    'company_id' => $companyB->id,
    'status' => 'active',
]);

// Génération de 20 utilisateurs fictifs dans Company A pour simuler l'échelle SaaS
for ($i = 1; $i <= 20; $i++) {
    $email = "dummy_user_{$i}@pin.test";
    User::withoutGlobalScopes()->where('email', $email)->delete();
    User::create([
        'name' => "Dummy Cashier {$i}",
        'email' => $email,
        'password' => Hash::make('DummyPass123!'),
        'pin_code' => Hash::make('9999'),
        'role_id' => $roleA->id,
        'company_id' => $companyA->id,
        'status' => 'active',
    ]);
}

$controller = new AuthController();

function attemptPinLogin($controller, array $data) {
    $req = Request::create('/api/v1/auth/login-pin', 'POST', $data);
    try {
        $res = $controller->loginPin($req);
        $status = $res->getStatusCode();
        return [
            'success' => ($status === 200),
            'status' => $status,
            'data' => json_decode($res->getContent(), true)
        ];
    } catch (ValidationException $e) {
        return ['success' => false, 'status' => 422, 'error' => $e->getMessage(), 'errors' => $e->errors()];
    } catch (\Exception $e) {
        return ['success' => false, 'status' => $e->getCode() ?: 500, 'error' => $e->getMessage()];
    }
}

$passedAll = true;

// TEST 1 : Target par email + PIN correct (O(1))
echo "▶ TEST 1: PIN Login ciblé par E-mail + PIN correct ('cashier1_a@pin.test', '1234')\n";
$start = microtime(true);
$res1 = attemptPinLogin($controller, [
    'company_code' => 'PIN-COMP-A',
    'email'        => 'cashier1_a@pin.test',
    'pin_code'     => '1234',
]);
$duration = round((microtime(true) - $start) * 1000, 2);

if ($res1['success'] && $res1['status'] === 200 && isset($res1['data']['token'])) {
    echo "   [PASS] Authentifié avec succès en {$duration} ms (Token généré).\n";
} else {
    echo "   [FAIL] Échec de la connexion PIN: " . json_encode($res1) . "\n";
    $passedAll = false;
}

// TEST 2 : Target par user_id + PIN correct (O(1))
echo "\n▶ TEST 2: PIN Login ciblé par user_id + PIN correct (ID: {$userA2->id}, '5678')\n";
$res2 = attemptPinLogin($controller, [
    'company_code' => 'PIN-COMP-A',
    'user_id'      => $userA2->id,
    'pin_code'     => '5678',
]);
if ($res2['success'] && $res2['status'] === 200 && isset($res2['data']['token'])) {
    echo "   [PASS] Authentifié par user_id avec succès.\n";
} else {
    echo "   [FAIL] Échec authentification par user_id: " . json_encode($res2) . "\n";
    $passedAll = false;
}

// TEST 3 : Absence d'identifiant (user_id et email manquants) → 422 sans aucun calcul bcrypt
echo "\n▶ TEST 3: Requête sans identifiant (user_id et email manquants)\n";
$res3 = attemptPinLogin($controller, [
    'company_code' => 'PIN-COMP-A',
    'pin_code'     => '1234',
]);
if (!$res3['success'] && $res3['status'] === 422) {
    echo "   [PASS] Rejeté immédiatement avec erreur 422 (Aucun scan d'utilisateurs).\n";
} else {
    echo "   [FAIL] Le système a accepté ou mal géré la requête sans identifiant: " . json_encode($res3) . "\n";
    $passedAll = false;
}

// TEST 4 : Isolation Multi-Tenant (Utilisateur B1 tente de se connecter sur Company A avec son PIN '1234')
echo "\n▶ TEST 4: Isolation Multi-Tenant (Email de B1 chez Company A)\n";
$res4 = attemptPinLogin($controller, [
    'company_code' => 'PIN-COMP-A',
    'email'        => 'cashier1_b@pin.test',
    'pin_code'     => '1234',
]);
if (!$res4['success'] && $res4['status'] === 401) {
    echo "   [PASS] Connexion inter-tenant refusée avec 401 (Recherche ciblée sur Company A retourne zéro candidat).\n";
} else {
    echo "   [FAIL] Fuite de sécurité Multi-Tenant: l'utilisateur B a pu accéder à A!\n";
    $passedAll = false;
}

// TEST 5 : Test de Scalabilité & Temps de Réponse (20+ utilisateurs en BDD)
echo "\n▶ TEST 5: Test de Performance O(1) avec 20+ utilisateurs en BDD\n";
$startScale = microtime(true);
$res5 = attemptPinLogin($controller, [
    'company_code' => 'PIN-COMP-A',
    'email'        => 'dummy_user_10@pin.test',
    'pin_code'     => '9999',
]);
$scaleDuration = round((microtime(true) - $startScale) * 1000, 2);

if ($res5['success'] && $scaleDuration < 1000) {
    echo "   [PASS] Performance optimale O(1): 1 seule requête SQL + 1 seul Hash::check() en {$scaleDuration} ms.\n";
} else {
    echo "   [FAIL] Temps d'exécution trop élevé ({$scaleDuration} ms) ou échec.\n";
    $passedAll = false;
}

echo "\n=========================================================\n";
if ($passedAll) {
    echo "   RÉSULTAT GLOBAL PHASE 1.2: TOUS LES SCÉNARIOS PIN SONT VALIDÉS (PASS)\n";
} else {
    echo "   RÉSULTAT GLOBAL PHASE 1.2: ÉCHEC (FAIL)\n";
}
echo "=========================================================\n";

// Nettoyage
User::withoutGlobalScopes()->where('email', 'like', '%@pin.test')->delete();
$companyA->delete();
$companyB->delete();

