# How to run? (with sail)
## Create .env
Copy the `.env.example` and set `BRICKLINK_*`.

## Depends
- Docker

## Command to execute
```bash
$ docker run --rm -u "$(id -u):$(id -g)" -v $(pwd):/var/www/html -w /var/www/html laravelsail/php82-composer:latest composer install --ignore-platform-reqs
$ ./vendor/bin/sail up -d && ./vendor/bin/sail composer install && ./vendor/bin/sail npm i && ./vendor/bin/sail npm run dev
```

If this is your first run, migration is required.

```bash
$ ./vendor/bin/sail artisan migrate --seed
```
