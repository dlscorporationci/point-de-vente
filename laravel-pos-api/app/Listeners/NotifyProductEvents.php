<?php
namespace App\Listeners;
use App\Events\Product\ProductCreated;
use App\Events\Product\ProductUpdated;
use App\Services\NotificationService;

class NotifyProductEvents
{
    public function handleProductCreated(ProductCreated $event): void
    {
        $product = $event->product;
        $actor = $event->actor;
        // Notifier admin/gérant de la company (produit pas lié à une boutique unique)
        // On prend la branch de l'acteur comme référence
        $branchId = $actor->branch_id;
        if (!$branchId) return;
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

    public function handleProductUpdated(ProductUpdated $event): void
    {
        $product = $event->product;
        $actor = $event->actor;
        $changed = $event->changedFields;
        $branchId = $actor->branch_id;
        if (!$branchId) return;
        // Si le prix a changé, c'est une info importante
        $priceChanged = in_array('selling_price', $changed);
        $title = $priceChanged ? '💰 Prix modifié' : '✏️ Produit modifié';
        $msg = $priceChanged
            ? "{$actor->name} a modifié le prix de \"{$product->name}\" → {$product->selling_price} XOF."
            : "{$actor->name} a mis à jour le produit \"{$product->name}\".";
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

    public function subscribe($events): array {
        return [
            ProductCreated::class => 'handleProductCreated',
            ProductUpdated::class => 'handleProductUpdated',
        ];
    }
}
