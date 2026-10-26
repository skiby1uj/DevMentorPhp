# Specyfikacja: tech-stack, standardy inżynieryjne, coding standards i wzorce projektowe dla DevMentor

- Status: **ZAAKCEPTOWANA (2026-10-26); realizacja etapami** – spec 0 [platform-foundation](implemented/2026-10-26-platform-foundation.md) wykonana, kolejne 1–10 do napisania (§14)
- Data: 2026-10-25
- Wejście: koncepcja produktu `mentorhub-koncept/` (29 ekranów, role: gość/uczeń/mentor/admin, rezerwacja → płatność → sesja wideo → opinia, wypłaty), istniejący szkielet Symfony w repozytorium, `AGENTS.md`
- Zasada przewodnia: **najlepszy stack to nie najmodniejszy, tylko najmniejszy, który bezpiecznie obsłuży płatności, kalendarze i wideo przy małym zespole.** Stąd: modularny monolit, PostgreSQL jako główny silnik, usługi zewnętrzne tylko tam, gdzie budowanie własnych byłoby ryzykowne (płatności, wideo).

---

## 1. Czynniki decyzyjne (z koncepcji produktu)

| # | Czynnik | Wynika z | Wpływ na stack |
|---|---|---|---|
| D1 | Pieniądze: płatność z góry, zwolnienie mentorowi po sesji (T+7), zwroty wg polityki 24 h, wypłaty | UC06, UC17, reguły biznesowe | Stripe Connect, księgowanie w groszach, idempotencja, maszyna stanów, audyt |
| D2 | Kolizje terminów i wyścigi (dwóch uczniów, ten sam slot) | UC05, U03 „blokada slotu 10 min” | Ograniczenia na poziomie bazy (exclusion constraint), nie tylko w kodzie |
| D3 | Strefy czasowe, przypomnienia 24 h/1 h, wygasanie próśb po 24 h | wymagania przekrojowe, M04 | `timestamptz`/UTC, Symfony Clock, Messenger delayed + Scheduler |
| D4 | Wideo 1:1 + czat w sali + wykrywanie no-show | UC07, U08 | zewnętrzny dostawca WebRTC, webhooki uczestników |
| D5 | Czas rzeczywisty: wiadomości, powiadomienia | UC10, UC21 | Mercure (SSE) zamiast własnych WebSocketów |
| D6 | Wyszukiwanie/filtry mentorów po temacie, cenie, języku, ocenie, dostępności | UC01, P02 | PostgreSQL FTS + `pg_trgm` + `unaccent`; osobny silnik dopiero po przekroczeniu progu |
| D7 | Zaufanie i bezpieczeństwo: weryfikacja dokumentów, moderacja, RODO | UC13, UC18–19, UC21 | MFA dla mentora/admina, skan plików, audit log, eksport/usuwanie danych |
| D8 | UI: 29 ekranów głównie formularzy/list, dużo stanów, mobile-first, WCAG 2.1 AA, PL/EN | koncepcja ekranów | Renderowanie po stronie serwera (Twig) + Turbo/Stimulus; SPA zbędna |
| D9 | Mały zespół, szybkie iteracje, agenci AI współtworzą kod | `AGENTS.md`, SDD | Konwencje wymuszane narzędziami (CI), jedna technologia back/front, mało ruchomych części |

---

## 2. Podsumowanie decyzji (ADR w skrócie)

Wersje zweryfikowane researchem na dzień 2026-10-25 (źródła na końcu). Wersje bibliotek spoza tej tabeli należy potwierdzić przy dodawaniu (`composer require --dry-run`).

