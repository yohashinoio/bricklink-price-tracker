<?php

namespace App\Providers;

use App\Services\BricklinkApiService;
use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Subscriber\Oauth\Oauth1;
use GuzzleLogMiddleware\LogMiddleware;
use Illuminate\Support\ServiceProvider;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;

class BricklinkApiServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(BricklinkApiService::class, function () {
            $stack = HandlerStack::create();

            $middleware = new Oauth1([
                'consumer_key' => config('services.bricklink.consumer_key'),
                'consumer_secret' => config('services.bricklink.consumer_secret'),
                'token' => config('services.bricklink.token'),
                'token_secret' => config('services.bricklink.token_secret'),
            ]);

            $stack->push($middleware);

            $logger = new Logger('BricklinkApi');
            $logger->pushHandler(new StreamHandler(storage_path('logs/bricklink_api.log')));
            $stack->push(new LogMiddleware($logger));

            $client = new Client([
                'base_uri' => config('services.bricklink.base_uri'),
                'handler' => $stack,
                'auth' => 'oauth',
            ]);

            return new BricklinkApiService($client);
        });
    }
}
