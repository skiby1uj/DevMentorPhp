# Spec 0: platform-foundation

- Status: ZAIMPLEMENTOWANA w zakresie weryfikowalnym w sandboxie (2026-10-26); elementy niezweryfikowane wymienione w „Wynik”
- Rodzic: [tech-stack i standardy](2026-10-25-devmentor-tech-stack-and-engineering-standards.md) (§12–14, spec nr 0)
- Cel: szkielet, na którym kolejne specyfikacje (1–10) mogą powstawać bez zmiany reguł: moduły z granicami egzekwowanymi w CI, bramki jakości, magistrale komend/zapytań, health-check, środowisko lokalne.

## Ograniczenia środowiska (wpływ na zakres)
Sandbox ma PHP **8.2.35**, PostgreSQL **17** (lokalny serwer), **brak Dockera i Redisa**. Dlatego:
- Podniesienie wymagania PHP do `>=8.4` (Q5) i uruchomienie FrankenPHP/PgBouncer/Redis **nie mogą być tu zweryfikowane** – pliki konfiguracyjne powstają, ale oznaczone jako niezweryfikowane; podniesienie `composer.json` jest odłożone do środowiska z PHP ≥ 8.4.
- Testy integracyjne działają na lokalnym PG17; CI używa PG18.

## W zakresie
1. Narzędzia QA (dev): PHPStan (level max + rozszerzenia Symfony/Doctrine/PHPUnit), PHP-CS-Fixer (`@PER-CS3x0` + `@Symfony`), Deptrac; skrypty `composer qa`, `cs`, `stan`, `deptrac`, `test`.
2. Szkielet modułów `src/<Module>/{Domain,Application,Infrastructure,UI}` dla modułów z §3.1 spec nadrzędnej + `Shared`; reguły Deptrac (warstwy i brak zależności między modułami poza `Shared`).
3. Shared kernel: `Money` (grosze + waluta, `final readonly`) jako wzorcowy value object z testami jednostkowymi.
4. Magistrale Messengera `command.bus` (middleware `doctrine_transaction`) i `query.bus`.
5. Endpoint `GET /health/live` i `GET /health/ready` (ready sprawdza połączenie z bazą) + test funkcjonalny.
6. Środowisko: `compose.yaml` (PG18, PgBouncer transaction, Redis, Mailpit), `Dockerfile` FrankenPHP (niezweryfikowane), PG18 w CI.
7. CI: GitHub Actions (composer validate/audit, cs, stan, deptrac, lint:*, schema validate, migracje na czystej bazie, phpunit) z PG18.
8. Uzgodnienie `AGENTS.md` (spec nadrzędna §16), usunięcie nieużywanych katalogów szkieletu, jeśli kolidują z nową strukturą.

## Poza zakresem
Podniesienie PHP w `composer.json`, Mercure, Scheduler, outbox, Stripe/LiveKit, TypeScript (Q6), Infection, Playwright – osobne specyfikacje / środowisko z PHP ≥ 8.4.

## Kryteria akceptacji
- AC1: `composer qa` przechodzi lokalnie (cs, stan, deptrac, phpunit).
- AC2: Deptrac wykrywa naruszenie (test negatywny wykonany ręcznie i opisany w logu).
- AC3: `GET /health/ready` zwraca 200 przy działającej bazie i 503 przy niedostępnej (test).
- AC4: `doctrine:schema:validate` i `doctrine:migrations:migrate` na czystej bazie zielone.
- AC5: Workflow CI jest poprawnym YAML (lint) – **nieuruchomiony** (brak GitHub Actions w sandboxie).

## Plan
1. composer require --dev: phpstan (+symfony, doctrine, phpunit), friendsofphp/php-cs-fixer, qossmic/deptrac.
2. Konfiguracje: `phpstan.neon`, `.php-cs-fixer.dist.php`, `deptrac.yaml`, skrypty composera.
3. Moduły + `Shared\Domain\Money` + testy.
4. `messenger.yaml` – magistrale; `Platform` UI health + test.
5. Compose/Dockerfile/CI.
6. Uruchomić pełny `composer qa`, test negatywny Deptrac, migracje; poprawić.
7. Zaktualizować `AGENTS.md`, README, lessons; przenieść spec do `implemented/` jeśli AC1–AC4 spełnione (AC5/Docker – adnotacja).

## Wynik
Zweryfikowane (sandbox: PHP 8.2.35, PG17):
- AC1 ✔ `composer qa`: validate, cs, PHPStan level max (0 błędów), Deptrac (0 naruszeń), PHPUnit 12 testów / 22 asercje.
- AC2 ✔ ręczny test negatywny: `Booking\Application` → `Payments\Domain` daje `DependsOnDisallowedLayer`; plik próbny usunięty.
- AC3 ✔ `/health/ready` 200 (test funkcjonalny) i 503 (test jednostkowy z Connection rzucającym wyjątek).
- AC4 ✔ `doctrine:migrations:migrate` na świeżej bazie `_test` i `doctrine:schema:validate` OK; `lint:yaml`, `lint:twig`, `lint:container` OK.

NIE zweryfikowane (brak środowiska): workflow CI (AC5 – składnia YAML OK, bieg nieuruchomiony), `Dockerfile` FrankenPHP (nie zbudowany), PgBouncer/Redis w `compose.yaml` (nie uruchomione; obraz `edoburu/pgbouncer` i tagi do potwierdzenia), działanie na PostgreSQL 18 (lokalnie 17), PHP ≥ 8.4.

Odłożone: podniesienie `composer.json` do PHP `>=8.4` (Q5), Mercure, Scheduler, outbox, TypeScript (Q6).
Zmiany poza planem: dodano `name`/`description` w `composer.json` (wymagane przez `validate --strict`), uproszczono `tests/bootstrap.php` (PHPStan), przeniesiono `DefaultController` do `Platform/UI`.
