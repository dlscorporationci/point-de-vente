<?php
namespace App\Events\Supplier;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
class SupplierCreated {
    use Dispatchable;
    public function __construct(public readonly Supplier $supplier, public readonly User $actor) {}
}