| Obszar | Decyzja | Odrzucone alternatywy i powód |
|---|---|---|
| Język | **PHP 8.5** (min. w `composer.json`: `>=8.4`; środowiska uruchamiają ≥ 8.5.12 – wydanie z 2026-10-21 łata dwie krytyczne luki RCE) | 8.2 – EOL 31.12.2026 (obecny `composer.json` wymaga `>=8.2`, lokalnie 8.2.35 – do podniesienia); 8.4 – dopuszczalne minimum, wsparcie aktywne tylko do 31.12.2026; 8.6 – dopiero beta |
| Framework | **Symfony 7.4 LTS** (poprawki do 11.2028, bezpieczeństwo do 11.2029) | Symfony 8.0 – wsparcie zakończone w 07.2026; 8.1 – tylko do 01.2027, bez LTS. **Plan migracji:** usuwać deprecacje na bieżąco i przejść na **8.4 LTS** (premiera ~11.2027) |
| Baza | **PostgreSQL 18** (aktualnie 18.6) – nowy projekt, więc startujemy na bieżącej wersji (obecnie skonfigurowane 17/16 → ujednolicić) | MySQL – słabsze typy zakresów, brak exclusion constraints; NoSQL – dane silnie relacyjne i transakcyjne |
| ORM/migracje | **Doctrine ORM 3 + DBAL + Migrations** | Eloquent/Propel – poza ekosystemem Symfony |
| Pula połączeń | **PgBouncer 1.26.x, tryb `transaction`**, `max_prepared_statements` > 0 (od 1.21 PgBouncer śledzi nazwane prepared statements w trybie transaction; w 1.25.2 domyślnie 200) | Brak puli w PHP-FPM/FrankenPHP; połączenia stałe bez PgBouncera nie skalują się przy wielu workerach |
| Serwer aplikacji | **FrankenPHP** (Caddy, HTTP/2/3, wbudowany Mercure), najpierw tryb klasyczny, **worker mode po audycie stanu współdzielonego** (Symfony 7.4 wykrywa worker mode sam) | Nginx + PHP-FPM – działa, ale więcej komponentów (osobny Mercure, osobny proxy) |
| Front | **Twig + Symfony UX (Turbo, Stimulus) + AssetMapper**, CSS: Tailwind (`symfonycasts/tailwind-bundle`) lub własne tokeny z mockupów | React/Vue SPA – drugi system budowania, duplikacja walidacji i routingu, brak potrzeby przy formularzach i listach |
| TypeScript | **Tak, dla kodu klienta** (kontrolery Stimulus, sala wideo). Mechanizm kompilacji do potwierdzenia w spike’u (zob. §15, Q6); do tego czasu JS + JSDoc + `tsc --noEmit` | Brak typów po stronie klienta – ryzyko w najbardziej stanowym ekranie (U08) |
| Czas rzeczywisty | **Mercure** (SSE) – powiadomienia, wiadomości, statusy; wiadomości zawsze trwale w PostgreSQL | Własne WebSockety (Ratchet/Swoole) – koszt operacyjny; polling – gorszy UX |
| Asynchroniczność | **Symfony Messenger** (transport Doctrine na starcie, Redis/RabbitMQ gdy obciążenie to uzasadni) + **Symfony Scheduler** dla zadań cyklicznych | Cron + skrypty – brak ponowień i obserwowalności |
| Cache/limity/blokady | **Redis** (cache, rate limiter, `symfony/lock`, sesje) | Pliki/Doctrine – niewydajne przy wielu instancjach |
| Płatności | **Stripe Connect (Express accounts)**, wzorzec **separate charges and transfers** (zob. §7) | Własna obsługa kart – poza zakresem PCI; destination charges – brak kontroli nad momentem zwolnienia środków |
| Wideo | **LiveKit Cloud** za portem `VideoProvider` (możliwa wymiana na Daily/Twilio) | Własny WebRTC – zbyt ryzykowne. Koszt orientacyjny dla 100 tys. min uczestnika/mies.: LiveKit ~50 USD (plan Ship, plus transfer danych), Daily ~360 USD, Twilio ~400 USD – **zweryfikować na stronach dostawców** (dane z jednego wydawcy) |
| Wyszukiwanie | **PostgreSQL FTS (`simple` + słownik polski jeśli dostępny) + `pg_trgm` + `unaccent`** | Elasticsearch/Meilisearch – dodać dopiero, gdy >~50 tys. profili lub potrzebne rankingi/fasety, za portem `MentorSearch` |
| Pliki | **S3-kompatybilny storage (region UE)**, prywatne bucket’y, URL-e podpisane, skan antywirusowy (ClamAV) | Dysk lokalny – brak skalowania i trwałości |
| E-mail | Symfony Mailer + dostawca transakcyjny (np. Postmark/SES; Mailpit lokalnie) | – |
| Obserwowalność | **Monolog (JSON) → centralny log, OpenTelemetry (ślady/metryki), Sentry (błędy)**, health/readiness endpoints | – |
| CI/CD | **GitHub Actions**, obrazy Docker, wdrożenia kontenerowe (platforma do ustalenia, Q1) | – |

---

## 3. Architektura: modularny monolit z warstwami wewnątrz modułów

**Dlaczego monolit:** jedna baza i jedna transakcja dla rezerwacji + płatności; mały zespół; brak uzasadnienia dla rozproszonych transakcji. **Dlaczego modularny:** granice kontekstów pozwalają później wydzielić np. Payments lub Video bez przepisywania.

### 3.1 Konteksty (moduły) i odpowiedzialności

| Moduł | Zakres | Główne ekrany |
|---|---|---|
| `Identity` | rejestracja, logowanie, role, MFA, reset hasła, zgody | P04–P06, S01 |
| `Mentoring` (profile) | profil mentora, tematy, języki, cena, wniosek weryfikacyjny, status | P03, M01 |
| `Catalog` | wyszukiwanie, filtry, ulubieni (read model) | P01, P02, U11 |
| `Scheduling` | reguły dostępności, urlopy, generowanie slotów, blokada slotu | M03, U03 |
| `Booking` | rezerwacja, cykl życia, zmiana terminu, anulowanie, akceptacja | U03–U07, M04 |
| `Payments` | płatności, zwroty, saldo, wypłaty, kody promocyjne, pakiety, faktury | U04, U12, M06 |
| `Sessions` | sala, token wideo, czat w sali, notatki, no-show | U07–U08 |
| `Messaging` | konwersacje i wiadomości | U10 |
| `Reviews` | opinie i agregaty ocen | U09, P03 |
| `Notifications` | powiadomienia in-app/e-mail/push, preferencje | S02 |
| `Moderation` | zgłoszenia, spory, zawieszenia, audyt | A01–A03 |
| `Shared` | `Money`, `TimeRange`, ID, Clock, interfejsy zdarzeń | – |

### 3.2 Struktura katalogów

```
src/
  <Module>/
    Domain/            # encje, value objects, zdarzenia domenowe, interfejsy repozytoriów, polityki – bez Symfony/Doctrine API
    Application/       # komendy/zapytania + handlery (Messenger), serwisy aplikacyjne, DTO, porty (interfejsy usług zewnętrznych)
    Infrastructure/    # repozytoria Doctrine, adaptery (Stripe, LiveKit, S3), mapowania, migracje danych
    UI/                # kontrolery HTTP, formularze, komponenty Twig/Live, komendy konsolowe, voters
templates/<module>/ ; translations/<module>.pl.yaml / .en.yaml
```

Reguły zależności (wymuszane przez **Deptrac** w CI):
- `Domain` → tylko `Shared`/PHP. `Application` → `Domain`. `Infrastructure` i `UI` → `Application`/`Domain`.
- Moduł **nie odwołuje się do `Domain`/`Infrastructure` innego modułu**; komunikacja przez (a) publiczne interfejsy w `Application/Api` modułu, (b) zdarzenia domenowe/integracyjne.
- Doctrine: encje w `Domain` z mapowaniem atrybutami (świadomy kompromis: pragmatyzm kosztem „czystej” domeny); logika biznesowa w encjach/serwisach domenowych, nie w kontrolerach i handlerach.

### 3.3 Przepływ żądania

