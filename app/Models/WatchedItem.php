<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class WatchedItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'desired_condition_id',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function desiredCondition(): HasOne
    {
        return $this->hasOne(DesiredCondition::class);
    }
}
