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
        Schema::create('item_infos', function (Blueprint $table) {
            $table->id();
            $table->string("no")->comment("Identification number of the item");
            $table->string("name")->comment("Name of the item");
            $table->string("type")->comment("The type of the item");
            $table->integer("category_id")->comment("The category of the item");
            $table->string("image_url")->comment("The URL of the image of the item");
            $table->string("thumbnail_url")->comment("The URL of the thumbnail of the item");
            $table->decimal("weight")->comment("The weight of the item");
            $table->decimal("dim_x")->comment("The dimension x of the item");
            $table->decimal("dim_y")->comment("The dimension y of the item");
            $table->decimal("dim_z")->comment("The dimension z of the item");
            $table->integer("year_released")->comment("The year the item was released");
            $table->boolean("is_obsolete")->comment("Whether the item is obsolete");
            $table->timestamps();
        });

        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->foreignId("item_info_id")->constrained();
            $table->integer("color_id")->nullable()->comment("The color of the item");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
        Schema::dropIfExists('item_infos');
    }
};
