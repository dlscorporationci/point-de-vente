<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\MaintenanceService;
use App\Models\MaintenanceMode;

class MaintenanceController extends Controller
{
    protected MaintenanceService $maintenanceService;

    public function __construct(MaintenanceService $maintenanceService)
    {
        $this->maintenanceService = $maintenanceService;
    }

    /**
     * Vérifier le statut de maintenance applicative (Public / Accessible hors auth si besoin).
     */
    public function status(Request $request)
    {
        $companyId = $request->header('X-Company-ID');
        $maint     = $this->maintenanceService->isMaintenanceActive($companyId ? intval($companyId) : null);

        return response()->json([
            'in_maintenance' => $maint !== null,
            'maintenance'    => $maint,
        ]);
    }

    /**
     * Obtenir l'historique et les règles de maintenance (Réservé SuperAdmin / Admin).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $userRoleSlug = is_object($user->role) ? $user->role->slug : (string)$user->role;
        $isAuthorized = in_array($userRoleSlug, ['super-admin', 'admin']) || ($user->email === 'superadmin@dls.com');
        if (!$isAuthorized) {
            return response()->json(['error' => 'Accès refusé.'], 403);
        }

        $modes = MaintenanceMode::with(['company', 'creator'])->orderBy('id', 'desc')->get();
        $activeGlobal = MaintenanceMode::where('type', 'global')->where('enabled', true)->first();

        return response()->json([
            'success'       => true,
            'active_global' => $activeGlobal,
            'modes'         => $modes,
        ]);
    }

    /**
     * Activer ou désactiver un mode de maintenance.
     */
    public function toggle(Request $request)
    {
        $user = $request->user();
        $userRoleSlug = is_object($user->role) ? $user->role->slug : (string)$user->role;
        $isAuthorized = in_array($userRoleSlug, ['super-admin', 'admin']) || ($user->email === 'superadmin@dls.com');
        if (!$isAuthorized) {
            return response()->json(['error' => 'Accès refusé.'], 403);
        }

        $request->validate([
            'enabled' => 'required|boolean',
            'type'    => 'required|in:global,company,branch',
            'message' => 'nullable|string',
        ]);

        $maint = $this->maintenanceService->setMaintenanceMode($request->all(), $user);

        return response()->json([
            'success'     => true,
            'message'     => $maint->enabled ? "Mode maintenance activé avec succès." : "Mode maintenance désactivé.",
            'maintenance' => $maint,
        ]);
    }
}
