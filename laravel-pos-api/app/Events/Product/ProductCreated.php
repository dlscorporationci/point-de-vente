<?php
namespace App\Events\Product;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
class ProductCreated {
    use Dispatchable;
    public function __construct(public readonly Product $product, public readonly User $actor) {}
}
