# Standardy inżynieryjne DevMentor (normatywne)

- Status: **OBOWIĄZUJĄCA** – dokument żywy, aktualizowany przy zmianie praktyk
- Utworzona: 2026-10-26
- Pochodzi z: [tech-stack i standardy](2026-10-25-devmentor-tech-stack-and-engineering-standards.md) (uzasadnienia, alternatywy, research) oraz [platform-foundation](implemented/2026-10-26-platform-foundation.md) (to, co już egzekwuje CI)
- Zastosowanie: każdy człowiek i agent AI tworzący kod, konfigurację, migracje, testy i dokumentację w tym repozytorium

Słowa kluczowe: **MUSI** = wymóg bezwzględny (łamanie blokuje merge), **POWINIEN** = domyślna reguła, odstępstwo wymaga uzasadnienia w PR, **MOŻE** = dopuszczalne. Kolumna „Egzekwowanie” wskazuje, co pilnuje reguły: `CI` – automatycznie (`composer qa`), `PR` – przegląd kodu, `plan` – jeszcze nie zautomatyzowane (dodać w odpowiedniej specyfikacji).

Pierwszeństwo: `AGENTS.md` (proces pracy) → ten dokument (standardy) → specyfikacja stacku (uzasadnienia i architektura docelowa) → specyfikacje funkcji. Odstępstwo od standardu: zapis w specyfikacji funkcji lub ADR (`docs/adr/NNNN-slug.md`) oraz zgoda użytkownika.

---

## 1. Proces i organizacja pracy

| # | Reguła | Egz. |
|---|---|---|
| 1.1 | Nietrywialna zmiana MUSI mieć specyfikację w `.ai/specs/` **przed** kodem (SDD); zakres poza specyfikacją wymaga najpierw jej aktualizacji. | PR |
| 1.2 | Zmiana jest „gotowa” dopiero po spełnieniu **Definition of Done** (pkt 1.8). | PR |
| 1.3 | Praca trunk-based: krótkie gałęzie `feat/…`, `fix/…`, `chore/…`, `docs/…`; merge przez PR (squash); brak długowiecznych gałęzi – niedokończone funkcje chowamy za flagą. | PR |
| 1.4 | Commity: Conventional Commits po angielsku w trybie rozkazującym, np. `feat(booking): reject overlapping slots`. Jeden commit = jedna logiczna zmiana. Agenci commitują wyłącznie na prośbę użytkownika. | PR |
| 1.5 | PR POWINIEN mieć ≤ ~400 zmienionych linii (bez generowanych); większe dzielimy. Opis: cel, link do specyfikacji, sposób weryfikacji, ryzyka. | PR |
| 1.6 | Każdy PR wymaga ≥ 1 zatwierdzenia; autor nie zatwierdza własnego PR. Agent AI traktowany jak autor. | PR |
| 1.7 | Lista kontrolna recenzji: spełnia AC specyfikacji · testy sensowne · brak N+1 · autoryzacja i walidacja na wejściu · migracja przejrzana · brak PII/sekretów w logach · a11y i i18n · wpływ na wydajność. | PR |
| 1.8 | **Definition of Done:** kod + testy zielone (`composer qa`) · migracja sprawdzona na czystej bazie · stany loading/empty/error/success obsłużone (dla UI) · a11y sprawdzone · teksty w tłumaczeniach PL/EN · logi/metryki dodane dla nowych przepływów · dokumentacja zaktualizowana · specyfikacja przeniesiona do `implemented/` · wnioski w `.ai/lessons`. | PR |
| 1.9 | Błąd produkcyjny = najpierw test odtwarzający, potem poprawka, potem wpis w `.ai/lessons/`. | PR |

## 2. Architektura

