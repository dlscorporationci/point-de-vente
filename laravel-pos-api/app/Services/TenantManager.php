<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Branch;

class TenantManager
{
    protected ?Company $currentCompany = null;
    protected ?Branch $currentBranch = null;
    protected bool $isResolvingUser = false;

    /**
     * Set the active company.
     */
    public function setCompany(Company $company): void
    {
        $this->currentCompany = $company;
    }

    /**
     * Get the active company.
     */
    public function getCompany(): ?Company
    {
        return $this->currentCompany;
    }

    /**
     * Get the active company ID.
     */
    public function getCompanyId(): ?int
    {
        if ($this->currentCompany) {
            return $this->currentCompany->id;
        }

        // Anti-ré-entrance : évite la boucle de récursion infinie Sanctum -> User -> Scope -> TenantManager -> Sanctum
        if ($this->isResolvingUser) {
            $compId = \Illuminate\Support\Facades\DB::table('companies')->where('status', 'active')->value('id')
                ?: \Illuminate\Support\Facades\DB::table('companies')->value('id');
            return $compId ? (int)$compId : 1;
        }

        try {
            $this->isResolvingUser = true;
            $user = auth('sanctum')->user() ?: auth()->user();
            $this->isResolvingUser = false;

            if ($user && $user->company_id) {
                return (int)$user->company_id;
            }

            $compId = \Illuminate\Support\Facades\DB::table('companies')->where('status', 'active')->value('id')
                ?: \Illuminate\Support\Facades\DB::table('companies')->value('id');
            return $compId ? (int)$compId : 1;
        } catch (\Throwable $e) {
            $this->isResolvingUser = false;
            return 1;
        }
    }

    /**
     * Set the active branch.
     */
    public function setBranch(Branch $branch): void
    {
        $this->currentBranch = $branch;
    }

    /**
     * Get the active branch.
     */
    public function getBranch(): ?Branch
    {
        return $this->currentBranch;
    }

    /**
     * Get the active branch ID.
     */
    public function getBranchId(): ?int
    {
        return $this->currentBranch?->id;
    }
}
