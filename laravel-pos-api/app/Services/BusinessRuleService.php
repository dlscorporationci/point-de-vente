<?php

namespace App\Services;

use App\Models\BusinessRule;

class BusinessRuleService
{
    /**
     * Obtenir les définitions des règles métier système par défaut avec libellés lisibles.
     */
    public static function getDefaultRules(): array
    {
        return [
            // Ventes & Prix
            'allow_negative_stock' => [
                'name'        => 'Autoriser la vente en stock insuffisant / négatif',
                'category'    => '🛒 Ventes',
                'description' => 'Permet de valider une vente même si la quantité d\'articles en stock est à zéro ou insuffisante.',
                'value'       => false,
                'type'        => 'boolean',
            ],
            'allow_sales_discount' => [
                'name'        => 'Autoriser l\'application de remises sur le caisse POS',
                'category'    => '🛒 Ventes',
                'description' => 'Permet aux caissiers de réduire le montant d\'un panier via un pourcentage ou montant fixe.',
                'value'       => true,
                'type'        => 'boolean',
            ],
            'max_discount_percent' => [
                'name'        => 'Pourcentage maximal de remise autorisée (%)',
                'category'    => '🛒 Ventes',
                'description' => 'Limite maximale en pourcentage de remise que peut accorder un caissier sans autorisation.',
                'value'       => 10,
                'type'        => 'integer',
            ],
            'require_manager_for_discount' => [
                'name'        => 'Validation du gérant requise au-delà de la remise max',
                'category'    => '🛒 Ventes',
                'description' => 'Exige le code PIN d\'un responsable pour valider une remise supérieure au plafond.',
                'value'       => true,
                'type'        => 'boolean',
            ],

            // Crédit Client
            'allow_credit_sales' => [
                'name'        => 'Autoriser les ventes à crédit (Paiement différé)',
                'category'    => '💰 Crédit Client',
                'description' => 'Permet de conclure des ventes avec un solde impayé enregistré sur le compte client.',
                'value'       => true,
                'type'        => 'boolean',
            ],
            'default_credit_limit' => [
                'name'        => 'Plafond de crédit par défaut par client (XOF)',
                'category'    => '💰 Crédit Client',
                'description' => 'Montant maximal d\'encours toléré pour un client avant blocage des nouvelles ventes à crédit.',
                'value'       => 50000,
                'type'        => 'integer',
            ],

            // Sessions de Caisse
            'require_cash_session' => [
                'name'        => 'Ouverture de session de caisse obligatoire pour encaisser',
                'category'    => '💵 Caisse',
                'description' => 'Bloque l\'accès au terminal POS tant qu\'une session de caisse n\'a pas été ouverte avec fond de caisse initial.',
                'value'       => true,
                'type'        => 'boolean',
            ],
            'max_cash_discrepancy' => [
                'name'        => 'Écart de caisse toléré sans alerte à la fermeture (XOF)',
                'category'    => '💵 Caisse',
                'description' => 'Différence maximale acceptée entre le montant théorique et réel lors du comptage de fermeture.',
                'value'       => 5000,
                'type'        => 'integer',
            ],

            // Stock & Transferts
            'require_transfer_approval' => [
                'name'        => 'Validation obligatoire pour les transferts entre boutiques',
                'category'    => '📦 Stock & Transferts',
                'description' => 'Un transfert de marchandise expédié nécessite une confirmation de réception par la boutique destinataire.',
                'value'       => true,
                'type'        => 'boolean',
            ],
            'require_purchase_approval' => [
                'name'        => 'Validation obligatoire des bons de commande d\'achats',
                'category'    => '🛍️ Achats',
                'description' => 'Les commandes auprès des fournisseurs doivent être approuvées par un responsable avant entrée en stock.',
                'value'       => false,
                'type'        => 'boolean',
            ],
        ];
    }

    /**
     * Évaluer la valeur d'une règle selon la hiérarchie : Boutique -> Entreprise -> Système.
     */
    public function getRule(string $ruleKey, int $companyId, ?int $branchId = null)
    {
        $defaults = self::getDefaultRules();
        $defaultVal = $defaults[$ruleKey]['value'] ?? null;
        $valueType = $defaults[$ruleKey]['type'] ?? 'boolean';

        // 1. Chercher surcharge au niveau boutique
        if ($branchId) {
            $branchRule = BusinessRule::where('company_id', $companyId)
                ->where('branch_id', $branchId)
                ->where('rule_key', $ruleKey)
                ->where('is_active', true)
                ->first();

            if ($branchRule !== null) {
                return $this->castValue($branchRule->rule_value, $valueType);
            }
        }

        // 2. Chercher configuration au niveau entreprise
        $companyRule = BusinessRule::where('company_id', $companyId)
            ->whereNull('branch_id')
            ->where('rule_key', $ruleKey)
            ->where('is_active', true)
            ->first();

        if ($companyRule !== null) {
            return $this->castValue($companyRule->rule_value, $valueType);
        }

        // 3. Fallback sur la règle par défaut du système
        return $defaultVal;
    }

    private function castValue($value, string $type)
    {
        if ($type === 'boolean') {
            return filter_var($value, FILTER_VALIDATE_BOOLEAN);
        }
        if ($type === 'integer') {
            return (int) $value;
        }
        if ($type === 'float') {
            return (float) $value;
        }
        return (string) $value;
    }
}
