# Lessons – indeks

Pamięć długoterminowa projektu. **Przeczytaj ten plik przed rozpoczęciem pracy.**
Szczegółowe wpisy trafiają do `.ai/lessons/YYYY-MM-DD-slug.md`; tutaj trzymamy tylko jednolinijkowe wskazówki z linkiem.

## Jak dodać wpis
1. Utwórz `.ai/lessons/YYYY-MM-DD-slug.md` (szablon: `.ai/lessons/_template.md`).
2. Dodaj poniżej jedną linię: `- [YYYY-MM-DD] **Temat** – wniosek w jednym zdaniu → [plik](lessons/YYYY-MM-DD-slug.md)`.
3. Jeśli wniosek unieważnia starszy – popraw lub usuń stary wpis (nie zostawiaj sprzeczności).

## Wpisy
<!-- najnowsze na górze -->
- [2026-10-28] **composer audit w CI** – nowa porada dla pakietu psuje Lint na każdym PR; zaktualizuj pakiet w obrębie `7.4.*` zamiast ignorować → [plik](lessons/2026-10-28-composer-audit-advisory-fails-lint.md)
- [2026-10-26] **Recepty Flex dla pakietów dev** – po `composer require --dev` usuń pliki `config/` z recept odwołujące się do pakietów dev; trzymaj się składni PHP z `composer.json` → [plik](lessons/2026-10-26-flex-recipes-for-dev-packages.md)
- [2026-10-25] **PgBouncer** – ograniczenie dotyczy stanu sesji, nie prepared statements (od 1.21) → [plik](lessons/2026-10-25-pgbouncer-prepared-statements.md)
