# 02. Use case'y i przepływy użytkownika

## Lista use case'ów

| ID | Aktor | Use case | Priorytet |
|---|---|---|---|
| UC01 | Gość | Przeglądanie i filtrowanie mentorów | MUST |
| UC02 | Gość | Podgląd profilu mentora (opinie, ceny, dostępność) | MUST |
| UC03 | Gość | Rejestracja (uczeń / mentor) i logowanie, reset hasła | MUST |
| UC04 | Uczeń | Onboarding (cele, poziom, preferencje) i rekomendacje | SHOULD |
| UC05 | Uczeń | Rezerwacja sesji (w tym próbnej) z wyborem terminu | MUST |
| UC06 | Uczeń | Płatność kartą, kod promocyjny, pakiet lekcji | MUST |
| UC07 | Uczeń/Mentor | Odbycie sesji w sali wideo (czat, notatki, udostępnianie ekranu) | MUST |
| UC08 | Uczeń | Wystawienie opinii | MUST |
| UC09 | Uczeń/Mentor | Zmiana terminu / anulowanie sesji wg polityki | MUST |
| UC10 | Uczeń/Mentor | Wiadomości | MUST |
| UC11 | Uczeń | Ulubieni mentorzy | COULD |
| UC12 | Uczeń | Zarządzanie metodami płatności, pakietami, fakturami | SHOULD |
| UC13 | Mentor | Zgłoszenie się jako mentor (kreator profilu + weryfikacja) | MUST |
| UC14 | Mentor | Zarządzanie dostępnością | MUST |
| UC15 | Mentor | Obsługa próśb o rezerwację (akceptacja/odrzucenie) | MUST |
| UC16 | Mentor | Lista uczniów i historia współpracy | SHOULD |
| UC17 | Mentor | Zarobki i wypłaty | MUST |
| UC18 | Admin | Weryfikacja wniosków mentorów | MUST |
| UC19 | Admin | Obsługa zgłoszeń i sporów | MUST |
| UC20 | Admin | Zarządzanie użytkownikami (zawieszanie) | SHOULD |
| UC21 | Wszyscy | Powiadomienia i ustawienia konta | MUST |

## Przepływy end-to-end

### F1. Uczeń: od odkrycia do pierwszej sesji i opinii (ścieżka główna)
1. **P01 Home** – wpisuje temat w wyszukiwarkę → **P02 Wyszukiwarka** (filtry: temat, cena, język, ocena, dostępność).
2. Otwiera **P03 Profil mentora** – czyta opis, opinie, widzi cenę lekcji próbnej.
3. Klika „Umów lekcję próbną”. Gość → **P04 Logowanie / P05 Rejestracja** (po zalogowaniu wraca na rezerwację – `returnTo`).
4. Nowy użytkownik: **U01 Onboarding** (opcjonalny, można pominąć).
5. **U03 Rezerwacja** – wybiera typ lekcji (próbna / 60 min / pakiet 5), termin z kalendarza (w swojej strefie), opcjonalną wiadomość.
6. **U04 Płatność** – karta, kod promocyjny, akceptacja regulaminu. Środki blokowane.
   - Błąd karty → komunikat, ponowna próba (stan error).
7. **U05 Potwierdzenie** – „Zarezerwowano” (lub „Wysłano prośbę” dla mentorów z ręczną akceptacją), dodaj do kalendarza.
8. Przypomnienia 24h i 1h (powiadomienia, e-mail).
9. **U02 Dashboard / U06 Moje sesje** → w czasie sesji „Dołącz” → **U08 Sala**.
10. Po zakończeniu → **U09 Opinia** (gwiazdki obowiązkowe, komentarz opcjonalny) → powrót do **U02**; środki trafiają do mentora.
11. Alternatywa: „Zarezerwuj ponownie” z U07.

### F2. Uczeń: zmiana terminu / anulowanie
U06 → U07 Szczegóły sesji → „Zmień termin” (modal z terminami) lub „Anuluj” (powód obowiązkowy). >24h przed sesją: pełny zwrot; <24h: brak zwrotu (komunikat przed potwierdzeniem). Powiadomienie do mentora.

### F3. Mentor: onboarding → pierwsza sesja → wypłata
1. **P05 Rejestracja** (rola: mentor) → **M01 Kreator profilu**: podstawy → tematy/cena → weryfikacja (dokumenty) → podsumowanie.
2. Wniosek trafia do **A01** (status „W weryfikacji”). Mentor widzi baner statusu w **M02**.
3. Po akceptacji: **M03 Dostępność** (siatka tygodniowa, strefa czasowa).
4. Prośba ucznia pojawia się w **M04 Prośby** → akceptacja/odrzucenie (z powodem). Powiadomienie do ucznia.
5. W terminie: **M02** → „Wejdź do sali” → **U08**.
6. Po sesji: **M06 Zarobki** – saldo oczekujące → dostępne po T+7 → „Wypłać” (min. 50 zł, IBAN).
7. **M05 Uczniowie** – historia, szybki kontakt (**U10**).

### F4. Admin: weryfikacja i moderacja
**A01** lista wniosków (filtr statusu) → podgląd dokumentów → *Zatwierdź* / *Poproś o poprawki* / *Odrzuć* (powód obowiązkowy). **A02** zgłoszenia (np. no-show, niewłaściwe zachowanie) → decyzja: oddal / ostrzeż / zawieś + notatka. **A03** wyszukiwanie użytkowników, zawieszenie/odblokowanie.

### F5. Konto i wsparcie
Reset hasła (P06) → e-mail z linkiem → ustawienie nowego hasła. Ustawienia (S01): profil, strefa czasowa, hasło, powiadomienia, usunięcie konta (RODO).

## Diagram głównej ścieżki (uczeń)

```
P01 ─► P02 ─► P03 ─► [zalogowany?] ─nie─► P04/P05 ─► (U01) ┐
                         │tak                              │
                         └──────────────◄──────────────────┘
                                 ▼
                       U03 Rezerwacja ─► U04 Płatność ─► U05 Potwierdzenie
                                                              │
                      U02 / U06 ─► U07 ─► U08 Sala ─► U09 Opinia ─► U02
```

## Reguły biznesowe (założenia do doprecyzowania)

- Prowizja platformy: 20% (konfigurowalna). Lekcja próbna: 30 min, cena ustalana przez mentora (min. 10 zł).
- Zwrot: pełny >24h przed sesją; w innym wypadku brak. Odwołanie przez mentora: zawsze pełny zwrot + kara reputacyjna.
- No-show ucznia: sesja rozliczona; no-show mentora: zwrot + automatyczne zgłoszenie do A02.
- Wypłata dostępna 7 dni po sesji (okno na spory). Minimalna kwota wypłaty 50 zł.
- Mentor może wybrać tryb: *natychmiastowa rezerwacja* lub *ręczna akceptacja* (do 24h na reakcję).
- Opinie tylko po odbytej płatnej sesji, jedna na sesję, edycja do 7 dni.
