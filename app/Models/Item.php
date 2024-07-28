<?php

namespace App\Models;

use App\Services\BricklinkApiService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Log;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_info_id',
        'color_id',
        'new_or_used',
    ];

    public function itemInfo(): BelongsTo
    {
        return $this->belongsTo(ItemInfo::class);
    }

    /**
     * Overrided firstOrCreate method to fetch price guide from Bricklink API.
     */
    public static function firstOrCreateWithPriceGuide(array $values, ItemInfo $item_info): self
    {
        $bl_api_service = app(BricklinkApiService::class);

        $item = self::firstOrCreate([
            'item_info_id' => $item_info->id,
            'color_id' => $values['color_id'],
            'new_or_used' => $values['new_or_used'],
        ]);

        $price_guide_data = $bl_api_service->getPriceGuide($item->itemInfo->type, $item->itemInfo->no);

        $price_guide = PriceGuide::create([
            'item_id' => $item->id,
            'currency_code' => $price_guide_data->data->currency_code,
            'total_quantity' => $price_guide_data->data->total_quantity,
        ]);

        foreach ($price_guide_data->data->price_detail as $pd) {
            PriceDetail::create([
                'price_guide_id' => $price_guide->id,
                'quantity' => $pd->quantity,
                'unit_price' => $pd->unit_price,
                'shipping_available' => $pd->shipping_available,
            ]);
        }

        return $item;
    }
}
