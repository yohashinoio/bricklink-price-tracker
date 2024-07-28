<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PriceGuide extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'currency_code',
        'total_quantity',
    ];

    public function priceDetails(): HasMany
    {
        return $this->hasMany(PriceDetail::class);
    }
}
