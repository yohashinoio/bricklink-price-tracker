<?php

namespace App\Services;

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

    public function getPriceGuide(string $item_type, string $item_no)
    {
        $response = $this->client->get("items/$item_type/$item_no/price");
        return json_decode($response->getBody()->getContents());
    }
}
