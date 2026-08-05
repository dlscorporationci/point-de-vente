<?php

namespace Tests\Feature\Security;

use Tests\TestCase;
use App\Models\User;
use App\Models\Company;
use App\Models\Branch;

class EmailValidationTest extends TestCase
{
    public function test_registration_fails_for_non_existent_email_domain()
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'company_name'          => 'Test Inexistent Domain',
            'name'                  => 'Test User',
            'email'                 => 'admin@nonexistentdomain99999999.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    public function test_registration_fails_for_disposable_email()
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'company_name'          => 'Test Disposable Email',
            'name'                  => 'Test User',
            'email'                 => 'john@mailinator.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }
}
