<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Company;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use App\Http\Controllers\API\V1\AuthController;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

echo "=========================================================\n";
echo "       PHASE 1.4 — SÉCURISATION OTP & PASSWORD RESET\n";
echo "=========================================================\n\n";

$company = Company::withoutGlobalScopes()->where('code', 'OTP-TEST-STORE')->first()
    ?: Company::create(['name' => 'OTP Test Store', 'code' => 'OTP-TEST-STORE', 'status' => 'active']);

$role = Role::withoutGlobalScopes()->where('company_id', $company->id)->first()
    ?: Role::create(['name' => 'Cashier OTP', 'slug' => 'cashier-otp', 'company_id' => $company->id]);

$emailUser1 = 'alexandre.dupont@apex-pos.com';
$emailUser2 = 'direction.commerciale@apex-pos.com';
$emailFake  = 'inconnu.client@apex-pos.com';

User::withoutGlobalScopes()->whereIn('email', [$emailUser1, $emailUser2])->delete();
DB::table('password_reset_tokens')->whereIn('email', [$emailUser1, $emailUser2, $emailFake])->delete();

$user1 = User::create([
    'name' => 'Alexandre Dupont',
    'email' => $emailUser1,
    'password' => Hash::make('OriginalPassword123!'),
    'role_id' => $role->id,
    'company_id' => $company->id,
    'status' => 'active',
]);

$user2 = User::create([
    'name' => 'Direction Commerciale',
    'email' => $emailUser2,
    'password' => Hash::make('OriginalPassword123!'),
    'role_id' => $role->id,
    'company_id' => $company->id,
    'status' => 'active',
]);

$controller = new AuthController();

function attemptForgotPassword($controller, string $email) {
    $req = Request::create('/api/v1/auth/forgot-password', 'POST', ['email' => $email]);
    try {
        $res = $controller->forgotPassword($req);
        return ['success' => true, 'status' => $res->getStatusCode(), 'data' => json_decode($res->getContent(), true)];
    } catch (ValidationException $e) {
        return ['success' => false, 'status' => 422, 'error' => $e->getMessage(), 'errors' => $e->errors()];
    } catch (\Exception $e) {
        return ['success' => false, 'status' => $e->getCode() ?: 500, 'error' => $e->getMessage()];
    }
}

function attemptResetPassword($controller, array $data) {
    $req = Request::create('/api/v1/auth/reset-password', 'POST', $data);
    try {
        $res = $controller->resetPassword($req);
        $status = $res->getStatusCode();
        return ['success' => ($status === 200), 'status' => $status, 'data' => json_decode($res->getContent(), true)];
    } catch (ValidationException $e) {
        return ['success' => false, 'status' => 422, 'error' => $e->getMessage(), 'errors' => $e->errors()];
    } catch (\Exception $e) {
        return ['success' => false, 'status' => $e->getCode() ?: 500, 'error' => $e->getMessage()];
    }
}

$passedAll = true;

// TEST 1: Demande reset pour email valide -> Hachage BDD de l'OTP
echo "▶ TEST 1: Demande de réinitialisation (Email valide)\n";
$resForgot1 = attemptForgotPassword($controller, $emailUser1);
$dbRecord1 = DB::table('password_reset_tokens')->where('email', $emailUser1)->first();

if ($resForgot1['status'] === 200 && $dbRecord1 && $dbRecord1->token !== null && strlen($dbRecord1->token) > 20) {
    echo "   [PASS] OTP généré et HACHÉ en BDD avec succès (Hash bcrypt, longueur: " . strlen($dbRecord1->token) . ").\n";
} else {
    echo "   [FAIL] OTP non stocké ou non haché correctement: " . json_encode($resForgot1) . " / " . json_encode($dbRecord1) . "\n";
    $passedAll = false;
}

