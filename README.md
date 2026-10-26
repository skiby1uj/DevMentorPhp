# DevMentor

Platforma mentoringowa łącząca uczniów z mentorami na płatne sesje 1:1 online. Koncepcja produktu (role, przepływy, ekrany, API, klikalne mockupy) znajduje się w [`mentorhub-koncept/`](mentorhub-koncept/README.md).

## Stack

| Warstwa | Technologia |
|---|---|
| Język / framework | PHP (≥ 8.2 wg `composer.json`), **Symfony 7.4** |
| Baza danych | **PostgreSQL 18** |
| ORM / migracje | **Doctrine ORM 3**, DBAL, Doctrine Migrations |
| Front | Twig, AssetMapper, Stimulus, Turbo |
| Asynchroniczność | Symfony Messenger (transport Doctrine) |
| Poczta (dev) | Mailpit (`compose.override.yaml`) |

## Architektura

```
Przeglądarka ──► Symfony (HTTP Kernel, Security, routing)
                    │
              Controller (cienki)
                    │
        Serwisy aplikacyjne / handlery Messengera
                    │
        Repository ──► Doctrine ORM ──► DBAL ──► [PgBouncer*] ──► PostgreSQL
                                                  * produkcja
```

### Układ katalogów
- `src/<Moduł>/{Domain,Application,Infrastructure,UI}` – modularny monolit (Identity, Mentoring, Catalog, Scheduling, Booking, Payments, Sessions, Messaging, Reviews, Notifications, Moderation, Platform, Shared). Granice pilnuje Deptrac (`deptrac.yaml`).
- `UI` – kontrolery HTTP (cienkie), `Application` – komendy/zapytania i handlery, `Domain` – encje (atrybuty Doctrine), value objects, polityki, `Infrastructure` – repozytoria i adaptery.
- `migrations/` – wersjonowane migracje schematu (Doctrine Migrations).
- `templates/`, `assets/`, `translations/` – widoki Twig, zasoby front-endu, teksty interfejsu.
- `config/` – konfiguracja pakietów (`config/packages/*.yaml`) i tras.
- `tests/` – testy PHPUnit.
- `.ai/` – specyfikacje, logi przebiegów i wnioski dla agentów AI (zob. `AGENTS.md`).

### Zasady architektoniczne
1. **Cienkie kontrolery**, logika domenowa w serwisach; zależności wstrzykiwane konstruktorem.
2. **Baza zmieniana wyłącznie migracjami.** Czasy w UTC (`timestamptz`), transakcje dla operacji wielokrokowych (rezerwacja + płatność).
3. **Pula połączeń:** Doctrine nie pula połączeń; w produkcji umieszczamy **PgBouncer** (tryb `transaction`) przed PostgreSQL, a migracje uruchamiamy bezpośrednio na bazie.
4. **Zadania w tle** (przypomnienia, e-maile, wypłaty) przez Messenger, nie w żądaniu HTTP.
5. **Bezpieczeństwo:** Symfony Security + Voters, CSRF dla formularzy, walidacja Validatorem, sekrety poza repozytorium.

## Uruchomienie lokalne

```bash
composer install
docker compose up -d database          # PostgreSQL (lub własna instancja)
cp .env .env.local                     # ustaw DATABASE_URL w .env.local
bin/console doctrine:database:create --if-not-exists
bin/console doctrine:migrations:migrate
symfony serve                          # lub: php -S 127.0.0.1:8000 -t public
```

Bramka jakości: `composer qa` (validate, style, PHPStan max, Deptrac, testy jednostkowe), `composer test:coverage` (100% pokrycia `src/`, wymaga PCOV/Xdebug), `composer test:integration` (PostgreSQL z testcontainers – wymaga Dockera albo `INTEGRATION_DATABASE_URL`), `composer e2e` (smoke tymczasowej instancji przez `agent-browser`). CI uruchamia to dla każdego PR. Health-checki: `GET /health/live`, `GET /health/ready`.
Specyfikacje: [`.ai/specs/`](.ai/specs/) – w tym [stack i standardy](.ai/specs/2026-10-25-devmentor-tech-stack-and-engineering-standards.md).

## Praca z agentami AI
Reguły dla agentów (stack, migracje, struktura `.ai/`, sposób pracy) są w [`AGENTS.md`](AGENTS.md); `CLAUDE.md` wczytuje ten plik.
