<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Validation\Rule;
use App\Events\Product\ProductCreated;
use App\Events\Product\ProductUpdated;

class ProductController extends Controller
{
    /**
     * Liste des produits avec filtres (recherche et catégorie) et pagination.
     */
    /**
     * Liste des produits avec filtres (recherche, catégorie et boutique affectée) et pagination.
     */
    public function index(Request $request)
    {
        // Filtre par boutique affectée
        $branchId = $request->input('branch_id');
        if (empty($branchId) || $branchId === 'undefined') {
            $branchId = app(\App\Services\TenantManager::class)->getBranchId()
                ?: ($request->user() ? $request->user()->branch_id : null);
        }

        $query = Product::with(['category', 'branchProducts']);

        // Filtre recherche par Nom, SKU ou Code-barres
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        // Filtre par catégorie
        if ($request->has('category_id') && !empty($request->category_id)) {
            $query->where('category_id', $request->category_id);
        }

        $perPage = $request->input('per_page', 500);
        $paginated = $query->orderBy('name')->paginate($perPage);

        $paginated->getCollection()->transform(function ($product) use ($branchId) {
            $totalSum = floatval($product->branchProducts->sum('quantity'));
            if ($branchId && $branchId !== 'all') {
                $bp = $product->branchProducts->firstWhere('branch_id', (int)$branchId);
                $branchQty = $bp ? floatval($bp->quantity) : 0.0;
                // Si la boutique spécifique a du stock, utiliser ce stock, sinon la somme entreprise
                $qty = $branchQty > 0 ? $branchQty : $totalSum;
            } else {
                $qty = $totalSum;
            }

            $product->quantity = $qty;
            $product->stock_quantity = $qty;
            $product->stock = $qty;
            return $product;
        });

        return response()->json($paginated);
    }

    /**
     * Enregistrement d'un produit (Restreint par permission).
     */
    public function store(Request $request)
    {
        if (!$request->user()->hasPermission('products.create')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();

        // Interdiction de création de produit sans catégorie préalable dans l'entreprise
        $categoryCount = Category::where('company_id', $companyId)->count();
        if ($categoryCount === 0) {
            return response()->json([
                'status'  => 'error',
                'code'    => 'NO_CATEGORY_EXISTS',
                'error'   => 'Création impossible : vous devez préalablement créer au moins une catégorie de produit dans votre entreprise.',
                'message' => 'Création impossible : vous devez préalablement créer au moins une catégorie de produit dans votre entreprise.'
            ], 422);
        }

        $validated = $request->validate([
            // Phase 8 : Rule::exists avec scope company_id — évite le bypass du TenantScope
            'category_id' => ['nullable', Rule::exists('categories', 'id')->where('company_id', $companyId)],
            'name' => 'required|string|max:150',
            'sku' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products')->where('company_id', $companyId)
            ],
            'barcode' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('products')->where('company_id', $companyId)
            ],
            'description' => 'nullable|string',
            'selling_price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'alert_quantity' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:active,inactive',
            'image' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,svg,bmp|max:5120',
            'scope' => 'nullable|in:current,all,custom',
            'branch_ids' => 'nullable|array',
            'branch_ids.*' => 'exists:branches,id',
            'initial_stock' => 'nullable|numeric|min:0',
        ], [
            'image.mimes' => 'L\'image doit être au format JPEG, PNG, GIF, WebP, SVG ou BMP.',
            'image.max' => 'L\'image ne doit pas dépasser 5 Mo.',
            'image.file' => 'Le fichier image est invalide.',
        ]);

        $branchIds = $request->input('branch_ids');
        $scope = $request->input('scope', 'current');
        $initialStock = floatval($request->input('initial_stock', 0));
        unset($validated['image'], $validated['branch_ids'], $validated['scope'], $validated['initial_stock']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_path'] = '/storage/' . $path;
            @chmod(storage_path('app/public/' . $path), 0666);
        }