`Controller (UI)` → `MessageBus` (komenda/zapytanie) → `Handler (Application)` → `Domain` + `Repository (interfejs)` → `Doctrine`. Middleware `doctrine_transaction` otacza handler komendy transakcją i wykonuje `flush()`; **`flush()` nie jest wywoływany ręcznie w domenie ani kontrolerach.**

### 3.4 Zdarzenia i outbox

- Zdarzenia domenowe (`BookingConfirmed`, `PaymentCaptured`, `SessionCompleted`…) zapisywane w tabeli **outbox** w tej samej transakcji co zmiana stanu; osobny worker publikuje je na Messenger (gwarancja at-least-once). Konsumenci są **idempotentni**.
- Webhooki zewnętrzne (Stripe, LiveKit): weryfikacja podpisu → zapis surowego zdarzenia (tabela `inbound_event`, unikalny `provider_event_id`) → przetwarzanie asynchroniczne.

---

## 4. Model danych i PostgreSQL

1. **Identyfikatory:** UUID v7 (`symfony/uid`) jako klucze główne (porządek czasowy = dobra lokalność indeksów); w tabelach referencyjnych dopuszczalne `smallint`.
2. **Czas:** `timestamptz`, zawsze UTC, w PHP `DateTimeImmutable` z `ClockInterface`; strefa użytkownika stosowana tylko w prezentacji. Dla terminów powtarzalnych (dostępność) zapisujemy **lokalną godzinę + IANA timezone** i rozwijamy do slotów z uwzględnieniem DST.
3. **Pieniądze:** liczby całkowite w najmniejszej jednostce (grosze) + kod waluty (`char(3)`); w PHP `brick/money`. Nigdy `float`.
4. **Zakaz nakładania się rezerwacji – na poziomie bazy:**
   `EXCLUDE USING gist (mentor_id WITH =, tstzrange(starts_at, ends_at) WITH &&) WHERE (status IN ('pending','confirmed'))` (rozszerzenie `btree_gist`). Naruszenie → wyjątek domenowy `SlotAlreadyTaken` (HTTP 409).
5. **Blokada slotu 10 min:** wiersz rezerwacji w statusie `draft` z `expires_at`; zwalniany przez Scheduler; ten sam constraint go obejmuje.
6. **Spójność:** klucze obce zawsze; `CHECK` dla zakresów (ocena 1–5, cena, kwoty ≥ 0); statusy jako natywne `enum`/`text + CHECK` mapowane na PHP backed enum; blokowanie optymistyczne (`#[ORM\Version]`) na agregatach Booking/Payment; `SELECT … FOR UPDATE` tylko świadomie (np. księgowanie salda).
7. **Dane wrażliwe:** dokumenty mentorów poza bazą (S3), w bazie tylko metadane; kolumny z PII minimalizowane; szyfrowanie na poziomie aplikacji dla numerów kont (IBAN).
8. **Wyszukiwanie:** kolumna `tsvector` (generated) + indeks GIN, `pg_trgm` dla literówek, `unaccent` dla polskich znaków; denormalizowany read model `mentor_search` (ocena, liczba opinii, min. cena, najbliższy wolny slot) aktualizowany zdarzeniami.
9. **Migracje:** niezmienne po scaleniu; **expand → migrate → contract** dla zmian niekompatybilnych wstecz (wdrożenia bez przestoju); każda migracja przechodzi test „czysta baza → migrate → `doctrine:schema:validate`” w CI; duże zmiany danych w osobnych komendach, nie w DDL; `CREATE INDEX CONCURRENTLY` w migracji bez transakcji (`isTransactional(): false`).
10. **Pula/PgBouncer:** aplikacja łączy się z PgBouncerem (`transaction`); **migracje, `LISTEN/NOTIFY` i długie zadania — bezpośrednio do PostgreSQL**. Nie polegamy na stanie sesji (`SET`, sesyjne advisory locks) — używamy `pg_advisory_xact_lock`. Przy FrankenPHP worker mode dbamy o ponowne otwieranie przerwanych połączeń (`doctrine/doctrine-bundle` resetuje EM między żądaniami).
11. **Backup/DR:** PITR (WAL), codzienny snapshot, test odtworzenia co kwartał; cele: RPO ≤ 5 min, RTO ≤ 1 h (do potwierdzenia, Q1).

---

## 5. Wzorce projektowe (katalog z mapowaniem na funkcje)

| Wzorzec | Zastosowanie w DevMentor | Uwagi |
|---|---|---|
| **Agregat + Repozytorium** | `Booking`, `MentorProfile`, `Payment`, `Conversation` | Interfejs w `Domain`, implementacja Doctrine w `Infrastructure`; jeden agregat = jedna transakcja |
| **Value Object** | `Money`, `TimeRange`, `Email`, `Rating`, `Timezone`, `BookingId` | `final readonly`, walidacja w konstruktorze, porównanie przez wartość |
| **Maszyna stanów (Symfony Workflow)** | Booking: `draft → pending → confirmed → completed / cancelled / no_show`; MentorApplication: `draft → submitted → approved / changes_requested / rejected`; Payout | Przejścia z guardami i zdarzeniami; widok grafu generowany do dokumentacji |
| **Komenda / Zapytanie (CQRS-lite)** | `ConfirmBooking`, `CancelBooking`, `RequestPayout` / `SearchMentors` | Messenger z magistralami `command.bus` (transakcja) i `query.bus` (bez efektów ubocznych); zapytania mogą czytać wprost przez DBAL |
| **Strategia / Polityka** | `CancellationPolicy` (zwrot >24 h), `CommissionPolicy` (20%), `PayoutSchedulePolicy` (T+7) | Wstrzykiwane, konfigurowalne, testowane tablicą przypadków |
| **Port i adapter (Hexagon)** | `PaymentGateway`, `VideoProvider`, `MentorSearch`, `FileStorage`, `Mailer` | Adaptery Stripe/LiveKit/S3 w `Infrastructure`; fake’i w testach; **warstwa antykorupcyjna** tłumaczy modele dostawców na język domeny |
| **Outbox + Inbox** | publikacja zdarzeń, webhooki | Gwarancja dostarczenia i deduplikacja |
| **Idempotency Key** | tworzenie płatności, zwroty, wypłaty, komendy z UI (podwójny klik) | Klucz generowany przy renderze formularza; unikalny indeks |
| **Saga / process manager** | Rezerwacja → autoryzacja płatności → potwierdzenie → przypomnienia → sesja → zwolnienie środków → T+7 transfer | Stan w `process_state`, kompensacje: zwrot, zwolnienie slotu |
| **Specification** | filtry wyszukiwania i reguły dostępności | Składalne warunki zamiast rozrastających się `if` w repozytorium |
| **Domain Events** | `SessionCompleted` → opinia dostępna, przypomnienie o ocenie, naliczenie wypłaty | Subskrybenci w innych modułach przez Messenger |
| **Decorator / Middleware** | logowanie, metryki, retry, tenantless audit komend | Middleware Messengera |
| **Anti-corruption + Circuit breaker/Retry** | wywołania Stripe/LiveKit | Timeouty, `RetryableHttpClient`, degradacja funkcji, nie całej aplikacji |
| **Voter (Policy)** | dostęp do sesji, rezerwacji, rozmów | Autoryzacja w jednym miejscu, nie w kontrolerach |
| **Null Object / Feature flag** | stopniowe włączanie (np. pakiety, wypłaty) | Prosty serwis flag w konfiguracji |

