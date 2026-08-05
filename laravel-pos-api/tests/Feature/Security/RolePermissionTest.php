<?php

namespace Tests\Feature\Security;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Company;
use App\Models\Branch;
use App\Models\CashSession;

class RolePermissionTest extends TestCase
{
    public function test_cashier_without_discount_permission_cannot_apply_discount()
    {
        $company = Company::create(['name' => 'Role Test Co']);
        $branch  = Branch::create(['company_id' => $company->id, 'name' => 'Main']);
        
        $role = Role::create([
            'company_id' => $company->id,
            'name'       => 'Restricted Cashier',
            'slug'       => 'cashier-restricted',
        ]);

        $cashier = User::create([
            'company_id' => $company->id,
            'branch_id'  => $branch->id,
            'role_id'    => $role->id,
            'name'       => 'No Discount Cashier',
            'email'      => 'nodiscount_' . rand(100, 999) . '@test.com',
            'password'   => bcrypt('password'),
            'status'     => 'active',
        ]);

        $session = CashSession::create([
            'company_id'      => $company->id,
            'branch_id'       => $branch->id,
            'user_id'         => $cashier->id,
            'opening_balance' => 10000,
            'status'          => 'open',
            'opened_at'       => now(),
        ]);

        $response = $this->actingAs($cashier, 'sanctum')
            ->postJson('/api/v1/sales', [
                'cash_session_id' => $session->id,
                'payment_method'  => 'cash',
                'global_discount' => 2000,
                'items' => [
                    ['product_id' => 1, 'quantity' => 1, 'selling_price' => 10000, 'discount' => 0]
                ]
            ]);

        $response->assertStatus(403);
    }
}
