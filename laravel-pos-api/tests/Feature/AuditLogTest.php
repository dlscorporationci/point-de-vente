<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Company;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected Company $company;
    protected Branch $branch;

    protected function setUp(): void
    {
        parent::setUp();

        // Structure
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
    }

    /**
     * Test que les actions d'écriture (création, mise à jour) sur un produit
     * déclenchent automatiquement la consignation d'audit.
     */
    public function test_product_lifecycle_is_audited()
    {
        // 1. Authentification
        $this->actingAs($this->admin);

        // 2. Création du produit
        $product = Product::create([
            'company_id'    => $this->company->id,
            'name'          => 'Ciment Test',
            'sku'           => 'CIM-TEST',
            'barcode'       => '00000',
            'selling_price' => 5000,
            'cost_price'    => 4000,
            'status'        => 'active'
        ]);

        // Vérifier le log d'audit pour la création
        $this->assertDatabaseHas('audit_logs', [
            'company_id'     => $this->company->id,
            'user_id'        => $this->admin->id,
            'auditable_type' => Product::class,
            'auditable_id'   => $product->id,
            'action'         => 'created',
        ]);

        // 3. Modification du produit
        $product->update([
            'selling_price' => 5500,
            'name'          => 'Ciment Test Modifié'
        ]);

        // Vérifier le log d'audit pour la mise à jour
        $this->assertDatabaseHas('audit_logs', [
            'company_id'     => $this->company->id,
            'user_id'        => $this->admin->id,
            'auditable_type' => Product::class,
            'auditable_id'   => $product->id,
            'action'         => 'updated',
        ]);

        // Récupérer le log pour inspecter les valeurs anciennes/nouvelles
        $log = AuditLog::where('action', 'updated')
            ->where('auditable_type', Product::class)
            ->where('auditable_id', $product->id)
            ->first();

        $this->assertNotNull($log);
        $this->assertEquals(5000, $log->old_values['selling_price']);
        $this->assertEquals(5500, $log->new_values['selling_price']);
        $this->assertEquals('Ciment Test', $log->old_values['name']);
        $this->assertEquals('Ciment Test Modifié', $log->new_values['name']);
    }
}