Antywzorce zakazane: Active Record w domenie poza Doctrine, service locator, `static` stan, „Manager/Helper/Util” bez jednej odpowiedzialności, encje zwracane wprost do JSON/Twig w formularzach (używaj DTO), logika w `Twig`, zdarzenia Doctrine z logiką biznesową.

---

## 6. Moduł rezerwacji (kluczowy przepływ) – wymagania architektoniczne

1. `U03`: odczyt slotów z `Scheduling` (rozwinięcie reguł − rezerwacje − urlopy − bufor). Wybór slotu tworzy `draft` z `expires_at = now + 10 min` (constraint z §4).
2. `U04`: `PaymentGateway::createIntent()` z kluczem idempotencji. Tryby:
   - mentor z **natychmiastową rezerwacją** → płatność zatwierdzona i przechwycona → `Booking: confirmed`;
   - mentor z **ręczną akceptacją** → płatność tylko **autoryzowana** (`capture_method=manual`, okno autoryzacji kartowej jest ograniczone, więc 24 h na reakcję mieści się w limicie; weryfikacja limitów u dostawcy) → po akceptacji `capture`, po odmowie/wygaśnięciu `cancel` (zwolnienie bez prowizji).
3. Webhook `payment_intent.succeeded` jest **źródłem prawdy** (a nie redirect z przeglądarki); `U05` odpytuje stan/Mercure do czasu potwierdzenia.
4. Anulowanie/zmiana terminu przez `CancellationPolicy` (zwrot pełny > 24 h; w przeciwnym razie brak; anulowanie przez mentora: zawsze zwrot + zdarzenie reputacyjne).
5. Zakończenie sesji (`SessionCompleted`) uruchamia okno sporu 7 dni, po którym `Payments` wykonuje transfer do mentora (prowizja platformy odliczona).

---

## 7. Płatności (Stripe Connect)

- **Konta mentorów:** Connect **Express** (onboarding i KYC po stronie Stripe, ograniczony zakres PCI/KYC dla nas). Płatności uczniów przez **Stripe Elements/Payment Element** – dane kart nie dotykają naszych serwerów (zakres PCI SAQ A); 3-D Secure/SCA obsługiwane przez Stripe.
- **Model rozliczeń:** *separate charges and transfers* — obciążenie trafia na saldo platformy, transfer do mentora następuje **po zdarzeniu biznesowym** (koniec sesji + 7 dni). Daje to prawdziwy „escrow” z koncepcji. Zastrzeżenie dostawcy: ten model zaleca się, gdy platforma odpowiada za ujemne salda kont powiązanych — to świadomie akceptujemy; destination charges odrzucone, bo nie pozwalają wstrzymać środków do wybranej daty.
- **Księgowanie:** własna księga podwójnego zapisu (`ledger_entry`: konto, kwota, waluta, powiązanie z płatnością/transferem, niezmienna) jako źródło prawdy dla M06; stan Stripe jest uzgadniany codziennym zadaniem rekoncyliacyjnym.
- **Idempotencja i bezpieczeństwo:** `Idempotency-Key` we wszystkich wywołaniach zapisujących; klucze API w Symfony Secrets; webhooki podpisane; brak logowania danych płatniczych.
- **Wymagania prawne do potwierdzenia przed startem (Q2):** VAT od prowizji platformy i fakturowanie (PL), raportowanie dla platform cyfrowych (DAC7), regulamin i polityka zwrotów zgodne z prawem konsumenckim (prawo odstąpienia przy usługach cyfrowych), zgody RODO. Specyfikacja **nie zastępuje porady prawnej/podatkowej**.

---

## 8. Wideo i sesje

- Port `VideoProvider` (`createRoom`, `issueToken(user, room, ttl)`, `endRoom`) + adapter LiveKit. Token wydawany po stronie serwera tylko uczestnikom, tylko w oknie `[start − 10 min, koniec + 15 min]`; krótki TTL.
- Webhooki `participant_joined/left` zasilają `Sessions` (liczniki obecności → no-show po 10 min bez drugiej strony → `NoShowDetected` → zwrot/zgłoszenie do `Moderation`).
- Czat w sali: LiveKit data channel **lub** Mercure — wybór w spike’u; wiadomości archiwizowane w PostgreSQL (ewentualne spory).
- Klient: kontroler Stimulus + SDK LiveKit; test urządzeń przed wejściem; automatyczny reconnect; zgody na kamerę/mikrofon obsłużone zgodnie ze stanami z koncepcji (U08).
- Nagrywanie sesji: **poza zakresem MVP** (implikacje RODO/zgody) – decyzja produktowa Q4.

