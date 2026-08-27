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
echo "       PHASE 1.1 — EXECUTION CONTRÔLÉE ET TEST D'AUTHENTIFICATION\n";
echo "=========================================================\n\n";

// 1. Préparation du contexte d'un utilisateur standard
$company = Company::withoutGlobalScopes()->where('code', 'TEST-PHASE1')->first();
if (!$company) {
    $company = Company::create([
        'name' => 'Phase 1 Test Store',
        'code' => 'TEST-PHASE1',
        'status' => 'active',
    ]);
}

$adminRole = Role::withoutGlobalScopes()->where('slug', 'admin')->first()
    ?: Role::create(['name' => 'Admin Test', 'slug' => 'admin', 'company_id' => $company->id]);

$userA = User::withoutGlobalScopes()->where('email', 'usera_phase1@test.com')->first();
if ($userA) {
    $userA->delete();
}
$userA = User::create([
    'name' => 'Utilisateur A Test',
    'email' => 'usera_phase1@test.com',
    'password' => Hash::make('VraiMotDePasse123!'),
    'role_id' => $adminRole->id,
    'company_id' => $company->id,
    'status' => 'active',
]);

$superAdmin = User::withoutGlobalScopes()->where('email', 'superadmin@dls.com')->first();
if (!$superAdmin) {
    $superRole = Role::withoutGlobalScopes()->where('slug', 'super-admin')->first()
        ?: Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'company_id' => null]);
    $superAdmin = User::create([
        'name' => 'Super Admin',
        'email' => 'superadmin@dls.com',
        'password' => Hash::make('SuperAdminSecretPass2026!'),
        'role_id' => $superRole->id,
        'company_id' => null,
        'status' => 'active',
    ]);
} else {
    $superAdmin->password = Hash::make('SuperAdminSecretPass2026!');
    $superAdmin->save();
}

$controller = new AuthController();

function attemptLogin($controller, $email, $password) {
    $req = Request::create('/api/v1/auth/login', 'POST', [
        'email' => $email,
        'password' => $password
    ]);
    try {
        $res = $controller->login($req);
        return ['success' => true, 'status' => $res->getStatusCode(), 'data' => json_decode($res->getContent(), true)];
    } catch (ValidationException $e) {
        return ['success' => false, 'status' => 422, 'error' => $e->getMessage()];
    } catch (\Exception $e) {
        return ['success' => false, 'status' => $e->getCode() ?: 500, 'error' => $e->getMessage()];
    }
}

$passedAll = true;

// SCÉNARIO A
echo "▶ SCÉNARIO A: Utilisateur A + vrai mot de passe ('VraiMotDePasse123!')\n";
$resA = attemptLogin($controller, 'usera_phase1@test.com', 'VraiMotDePasse123!');
if ($resA['success'] && $resA['status'] === 200 && isset($resA['data']['token'])) {
    echo "   [PASS] Connexion autorisée avec le vrai mot de passe.\n";
} else {
    echo "   [FAIL] Connexion refusée: " . json_encode($resA) . "\n";
    $passedAll = false;
}

// SCÉNARIO B
echo "\n▶ SCÉNARIO B: Utilisateur A + mot de passe universel historique 'Pass2026!'\n";
$resB = attemptLogin($controller, 'usera_phase1@test.com', 'Pass2026!');
if (!$resB['success'] && $resB['status'] === 422) {
    echo "   [PASS] Connexion refusée comme attendu (422).\n";
} else {
    echo "   [FAIL] Connexion AUTORISÉE anormalement par backdoor Pass2026!\n";
    $passedAll = false;
}

// SCÉNARIO C
echo "\n▶ SCÉNARIO C: Utilisateur A + mot de passe générique 'password'\n";
$resC = attemptLogin($controller, 'usera_phase1@test.com', 'password');
if (!$resC['success'] && $resC['status'] === 422) {
    echo "   [PASS] Connexion refusée comme attendu (422).\n";
} else {
    echo "   [FAIL] Connexion AUTORISÉE anormalement par backdoor 'password'!\n";
    $passedAll = false;
}

// SCÉNARIO D
echo "\n▶ SCÉNARIO D: Utilisateur A + mot de passe maître 'Gdji29042006//'\n";
$resD = attemptLogin($controller, 'usera_phase1@test.com', 'Gdji29042006//');
if (!$resD['success'] && $resD['status'] === 422) {
    echo "   [PASS] Connexion refusée comme attendu (422).\n";
} else {
    echo "   [FAIL] Connexion AUTORISÉE anormalement par backdoor Gdji!\n";
    $passedAll = false;
}

// SCÉNARIO E
echo "\n▶ SCÉNARIO E: SuperAdmin connexion exclusive avec identifiants réels\n";
$resE1 = attemptLogin($controller, 'superadmin@dls.com', 'password');
$resE2 = attemptLogin($controller, 'superadmin@dls.com', 'Pass2026!');
$resE3 = attemptLogin($controller, 'superadmin@dls.com', 'SuperAdminSecretPass2026!');

if (!$resE1['success'] && !$resE2['success'] && $resE3['success'] && isset($resE3['data']['token'])) {
    echo "   [PASS] SuperAdmin refuse les faux mots de passe et accepte uniquement son vrai secret.\n";
} else {
    echo "   [FAIL] Échec du test d'isolation du SuperAdmin.\n";
    $passedAll = false;
}

echo "\n=========================================================\n";
if ($passedAll) {
    echo "   RÉSULTAT GLOBAL PHASE 1.1: TOUS LES SCÉNARIOS SONT VALIDÉS (PASS)\n";
} else {
    echo "   RÉSULTAT GLOBAL PHASE 1.1: ÉCHEC (FAIL)\n";
}
echo "=========================================================\n";

// Nettoyage de l'utilisateur de test
$userA->delete();

