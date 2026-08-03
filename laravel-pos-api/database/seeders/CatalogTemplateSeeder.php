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
                'description' => 'Catalogue clé en main pour quincailleries, revendeurs de matériaux BTP, outillage, peinture et plomberie.',
                'icon' => 'fa-trowel-bricks',
                'categories' => [
                    [
                        'name' => 'Matériaux de construction',
                        'icon' => 'fa-cubes',
                        'image_url' => 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Ciment CPJ 42.5 (Sac 50kg)', 'unit' => 'sac', 'selling_price' => 4800, 'cost_price' => 4300, 'alert_quantity' => 20, 'image_url' => 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Fer à béton Ø10 (Barre 12m)', 'unit' => 'barre', 'selling_price' => 3800, 'cost_price' => 3400, 'alert_quantity' => 50, 'image_url' => 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Fer à béton Ø12 (Barre 12m)', 'unit' => 'barre', 'selling_price' => 5400, 'cost_price' => 4900, 'alert_quantity' => 40, 'image_url' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Clous à charpente 100mm (Carton 25kg)', 'unit' => 'carton', 'selling_price' => 22000, 'cost_price' => 18500, 'alert_quantity' => 5, 'image_url' => 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Gravier Concassé 15/25 (Tonne)', 'unit' => 'tonne', 'selling_price' => 14000, 'cost_price' => 11000, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Sable de Lagune Filtre (Camion 10m³)', 'unit' => 'camion', 'selling_price' => 85000, 'cost_price' => 65000, 'alert_quantity' => 2, 'image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Peinture & Solvants',
                        'icon' => 'fa-paint-roller',
                        'image_url' => 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Peinture Latex Blanc 20L', 'unit' => 'seau', 'selling_price' => 18500, 'cost_price' => 14000, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Peinture Huile Glycéro 5L Blanc', 'unit' => 'pot', 'selling_price' => 12000, 'cost_price' => 9500, 'alert_quantity' => 8, 'image_url' => 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Diluant Cellulosique 5L', 'unit' => 'bidon', 'selling_price' => 6500, 'cost_price' => 4800, 'alert_quantity' => 12, 'image_url' => 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Rouleau de peinture 220mm complet', 'unit' => 'unité', 'selling_price' => 2500, 'cost_price' => 1600, 'alert_quantity' => 15, 'image_url' => 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Pinceau Plat Professionnel 50mm', 'unit' => 'unité', 'selling_price' => 1200, 'cost_price' => 700, 'alert_quantity' => 20, 'image_url' => 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Plomberie & Sanitaires',
                        'icon' => 'fa-faucet',
                        'image_url' => 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Tuyau PVC Ø110 4m', 'unit' => 'barre', 'selling_price' => 4500, 'cost_price' => 3200, 'alert_quantity' => 25, 'image_url' => 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Tuyau PVC Ø40 4m', 'unit' => 'barre', 'selling_price' => 1800, 'cost_price' => 1200, 'alert_quantity' => 30, 'image_url' => 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Robinet Mélangeur Inox Lavabo', 'unit' => 'unité', 'selling_price' => 14500, 'cost_price' => 9800, 'alert_quantity' => 6, 'image_url' => 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Colle PVC Pinceau 500g', 'unit' => 'pot', 'selling_price' => 3200, 'cost_price' => 2100, 'alert_quantity' => 15, 'image_url' => 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Siphon de Douche Inox 15x15', 'unit' => 'unité', 'selling_price' => 5500, 'cost_price' => 3600, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Électricité & Éclairage',
                        'icon' => 'fa-bolt',
                        'image_url' => 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Câble TH 1.5mm² (Rouleau 100m)', 'unit' => 'rouleau', 'selling_price' => 16500, 'cost_price' => 12800, 'alert_quantity' => 5, 'image_url' => 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Câble TH 2.5mm² (Rouleau 100m)', 'unit' => 'rouleau', 'selling_price' => 24500, 'cost_price' => 19500, 'alert_quantity' => 5, 'image_url' => 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Disjoncteur Différentiel 16A Mono', 'unit' => 'unité', 'selling_price' => 4500, 'cost_price' => 2900, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Projecteur LED 50W Extérieur IP65', 'unit' => 'unité', 'selling_price' => 8500, 'cost_price' => 5600, 'alert_quantity' => 8, 'image_url' => 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Ampoule LED E27 12W Blanc Froid', 'unit' => 'unité', 'selling_price' => 1000, 'cost_price' => 600, 'alert_quantity' => 50, 'image_url' => 'https://images.unsplash.com/photo-1550525811-e5869dd03032?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Outillage & Équipement',
                        'icon' => 'fa-screwdriver-wrench',
                        'image_url' => 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Marteau d\'arrache 500g Manche Fibre', 'unit' => 'unité', 'selling_price' => 4200, 'cost_price' => 2600, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Groupe Électrogène 5.5KVA Essence', 'unit' => 'unité', 'selling_price' => 285000, 'cost_price' => 230000, 'alert_quantity' => 2, 'image_url' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Meuleuse d\'angle 115mm 850W', 'unit' => 'unité', 'selling_price' => 26500, 'cost_price' => 19000, 'alert_quantity' => 4, 'image_url' => 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Perceuse à percussion 710W', 'unit' => 'unité', 'selling_price' => 24000, 'cost_price' => 17500, 'alert_quantity' => 5, 'image_url' => 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Niveau à bulle Aluminium 60cm', 'unit' => 'unité', 'selling_price' => 3500, 'cost_price' => 2200, 'alert_quantity' => 12, 'image_url' => 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ]
                ]
            ],
            [
                'name' => '🛒 Superette & Alimentation',
                'slug' => 'superette',
                'domain' => 'Alimentation & Grande Consommation',
                'description' => 'Catalogue complet pour supérettes, alimentations générales, épiceries et commerces de quartier.',
                'icon' => 'fa-cart-shopping',
                'categories' => [
                    [
                        'name' => 'Riz & Céréales',
                        'icon' => 'fa-bowl-rice',
                        'image_url' => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Riz Parfumé Uncle Sam 25kg', 'unit' => 'sac', 'selling_price' => 18500, 'cost_price' => 16200, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Riz Oncle Sam 5kg', 'unit' => 'sac', 'selling_price' => 4200, 'cost_price' => 3650, 'alert_quantity' => 15, 'image_url' => 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Spaghetti Panzani 500g', 'unit' => 'paquet', 'selling_price' => 600, 'cost_price' => 480, 'alert_quantity' => 50, 'image_url' => 'https://images.unsplash.com/photo-1621996346565-e3d5d6281293?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Macaroni Maman 500g', 'unit' => 'paquet', 'selling_price' => 500, 'cost_price' => 390, 'alert_quantity' => 40, 'image_url' => 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Couscous Moyen Dari 1kg', 'unit' => 'paquet', 'selling_price' => 1200, 'cost_price' => 920, 'alert_quantity' => 20, 'image_url' => 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Huiles & Condiments',
                        'icon' => 'fa-bottle-droplet',
                        'image_url' => 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Huile Raffinée Dinor 5L', 'unit' => 'bidon', 'selling_price' => 6800, 'cost_price' => 5900, 'alert_quantity' => 12, 'image_url' => 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Huile Tournesol 1L', 'unit' => 'bouteille', 'selling_price' => 1400, 'cost_price' => 1150, 'alert_quantity' => 24, 'image_url' => 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Boîte de Tomate Concentrée 400g', 'unit' => 'boîte', 'selling_price' => 650, 'cost_price' => 510, 'alert_quantity' => 36, 'image_url' => 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Cube Maggi Tablette (Carton 60)', 'unit' => 'boîte', 'selling_price' => 1600, 'cost_price' => 1350, 'alert_quantity' => 20, 'image_url' => 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Mayonnaise Lesieur 475g', 'unit' => 'bocal', 'selling_price' => 1850, 'cost_price' => 1480, 'alert_quantity' => 15, 'image_url' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Produits Laitiers & Petit Déjeuner',
                        'icon' => 'fa-mug-hot',
                        'image_url' => 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Lait Concentré Sucré Bonnet Rouge 1kg', 'unit' => 'boîte', 'selling_price' => 2100, 'cost_price' => 1750, 'alert_quantity' => 18, 'image_url' => 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Lait en Poudre Nido 400g', 'unit' => 'boîte', 'selling_price' => 2900, 'cost_price' => 2450, 'alert_quantity' => 15, 'image_url' => 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Sucre Granulé Blanc 1kg', 'unit' => 'paquet', 'selling_price' => 950, 'cost_price' => 820, 'alert_quantity' => 40, 'image_url' => 'https://images.unsplash.com/photo-1581600140682-d4e68c8cde52?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Nescafé Classic 200g', 'unit' => 'bocal', 'selling_price' => 3800, 'cost_price' => 3100, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Chocolat en Poudre Milo 400g', 'unit' => 'boîte', 'selling_price' => 2400, 'cost_price' => 1950, 'alert_quantity' => 12, 'image_url' => 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Boissons & Rafraîchissements',
                        'icon' => 'fa-bottle-water',
                        'image_url' => 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Eau Minérale Awa 1.5L (Pack de 6)', 'unit' => 'pack', 'selling_price' => 2200, 'cost_price' => 1750, 'alert_quantity' => 30, 'image_url' => 'https://images.unsplash.com/photo-1560023907-5f313c875300?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Coca-Cola Canette 33cl', 'unit' => 'canette', 'selling_price' => 500, 'cost_price' => 380, 'alert_quantity' => 48, 'image_url' => 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Jus d\'Orange Ceres 1L', 'unit' => 'brique', 'selling_price' => 1350, 'cost_price' => 1050, 'alert_quantity' => 20, 'image_url' => 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Bière Bock 65cl (Bouteille consignée)', 'unit' => 'bouteille', 'selling_price' => 600, 'cost_price' => 480, 'alert_quantity' => 36, 'image_url' => 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Canette Energy Drink 250ml', 'unit' => 'canette', 'selling_price' => 700, 'cost_price' => 450, 'alert_quantity' => 24, 'image_url' => 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ]
                ]
            ],
            [
                'name' => '📱 Téléphonie & Accessoires',
                'slug' => 'telephonie',
                'domain' => 'Électronique & High-Tech',
                'description' => 'Catalogue pour boutiques de téléphonie, vente de smartphones, chargeurs, écouteurs et accessoires.',
                'icon' => 'fa-mobile-screen-button',
                'categories' => [
                    [
                        'name' => 'Smartphones & Feature Phones',
                        'icon' => 'fa-mobile-retro',
                        'image_url' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Smartphone Android 6.5" 64GB', 'unit' => 'unité', 'selling_price' => 55000, 'cost_price' => 44000, 'alert_quantity' => 5, 'image_url' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Téléphone Touches Double SIM', 'unit' => 'unité', 'selling_price' => 11500, 'cost_price' => 8900, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Smartphone Pro 128GB AMOLED', 'unit' => 'unité', 'selling_price' => 125000, 'cost_price' => 105000, 'alert_quantity' => 3, 'image_url' => 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Chargeurs & Câbles',
                        'icon' => 'fa-plug-circle-bolt',
                        'image_url' => 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Chargeur Rapide 20W Type-C', 'unit' => 'unité', 'selling_price' => 4500, 'cost_price' => 2200, 'alert_quantity' => 15, 'image_url' => 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Câble USB vers Type-C Tressé 1m', 'unit' => 'unité', 'selling_price' => 2000, 'cost_price' => 850, 'alert_quantity' => 25, 'image_url' => 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Chargeur Voiture Allume-Cygne 3.4A', 'unit' => 'unité', 'selling_price' => 3000, 'cost_price' => 1400, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Audio & Écouteurs',
                        'icon' => 'fa-headphones',
                        'image_url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Écouteurs Bluetooth TWS Sans Fil', 'unit' => 'unité', 'selling_price' => 8500, 'cost_price' => 4500, 'alert_quantity' => 12, 'image_url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Casque Audio Pliable Bass', 'unit' => 'unité', 'selling_price' => 12500, 'cost_price' => 7800, 'alert_quantity' => 8, 'image_url' => 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Écouteurs Filaire Jack 3.5mm', 'unit' => 'unité', 'selling_price' => 1500, 'cost_price' => 600, 'alert_quantity' => 30, 'image_url' => 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Protection & Powerbanks',
                        'icon' => 'fa-shield-halved',
                        'image_url' => 'https://images.unsplash.com/photo-1609592807984-7a136bfb1049?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Powerbank 10.000mAh Ultra Slim', 'unit' => 'unité', 'selling_price' => 9500, 'cost_price' => 5800, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1609592807984-7a136bfb1049?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Verre Trempé Incassable Universel', 'unit' => 'unité', 'selling_price' => 1500, 'cost_price' => 400, 'alert_quantity' => 40, 'image_url' => 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Pochette Antichoc Silicone Transparente', 'unit' => 'unité', 'selling_price' => 2000, 'cost_price' => 650, 'alert_quantity' => 25, 'image_url' => 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ]
                ]
            ],
            [
                'name' => '💄 Cosmétique & Beauté',
                'slug' => 'cosmetique',
                'domain' => 'Beauté & Hygiène',
                'description' => 'Catalogue pour magasins de produits de beauté, parfumeries, soins de la peau et mèches.',
                'icon' => 'fa-sparkles',
                'categories' => [
                    [
                        'name' => 'Soins du Corps & Visage',
                        'icon' => 'fa-pump-soap',
                        'image_url' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Lait Hydratant Beurre de Karité 500ml', 'unit' => 'flacon', 'selling_price' => 4500, 'cost_price' => 3200, 'alert_quantity' => 12, 'image_url' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Savon Noir Purifiant Bio 250g', 'unit' => 'pot', 'selling_price' => 2500, 'cost_price' => 1600, 'alert_quantity' => 20, 'image_url' => 'https://images.unsplash.com/photo-1607006482142-2b6348636f32?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Gel Douche Exfoliant Abricot 750ml', 'unit' => 'flacon', 'selling_price' => 3800, 'cost_price' => 2700, 'alert_quantity' => 15, 'image_url' => 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Coiffure & Cheveux',
                        'icon' => 'fa-scissors',
                        'image_url' => 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Shampoing Réparateur Argan 400ml', 'unit' => 'bouteille', 'selling_price' => 3200, 'cost_price' => 2200, 'alert_quantity' => 15, 'image_url' => 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Paquet Mèches Tressage Expression', 'unit' => 'paquet', 'selling_price' => 1500, 'cost_price' => 1100, 'alert_quantity' => 30, 'image_url' => 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Baume Capillaire Croissance 200g', 'unit' => 'pot', 'selling_price' => 2800, 'cost_price' => 1900, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Parfumerie & Déodorants',
                        'icon' => 'fa-spray-can-sparkles',
                        'image_url' => 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Eau de Parfum Homme 100ml Premium', 'unit' => 'flacon', 'selling_price' => 18500, 'cost_price' => 12500, 'alert_quantity' => 6, 'image_url' => 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Déodorant Spray 48h 200ml', 'unit' => 'spray', 'selling_price' => 2200, 'cost_price' => 1500, 'alert_quantity' => 24, 'image_url' => 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ]
                ]
            ],
            [
                'name' => '👗 Mode & Habillement',
                'slug' => 'mode',
                'domain' => 'Textile & Confection',
                'description' => 'Catalogue pour boutiques de vêtements, chaussure, pagnes et accessoires de mode.',
                'icon' => 'fa-shirt',
                'categories' => [
                    [
                        'name' => 'Pagnes & Tissus',
                        'icon' => 'fa-scroll',
                        'image_url' => 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Pagne Wax Véritable 6 Yards (Pièce)', 'unit' => 'pièce', 'selling_price' => 14500, 'cost_price' => 11000, 'alert_quantity' => 8, 'image_url' => 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Tissu Bazin Riche Super 3m', 'unit' => 'coupon', 'selling_price' => 22000, 'cost_price' => 17500, 'alert_quantity' => 5, 'image_url' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Vêtements Homme & Femme',
                        'icon' => 'fa-vest',
                        'image_url' => 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Chemise Homme 100% Coton', 'unit' => 'unité', 'selling_price' => 12500, 'cost_price' => 8500, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Robe Traditionnelle Brodée', 'unit' => 'unité', 'selling_price' => 25000, 'cost_price' => 18000, 'alert_quantity' => 4, 'image_url' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Jean Slim Stretch Homme', 'unit' => 'unité', 'selling_price' => 11000, 'cost_price' => 7500, 'alert_quantity' => 12, 'image_url' => 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ]
                ]
            ],
            [
                'name' => '🚗 Auto, Moto & Pièces Détachées',
                'slug' => 'automobile',
                'domain' => 'Automobile & Transport',
                'description' => 'Catalogue prêt à l\'emploi pour magasins de pièces de rechange, vidange et lubrifiants.',
                'icon' => 'fa-car-battery',
                'categories' => [
                    [
                        'name' => 'Huiles & Lubrifiants',
                        'icon' => 'fa-oil-can',
                        'image_url' => 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Huile Moteur Total Quartz 20W50 5L', 'unit' => 'bidon', 'selling_price' => 19500, 'cost_price' => 16000, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Liquide de Frein DOT4 500ml', 'unit' => 'flacon', 'selling_price' => 2500, 'cost_price' => 1700, 'alert_quantity' => 20, 'image_url' => 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Liquide de Refroidissement 5L', 'unit' => 'bidon', 'selling_price' => 4500, 'cost_price' => 3100, 'alert_quantity' => 15, 'image_url' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Pièces de Rechange & Filtration',
                        'icon' => 'fa-gears',
                        'image_url' => 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Filtre à Huile Universel Toyota', 'unit' => 'unité', 'selling_price' => 3500, 'cost_price' => 2100, 'alert_quantity' => 15, 'image_url' => 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Jeu de Plaquettes de Frein Avant', 'unit' => 'jeu', 'selling_price' => 14500, 'cost_price' => 9800, 'alert_quantity' => 6, 'image_url' => 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Bougie d\'Allumage NGK (Jeu de 4)', 'unit' => 'jeu', 'selling_price' => 8000, 'cost_price' => 5200, 'alert_quantity' => 10, 'image_url' => 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ]
                ]
            ],
            [
                'name' => '💻 Informatique & Réseau',
                'slug' => 'informatique',
                'domain' => 'High-Tech & Bureautique',
                'description' => 'Catalogue pour boutiques informatiques, ordinateurs, accessoires et matériel réseau.',
                'icon' => 'fa-laptop-code',
                'categories' => [
                    [
                        'name' => 'Ordinateurs & Tablettes',
                        'icon' => 'fa-laptop',
                        'image_url' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Laptop Core i5 8GB SSD 256GB 15.6"', 'unit' => 'unité', 'selling_price' => 245000, 'cost_price' => 205000, 'alert_quantity' => 3, 'image_url' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Tablette Tactile 10" 64GB WiFi/4G', 'unit' => 'unité', 'selling_price' => 68000, 'cost_price' => 54000, 'alert_quantity' => 5, 'image_url' => 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ],
                    [
                        'name' => 'Périphériques & Stockage',
                        'icon' => 'fa-hard-drive',
                        'image_url' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
                        'products' => [
                            ['name' => 'Souris Sans Fil Ergonomique 2.4G', 'unit' => 'unité', 'selling_price' => 4500, 'cost_price' => 2200, 'alert_quantity' => 15, 'image_url' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Disque Dur Externe SSD 1TB USB 3.2', 'unit' => 'unité', 'selling_price' => 48000, 'cost_price' => 39000, 'alert_quantity' => 5, 'image_url' => 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=80'],
                            ['name' => 'Clavier Multimédia USB AZERTY', 'unit' => 'unité', 'selling_price' => 5500, 'cost_price' => 3100, 'alert_quantity' => 12, 'image_url' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80'],
                        ]
                    ]
                ]
            ],
            [
                'name' => '📦 Catalogue Vierge',
                'slug' => 'vierge',
                'domain' => 'Démarrage personnalisé',
                'description' => 'Démarrer sans aucun produit pré-enregistré pour créer votre catalogue entièrement sur mesure.',
                'icon' => 'fa-folder-plus',
                'categories' => []
            ]
        ];

        foreach ($templates as $tData) {
            $categoriesData = $tData['categories'] ?? [];
            unset($tData['categories']);

            $template = CatalogTemplate::updateOrCreate(
                ['slug' => $tData['slug']],
                $tData
            );

            // Supprimer anciennes entrées pour réensemencer proprement
            CatalogTemplateCategory::where('catalog_template_id', $template->id)->delete();
            CatalogTemplateProduct::where('catalog_template_id', $template->id)->delete();

            foreach ($categoriesData as $catMeta) {
                $categoryName = $catMeta['name'];
                
                CatalogTemplateCategory::create([
                    'catalog_template_id' => $template->id,
                    'name'                => $categoryName,
                    'icon'                => $catMeta['icon'] ?? 'fa-folder',
                    'image_url'           => $catMeta['image_url'] ?? null,
                ]);

                foreach ($catMeta['products'] as $pData) {
                    CatalogTemplateProduct::create([
                        'catalog_template_id' => $template->id,
                        'category_name'       => $categoryName,
                        'name'                => $pData['name'],
                        'unit'                => $pData['unit'] ?? 'unité',
                        'selling_price'       => $pData['selling_price'],
                        'cost_price'          => $pData['cost_price'],
                        'tax_rate'            => $pData['tax_rate'] ?? 0,
                        'alert_quantity'      => $pData['alert_quantity'] ?? 5,
                        'image_url'           => $pData['image_url'] ?? null,
                    ]);
                }
            }
        }
    }
}
