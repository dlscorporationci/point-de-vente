<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Récupérer ou créer le rôle super-admin
        $roleId = DB::table('roles')->where('slug', 'super-admin')->value('id');

        if (!$roleId) {
            $roleId = DB::table('roles')->insertGetId([
                'name' => 'Super-Administrateur SaaS',
                'slug' => 'super-admin',
                'company_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Insérer l'utilisateur Super Admin
        DB::table('users')->updateOrInsert(
            ['email' => 'superadmin@dls.com'],
            [
                'company_id' => null,
                'branch_id' => null,
                'role_id' => $roleId,
                'name' => 'Super Administrateur Global',
                'password' => Hash::make('password'),
                'pin_code' => Hash::make('9999'),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('users')->where('email', 'superadmin@dls.com')->delete();
    }
};