---

## 9. Frontend

- Renderowanie serwerowe (Twig), nawigacja Turbo Drive/Frames/Streams (np. strumienie Turbo z Mercure dla wiadomości i powiadomień), interakcje w Stimulus. Twig Components dla elementów powtarzalnych z mockupów (`MentorCard`, `StatusBadge`, `EmptyState`, `ErrorState`, `Skeleton`, `FormField`).
- **Stany loading/empty/error/success** z koncepcji implementujemy jako **jeden wspólny zestaw komponentów** (nie per ekran) – ten sam kontrakt co w mockupie (`withState`).
- Formularze: Symfony Form + Validator (walidacja serwerowa jako źródło prawdy), atrybuty HTML5 i wiadomości po polsku/angielsku z `translations/`; komunikaty błędów powiązane z polami (`aria-describedby`).
- Dostępność: WCAG 2.1 AA — kontrast, focus widoczny, obsługa klawiatury, etykiety, `aria-live` dla toastów; testy automatyczne (axe) w E2E.
- i18n: klucze tłumaczeń, nigdy tekst „na twardo” w szablonach; daty/liczby/waluty przez `intl`; domyślnie PL, EN równolegle.
- Wydajność: budżety — LCP < 2,5 s (P75, mobile), JS krytyczny < 100 kB gz, brak blokujących skryptów zewnętrznych poza płatnością i wideo (ładowane tylko na U04/U08).
- Mockupy z `mentorhub-koncept/mockup` pozostają referencją UX; **kod mockupu nie jest przenoszony 1:1** (kontrakt stanów, tokeny CSS i copy tak).

---

## 10. Bezpieczeństwo (OWASP ASVS poziom 2 jako cel)

- **Uwierzytelnianie:** Symfony Security (`form_login`/`remember_me`), hashowanie `auto` (Argon2id/bcrypt wg platformy), blokada po nieudanych próbach (Rate Limiter + `login_throttling`), weryfikacja e-mail, reset hasła jednorazowym tokenem (1 h, brak enumeracji kont – zgodnie z P06). **MFA (TOTP) obowiązkowe dla admina i mentora**, opcjonalne dla ucznia.
- **Autoryzacja:** role (`ROLE_MENTEE/MENTOR/ADMIN`) + Voters na zasobach; zasada najmniejszych uprawnień; IDOR chronione voterami i testami.
- **Aplikacja:** CSRF na wszystkich formularzach, CSP (bez `unsafe-inline`; nonce), `Secure/HttpOnly/SameSite` na cookie, HSTS, ograniczenia rozmiaru i typu uploadu + skan ClamAV + nazwy losowe, walidacja po stronie serwera, sanitacja danych użytkownika, rate limiting (logowanie, wiadomości, wyszukiwarka), filtr kontaktów w wiadomościach (anty-obchodzenie platformy).
- **Dane/RODO:** rejestr przetwarzania, minimalizacja, retencja (np. logi 90 dni), eksport i usunięcie konta (anonimizacja z zachowaniem księgi finansowej – wymóg prawny), szyfrowanie w spoczynku i tranzycie, hosting w UE, umowy powierzenia z dostawcami.
- **Łańcuch dostaw:** `composer audit` w CI (blokada przy lukach), Dependabot/Renovate, `composer.lock` w repo, podpisane obrazy, minimalne obrazy bazowe, skan obrazów (Trivy). Utrzymanie bieżących wydań PHP/FrankenPHP (ostatnie wydania zawierały poprawki bezpieczeństwa).
- **Sekrety:** Symfony Secrets (vault) + zmienne środowiskowe z menedżera sekretów; zero sekretów w repo i logach; rotacja kluczy.
- **Audyt:** niezmienny `audit_log` (kto/co/kiedy/z jakiej sesji) dla decyzji adminów, zmian płatności, wypłat, zawieszeń.

---

## 11. Infrastruktura, wdrożenia i obserwowalność

- **Środowiska:** local (Docker Compose: PG18, Redis, Mailpit, PgBouncer), CI, staging (odwzorowanie produkcji), production. Konfiguracja przez zmienne środowiskowe (12-factor); jeden artefakt (obraz) przechodzi przez wszystkie środowiska.
- **Obraz produkcyjny:** FrankenPHP, `opcache` + preloading, `APP_ENV=prod`, `composer install --no-dev --classmap-authoritative`, kompilowane zasoby AssetMapper, uruchamianie jako użytkownik nie-root, odczyt-only FS.
- **Worker mode:** włączamy po audycie (brak mutowalnego stanu statycznego, reset usług z `ResetInterface`, limit `max_requests`, monitoring pamięci).
- **Procesy:** `messenger:consume` (kolejki: `async`, `payments`, `notifications`, `scheduler`) jako osobne procesy/kontenery z nadzorem i limitami pamięci; `Scheduler` dla zadań cyklicznych (wygasanie draftów i próśb, przypomnienia, rekoncyliacja, retencja).
- **Wdrożenia:** CD z automatycznym `migrate` przed przełączeniem ruchu, wdrożenia rolling/blue-green, szybki rollback (migracje kompatybilne wstecz – §4.9), feature flags.
- **Obserwowalność:** logi JSON z `correlation_id`/`user_id`(hash)/`booking_id`; metryki RED (rate, errors, duration) i biznesowe (konwersja rezerwacji, odsetek odrzuconych płatności, no-show); ślady OpenTelemetry (HTTP → DB → Stripe/LiveKit); alerty na SLO.
- **SLO (propozycja):** dostępność 99,9% (miesięcznie), p95 odpowiedzi HTML < 300 ms, błędy płatności po stronie platformy < 0,1%, opóźnienie powiadomień < 5 s.
- **Skalowanie:** poziome (bezstanowe kontenery aplikacji), baza pionowo + repliki odczytu dopiero po pomiarach; cache HTTP dla stron publicznych (P01–P03) i `ETag`.

