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
        // Join table
        Schema::create('watched_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained("users")->cascadeOnDelete();
            $table->foreignId("item_id")->constrained("items")->cascadeOnDelete();
            $table->integer("position")->comment("Position on front-end");
            $table->timestamps();
        });

        Schema::create('desired_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('watched_item_id')->constrained('watched_items')->cascadeOnDelete();
            $table->decimal('unit_price')->comment('Price of the item in the desired condition');
            $table->integer('quantity')->comment('Quantity of the item in the desired condition');
            $table->boolean('shipping_available');
            $table->boolean('include_used');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('desired_conditions');
        Schema::dropIfExists('watched_items');
    }
};
