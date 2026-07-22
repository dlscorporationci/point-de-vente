<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('code', 20)->nullable()->unique()->after('name');
        });

        // Générer un code unique pour chaque entreprise existante
        $companies = DB::table('companies')->get();
        foreach ($companies as $company) {
            if (empty($company->code)) {
                $code = $this->generateUniqueCode();
                DB::table('companies')
                    ->where('id', $company->id)
                    ->update(['code' => $code]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('code');
        });
    }

    /**
     * Génère un code unique au format XXXX-XXXX (ex: X8M4-K92P)
     */
    private function generateUniqueCode(): string
    {
        do {
            $part1 = strtoupper(Str::random(4));
            $part2 = strtoupper(Str::random(4));
            $code = "{$part1}-{$part2}";
            $exists = DB::table('companies')->where('code', $code)->exists();
        } while ($exists);

        return $code;
    }
};