| # | Reguła | Egz. |
|---|---|---|
| 2.1 | Modularny monolit: `src/<Moduł>/{Domain,Application,Infrastructure,UI}`; wspólne elementy tylko w `Shared`. | CI (Deptrac) |
| 2.2 | `Domain` zależy wyłącznie od `Shared` i PHP (oraz atrybutów mapowania Doctrine); `Application` od `Domain`; `Infrastructure`/`UI` od `Application`/`Domain` własnego modułu. | CI (Deptrac) |
| 2.3 | Moduły MUSZĄ NIE zależeć od siebie nawzajem. Komunikacja: zdarzenia (Messenger) lub publiczne interfejsy w `Shared`. Nie wolno importować cudzych encji ani repozytoriów. | CI (Deptrac) |
| 2.4 | Kontroler jest cienki: mapuje wejście na DTO/komendę, woła magistralę, zwraca odpowiedź. Zero logiki biznesowej i zapytań SQL w kontrolerach i Twig. | PR |
| 2.5 | Komendy (zmieniają stan) przez `command.bus` – transakcja i `flush()` realizuje middleware `doctrine_transaction`; zapytania (tylko odczyt) przez `query.bus`. **Zakaz ręcznego `flush()`** w `Domain`, kontrolerach i handlerach. | PR |
| 2.6 | Operacje z efektami zewnętrznymi (płatność, e-mail, wideo) przechodzą przez **port** (interfejs w `Application`/`Domain`) z adapterem w `Infrastructure`; modeli dostawców (Stripe, LiveKit) nie wolno wprowadzać do domeny (warstwa antykorupcyjna). | PR |
| 2.7 | Zdarzenia domenowe publikowane przez **outbox** w tej samej transakcji co zmiana stanu; konsumenci i handlery webhooków MUSZĄ być idempotentni. | PR (plan: test) |
| 2.8 | Operacje pieniężne i wypłaty MUSZĄ mieć klucz idempotencji; stan Stripe jest uzgadniany z własną księgą (ledger). | PR |
| 2.9 | Stany procesów (rezerwacja, wniosek mentora, wypłata) modelujemy jawną maszyną stanów (Symfony Workflow), nie flagami boolean. | PR |
| 2.10 | Zakazane: service locator / wstrzykiwanie `ContainerInterface`, singletony i `static` z mutowalnym stanem (krytyczne dla FrankenPHP worker mode), klasy `Manager/Helper/Util` bez jednej odpowiedzialności, logika w zdarzeniach Doctrine. | PR |
| 2.11 | Odstępstwa od architektury wymagają ADR. | PR |

## 3. Standardy kodu PHP

| # | Reguła | Egz. |
|---|---|---|
| 3.1 | `declare(strict_types=1);` w każdym pliku PHP. | CI (cs) |
| 3.2 | Styl: PER-CS 3.0 + Symfony (konfiguracja w `.php-cs-fixer.dist.php`). Formatowanie naprawia `composer cs-fix`; nie dyskutujemy o stylu w PR. | CI (cs) |
| 3.3 | PHPStan **level max**, bez baseline i bez `@phpstan-ignore`; typy parametrów, zwrotów i właściwości są pełne; `mixed` tylko z uzasadnieniem w komentarzu. | CI (stan) |
| 3.4 | Klasy są `final` (zasada domyślna); value objects i DTO to `final readonly` z promocją właściwości konstruktora. | CI (cs `final_class`) / PR |
| 3.5 | Stałe i zbiory wartości jako backed `enum`, nie stringi/liczby; `match` zamiast długich `switch`. | PR |
| 3.6 | **Czas** wyłącznie przez `Symfony\Component\Clock\ClockInterface`; zakaz `new \DateTime()`, `time()`, `date()`, `now()` w kodzie aplikacji. Wartości czasowe to `DateTimeImmutable` w UTC. | PR (plan: reguła PHPStan) |
| 3.7 | **Pieniądze** wyłącznie jako `App\Shared\Domain\Money` (liczby całkowite w groszach + kod waluty); zakaz `float` dla kwot. | PR |
| 3.8 | Wyjątki domenowe nazwane semantycznie (`SlotAlreadyTaken`), z komunikatem jako kluczem tłumaczenia dla użytkownika; nie łapiemy `\Throwable` poza granicami (middleware, kontroler błędów, health-check). | PR |
| 3.9 | Zależności wstrzykiwane konstruktorem (autowiring); metody ≤ ~30 linii, klasy ≤ ~300 linii, złożoność cyklomatyczna ≤ 10. | PR |
| 3.10 | Nazewnictwo: klasy `PascalCase`, metody/zmienne `camelCase`, plik = nazwa klasy (PSR-4); komendy w trybie rozkazującym (`ConfirmBooking`), zdarzenia w czasie przeszłym (`BookingConfirmed`), handlery `<Komenda>Handler`; porty domenowe bez przyrostka `Interface`. | PR |
| 3.11 | Kod, identyfikatory i komentarze po angielsku. Komentarz wyjaśnia **dlaczego**, nie **co**; PHPDoc tylko gdy typ natywny nie wystarcza (generyki, kształty tablic). | PR |
| 3.12 | Nie używamy składni nowszej niż wspiera wersja PHP z `composer.json` (obecnie `>=8.2`; docelowo `>=8.4` po zmianie środowiska). | CI (stan/runtime) |
| 3.13 | Brak martwego kodu, zakomentowanego kodu i `TODO` bez odwołania do specyfikacji/zadania. | PR |

