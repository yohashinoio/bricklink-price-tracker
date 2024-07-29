<?php

namespace App\Services;

use App\Models\Item;

class BricklinkApiService
{
    /**
     * @var \GuzzleHttp\Client
     */
    protected $client;

    public function __construct($client)
    {
        $this->client = $client;
    }

    public function getItem(string $item_type, string $item_no)
    {
        $response = $this->client->get("items/$item_type/$item_no");
        return json_decode($response->getBody()->getContents());
    }

    /**
     * @param Item $item
     * @return array
     */
    public function getPriceGuide(Item $item): array
    {
        $responses = [];

        $item_type = $item->itemInfo->type;
        $item_no = $item->itemInfo->no;
        $color_id = $item->color_id;

        foreach (['N', 'U'] as $new_or_used) {
            $query = [
                'new_or_used' => $new_or_used,
            ];

            if ($color_id) {
                $query['color_id'] = $color_id;
            }

            $resp = $this->client->get("items/$item_type/$item_no/price", [
                'query' => $query,
            ]);

            $responses[$new_or_used] = json_decode($resp->getBody()->getContents());
        }

        return $responses;
    }

    /**
     * @param string $item_type
     * @param string $item_no
     */
    public function getKnownColors(string $item_type, string $item_no)
    {

        $response = $this->client->get("items/$item_type/$item_no/colors");
        return json_decode($response->getBody()->getContents());
    }

    /**
     * Use this method for seeding the colors table.
     */
    public function getColorList()
    {

        $response = $this->client->get("colors");
        return json_decode($response->getBody()->getContents());
    }

    public function getItemImage(string $item_type, string $item_no, int|null $color_id)
    {
        $uri = "items/$item_type/$item_no/images";

        if ($color_id) {
            $uri .= "/$color_id";
        }

        $response = $this->client->get($uri);
        return json_decode($response->getBody()->getContents());
    }
}
