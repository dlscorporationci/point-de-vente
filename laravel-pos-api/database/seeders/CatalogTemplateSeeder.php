<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CatalogTemplate;
use App\Models\CatalogTemplateCategory;
use App\Models\CatalogTemplateProduct;

class CatalogTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => '🧱 Quincaillerie & Matériaux',
                'slug' => 'quincaillerie',
                'domain' => 'BTP & Construction',
                'description' => 'Catalogue clé en main pour quincailleries, revendeurs de matériaux BTP, outillage et plomberie.',
                'icon' => 'fa-trowel-bricks',
                'categories' => [
                    'Matériaux de construction' => [
                        ['name' => 'Ciment CPJ 42.5 (Sac 50kg)', 'unit' => 'sac', 'selling_price' => 4800, 'cost_price' => 4300, 'alert_quantity' => 20],
                        ['name' => 'Fer à béton Ø10 (Barre 12m)', 'unit' => 'barre', 'selling_price' => 3800, 'cost_price' => 3400, 'alert_quantity' => 50],
                        ['name' => 'Fer à béton Ø12 (Barre 12m)', 'unit' => 'barre', 'selling_price' => 5400, 'cost_price' => 4900, 'alert_quantity' => 40],
                        ['name' => 'Clous à charpente 100mm (Carton 25kg)', 'unit' => 'carton', 'selling_price' => 22000, 'cost_price' => 18500, 'alert_quantity' => 5],
                    ],
                    'Peinture & Solvants' => [
                        ['name' => 'Peinture Latex Blanc 20L', 'unit' => 'seau', 'selling_price' => 18500, 'cost_price' => 14000, 'alert_quantity' => 10],
                        ['name' => 'Peinture Huile Glycéro 5L Blanc', 'unit' => 'pot', 'selling_price' => 12000, 'cost_price' => 9500, 'alert_quantity' => 8],
                        ['name' => 'Diluant Cellulosique 5L', 'unit' => 'bidon', 'selling_price' => 6500, 'cost_price' => 4800, 'alert_quantity' => 12],
                        ['name' => 'Rouleau de peinture 220mm complet', 'unit' => 'unité', 'selling_price' => 2500, 'cost_price' => 1600, 'alert_quantity' => 15],
                    ],
                    'Plomberie & Sanitaires' => [
                        ['name' => 'Tuyau PVC Ø110 4m', 'unit' => 'barre', 'selling_price' => 4500, 'cost_price' => 3200, 'alert_quantity' => 25],
                        ['name' => 'Tuyau PVC Ø40 4m', 'unit' => 'barre', 'selling_price' => 1800, 'cost_price' => 1200, 'alert_quantity' => 30],
                        ['name' => 'Robinet Mélangeur Inox Lavabo', 'unit' => 'unité', 'selling_price' => 14500, 'cost_price' => 9800, 'alert_quantity' => 6],
                        ['name' => 'Colle PVC Pinceau 500g', 'unit' => 'pot', 'selling_price' => 3200, 'cost_price' => 2100, 'alert_quantity' => 15],
                    ],
                    'Électricité & Éclairage' => [
                        ['name' => 'Câble TH 1.5mm² (Rouleau 100m)', 'unit' => 'rouleau', 'selling_price' => 16500, 'cost_price' => 12800, 'alert_quantity' => 5],
                        ['name' => 'Câble TH 2.5mm² (Rouleau 100m)', 'unit' => 'rouleau', 'selling_price' => 24500, 'cost_price' => 19500, 'alert_quantity' => 5],
                        ['name' => 'Disjoncteur Différentiel 16A Mono', 'unit' => 'unité', 'selling_price' => 4500, 'cost_price' => 2900, 'alert_quantity' => 10],
                        ['name' => 'Projecteur LED 50W Extérieur IP65', 'unit' => 'unité', 'selling_price' => 8500, 'cost_price' => 5600, 'alert_quantity' => 8],
                    ],
                    'Outillage & Équipement' => [
                        ['name' => 'Marteau d\'arrache 500g Manche Fibre', 'unit' => 'unité', 'selling_price' => 4200, 'cost_price' => 2600, 'alert_quantity' => 10],
                        ['name' => 'Groupe Électrogène 5.5KVA Essence', 'unit' => 'unité', 'selling_price' => 285000, 'cost_price' => 230000, 'alert_quantity' => 2],
                        ['name' => 'Meuleuse d\'angle 115mm 850W', 'unit' => 'unité', 'selling_price' => 26500, 'cost_price' => 19000, 'alert_quantity' => 4],
                    ],
                ]
            ],
            [
                'name' => '🛒 Superette & Alimentation',
                'slug' => 'superette',
                'domain' => 'Alimentation & Grande Consommation',
                'description' => 'Catalogue pour supérettes, alimentations générales, épiceries et commerces de quartier.',
                'icon' => 'fa-cart-shopping',
                'categories' => [
                    'Riz & Céréales' => [
                        ['name' => 'Riz Parfumé Uncle Sam 25kg', 'unit' => 'sac', 'selling_price' => 18500, 'cost_price' => 16200, 'alert_quantity' => 10],
                        ['name' => 'Riz Oncle Sam 5kg', 'unit' => 'sac', 'selling_price' => 4200, 'cost_price' => 3650, 'alert_quantity' => 15],
                        ['name' => 'Spaghetti Panzani 500g', 'unit' => 'paquet', 'selling_price' => 600, 'cost_price' => 480, 'alert_quantity' => 50],
                    ],
                    'Huiles & Condiments' => [
                        ['name' => 'Huile de Palme Raffinée Dinor 5L', 'unit' => 'bidon', 'selling_price' => 6800, 'cost_price' => 5900, 'alert_quantity' => 12],
                        ['name' => 'Huile Tournesol 1L', 'unit' => 'bouteille', 'selling_price' => 1400, 'cost_price' => 1150, 'alert_quantity' => 24],
                        ['name' => 'Boîte de Tomate Concentrée 400g', 'unit' => 'boîte', 'selling_price' => 650, 'cost_price' => 510, 'alert_quantity' => 36],
                        ['name' => 'Cube Maggi Tablette (Carton 60)', 'unit' => 'boîte', 'selling_price' => 1600, 'cost_price' => 1350, 'alert_quantity' => 20],
                    ],
                    'Produits Laitiers & Petit Déjeuner' => [
                        ['name' => 'Lait Concentré Sucré Bonnet Rouge 1kg', 'unit' => 'boîte', 'selling_price' => 2100, 'cost_price' => 1750, 'alert_quantity' => 18],
                        ['name' => 'Lait en Poudre Nido 400g', 'unit' => 'boîte', 'selling_price' => 2900, 'cost_price' => 2450, 'alert_quantity' => 15],
                        ['name' => 'Sucre Granulé Blanc 1kg', 'unit' => 'paquet', 'selling_price' => 950, 'cost_price' => 820, 'alert_quantity' => 40],
                        ['name' => 'Nescafé Classic 200g', 'unit' => 'bocal', 'selling_price' => 3800, 'cost_price' => 3100, 'alert_quantity' => 10],
                    ],
                    'Boissons & Rafraîchissements' => [
                        ['name' => 'Eau Minérale Awa 1.5L (Pack de 6)', 'unit' => 'pack', 'selling_price' => 2200, 'cost_price' => 1750, 'alert_quantity' => 30],
                        ['name' => 'Coca-Cola Canette 33cl', 'unit' => 'canette', 'selling_price' => 500, 'cost_price' => 380, 'alert_quantity' => 48],
                        ['name' => 'Jus d\'Orange Ceres 1L', 'unit' => 'brique', 'selling_price' => 1350, 'cost_price' => 1050, 'alert_quantity' => 20],
                    ],
                ]
            ],
            [
                'name' => '📱 Téléphonie & Accessoires',
                'slug' => 'telephonie',
                'domain' => 'Électronique & High-Tech',
                'description' => 'Catalogue pour boutiques de vente de téléphones, chargeurs, écouteurs et accessoires multimédia.',
                'icon' => 'fa-mobile-screen-button',
                'categories' => [
                    'Smartphones & Feature Phones' => [
                        ['name' => 'Smartphone Android 6.5" 64GB', 'unit' => 'unité', 'selling_price' => 55000, 'cost_price' => 44000, 'alert_quantity' => 5],
                        ['name' => 'Téléphone Touches Double SIM', 'unit' => 'unité', 'selling_price' => 11500, 'cost_price' => 8900, 'alert_quantity' => 10],
                    ],
                    'Chargeurs & Câbles' => [
                        ['name' => 'Chargeur Rapide 20W Type-C', 'unit' => 'unité', 'selling_price' => 4500, 'cost_price' => 2200, 'alert_quantity' => 15],
                        ['name' => 'Câble USB vers Type-C Tressé 1m', 'unit' => 'unité', 'selling_price' => 2000, 'cost_price' => 850, 'alert_quantity' => 25],
                        ['name' => 'Chargeur Voiture Allume-Cygne 3.4A', 'unit' => 'unité', 'selling_price' => 3000, 'cost_price' => 1400, 'alert_quantity' => 10],
                    ],
                    'Audio & Écouteurs' => [
                        ['name' => 'Écouteurs Sans Fil TWS Bluetooth 5.3', 'unit' => 'unité', 'selling_price' => 9500, 'cost_price' => 5200, 'alert_quantity' => 12],
                        ['name' => 'Casque Bluetooth Pliable Bass', 'unit' => 'unité', 'selling_price' => 14500, 'cost_price' => 8800, 'alert_quantity' => 8],
                        ['name' => 'Écouteurs Filaire Jack 3.5mm', 'unit' => 'unité', 'selling_price' => 1500, 'cost_price' => 600, 'alert_quantity' => 30],
                    ],
                    'Protection & Gadgets' => [
                        ['name' => 'Verre Trempé Incassable Universel', 'unit' => 'unité', 'selling_price' => 1500, 'cost_price' => 400, 'alert_quantity' => 50],
                        ['name' => 'Powerbank 20000mAh Charge Rapide', 'unit' => 'unité', 'selling_price' => 16500, 'cost_price' => 11000, 'alert_quantity' => 6],
                    ]
                ]
            ],
            [
                'name' => '💄 Cosmétique & Beauté',
                'slug' => 'cosmetique',
                'domain' => 'Beauté & Soins',
                'description' => 'Catalogue pour salons de beauté, parumeries, boutiques de mèches et produits cosmétiques.',
                'icon' => 'fa-wand-magic-sparkles',
                'categories' => [
                    'Soins du Corps & Visage' => [
                        ['name' => 'Lait Hydratant Corporel Karité 500ml', 'unit' => 'flacon', 'selling_price' => 4500, 'cost_price' => 3100, 'alert_quantity' => 12],
                        ['name' => 'Sérum Éclat Visage Vitamine C 30ml', 'unit' => 'flacon', 'selling_price' => 8500, 'cost_price' => 5200, 'alert_quantity' => 8],
                        ['name' => 'Savon Noir Purifiant 250g', 'unit' => 'pot', 'selling_price' => 2000, 'cost_price' => 1100, 'alert_quantity' => 20],
                    ],
                    'Parfums & Déodorants' => [
                        ['name' => 'Eau de Parfum Homme 100ml', 'unit' => 'bouteille', 'selling_price' => 18500, 'cost_price' => 12000, 'alert_quantity' => 6],
                        ['name' => 'Spray Déodorant Anti-transpirant 150ml', 'unit' => 'spray', 'selling_price' => 2200, 'cost_price' => 1450, 'alert_quantity' => 15],
                    ],
                    'Coiffure & Mèches' => [
                        ['name' => 'Mèches Synthétiques Tressage (Paquet)', 'unit' => 'paquet', 'selling_price' => 1200, 'cost_price' => 750, 'alert_quantity' => 40],
                        ['name' => 'Shampoing Nourrissant Huile d\'Argan 750ml', 'unit' => 'flacon', 'selling_price' => 3800, 'cost_price' => 2400, 'alert_quantity' => 10],
                    ]
                ]
            ],
            [
                'name' => '👗 Mode & Habillement',
                'slug' => 'mode',
                'domain' => 'Textile & Confection',
                'description' => 'Catalogue adapté aux boutiques de vêtements, chaussures, pagnes et accessoires de mode.',
                'icon' => 'fa-shirt',
                'categories' => [
                    'Pagne & Tissus' => [
                        ['name' => 'Pagne Wax Véritable (Complet 6 Yards)', 'unit' => 'pièce', 'selling_price' => 14000, 'cost_price' => 10500, 'alert_quantity' => 10],
                        ['name' => 'Bazin Riche Supérieur (Complet 5m)', 'unit' => 'pièce', 'selling_price' => 35000, 'cost_price' => 27000, 'alert_quantity' => 5],
                    ],
                    'Vêtements Hommes & Femmes' => [
                        ['name' => 'Chemise Homme Coton Manches Longues', 'unit' => 'pièce', 'selling_price' => 12500, 'cost_price' => 8000, 'alert_quantity' => 12],
                        ['name' => 'Robe Droite Élégante Femme', 'unit' => 'pièce', 'selling_price' => 18000, 'cost_price' => 11500, 'alert_quantity' => 8],
                        ['name' => 'Pantalon Jean Homme Coupe Straight', 'unit' => 'pièce', 'selling_price' => 14500, 'cost_price' => 9200, 'alert_quantity' => 15],
                    ],
                    'Chaussures & Accessoires' => [
                        ['name' => 'Chaussures Cuir Homme Ville', 'unit' => 'paire', 'selling_price' => 28000, 'cost_price' => 19000, 'alert_quantity' => 6],
                        ['name' => 'Sac à Main Féminin Synthétique', 'unit' => 'pièce', 'selling_price' => 15000, 'cost_price' => 9500, 'alert_quantity' => 8],
                    ]
                ]
            ],
            [
                'name' => '🍽️ Restaurant & Maquis',
                'slug' => 'restaurant',
                'domain' => 'Restauration & Bar',
                'description' => 'Catalogue pour restaurants, maquis, bars et espaces événementiels.',
                'icon' => 'fa-utensils',
                'categories' => [
                    'Plats Principaux & Grillades' => [
                        ['name' => 'Poulet Braisé Entier', 'unit' => 'plat', 'selling_price' => 6500, 'cost_price' => 4200, 'alert_quantity' => 10],
                        ['name' => 'Poisson Carpe Grillée (Portion 800g)', 'unit' => 'plat', 'selling_price' => 7500, 'cost_price' => 4800, 'alert_quantity' => 10],
                        ['name' => 'Brochettes de Bœuf (Portion de 5)', 'unit' => 'portion', 'selling_price' => 3000, 'cost_price' => 1800, 'alert_quantity' => 20],
                    ],
                    'Accompagnements' => [
                        ['name' => 'Portion Attieké Garba', 'unit' => 'portion', 'selling_price' => 500, 'cost_price' => 250, 'alert_quantity' => 50],
                        ['name' => 'Portion Aloco (Banane Frite)', 'unit' => 'portion', 'selling_price' => 1000, 'cost_price' => 450, 'alert_quantity' => 30],
                        ['name' => 'Portion Frites de Pomme de Terre', 'unit' => 'portion', 'selling_price' => 1500, 'cost_price' => 700, 'alert_quantity' => 25],
                    ],
                    'Boissons & Bières' => [
                        ['name' => 'Bière Blonde Grand Format 65cl', 'unit' => 'bouteille', 'selling_price' => 1000, 'cost_price' => 750, 'alert_quantity' => 60],
                        ['name' => 'Jus de Bissap Maison 50cl', 'unit' => 'bouteille', 'selling_price' => 500, 'cost_price' => 200, 'alert_quantity' => 40],
                        ['name' => 'Eau Minérale 50cl', 'unit' => 'bouteille', 'selling_price' => 400, 'cost_price' => 200, 'alert_quantity' => 50],
                    ]
                ]
            ],
            [
                'name' => '📦 Catalogue Vierge',
                'slug' => 'vierge',
                'domain' => 'Personnalisé',
                'description' => 'Démarrer avec une base complètement vierge et créer vos propres catégories et produits manuellement.',
                'icon' => 'fa-folder-plus',
                'categories' => []
            ]
        ];

        foreach ($templates as $tData) {
            $categories = $tData['categories'] ?? [];
            unset($tData['categories']);

            $template = CatalogTemplate::updateOrCreate(
                ['slug' => $tData['slug']],
                $tData
            );

            foreach ($categories as $catName => $products) {
                $category = CatalogTemplateCategory::updateOrCreate([
                    'catalog_template_id' => $template->id,
                    'name'                => $catName
                ]);

                foreach ($products as $pData) {
                    CatalogTemplateProduct::updateOrCreate([
                        'catalog_template_id' => $template->id,
                        'name'                => $pData['name']
                    ], array_merge($pData, [
                        'category_name' => $catName
                    ]));
                }
            }
        }
    }
}