## 4. Baza danych, Doctrine i migracje

| # | Reguła | Egz. |
|---|---|---|
| 4.1 | Każda zmiana schematu to migracja (`make:migration` → przegląd SQL → `migrate`). Zakaz `schema:update --force` i ręcznych zmian schematu. | CI (schema:validate) |
| 4.2 | Migracje są niezmienne po scaleniu do `main`; poprawka = nowa migracja. Zmiany niekompatybilne wstecz w trzech krokach: **expand → migrate → contract**. `down()` tam, gdzie to możliwe. | PR |
| 4.3 | CI MUSI wykonać migracje na czystej bazie, a następnie `doctrine:schema:validate`. | CI |
| 4.4 | Typy: `timestamptz` (UTC), `uuid` (UUID v7) jako klucze główne nowych agregatów, `jsonb` tylko dla danych bez potrzeby relacyjnego zapytania, pieniądze jako `integer/bigint` + `char(3)`. | PR |
| 4.5 | Integralność w bazie, nie tylko w kodzie: klucze obce, `NOT NULL`, `CHECK` (zakresy), `UNIQUE`; zakaz nakładania się rezerwacji realizuje `EXCLUDE USING gist` (`btree_gist`). | PR |
| 4.6 | Nazewnictwo: tabele `snake_case` w liczbie mnogiej, klucze obce `<tabela>_id`, indeksy `idx_`, unikaty `uniq_`, ograniczenia `chk_`/`excl_`. | PR |
| 4.7 | Indeks dla każdej kolumny używanej w `WHERE`/`JOIN`/`ORDER BY` na dużych tabelach i dla kluczy obcych; krytyczne zapytania mają sprawdzony `EXPLAIN (ANALYZE)`. Indeksy na dużych tabelach: `CREATE INDEX CONCURRENTLY` (migracja nietransakcyjna). | PR |
| 4.8 | Encje: atrybuty mapowania, właściwości `private`, brak publicznych setterów (metody zachowań, np. `$booking->confirm()`); brak logiki w lifecycle callbackach; blokada optymistyczna (`#[ORM\Version]`) na agregatach Booking/Payment. | PR |
| 4.9 | Zakaz N+1 (fetch join lub dedykowane zapytanie odczytu), zakaz `findAll()` na tabelach rosnących, listy rosnące paginowane **keyset**. Projekcje odczytu do DTO, nie pełne encje. | PR |
| 4.10 | Surowy SQL wyłącznie z parametrami; zakaz konkatenacji danych wejściowych. | PR |
| 4.11 | Operacje wielokrokowe (np. rezerwacja + płatność) w jednej transakcji; ewentualne blokady na poziomie transakcji (`pg_advisory_xact_lock`), nie sesji. | PR |
| 4.12 | Aplikacja łączy się przez PgBouncer (`transaction`); migracje, `LISTEN/NOTIFY` i długie zadania — bezpośrednio do bazy. Nie polegamy na stanie sesji (`SET`, sesyjne advisory locks). | PR |
| 4.13 | Czasy przechowywane w UTC; strefa użytkownika stosowana wyłącznie w prezentacji. Dostępność powtarzalna: lokalna godzina + strefa IANA, rozwijana do slotów z uwzględnieniem DST. | PR |

## 5. Symfony i API

