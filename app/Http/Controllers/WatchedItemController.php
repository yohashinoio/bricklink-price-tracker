<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemRequest;
use App\Http\Requests\PositionRequest;
use App\Models\Item;
use App\Models\ItemInfo;
use App\Models\WatchedItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WatchedItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(ItemRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated) {
            $item_info = ItemInfo::updateOrCreateUsingApi($validated['type'], $validated['no']);

            $item = Item::firstOrCreateWithPriceGuide($validated, $item_info);

            $max_position = auth()->user()->watchedItems()->max('position');

            if ($max_position === null) {
                $position = 1;
            } else {
                $position = $max_position + 1;
            }

            // Link items and users.
            // syncWithoutDetaching can be used to sync items without removing relationships to other items which are already in sync.
            $request->user()->items()->syncWithoutDetaching([$item->id => ['position' => $position]]);
        });
    }

    public function updatePosition(PositionRequest $request, int $watched_item_id)
    {
        $validated = $request->validated();

        $watched_items = auth()->user()->watchedItems();

        $target = $watched_items->find($watched_item_id);

        $target->position = $validated['position'];
        $target->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(WatchedItem $watchedItem)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WatchedItem $watchedItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WatchedItem $watchedItem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WatchedItem $watchedItem)
    {
        //
    }
}
