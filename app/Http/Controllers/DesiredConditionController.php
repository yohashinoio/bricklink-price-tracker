<?php

namespace App\Http\Controllers;

use App\Http\Requests\DesiredConditionRequest;
use App\Models\DesiredCondition;
use App\Models\WatchedItem;
use Illuminate\Http\Request;

class DesiredConditionController extends Controller
{
    public function updateOrStore(DesiredConditionRequest $request, int $item_id)
    {
        $validated = $request->validated();

        $watched_item = auth()->user()->watchedItems()->where('item_id', $item_id)->first();

        $watched_item->desiredCondition()->updateOrCreate(['watched_item_id' => $watched_item->id], [
            'unit_price' => $validated['unit_price'],
            'quantity' => $validated['quantity'],
            'shipping_available' => $validated['shipping_available'],
            'include_used' => $validated['include_used'],
        ]);
    }
}
