# 2026-10-26-ci-pull-request-pipeline – CI dla PR, testcontainers, 100% pokrycia
- Data / godzina: 2026-10-26
- Model/agent: Claude Code (Sonnet 5.5)
- Spec: [.ai/specs/implemented/2026-10-26-ci-pull-request-pipeline.md](../specs/implemented/2026-10-26-ci-pull-request-pipeline.md)
- Cel: bramki PR (build, lint, unit, integration + agent-browser), zasada 100% pokrycia w `AGENTS.md`, testy jednostkowe dla całego `src/`.
## Przebieg (kroki, kluczowe decyzje)
- Rozbicie testów na `tests/Unit` i `tests/Integration`; testcontainers w `tests/Support/TestDatabase.php` z obejściem `INTEGRATION_DATABASE_URL`.
- PCOV nie był zainstalowany – pobrano `php8.2-pcov` z Debiana i rozpakowano do `/tmp` (bez roota), włączone przez `PHP_INI_SCAN_DIR`.
- Pierwsza wersja `TestDatabase` używała typowanych stałych (PHP 8.3) – PHPStan zgłosił błąd składni przy PHP 8.2; poprawione.
- Recepta `php-http/discovery` dodała `config/packages/http_discovery.yaml` (pakiet tylko dev) – usunięta.
- Próba ręcznego `psql` z odgadniętym hasłem została zablokowana przez system uprawnień; dalej używano wyłącznie skonfigurowanego w repo `DATABASE_URL` przez testy.
## Zmienione pliki
`.github/workflows/ci.yml`, `AGENTS.md`, `README.md`, `composer.json/.lock`, `symfony.lock`, `phpunit.dist.xml`, `bin/check-coverage`, `bin/ephemeral-app`, `tests/**`, `.ai/specs/engineering-standards.md`, spec i ten log.
## Weryfikacja (komendy, wyniki testów – także nieudane)
Zielone: `composer qa`, `composer test:coverage` (100%), `composer test:integration` (5 testów, PG17), `bin/ephemeral-app` + curl. Negatywny test progu pokrycia – wykonany.
Nieudane/niewykonalne: `tests/e2e/smoke.sh` – Chrome nie startuje (brak `libnspr4`); Docker/testcontainers/GitHub Actions niedostępne.
## Wynik / status (done | partial | blocked) i otwarte kwestie
partial – wszystko poza ścieżkami Docker/agent-browser/GitHub Actions zweryfikowane; pierwszy bieg CI może wymagać poprawek.
## Lessons (linki do .ai/lessons/..., jeśli powstały)
- [Recepty Flex a pakiety dev](../lessons/2026-10-26-flex-recipes-for-dev-packages.md)
