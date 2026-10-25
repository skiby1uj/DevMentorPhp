# 04. Specyfikacja ekranów

## Konwencje wspólne

**Stany** (każdy ekran danych implementuje je jednolicie):
- **loading** – szkielety (skeleton) zamiast spinnera pełnoekranowego; przyciski akcji w trakcie wywołania mają spinner i są zablokowane (zapobiega podwójnym wysyłkom).
- **empty** – ilustracja/ikona + jednozdaniowe wyjaśnienie + główna akcja naprawcza (CTA).
- **error** – komunikat w języku użytkownika, kod błędu w szczegółach, przycisk „Spróbuj ponownie”; błędy walidacji pokazywane przy polach (`aria-describedby`), nie tylko kolorem.
- **success** – toast (akcje drobne) lub ekran/baner potwierdzenia (akcje krytyczne: płatność, wniosek).

**API:** REST/JSON, prefiks `/api/v1`, uwierzytelnianie: cookie sesyjne HttpOnly + CSRF (alternatywnie JWT). Błędy w formacie RFC 7807 (`type, title, status, errors{pole:[komunikaty]}`). Paginacja kursorowa (`?cursor=&limit=`). Czasy w UTC (ISO 8601), prezentowane w strefie użytkownika. Pełny katalog: `05-katalog-api.md`.

**Walidacje typowe:** e-mail (RFC, ≤254 zn.), hasło ≥8 zn. + litera + cyfra, imię 2–60 zn., pola tekstowe przycinane (trim) i escapowane po stronie serwera; walidacja klienta jest uzupełnieniem, nie zamiennikiem walidacji serwera.

---

## Strony publiczne

### P01 Strona główna
- **Cel:** przekonać do użycia platformy i zaprowadzić do wyszukiwarki.
- **Funkcje:** wyszukiwanie po temacie, popularne kategorie, „Jak to działa” (3 kroki), wyróżnieni mentorzy, opinie, CTA „Zostań mentorem”.
- **Komponenty:** Header, SearchBar z podpowiedziami, CategoryChips, MentorCard (x4), StepsList, TestimonialCard, Footer.
- **Stany:** loading – skeleton kart mentorów; empty – ukryta sekcja wyróżnionych, zostaje wyszukiwarka; error – baner „Nie udało się wczytać polecanych mentorów” + ponów (reszta strony działa); success – n/d.
- **Walidacje:** zapytanie ≤100 zn.; puste zapytanie przenosi do pełnej listy.
- **API:** `GET /topics`, `GET /mentors?featured=true&limit=4`, `GET /testimonials`.

### P02 Wyszukiwarka mentorów
- **Cel:** znaleźć dopasowanego mentora.
- **Funkcje:** wyszukiwanie tekstowe, filtry (temat, maks. cena, język, min. ocena, dostępny w 24h), sortowanie (polecani, cena↑↓, ocena), „Pokaż więcej”, dodanie do ulubionych, licznik wyników, zapamiętanie filtrów w URL.
- **Komponenty:** FilterPanel (drawer na mobile), SearchInput, SortSelect, MentorCard (avatar, nagłówek, ocena, cena, tagi, serce), ResultsCount, LoadMore.
- **Stany:** loading – 6 szkieletów kart; empty – „Brak mentorów dla tych filtrów” + „Wyczyść filtry”; error – baner z ponowieniem, filtry zachowane; success – toast po dodaniu do ulubionych.
- **Walidacje:** cena 0–1000, ocena 0–5, nieznane parametry URL ignorowane; serce dla gościa → P04.
- **API:** `GET /mentors?q&topic&price_max&lang&rating_min&available_within=24h&sort&cursor`, `GET /topics`, `PUT|DELETE /me/favorites/{mentorId}`.

