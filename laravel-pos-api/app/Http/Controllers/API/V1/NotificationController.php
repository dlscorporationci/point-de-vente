<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Liste des notifications de l'entreprise / boutique active.
     */
    public function index(Request $request)
    {
        $tenantManager = app(\App\Services\TenantManager::class);
        $companyId = $tenantManager->getCompanyId();
        $branchId  = $tenantManager->getBranchId();
        $userId    = $request->user()->id;

        $query = Notification::where('company_id', $companyId)
            ->where(function($q) use ($branchId, $userId) {
                $q->whereNull('branch_id')->orWhere('branch_id', $branchId);
            })
            ->where(function($q) use ($userId) {
                $q->whereNull('user_id')->orWhere('user_id', $userId);
            });

        if ($request->input('unread_only') === 'true') {
            $query->whereNull('read_at');
        }

        $notifications = $query->orderByDesc('created_at')->limit(50)->get();

        return response()->json([
            'notifications' => $notifications,
            'unread_count'  => $notifications->whereNull('read_at')->count(),
        ]);
    }

    /**
     * Marquer une notification comme lue.
     */
    public function markAsRead(Request $request, string $id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['read_at' => now()]);

        return response()->json(['message' => 'Notification marquée comme lue.']);
    }

    /**
     * Marquer toutes les notifications comme lues.
     */
    public function markAllAsRead(Request $request)
    {
        $tenantManager = app(\App\Services\TenantManager::class);
        $companyId = $tenantManager->getCompanyId();
        $branchId  = $tenantManager->getBranchId();

        Notification::where('company_id', $companyId)
            ->where(function($q) use ($branchId) {
                $q->whereNull('branch_id')->orWhere('branch_id', $branchId);
            })
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues.']);
    }
}
