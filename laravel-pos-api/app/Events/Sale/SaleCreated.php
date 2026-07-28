<?php
namespace App\Events\Sale;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
class SaleCreated {
    use Dispatchable;
    public function __construct(
        public readonly Sale $sale,
        public readonly User $actor
    ) {}
}
