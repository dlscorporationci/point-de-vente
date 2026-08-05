<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\AccessControlLog;
use Illuminate\Http\Request;
use App\Services\AuthorizationService;

class AccessControlLogController extends Controller
{
    protected AuthorizationService $authService;

    public function __construct(AuthorizationService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Liste et filtre les journaux d'audit de sécurité RBAC/ABAC
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        if (!$currentUser) {
            return response()->json(['error' => 'Accès non authentifié.'], 401);
        }

        // Seuls les administrateurs et super-admins peuvent consulter les logs de sécurité
        if (!$this->authService->isSuperAdmin($currentUser) && !$this->authService->hasPermission($currentUser, 'users.view')) {
            $roleSlug = strtolower($currentUser->role->slug ?? $currentUser->role->name ?? '');
            if (!str_contains($roleSlug, 'admin') && !str_contains($roleSlug, 'gerant')) {
                return response()->json(['error' => 'Accès refusé. Consultation de l\'historique de sécurité non autorisée.'], 403);
            }
        }

        $query = AccessControlLog::with([
            'actor:id,name,email',
            'target:id,name,email',
            'oldRole:id,name,slug',
            'newRole:id,name,slug',
            'oldAccessZone:id,name',
            'newAccessZone:id,name',
        ]);

        // Isolation Multi-Tenant
        if (!$this->authService->isSuperAdmin($currentUser)) {
            $query->where('company_id', $currentUser->company_id);
        } elseif ($request->filled('company_id')) {
            $query->where('company_id', $request->input('company_id'));
        }

        // Filtres
        if ($request->filled('target_user_id')) {
            $query->where('target_user_id', $request->input('target_user_id'));
        }
        if ($request->filled('actor_user_id')) {
            $query->where('actor_user_id', $request->input('actor_user_id'));
        }
        if ($request->filled('action')) {
            $query->where('action', 'like', '%' . $request->input('action') . '%');
        }
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        $logs = $query->orderByDesc('created_at')->paginate($request->input('per_page', 25));

        return response()->json($logs);
    }
}
