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
     */
    public function index()
    {
        $items = auth()->user()->items()->with(["itemInfo", "priceGuide.priceDetails"])->get();

        $colors = [];

        foreach ($items as $item) {
            if ($item->color_id)
                array_push($colors, Color::where('color_id', $item->color_id)->first());
        }

        return Inertia::render("Item/Index", ["watched_items" => $items, "colors" => $colors]);
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
