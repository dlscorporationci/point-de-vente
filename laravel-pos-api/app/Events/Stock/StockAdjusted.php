<?php
namespace App\Events\Stock;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
class StockAdjusted {
    use Dispatchable;
    public function __construct(
        public readonly int $companyId,
        public readonly int $branchId,
        public readonly int $productId,
        public readonly string $productName,
        public readonly float $quantity,
        public readonly string $description,
        public readonly User $actor
    ) {}
}
