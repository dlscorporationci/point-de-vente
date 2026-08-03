<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\V1\AuthController;

Route::prefix('v1')->middleware('tenant')->group(function () {
    // Route de test du tenant
    Route::get('/tenant-test', function () {
        $tenantManager = app(\App\Services\TenantManager::class);
        return response()->json([
            'company' => $tenantManager->getCompany(),
            'branch'  => $tenantManager->getBranch(),
        ]);
    });

    // Routes publiques d'authentification avec limitation de débit (throttle:30,1)
    Route::middleware('throttle:30,1')->group(function () {
        Route::post('/auth/login',          [AuthController::class, 'login']);
        Route::post('/auth/login-pin',      [AuthController::class, 'loginPin']);
        Route::post('/auth/register',       [AuthController::class, 'register']);
        Route::post('/auth/forgot-password',[AuthController::class, 'forgotPassword']);
        Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
        Route::get('/auth/companies',       [AuthController::class, 'getPublicCompanies']);
        Route::get('/auth/companies/{id}/users', [AuthController::class, 'getPublicUsers']);
    });

    // Routes d'authentification protégées par Sanctum
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout',        [AuthController::class, 'logout']);
        Route::get('/auth/me',             [AuthController::class, 'me']);
        Route::post('/auth/profile',       [AuthController::class, 'updateProfile']);
        Route::post('/auth/switch-branch', [AuthController::class, 'switchBranch']);

        // -----------------------------------------------------------------------
        // Dashboard & Statistiques Contextuelles
        // -----------------------------------------------------------------------
        Route::get('/dashboard/stats', [\App\Http\Controllers\API\V1\DashboardController::class, 'stats']);

        // -----------------------------------------------------------------------
        // Moteur de Synchronisation Offline-First (PUSH / PULL / Health)
        // -----------------------------------------------------------------------
        Route::get('/sync/health', [\App\Http\Controllers\API\V1\SyncController::class, 'health']);
        Route::post('/sync/push',  [\App\Http\Controllers\API\V1\SyncController::class, 'push']);
        Route::get('/sync/pull',   [\App\Http\Controllers\API\V1\SyncController::class, 'pull']);

        // -----------------------------------------------------------------------
        // Notifications Système
        // -----------------------------------------------------------------------
        Route::get('/notifications',              [\App\Http\Controllers\API\V1\NotificationController::class, 'index']);
        Route::get('/notifications/unread-count', [\App\Http\Controllers\API\V1\NotificationController::class, 'unreadCount']);
        Route::post('/notifications/{id}/read',   [\App\Http\Controllers\API\V1\NotificationController::class, 'markAsRead']);
        Route::post('/notifications/read-all',    [\App\Http\Controllers\API\V1\NotificationController::class, 'markAllAsRead']);

        // -----------------------------------------------------------------------
        // Caisses & Terminaux Physiques
        // -----------------------------------------------------------------------
        Route::get('/cash-registers',         [\App\Http\Controllers\API\V1\CashRegisterController::class, 'index']);
        Route::post('/cash-registers',        [\App\Http\Controllers\API\V1\CashRegisterController::class, 'store']);
        Route::put('/cash-registers/{id}',    [\App\Http\Controllers\API\V1\CashRegisterController::class, 'update']);
        Route::delete('/cash-registers/{id}', [\App\Http\Controllers\API\V1\CashRegisterController::class, 'destroy']);

        // -----------------------------------------------------------------------
        // Gestion des utilisateurs de l'entreprise (accessible à tous les rôles
        // pour la liste; création/modification réservée aux admins)
        // -----------------------------------------------------------------------
        Route::get('/users', [AuthController::class, 'getTenantUsers']);

        Route::middleware('role:admin,super-admin')->group(function () {
            Route::post('/users',                       [AuthController::class, 'createUser']);
            Route::put('/users/{id}',                   [AuthController::class, 'updateUser']);
            Route::post('/users/{id}/toggle-status',    [AuthController::class, 'toggleUserStatus']);
            Route::post('/users/{id}/reset-pin',        [AuthController::class, 'resetUserPin']);
        });

        // -----------------------------------------------------------------------
        // Paramètres de l'entreprise (TVA, nom, etc.)
        // Accès réservé aux admins et super-admin
        // -----------------------------------------------------------------------
        Route::middleware('role:admin,super-admin')->group(function () {
            Route::match(['post', 'put'], '/company-settings', [AuthController::class, 'updateCompanySettings']);
        });

        // -----------------------------------------------------------------------
        // Gestion des boutiques (succursales)
        // Liste accessible à tous; CRUD réservé aux admins
        // -----------------------------------------------------------------------
        Route::get('/branches', [\App\Http\Controllers\API\V1\BranchController::class, 'index']);

        Route::middleware('role:admin,super-admin')->group(function () {
            Route::post('/branches',                  [\App\Http\Controllers\API\V1\BranchController::class, 'store']);
            Route::put('/branches/{id}',              [\App\Http\Controllers\API\V1\BranchController::class, 'update']);
            Route::post('/branches/{id}/toggle-status', [\App\Http\Controllers\API\V1\BranchController::class, 'toggleStatus']);
            Route::delete('/branches/{id}',           [\App\Http\Controllers\API\V1\BranchController::class, 'destroy']);
        });

        // -----------------------------------------------------------------------
        // Catalogue Produits & Catégories
        // -----------------------------------------------------------------------
        // Catalogue Produit & Packs de Catalogues Prédéfinis
        // -----------------------------------------------------------------------
        Route::post('/products/destroy-all', [\App\Http\Controllers\API\V1\ProductController::class, 'destroyAll']);
        Route::apiResource('products', \App\Http\Controllers\API\V1\ProductController::class);
        Route::get('/categories',  [\App\Http\Controllers\API\V1\ProductController::class, 'categories']);
        Route::post('/categories', [\App\Http\Controllers\API\V1\ProductController::class, 'storeCategory']);

        // Packs de Catalogues Prédéfinis (Templates)
        Route::get('/catalog-templates',              [\App\Http\Controllers\API\V1\CatalogTemplateController::class, 'index']);
        Route::get('/catalog-templates/{id}',         [\App\Http\Controllers\API\V1\CatalogTemplateController::class, 'show']);
        Route::post('/catalog-templates/{id}/install', [\App\Http\Controllers\API\V1\CatalogTemplateController::class, 'install']);

        // -----------------------------------------------------------------------
        // Rôles Personnalisés, Permissions & Zones d'Accès
        // -----------------------------------------------------------------------
        Route::get('/permissions', [\App\Http\Controllers\API\V1\RoleController::class, 'getAvailablePermissions']);
        Route::get('/custom-roles', [\App\Http\Controllers\API\V1\RoleController::class, 'index']);
        Route::post('/custom-roles', [\App\Http\Controllers\API\V1\RoleController::class, 'store']);
        Route::put('/custom-roles/{id}', [\App\Http\Controllers\API\V1\RoleController::class, 'update']);
        Route::delete('/custom-roles/{id}', [\App\Http\Controllers\API\V1\RoleController::class, 'destroy']);

        Route::apiResource('access-zones', \App\Http\Controllers\API\V1\AccessZoneController::class);

        // -----------------------------------------------------------------------
        // Règles de Gestion Configurables (Business Rules)
        // -----------------------------------------------------------------------
        Route::get('/business-rules',  [\App\Http\Controllers\API\V1\BusinessRuleController::class, 'index']);
        Route::post('/business-rules', [\App\Http\Controllers\API\V1\BusinessRuleController::class, 'updateRules']);

        // -----------------------------------------------------------------------
        // Référentiel Fournisseurs & Clients
        // -----------------------------------------------------------------------
        Route::apiResource('suppliers', \App\Http\Controllers\API\V1\SupplierController::class);
        Route::apiResource('customers', \App\Http\Controllers\API\V1\CustomerController::class);

        // -----------------------------------------------------------------------
        // Approvisionnements (Achats)
        // -----------------------------------------------------------------------
        Route::get('/purchases',                [\App\Http\Controllers\API\V1\PurchaseController::class, 'index']);
        Route::post('/purchases',               [\App\Http\Controllers\API\V1\PurchaseController::class, 'store']);
        Route::get('/purchases/{id}',           [\App\Http\Controllers\API\V1\PurchaseController::class, 'show']);
        Route::put('/purchases/{id}',           [\App\Http\Controllers\API\V1\PurchaseController::class, 'update']);
        Route::post('/purchases/{id}/receive',  [\App\Http\Controllers\API\V1\PurchaseController::class, 'receive']);

        // -----------------------------------------------------------------------
        // Mouvements & Outil d'Inventaire
        // -----------------------------------------------------------------------
        Route::get('/stock/movements', [\App\Http\Controllers\API\V1\StockController::class, 'movements']);
        Route::get('/stock/current',   [\App\Http\Controllers\API\V1\StockController::class, 'currentStock']);
        Route::post('/stock/adjust',   [\App\Http\Controllers\API\V1\StockController::class, 'adjust']);

        // -----------------------------------------------------------------------
        // Transferts de Stocks
        // -----------------------------------------------------------------------
        Route::get('/transfers',               [\App\Http\Controllers\API\V1\TransferController::class, 'index']);
        Route::post('/transfers',              [\App\Http\Controllers\API\V1\TransferController::class, 'store']);
        Route::get('/transfers/{id}',          [\App\Http\Controllers\API\V1\TransferController::class, 'show']);
        Route::post('/transfers/{id}/approve', [\App\Http\Controllers\API\V1\TransferController::class, 'approve']);
        Route::post('/transfers/{id}/ship',    [\App\Http\Controllers\API\V1\TransferController::class, 'ship']);
        Route::post('/transfers/{id}/receive', [\App\Http\Controllers\API\V1\TransferController::class, 'receive']);
        Route::post('/transfers/{id}/reject',  [\App\Http\Controllers\API\V1\TransferController::class, 'reject']);
        Route::post('/transfers/{id}/cancel',  [\App\Http\Controllers\API\V1\TransferController::class, 'cancel']);

        // -----------------------------------------------------------------------
        // Sessions de Caisse
        // -----------------------------------------------------------------------
        Route::get('/cash-sessions',                     [\App\Http\Controllers\API\V1\CashSessionController::class, 'index']);
        Route::get('/cash-sessions/current',             [\App\Http\Controllers\API\V1\CashSessionController::class, 'current']);
        Route::post('/cash-sessions/open',               [\App\Http\Controllers\API\V1\CashSessionController::class, 'open']);
        Route::post('/cash-sessions/{id}/transaction',   [\App\Http\Controllers\API\V1\CashSessionController::class, 'transaction']);
        Route::post('/cash-sessions/{id}/close',         [\App\Http\Controllers\API\V1\CashSessionController::class, 'close']);
        Route::post('/cash-sessions/{id}/validate',      [\App\Http\Controllers\API\V1\CashSessionController::class, 'validateSession']);

        // -----------------------------------------------------------------------
        // Ventes (POS)
        // -----------------------------------------------------------------------
        Route::get('/sales',        [\App\Http\Controllers\API\V1\SaleController::class, 'index']);
        Route::post('/sales',       [\App\Http\Controllers\API\V1\SaleController::class, 'store']);
        Route::get('/sales/{id}',   [\App\Http\Controllers\API\V1\SaleController::class, 'show']);

        // -----------------------------------------------------------------------
        // Journal d'Audit
        // -----------------------------------------------------------------------
        Route::get('/audit-logs', [\App\Http\Controllers\API\V1\AuditLogController::class, 'index']);

        // -----------------------------------------------------------------------
        // Rapports
        // -----------------------------------------------------------------------
        Route::get('/reports/summary', [\App\Http\Controllers\API\V1\ReportController::class, 'summary']);

        // -----------------------------------------------------------------------
        // Back-office Super Admin (Administration Globale)
        // Accès exclusif : super-admin
        // -----------------------------------------------------------------------
        Route::middleware('role:super-admin')->group(function () {
            Route::get('/admin/dashboard',                    [\App\Http\Controllers\API\V1\SuperAdminController::class, 'dashboard']);
            Route::get('/admin/companies',                    [\App\Http\Controllers\API\V1\SuperAdminController::class, 'companies']);
            Route::post('/admin/companies',                   [\App\Http\Controllers\API\V1\SuperAdminController::class, 'createCompany']);
            Route::match(['post', 'put'], '/admin/companies/{id}', [\App\Http\Controllers\API\V1\SuperAdminController::class, 'updateCompany']);

            // Gestion des Formules & Offres d'Abonnement
            Route::get('/admin/plans',                         [\App\Http\Controllers\API\V1\SuperAdminController::class, 'plans']);
            Route::post('/admin/plans',                        [\App\Http\Controllers\API\V1\SuperAdminController::class, 'storePlan']);
            Route::put('/admin/plans/{id}',                    [\App\Http\Controllers\API\V1\SuperAdminController::class, 'updatePlan']);
            Route::delete('/admin/plans/{id}',                 [\App\Http\Controllers\API\V1\SuperAdminController::class, 'deletePlan']);

            Route::get('/admin/users',                        [\App\Http\Controllers\API\V1\SuperAdminController::class, 'users']);
            Route::post('/admin/users/{id}/reset-password',   [\App\Http\Controllers\API\V1\SuperAdminController::class, 'resetUserPassword']);
            Route::post('/admin/users/{id}/toggle-status',    [\App\Http\Controllers\API\V1\SuperAdminController::class, 'toggleUserStatus']);
            Route::get('/admin/system/status',                [\App\Http\Controllers\API\V1\SuperAdminController::class, 'systemStatus']);

            // Gestion des erreurs techniques
            Route::get('/admin/error-logs',                   [\App\Http\Controllers\API\V1\SuperAdminController::class, 'errorLogs']);
            Route::delete('/admin/error-logs/clear',          [\App\Http\Controllers\API\V1\SuperAdminController::class, 'clearErrorLogs']);
            Route::delete('/admin/error-logs/{id}',           [\App\Http\Controllers\API\V1\SuperAdminController::class, 'deleteErrorLog']);

            // Gestion des sauvegardes et restaurations SQL
            Route::get('/admin/backups',                      [\App\Http\Controllers\API\V1\SuperAdminController::class, 'listBackups']);
            Route::post('/admin/backups/generate',            [\App\Http\Controllers\API\V1\SuperAdminController::class, 'backup']);
            Route::get('/admin/backups/{filename}/download',   [\App\Http\Controllers\API\V1\SuperAdminController::class, 'downloadBackup']);
            Route::post('/admin/backups/{filename}/restore',  [\App\Http\Controllers\API\V1\SuperAdminController::class, 'restoreBackup']);
            Route::delete('/admin/backups/{filename}',        [\App\Http\Controllers\API\V1\SuperAdminController::class, 'deleteBackup']);
            // -----------------------------------------------------------------------
            // Module Documentaire & System Central d'Exportations
            // -----------------------------------------------------------------------
            Route::get('/documents',               [\App\Http\Controllers\API\V1\DocumentController::class, 'index']);
            Route::post('/documents/export',       [\App\Http\Controllers\API\V1\DocumentController::class, 'export']);
            Route::get('/documents/{id}/download', [\App\Http\Controllers\API\V1\DocumentController::class, 'download']);
            Route::delete('/documents/{id}',      [\App\Http\Controllers\API\V1\DocumentController::class, 'destroy']);

            // -----------------------------------------------------------------------
            // Centre de Communication SuperAdmin
            // -----------------------------------------------------------------------
            Route::get('/communications',      [\App\Http\Controllers\API\V1\CommunicationController::class, 'index']);
            Route::post('/communications/send', [\App\Http\Controllers\API\V1\CommunicationController::class, 'send']);

            // -----------------------------------------------------------------------
            // Mode Maintenance Applicatif Global / Ciblé
            // -----------------------------------------------------------------------
            Route::get('/maintenance/status', [\App\Http\Controllers\API\V1\MaintenanceController::class, 'status']);
            Route::get('/maintenance',        [\App\Http\Controllers\API\V1\MaintenanceController::class, 'index']);
            Route::post('/maintenance/toggle', [\App\Http\Controllers\API\V1\MaintenanceController::class, 'toggle']);
        });

        // Lister les rôles disponibles (pour les formulaires de création d'utilisateurs)
        Route::get('/roles', function (Request $request) {
            $user = $request->user();
            // Exclure le rôle super-admin de la liste proposée aux admins
            $roles = \App\Models\Role::where('slug', '!=', 'super-admin')
                ->select('id', 'name', 'slug')
                ->get();
            return response()->json($roles);
        });
    });
});
