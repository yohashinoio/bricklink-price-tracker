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
        Schema::create('price_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('price_guide_id')->constrained()->cascadeOnDelete();
            $table->string('new_or_used');
            $table->integer('quantity');
            $table->decimal('unit_price');
            $table->boolean('shipping_available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_details');
    }
};
