<?php

namespace Database\Seeders;

use App\Services\BricklinkApiService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ColorsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $color_list = app(BricklinkApiService::class)->getColorList();

        foreach ($color_list->data as $color) {
            DB::table('colors')->insert([
                'color_id' => $color->color_id,
                'color_name' => $color->color_name,
                'color_code' => $color->color_code,
                'color_type' => $color->color_type,
            ]);
        }
    }
}
