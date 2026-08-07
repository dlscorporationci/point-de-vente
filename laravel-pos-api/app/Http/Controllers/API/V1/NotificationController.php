<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Obtenir la liste sécurisée des notifications filtrées par entreprise, boutiques autorisées, rôle et permissions.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $userRole = is_object($user->role) ? $user->role->slug : $user->role;
        $isSuperAdmin = ($userRole === 'super-admin') || ($user->email === 'superadmin@dls.com');

        // Récupérer toutes les boutiques accessibles par l'utilisateur
        $accessibleBranchIds = $user->assignedBranches()->pluck('id')->toArray();
        if ($user->branch_id && !in_array($user->branch_id, $accessibleBranchIds)) {
            $accessibleBranchIds[] = $user->branch_id;
        }

        $query = Notification::withoutGlobalScopes()
            ->with(['branch:id,name', 'actor:id,name,email']);

        // 1. Filtrage par entreprise (autorise les annonces globales company_id IS NULL)
        if (!$isSuperAdmin) {
            $query->where(function ($q) use ($user) {
                $q->where('company_id', $user->company_id)
                  ->orWhereNull('company_id');
            });

            // Exclut uniquement les messages qu'un utilisateur ordinaire s'est émis à lui-même pour des tiers
            $query->where(function ($q) use ($user) {
                $q->whereNull('actor_id')
                  ->orWhere('actor_id', '!=', $user->id)
                  ->orWhere('user_id', $user->id);
            });

            $query->where(function ($q) use ($user, $accessibleBranchIds) {
                $q->where('user_id', $user->id)
                  ->orWhere(function ($sub) use ($accessibleBranchIds) {
                      $sub->whereNull('user_id')
                          ->where(function ($b) use ($accessibleBranchIds) {
                              $b->whereNull('branch_id')
                                ->orWhereIn('branch_id', $accessibleBranchIds);
                          });
                  });
            });
        }

        // 3. Filtrage par statut de lecture (optionnel)
        if ($request->input('unread_only') === 'true' || $request->boolean('unread_only')) {
            $query->whereNull('read_at');
        }

        // 4. Filtrage par priorité (optionnel)
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // 5. Filtrage par type (optionnel)
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $allNotifications = $query->orderByDesc('created_at')->get();

        // 6. Filtrage dynamique par permission utilisateur côté backend
        $filteredNotifications = $allNotifications->filter(function ($n) use ($user, $isSuperAdmin) {
            if ($isSuperAdmin) return true;
            if ($n->permission_required) {
                return $user->hasPermission($n->permission_required);
            }
            return true;
        })->values();

        $unreadCount = $filteredNotifications->whereNull('read_at')->count();

        // Limite pour dropdown vs pagination complète
        $limit = $request->input('limit') ? intval($request->limit) : 50;
        $paginated = $filteredNotifications->take($limit);

        return response()->json([
            'notifications' => $paginated,
            'unread_count'  => $unreadCount,
            'total_count'   => $filteredNotifications->count(),
        ]);
    }

    /**
     * Obtenir le nombre de notifications non lues (Endpoint léger pour le polling de la cloche).
     */
    public function unreadCount(Request $request)
    {
        $user = $request->user();
        $userRole = is_object($user->role) ? $user->role->slug : $user->role;
        $isSuperAdmin = ($userRole === 'super-admin') || ($user->email === 'superadmin@dls.com');

        $accessibleBranchIds = $user->assignedBranches()->pluck('id')->toArray();
        if ($user->branch_id && !in_array($user->branch_id, $accessibleBranchIds)) {
            $accessibleBranchIds[] = $user->branch_id;
        }

        $query = Notification::withoutGlobalScopes()->whereNull('read_at');

        if (!$isSuperAdmin) {
            $query->where(function ($q) use ($user) {
                $q->where('company_id', $user->company_id)
                  ->orWhereNull('company_id');
            });

            $query->where(function ($q) use ($user) {
                $q->whereNull('actor_id')
                  ->orWhere('actor_id', '!=', $user->id)
                  ->orWhere('user_id', $user->id);
            });

            $query->where(function ($q) use ($user, $accessibleBranchIds) {
                $q->where('user_id', $user->id)
                  ->orWhere(function ($sub) use ($accessibleBranchIds) {
                      $sub->whereNull('user_id')
                          ->where(function ($b) use ($accessibleBranchIds) {
                              $b->whereNull('branch_id')
                                ->orWhereIn('branch_id', $accessibleBranchIds);
                          });
                  });
            });
        }

        $unreadList = $query->get()->filter(function ($n) use ($user, $isSuperAdmin) {
            if ($isSuperAdmin) return true;
            if ($n->permission_required) {
                return $user->hasPermission($n->permission_required);
            }
            return true;
        });

        return response()->json([
            'unread_count' => $unreadList->count(),
            'has_critical' => $unreadList->contains('priority', 'critical'),
            'has_warning'  => $unreadList->contains('priority', 'warning'),
        ]);
    }

    /**
     * Marquer une notification spécifique comme lue.
     */
    public function markAsRead(Request $request, string $id)
    {
        $notification = Notification::withoutGlobalScopes()->findOrFail($id);
        $notification->update(['read_at' => now()]);

        return response()->json([
            'message' => 'Notification marquée comme lue.',
            'id' => $notification->id
        ]);
    }

    /**
     * Marquer TOUTES les notifications accessibles à l'utilisateur comme lues.
     */
    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        $userRole = is_object($user->role) ? $user->role->slug : $user->role;
        $isSuperAdmin = ($userRole === 'super-admin') || ($user->email === 'superadmin@dls.com');

        $query = Notification::withoutGlobalScopes()->whereNull('read_at');

        if (!$isSuperAdmin) {
            $accessibleBranchIds = $user->assignedBranches()->pluck('id')->toArray();
            if ($user->branch_id && !in_array($user->branch_id, $accessibleBranchIds)) {
                $accessibleBranchIds[] = $user->branch_id;
            }

            $query->where(function ($q) use ($user) {
                $q->where('company_id', $user->company_id)
                  ->orWhereNull('company_id');
            });

            $query->where(function ($q) use ($user, $accessibleBranchIds) {
                $q->where('user_id', $user->id)
                  ->orWhere(function ($sub) use ($accessibleBranchIds) {
                      $sub->whereNull('user_id')
                          ->where(function ($b) use ($accessibleBranchIds) {
                              $b->whereNull('branch_id')
                                ->orWhereIn('branch_id', $accessibleBranchIds);
                          });
                  });
            });
        }

        $countUpdated = $query->update(['read_at' => now()]);

        return response()->json([
            'message' => 'Toutes les notifications ont été marquées comme lues.',
            'updated_count' => $countUpdated
        ]);
    }
}
