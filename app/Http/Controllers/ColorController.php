<?php

namespace App\Http\Controllers;

use App\Models\Color;
use App\Services\BricklinkApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ColorController extends Controller
{
    public function getKnownColors(string $item_type, string $item_no)
    {
        $kwnown_colors = app(BricklinkApiService::class)->getKnownColors($item_type, $item_no);
        return response()->json($kwnown_colors->data);
    }

    public function detail(int $colod_id)
    {
        return response()->json(Color::where('color_id', $colod_id)->first());
    }
}
