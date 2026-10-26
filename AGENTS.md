# AGENTS.md

Instrukcje dla agentów AI (Codex, Claude Code i inne) pracujących w tym repozytorium.

## Struktura `.ai/` (obowiązkowa)

```
.ai/
├── specs/                  # specyfikacje SDD: YYYY-MM-DD-slug.md (aktywne)
│   ├── implemented/        # specyfikacje w pełni zaimplementowane
│   └── archive/            # porzucone / zastąpione
├── runs/                   # logi autonomicznych przebiegów AI: YYYY-MM-DD-slug.md
├── lessons.md              # indeks wniosków (pamięć długoterminowa)
└── lessons/                # szczegółowe wnioski: YYYY-MM-DD-slug.md (+ _template.md)
```

Katalog `.ai/cezar/` należy do osobnego narzędzia – nie modyfikuj go.
Format nazw: zawsze `YYYY-MM-DD-slug.md`, data = dzień utworzenia, slug w kebab-case (małe litery, cyfry, myślniki).

## Zasady (MUSISZ przestrzegać)

1. **Start pracy:** przeczytaj `.ai/lessons.md` i zastosuj ujęte tam reguły. Jeśli zadanie dotyczy istniejącej specyfikacji, przeczytaj ją w `.ai/specs/`.
2. **Specyfikacja przed kodem (SDD):** przy nowej funkcji lub zmianie nietrywialnej (więcej niż drobna poprawka) najpierw utwórz/zaktualizuj specyfikację w `.ai/specs/YYYY-MM-DD-slug.md` i dopiero potem implementuj. Nie implementuj rzeczy spoza specyfikacji; zmianę zakresu najpierw zapisz w specyfikacji. Wzór: `.ai/specs/README.md`.
3. **Cykl życia specyfikacji:** po zakończeniu i zweryfikowaniu implementacji przenieś plik do `.ai/specs/implemented/` (`git mv`), a porzuconą/zastąpioną do `.ai/specs/archive/` z adnotacją o powodzie. Nigdy nie usuwaj specyfikacji.
4. **Log przebiegu:** każdy autonomiczny przebieg (praca bez bieżącej interakcji użytkownika, w tle, subagent, pętla) zapisuje log w `.ai/runs/YYYY-MM-DD-slug.md` według szablonu z `.ai/runs/README.md`. Zakładaj plik na początku przebiegu i uzupełniaj w trakcie; zapisuj również porażki i niezweryfikowane elementy.
5. **Lessons:** po naprawieniu błędu, po korekcie od użytkownika, po odkryciu pułapki lub gdy coś warto zapamiętać na dłużej – utwórz wpis w `.ai/lessons/YYYY-MM-DD-slug.md` (szablon `_template.md`) **i** dopisz jednolinijkowy wskaźnik do `.ai/lessons.md`. Wpisy mają być konkretne i możliwe do zastosowania; bez sekretów, haseł i danych osobowych.
6. **Spójność:** aktualizuj lub usuwaj nieaktualne wpisy zamiast tworzyć sprzeczne. Linkuj powiązane pliki (spec ↔ run ↔ lesson) względnymi ścieżkami.
7. **Raportowanie:** w podsumowaniu końcowym wskaż, które pliki w `.ai/` utworzono lub zmieniono.
8. Nie commituj ani nie wypychaj zmian bez prośby użytkownika.

## Sposób pracy

Uzupełnia zasady powyżej (nie zastępuje ich); źródło: wskazówki Borisa Cherny'ego dla Claude Code.