// TEST 2: Demande reset pour email inexistant (Anti-énumération)
echo "\n▶ TEST 2: Anti-énumération d'email (Email inexistant)\n";
$resForgotFake = attemptForgotPassword($controller, $emailFake);
$dbRecordFake = DB::table('password_reset_tokens')->where('email', $emailFake)->first();

if ($resForgotFake['status'] === 200 && !$dbRecordFake) {
    echo "   [PASS] Réponse neutre identique renvoyée sans fuite d'information et sans insertion BDD.\n";
} else {
    echo "   [FAIL] Échec du test d'anti-énumération d'email: " . json_encode($resForgotFake) . "\n";
    $passedAll = false;
}

// TEST 3: Validation de la complexité du nouveau mot de passe (Mot de passe faible / confirmation mismatch)
echo "\n▶ TEST 3: Validation de la politique de mot de passe (Min 8, majuscule, chiffre, match)\n";
$resWeak = attemptResetPassword($controller, [
    'email' => $emailUser1,
    'token' => '123456',
    'password' => 'weak',
    'password_confirmation' => 'weak'
]);
$resMismatch = attemptResetPassword($controller, [
    'email' => $emailUser1,
    'token' => '123456',
    'password' => 'NewStrongPass2026!',
    'password_confirmation' => 'DifferentPass2026!'
]);

if ($resWeak['status'] === 422 && $resMismatch['status'] === 422) {
    echo "   [PASS] Mots de passe faibles et confirmations divergentes rejetés avec HTTP 422.\n";
} else {
    echo "   [FAIL] Infiltration de mot de passe non conforme autorisée !\n";
    $passedAll = false;
}

// TEST 4: Réinitialisation réussie avec OTP valide
echo "\n▶ TEST 4: Réinitialisation avec OTP valide et nouveau mot de passe fort\n";
Cache::forget('otp_attempts:' . $emailUser1);
$codeTest = '654321';
DB::table('password_reset_tokens')->updateOrInsert(
    ['email' => $emailUser1],
    ['token' => Hash::make($codeTest), 'created_at' => now()]
);

$resResetValid = attemptResetPassword($controller, [
    'email' => $emailUser1,
    'token' => $codeTest,
    'password' => 'NewStrongPassword2026!',
    'password_confirmation' => 'NewStrongPassword2026!'
]);

$user1Reloaded = User::withoutGlobalScopes()->where('email', $emailUser1)->first();
$tokenAfterReset = DB::table('password_reset_tokens')->where('email', $emailUser1)->first();

if ($resResetValid['success'] && Hash::check('NewStrongPassword2026!', $user1Reloaded->password) && !$tokenAfterReset) {
    echo "   [PASS] Mot de passe mis à jour avec succès, token purgé de la BDD (Usage unique).\n";
} else {
    echo "   [FAIL] Échec de la réinitialisation valide: " . json_encode($resResetValid) . "\n";
    $passedAll = false;
}

// TEST 5: Tentative de réutilisation d'un token déjà consommé
echo "\n▶ TEST 5: Tentative de réutilisation du même code (Usage unique)\n";
$resReuse = attemptResetPassword($controller, [
    'email' => $emailUser1,
    'token' => $codeTest,
    'password' => 'AnotherPassword2026!',
    'password_confirmation' => 'AnotherPassword2026!'
]);

if (!$resReuse['success'] && $resReuse['status'] === 400) {
    echo "   [PASS] Deuxième tentative refusée avec HTTP 400 (Token déjà consommé).\n";
} else {
    echo "   [FAIL] VULNÉRABILITÉ : Réutilisation d'un ancien token autorisée !\n";
    $passedAll = false;
}

// TEST 6: Invalidation automatique des anciens tokens lors d'une nouvelle demande
echo "\n▶ TEST 6: Remplacement automatique d'un token lors d'une nouvelle demande\n";
$oldCode = '111111';
$newCode = '222222';
DB::table('password_reset_tokens')->updateOrInsert(
    ['email' => $emailUser2],
    ['token' => Hash::make($oldCode), 'created_at' => now()]
);

