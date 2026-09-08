FROM php:8.5-cli

RUN apt-get update \
    && apt-get install -y --no-install-recommends $PHPIZE_DEPS libpq-dev libsqlite3-dev unzip \
    && docker-php-ext-install -j"$(nproc)" bcmath pdo_pgsql pdo_sqlite \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --no-scripts --no-progress

COPY . .
RUN mkdir -p bootstrap/cache storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs \
    && composer dump-autoload --no-interaction --optimize

EXPOSE 8000

CMD ["sh", "-lc", "php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=8000"]
