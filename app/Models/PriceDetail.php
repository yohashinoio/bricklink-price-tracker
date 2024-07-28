<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'price_guide_id',
        'quantity',
        'unit_price',
        'shipping_available',
    ];

    public function priceGuide(): BelongsTo
    {
        return $this->belongsTo(PriceGuide::class);
    }
}
