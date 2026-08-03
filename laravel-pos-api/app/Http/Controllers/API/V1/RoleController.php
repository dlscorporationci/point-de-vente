<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\Permission;
use App\Services\TenantManager;
use Illuminate\Support\Str;
use App\Traits\Auditable;

class RoleController extends Controller
{
    use Auditable;

    /**
     * Obtenir le catalogue de toutes les permissions système granulaires groupées par module.
     */
    public function getAvailablePermissions()
    {
        $permissions = Permission::all();

        $modules = [
            'ventes' => [
                'name' => '🛒 Ventes & Caisse',
                'permissions' => [
                    'sales.view' => 'Voir les ventes',
                    'sales.create' => 'Effectuer des encaissements / créer des ventes',
                    'sales.cancel' => 'Annuler une vente',
                    'sales.refund' => 'Rembourser une vente',
                    'sales.discount' => 'Appliquer une remise exceptionnelle',
                ]
            ],
            'produits' => [
                'name' => '📦 Catalogue Produit & Prix',
                'permissions' => [
                    'products.view' => 'Voir les produits',
                    'products.create' => 'Créer des nouveaux produits',
                    'products.update' => 'Modifier des produits',
                    'products.delete' => 'Supprimer des produits / Suppression massive',
                ]
            ],
            'stock' => [
                'name' => '🧱 Gestion des Stocks & Inventaires',
                'permissions' => [
                    'stock.view' => 'Voir l\'état des stocks',
                    'stock.adjust' => 'Ajuster les quantités en stock',
                    'stock.transfer' => 'Initiateur de transfert de stock',
                    'stock.approve_transfer' => 'Valider / Approuver un transfert entre boutiques',
                ]
            ],
            'achats' => [
                'name' => '🛍️ Achats & Fournisseurs',
                'permissions' => [
                    'purchases.view' => 'Voir les commandes d\'achats',
                    'purchases.create' => 'Créer une commande d\'achat',
                    'suppliers.manage' => 'Gérer la fiche des fournisseurs',
                ]
            ],
            'caisse' => [
                'name' => '💵 Sessions de Caisse',
                'permissions' => [
                    'cash.open' => 'Ouvrir une session de caisse',
                    'cash.close' => 'Fermer une session de caisse',
                    'cash.view_all' => 'Voir les sessions de caisse des autres caissiers',
                ]
            ],
            'personnel' => [
                'name' => '👥 Gestion du Personnel & Rôles',
                'permissions' => [
                    'users.view' => 'Voir la liste du personnel',
                    'users.create' => 'Créer des membres du personnel',
                    'users.update' => 'Modifier le personnel',
                    'users.delete' => 'Désactiver / Bloquer du personnel',
                    'roles.manage' => 'Créer et configurer des rôles personnalisés',
                ]
            ],
            'rapports' => [
                'name' => '📊 Rapports & Statistiques',
                'permissions' => [
                    'reports.view' => 'Consulter les rapports financiers et de vente',
                    'reports.export' => 'Exporter les données (PDF, Excel)',
                ]
            ],
            'parametres' => [
                'name' => '⚙️ Paramètres de Gestion',
                'permissions' => [
                    'settings.manage' => 'Modifier les règles de gestion et paramètres système',
                ]
            ],
        ];

        return response()->json([
            'modules' => $modules,
            'all_permissions' => $permissions
        ]);
    }

    /**
     * Liste des rôles système et rôles personnalisés de l'entreprise.
     */
    public function index(Request $request)
    {
        $tenantManager = app(TenantManager::class);
        $companyId = $tenantManager->getCompanyId() ?: $request->user()->company_id;

        $roles = Role::whereNull('company_id')
            ->orWhere('company_id', $companyId)
            ->with('permissions:id,name,slug')
            ->get();

        return response()->json($roles);
    }

    /**
     * Création d'un rôle personnalisé pour l'entreprise.
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();
        $tenantManager = app(TenantManager::class);
        $companyId = $tenantManager->getCompanyId() ?: $currentUser->company_id;

        $request->validate([
            'name' => 'required|string|max:100',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $slug = Str::slug($request->name) . '-' . rand(100, 999);

        $role = Role::create([
            'company_id' => $companyId,
            'name'       => $request->name,
            'slug'       => $slug,
        ]);

        if (!empty($request->permissions)) {
            $permissionIds = Permission::whereIn('slug', $request->permissions)->pluck('id');
            $role->permissions()->sync($permissionIds);
        }

        $this->logAuditEvent('CUSTOM_ROLE_CREATED', [
            'role_name' => $role->name,
            'permissions' => $request->permissions,
        ], $currentUser);

        return response()->json([
            'message' => "Le rôle personnalisé \"{$role->name}\" a été créé avec succès.",
            'role'    => $role->load('permissions')
        ], 201);
    }

    /**
     * Modification d'un rôle personnalisé.
     */
    public function update(Request $request, $id)
    {
        $currentUser = $request->user();
        $tenantManager = app(TenantManager::class);
        $companyId = $tenantManager->getCompanyId() ?: $currentUser->company_id;

        $role = Role::where('company_id', $companyId)->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $role->update(['name' => $request->name]);

        if (isset($request->permissions)) {
            $permissionIds = Permission::whereIn('slug', $request->permissions)->pluck('id');
            $role->permissions()->sync($permissionIds);
        }

        $this->logAuditEvent('CUSTOM_ROLE_UPDATED', [
            'role_id' => $role->id,
            'role_name' => $role->name,
            'permissions' => $request->permissions,
        ], $currentUser);

        return response()->json([
            'message' => "Rôle \"{$role->name}\" mis à jour.",
            'role'    => $role->load('permissions')
        ]);
    }

    /**
     * Suppression d'un rôle personnalisé.
     */
    public function destroy(Request $request, $id)
    {
        $currentUser = $request->user();
        $tenantManager = app(TenantManager::class);
        $companyId = $tenantManager->getCompanyId() ?: $currentUser->company_id;

        $role = Role::where('company_id', $companyId)->findOrFail($id);

        // Bloquer la suppression si des utilisateurs ont ce rôle
        if ($role->users()->count() > 0) {
            return response()->json([
                'error' => "Impossible de supprimer ce rôle car il est attribué à {$role->users()->count()} membre(s) du personnel."
            ], 422);
        }

        $roleName = $role->name;
        $role->delete();

        $this->logAuditEvent('CUSTOM_ROLE_DELETED', [
            'role_name' => $roleName,
        ], $currentUser);

        return response()->json(['message' => "Le rôle \"{$roleName}\" a été supprimé."]);
    }
}