| # | Reguła | Egz. |
|---|---|---|
| 5.1 | Konfiguracja przez atrybuty PHP, autowiring i YAML w `config/`; zakaz XML i adnotacji. Wersje pakietów `symfony/*` spójne (`7.4.*`). | CI (lint:container) |
| 5.2 | Kontrolery `final`, jedna akcja = jedna ścieżka, `#[Route]`; wejście przez `#[MapRequestPayload]`/`#[MapQueryString]` do DTO z `#[Assert\…]` lub `FormType`; do widoków/JSON przekazujemy DTO, **nigdy encje**. | PR |
| 5.3 | Autoryzacja przez Security Voters i `#[IsGranted]`; sprawdzamy własność zasobu (ochrona przed IDOR), nie tylko rolę. | PR (plan: testy dostępu) |
| 5.4 | Formularze: klasa `FormType` per formularz, dane w DTO; walidacja serwerowa jest źródłem prawdy. | PR |
| 5.5 | API JSON (webhooki, endpointy pomocnicze): prefiks `/api/v1`, błędy w formacie RFC 7807 (`application/problem+json`), jawne wersjonowanie, kody HTTP zgodne z semantyką (409 dla kolizji slotu, 422 dla walidacji). API Platform poza MVP. | PR |
| 5.6 | Webhooki: weryfikacja podpisu → zapis surowego zdarzenia z unikalnym `provider_event_id` → przetwarzanie asynchroniczne. | PR |
| 5.7 | Zadania w tle wyłącznie przez Messenger/Scheduler; żądanie HTTP nie wykonuje długich lub zawodnych operacji zewnętrznych synchronicznie. Handlery asynchroniczne mają politykę ponowień i transport `failed`. | PR |
| 5.8 | Health-checki `/health/live` (bez zależności) i `/health/ready` (sprawdza bazę) pozostają działające i przetestowane. | CI (testy) |

## 6. Bezpieczeństwo i prywatność (cel: OWASP ASVS L2)

| # | Reguła | Egz. |
|---|---|---|
| 6.1 | Sekrety (hasła, klucze API, tokeny) MUSZĄ NIE trafiać do repozytorium, logów ani komunikatów błędów; lokalnie `.env.local`, w środowiskach menedżer sekretów / Symfony Secrets. | PR (plan: skan sekretów w CI) |
| 6.2 | Dane wejściowe walidowane po stronie serwera; wyjście escapowane (Twig autoescape włączone, `|raw` zabronione bez przeglądu). | PR |
| 6.3 | Formularze mają ochronę CSRF; cookie `Secure`, `HttpOnly`, `SameSite`; CSP bez `unsafe-inline` (nonce). | PR (plan) |
| 6.4 | Hasła hashowane przez mechanizm `auto` Symfony; limit prób logowania (rate limiter); reset hasła jednorazowy token, odpowiedź bez ujawniania istnienia konta; MFA (TOTP) obowiązkowe dla mentora i admina. | PR (spec 1) |
| 6.5 | Upload: whitelist typów, limit rozmiaru, losowe nazwy, pliki w prywatnym storage (URL podpisane), skan antywirusowy; nigdy wykonywane ani serwowane z katalogu publicznego. | PR (spec 2) |
| 6.6 | Dane osobowe: minimalizacja, brak PII w logach i identyfikatorach URL, retencja zdefiniowana, eksport i usunięcie konta (anonimizacja z zachowaniem księgi finansowej). Dane karty nie dotykają naszych serwerów (Stripe Elements). | PR |
| 6.7 | Decyzje wrażliwe (moderacja, zwroty, wypłaty, zawieszenia) zapisują wpis w niezmiennym `audit_log`. | PR (specs 2, 5, 9) |
| 6.8 | Zależności: `composer audit` w CI blokuje merge przy znanych lukach; aktualizacje bezpieczeństwa PHP/FrankenPHP/Symfony stosujemy bez zwłoki. | CI (audit) |
| 6.9 | Rate limiting dla logowania, wiadomości i wyszukiwarki; filtr danych kontaktowych w wiadomościach (ochrona przed obchodzeniem platformy). | PR |

## 7. Testy