---

## 12. Standardy inżynieryjne

### 12.1 Proces
- **SDD** (z `AGENTS.md`): specyfikacja w `.ai/specs/` przed implementacją; po wdrożeniu → `implemented/`. Ta specyfikacja jest nadrzędna wobec kolejnych w kwestiach stacku; zmianę wymaga nowego ADR (`docs/adr/NNNN-slug.md`, format MADR) i zgody użytkownika.
- **Trunk-based development:** krótkie gałęzie `feat|fix|chore/<slug>`, PR ≤ ~400 zmienionych linii, scalanie squash. Flagi funkcji zamiast długich gałęzi.
- **Commity:** Conventional Commits (`feat(booking): …`), po angielsku, w trybie rozkazującym; agenci nie commitują bez prośby (reguła z `AGENTS.md`).
- **Przegląd kodu:** ≥ 1 zatwierdzenie; lista kontrolna PR: spec/AC spełnione, testy, migracja przejrzana, bezpieczeństwo (voters, walidacja), a11y, i18n, logi bez PII, wpływ na wydajność (zapytania N+1), dokumentacja.
- **Definition of Done:** kod + testy zielone w CI + migracja zweryfikowana na czystej bazie + stany loading/empty/error/success obsłużone + a11y sprawdzone + tłumaczenia PL/EN + metryki/logi dodane + spec przeniesiona do `implemented/` + wnioski w `.ai/lessons`.

### 12.2 Potok CI (bramki blokujące merge)
1. `composer validate --strict`, `composer audit`.
2. Styl: **PHP-CS-Fixer** lub **ECS** z regułami `@PER-CS3.0` + `@Symfony` (+ `declare_strict_types`, `final_class`, `ordered_imports`).
3. **PHPStan** poziom `max` z rozszerzeniami Symfony/Doctrine/PHPUnit i baseline tylko dla długu istniejącego (baseline nie rośnie).
4. **Rector** (tryb dry-run) – zestawy aktualizacji PHP/Symfony/Doctrine.
5. **Deptrac** – granice modułów i warstw (§3.2).
6. Lintery: `lint:yaml`, `lint:twig`, `lint:container`, `lint:translations`, `doctrine:schema:validate`, test migracji na czystej bazie PG18.
7. Testy PHPUnit (zob. 12.3) z progiem pokrycia: **domena ≥ 90%, aplikacja ≥ 80%, ogółem ≥ 75%** (liczone liniami i gałęziami); mutation testing (**Infection**) dla `Domain` w nocnym buildzie, MSI ≥ 70%.
8. Front: `tsc --noEmit`, ESLint/Prettier (kod klienta), build zasobów.
9. E2E (Playwright) na kluczowych ścieżkach (patrz 12.3) – w PR dla zmian dotykających te ścieżki, nocą pełny zestaw.
10. Skan obrazu i zależności (Trivy), SAST (np. Semgrep/CodeQL).

### 12.3 Strategia testów
| Poziom | Zakres | Narzędzia |
|---|---|---|
| Jednostkowe | Domena: polityki, value objects, maszyny stanów, generator slotów | PHPUnit (`^11.5` już w projekcie), data providers |
| Integracyjne | Repozytoria na **prawdziwym PostgreSQL** (nie SQLite/mock), constraint exclusion, migracje, handlery | PHPUnit + `dama/doctrine-test-bundle`, `zenstruck/foundry` do fabryk |
| Funkcjonalne | Kontrolery i formularze, Voters, bezpieczeństwo | `WebTestCase`, BrowserKit (w projekcie) |
| Kontraktowe | Adaptery Stripe/LiveKit (nagrane odpowiedzi, podpisy webhooków), idempotencja | fake’i + testy kontraktu portu |
| E2E | **Uczeń:** szukaj → profil → rezerwacja → płatność → sala → opinia; **Mentor:** kreator → weryfikacja admina → dostępność → akceptacja → wypłata; **Admin:** decyzje | Playwright + axe (a11y) |
| Wydajnościowe | Wyszukiwarka, generowanie slotów, szczyt rezerwacji | k6, `EXPLAIN (ANALYZE)` dla krytycznych zapytań |
| Współbieżność | Dwie jednoczesne rezerwacje tego samego slotu → dokładnie jedna sukces | test integracyjny z równoległymi połączeniami |

Zasady: testy deterministyczne (`MockClock`), brak sieci w testach jednostkowych, każdy błąd produkcyjny = test regresyjny, nazwy testów opisują zachowanie (`it_refunds_fully_when_cancelled_more_than_24h_before`).

---

## 13. Coding standards

### 13.1 PHP
1. `declare(strict_types=1);` w każdym pliku. Pełne typowanie parametrów, zwrotów i właściwości; `mixed` zabronione bez uzasadnienia w komentarzu.
2. Klasy domyślnie `final`; wartości i DTO `final readonly`; promowane właściwości konstruktora; enumy backed zamiast stałych/stringów; `match` zamiast długich `switch`; first-class callable syntax; funkcje z PHP 8.4/8.5 (np. property hooks, asymetryczna widoczność, `array_find`) stosujemy tam, gdzie upraszczają kod i wspiera je min. wersja z `composer.json`.
3. Zależności wyłącznie przez konstruktor (autowiring); zakaz `ContainerInterface`/service locatora w kodzie aplikacji, zakaz `static` i singletonów z mutowalnym stanem (krytyczne dla worker mode).
4. **Czas:** wyłącznie `Symfony\Component\Clock\ClockInterface`; zakaz `new \DateTime()`, `time()`, `date()`.
5. **Wyjątki:** wyjątki domenowe nazwane semantycznie (`SlotAlreadyTaken`, `CancellationNotAllowed`) dziedziczące po module-specyficznej bazie; nie łapiemy `\Throwable` poza granicami (middleware, kontroler błędów); komunikaty dla użytkownika przez klucze tłumaczeń.
6. **Nazewnictwo:** klasy `PascalCase`, metody/zmienne `camelCase`, stałe/enum-case `PascalCase` dla enumów, pliki = nazwa klasy (PSR-4), interfejsy bez przyrostka `Interface` dla portów domenowych (np. `PaymentGateway`), handlery `<Command>Handler`, komendy w trybie rozkazującym (`ConfirmBooking`), zdarzenia w czasie przeszłym (`BookingConfirmed`).
7. Metody ≤ ~30 linii, klasy ≤ ~300 linii, złożoność cyklomatyczna ≤ 10 (egzekwowane PHPStan/phpmd); brak „god service”; DRY stosujemy po trzecim powtórzeniu.
8. Komentarze wyjaśniają **dlaczego**, nie **co**; PHPDoc tylko tam, gdzie typ natywny nie wystarcza (generyki, kształty tablic). Kod i identyfikatory po angielsku, komunikaty użytkownika po polsku/angielsku z tłumaczeń.
9. Brak logiki w konstruktorach poza walidacją niezmienników; brak efektów ubocznych w getterach.

