<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Company;
use App\Models\Branch;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

echo "=========================================================\n";
echo "   PHASE 2 — SESSION MANAGEMENT & AUTO-LOCK TEST (MU-06)\n";
echo "=========================================================\n\n";

try {
    // Setup Tenant & User
    $company = Company::create([
        'name' => 'Company Session Test ' . Str::random(5),
        'inactivity_lock_timeout' => 10, // 10 minutes configured
    ]);
    $branch = Branch::create(['company_id' => $company->id, 'name' => 'Branch Main']);
    $role = Role::create(['company_id' => $company->id, 'name' => 'Cashier', 'slug' => 'cashier']);
    $user = User::create([
        'name' => 'Cashier Session',
        'email' => 'cashier_sess_' . Str::random(5) . '@test.com',
        'password' => Hash::make('password123'),
        'company_id' => $company->id,
        'branch_id' => $branch->id,
        'role_id' => $role->id,
        'pin_code' => Hash::make('5678'),
    ]);

    // 1. Check inactivity_lock_timeout config in Company model
    assert($company->inactivity_lock_timeout === 10, "L'entreprise à un timeout de verrouillage configuré de 10 minutes.");
    echo "▶ 1. Inactivity lock timeout configuration in Company: PASS (10 minutes)\n";

    // 2. Test /api/v1/auth/verify-pin with VALID PIN
    $reqValid = \Illuminate\Http\Request::create('/api/v1/auth/verify-pin', 'POST', [
        'pin_code' => '5678'
    ]);
    $reqValid->setUserResolver(fn() => $user);

    $authController = new \App\Http\Controllers\API\V1\AuthController();
    $resValid = $authController->verifyPin($reqValid);
    $dataValid = json_decode($resValid->getContent(), true);

    assert($resValid->getStatusCode() === 200, "Le statut HTTP pour PIN valide est 200.");
    assert($dataValid['verified'] === true, "Le flag 'verified' est true pour PIN '5678'.");
    echo "▶ 2. Backend verification of VALID PIN ('5678'): PASS (HTTP 200, verified=true)\n";

    // 3. Test /api/v1/auth/verify-pin with INVALID PIN
    $reqInvalid = \Illuminate\Http\Request::create('/api/v1/auth/verify-pin', 'POST', [
        'pin_code' => '9999'
    ]);
    $reqInvalid->setUserResolver(fn() => $user);

    $resInvalid = $authController->verifyPin($reqInvalid);
    $dataInvalid = json_decode($resInvalid->getContent(), true);

    assert($resInvalid->getStatusCode() === 401, "Le statut HTTP pour PIN invalide est 401.");
    assert($dataInvalid['verified'] === false, "Le flag 'verified' est false pour PIN '9999'.");
    echo "▶ 3. Backend verification of INVALID PIN ('9999'): PASS (HTTP 401, verified=false)\n";

    // 4. Test attempt to verify PIN with Universal Master Pass ('1234') -> Must fail!
    $reqMaster = \Illuminate\Http\Request::create('/api/v1/auth/verify-pin', 'POST', [
        'pin_code' => '1234'
    ]);
    $reqMaster->setUserResolver(fn() => $user);

    $resMaster = $authController->verifyPin($reqMaster);
    assert($resMaster->getStatusCode() === 401, "Master PIN '1234' rejeté avec succès (backdoor purgée).");
    echo "▶ 4. Verification of Backdoor PIN ('1234') against custom user: PASS (HTTP 401, Access Denied)\n";

    echo "\n---------------------------------------------------------\n";
    echo " RESULTAT : TOUS LES TESTS SESSION (MU-06) ONT REUSSI ! 🎉\n";
    echo "---------------------------------------------------------\n";

} catch (Throwable $e) {
    echo "\n❌ ERREUR TEST SESSION: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}
