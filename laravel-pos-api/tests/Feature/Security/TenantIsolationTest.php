<?php

namespace Tests\Feature\Security;

use Tests\TestCase;
use App\Models\User;
use App\Models\Company;
use App\Models\Branch;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TenantIsolationTest extends TestCase
{
    public function test_user_cannot_access_other_company_products()
    {
        $companyA = Company::create(['name' => 'Company A Security Test']);
        $companyB = Company::create(['name' => 'Company B Security Test']);

        $branchA = Branch::create(['company_id' => $companyA->id, 'name' => 'Branch A']);
        $branchB = Branch::create(['company_id' => $companyB->id, 'name' => 'Branch B']);

        $userA = User::create([
            'company_id' => $companyA->id,
            'branch_id'  => $branchA->id,
            'role_id'    => 4,
            'name'       => 'User A',
            'email'      => 'usera_' . rand(100, 999) . '@test.com',
            'password'   => bcrypt('password'),
            'status'     => 'active',
        ]);

        $productB = Product::create([
            'company_id'    => $companyB->id,
            'category_id'   => 1,
            'sku'           => 'SKU-CONF-B-' . rand(100, 999),
            'name'          => 'Confidential Product B',
            'selling_price' => 5000,
        ]);

        $response = $this->actingAs($userA, 'sanctum')
            ->getJson("/api/v1/products/{$productB->id}");

        $this->assertTrue(in_array($response->status(), [403, 404]));
    }
}
