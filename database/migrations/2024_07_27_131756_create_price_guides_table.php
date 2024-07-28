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
        Schema::create('price_guides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->cascadeOnDelete();

            $table->decimal('min_price');
            $table->decimal('min_price_of_new');
            $table->decimal('min_price_of_used');

            $table->decimal('max_price');
            $table->decimal('max_price_of_new');
            $table->decimal('max_price_of_used');

            $table->decimal('avg_price_of_new');
            $table->decimal('avg_price_of_used');

            $table->integer('unit_quantity_of_new');
            $table->integer('unit_quantity_of_used');

            $table->string('currency_code');

            $table->integer('total_quantity_of_new');
            $table->integer('total_quantity_of_used');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_guides');
    }
};
