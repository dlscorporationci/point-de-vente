<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Ajoute les permissions métier manquantes et les associe aux rôles appropriés.
     */
    public function up(): void
    {
        // ─── 1. Permissions manquantes ───────────────────────────────────────
        $newPermissions = [
            ['name' => 'Voir les transferts',      'slug' => 'transfers.view'],
            ['name' => 'Créer des transferts',     'slug' => 'transfers.create'],
            ['name' => 'Gérer les transferts',     'slug' => 'transfers.manage'],
            ['name' => 'Voir les achats',          'slug' => 'purchases.view'],
            ['name' => 'Créer des achats',         'slug' => 'purchases.create'],
            ['name' => 'Gérer les achats',         'slug' => 'purchases.manage'],
            ['name' => 'Ajuster le stock',         'slug' => 'stock.adjust'],
            ['name' => 'Voir les clients',         'slug' => 'customers.view'],
            ['name' => 'Créer des clients',        'slug' => 'customers.create'],
            ['name' => 'Modifier des clients',     'slug' => 'customers.update'],
        ];

        $now = now();
        foreach ($newPermissions as $perm) {
            DB::table('permissions')->insertOrIgnore([
                'name'       => $perm['name'],
                'slug'       => $perm['slug'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // ─── 2. Récupérer les IDs des rôles existants ────────────────────────
        $roles = DB::table('roles')->get()->keyBy('slug');

        // ─── 3. Récupérer les IDs de toutes les permissions (anciennes + nouvelles) ─
        $permissions = DB::table('permissions')->get()->keyBy('slug');

        // ─── 4. Définir les associations rôle → nouvelles permissions ─────────
        $rolePermissionsMap = [
            // Admin : toutes les nouvelles permissions
            'admin' => [
                'transfers.view', 'transfers.create', 'transfers.manage',
                'purchases.view', 'purchases.create', 'purchases.manage',
                'stock.adjust',
                'customers.view', 'customers.create', 'customers.update',
            ],
            // Gérant : toutes sauf manage des achats
            'gerant' => [
                'transfers.view', 'transfers.create', 'transfers.manage',
                'purchases.view', 'purchases.create',
                'stock.adjust',
                'customers.view', 'customers.create', 'customers.update',
            ],
            // Caissier : voir clients, créer clients, voir transferts
            'caissier' => [
                'customers.view', 'customers.create',
                'transfers.view',
            ],
            // Comptable : voir achats, transferts, clients (lecture seule)
            'comptable' => [
                'purchases.view', 'transfers.view', 'customers.view',
            ],
        ];

        // ─── 5. Insérer les associations sans doublons ────────────────────────
        foreach ($rolePermissionsMap as $roleSlug => $permSlugs) {
            if (!isset($roles[$roleSlug])) {
                continue;
            }
            $roleId = $roles[$roleSlug]->id;

            foreach ($permSlugs as $permSlug) {
                if (!isset($permissions[$permSlug])) {
                    continue;
                }
                $permId = $permissions[$permSlug]->id;

                // Éviter les doublons
                $exists = DB::table('role_permission')
                    ->where('role_id', $roleId)
                    ->where('permission_id', $permId)
                    ->exists();

                if (!$exists) {
                    DB::table('role_permission')->insert([
                        'role_id'       => $roleId,
                        'permission_id' => $permId,
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $slugsToRemove = [
            'transfers.view', 'transfers.create', 'transfers.manage',
            'purchases.view', 'purchases.create', 'purchases.manage',
            'stock.adjust',
            'customers.view', 'customers.create', 'customers.update',
        ];

        $ids = DB::table('permissions')->whereIn('slug', $slugsToRemove)->pluck('id');

        // Supprimer les associations
        DB::table('role_permission')->whereIn('permission_id', $ids)->delete();

        // Supprimer les permissions
        DB::table('permissions')->whereIn('slug', $slugsToRemove)->delete();
    }
};
