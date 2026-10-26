# Production image: FrankenPHP (Caddy) – classic mode first; enable worker mode only after the shared-state audit
# (spec 2026-10-25-devmentor-tech-stack-and-engineering-standards §11). NOT BUILT in the authoring sandbox (no Docker).
FROM dunglas/frankenphp:1-php8.4 AS base
WORKDIR /app
RUN install-php-extensions intl pdo_pgsql opcache zip apcu
ENV APP_ENV=prod

FROM base AS build
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY composer.json composer.lock symfony.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --classmap-authoritative
COPY . .
RUN composer dump-autoload --no-dev --classmap-authoritative \
 && php bin/console asset-map:compile \
 && php bin/console cache:warmup

FROM base AS runtime
COPY --from=build /app /app
USER www-data
