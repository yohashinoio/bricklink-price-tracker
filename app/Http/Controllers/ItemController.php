<?php

namespace App\Http\Controllers;

use App\Models\Color;
use App\Models\Item;
use App\Models\PriceGuide;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param int $page_number Start from 1.
     */
    public function index(int $page_number)
    {
        $items_per_page = auth()->user()->setting->items_per_page;
        $total_pages = intdiv(auth()->user()->items()->count(), $items_per_page + 1) + 1;

        // Calculate the range of items to be displayed.
        $begin_pos = (($page_number - 1) * $items_per_page) + 1;
        $end_pos = $begin_pos + $items_per_page - 1;

        $watched_items = auth()->user()->watchedItems()->whereBetween("position", [$begin_pos, $end_pos])->with(["desiredCondition"])->get();

        // Get items from watched items.
        $items = [];
        foreach ($watched_items as $watched_item) {
            array_push($items, $watched_item->item()->with(["itemInfo", "priceGuide.priceDetails"])->first());
        }

        $colors = [];
        foreach ($items as $item) {
            if ($item->color_id)
                array_push($colors, Color::where('color_id', $item->color_id)->first());
        }

        return Inertia::render(
            "Item/Index",
            [
                "items" => $items,
                "watched_items" => $watched_items,
                "colors" => $colors,
                "total_pages" => $total_pages,
                "current_page" => $page_number,
                "items_per_page" => $items_per_page,
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Item $item)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        auth()->user()->items()->detach($item->id);
    }
}
