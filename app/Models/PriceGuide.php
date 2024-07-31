<?php

namespace App\Models;

use App\Services\BricklinkApiService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

function getMinPrice(array $price_details): float
{
    return min(array_column($price_details, 'unit_price'));
}

function getMaxPrice(array $price_details): float
{
    return max(array_column($price_details, 'unit_price'));
}

class PriceGuide extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',

        'min_price',
        'min_price_of_new',
        'min_price_of_used',

        'max_price',
        'max_price_of_new',
        'max_price_of_used',

        'avg_price_of_new',
        'avg_price_of_used',

        'unit_quantity_of_new',
        'unit_quantity_of_used',

        'currency_code',

        'total_quantity_of_new',
        'total_quantity_of_used',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function priceDetails(): HasMany
    {
        return $this->hasMany(PriceDetail::class);
    }

    public function updateUsingApi()
    {
        $item = $this->item;

        $price_guide_response = app(BricklinkApiService::class)->getPriceGuide($item);

        $price_guide_resp_of_new = $price_guide_response['N'];
        $price_guide_resp_of_used = $price_guide_response['U'];

        $price_details_of_new = $price_guide_resp_of_new->data->price_detail;
        $price_details_of_used = $price_guide_resp_of_used->data->price_detail;

        $this->update(self::createFieldArray($item, $price_guide_resp_of_new, $price_guide_resp_of_used));

        PriceDetail::where('price_guide_id', $this->id)->delete();
        self::createPriceDetails($this, $price_details_of_new, $price_details_of_used);
    }

    public static function createUsingApi(Item $item): self
    {
        $price_guide_response = app(BricklinkApiService::class)->getPriceGuide($item);

        $price_guide_resp_of_new = $price_guide_response['N'];
        $price_guide_resp_of_used = $price_guide_response['U'];

        $price_details_of_new = $price_guide_resp_of_new->data->price_detail;
        $price_details_of_used = $price_guide_resp_of_used->data->price_detail;

        $price_guide = self::create(self::createFieldArray($item, $price_guide_resp_of_new, $price_guide_resp_of_used));

        self::createPriceDetails($price_guide, $price_details_of_new, $price_details_of_used);

        return $price_guide;
    }

    protected static function createFieldArray(Item $item, $price_guide_of_new, $price_guide_of_used): array
    {
        $price_details_of_new = $price_guide_of_new->data->price_detail;
        $price_details_of_used = $price_guide_of_used->data->price_detail;

        $min_price_of_new = getMinPrice($price_details_of_new);
        $min_price_of_used = getMinPrice($price_details_of_used);
        $min_price = min($min_price_of_new, $min_price_of_used);

        $max_price_of_new = getMaxPrice($price_details_of_new);
        $max_price_of_used = getMaxPrice($price_details_of_used);
        $max_price = max($max_price_of_new, $max_price_of_used);

        return [
            'item_id' => $item->id,

            'min_price' => $min_price,
            'min_price_of_new' => $min_price_of_new,
            'min_price_of_used' => $min_price_of_used,

            'max_price' => $max_price,
            'max_price_of_new' => $max_price_of_new,
            'max_price_of_used' => $max_price_of_used,

            'avg_price_of_new' => $price_guide_of_new->data->avg_price,
            'avg_price_of_used' => $price_guide_of_used->data->avg_price,

            'unit_quantity_of_new' => $price_guide_of_new->data->unit_quantity,
            'unit_quantity_of_used' => $price_guide_of_used->data->unit_quantity,

            'currency_code' => $price_guide_of_new->data->currency_code,

            'total_quantity_of_new' => $price_guide_of_new->data->total_quantity,
            'total_quantity_of_used' => $price_guide_of_used->data->total_quantity,
        ];
    }

    protected static function createPriceDetails(PriceGuide $price_guide, array $price_details_of_new, array $price_details_of_used)
    {
        $createPriceDetails = function (PriceGuide $price_guide, array $price_details, string $new_or_used) {
            foreach ($price_details as $pd) {
                PriceDetail::create([
                    'price_guide_id' => $price_guide->id,
                    'new_or_used' => $new_or_used,
                    'quantity' => $pd->quantity,
                    'unit_price' => $pd->unit_price,
                    'shipping_available' => $pd->shipping_available,
                ]);
            }
        };

        $sortPriceDetails = function (array $price_details) {
            $unit_prices = array_column($price_details, 'unit_price');
            array_multisort(
                $unit_prices,
                $price_details
            );
        };

        $sortPriceDetails($price_details_of_new);
        $createPriceDetails($price_guide, $price_details_of_new, 'N');

        $sortPriceDetails($price_details_of_used);
        $createPriceDetails($price_guide, $price_details_of_used, 'U');
    }
}
