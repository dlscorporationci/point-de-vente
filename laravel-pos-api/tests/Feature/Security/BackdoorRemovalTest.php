<?php

namespace Tests\Feature\Security;

use Tests\TestCase;
use App\Models\User;
use App\Models\Company;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class BackdoorRemovalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Créer une entreprise de test
        $company = Company::create([
            'name' => 'Test Company',
            'code' => 'TEST-01',
            'status' => 'active',
        ]);

        // 2. Créer les rôles
        $adminRole = Role::create(['name' => 'Admin', 'slug' => 'admin', 'company_id' => $company->id]);
        $superAdminRole = Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'company_id' => null]);

        // 3. Créer un utilisateur standard avec son VRAI mot de passe unique
        User::create([
            'name' => 'Utilisateur A',
            'email' => 'usera@example.com',
            'password' => Hash::make('RealUserPass123!'),
            'role_id' => $adminRole->id,
            'company_id' => $company->id,
            'status' => 'active',
        ]);

        // 4. Créer le SuperAdmin avec son VRAI mot de passe unique
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@dls.com',
            'password' => Hash::make('SuperSecretAdmin2026!'),
            'role_id' => $superAdminRole->id,
            'company_id' => null,
            'status' => 'active',
        ]);
    }

    public function test_scenario_a_user_with_real_password_can_login()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'usera@example.com',
            'password' => 'RealUserPass123!',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['token', 'user']);
    }

    public function test_scenario_b_user_with_pass2026_master_pass_is_rejected()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'usera@example.com',
            'password' => 'Pass2026!',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    public function test_scenario_c_user_with_generic_password_is_rejected()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'usera@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    public function test_scenario_d_user_with_gdji_backdoor_password_is_rejected()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'usera@example.com',
            'password' => 'Gdji29042006//',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    public function test_scenario_e_superadmin_can_login_only_with_real_credentials()
    {
        // Tentative 1 : Faux mot de passe (hardcodé historique) -> REFUSÉ
        $fakeResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'superadmin@dls.com',
            'password' => 'password',
        ]);
        $fakeResponse->assertStatus(422);

        // Tentative 2 : Faux mot de passe (Pass2026!) -> REFUSÉ
        $fakeResponse2 = $this->postJson('/api/v1/auth/login', [
            'email' => 'superadmin@dls.com',
            'password' => 'Pass2026!',
        ]);
        $fakeResponse2->assertStatus(422);

        // Tentative 3 : Vrai mot de passe -> AUTORISÉ
        $realResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'superadmin@dls.com',
            'password' => 'SuperSecretAdmin2026!',
        ]);
        $realResponse->assertStatus(200);
        $realResponse->assertJsonStructure(['token', 'user']);
    }
}
