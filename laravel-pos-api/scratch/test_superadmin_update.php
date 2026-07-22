<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::withoutGlobalScopes()->where('email', 'superadmin@dls.com')->first();
if (!$user) {
    echo "Superadmin introuvable\n";
    exit(1);
}

Auth::login($user);
$company = App\Models\Company::first();
echo "Testing update for company ID: {$company->id} ({$company->name})\n";

$request = Illuminate\Http\Request::create("/api/v1/admin/companies/{$company->id}", 'POST', ['status' => 'inactive']);
$request->setUserResolver(fn() => $user);

$controller = new App\Http\Controllers\API\V1\SuperAdminController();
try {
    $response = $controller->updateCompany($request, $company->id);
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Response: " . json_encode($response->getData()) . "\n";
} catch (\Throwable $e) {
    echo "Exception: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
