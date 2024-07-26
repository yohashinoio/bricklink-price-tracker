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

    public function getPriceGuide(string $itemType, string $itemNo)
    {
        $response = $this->client->get("items/$itemType/$itemNo/price");
        return json_decode($response->getBody()->getContents());
    }
}
