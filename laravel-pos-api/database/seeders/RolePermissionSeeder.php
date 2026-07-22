<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\Branch;
use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Création de la Company test
        $company = Company::create([
            'id' => 1,
            'name' => 'DLS Corporation',
            'timezone' => 'Africa/Dakar',
            'currency' => 'XOF',
            'status' => 'active',
        ]);

        // 2. Création des Branches tests
        $branch = Branch::create([
            'id' => 1,
            'company_id' => $company->id,
            'name' => 'Boutique Centrale',
            'address' => 'Dakar Plateau',
            'phone' => '+221338000000',
        ]);

        $branch2 = Branch::create([
            'id' => 2,
            'company_id' => $company->id,
            'name' => 'Boutique Rufisque',
            'address' => 'Route de Rufisque, Rufisque',
            'phone' => '+221338991122',
        ]);

        // 3. Définition des permissions initiales
        $permissionsList = [
            // Produits et Stock
            ['name' => 'Voir les produits', 'slug' => 'products.view'],
            ['name' => 'Créer des produits', 'slug' => 'products.create'],
            ['name' => 'Modifier des produits', 'slug' => 'products.update'],
            ['name' => 'Supprimer des produits', 'slug' => 'products.delete'],
            
            // Ventes et Caisse
            ['name' => 'Voir les ventes', 'slug' => 'sales.view'],
            ['name' => 'Effectuer une vente', 'slug' => 'sales.create'],
            ['name' => 'Appliquer une remise', 'slug' => 'sales.discount'],
            ['name' => 'Annuler une vente', 'slug' => 'sales.cancel'],
            ['name' => 'Gérer les sessions de caisse', 'slug' => 'cash-sessions.manage'],

            // Utilisateurs
            ['name' => 'Voir les utilisateurs', 'slug' => 'users.view'],
            ['name' => 'Créer des utilisateurs', 'slug' => 'users.create'],
            ['name' => 'Modifier des utilisateurs', 'slug' => 'users.update'],
            ['name' => 'Supprimer des utilisateurs', 'slug' => 'users.delete'],

            // Fournisseurs
            ['name' => 'Voir les fournisseurs', 'slug' => 'suppliers.view'],
            ['name' => 'Créer des fournisseurs', 'slug' => 'suppliers.create'],
            ['name' => 'Modifier des fournisseurs', 'slug' => 'suppliers.update'],
            ['name' => 'Supprimer des fournisseurs', 'slug' => 'suppliers.delete'],

            // Rapports et Paramètres
            ['name' => 'Voir les rapports financiers', 'slug' => 'reports.view'],
            ['name' => 'Modifier les paramètres de l\'entreprise', 'slug' => 'settings.update'],
        ];

        $createdPermissions = [];
        foreach ($permissionsList as $perm) {
            $createdPermissions[$perm['slug']] = Permission::create($perm);
        }

        // 4. Définition des Rôles
        // Rôle Super-Admin (SaaS Global - pas lié à une entreprise en particulier)
        $superAdminRole = Role::create([
            'name' => 'Super-Administrateur SaaS',
            'slug' => 'super-admin',
            'company_id' => null,
        ]);

        // Rôles liés à l'entreprise
        $adminRole = Role::create([
            'name' => 'Administrateur Entreprise',
            'slug' => 'admin',
            'company_id' => $company->id,
        ]);

        $managerRole = Role::create([
            'name' => 'Gérant de Boutique',
            'slug' => 'gerant',
            'company_id' => $company->id,
        ]);

        $cashierRole = Role::create([
            'name' => 'Caissier',
            'slug' => 'caissier',
            'company_id' => $company->id,
        ]);

        $accountantRole = Role::create([
            'name' => 'Comptable',
            'slug' => 'comptable',
            'company_id' => $company->id,
        ]);

        // 5. Association des permissions aux rôles
        // Admin obtient TOUTES les permissions
        $adminRole->permissions()->sync(array_column($createdPermissions, 'id'));

        // Gérant obtient : produits (all), ventes (all sauf annulation), caisse (manage), utilisateurs (view), fournisseurs (all)
        $managerPermissions = [
            'products.view', 'products.create', 'products.update',
            'sales.view', 'sales.create', 'sales.discount',
            'cash-sessions.manage', 'users.view',
            'suppliers.view', 'suppliers.create', 'suppliers.update', 'suppliers.delete'
        ];
        $managerRole->permissions()->sync(
            array_map(fn($slug) => $createdPermissions[$slug]->id, $managerPermissions)
        );

        // Caissier obtient : produits (view), ventes (create, view), fournisseurs (view)
        $cashierPermissions = ['products.view', 'sales.create', 'sales.view', 'suppliers.view'];
        $cashierRole->permissions()->sync(
            array_map(fn($slug) => $createdPermissions[$slug]->id, $cashierPermissions)
        );

        // Comptable obtient : ventes (view), rapports (view), fournisseurs (view)
        $accountantPermissions = ['sales.view', 'reports.view', 'suppliers.view'];
        $accountantRole->permissions()->sync(
            array_map(fn($slug) => $createdPermissions[$slug]->id, $accountantPermissions)
        );

        // 6. Désactivation du scope global de Tenancy temporairement pour pouvoir créer l'utilisateur Admin
        // En effet, lors du seeding via la console, il n'y a pas de Tenant configuré en requête HTTP.
        // On résout le TenantManager et on force le Company ID pour le cycle du seed.
        $tenantManager = app(\App\Services\TenantManager::class);
        $tenantManager->setCompany($company);

        // 7. Création de l'utilisateur Admin
        User::create([
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'role_id' => $adminRole->id,
            'name' => 'Administrateur DLS',
            'email' => 'admin@dls.com',
            'password' => 'password', // sera crypté par le cast 'hashed' de User
            'pin_code' => '1234', // sera crypté par le cast 'pin_code' => 'hashed'
            'status' => 'active',
        ]);

        // 8. Création de l'utilisateur Caissier
        User::create([
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'role_id' => $cashierRole->id,
            'name' => 'Caissier DLS',
            'email' => 'caissier@dls.com',
            'password' => 'password',
            'pin_code' => '4321',
            'status' => 'active',
        ]);

        // 8.5. Création de l'utilisateur Gérant
        User::create([
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'role_id' => $managerRole->id,
            'name' => 'Gérant DLS',
            'email' => 'gerant@dls.com',
            'password' => 'password',
            'pin_code' => '5678',
            'status' => 'active',
        ]);

        // 9. Création des Catégories de produits
        $catConstruction = Category::create([
            'company_id' => $company->id,
            'name' => 'Matériaux de construction',
            'slug' => 'materiaux-de-construction',
        ]);

        $catOutillage = Category::create([
            'company_id' => $company->id,
            'name' => 'Outillage',
            'slug' => 'outillage',
        ]);

        // 10. Création des Produits
        Product::create([
            'company_id' => $company->id,
            'category_id' => $catConstruction->id,
            'name' => 'Ciment SOCOCIM 50kg',
            'sku' => 'CIM-SOCO-50',
            'barcode' => '3700021300051',
            'description' => 'Sac de ciment de haute résistance 50kg',
            'selling_price' => 3500.00,
            'tax_rate' => 18.00,
            'alert_quantity' => 10.00,
            'status' => 'active',
        ]);

        Product::create([
            'company_id' => $company->id,
            'category_id' => $catOutillage->id,
            'name' => 'Marteau arrache-clous',
            'sku' => 'MART-ARR-CLO',
            'barcode' => '3700021300068',
            'description' => 'Marteau arrache-clous en acier trempé',
            'selling_price' => 2500.00,
            'tax_rate' => 18.00,
            'alert_quantity' => 5.00,
            'status' => 'active',
        ]);

        Product::create([
            'company_id' => $company->id,
            'category_id' => $catConstruction->id,
            'name' => 'Brouette Standard',
            'sku' => 'BROU-STD',
            'barcode' => '3700021300075',
            'description' => 'Brouette de chantier renforcée 80L',
            'selling_price' => 15000.00,
            'tax_rate' => 18.00,
            'alert_quantity' => 2.00,
            'status' => 'active',
        ]);

        // 11. Création des Fournisseurs
        Supplier::create([
            'company_id' => $company->id,
            'name' => 'Quincaillerie Al-Azhar',
            'email' => 'contact@alazhar.sn',
            'phone' => '+221 33 824 55 66',
            'address' => 'Avenue Blaise Diagne, Dakar',
            'debt_balance' => 150000.00, // Nous leur devons 150k
        ]);

        Supplier::create([
            'company_id' => $company->id,
            'name' => 'Sénégal Matériaux',
            'email' => 'sales@senegalmateriaux.com',
            'phone' => '+221 33 897 12 34',
            'address' => 'Zone Industrielle de Hann, Dakar',
            'debt_balance' => 0.00,
        ]);
    }
}
