<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Branch;

class TenantManager
{
    protected ?Company $currentCompany = null;
    protected ?Branch $currentBranch = null;

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
        return $this->currentCompany?->id;
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