        $validated['company_id'] = $companyId;
        $product = Product::create($validated);

        // Déterminer les boutiques d'affectation selon le rôle de l'utilisateur
        $user = $request->user();
        $userRole = is_object($user->role) ? $user->role->slug : $user->role;
        $activeBranchId = app(\App\Services\TenantManager::class)->getBranchId() ?: $user->branch_id;

        if (in_array($userRole, ['gerant', 'caissier'])) {
            // Le Gérant crée TOUJOURS un produit exclusivement pour sa propre boutique
            $targetBranches = $activeBranchId ? [$activeBranchId] : [];
        } else {
            // L'Admin a le choix de la portée
            if ($scope === 'all') {
                $targetBranches = \App\Models\Branch::where('company_id', $companyId)->pluck('id')->toArray();
            } elseif (!empty($branchIds) && is_array($branchIds)) {
                $targetBranches = $branchIds;
            } else {
                $targetBranches = $activeBranchId ? [$activeBranchId] : \App\Models\Branch::where('company_id', $companyId)->pluck('id')->toArray();
            }
        }

        foreach ($targetBranches as $bId) {
            $qty = ($bId == $activeBranchId && $initialStock > 0) ? $initialStock : 0.00;
            \App\Models\BranchProduct::updateOrCreate([
                'branch_id' => $bId,
                'product_id' => $product->id,
            ], [
                'quantity' => $qty,
                'is_active' => true,
            ]);

            if ($bId == $activeBranchId && $initialStock > 0) {
                \Illuminate\Support\Facades\DB::table('stock_movements')->insert([
                    'company_id'   => $companyId,
                    'branch_id'    => $bId,
                    'product_id'   => $product->id,
                    'type'         => 'adjustment',
                    'quantity'     => $initialStock,
                    'reference_id' => $product->id,
                    'description'  => "Stock initial création de produit par {$user->name}",
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);
            }
        }

        $product->load(['category', 'branchProducts']);

        // Événement ProductCreated → Notifier admin/gérant de la boutique
        try {
            event(new ProductCreated($product, $request->user()));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('ProductCreated event error: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Produit créé et affecté avec succès.',
            'product' => $product
        ], 201);
    }

    /**
     * Détails d'un produit.
     */
    public function show(string $id)
    {
        $product = Product::with('category')->findOrFail($id);
        return response()->json($product);
    }

