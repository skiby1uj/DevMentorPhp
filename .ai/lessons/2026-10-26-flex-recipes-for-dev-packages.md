# Recepty Flex dla pakietów dev mogą zepsuć prod

- Data: 2026-10-26
- Kontekst: [.ai/runs/2026-10-26-ci-pull-request-pipeline.md](../runs/2026-10-26-ci-pull-request-pipeline.md)
- Typ: pułapka

## Co się stało
`composer require --dev testcontainers/testcontainers` ściągnęło `php-http/discovery`, a jego recepta dodała `config/packages/http_discovery.yaml` rejestrujący usługę z klasą pakietu dostępnego tylko w dev. Konfiguracja jest ładowana także w `prod` (`composer install --no-dev`).
Drugi drobiazg: `composer.json` pozwala na PHP 8.2, więc typowane stałe klas (`const string`, PHP 8.3) w testach/narzędziach łamią PHPStan i środowiska 8.2.

## Wniosek / reguła na przyszłość
Po każdym `composer require --dev` sprawdź `git status` pod kątem plików dodanych przez recepty w `config/` i usuń te, które odwołują się do pakietów dev. Nie używaj składni nowszej niż `php` z `composer.json`.

## Jak zweryfikować
`git status --short config/`; `composer stan`; przy `APP_ENV=prod` `bin/console cache:warmup`.
