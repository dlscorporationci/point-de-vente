<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name'          => '🚀 Starter / TPE',
                'slug'          => 'starter',
                'description'   => 'Parfait pour les petits commerces, boutiques uniques et vendeurs indépendants.',
                'price_monthly' => 15000,
                'price_yearly'  => 150000,
                'max_branches'  => 1,
                'max_users'     => 3,
                'max_products'  => 1000,
                'is_active'     => true,
                'is_popular'    => false,
                'features'      => json_encode([
                    '1 Boutique active',
                    '3 Comptes utilisateurs / caissiers',
                    'Jusqu\'à 1 000 références produits',
                    'Gestion de caisse tactile & tickets',
                    'Historique des ventes & rapports de base',
                    'Support par email'
                ])
            ],
            [
                'name'          => '⭐ Business Pro',
                'slug'          => 'pro',
                'description'   => 'Idéal pour les PME en croissance avec plusieurs points de vente et gestion de stock avancée.',
                'price_monthly' => 35000,
                'price_yearly'  => 350000,
                'max_branches'  => 5,
                'max_users'     => 15,
                'max_products'  => 10000,
                'is_active'     => true,
                'is_popular'    => true,
                'features'      => json_encode([
                    'Jusqu\'à 5 Boutiques / Succursales',
                    '15 Utilisateurs avec rôles personnalisés (RBAC/ABAC)',
                    '10 000 Produits & catégories',
                    'Transferts de stock inter-boutiques',
                    'Module d\'approvisionnement & fournisseurs',
                    'Plages horaires d\'accès & Audit de sécurité',
                    'Support prioritaire 7j/7'
                ])
            ],
            [
                'name'          => '🏢 Enterprise Multi-Boutiques',
                'slug'          => 'enterprise',
                'description'   => 'Solution sur-mesure illimitée pour grands réseaux de distribution, franchises et grossistes.',
                'price_monthly' => 75000,
                'price_yearly'  => 750000,
                'max_branches'  => 99,
                'max_users'     => 999,
                'max_products'  => 999999,
                'is_active'     => true,
                'is_popular'    => false,
                'features'      => json_encode([
                    'Nombre de boutiques illimité',
                    'Utilisateurs illimités',
                    'Base produits & inventaire illimités',
                    'Synchronisation Offline-First avancée',
                    'API dédiée & intégrations Webhooks',
                    'Gestionnaire de compte dédié & SLA 99.9%'
                ])
            ]
        ];

        foreach ($plans as $p) {
            SubscriptionPlan::updateOrCreate(['slug' => $p['slug']], $p);
        }
    }
}
