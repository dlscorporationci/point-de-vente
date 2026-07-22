<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\CashSession;
use App\Models\Company;
use App\Models\Product;
use App\Models\Role;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GeniusPayTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected Company $company;
    protected Branch $branch;
    protected CashSession $session;
    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Structure de base
        $this->company = Company::create(['name' => 'Test Company']);
        $this->branch  = Branch::create([
            'company_id' => $this->company->id,
            'name'       => 'Centrale',
            'address'    => 'Dakar',
            'phone'      => '123'
        ]);

        $role = Role::create(['name' => 'admin', 'permissions' => []]);
        $this->admin = User::create([
            'company_id' => $this->company->id,
            'branch_id'  => $this->branch->id,
            'role_id'    => $role->id,
            'name'       => 'Test User',
            'email'      => 'test@example.com',
            'password'   => bcrypt('password'),
            'status'     => 'active'
        ]);

        // Caisse ouverte
        $this->session = CashSession::create([
            'company_id'      => $this->company->id,
            'branch_id'       => $this->branch->id,
            'user_id'         => $this->admin->id,
            'opening_balance' => 10000,
            'status'          => 'open',
            'opened_at'       => now(),
        ]);

        // Produit
        $this->product = Product::create([
            'company_id'    => $this->company->id,
            'name'          => 'Ciment',
            'sku'           => 'CIM-01',
            'barcode'       => '12345',
            'selling_price' => 5000,
            'cost_price'    => 4000,
            'stock_alert'   => 5,
            'status'        => 'active'
        ]);
    }

    /**
     * Test de l'initiation du paiement GeniusPay.
     */
    public function test_initiate_geniuspay_payment()
    {
        // Créer une vente en statut non payé
        $sale = Sale::create([
            'company_id'      => $this->company->id,
            'branch_id'       => $this->branch->id,
            'user_id'         => $this->admin->id,
            'cash_session_id' => $this->session->id,
            'sale_number'     => 'VTE-000001',
            'subtotal'        => 5000,
            'discount'        => 0,
            'tax'             => 900,
            'total'           => 5900,
            'payment_method'  => 'geniuspay',
            'payment_status'  => 'pending',
        ]);

        // Configurer les clés de test
        config(['geniuspay.api_key' => 'test_pk']);
        config(['geniuspay.api_secret' => 'test_sk']);
        config(['geniuspay.base_url' => 'https://pay.genius.ci/api/v1']);

        // Faker l'appel HTTP vers GeniusPay
        Http::fake([
            'https://pay.genius.ci/api/v1/merchant/payments' => Http::response([
                'id'           => 'txn_test123',
                'amount'       => 5900,
                'status'       => 'pending',
                'redirect_url' => 'https://pay.genius.ci/checkout/txn_test123'
            ], 200)
        ]);

        $response = $this->actingAs($this->admin)
            ->withHeaders(['X-Company-ID' => $this->company->id])
            ->postJson('/api/v1/payments/initiate', [
                'sale_id' => $sale->id,
                'phone'   => '+2250700000000',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('transaction_id', 'txn_test123')
            ->assertJsonPath('redirect_url', 'https://pay.genius.ci/checkout/txn_test123');

        $this->assertDatabaseHas('sales', [
            'id'                       => $sale->id,
            'geniuspay_transaction_id' => 'txn_test123',
            'payment_status'           => 'pending',
        ]);
    }

    /**
     * Test de la validation du Webhook GeniusPay avec signature HMAC valide.
     */
    public function test_geniuspay_webhook_valid_signature()
    {
        $sale = Sale::create([
            'company_id'               => $this->company->id,
            'branch_id'                => $this->branch->id,
            'user_id'                  => $this->admin->id,
            'cash_session_id'          => $this->session->id,
            'sale_number'              => 'VTE-000002',
            'subtotal'                 => 5000,
            'discount'                 => 0,
            'tax'                      => 900,
            'total'                    => 5900,
            'payment_method'           => 'geniuspay',
            'payment_status'           => 'pending',
            'geniuspay_transaction_id' => 'txn_test999'
        ]);

        config(['geniuspay.webhook_secret' => 'whsec_test']);

        $payload = [
            'id'       => 'txn_test999',
            'status'   => 'paid',
            'amount'   => 5900,
            'metadata' => [
                'sale_id' => $sale->id
            ]
        ];

        $payloadJson = json_encode($payload);
        $signature   = hash_hmac('sha256', $payloadJson, 'whsec_test');

        $response = $this->withHeaders([
            'X-Genius-Signature' => $signature,
            'X-Company-ID'       => $this->company->id
        ])->postJson('/api/v1/webhooks/geniuspay', $payload);

        $response->assertStatus(200)
            ->assertJsonPath('received', true);

        // La vente doit être marquée comme payée
        $this->assertDatabaseHas('sales', [
            'id'             => $sale->id,
            'payment_status' => 'paid',
        ]);

        // Une transaction de caisse de type deposit doit être enregistrée
        $this->assertDatabaseHas('cash_session_transactions', [
            'cash_session_id' => $this->session->id,
            'type'            => 'deposit',
            'amount'          => 5900.00
        ]);
    }

    /**
     * Test du Webhook GeniusPay avec signature invalide.
     */
    public function test_geniuspay_webhook_invalid_signature()
    {
        config(['geniuspay.webhook_secret' => 'whsec_test']);

        $payload = [
            'id'     => 'txn_test999',
            'status' => 'paid',
        ];

        $response = $this->withHeaders([
            'X-Genius-Signature' => 'invalid_signature',
            'X-Company-ID'       => $this->company->id
        ])->postJson('/api/v1/webhooks/geniuspay', $payload);

        $response->assertStatus(403);
    }
}