    /**
     * Modification d'un produit (Restreint par permission).
     */
    public function update(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('products.update')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $product = Product::findOrFail($id);
        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();

        $validated = $request->validate([
            // Phase 8 : Rule::exists avec scope company_id — évite le bypass du TenantScope
            'category_id' => ['nullable', Rule::exists('categories', 'id')->where('company_id', $companyId)],
            'name' => 'required|string|max:150',
            'sku' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products')->where('company_id', $companyId)->ignore($product->id)
            ],
            'barcode' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('products')->where('company_id', $companyId)->ignore($product->id)
            ],
            'description' => 'nullable|string',
            'selling_price' => 'required|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'alert_quantity' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:active,inactive',
            'image' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,svg,bmp|max:5120',
        ], [
            'image.mimes' => 'L\'image doit être au format JPEG, PNG, GIF, WebP, SVG ou BMP.',
            'image.max' => 'L\'image ne doit pas dépasser 5 Mo.',
            'image.file' => 'Le fichier image est invalide.',
        ]);

        // Retirer le champ 'image' des données validées (ce n'est pas une colonne de la table)
        unset($validated['image']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_path'] = '/storage/' . $path;
            @chmod(storage_path('app/public/' . $path), 0666);
        }

        // Détecter les champs modifiés (avant save)
        $changedFields = array_keys($product->getDirty());

        $product->update($validated);

        // Événement ProductUpdated → Notifier si prix modifié
        try {
            event(new ProductUpdated($product->load('category'), $request->user(), $changedFields));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('ProductUpdated event error: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Produit mis à jour avec succès.',
            'product' => $product->load('category')
        ]);
    }

    /**
     * Suppression d'un produit (Restreint par permission).
     */
    public function destroy(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('products.delete')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Produit supprimé avec succès.']);
    }

    /**
     * Liste toutes les catégories de l'entreprise active.
     */
    public function categories()
    {
        $categories = Category::with('parent')->orderBy('name')->get();
        return response()->json($categories);
    }

    /**
     * Création d'une catégorie (Restreinte par permission).
     */
    public function storeCategory(Request $request)
    {
        if (!$request->user()->hasPermission('products.create')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();

        $validated = $request->validate([
            // Phase 8 : scope company_id pour éviter de lier une parentèle cross-tenant
            'parent_id' => ['nullable', Rule::exists('categories', 'id')->where('company_id', $companyId)],
            'name' => 'required|string|max:100',
            'image' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,svg,bmp|max:5120',
        ], [
            'image.mimes' => 'L\'image doit être au format JPEG, PNG, GIF, WebP, SVG ou BMP.',
            'image.max' => 'L\'image ne doit pas dépasser 5 Mo.',
            'image.file' => 'Le fichier image est invalide.',
        ]);

        // Retirer le champ 'image' des données validées (ce n'est pas une colonne de la table)
        unset($validated['image']);

        // Génération automatique du slug à partir du nom
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);

        // Vérification d'unicité manuelle du slug dans le scope de la Company
        $exists = Category::where('company_id', $companyId)->where('slug', $validated['slug'])->exists();
        if ($exists) {
            return response()->json([
                'error' => 'Une catégorie avec un nom similaire existe déjà.'
            ], 422);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $validated['image_path'] = '/storage/' . $path;
            @chmod(storage_path('app/public/' . $path), 0666);
        }

        $validated['company_id'] = $companyId;
        $category = Category::create($validated);

        return response()->json([
            'message' => 'Catégorie créée avec succès.',
            'category' => $category->load('parent')
        ], 201);
    }

    /**
     * Suppression massive de tous les produits d'une boutique (Protégée par triple confirmation).
     */
    public function destroyAll(Request $request)
    {
        $currentUser = $request->user();
        $isAuthorized = $currentUser->role && in_array($currentUser->role->slug, ['admin', 'super-admin']) || $currentUser->hasPermission('products.delete');
        if (!$isAuthorized) {
            return response()->json(['error' => 'Action non autorisée. Seuls les administrateurs peuvent effectuer une suppression massive.'], 403);
        }

        $request->validate([
            'confirmation_text' => 'required|string',
            'branch_id'         => 'nullable|integer',
        ]);

        if (strtoupper(trim($request->confirmation_text)) !== 'SUPPRIMER') {
            return response()->json(['error' => 'Le texte de confirmation doit correspondre exactement à "SUPPRIMER".'], 422);
        }

        $companyId = app(\App\Services\TenantManager::class)->getCompanyId() ?: $currentUser->company_id;
        $branchId = $request->branch_id ?: $currentUser->branch_id;

        $productsQuery = Product::where('company_id', $companyId);
        if ($branchId) {
            $productsQuery->where('branch_id', $branchId);
        }
        $affectedCount = $productsQuery->count();

        \Illuminate\Support\Facades\DB::transaction(function () use ($productsQuery, $companyId, $branchId, $currentUser, $affectedCount) {
            $productsQuery->delete();

            $this->logAuditEvent('MASS_PRODUCT_DELETION', [
                'affected_products_count' => $affectedCount,
                'company_id'              => $companyId,
                'branch_id'               => $branchId,
                'action_by'               => $currentUser->name . ' (' . $currentUser->email . ')',
                'operation_id'            => (string) \Illuminate\Support\Str::uuid(),
            ], $currentUser);
        });

        return response()->json([
            'message' => "Suppression massive effectuée avec succès. {$affectedCount} produit(s) supprimé(s).",
            'affected_count' => $affectedCount
        ]);
    }
}
