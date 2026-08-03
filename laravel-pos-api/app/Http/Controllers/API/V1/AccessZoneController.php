<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AccessZone;
use App\Services\TenantManager;
use Illuminate\Support\Str;
use App\Traits\Auditable;

class AccessZoneController extends Controller
{
    use Auditable;

    /**
     * Liste des zones d'accès de l'entreprise.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $tenantManager = app(TenantManager::class);
        $companyId = $tenantManager->getCompanyId() ?: $currentUser->company_id;

        $zones = AccessZone::where('company_id', $companyId)
            ->withCount('users')
            ->get();

        return response()->json($zones);
    }

    /**
     * Créer une nouvelle zone d'accès.
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();
        $tenantManager = app(TenantManager::class);
        $companyId = $tenantManager->getCompanyId() ?: $currentUser->company_id;

        $request->validate([
            'name'            => 'required|string|max:100',
            'description'     => 'nullable|string',
            'branch_ids'      => 'nullable|array',
            'branch_ids.*'    => 'integer|exists:branches,id',
            'allowed_modules' => 'nullable|array',
            'allowed_modules.*' => 'string',
        ]);

        $zone = AccessZone::create([
            'company_id'      => $companyId,
            'name'            => $request->name,
            'slug'            => Str::slug($request->name),
            'description'     => $request->description,
            'branch_ids'      => $request->branch_ids ?? [],
            'allowed_modules' => $request->allowed_modules ?? [],
            'is_active'       => true,
        ]);

        $this->logAuditEvent('ACCESS_ZONE_CREATED', [
            'zone_name'  => $zone->name,
            'branch_ids' => $zone->branch_ids,
            'modules'    => $zone->allowed_modules,
        ], $currentUser);

        return response()->json([
            'message' => "Zone d'accès \"{$zone->name}\" créée avec succès.",
            'zone'    => $zone
        ], 201);
    }

    /**
     * Modifier une zone d'accès.
     */
    public function update(Request $request, $id)
    {
        $currentUser = $request->user();
        $tenantManager = app(TenantManager::class);
        $companyId = $tenantManager->getCompanyId() ?: $currentUser->company_id;

        $zone = AccessZone::where('company_id', $companyId)->findOrFail($id);

        $request->validate([
            'name'            => 'required|string|max:100',
            'description'     => 'nullable|string',
            'branch_ids'      => 'nullable|array',
            'allowed_modules' => 'nullable|array',
            'is_active'       => 'nullable|boolean',
        ]);

        $zone->update([
            'name'            => $request->name,
            'slug'            => Str::slug($request->name),
            'description'     => $request->description,
            'branch_ids'      => $request->branch_ids ?? [],
            'allowed_modules' => $request->allowed_modules ?? [],
            'is_active'       => $request->is_active ?? true,
        ]);

        $this->logAuditEvent('ACCESS_ZONE_UPDATED', [
            'zone_id'   => $zone->id,
            'zone_name' => $zone->name,
        ], $currentUser);

        return response()->json([
            'message' => "Zone d'accès \"{$zone->name}\" mise à jour.",
            'zone'    => $zone
        ]);
    }

    /**
     * Supprimer une zone d'accès.
     */
    public function destroy(Request $request, $id)
    {
        $currentUser = $request->user();
        $tenantManager = app(TenantManager::class);
        $companyId = $tenantManager->getCompanyId() ?: $currentUser->company_id;

        $zone = AccessZone::where('company_id', $companyId)->findOrFail($id);

        if ($zone->users()->count() > 0) {
            return response()->json([
                'error' => "Impossible de supprimer cette zone car elle est attribuée à {$zone->users()->count()} membre(s) du personnel."
            ], 422);
        }

        $zoneName = $zone->name;
        $zone->delete();

        $this->logAuditEvent('ACCESS_ZONE_DELETED', [
            'zone_name' => $zoneName,
        ], $currentUser);

        return response()->json(['message' => "Zone d'accès \"{$zoneName}\" supprimée."]);
    }
}