### P03 Profil mentora
- **Cel:** zbudować zaufanie i skłonić do rezerwacji.
- **Funkcje:** nagłówek (zdjęcie, weryfikacja, ocena), opis, doświadczenie, tematy i języki, rozkład ocen i lista opinii, najbliższe terminy, karta rezerwacji (cena, próbna), ulubione, „Napisz wiadomość”, zgłoś profil.
- **Komponenty:** ProfileHeader, VideoIntro (placeholder), TagList, ExperienceTimeline, RatingBreakdown, ReviewItem, StickyBookingCard, ReportDialog.
- **Stany:** loading – skeleton nagłówka/treści; empty – brak opinii: „Ten mentor nie ma jeszcze opinii – lekcja próbna to dobry początek”; error – 404 „Mentor niedostępny” lub błąd sieci z ponowieniem; success – toast przy ulubionych/zgłoszeniu.
- **Walidacje:** zgłoszenie – powód wymagany, opis ≤500 zn.; akcje chronione (rezerwacja, wiadomość) wymagają logowania.
- **API:** `GET /mentors/{id}`, `GET /mentors/{id}/reviews?cursor`, `GET /mentors/{id}/availability?from&to&tz`, `PUT|DELETE /me/favorites/{id}`, `POST /reports`.

### P04 Logowanie
- **Cel:** zalogować użytkownika i wrócić do przerwanej akcji.
- **Funkcje:** e-mail + hasło, „Pokaż hasło”, „Nie pamiętam hasła”, logowanie społecznościowe (Google, opcjonalnie), `returnTo`.
- **Komponenty:** AuthCard, TextField, PasswordField, Button, SocialButton, InlineAlert.
- **Stany:** loading – przycisk ze spinnerem; empty – n/d; error – „Nieprawidłowy e-mail lub hasło” (bez ujawniania, które), konto zablokowane, limit prób (429); success – przekierowanie wg roli.
- **Walidacje:** e-mail poprawny, hasło wymagane; rate-limit 5 prób/15 min + CAPTCHA po przekroczeniu.
- **API:** `POST /auth/login`, `GET /auth/me`, `GET /auth/oauth/google`.

### P05 Rejestracja
- **Cel:** założyć konto ucznia lub mentora.
- **Funkcje:** wybór roli, imię, e-mail, hasło (miernik siły), zgody (regulamin obowiązkowy, marketing opcjonalny).
- **Komponenty:** RoleSegmentedControl, TextField, PasswordField + StrengthMeter, Checkbox, Button.
- **Stany:** loading – spinner; empty – n/d; error – e-mail zajęty, błędy pól; success – uczeń → U01, mentor → M01; wysłany e-mail weryfikacyjny.
- **Walidacje:** imię 2–60; e-mail unikalny; hasło ≥8, litera+cyfra; zgoda na regulamin wymagana.
- **API:** `POST /auth/register`, `POST /auth/verify-email`, `POST /auth/resend-verification`.

### P06 Reset hasła
- **Cel:** odzyskać dostęp.
- **Funkcje:** wysłanie linku; (osobny widok) ustawienie nowego hasła z tokenu.
- **Komponenty:** AuthCard, TextField, InlineAlert.
- **Stany:** loading; empty n/d; error – token wygasły, błędy pól; success – „Jeśli konto istnieje, wysłaliśmy link” (zawsze ta sama odpowiedź – brak enumeracji kont).
- **Walidacje:** e-mail poprawny; nowe hasło jak w P05; token jednorazowy, ważny 1 h.
- **API:** `POST /auth/password-reset/request`, `POST /auth/password-reset/confirm`.

---

## Uczeń

### U01 Onboarding ucznia
- **Cel:** zebrać preferencje do rekomendacji (można pominąć).
- **Funkcje:** 3 kroki: cel, poziom/budżet, preferowane pory; pasek postępu; „Pomiń”.
- **Komponenty:** Stepper, OptionCard (radio), Select, Slider, CheckboxGroup.
- **Stany:** loading – zapis preferencji; empty n/d; error – zapis nieudany, można kontynuować i spróbować później; success – przejście do U02 z rekomendacjami.
- **Walidacje:** wybór celu wymagany; budżet 20–500 zł.
- **API:** `PUT /me/preferences`, `GET /mentors?recommended_for=me`.

