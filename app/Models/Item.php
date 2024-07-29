<?php

namespace App\Models;

use App\Services\BricklinkApiService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Log;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_info_id',
        'color_id',
        'colored_image_url',
    ];

    public function itemInfo(): BelongsTo
    {
        return $this->belongsTo(ItemInfo::class);
    }

    public function priceGuide(): HasOne
    {
        return $this->hasOne(PriceGuide::class);
    }

    /**
     * Overrided firstOrCreate method to fetch price guide from Bricklink API.
     */
    public static function firstOrCreateWithPriceGuide(array $values, ItemInfo $item_info): self
    {
        $bl_api_service = app(BricklinkApiService::class);

        $colored_image_url = null;
        if (isset($values['color_id'])) {
            $colored_image_url = $bl_api_service->getItemImage($item_info->type, $item_info->no, $values['color_id'])->data->thumbnail_url;
        }

        $item = self::firstOrCreate([
            'item_info_id' => $item_info->id,
            'color_id' => $values['color_id'],
            'colored_image_url' => $colored_image_url,
        ]);

        PriceGuide::createUsingApi($item);

        return $item;
    }
}
