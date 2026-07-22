<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /**
     * Liste des logs d'audit filtrés par compagnie.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $roleSlug = $user->role->slug ?? '';
        $isAuthorized = in_array($roleSlug, ['super-admin', 'admin', 'gerant']);
        if (!$isAuthorized) {
            return response()->json(['error' => 'Accès refusé. Autorisation insuffisante.'], 403);
        }

        $query = AuditLog::with('user');

        // Si l'utilisateur connecté n'est pas le super-admin global du SaaS,
        // le scope 'tenant' s'applique automatiquement pour filtrer par entreprise.
        // Si c'est le super-admin, on retire le scope global pour qu'il puisse tout auditer.
        if ($roleSlug === 'super-admin') {
            $query->withoutGlobalScope('tenant');
        }

        $query->orderByDesc('created_at');

        if ($request->has('action') && !empty($request->input('action'))) {
            $query->where('action', $request->input('action'));
        }

        if ($request->has('auditable_type') && !empty($request->input('auditable_type'))) {
            $query->where('auditable_type', 'like', '%' . $request->input('auditable_type') . '%');
        }

        if ($request->has('user_id') && !empty($request->input('user_id'))) {
            $query->where('user_id', $request->input('user_id'));
        }

        // Filtre par entreprise (réservé au super-admin)
        if ($roleSlug === 'super-admin' && $request->has('company_id') && !empty($request->input('company_id'))) {
            $query->where('company_id', $request->input('company_id'));
        }

        // Filtre par boutique (si applicable via l'utilisateur ou la table)
        if ($request->has('branch_id') && !empty($request->input('branch_id'))) {
            $branchId = $request->input('branch_id');
            $query->whereHas('user', function ($q) use ($branchId) {
                $q->where('branch_id', $branchId);
            });
        }

        // Filtre par période de dates
        if ($request->has('date_start') && !empty($request->input('date_start'))) {
            $query->whereDate('created_at', '>=', $request->input('date_start'));
        }
        if ($request->has('date_end') && !empty($request->input('date_end'))) {
            $query->whereDate('created_at', '<=', $request->input('date_end'));
        }

        // Recherche globale floue
        if ($request->has('search') && !empty($request->input('search'))) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%")
                  ->orWhere('user_agent', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        return response()->json($query->paginate(50));
    }
}