### U02 Dashboard ucznia
- **Cel:** centrum: co dalej i jak szybko wrócić do nauki.
- **Funkcje:** najbliższa sesja z odliczaniem i „Dołącz” (aktywne 10 min przed), zadania do zrobienia (np. wystaw opinię), rekomendowani mentorzy, statystyki (liczba sesji, godziny).
- **Komponenty:** UpcomingSessionCard, TaskList, StatTile, MentorCard, Banner.
- **Stany:** loading – skeletony; empty – „Nie masz zaplanowanych sesji” + „Znajdź mentora”; error – ponów per sekcja; success – baner po zapisaniu opinii/rezerwacji.
- **Walidacje:** „Dołącz” dostępne tylko w oknie czasowym sesji.
- **API:** `GET /me/dashboard`, `GET /bookings?status=upcoming&limit=1`, `GET /mentors?recommended_for=me`.

### U03 Rezerwacja (wybór terminu)
- **Cel:** wybrać typ lekcji i termin.
- **Funkcje:** typ (próbna 30 min / pojedyncza 60 min / pakiet 5 lekcji −10%), kalendarz tygodniowy z terminami w strefie ucznia, wiadomość do mentora, podsumowanie ceny.
- **Komponenty:** LessonTypeRadio, WeekCalendar, SlotButton, TextArea (licznik), PriceSummary, ProgressBar.
- **Stany:** loading – skeleton kalendarza; empty – „Brak wolnych terminów w tym tygodniu” + następny tydzień / wiadomość do mentora; error – termin zajęty w międzyczasie (409) → odśwież terminy; success – przejście do U04.
- **Walidacje:** termin wymagany; wiadomość ≤500 zn.; termin ≥2 h w przyszłość; ponowna weryfikacja dostępności po stronie serwera.
- **API:** `GET /mentors/{id}`, `GET /mentors/{id}/availability`, `POST /bookings/draft` (rezerwuje slot na 10 min).

### U04 Płatność
- **Cel:** bezpiecznie opłacić rezerwację.
- **Funkcje:** zapisana lub nowa karta, kod promocyjny, podsumowanie, zgoda na regulamin i politykę zwrotów, blokada środków (escrow).
- **Komponenty:** OrderSummary, CardForm (tokenizacja przez dostawcę płatności – dane karty nie dotykają naszego serwera), PromoInput, Checkbox, Button.
- **Stany:** loading – „Przetwarzamy płatność…” (przycisk zablokowany); empty n/d; error – odrzucona karta, wygasły draft slotu, 3-D Secure nieudane; success – U05.
- **Walidacje:** numer karty 16 cyfr (Luhn), data MM/RR niewygasła, CVC 3–4, imię wymagane, regulamin wymagany; kod promo sprawdzany serwerowo.
- **API:** `POST /promo-codes/validate`, `POST /payments/intents`, `POST /bookings` (z `payment_intent_id`), webhook `payment.succeeded`.

### U05 Potwierdzenie rezerwacji
- **Cel:** potwierdzić wynik i wskazać następne kroki.
- **Funkcje:** podsumowanie, „Dodaj do kalendarza” (.ics), „Napisz do mentora”, link do sesji.
- **Komponenty:** SuccessHero, SummaryCard, Button.
- **Stany:** success – „Zarezerwowano” lub „Prośba wysłana – mentor odpowie w 24 h”; loading – oczekiwanie na webhook płatności; error – płatność niepotwierdzona (instrukcja i kontakt); empty n/d.
- **Walidacje:** n/d (dostęp tylko do własnej rezerwacji).
- **API:** `GET /bookings/{id}`, `GET /bookings/{id}/ics`.

### U06 Moje sesje
- **Cel:** przegląd wszystkich sesji.
- **Funkcje:** zakładki Nadchodzące / Zakończone / Anulowane, akcje szybkie (Dołącz, Szczegóły, Opinia).
- **Komponenty:** Tabs, SessionRow, StatusBadge, Pagination.
- **Stany:** loading – skeleton wierszy; empty – osobny komunikat per zakładka; error – ponów; success – toast po anulowaniu/zmianie.
- **Walidacje:** n/d.
- **API:** `GET /bookings?status=&cursor`.

