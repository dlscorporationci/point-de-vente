<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::withoutGlobalScopes()->where('email', 'superadmin@dls.com')->first();
if (!$user) {
    echo "UTILISATEUR SUPERADMIN INTROUVABLE\n";
    exit(1);
}

$user->password = Illuminate\Support\Facades\Hash::make('password');
$user->status = 'active';
$user->save();

$check = Illuminate\Support\Facades\Hash::check('password', $user->password);

echo "MOT DE PASSE SUPERADMIN DEFINI A 'password' : " . ($check ? "VALIDE ET VERIFIE" : "ECHEC") . "\n";
