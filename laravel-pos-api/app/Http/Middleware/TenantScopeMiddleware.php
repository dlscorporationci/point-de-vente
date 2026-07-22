<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Company;
use App\Models\Branch;

class TenantScopeMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    protected \App\Services\TenantManager $tenantManager;

    public function __construct(\App\Services\TenantManager $tenantManager)
    {
        $this->tenantManager = $tenantManager;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user('sanctum') ?: auth('sanctum')->user();
        if ($user && $user->role && $user->role->slug === 'super-admin') {
            // Le super-admin n'est pas bloqué par le tenant, mais on initialise
            // quand même le TenantManager pour les opérations CRUD qui ont besoin du company_id.
            $saCompanyId = $user->company_id ?: $request->header('X-Company-ID');
            if ($saCompanyId) {
                $saCompany = Company::find($saCompanyId);
                if ($saCompany) {
                    $this->tenantManager->setCompany($saCompany);
                }
            }
            return $next($request);
        }

        $companyId = null;
        if ($user) {
            $companyId = $user->company_id;
        } else {
            $companyId = $request->header('X-Company-ID');
        }

        // 2. Traitement des routes d'authentification publiques (non bloquantes sur le Tenant)
        $isPublicAuth = $request->is('*/auth/login') || $request->is('*/auth/login-pin') || $request->is('*/auth/register') || $request->is('*/tenant-test');

        if ($isPublicAuth) {
            if ($companyId) {
                $company = Company::find($companyId);
                if ($company && $company->status === 'active') {
                    $this->tenantManager->setCompany($company);
                }
            }
            return $next($request);
        }

        if (!$companyId) {
            return response()->json([
                'error' => 'Tenant specification missing. Please provide X-Company-ID header.'
            ], 400);
        }

        // 3. Recherche et vérification de la Company
        $company = Company::find($companyId);

        if (!$company) {
            return response()->json([
                'error' => 'Company not found.'
            ], 404);
        }

        // 3. Vérification du statut de l'entreprise
        if ($company->status !== 'active') {
            return response()->json([
                'error' => 'This account has been suspended or archived. Please contact support.'
            ], 403);
        }

        // 4. Enregistrement dans le TenantManager
        $this->tenantManager->setCompany($company);

        // 5. Résolution & Vérification Sécurisée de la Branch (Point de Vente Active)
        $branchId = $request->header('X-Branch-ID');
        $branch = null;

        $authUser = $request->user('sanctum') ?: auth('sanctum')->user();

        if ($branchId) {
            $branch = Branch::where('id', $branchId)
                ->where('company_id', $company->id)
                ->first();

            // 1. Vérification que la boutique existe et appartient à l'entreprise
            if (!$branch) {
                return response()->json([
                    'error' => 'Boutique introuvable ou n\'appartenant pas à votre entreprise.'
                ], 403);
            }

            // 2. Vérification que l'utilisateur est autorisé sur cette boutique
            if ($authUser && !$authUser->hasAccessToBranch($branch->id)) {
                return response()->json([
                    'error' => 'Accès refusé : Vous n\'êtes pas autorisé à opérer sur cette boutique.'
                ], 403);
            }
        }

        // Fallback résilient si aucun header n'est spécifié
        if (!$branch) {
            if ($authUser && $authUser->branch_id) {
                $branch = Branch::where('id', $authUser->branch_id)
                    ->where('company_id', $company->id)
                    ->first();
            }
            if (!$branch && $authUser) {
                $assigned = $authUser->assignedBranches();
                $branch = $assigned->first();
            }
            if (!$branch) {
                $branch = Branch::where('company_id', $company->id)->first();
            }
        }

        if ($branch) {
            // 3. Vérification du statut opérationnel de la boutique pour les requêtes de modification (écriture)
            $isWriteOperation = in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE']);
            $isAdminOrSuper = $authUser && $authUser->role && in_array($authUser->role->slug, ['super-admin', 'admin']);

            if ($isWriteOperation && !$isAdminOrSuper) {
                if ($branch->status && $branch->status !== 'open') {
                    $statusLabels = [
                        'closed' => 'Fermée',
                        'maintenance' => 'En maintenance',
                        'suspended' => 'Suspendue',
                        'archived' => 'Archivée',
                    ];
                    $label = $statusLabels[$branch->status] ?? $branch->status;
                    return response()->json([
                        'error' => "Opération impossible : La boutique \"{$branch->name}\" est actuellement {$label}."
                    ], 403);
                }
            }

            $this->tenantManager->setBranch($branch);
        }

        return $next($request);
    }
}
