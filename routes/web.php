<?php

use App\Http\Controllers\ColorController;
use App\Http\Controllers\DesiredConditionController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\PriceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WatchedItemController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check())
        return redirect(route("items.index"), 301);
    else
        return Inertia::render('Welcome', []);
});

Route::get('/dashboard', function () {
    return redirect(route("items.index"), 301);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

Route::resource("items", ItemController::class)->middleware(["auth", "verified"])->only("index", "store", "destroy");
Route::resource("watched_items", WatchedItemController::class)->middleware(["auth", "verified"])->only("store");

Route::post("prices/{item_id}", [PriceController::class, "update"])->middleware(["auth", "verified"])->name("prices.update");

Route::get("colors/known/{item_type}/{item_no}", [ColorController::class, "getKnownColors"])->middleware(["auth", "verified"])->name("colors.known");
Route::get("colors/detail/{color_id}", [ColorController::class, "detail"])->middleware(["auth", "verified"])->name("colors.detail");

Route::post("desired_conditions/{item_id}", [DesiredConditionController::class, "updateOrStore"])->middleware(["auth", "verified"])->name("desired_conditions.updateOrStore");

Route::post("watched_items/update_position/{watched_item_id}", [WatchedItemController::class, "updatePosition"])->middleware(["auth", "verified"])->name("watched_items.update_position");
