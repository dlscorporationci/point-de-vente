<?php
namespace App\Listeners;
use App\Events\Product\ProductCreated;
use App\Events\Product\ProductUpdated;
use App\Services\NotificationService;
use App\Services\RealtimeBroadcastService;

class NotifyProductEvents
{
    public function handleProductCreated(ProductCreated $event): void
    {
        $product = $event->product;
        $actor = $event->actor;

        $branchId = $actor->branch_id;
        if ($branchId) {
            NotificationService::notifyBranchUsers(
                companyId: $product->company_id,
                branchId: $branchId,
                targetRoles: ['admin', 'gerant'],
                requiredPermission: 'products.create',
                type: 'product_created',
                title: '🆕 Nouveau produit',
                message: "{$actor->name} a créé le produit \"{$product->name}\" (SKU: {$product->sku}).",
                priority: 'info',
                data: ['product_id' => $product->id, 'product_name' => $product->name],
                actorId: $actor->id,
                targetRoute: 'products',
            );
        }

        // SSE — Signal temps réel : produit créé (company-wide, tous les branches)
        RealtimeBroadcastService::pushCompanyWide(
            eventType: 'product_created',
            companyId: $product->company_id,
            payload:   [
                'product_id'   => $product->id,
                'product_name' => $product->name,
                'sku'          => $product->sku,
            ],
            actorId: $actor->id
        );
    }

    public function handleProductUpdated(ProductUpdated $event): void
    {
        $product = $event->product;
        $actor = $event->actor;
        $changed = $event->changedFields;
        $branchId = $actor->branch_id;

        $priceChanged = in_array('selling_price', $changed);
        $title = $priceChanged ? '💰 Prix modifié' : '✏️ Produit modifié';
        $msg = $priceChanged
            ? "{$actor->name} a modifié le prix de \"{$product->name}\" → {$product->selling_price} XOF."
            : "{$actor->name} a mis à jour le produit \"{$product->name}\".";

        if ($branchId) {
            NotificationService::notifyBranchUsers(
                companyId: $product->company_id,
                branchId: $branchId,
                targetRoles: ['admin', 'gerant'],
                requiredPermission: 'products.update',
                type: 'product_updated',
                title: $title,
                message: $msg,
                priority: $priceChanged ? 'important' : 'info',
                data: ['product_id' => $product->id, 'changed' => $changed],
                actorId: $actor->id,
                targetRoute: 'products',
            );
        }

        // SSE — Signal temps réel : produit modifié (company-wide)
        RealtimeBroadcastService::pushCompanyWide(
            eventType: 'product_updated',
            companyId: $product->company_id,
            payload:   [
                'product_id'    => $product->id,
                'product_name'  => $product->name,
                'selling_price' => $product->selling_price,
                'changed_fields'=> $changed,
                'price_changed' => $priceChanged,
            ],
            actorId: $actor->id
        );
    }

    public function subscribe($events): array {
        return [
            ProductCreated::class => 'handleProductCreated',
            ProductUpdated::class => 'handleProductUpdated',
        ];
    }
}
