# Nowa porada bezpieczeństwa wywala job Lint niezależnie od zmiany w PR

- Data: 2026-10-28
- Kontekst: PR #5 (zmiany tylko w dokumentacji/konfiguracji); job `Lint` czerwony na kroku `composer audit`
- Typ: pułapka

## Co się stało
`composer audit` w CI zgłosił CVE-2026-45070 dla `symfony/mime` < 7.4.22 (porada opublikowana w dniu PR). `composer.lock` miał v7.4.19, więc Lint padał na każdym PR, także bez zmian w kodzie.

## Wniosek / reguła na przyszłość
Czerwony `composer audit` na PR bez zmian zależności to dryf bazy porad, nie błąd PR. Napraw `composer update <pakiet> --with-dependencies` w obrębie `7.4.*` (bez zmiany `composer.json`), osobnym commitem `fix(deps)`. Nie dodawaj wyjątków/ignore dla porad.

## Jak zweryfikować
`composer audit` oraz `composer qa`.
