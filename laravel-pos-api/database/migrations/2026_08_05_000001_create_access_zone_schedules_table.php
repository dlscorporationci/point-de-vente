<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('access_zone_schedules')) {
            Schema::create('access_zone_schedules', function (Blueprint $table) {
                $table->id();
                $table->foreignId('access_zone_id')->constrained('access_zones')->onDelete('cascade');
                $table->unsignedTinyInteger('day_of_week')->comment('1=Monday, 7=Sunday');
                $table->time('start_time')->default('08:00:00');
                $table->time('end_time')->default('18:00:00');
                $table->boolean('is_active')->default(true);
                $table->timestamps();

                $table->unique(['access_zone_id', 'day_of_week']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('access_zone_schedules');
    }
};
