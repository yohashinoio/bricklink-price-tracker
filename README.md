# How to run? (with sail)

## Depends
- Git
- Docker

## Command to execute
```bash
$ ./vendor/bin/sail up -d && ./vendor/bin/sail composer install && ./vendor/bin/sail npm i && ./vendor/bin/sail npm run dev
```

If this is your first run, migration is required.

```bash
$ ./vendor/bin/sail artisan migrate --seed
```
