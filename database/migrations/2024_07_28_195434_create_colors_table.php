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
        Schema::create('colors', function (Blueprint $table) {
            $table->id();
            $table->integer("color_id")->comment("The identification number of the color");
            $table->string("color_name")->comment("The name of the color");
            $table->string("color_code")->comment("HTML color code of this color");
            $table->string("color_type")->comment("The name of the color group that this color belongs to");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('colors');
    }
};
