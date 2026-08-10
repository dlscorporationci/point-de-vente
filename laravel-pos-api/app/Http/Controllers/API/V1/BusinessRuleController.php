<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BusinessRule;
use App\Services\BusinessRuleService;
use App\Services\TenantManager;
use App\Traits\Auditable;

class BusinessRuleController extends Controller
{
    use Auditable;

    protected $ruleService;

    public function __construct(BusinessRuleService $ruleService)
    {
        $this->ruleService = $ruleService;
    }

    /**
     * Liste complète des règles de gestion configurables pour l'entreprise et la boutique spécifiée.
     */
    public function index(Request $request)
    {
        try {
            $currentUser = $request->user();
            $tenantManager = app(TenantManager::class);
            $companyId = $tenantManager->getCompanyId() ?: ($currentUser ? $currentUser->company_id : 1);
            $branchId = $request->query('branch_id');

            $defaultRules = BusinessRuleService::getDefaultRules();
            $hasTable = \Illuminate\Support\Facades\Schema::hasTable('business_rules');

            $rulesList = [];
            foreach ($defaultRules as $key => $meta) {
                $effectiveValue = $meta['value'];
                if ($hasTable) {
                    try {
                        $effectiveValue = $this->ruleService->getRule($key, $companyId, $branchId);
                    } catch (\Throwable $re) {
                        $effectiveValue = $meta['value'];
                    }
                }

                $rulesList[] = [
                    'rule_key'        => $key,
                    'name'            => $meta['name'],
                    'category'        => $meta['category'],
                    'description'     => $meta['description'],
                    'effective_value' => $effectiveValue,
                    'default_value'   => $meta['value'],
                    'value_type'      => $meta['type'],
                    'is_overridden'   => ($effectiveValue !== $meta['value']),
                ];
            }

            return response()->json([
                'rules'     => $rulesList,
                'branch_id' => $branchId ? (int) $branchId : null,
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Erreur BusinessRuleController@index : " . $e->getMessage());

            // Secours ultime : renvoyer toujours les définitions des règles système
            $defaultRules = BusinessRuleService::getDefaultRules();
            $rulesList = [];
            foreach ($defaultRules as $key => $meta) {
                $rulesList[] = [
                    'rule_key'        => $key,
                    'name'            => $meta['name'],
                    'category'        => $meta['category'],
                    'description'     => $meta['description'],
                    'effective_value' => $meta['value'],
                    'default_value'   => $meta['value'],
                    'value_type'      => $meta['type'],
                    'is_overridden'   => false,
                ];
            }

            return response()->json([
                'rules'     => $rulesList,
                'branch_id' => null,
            ]);
        }
    }

    /**
     * Enregistrer / Mettre à jour des règles de gestion pour l'entreprise ou une boutique spécifique.
     */
    public function updateRules(Request $request)
    {
        $currentUser = $request->user();
        $tenantManager = app(TenantManager::class);
        $companyId = $tenantManager->getCompanyId() ?: ($currentUser ? $currentUser->company_id : null);

        $request->validate([
            'rules'              => 'required|array',
            'rules.*.rule_key'   => 'required|string',
            'rules.*.rule_value' => 'nullable',
            'branch_id'          => 'nullable|integer|exists:branches,id',
        ]);

        $branchId = $request->branch_id ? (int) $request->branch_id : null;
        $defaultRules = BusinessRuleService::getDefaultRules();

        $updatedCount = 0;

        foreach ($request->rules as $item) {
            $key = $item['rule_key'];
            if (!isset($defaultRules[$key])) {
                continue;
            }

            $rawVal = $item['rule_value'];
            $valType = $defaultRules[$key]['type'] ?? 'boolean';

            if ($valType === 'boolean') {
                $valString = filter_var($rawVal, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
            } else {
                $valString = (string) $rawVal;
            }

            BusinessRule::updateOrCreate(
                [
                    'company_id' => $companyId,
                    'branch_id'  => $branchId,
                    'rule_key'   => $key,
                ],
                [
                    'rule_value' => $valString,
                    'value_type' => $valType,
                    'is_active'  => true,
                    'updated_by' => $currentUser->id,
                ]
            );

            $updatedCount++;
        }

        $this->logAuditEvent('BUSINESS_RULES_UPDATED', [
            'updated_count' => $updatedCount,
            'branch_id'     => $branchId,
        ], $currentUser);

        return response()->json([
            'message' => "{$updatedCount} règle(s) de gestion enregistrée(s) avec succès.",
        ]);
    }
}