### U07 Szczegóły sesji
- **Cel:** zarządzać pojedynczą sesją.
- **Funkcje:** dane sesji i mentora, wejście do sali, zmiana terminu, anulowanie z polityką zwrotu, notatki, opinia, rezerwacja ponownie, zgłoszenie problemu.
- **Komponenty:** SessionHeader, MentorMiniCard, ActionBar, Modal (reschedule/cancel), NotesPanel, PolicyNotice.
- **Stany:** loading; empty – brak notatek; error – 404/403, błąd akcji (np. za późno na zmianę); success – toast + odświeżenie.
- **Walidacje:** anulowanie – powód wymagany; zmiana terminu – nowy slot wymagany i wolny; akcje zależne od statusu i czasu.
- **API:** `GET /bookings/{id}`, `POST /bookings/{id}/reschedule`, `POST /bookings/{id}/cancel`, `GET|PUT /sessions/{id}/notes`, `POST /reports`.

### U08 Sala wideo
- **Cel:** przeprowadzić sesję.
- **Funkcje:** wideo 1:1, mikrofon/kamera, udostępnianie ekranu, czat, wspólne notatki, licznik czasu, test urządzeń przed wejściem, zakończenie.
- **Komponenty:** VideoTile x2, ControlBar, ChatPanel, NotesPanel, Timer, DeviceCheckDialog, ConnectionIndicator.
- **Stany:** loading – „Łączenie…” + test sprzętu; empty – „Czekamy na drugą osobę” (+ sygnał no-show po 10 min); error – brak uprawnień kamery, utrata połączenia (auto-reconnect), błąd tokena; success – po zakończeniu: przekierowanie do U09 (uczeń) / M02 (mentor).
- **Walidacje:** wejście tylko w oknie [start−10 min, koniec+15 min]; tylko uczestnicy; czat ≤1000 zn.
- **API:** `POST /sessions/{id}/join` (token WebRTC), `POST /sessions/{id}/end`, `WS /sessions/{id}/chat`, `PUT /sessions/{id}/notes`.

### U09 Opinia po sesji
- **Cel:** zebrać ocenę sesji.
- **Funkcje:** ocena 1–5, komentarz, tagi („jasno tłumaczy”), publiczna/prywatna uwaga do platformy.
- **Komponenty:** StarRating, TextArea, TagChips, Button.
- **Stany:** loading – wysyłka; empty n/d; error – błędy walidacji, opinia już istnieje (409); success – podziękowanie + powrót do U02.
- **Walidacje:** ocena wymagana; komentarz ≤1000 zn. (zalecane ≥10); filtr treści wulgarnych po stronie serwera.
- **API:** `POST /sessions/{id}/review`, `GET /sessions/{id}/review`.

### U10 Wiadomości
- **Cel:** komunikacja uczeń–mentor.
- **Funkcje:** lista rozmów z licznikiem nieprzeczytanych, wątek, wysyłanie, wskaźnik pisania, szybka rezerwacja z wątku.
- **Komponenty:** ConversationList, MessageBubble, Composer, TypingIndicator, UnreadBadge.
- **Stany:** loading – skeleton listy; empty – „Nie masz jeszcze wiadomości” + znajdź mentora; error – wiadomość nieudana z „Wyślij ponownie”; success – status „wysłano/przeczytano”.
- **Walidacje:** treść niepusta (po trim), ≤2000 zn.; filtr danych kontaktowych (ochrona przed omijaniem platformy); rate-limit.
- **API:** `GET /conversations`, `GET /conversations/{id}/messages`, `POST /conversations/{id}/messages`, `POST /conversations/{id}/read`, `WS /ws`.

### U11 Ulubieni mentorzy
- **Cel:** szybki powrót do wybranych mentorów.
- **Funkcje:** lista, usuwanie, rezerwacja, profil.
- **Komponenty:** MentorCard, ConfirmToast (cofnij).
- **Stany:** loading; empty – „Nie masz ulubionych” + wyszukiwarka; error – ponów; success – toast z „Cofnij”.
- **Walidacje:** n/d.
- **API:** `GET /me/favorites`, `DELETE /me/favorites/{id}`.

### U12 Płatności i pakiety
- **Cel:** zarządzanie finansami ucznia.
- **Funkcje:** metody płatności (dodaj/usuń/domyślna), saldo pakietów lekcji, historia i faktury (PDF).
- **Komponenty:** Tabs, CardListItem, CardForm, PackageCard, InvoiceTable.
- **Stany:** loading; empty – brak kart / brak pakietów / brak faktur; error – nie udało się dodać karty; success – toast.
- **Walidacje:** jak w U04; nie można usunąć karty powiązanej z przyszłą rezerwacją.
- **API:** `GET|POST /me/payment-methods`, `DELETE /me/payment-methods/{id}`, `GET /me/packages`, `GET /me/invoices`, `GET /me/invoices/{id}/pdf`.

