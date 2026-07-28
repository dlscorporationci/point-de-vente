<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

// Events — CashSession
use App\Events\CashSession\CashSessionOpened;
use App\Events\CashSession\CashSessionClosed;
use App\Events\CashSession\CashSessionValidated;
use App\Events\CashSession\CashSessionTransactionAdded;

// Events — Sale
use App\Events\Sale\SaleCreated;
use App\Events\Sale\SaleCancelled;

// Events — Purchase
use App\Events\Purchase\PurchaseCreated;
use App\Events\Purchase\PurchaseReceived;

// Events — Stock
use App\Events\Stock\StockAdjusted;
use App\Events\Stock\StockLow;

// Events — Transfer
use App\Events\Transfer\TransferCreated;
use App\Events\Transfer\TransferApproved;
use App\Events\Transfer\TransferShipped;
use App\Events\Transfer\TransferReceived;
use App\Events\Transfer\TransferRejected;
use App\Events\Transfer\TransferCancelled;

// Events — Product
use App\Events\Product\ProductCreated;
use App\Events\Product\ProductUpdated;

// Events — Customer
use App\Events\Customer\CustomerCreated;

// Events — Supplier
use App\Events\Supplier\SupplierCreated;

// Listeners (Subscribe pattern)
use App\Listeners\NotifyCashSessionEvents;
use App\Listeners\NotifySaleEvents;
use App\Listeners\NotifyPurchaseEvents;
use App\Listeners\NotifyStockEvents;
use App\Listeners\NotifyTransferEvents;
use App\Listeners\NotifyProductEvents;
use App\Listeners\NotifyCustomerEvents;
use App\Listeners\NotifySupplierEvents;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     * On utilise le pattern "subscribe" pour regrouper les événements par domaine.
     */
    protected $listen = [];

    /**
     * Classes abonnées (Subscriber pattern — chaque classe gère plusieurs événements).
     */
    protected $subscribe = [
        NotifyCashSessionEvents::class,
        NotifySaleEvents::class,
        NotifyPurchaseEvents::class,
        NotifyStockEvents::class,
        NotifyTransferEvents::class,
        NotifyProductEvents::class,
        NotifyCustomerEvents::class,
        NotifySupplierEvents::class,
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        parent::boot();
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
