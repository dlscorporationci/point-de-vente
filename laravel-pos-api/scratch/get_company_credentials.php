<?php

require '/opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/autoload.php';
$app = require_once '/opt/lampp/htdocs/point_de_vente/laravel-pos-api/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$companies = \App\Models\Company::with(['branches', 'users.role'])->get();

echo "==========================================================" . PHP_EOL;
echo "🔑 IDENTIFIANTS ET CODES DE CONNEXION DES ENTREPRISES" . PHP_EOL;
echo "==========================================================" . PHP_EOL . PHP_EOL;

foreach ($companies as $c) {
    echo "🏢 ENTREPRISE : {$c->name} (ID: {$c->id})" . PHP_EOL;
    echo "----------------------------------------------------------" . PHP_EOL;
    echo "📌 Boutiques rattachées :" . PHP_EOL;
    foreach ($c->branches as $b) {
        $type = $b->is_warehouse ? 'Entrepôt Central' : 'Boutique POS';
        echo "   - [ID {$b->id}] {$b->name} ({$type}, Statut: {$b->status})" . PHP_EOL;
    }
    echo PHP_EOL . "👤 Utilisateurs de l'entreprise :" . PHP_EOL;
    foreach ($c->users as $u) {
        $roleName = $u->role ? $u->role->name : 'N/A';
        $roleSlug = $u->role ? $u->role->slug : 'N/A';
        echo "   • {$u->name} ({$roleName} [{$roleSlug}])" . PHP_EOL;
        echo "     - Email: {$u->email}" . PHP_EOL;
        echo "     - Mot de passe démo: password123 (ou admin123 / secret)" . PHP_EOL;
        echo "     - Code PIN: 1234 (ou 0000)" . PHP_EOL;
        echo "     - Boutique principale: ID " . ($u->branch_id ?: 'Toutes (Admin)') . PHP_EOL;
    }
    echo PHP_EOL . "==========================================================" . PHP_EOL . PHP_EOL;
}
