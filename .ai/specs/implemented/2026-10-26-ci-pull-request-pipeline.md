# Spec: ci-pull-request-pipeline

- Status: ZAIMPLEMENTOWANA w zakresie weryfikowalnym w sandboxie (2026-10-26); AC5 niezweryfikowane (patrz „Wynik”)
- Rodzic: [standardy inżynieryjne](../engineering-standards.md) (§7 Testy), [platform-foundation](2026-10-26-platform-foundation.md) (istniejący `ci.yml`)
- Cel: każdy PR przechodzi cztery bramki – build, lint, testy jednostkowe (100% pokrycia), testy integracyjne na PostgreSQL z testcontainers wraz ze smoke-testem tymczasowej instancji aplikacji przez `agent-browser`.

## Zakres
1. Workflow `.github/workflows/ci.yml` (PR + push do `main`), zadania równoległe:
   - `build` – `composer install --no-dev` (zoptymalizowany autoloader), `cache:warmup` w `prod`, `asset-map:compile`, `docker build` obrazu produkcyjnego (bez push).
   - `lint` – `composer validate --strict`, `composer audit`, PHP-CS-Fixer, PHPStan, Deptrac, `lint:yaml`, `lint:twig`, `lint:container`.
   - `unit` – `phpunit --testsuite unit` z PCOV + weryfikacja **100%** pokrycia linii/metod/klas (`bin/check-coverage`).
   - `integration` – `phpunit --testsuite integration` (PostgreSQL z testcontainers, migracje na czystej bazie, `doctrine:schema:validate`) oraz `tests/e2e/smoke.sh`: tymczasowa instancja aplikacji (`bin/ephemeral-app`: kontener PG + migracje + `php -S`) testowana przez `agent-browser`.
2. Podział testów: `tests/Unit` (lustro `src/`, bez I/O, bez kernela, bez bazy) i `tests/Integration` (kernel, baza). Zestawy `unit` i `integration` w `phpunit.dist.xml`.
3. Testcontainers: `testcontainers/testcontainers` (dev). Jeden kontener `postgres:18-alpine` na proces PHPUnit (`App\Tests\Support\TestDatabase`); `INTEGRATION_DATABASE_URL` pozwala użyć istniejącej bazy zamiast kontenera (środowiska bez Dockera).
4. Skrypty composera: `test:unit`, `test:integration`, `test:coverage`, `e2e`; `qa` = validate, cs, stan, deptrac, test:unit (bez bazy i bez sterownika pokrycia); pokrycie (`test:coverage`, wymaga PCOV/Xdebug) i integracja (Docker/`INTEGRATION_DATABASE_URL`) osobno.
5. `AGENTS.md`: jednoznaczna zasada 100% pokrycia jednostkowego dla każdej nowej funkcji; spójna aktualizacja `engineering-standards.md` §7.7.
6. Testy jednostkowe dla całego istniejącego kodu (`src/`) – 100% pokrycia.

## Poza zakresem
Playwright/axe (osobna spec), Infection, ParaTest, deploy, wymaganie statusów w ustawieniach repozytorium GitHub (branch protection – robi to właściciel repo).

## Kryteria akceptacji
- AC1: `composer test:coverage` kończy się sukcesem tylko przy 100% pokrycia `src/` (sprawdzone lokalnie z PCOV, także negatywnie).
- AC2: `composer qa` zielone lokalnie (lint + testy jednostkowe).
- AC3: zestaw `integration` przechodzi lokalnie przez `INTEGRATION_DATABASE_URL` (PG17).
- AC4: `ci.yml` jest poprawnym YAML; skrypty powłoki przechodzą `bash -n`.
- AC5 (**niezweryfikowane w sandboxie**: brak Dockera i GitHub Actions): ścieżka testcontainers, `docker build`, `agent-browser` w CI.

## Plan
1. Zależność `testcontainers/testcontainers`; przeniesienie istniejących testów do `Unit`/`Integration`; konfiguracja PHPUnit.
2. `TestDatabase`, bazowy `DatabaseWebTestCase`, test schematu.
3. `bin/ephemeral-app`, `tests/e2e/smoke.sh`, `bin/check-coverage`.
4. Testy jednostkowe do 100%.
5. Workflow CI, skrypty composera, `AGENTS.md`, standardy.
6. Weryfikacja (`composer qa`, pokrycie, test negatywny), log przebiegu.

## Ryzyka
- Ścieżki Docker/agent-browser nieweryfikowalne tutaj – możliwe poprawki po pierwszym biegu CI.
- API `agent-browser` zmienia się między wersjami – wersja przypięta w workflow.

## Wynik
Zweryfikowane lokalnie (PHP 8.2.35, PCOV 1.0.11 z paczki Debiana, PG17 przez `INTEGRATION_DATABASE_URL` z `.env`):
- AC1 ✔ `composer test:coverage`: 13 testów, 100% linii i metod; test negatywny – tymczasowy, nietestowany plik w `src/` → `bin/check-coverage` kończy się kodem 1 (plik usunięty).
- AC2 ✔ `composer qa` (validate, cs, PHPStan max, Deptrac, testy jednostkowe).
- AC3 ✔ `composer test:integration`: 5 testów (health, strona główna, `doctrine:schema:validate`, `migrations:up-to-date`).
- AC4 ✔ `lint:yaml` na `ci.yml` (składnia), `bash -n tests/e2e/smoke.sh`.
- `bin/ephemeral-app`: uruchomiony na lokalnej bazie – migracje (prod), `asset-map:compile`, serwer; `/health/ready` 200, strona główna renderuje się; proces zatrzymany po SIGTERM.

NIE zweryfikowane (brak Dockera, GitHub Actions, bibliotek systemowych Chrome): start kontenera przez testcontainers, `docker build`, `agent-browser` (Chrome nie startuje w sandboxie – brak `libnspr4`; zainstalowano agent-browser 0.39.4, a komendy sprawdzono z jego README), cały workflow w GitHub Actions. Możliwe poprawki po pierwszym biegu CI. Ustawienie wymaganych statusów (branch protection) należy do właściciela repozytorium.

Zmiany poza planem: usunięto `config/packages/http_discovery.yaml` (recepta `php-http/discovery` rejestrowała usługę z pakietu dev w konfiguracji ładowanej także w prod); przepięto testy do `tests/Unit` i `tests/Integration`; `HealthController`/`DefaultController` dostały testy jednostkowe (wcześniej pokrywały je tylko testy funkcjonalne).
