<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DesiredCondition extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'unit_price',
        'quantity',
        'shipping_available',
        'include_used',
    ];
}