9. **Plan złożonych zadań:** zanim zaczniesz zadanie wieloetapowe, zapisz plan implementacji w sekcji „Plan” specyfikacji (zasada 2) i zrealizuj go w jednym przebiegu. Gdy coś idzie nie tak, **zatrzymaj się i przeplanuj** – zaktualizuj plan w specyfikacji zamiast brnąć dalej. Przy dużych zmianach poproś o przegląd planu (drugi agent/subagent lub użytkownik) przed kodowaniem.
10. **Weryfikacja przed „gotowe”:** nie uznawaj zmiany za skończoną bez dowodu, że działa: uruchom testy (`bin/phpunit`), polecenia z `bin/console` lub inną sprawdzalną ścieżkę (dla UI – realne uruchomienie). Przejrzyj własny diff pod kątem błędów i zakresu wykraczającego poza specyfikację. Wyniki (także nieudane) trafiają do logu przebiegu (zasada 4) i podsumowania; nie raportuj niezweryfikowanego jako zrobione.
11. **Błędy naprawiaj samodzielnie:** przy zgłoszeniu błędu lub failującym teście odtwórz problem (logi, test, komunikat błędu) i znajdź przyczynę źródłową bez prowadzenia za rękę. Jeśli pierwsza poprawka okazała się łatką, odrzuć ją i wdróż czystsze rozwiązanie w oparciu o to, czego się dowiedziałeś.
12. **Wnioski po każdej poprawce:** po korekcie od użytkownika lub naprawie błędu zapisz regułę zapobiegającą powtórce zgodnie z zasadą 5; jeśli dotyczy ona stale całego repozytorium, dopisz ją też krótko do tego pliku.
13. **Subagenci i równoległość:** do rozległych poszukiwań, niezależnych podzadań lub dodatkowej mocy obliczeniowej deleguj do subagentów, aby nie zaśmiecać głównego kontekstu. Równoległe, niezależne zadania prowadź w osobnych git worktree (nie w jednym drzewie roboczym); każdy równoległy przebieg ma własny log w `.ai/runs/`.
14. **Powtarzalna praca → skill:** czynność wykonywaną wielokrotnie zamień na skill (`.claude/skills/`, `.agents/skills/`) i zaproponuj to użytkownikowi, zamiast powtarzać ją ręcznie.

15. **100% pokrycia testami jednostkowymi (bezwzględna zasada):** każda nowa funkcja, klasa lub metoda w `src/` MUSI mieć testy jednostkowe (`tests/Unit/`, lustro struktury `src/`) dające **100% pokrycia linii i metod** nowego kodu; bez tego zmiana nie jest „gotowa”, a CI blokuje PR. Brak wyjątków i brak wykluczeń z pokrycia (`@codeCoverageIgnore`, zawężanie `<source>`); jeśli kod trudno przetestować, zmień jego projekt zamiast obniżać próg. Testy integracyjne (`tests/Integration/`, PostgreSQL z testcontainers) uzupełniają testy jednostkowe, ale ich nie zastępują. Weryfikacja: `composer test:coverage` (wymaga PCOV/Xdebug).

## Założenia techniczne – DevMentor

Aplikacja **DevMentor** (platforma mentoringowa; koncepcja produktu: `mentorhub-koncept/docs/`). Poniższe założenia są wiążące; odstępstwo wymaga zapisu w specyfikacji (`.ai/specs/`) i zgody użytkownika.

**Stack**
- Nadrzędna specyfikacja stacku i standardów: `.ai/specs/2026-10-25-devmentor-tech-stack-and-engineering-standards.md` (docelowo PHP 8.5, Symfony 7.4 LTS, PostgreSQL 18). Przy konflikcie z tym plikiem obowiązuje specyfikacja; zmiana stacku wymaga nowego ADR i zgody użytkownika.
- PHP: `declare(strict_types=1)` w nowych plikach. `composer.json` wymaga nadal `>=8.2` (podniesienie do `>=8.4` czeka na środowisko z PHP ≥ 8.4) – nie używaj składni nowszej niż wspiera wersja z `composer.json`.
- Symfony **7.4** (wszystkie pakiety `symfony/*` na `7.4.*`; nie mieszaj wersji minor). Konfiguracja przez atrybuty PHP i autowiring; żadnej konfiguracji w XML/annotations.
- Baza: **PostgreSQL 18** (`server_version: '18'`, obraz w `compose.yaml` i CI; lokalny sandbox ma serwer 17 – różnica jest tolerowana). Trzymaj wersje spójne. Dostęp wyłącznie przez **Doctrine ORM 3 / DBAL** i **Doctrine Migrations**; encje jako atrybuty w `src/<Moduł>/Domain`, implementacje repozytoriów w `src/<Moduł>/Infrastructure` (nie ma już `src/Entity`/`src/Repository`; mapowania per moduł w `config/packages/doctrine.yaml`).
- Front: Twig + AssetMapper + Stimulus/Turbo (bez bundlera Node, chyba że uzgodnione).

