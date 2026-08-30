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

    Route::get('/test-error-500-trigger', function () {
        throw new \Exception('Simulated Server 500 Failure for Phase 3.2 Error Handling Qualification');
    });

    // Routes publiques d'authentification
    // Phase 1 : throttle adapté sur login/pin/reset (20 req/min — protection POS & anti brute-force)
    Route::middleware('throttle:20,1')->group(function () {
        Route::post('/auth/login',           [AuthController::class, 'login']);
        Route::post('/auth/login-pin',       [AuthController::class, 'loginPin']);
        Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/auth/reset-password',  [AuthController::class, 'resetPassword']);
        
        // Routes d'authentification Google OAuth 2.0 / OpenID Connect
        Route::get('/auth/google/redirect',  [\App\Http\Controllers\API\V1\GoogleAuthController::class, 'redirect']);
        Route::get('/auth/google/callback',  [\App\Http\Controllers\API\V1\GoogleAuthController::class, 'callback']);
        Route::post('/auth/google/callback', [\App\Http\Controllers\API\V1\GoogleAuthController::class, 'callback']);

        // Routes d'authentification GitHub OAuth 2.0
        Route::get('/auth/github/redirect',  [\App\Http\Controllers\API\V1\GitHubAuthController::class, 'redirect']);
        Route::get('/auth/github/callback',  [\App\Http\Controllers\API\V1\GitHubAuthController::class, 'callback']);
        Route::post('/auth/github/callback', [\App\Http\Controllers\API\V1\GitHubAuthController::class, 'callback']);
    });

    // Phase 1.5 — Verification Email (public token verification, throttle 10/min)
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('/auth/verify-email',    [AuthController::class, 'verifyEmail']);
    });

    // Endpoints publics d'observabilité et disponibilité (Liveness & Readiness)
    Route::get('/health', [\App\Http\Controllers\API\V1\HealthCheckController::class, 'liveness']);
    Route::get('/ready',  [\App\Http\Controllers\API\V1\HealthCheckController::class, 'readiness']);

    // Routes publiques — throttle modéré (20 req/min)
    Route::middleware('throttle:20,1')->group(function () {
        Route::post('/auth/register',        [AuthController::class, 'register']);
        Route::get('/auth/companies',        [AuthController::class, 'getPublicCompanies']);
        Route::get('/auth/companies/{id}/users', [AuthController::class, 'getPublicUsers']);
        Route::get('/public/plans', function () {
            return response()->json(\App\Models\SubscriptionPlan::where('is_active', true)->orderBy('id', 'asc')->get());
        });
        Route::get('/maintenance/status', [\App\Http\Controllers\API\V1\MaintenanceController::class, 'status']);
        Route::get('/public/documents/{uuid}/download', [\App\Http\Controllers\API\V1\DocumentController::class, 'publicDownload']);
    });

    // Routes d'authentification protégées par Sanctum
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout',        [AuthController::class, 'logout']);
        Route::get('/auth/me',             [AuthController::class, 'me']);
        Route::post('/auth/profile',       [AuthController::class, 'updateProfile']);
        Route::post('/auth/update-pin',    [AuthController::class, 'updatePin']);
        Route::post('/auth/switch-branch', [AuthController::class, 'switchBranch']);

        // Phase 1.5 — Renvoi e-mail de vérification (throttle 5/min)
        Route::middleware('throttle:5,1')->group(function () {
            Route::post('/auth/resend-verification-email', [AuthController::class, 'resendVerificationEmail']);
        });

        // Phase 1.3 — Session Lock : vérification sécurisée du PIN (throttle 10/min par utilisateur)
        Route::middleware('throttle:10,1')->group(function () {
            Route::post('/auth/verify-pin',     [AuthController::class, 'verifyPin']);
            Route::post('/auth/unlock-session', [AuthController::class, 'verifyPin']);
        });

        // Phase 1.5 — Restriction Backend : Seuls les utilisateurs avec e-mail vérifié ont accès aux routes métiers
        Route::middleware(\App\Http\Middleware\EnsureEmailVerified::class)->group(function () {

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
        // Realtime — Server-Sent Events (SSE) — Temps Réel Multi-Utilisateurs
        // Middleware : auth:sanctum (déjà appliqué au groupe parent)
        // SÉCURITÉ : company_id déterminé depuis auth()->user(), jamais depuis le client
        // -----------------------------------------------------------------------
        Route::get('/sse/stream', [\App\Http\Controllers\API\V1\SseController::class, 'stream']);

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
        // Abonnement & Factures de l'entreprise
        // -----------------------------------------------------------------------
        Route::get('/my-subscription', function (Request $request) {
            $user = $request->user();
            $companyId = $user ? $user->company_id : null;
            $company = $companyId ? \App\Models\Company::find($companyId) : null;
            $subscription = $companyId ? \App\Models\CompanySubscription::with('plan')->where('company_id', $companyId)->latest()->first() : null;
            $invoices = $companyId ? \App\Models\SubscriptionInvoice::where('company_id', $companyId)->orderByDesc('issue_date')->get() : [];
            $payments = $companyId ? \App\Models\SubscriptionPayment::where('company_id', $companyId)->orderByDesc('payment_date')->get() : [];

            return response()->json([
                'company' => $company,
                'subscription' => $subscription,
                'invoices' => $invoices,
                'payments' => $payments,
            ]);
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
        Route::get('/access-control-logs', [\App\Http\Controllers\API\V1\AccessControlLogController::class, 'index']);

        // -----------------------------------------------------------------------
        // Règles de Gestion Configurables (Business Rules)
        // -----------------------------------------------------------------------
        Route::get('/business-rules',  [\App\Http\Controllers\API\V1\BusinessRuleController::class, 'index']);
        Route::post('/business-rules', [\App\Http\Controllers\API\V1\BusinessRuleController::class, 'updateRules']);

        // -----------------------------------------------------------------------
        // Référentiel Fournisseurs & Clients
        // -----------------------------------------------------------------------
        Route::get('/supplier-packs', [\App\Http\Controllers\API\V1\SupplierController::class, 'getPacks']);
        Route::post('/supplier-packs', [\App\Http\Controllers\API\V1\SupplierController::class, 'storePack']);
        Route::get('/supplier-types', [\App\Http\Controllers\API\V1\SupplierController::class, 'getTypes']);
        Route::post('/supplier-types', [\App\Http\Controllers\API\V1\SupplierController::class, 'storeType']);
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
        Route::post('/sales/{id}/cancel', [\App\Http\Controllers\API\V1\SaleController::class, 'cancel']);
        Route::post('/sales/{id}/refund', [\App\Http\Controllers\API\V1\SaleController::class, 'refund']);

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
            Route::delete('/admin/companies/{id}',            [\App\Http\Controllers\API\V1\SuperAdminController::class, 'deleteCompany']);

            // Suppressions SuperAdmin d'entités spécifiques (Boutiques, Clients, Produits)
            Route::delete('/admin/branches/{id}',             [\App\Http\Controllers\API\V1\SuperAdminController::class, 'deleteBranch']);
            Route::delete('/admin/customers/{id}',            [\App\Http\Controllers\API\V1\SuperAdminController::class, 'deleteCustomer']);
            Route::delete('/admin/products/{id}',             [\App\Http\Controllers\API\V1\SuperAdminController::class, 'deleteProduct']);

            // Gestion des Formules & Offres d'Abonnement
            Route::get('/admin/plans',                         [\App\Http\Controllers\API\V1\SuperAdminController::class, 'plans']);
            Route::post('/admin/plans',                        [\App\Http\Controllers\API\V1\SuperAdminController::class, 'storePlan']);
            Route::put('/admin/plans/{id}',                    [\App\Http\Controllers\API\V1\SuperAdminController::class, 'updatePlan']);
            Route::delete('/admin/plans/{id}',                 [\App\Http\Controllers\API\V1\SuperAdminController::class, 'deletePlan']);

            Route::get('/admin/users',                        [\App\Http\Controllers\API\V1\SuperAdminController::class, 'users']);
            Route::delete('/admin/users/{id}',                [\App\Http\Controllers\API\V1\SuperAdminController::class, 'deleteUser']);
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
            // Centre de Communication SuperAdmin
            // -----------------------------------------------------------------------
            Route::get('/communications',      [\App\Http\Controllers\API\V1\CommunicationController::class, 'index']);
            Route::post('/communications/send', [\App\Http\Controllers\API\V1\CommunicationController::class, 'send']);

            // -----------------------------------------------------------------------
            // Mode Maintenance Applicatif (Console SuperAdmin)
            // -----------------------------------------------------------------------            // Statistiques Globale Plateau SaaS & Abonnements/Paiements/Factures
            Route::get('/admin/global-stats',                 [\App\Http\Controllers\API\V1\SuperAdminController::class, 'globalStats']);
            Route::get('/admin/subscriptions',                [\App\Http\Controllers\API\V1\SuperAdminController::class, 'subscriptionsList']);
            Route::post('/admin/subscriptions',               [\App\Http\Controllers\API\V1\SuperAdminController::class, 'createSubscription']);
            Route::get('/admin/payments',                     [\App\Http\Controllers\API\V1\SuperAdminController::class, 'paymentsList']);
            Route::post('/admin/payments',                    [\App\Http\Controllers\API\V1\SuperAdminController::class, 'storePayment']);
            Route::get('/admin/invoices',                     [\App\Http\Controllers\API\V1\SuperAdminController::class, 'invoicesList']);
            Route::post('/admin/invoices/generate',           [\App\Http\Controllers\API\V1\SuperAdminController::class, 'generateInvoice']);
            Route::post('/admin/notifications/send',           [\App\Http\Controllers\API\V1\SuperAdminController::class, 'sendNotification']);
            // -----------------------------------------------------------------------
            // Centre de Gestion des E-mails Transactionnels SMTP & Logs
            // -----------------------------------------------------------------------
            Route::get('/admin/email-settings',                 [\App\Http\Controllers\API\V1\SuperAdminController::class, 'emailSettings']);
            Route::post('/admin/email-settings/test-connection', [\App\Http\Controllers\API\V1\SuperAdminController::class, 'testEmailConnection']);
            Route::post('/admin/email-settings/test-email',      [\App\Http\Controllers\API\V1\SuperAdminController::class, 'testEmailSend']);
            Route::get('/admin/email-logs',                     [\App\Http\Controllers\API\V1\SuperAdminController::class, 'emailLogs']);
            Route::post('/admin/email-logs/{id}/retry',          [\App\Http\Controllers\API\V1\SuperAdminController::class, 'retryEmail']);
            // -----------------------------------------------------------------------
            // Performance SaaS & Surveillance des Entreprises à Risque
            // -----------------------------------------------------------------------
            Route::get('/admin/performance-ranking',          [\App\Http\Controllers\API\V1\SuperAdminController::class, 'performanceRanking']);
            Route::get('/admin/companies-at-risk',            [\App\Http\Controllers\API\V1\SuperAdminController::class, 'companiesAtRisk']);

            // -----------------------------------------------------------------------
            // Espace de Supervision & Drill-Down d'une Entreprise (Lecture Seule)
            // -----------------------------------------------------------------------
            Route::get('/admin/companies/{company}/overview',      [\App\Http\Controllers\API\V1\SuperAdminController::class, 'companyOverview']);
            Route::get('/admin/companies/{company}/sales',         [\App\Http\Controllers\API\V1\SuperAdminController::class, 'companySales']);
            Route::get('/admin/companies/{company}/customers',     [\App\Http\Controllers\API\V1\SuperAdminController::class, 'companyCustomers']);
            Route::get('/admin/companies/{company}/suppliers',     [\App\Http\Controllers\API\V1\SuperAdminController::class, 'companySuppliers']);
            Route::get('/admin/companies/{company}/products',      [\App\Http\Controllers\API\V1\SuperAdminController::class, 'companyProducts']);
            Route::get('/admin/companies/{company}/purchases',     [\App\Http\Controllers\API\V1\SuperAdminController::class, 'companyPurchases']);
            Route::get('/admin/companies/{company}/cash-sessions',[\App\Http\Controllers\API\V1\SuperAdminController::class, 'companyCashSessions']);
            Route::get('/admin/companies/{company}/transfers',    [\App\Http\Controllers\API\V1\SuperAdminController::class, 'companyTransfers']);
            Route::get('/admin/companies/{company}/users',        [\App\Http\Controllers\API\V1\SuperAdminController::class, 'companyUsers']);

            // Mode Maintenance Applicatif (Console SuperAdmin)
            Route::get('/maintenance',        [\App\Http\Controllers\API\V1\MaintenanceController::class, 'index']);
            Route::post('/maintenance/toggle', [\App\Http\Controllers\API\V1\MaintenanceController::class, 'toggle']);
        });

        // Statut public de maintenance applicative (déplacé dans le groupe public ci-dessus)

        // -----------------------------------------------------------------------
        // Module Documentaire & Système Central d'Exportations (Tous Utilisateurs Authentifiés)
        // -----------------------------------------------------------------------
        Route::get('/documents',               [\App\Http\Controllers\API\V1\DocumentController::class, 'index']);
        Route::post('/documents/export',       [\App\Http\Controllers\API\V1\DocumentController::class, 'export']);
        Route::get('/documents/{id}/download', [\App\Http\Controllers\API\V1\DocumentController::class, 'download']);
        Route::delete('/documents/{id}',      [\App\Http\Controllers\API\V1\DocumentController::class, 'destroy']);

        // Lister les rôles disponibles (pour les formulaires de création d'utilisateurs)
        Route::get('/roles', function (Request $request) {
            $user = $request->user();
            // Exclure le rôle super-admin de la liste proposée aux admins
            $roles = \App\Models\Role::where('slug', '!=', 'super-admin')
                ->select('id', 'name', 'slug')
                ->get();
            return response()->json($roles);
        });
        }); // Fin du groupe EnsureEmailVerified
    });
});

// ---------------------------------------------------------------------------
// Routes publiques globales (aucun middleware tenant requis)
// Accessibles depuis la landing page sans X-Company-ID
// ---------------------------------------------------------------------------
Route::prefix('v1')->middleware('throttle:60,1')->group(function () {
    Route::get('/public/plans', [\App\Http\Controllers\API\V1\SuperAdminController::class, 'publicPlans']);
});
