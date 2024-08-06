<?php

namespace App\Http\Controllers;

use App\Http\Requests\SettingRequest;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Update the specified resource in storage.
     */
    public function update(SettingRequest $request)
    {
        $validated = $request->validated();

        auth()->user()->setting()->update($validated);
    }
}
