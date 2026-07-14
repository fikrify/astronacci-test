#!/bin/sh
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

if ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --force
fi

set_env() {
    key="$1"
    value="$2"

    [ -z "$value" ] && return 0

    if grep -q "^${key}=" .env; then
        sed -i "s|^${key}=.*|${key}=${value}|" .env
    else
        printf '%s=%s\n' "$key" "$value" >>.env
    fi
}

DB_PATH="${DB_DATABASE:-/app/database/vouchers.db}"
mkdir -p "$(dirname "$DB_PATH")"
touch "$DB_PATH"

set_env DB_DATABASE "$DB_PATH"
set_env DB_CONNECTION "$DB_CONNECTION"
set_env APP_ENV "$APP_ENV"
set_env APP_DEBUG "$APP_DEBUG"
set_env APP_URL "$APP_URL"

php artisan migrate --force

exec "$@"
