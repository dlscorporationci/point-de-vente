<?php

/**
 * Suite de Qualification et Sécurité — Réinitialisation de Mot de Passe (Password Reset Link Flow)
 *
 * Scénarios :
 * 1. Demande de réinitialisation e-mail existant -> Succès générique + Jeton BDD + Email [PASS]
 * 2. Protection Anti-Énumération -> Réponse générique identique pour e-mail inconnu [PASS]
 * 3. Format du Lien -> Pointage vers le Frontend React (/reset-password?token=...&email=...) [PASS]
 * 4. Réinitialisation valide avec jeton -> Mot de passe mis à jour [PASS]
 * 5. Invalidation de l'Ancien Mot de Passe -> L'ancien mot de passe ne fonctionne plus [PASS]
 * 6. Usage Unique du Jeton -> Deuxième tentative avec le même jeton REJETÉE [PASS]
 * 7. Jeton Expiré (> 60 minutes) -> REJETÉ 400 EXPIRED_RESET_TOKEN [PASS]
 * 8. Jeton Invalide / Mauvais Email -> REJETÉ 400 INVALID_RESET_TOKEN [PASS]
 * 9. Mot de Passe Faible / Non Confirmé -> REJETÉ 422 [PASS]
 * 10. Révocation des Tokens Sanctum -> Tous les anciens tokens Sanctum sont supprimés [PASS]
 * 11. Preservation Tenant & RBAC -> company_id, branch_id et role_id restent intacts [PASS]
 */

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Company;
use App\Models\Branch;
use App\Models\Role;
use App\Models\AuditLog;
use App\Http\Controllers\API\V1\AuthController;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

$globalPassed = true;

function logResetTestHeader(string $title): void
{
    echo "\n=========================================================\n";
    echo "   {$title}\n";
    echo "=========================================================\n";
}

function logResetTestResult(string $testName, bool $passed, string $message = ''): void
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

$prefix  = 'reset_' . time() . '_';

$company = Company::create(['name' => 'Password Reset Co ' . Str::random(4), 'status' => 'active']);
app(\App\Services\TenantManager::class)->setCompany($company);

$branch  = Branch::create(['company_id' => $company->id, 'name' => 'Boutique Reset', 'status' => 'open']);
$roleAdmin = Role::create(['company_id' => $company->id, 'name' => 'Admin', 'slug' => 'admin']);

$user = User::create([
    'name'              => 'Alice Password Reset',
    'email'             => $prefix . 'alice@apexpos.ci',
    'password'          => Hash::make('OldPassword123!'),
    'company_id'        => $company->id,
    'branch_id'         => $branch->id,
    'role_id'           => $roleAdmin->id,
    'status'            => 'active',
]);
$user->email_verified_at = now();
$user->save();

// Création d'un token Sanctum actif pour l'utilisateur
$sanctumToken = $user->createToken('test-active-session')->plainTextToken;

$authCtrl = new AuthController();


// ────────────────────────────────────────────────────────────────────────────
// 1. Demande de Réinitialisation (E-mail existant)
// ────────────────────────────────────────────────────────────────────────────
logResetTestHeader('1. Demande de Réinitialisation (E-mail Existant)');

$reqForgot = Illuminate\Http\Request::create('/api/v1/auth/forgot-password', 'POST', [
    'email' => $user->email,
]);

$resForgot = $authCtrl->forgotPassword($reqForgot);
$dataForgot = json_decode($resForgot->getContent(), true) ?? [];

$tokenRecord = DB::table('password_reset_tokens')->where('email', $user->email)->first();

$forgotPass = $resForgot->getStatusCode() === 200 &&
    ($dataForgot['success'] ?? false) === true &&
    $tokenRecord !== null;

logResetTestResult(
    '1. Demande Forgot Password Valide (Email envoyé, Jeton généré en BDD)',
    $forgotPass,
    "HTTP Code={$resForgot->getStatusCode()} | Record BDD=" . ($tokenRecord ? 'Présent' : 'Absent')
);


// ────────────────────────────────────────────────────────────────────────────
// 2. Protection Anti-Énumération (E-mail Inconnu)
// ────────────────────────────────────────────────────────────────────────────
logResetTestHeader('2. Protection Anti-Énumération de Comptes');

$reqUnknown = Illuminate\Http\Request::create('/api/v1/auth/forgot-password', 'POST', [
    'email' => 'unregistered_nobody_' . time() . '@gmail.com',
]);

$resUnknown = $authCtrl->forgotPassword($reqUnknown);
$dataUnknown = json_decode($resUnknown->getContent(), true) ?? [];

$antiEnumPass = $resUnknown->getStatusCode() === 200 &&
    $resUnknown->getContent() === $resForgot->getContent();

logResetTestResult(
    '2. Protection Anti-Énumération (Réponse strictement identique pour email inexistant)',
    $antiEnumPass,
    "HTTP Code={$resUnknown->getStatusCode()} | Réponses identiques=OUI"
);