### 13.2 Doctrine/SQL
- Encje: atrybuty, `underscore_number_aware` (już skonfigurowane), identyfikatory UUID v7, `private` właściwości, brak publicznych setterów (metody zachowań: `$booking->confirm()`).
- Brak logiki w lifecycle callbackach; brak `EAGER` globalnie; **zakaz N+1** (fetch join / dedykowane zapytania odczytu), zakaz `findAll()` na dużych tabelach; paginacja **keyset** dla list rosnących (wiadomości, transakcje).
- Zapytania odczytu o złożonych projekcjach: DBAL/DQL → DTO (`NEW` / `SELECT NEW`), nie hydratacja pełnych encji.
- Każde zapytanie wyszukiwania i listowania ma indeks i sprawdzony plan (`EXPLAIN`); migracje przeglądane pod kątem blokad (`ALTER TABLE` na dużych tabelach).
- Surowy SQL tylko z parametrami (zero konkatenacji).

### 13.3 Symfony
- Kontrolery: cienkie, `final`, jedna akcja = jedna ścieżka, atrybut `#[Route]`, wejście przez `#[MapRequestPayload]`/`#[MapQueryString]` do DTO z `#[Assert\…]`, wyjście Twig lub JSON z DTO (nigdy encja). `#[IsGranted]`/Voters na akcjach.
- Konfiguracja w PHP/YAML w `config/`, parametry z env, brak `%env()%` w kodzie domeny; tagowane serwisy zamiast ręcznych rejestrów.
- Zdarzenia Symfony tylko dla spraw infrastruktury; zdarzenia domenowe przez outbox/Messenger.
- Formularze: klasy `FormType` per formularz, dane w DTO, nie w encji.
- Logowanie: PSR-3 z kontekstem strukturalnym; poziomy: `error` wymaga reakcji, `warning` degradacja, `info` zdarzenia biznesowe; **zakaz logowania PII, tokenów, danych kart**.
- API JSON (webhooki, endpointy pomocnicze, w przyszłości mobile): prefiks `/api/v1`, błędy **RFC 7807** (`application/problem+json`), jawna wersja, kontrakt w OpenAPI generowany z DTO; **API Platform nie wchodzi do MVP** (UI jest HTML-first; unikamy automatycznego wystawiania encji) – wracamy do tematu przy aplikacji mobilnej.

### 13.4 Twig / HTML / CSS / JS-TS
- Twig bez logiki biznesowej (tylko prezentacja); komponenty dla powtarzalnych fragmentów; autoescape zawsze (`|raw` zabronione bez przeglądu).
- HTML semantyczny, formularze z `<label>`, przyciski jako `<button>`, nawigacja z `aria-current`.
- CSS: tokeny (kolory, odstępy) w jednym miejscu; mobile-first; brak `!important`.
- TS: `strict: true`, brak `any`, moduły ES, jeden kontroler Stimulus = jedna odpowiedzialność, brak globalnego stanu, cleanup w `disconnect()`.

### 13.5 Baza i migracje (skrót do `AGENTS.md`)
Jak w §4; dodatkowo: nazwy tabel liczba mnoga/`snake_case`, klucze obce `<tabela>_id`, indeksy `idx_<tabela>_<kolumny>`, ograniczenia `chk_`/`uniq_`/`excl_`.

---

## 14. Plan realizacji (podział na kolejne specyfikacje)

Każdy punkt = osobna specyfikacja w `.ai/specs/` (SDD), zależności jak kolejność.

| # | Specyfikacja (slug) | Zawartość | Wynik |
|---|---|---|---|
| 0 | `platform-foundation` | PHP 8.5/Symfony 7.4, PG18 + PgBouncer w Compose, FrankenPHP, CI z bramkami z §12.2, Deptrac, struktura modułów, Messenger/Scheduler, Mercure, obserwowalność | Zielony pipeline na pustym szkielecie |
| 1 | `identity-and-access` | Rejestracja, logowanie, role, MFA, reset hasła, ustawienia (P04–P06, S01) | Konta i bezpieczeństwo |
| 2 | `mentor-onboarding-and-moderation` | Kreator M01, upload dokumentów, A01, audit log | Weryfikacja mentorów |
| 3 | `catalog-and-search` | Profil publiczny P03, wyszukiwarka P02, ulubieni, read model | Odkrywanie mentorów |
| 4 | `scheduling` | Dostępność M03, generator slotów, constraint | Terminy |
| 5 | `booking-and-payments` | U03–U05, Stripe, ledger, polityki zwrotów, M04 | Rezerwacja z płatnością |
| 6 | `video-sessions` | U07–U08, LiveKit, no-show | Sesje online |
| 7 | `messaging-and-notifications` | U10, S02, Mercure, e-mail | Komunikacja |
| 8 | `reviews-and-payouts` | U09, M06, transfery T+7, rekoncyliacja | Zamknięcie obiegu |
| 9 | `admin-disputes-and-users` | A02, A03, spory ze zwrotami | Operacje |
| 10 | `hardening-and-launch` | Testy obciążeniowe, a11y audyt, pentest, runbooki, DR | Gotowość produkcyjna |