---

## Mentor

### M01 Kreator profilu mentora / weryfikacja
- **Cel:** stworzyć profil i przejść weryfikację.
- **Funkcje:** 4 kroki (podstawy, tematy/cena, dokumenty, podsumowanie), zapis roboczy, status wniosku (szkic / w weryfikacji / do poprawy / zatwierdzony), edycja profilu po akceptacji.
- **Komponenty:** Stepper, TextField, TextArea (licznik), ChipSelect, NumberField, FileUpload, ProfilePreview, StatusBanner.
- **Stany:** loading – wczytanie szkicu / upload pliku; empty – pierwszy raz: pusty kreator; error – błędy pól, plik za duży/zły typ; success – „Wniosek wysłany”.
- **Walidacje:** nagłówek 10–80 zn.; opis 100–1000 zn.; ≥1 temat i ≥1 język; cena 20–300 zł; dokument PDF/JPG ≤5 MB; zgoda na weryfikację.
- **API:** `GET|PUT /mentor/profile`, `POST /mentor/documents`, `POST /mentor/application/submit`, `GET /mentor/application`.

### M02 Dashboard mentora
- **Cel:** przegląd dnia i zadań.
- **Funkcje:** najbliższe sesje, liczba nowych próśb, zarobki miesiąca, status weryfikacji, szybkie akcje.
- **Komponenty:** StatTile, UpcomingList, RequestsBadge, StatusBanner.
- **Stany:** loading; empty – „Brak sesji – uzupełnij dostępność” (CTA do M03); error – ponów; success – baner po akceptacji prośby.
- **Walidacje:** wejście do sali jak w U08.
- **API:** `GET /mentor/dashboard`, `GET /bookings?role=mentor&status=upcoming`.

### M03 Dostępność
- **Cel:** określić, kiedy mentor przyjmuje uczniów.
- **Funkcje:** siatka tygodniowa (klik/przeciąganie), strefa czasowa, bufor między sesjami, tryb rezerwacji (natychmiastowa / ręczna), urlop (blokada dat).
- **Komponenty:** WeekGrid, TimezoneSelect, Toggle, DateRangePicker, SaveBar.
- **Stany:** loading; empty – „Nie masz ustawionej dostępności – profil nie jest widoczny w wyszukiwarce”; error – zapis nieudany; success – toast „Zapisano”.
- **Walidacje:** ≥1 przedział aby profil był publiczny; brak kolizji z istniejącymi rezerwacjami (serwer zwraca konflikt).
- **API:** `GET|PUT /mentor/availability`, `POST /mentor/time-off`.

### M04 Prośby o rezerwację
- **Cel:** obsłużyć prośby w 24 h.
- **Funkcje:** lista próśb (uczeń, termin, wiadomość), akceptuj, odrzuć z powodem, odliczanie do wygaśnięcia.
- **Komponenty:** RequestCard, CountdownBadge, Modal (odrzucenie), Button.
- **Stany:** loading; empty – „Brak nowych próśb”; error – prośba wygasła / termin zajęty; success – toast + wiadomość do ucznia.
- **Walidacje:** odrzucenie – powód wymagany; akceptacja sprawdza kolizje.
- **API:** `GET /bookings?role=mentor&status=pending`, `POST /bookings/{id}/accept`, `POST /bookings/{id}/decline`.

### M05 Moi uczniowie
- **Cel:** pamiętać kontekst współpracy.
- **Funkcje:** lista, wyszukiwanie, liczba sesji, ostatnia sesja, notatki prywatne, wiadomość.
- **Komponenty:** SearchInput, StudentRow, NotesDrawer.
- **Stany:** loading; empty – „Nie masz jeszcze uczniów” + wskazówki jak zwiększyć widoczność; error; success – toast przy notatce.
- **Walidacje:** notatka ≤2000 zn.
- **API:** `GET /mentor/students?q`, `GET|PUT /mentor/students/{id}/notes`.

