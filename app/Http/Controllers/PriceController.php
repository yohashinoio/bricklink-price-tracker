<?php

namespace App\Http\Controllers;

use App\Models\PriceGuide;
use Illuminate\Http\Request;

class PriceController extends Controller
{
    public function update(int $item_id)
    {
        $price_guide = PriceGuide::where('item_id', $item_id)->first();

        $price_guide->updateUsingApi();
    }
}