---

## 15. Ryzyka i otwarte pytania (wymagają decyzji użytkownika)

| ID | Pytanie / ryzyko | Rekomendacja |
|---|---|---|
| Q1 | Hosting (dostawca, region UE, zarządzany PostgreSQL czy własny), cele RPO/RTO, budżet | Zarządzany PG w UE z PITR; kontenery na platformie zarządzanej (nie Kubernetes na starcie) |
| Q2 | Aspekty prawne i podatkowe: VAT od prowizji, faktury, DAC7, regulamin, zwroty, statuty mentorów (B2B/B2C) | Konsultacja z prawnikiem/księgową **przed** specyfikacją 5 |
| Q3 | Nazwa: „DevMentor” (repozytorium) vs „MentorHub” (koncepcja); profil produktu (ogólny mentoring czy tech) | Ujednolicić; wpływa na treści, tematy i SEO |
| Q4 | Nagrywanie sesji, czat wideo w sali (DataChannel vs Mercure), obsługa grup | Poza MVP; 1:1 bez nagrywania |
| Q5 | Podniesienie `composer.json` do PHP `>=8.4` i uruchamianie 8.5; ujednolicenie PG (17/16 → 18) | Zrobić w specyfikacji 0 |
| Q6 | Kompilacja TypeScript w AssetMapper (brak natywnej; opcje: dedykowany bundle, wstępny `tsc`/esbuild) | Krótki spike (≤1 dzień) w specyfikacji 0 |
| Q7 | Wybór dostawcy wideo na podstawie realnych cen i SLA (dane o cenach pochodzą z jednego wydawcy) | Prototyp na LiveKit; port pozwala zmienić |
| Q8 | Tryb autoryzacji vs przechwycenia płatności dla ręcznej akceptacji (limit czasu autoryzacji karty) | Potwierdzić z dokumentacją Stripe w specyfikacji 5 |
| Q9 | Worker mode FrankenPHP: ryzyko stanu współdzielonego i wycieków pamięci | Start w trybie klasycznym; włączenie po audycie i testach obciążeniowych |
| Q10 | Migracja Symfony 7.4 → 8.4 LTS (premiera ~11.2027) | Zero deprecacji w CI (`SYMFONY_DEPRECATIONS_HELPER=max[total]=0`) od dnia 0 |

---

## 16. Proponowane zmiany w `AGENTS.md` (po akceptacji; **nie zastosowane**)

1. Podnieść wiersz „PHP” do: PHP 8.5 (min. `>=8.4`), Symfony 7.4 LTS, PostgreSQL 18.
2. Doprecyzować akapit o PgBouncerze: od wersji 1.21 obsługuje nazwane prepared statements w trybie `transaction` (przy `max_prepared_statements` > 0), więc ograniczenie dotyczy stanu sesji (`SET`, sesyjne advisory locks, `LISTEN/NOTIFY`), a nie prepared statements w ogóle.
3. Dodać odwołanie do tej specyfikacji jako nadrzędnej w sprawach stacku oraz skróty reguł z §13 (strict types, `ClockInterface`, `final`, brak `static`, Deptrac, brak encji w odpowiedziach).
4. Dopisać komendy CI (`composer qa`: cs-fixer, phpstan, deptrac, phpunit) po wykonaniu specyfikacji 0.

---

## Źródła researchu (dostęp 2026-10-25)

- PHP: [Latest PHP Version (October 2026)](https://www.snazzy.solutions/blog/wordpress/latest-php-version), [PHP End of Life Dates and Supported Versions in 2026](https://no7software.co.uk/blog/php-end-of-life-supported-versions), [Current PHP Versions (Zend)](https://www.zend.com/resources/php-versions)
- Symfony: [Preparing for Symfony 7.4 and 8.0](https://symfony.com/blog/preparing-for-symfony-7-4-and-symfony-8-0), [Symfony releases](https://symfony.com/releases), [Symfony LTS Versions 2026](https://wolf-tech.io/blog/symfony-lts-versions-which-version-for-which-project-and-how-long-is-it-safe)
- PostgreSQL/PgBouncer: [PostgreSQL 18.6 release notes](https://www.postgresql.org/docs/current/release-18-6.html), [PgBouncer changelog](https://www.pgbouncer.org/changelog.html)
- FrankenPHP: [Running Symfony with FrankenPHP](https://frankenphp.dev/docs/symfony/), [FrankenPHP in Production (PHP Architect)](https://www.phparch.com/2026/07/frankenphp-in-production-worker-mode-embedded-binaries-and-real-performance/), [FrankenPHP in Production (wolf-tech)](https://wolf-tech.io/blog/frankenphp-in-production-modern-php-deployment-without-php-fpm)
- Stripe Connect: [Understand how charges work in a Connect integration](https://docs.stripe.com/connect/charges), [Separate charges and transfers](https://edge-docs.stripe.com/connect/marketplace/tasks/accept-payment/separate-charges-and-transfers)
- Wideo: [Daily.co Alternatives 2026](https://www.forasoft.com/blog/article/daily-co-alternative), [Twilio Video Migration 2026](https://www.forasoft.com/blog/article/twilio-video-migration-guide)

**Zakres weryfikacji:** researchem potwierdzono wersje i wsparcie PHP, Symfony, PostgreSQL, PgBouncera, tryb pracy FrankenPHP z Symfony 7.4, typy opłat Stripe Connect oraz orientacyjne ceny wideo. Pozostałe elementy (narzędzia QA, wzorce, konfiguracje bibliotek, limity autoryzacji kart, kompilacja TS) wynikają z wiedzy własnej i wymagają potwierdzenia przy implementacji.