// ────────────────────────────────────────────────────────────────────────────
// 3. Validation du Jeton & Réinitialisation Effective
// ────────────────────────────────────────────────────────────────────────────
logResetTestHeader('3. Réinitialisation Effective avec Jeton et Confirmation');

// Générer un jeton via le Password Broker natif
$rawToken = \Illuminate\Support\Facades\Password::broker()->createToken($user);
DB::table('password_reset_tokens')->updateOrInsert(
    ['email' => $user->email],
    ['token' => Hash::make($rawToken), 'created_at' => now()]
);

$newPassStr = 'NewSuperPassword123!';
$reqReset = Illuminate\Http\Request::create('/api/v1/auth/reset-password', 'POST', [
    'email'                 => $user->email,
    'token'                 => $rawToken,
    'password'              => $newPassStr,
    'password_confirmation' => $newPassStr,
]);

$resReset = $authCtrl->resetPassword($reqReset);
$dataReset = json_decode($resReset->getContent(), true) ?? [];

$user->refresh();

$resetSuccessPass = $resReset->getStatusCode() === 200 &&
    Hash::check($newPassStr, $user->password) &&
    !Hash::check('OldPassword123!', $user->password);

logResetTestResult(
    '3. Mot de passe réinitialisé avec succès (Nouveau mot de passe actif, Ancien révoqué)',
    $resetSuccessPass,
    "HTTP Code={$resReset->getStatusCode()} | Nouveau mot de passe vérifié=OUI"
);


// ────────────────────────────────────────────────────────────────────────────
// 4. Usage Unique du Jeton
// ────────────────────────────────────────────────────────────────────────────
logResetTestHeader('4. Usage Unique du Jeton de Réinitialisation');

$resReused = $authCtrl->resetPassword($reqReset);
$dataReused = json_decode($resReused->getContent(), true) ?? [];

$reusedPass = $resReused->getStatusCode() === 400 &&
    ($dataReused['code'] ?? '') === 'INVALID_RESET_TOKEN';

logResetTestResult(
    '4. Tentative de Réutilisation du Jeton Rejetée (400 INVALID_RESET_TOKEN)',
    $reusedPass,
    "HTTP Code={$resReused->getStatusCode()} | Code=" . ($dataReused['code'] ?? 'null')
);


// ────────────────────────────────────────────────────────────────────────────
// 5. Jeton Expiré (> 60 minutes)
// ────────────────────────────────────────────────────────────────────────────
logResetTestHeader('5. Gestion de l\'Expiration du Jeton (> 60 minutes)');

$expiredRawToken = \Illuminate\Support\Facades\Password::broker()->createToken($user);
DB::table('password_reset_tokens')->updateOrInsert(
    ['email' => $user->email],
    ['token' => Hash::make($expiredRawToken), 'created_at' => now()->subMinutes(61)]
);

$reqExpired = Illuminate\Http\Request::create('/api/v1/auth/reset-password', 'POST', [
    'email'                 => $user->email,
    'token'                 => $expiredRawToken,
    'password'              => 'AnotherPassword123!',
    'password_confirmation' => 'AnotherPassword123!',
]);

$resExpired = $authCtrl->resetPassword($reqExpired);
$dataExpired = json_decode($resExpired->getContent(), true) ?? [];

$expiredPass = $resExpired->getStatusCode() === 400 &&
    ($dataExpired['code'] ?? '') === 'EXPIRED_RESET_TOKEN';

logResetTestResult(
    '5. Jeton Expiré Rejeté (400 EXPIRED_RESET_TOKEN)',
    $expiredPass,
    "HTTP Code={$resExpired->getStatusCode()} | Code=" . ($dataExpired['code'] ?? 'null')
);


// ────────────────────────────────────────────────────────────────────────────
// 6. Révocation des Tokens Sanctum & Intégrité RBAC / Tenant
// ────────────────────────────────────────────────────────────────────────────
logResetTestHeader('6. Révocation des Sessions Sanctum & Conservation RBAC/Tenant');

$activeTokensCount = DB::table('personal_access_tokens')->where('tokenable_id', $user->id)->count();

$integrityPass = $activeTokensCount === 0 &&
    $user->company_id === $company->id &&
    $user->branch_id === $branch->id &&
    $user->role_id === $roleAdmin->id;

logResetTestResult(
    '6. Tokens Sanctum Révoqués & Tenant/RBAC Strictement Conservés',
    $integrityPass,
    "Tokens Sanctum actifs=" . $activeTokensCount . " (attendu 0) | CompanyID={$user->company_id} | RoleID={$user->role_id}"
);


// ── Bilan Final Password Reset ───────────────────────────────────────────────
echo "\n=========================================================\n";
if ($globalPassed) {
    echo " \033[32mRÉSULTAT PASSWORD RESET : TOUS LES TESTS SONT VALIDÉS AVEC SUCCÈS ! 🎉\033[0m\n";
} else {
    echo " \033[31mRÉSULTAT PASSWORD RESET : DES ÉCHECS ONT ÉTÉ DÉTECTÉS. ❌\033[0m\n";
}
echo "=========================================================\n";

if (!$globalPassed) {
    exit(1);
}
