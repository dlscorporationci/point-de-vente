<?php
namespace App\Listeners;
use App\Events\Customer\CustomerCreated;
use App\Services\NotificationService;
use App\Services\RealtimeBroadcastService;

class NotifyCustomerEvents
{
    public function handleCustomerCreated(CustomerCreated $event): void
    {
        $customer = $event->customer;
        $actor = $event->actor;
        $branchId = $actor->branch_id ?? $customer->branch_id;
        if (!$branchId) return;
        // Notification légère uniquement pour admin/gérant
        NotificationService::notifyBranchUsers(
            companyId: $customer->company_id,
            branchId: $branchId,
            targetRoles: ['admin', 'gerant'],
            requiredPermission: 'customers.view',
            type: 'customer_created',
            title: '👤 Nouveau client',
            message: "{$actor->name} a ajouté le client \"{$customer->name}\".",
            priority: 'info',
            data: ['customer_id' => $customer->id, 'customer_name' => $customer->name],
            actorId: $actor->id,
            targetRoute: 'customers',
        );

        // SSE — Signal temps réel : nouveau client
        RealtimeBroadcastService::push(
            eventType: 'customer_created',
            companyId: $customer->company_id,
            branchId:  $branchId,
            payload:   ['customer_id' => $customer->id, 'customer_name' => $customer->name],
            actorId: $actor->id
        );
    }

    public function subscribe($events): array {
        return [CustomerCreated::class => 'handleCustomerCreated'];
    }
}
