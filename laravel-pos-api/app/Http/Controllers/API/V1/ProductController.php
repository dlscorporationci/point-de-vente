<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Liste des produits avec filtres (recherche et catégorie) et pagination.
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

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

        return response()->json($query->orderBy('name')->paginate(15));
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

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
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
        }

        $validated['company_id'] = $companyId;
        $product = Product::create($validated);

        return response()->json([
            'message' => 'Produit créé avec succès.',
            'product' => $product->load('category')
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
            'category_id' => 'required|exists:categories,id',
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
        }

        $product->update($validated);

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
            'parent_id' => 'nullable|exists:categories,id',
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
        }

        $validated['company_id'] = $companyId;
        $category = Category::create($validated);

        return response()->json([
            'message' => 'Catégorie créée avec succès.',
            'category' => $category->load('parent')
        ], 201);
    }
}
