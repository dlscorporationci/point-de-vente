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

    private function isUserAuthorizedForMaintenance($user): bool
    {
        if (!$user) return false;

        $userRoleSlug = is_object($user->role) ? ($user->role->slug ?? '') : (string)($user->role ?? '');
        $userRoleName = is_object($user->role) ? ($user->role->name ?? '') : (string)($user->role ?? '');

        return (
            in_array($userRoleSlug, ['super-admin', 'superadmin', 'admin']) ||
            in_array($userRoleName, ['super-admin', 'Super Admin', 'Super-Admin', 'Admin']) ||
            $user->email === 'superadmin@dls.com' ||
            !empty($user->is_superadmin) ||
            ($user->role_id && intval($user->role_id) === 1) ||
            ($user->company_id === null)
        );
    }

    /**
     * Obtenir l'historique et les règles de maintenance (Réservé SuperAdmin / Admin).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Utilisateur non authentifié.'], 401);
        }

        if (!$this->isUserAuthorizedForMaintenance($user)) {
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
        if (!$user) {
            return response()->json(['error' => 'Utilisateur non authentifié.'], 401);
        }

        if (!$this->isUserAuthorizedForMaintenance($user)) {
            return response()->json(['error' => 'Accès refusé. Vous devez être administrateur pour modifier la maintenance.'], 403);
        }

        $request->validate([
            'enabled' => 'required|boolean',
            'type'    => 'required|in:global,company,branch',
            'message' => 'nullable|string',
        ]);

        try {
            $maint = $this->maintenanceService->setMaintenanceMode($request->all(), $user);

            return response()->json([
                'success'     => true,
                'message'     => $maint->enabled ? "Mode maintenance activé avec succès." : "Mode maintenance désactivé avec succès.",
                'maintenance' => $maint,
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Erreur toggle maintenance : " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json([
                'error' => 'Échec de la modification du mode maintenance : ' . $e->getMessage()
            ], 500);
        }
    }
}