| # | Reguła | Egz. |
|---|---|---|
| 7.1 | Nowe zachowanie MUSI mieć test; błąd MUSI mieć test regresyjny. Nazwa opisuje zachowanie (`it_refunds_fully_when_cancelled_more_than_24h_before`). | PR |
| 7.2 | Piramida: **jednostkowe** (domena, polityki, value objects, maszyny stanów) → **integracyjne** (repozytoria, constrainty, migracje – na prawdziwym PostgreSQL, nie SQLite/mock) → **funkcjonalne** (`WebTestCase`: kontrolery, formularze, Voters) → **E2E** (Playwright: główne ścieżki ucznia, mentora i admina). | PR |
| 7.3 | Testy deterministyczne: `MockClock`, brak sieci i zewnętrznych usług (fake’i portów), brak zależności od kolejności. | PR |
| 7.4 | Warunki wyścigu (np. dwie rezerwacje tego samego slotu) pokrywa test współbieżności; dokładnie jedna rezerwacja kończy się sukcesem. | PR (spec 4/5) |
| 7.5 | Adaptery zewnętrzne (Stripe, LiveKit) mają testy kontraktowe z nagranymi odpowiedziami i weryfikacją podpisów webhooków. | PR (spec 5/6) |
| 7.6 | Testy nie mogą wywoływać deprecacji ani ostrzeżeń (`failOnDeprecation/Notice/Warning` w `phpunit.dist.xml`). | CI |
| 7.7 | Progi pokrycia (cel, po pojawieniu się kodu domenowego): domena ≥ 90%, aplikacja ≥ 80%, ogółem ≥ 75%; mutation testing (Infection) dla `Domain` nocą, MSI ≥ 70%. | plan |
| 7.8 | Testy a11y (axe) w E2E dla ekranów publicznych i przepływu rezerwacji. | plan |

## 8. Frontend, UX, dostępność i i18n

| # | Reguła | Egz. |
|---|---|---|
| 8.1 | UI renderowane po stronie serwera (Twig) + Turbo/Stimulus; powtarzalne elementy jako Twig Components (`MentorCard`, `StatusBadge`, `EmptyState`, `ErrorState`, `Skeleton`, `FormField`). | PR |
| 8.2 | Każdy ekran z danymi MUSI obsłużyć **loading, empty, error, success** (kontrakt ze specyfikacji ekranów `mentorhub-koncept/docs/04-…`), używając wspólnych komponentów, nie rozwiązań per ekran. | PR |
| 8.3 | Dostępność WCAG 2.1 AA: etykiety pól, błędy powiązane przez `aria-describedby`, widoczny focus, obsługa klawiaturą, kontrast, komunikaty `aria-live`; informacji nie przekazujemy samym kolorem. | PR / plan (axe) |
| 8.4 | Brak tekstów „na twardo” w szablonach i kodzie UI – klucze w `translations/` (PL domyślnie, EN równolegle); daty, liczby i waluty przez `intl`. Czas zawsze pokazywany ze strefą użytkownika. | CI (lint:translations – plan) / PR |
| 8.5 | Mobile-first, responsywność; budżety: LCP < 2,5 s (P75 mobile), krytyczny JS < 100 kB gz, skrypty płatności/wideo ładowane tylko na ekranach, które ich potrzebują. | plan |
| 8.6 | Kod klienta w TypeScript (`strict`, bez `any`) po rozstrzygnięciu mechanizmu budowania (Q6); do tego czasu JS + JSDoc. Jeden kontroler Stimulus = jedna odpowiedzialność, sprzątanie w `disconnect()`. | plan |
| 8.7 | Walidacja po stronie klienta jest dodatkiem do walidacji serwerowej, nie zamiennikiem. | PR |

## 9. Obserwowalność, niezawodność i wydajność

| # | Reguła | Egz. |
|---|---|---|
| 9.1 | Logi strukturalne (JSON) z `correlation_id`; poziomy: `error` wymaga reakcji, `warning` oznacza degradację, `info` zdarzenia biznesowe. | PR |
| 9.2 | Wywołania zewnętrzne mają timeout, ponowienia z backoffem i jawną degradację (nie wywracamy całej aplikacji z powodu jednego dostawcy). | PR |
| 9.3 | Nowy przepływ biznesowy (rezerwacja, płatność, wypłata, no-show) MUSI wystawiać metryki i być widoczny w logach. | PR |
| 9.4 | SLO docelowe: dostępność 99,9%, p95 odpowiedzi HTML < 300 ms, błędy płatności po stronie platformy < 0,1%. | plan |
| 9.5 | Kod bezstanowy między żądaniami (gotowość na FrankenPHP worker mode); usługi z stanem implementują `ResetInterface`. | PR |
| 9.6 | Zmiany wydajnościowe poparte pomiarem (profil, `EXPLAIN`, k6), nie przypuszczeniem. | PR |

## 10. Zależności i środowisko

