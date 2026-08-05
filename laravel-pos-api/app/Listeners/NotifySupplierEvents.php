<?php
namespace App\Listeners;
use App\Events\Supplier\SupplierCreated;
use App\Services\NotificationService;
use App\Services\RealtimeBroadcastService;

class NotifySupplierEvents
{
    public function handleSupplierCreated(SupplierCreated $event): void
    {
        $supplier = $event->supplier;
        $actor = $event->actor;
        $branchId = $actor->branch_id;
        if (!$branchId) return;
        NotificationService::notifyBranchUsers(
            companyId: $supplier->company_id,
            branchId: $branchId,
            targetRoles: ['admin', 'gerant'],
            requiredPermission: 'suppliers.create',
            type: 'supplier_created',
            title: '🏢 Nouveau fournisseur',
            message: "{$actor->name} a ajouté le fournisseur \"{$supplier->name}\".",
            priority: 'info',
            data: ['supplier_id' => $supplier->id, 'supplier_name' => $supplier->name],
            actorId: $actor->id,
            targetRoute: 'suppliers',
        );

        // SSE — Signal temps réel : nouveau fournisseur
        RealtimeBroadcastService::push(
            eventType: 'supplier_created',
            companyId: $supplier->company_id,
            branchId:  $branchId,
            payload:   ['supplier_id' => $supplier->id, 'supplier_name' => $supplier->name],
            actorId: $actor->id
        );
    }

    public function subscribe($events): array {
        return [SupplierCreated::class => 'handleSupplierCreated'];
    }
}