**Baza danych i migracje**
- Każda zmiana schematu = migracja: `bin/console make:migration` → przejrzyj SQL → `bin/console doctrine:migrations:migrate`. Nigdy `doctrine:schema:update --force` ani ręczne zmiany schematu.
- Migracje są niezmienne po scaleniu do głównej gałęzi; poprawki robisz nową migracją. Pisz `down()` tam, gdzie to możliwe.
- Korzystaj z typów PostgreSQL świadomie (`jsonb`, `timestamptz`, `uuid`); czasy zapisuj w UTC (`DateTimeImmutable`), strefę stosuj dopiero w prezentacji.
- Operacje wielokrokowe (rezerwacja + płatność) w jednej transakcji; unikaj N+1 (fetch join / `EXTRA_LAZY` świadomie); dodawaj indeksy do kolumn filtrowania i kluczy obcych.
- Sekrety i `DATABASE_URL` tylko w `.env.local`/zmiennych środowiskowych – nie commituj prawdziwych haseł.

**Pula połączeń:** Doctrine DBAL **nie ma własnej puli połączeń** – PHP-FPM tworzy połączenie na żądanie. Pulowanie realizujemy poza aplikacją: **PgBouncer** (tryb `transaction`) przed PostgreSQL. Konsekwencje dla kodu: nie używaj stanu sesji PostgreSQL (`SET`, sesyjne advisory locks – używaj `pg_advisory_xact_lock`, `LISTEN/NOTIFY`); nazwane prepared statements są dozwolone (PgBouncer ≥ 1.21, `max_prepared_statements` > 0); połączenie do migracji kieruj bezpośrednio do bazy, nie przez PgBouncer.

**Architektura kodu**
- Modularny monolit: `src/<Moduł>/{Domain,Application,Infrastructure,UI}` (moduły: Identity, Mentoring, Catalog, Scheduling, Booking, Payments, Sessions, Messaging, Reviews, Notifications, Moderation, Platform, Shared). Granice egzekwuje **Deptrac** (`deptrac.yaml`): Domain → tylko Shared; moduły nie zależą od siebie (komunikacja przez zdarzenia/publiczne interfejsy w Shared).
- Kontrolery cienkie, w `UI`; logika w `Domain`/`Application`. Komendy przez `command.bus` (transakcja w middleware `doctrine_transaction`; **nie wołaj `flush()` ręcznie**), zapytania przez `query.bus`.
- Wstrzykiwanie przez konstruktor; klasy `final`, wartości `final readonly`; czas wyłącznie przez `ClockInterface`; pieniądze jako `App\Shared\Domain\Money` (grosze). Walidacja: Validator/Form, autoryzacja: Voters.
- Zadania asynchroniczne (e-maile, przypomnienia, wypłaty) przez Symfony Messenger z transportem Doctrine.

**Jakość i weryfikacja**
- Bramka jakości: **`composer qa`** (validate, PHP-CS-Fixer `@PER-CS3x0`+`@Symfony`, PHPStan level max, Deptrac, testy jednostkowe) oraz **`composer test:coverage`** (100% pokrycia, zasada 15) i **`composer test:integration`** muszą być zielone przed „gotowe”; `composer cs-fix` naprawia styl. Nie dodawaj `@phpstan-ignore` ani baseline.
- CI (`.github/workflows/ci.yml`, każdy PR): `build` (instalacja prod, warmup, assety, `docker build`), `lint`, `unit` (próg 100%), `integration` (testcontainers + smoke tymczasowej instancji przez `agent-browser`: `composer e2e`). Spec: `.ai/specs/implemented/2026-10-26-ci-pull-request-pipeline.md`.
- Testy: PHPUnit; `tests/Unit` (bez I/O, kernela i bazy) i `tests/Integration` (kernel + PostgreSQL z testcontainers przez `App\Tests\Support\TestDatabase`; bez Dockera ustaw `INTEGRATION_DATABASE_URL`). Nowe zachowanie ma test, błąd ma test regresyjny. Testy integracyjne używają bazy `<nazwa>_test` (konfiguracja `when@test`).
- Po zmianie mapowania/migracji uruchom `bin/console doctrine:schema:validate` i potwierdź, że migracja wykonuje się na czystej bazie.
- Język: kod, nazwy klas i komentarze po angielsku; teksty interfejsu przez translator (`translations/`), domyślnie PL.