| # | Reguła | Egz. |
|---|---|---|
| 10.1 | `composer.lock` jest w repozytorium; dodanie zależności wymaga uzasadnienia (czy da się bez niej, licencja, utrzymanie, rozmiar). Nie mieszamy wersji minor pakietów `symfony/*`. | PR |
| 10.2 | Wersje runtime (PHP, PostgreSQL, PgBouncer) zgodne w `composer.json`, `compose.yaml`, `Dockerfile`, CI i `doctrine.yaml`. | PR |
| 10.3 | Konfiguracja przez zmienne środowiskowe (12-factor); jeden artefakt (obraz) przechodzi przez wszystkie środowiska. | PR |
| 10.4 | Środowisko lokalne uruchamiane z `compose.yaml`; instrukcja w `README.md` MUSI być aktualna i działająca. | PR |

## 11. Dokumentacja i wiedza

| # | Reguła | Egz. |
|---|---|---|
| 11.1 | Decyzje architektoniczne zapisujemy jako ADR (`docs/adr/NNNN-slug.md`, format MADR): kontekst, decyzja, konsekwencje, odrzucone alternatywy. | PR |
| 11.2 | `README.md` opisuje architekturę, uruchomienie i bramkę jakości; zmiana struktury lub stacku aktualizuje README i `AGENTS.md` w tym samym PR. | PR |
| 11.3 | Wnioski po błędach i korektach trafiają do `.ai/lessons/` + indeks `.ai/lessons.md`; nieaktualne wpisy poprawiamy, nie dublujemy. | PR |
| 11.4 | Autonomiczne przebiegi AI zapisują log w `.ai/runs/` (zasada 4 `AGENTS.md`). | PR |

## 12. Zasady dla agentów AI

1. Przed pracą: przeczytaj `.ai/lessons.md`, odpowiednią specyfikację i ten dokument.
2. Nie zgaduj stanu repozytorium – sprawdź plik, polecenie lub test; wynik weryfikacji (także nieudanej) raportuj uczciwie, niezweryfikowanego nie opisuj jako zrobione.
3. Nie obchodź bramek jakości: żadnych `@phpstan-ignore`, baseline’ów, wyłączania reguł Deptrac/CS, `--no-verify`, pomijania testów. Błąd narzędzia naprawia się przyczynowo albo eskaluje do użytkownika.
4. Zmiany minimalne i w zakresie specyfikacji; nie refaktoryzuj „przy okazji” poza zakresem.
5. Nie commituj, nie wypychaj i nie usuwaj danych bez wyraźnej prośby; działania trudne do odwrócenia lub widoczne na zewnątrz potwierdzaj z użytkownikiem.
6. Gdy standard koliduje z zadaniem lub jest niejasny – zapytaj lub zaproponuj zmianę standardu w osobnej specyfikacji/ADR, zamiast cicho go łamać.

---

## Bramki jakości – stan obecny

| Bramka | Polecenie | Pilnuje reguł |
|---|---|---|
| Walidacja manifestu | `composer validate --strict` | 10.1 |
| Styl kodu | `composer cs` (naprawa: `composer cs-fix`) | 3.1, 3.2, 3.4 |
| Analiza statyczna | `composer stan` | 3.3, 3.12 |
| Granice modułów | `composer deptrac` | 2.1–2.3 |
| Testy | `composer test` | 7.1–7.6 |
| Pełny zestaw lokalnie | `composer qa` | wszystkie powyższe |
| W CI dodatkowo (`.github/workflows/ci.yml`, nieuruchomione w sandboxie) | `composer audit`, `lint:yaml/twig/container`, migracje na czystej bazie + `schema:validate` | 4.1, 4.3, 5.1, 6.8 |

## Reguły do zautomatyzowania (dług standardów)

Dodać w odpowiednich specyfikacjach: zakaz `new \DateTime`/`time()` (3.6, reguła PHPStan), `lint:translations` (8.4), skan sekretów (6.1), progi pokrycia i Infection (7.7), axe w E2E (7.8), budżety wydajności (8.5), CSP/nagłówki bezpieczeństwa (6.3).

## Zmiana tego dokumentu

Standard zmieniamy w PR, który: (1) opisuje powód, (2) aktualizuje kolumnę „Egzekwowanie” i bramki, (3) jeśli zmienia stack lub architekturę — dodaje ADR i aktualizuje specyfikację nadrzędną oraz `AGENTS.md`.