### M06 Zarobki i wypłaty
- **Cel:** przejrzystość finansowa.
- **Funkcje:** salda (dostępne / oczekujące / wypłacone), wykres miesięczny, transakcje, wniosek o wypłatę, konto bankowe.
- **Komponenty:** StatTile, BarChart, TransactionTable, PayoutForm, IbanField.
- **Stany:** loading; empty – „Brak transakcji”; error – wypłata odrzucona; success – „Wypłata zlecona, dotrze w 1–2 dni”.
- **Walidacje:** kwota ≥50 zł i ≤ dostępne; IBAN poprawny (PL + 26 cyfr, mod 97); dane podatkowe uzupełnione.
- **API:** `GET /mentor/earnings`, `GET /mentor/transactions`, `POST /mentor/payouts`, `PUT /mentor/payout-account`.

---

## Administrator

### A01 Wnioski mentorów
- **Cel:** zatwierdzać jakościowych mentorów.
- **Funkcje:** kolejka z filtrem statusu, podgląd profilu i dokumentów, zatwierdź / poproś o poprawki / odrzuć (powód).
- **Komponenty:** DataTable, DetailPanel, DocumentViewer, DecisionModal, StatusBadge.
- **Stany:** loading; empty – „Kolejka pusta 🎉”; error; success – toast + powiadomienie e-mail do mentora.
- **Walidacje:** odrzucenie/poprawki – komentarz wymagany (≥10 zn.); decyzja zapisywana w audycie.
- **API:** `GET /admin/mentor-applications`, `POST /admin/mentor-applications/{id}/approve|reject|request-changes`.

### A02 Zgłoszenia i spory
- **Cel:** rozstrzygać problemy.
- **Funkcje:** lista z priorytetem, kontekst (sesja, wiadomości), decyzja: oddal / ostrzeż / zawieś; zwrot środków; notatka.
- **Komponenty:** DataTable, SeverityBadge, ContextPanel, DecisionForm.
- **Stany:** loading; empty – brak otwartych zgłoszeń; error; success – toast, zgłaszający dostaje informację.
- **Walidacje:** decyzja i notatka (≥10 zn.) wymagane; zwrot ≤ kwota sesji.
- **API:** `GET /admin/reports`, `POST /admin/reports/{id}/resolve`, `POST /admin/payments/{id}/refund`.

### A03 Użytkownicy
- **Cel:** zarządzanie kontami.
- **Funkcje:** wyszukiwarka, filtr roli, zawieszenie/odblokowanie, podgląd aktywności.
- **Komponenty:** SearchInput, RoleFilter, DataTable, ConfirmDialog.
- **Stany:** loading; empty – brak wyników; error; success – toast.
- **Walidacje:** zawieszenie wymaga powodu; nie można zawiesić własnego konta.
- **API:** `GET /admin/users?q&role`, `POST /admin/users/{id}/suspend|activate`.

---

## Wspólne

### S01 Ustawienia konta
- **Cel:** zarządzanie danymi i prywatnością.
- **Funkcje:** profil (imię, e-mail, strefa czasowa, język), zmiana hasła, powiadomienia (e-mail/push per typ), eksport danych, usunięcie konta.
- **Komponenty:** SectionCard, TextField, Select, Toggle, DangerZone, ConfirmDialog.
- **Stany:** loading; empty n/d; error – błędy pól, błędne aktualne hasło; success – toast „Zapisano”.
- **Walidacje:** imię 2–60; hasło ≥8 zn., zgodność potwierdzenia, różne od dotychczasowego; usunięcie – wpisanie „USUŃ”.
- **API:** `GET|PATCH /me`, `POST /me/password`, `PUT /me/notification-settings`, `POST /me/export`, `DELETE /me`.

### S02 Powiadomienia
- **Cel:** nie przegapić ważnych zdarzeń.
- **Funkcje:** lista (rezerwacje, wiadomości, wypłaty, moderacja), oznacz jako przeczytane, przejście do kontekstu.
- **Komponenty:** NotificationItem, BellBadge, Button.
- **Stany:** loading; empty – „Wszystko przeczytane”; error; success – licznik zerowany.
- **Walidacje:** n/d.
- **API:** `GET /notifications`, `POST /notifications/{id}/read`, `POST /notifications/read-all`, `WS /ws`.
