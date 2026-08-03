<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CatalogTemplate;
use App\Models\CatalogTemplateCategory;
use App\Models\CatalogTemplateProduct;
use App\Models\Category;
use App\Models\Product;
use App\Models\Stock;
use App\Services\TenantManager;
use Illuminate\Support\Facades\DB;
use App\Traits\Auditable;

class CatalogTemplateController extends Controller
{
    use Auditable;

    /**
     * Obtenir la liste de tous les packs de catalogues prédéfinis actifs.
     */
    public function index()
    {
        $templates = CatalogTemplate::where('is_active', true)
            ->withCount(['categories', 'products'])
            ->get();

        return response()->json($templates);
    }

    /**
     * Obtenir les détails d'un pack (catégories et produits).
     */
    public function show($id)
    {
        $template = CatalogTemplate::where('is_active', true)
            ->with(['categories', 'products'])
            ->findOrFail($id);

        return response()->json($template);
    }

    /**
     * Importer / Installer un pack de catalogue dans l'entreprise courante.
     * Supporte l'installation partielle par sélection de catégories.
     */
    public function install(Request $request, $id)
    {
        $request->validate([
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer',
            'branch_id' => 'nullable|integer|exists:branches,id',
        ]);

        $currentUser = $request->user();
        $tenantManager = app(TenantManager::class);
        $companyId = $tenantManager->getCompanyId() ?: $currentUser->company_id;

        if (!$companyId) {
            return response()->json(['error' => 'Entreprise non identifiée.'], 400);
        }

        $template = CatalogTemplate::where('is_active', true)->findOrFail($id);

        $selectedCategoryIds = $request->category_ids;
        
        $categoriesQuery = $template->categories();
        if (!empty($selectedCategoryIds)) {
            $categoriesQuery->whereIn('id', $selectedCategoryIds);
        }
        $selectedCategories = $categoriesQuery->get();

        $selectedCategoryNames = $selectedCategories->pluck('name')->toArray();

        $productsQuery = $template->products();
        if (!empty($selectedCategoryNames)) {
            $productsQuery->whereIn('category_name', $selectedCategoryNames);
        }
        $selectedProducts = $productsQuery->get();

        $branchId = $request->branch_id ?: $currentUser->branch_id;

        $createdCategoriesCount = 0;
        $createdProductsCount = 0;

        DB::transaction(function () use (
            $companyId,
            $branchId,
            $selectedCategories,
            $selectedProducts,
            $template,
            $currentUser,
            $request,
            &$createdCategoriesCount,
            &$createdProductsCount
        ) {
            $categoryMapping = [];

            // 1. Créer/Importer les catégories
            foreach ($selectedCategories as $cat) {
                $category = Category::firstOrCreate(
                    [
                        'company_id' => $companyId,
                        'name'       => $cat->name,
                    ],
                    [
                        'icon'       => $cat->icon ?? 'fa-folder',
                        'image_path' => $cat->image_url,
                    ]
                );
                $categoryMapping[$cat->name] = $category->id;
                $createdCategoriesCount++;
            }

            // 2. Créer/Importer les produits
            foreach ($selectedProducts as $tmplProd) {
                $catId = isset($categoryMapping[$tmplProd->category_name])
                    ? $categoryMapping[$tmplProd->category_name]
                    : null;

                $product = Product::create([
                    'company_id'     => $companyId,
                    'branch_id'      => $branchId,
                    'category_id'    => $catId,
                    'name'           => $tmplProd->name,
                    'sku'            => $tmplProd->sku ?: ('SKU-' . strtoupper(substr(uniqid(), -6))),
                    'barcode'        => $tmplProd->barcode ?: rand(100000000000, 999999999999),
                    'description'    => $tmplProd->description,
                    'unit'           => $tmplProd->unit ?: 'unité',
                    'selling_price'  => $tmplProd->selling_price,
                    'cost_price'     => $tmplProd->cost_price,
                    'tax_rate'       => $tmplProd->tax_rate,
                    'alert_quantity' => $tmplProd->alert_quantity,
                    'image_path'     => $tmplProd->image_url,
                    'status'         => 'active',
                ]);

                // Créer le stock initial à 0 pour la boutique
                if ($branchId) {
                    Stock::firstOrCreate(
                        [
                            'product_id' => $product->id,
                            'branch_id'  => $branchId,
                        ],
                        [
                            'company_id'     => $companyId,
                            'quantity'       => 0,
                            'alert_quantity' => $tmplProd->alert_quantity,
                        ]
                    );
                }

                $createdProductsCount++;
            }

            // Enregistrer dans le journal d'audit
            $this->logAuditEvent('CATALOG_TEMPLATE_INSTALLED', [
                'template_name' => $template->name,
                'template_slug' => $template->slug,
                'categories_count' => $createdCategoriesCount,
                'products_count'   => $createdProductsCount,
                'branch_id'        => $branchId,
            ], $currentUser);
        });

        return response()->json([
            'message' => "Importation réussie du catalogue \"{$template->name}\".",
            'imported_categories' => $createdCategoriesCount,
            'imported_products'   => $createdProductsCount,
        ]);
    }
}
