<?php

namespace App\Models;

use App\Services\BricklinkApiService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ItemInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        'no',
        'name',
        'type',
        'category_id',
        'image_url',
        'thumbnail_url',
        'weight',
        'dim_x',
        'dim_y',
        'dim_z',
        'year_released',
        'is_obsolete',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }

    public static function updateOrCreateWithFetch(string $item_type, string $item_no): self
    {
        $bl_api_service = app(BricklinkApiService::class);

        $item_info = self::find($item_no);

        $info = $bl_api_service->getItem($item_type, $item_no);

        $item_info = self::updateOrCreate(['no' => $item_no], [
            'name' => $info->data->name,
            'type' => $info->data->type,
            'category_id' => $info->data->category_id,
            'image_url' => "https:" . $info->data->image_url,
            'thumbnail_url' => "https:" . $info->data->thumbnail_url,
            'weight' => $info->data->weight,
            'dim_x' => $info->data->dim_x,
            'dim_y' => $info->data->dim_y,
            'dim_z' => $info->data->dim_z,
            'year_released' => $info->data->year_released,
            'is_obsolete' => $info->data->is_obsolete,
        ]);

        return $item_info;
    }
}