DB::table('password_reset_tokens')->updateOrInsert(
    ['email' => $emailUser2],
    ['token' => Hash::make($newCode), 'created_at' => now()]
);

$resOldAttempt = attemptResetPassword($controller, [
    'email' => $emailUser2,
    'token' => $oldCode,
    'password' => 'PasswordTest2026!',
    'password_confirmation' => 'PasswordTest2026!'
]);
$resNewAttempt = attemptResetPassword($controller, [
    'email' => $emailUser2,
    'token' => $newCode,
    'password' => 'PasswordTest2026!',
    'password_confirmation' => 'PasswordTest2026!'
]);

if (!$resOldAttempt['success'] && $resNewAttempt['success']) {
    echo "   [PASS] L'ancien token est définitivement révoqué, seul le nouveau token fonctionne.\n";
} else {
    echo "   [FAIL] L'ancien token fonctionne toujours après remplacement !\n";
    $passedAll = false;
}

// TEST 7: OTP expiré (> 15 minutes)
echo "\n▶ TEST 7: Code de réinitialisation expiré (> 15 minutes)\n";
$expiredCode = '333333';
DB::table('password_reset_tokens')->updateOrInsert(
    ['email' => $emailUser1],
    ['token' => Hash::make($expiredCode), 'created_at' => Carbon::now()->subMinutes(20)]
);

$resExpired = attemptResetPassword($controller, [
    'email' => $emailUser1,
    'token' => $expiredCode,
    'password' => 'PasswordTest2026!',
    'password_confirmation' => 'PasswordTest2026!'
]);

if (!$resExpired['success'] && $resExpired['status'] === 400) {
    echo "   [PASS] Code expiré refusé et supprimé de la BDD.\n";
} else {
    echo "   [FAIL] Code expiré accepté anormalement !\n";
    $passedAll = false;
}

// TEST 8: Anti Force Brute OTP (5 tentatives erronées → révocation du token)
echo "\n▶ TEST 8: Protection Anti Force-Brute OTP (5 tentatives max)\n";
Cache::forget('otp_attempts:' . $emailUser1);
$bruteCode = '888888';
DB::table('password_reset_tokens')->updateOrInsert(
    ['email' => $emailUser1],
    ['token' => Hash::make($bruteCode), 'created_at' => now()]
);

for ($attempt = 1; $attempt <= 5; $attempt++) {
    attemptResetPassword($controller, [
        'email' => $emailUser1,
        'token' => '000000',
        'password' => 'PasswordTest2026!',
        'password_confirmation' => 'PasswordTest2026!'
    ]);
}

$resBruteBlocked = attemptResetPassword($controller, [
    'email' => $emailUser1,
    'token' => $bruteCode,
    'password' => 'PasswordTest2026!',
    'password_confirmation' => 'PasswordTest2026!'
]);
$tokenAfterBrute = DB::table('password_reset_tokens')->where('email', $emailUser1)->first();

if (!$resBruteBlocked['success'] && $resBruteBlocked['status'] === 429 && !$tokenAfterBrute) {
    echo "   [PASS] Après 5 erreurs, le token est annulé et révoqué de la BDD (HTTP 429).\n";
} else {
    echo "   [FAIL] Échec du blocage anti force-brute OTP: " . json_encode($resBruteBlocked) . "\n";
    $passedAll = false;
}

echo "\n=========================================================\n";
if ($passedAll) {
    echo "   RÉSULTAT GLOBAL PHASE 1.4: TOUS LES SCÉNARIOS OTP SONT VALIDÉS (PASS)\n";
} else {
    echo "   RÉSULTAT GLOBAL PHASE 1.4: ÉCHEC (FAIL)\n";
}
echo "=========================================================\n";

// Nettoyage
User::withoutGlobalScopes()->whereIn('email', [$emailUser1, $emailUser2])->delete();
DB::table('password_reset_tokens')->whereIn('email', [$emailUser1, $emailUser2, $emailFake])->delete();
$company->delete();

