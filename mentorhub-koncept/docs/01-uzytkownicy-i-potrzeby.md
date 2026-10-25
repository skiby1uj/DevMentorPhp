# 01. Użytkownicy systemu i ich potrzeby

Roboczy kod projektu: **MentorHub** – marketplace łączący uczniów (mentees) z mentorami na płatne sesje 1:1 online.
Benchmark funkcjonalny: Preply (wyszukiwarka tutorów, lekcja próbna, rezerwacja z kalendarza, płatność z góry, sala wideo, opinie, pakiety lekcji, wypłaty dla tutorów). Rozwiązania są inspirowane *mechanikami*, a nie identyfikacją wizualną ani treścią.

## Role

| Rola | Kim jest | Główny cel | Kluczowe potrzeby | Główne bolączki do rozwiązania |
|---|---|---|---|---|
| **Gość** | Osoba niezalogowana | Ocenić, czy portal ma sens, zanim założy konto | Zobaczyć mentorów, ceny, opinie bez rejestracji; jasne zasady zwrotów | Zmuszanie do rejestracji przed zobaczeniem oferty; brak zaufania |
| **Uczeń (mentee)** | Osoba szukająca mentora (kariera, programowanie, biznes, języki, nauka) | Znaleźć właściwego mentora i umówić sesję | Filtrowanie po temacie/cenie/języku/dostępności; lekcja próbna; bezpieczna płatność; łatwa zmiana terminu; przypomnienia; kontakt z mentorem; historia i notatki | Niepewność wyboru; strach przed złym dopasowaniem; trudności z strefami czasowymi; niejasne zwroty |
| **Mentor** | Specjalista oferujący sesje | Pozyskać uczniów i zarabiać | Atrakcyjny profil; kontrola nad dostępnością i ceną; potwierdzanie próśb; sala wideo; lista uczniów; przejrzyste zarobki i wypłaty; ochrona przed no-show | Puste kalendarze; no-show; brak widoczności zarobków; czasochłonna administracja |
| **Administrator / moderator** | Zespół platformy | Zapewnić jakość i bezpieczeństwo | Weryfikacja wniosków mentorów; obsługa zgłoszeń i sporów; zarządzanie kontami; wgląd w płatności | Nadużycia (obchodzenie platformy, oszustwa), duże kolejki spraw |
| **System (aktor pomocniczy)** | Płatności, e-mail/push, wideo, kalendarz | Automatyzacja | Webhooki płatności, przypomnienia 24h/1h, auto-zamknięcie sesji, wypłaty T+7 | – |

## Persony (skrót)

- **Kasia, 27 lat, marketing → product management** (uczeń): chce 1 sesji tygodniowo, budżet do 150 zł/h, pracuje do 17:00, więc potrzebuje wieczornych terminów w swojej strefie.
- **Marta, 34 lata, Senior Engineering Manager** (mentor): ma 6 wolnych godzin w tygodniu, chce akceptować prośby ręcznie na początku, zależy jej na terminowych wypłatach.
- **Ola, moderatorka**: dziennie przegląda 20 wniosków i 10 zgłoszeń; potrzebuje listy z priorytetami i szablonów decyzji.

## Wymagania przekrojowe

- Wersja responsywna (mobile-first), strefy czasowe zawsze pokazywane przy terminach.
- Dostępność WCAG 2.1 AA (kontrast, focus, obsługa klawiatury, etykiety formularzy).
- Języki interfejsu: PL, EN (i18n od początku).
- RODO: zgody, eksport i usunięcie konta, minimalizacja danych mentora wystawianych publicznie.
- Płatności: środki blokowane przy rezerwacji, uwalniane mentorowi po zakończeniu sesji (escrow), zwrot wg polityki 24h.
