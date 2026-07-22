<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = Illuminate\Http\Request::create('/api/v1/auth/login', 'POST', [
    'email' => 'superadmin@dls.com',
    'password' => 'password'
]);

$controller = new App\Http\Controllers\API\V1\AuthController();
try {
    $response = $controller->login($request);
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Body: " . json_encode($response->getData()) . "\n";
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "ValidationException: " . json_encode($e->errors()) . "\n";
} catch (\Throwable $e) {
    echo "Exception: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
