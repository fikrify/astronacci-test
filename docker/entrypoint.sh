#!/bin/sh
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

if ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --force
fi

DB_PATH="${DB_DATABASE:-/app/database/vouchers.db}"
mkdir -p "$(dirname "$DB_PATH")"
touch "$DB_PATH"

php artisan migrate --force

exec "$@"