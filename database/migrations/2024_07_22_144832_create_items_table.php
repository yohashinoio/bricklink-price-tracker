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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string("type")->comment("The type of the item");
            $table->string("no")->comment("Identification number of the item");
            $table->integer("color_id")->nullable()->comment("The color of the item");
            // N = New, U = Used
            // I tried using enum, but it was buggy with automatic insertion, etc., so I stopped.
            $table->string("new_or_used")->comment("Whether the item is new or used");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
