# 03. Mapa ekranów i nawigacji

## Lista ekranów

| ID | Ekran | Dostęp | Trasa |
|---|---|---|---|
| P01 | Strona główna | Gość+ | `/` |
| P02 | Wyszukiwarka mentorów | Gość+ | `/mentors` |
| P03 | Profil mentora | Gość+ | `/mentors/:id` |
| P04 | Logowanie | Gość | `/login` |
| P05 | Rejestracja | Gość | `/register` |
| P06 | Reset hasła | Gość | `/password-reset` |
| U01 | Onboarding ucznia | Uczeń | `/onboarding` |
| U02 | Dashboard ucznia | Uczeń | `/app` |
| U03 | Rezerwacja (wybór terminu) | Uczeń | `/book/:mentorId` |
| U04 | Płatność | Uczeń | `/book/:mentorId/pay` |
| U05 | Potwierdzenie rezerwacji | Uczeń | `/bookings/:id/confirmed` |
| U06 | Moje sesje | Uczeń | `/sessions` |
| U07 | Szczegóły sesji | Uczeń/Mentor | `/sessions/:id` |
| U08 | Sala wideo | Uczeń/Mentor | `/sessions/:id/room` |
| U09 | Opinia po sesji | Uczeń | `/sessions/:id/review` |
| U10 | Wiadomości | Uczeń/Mentor | `/messages/:conversationId?` |
| U11 | Ulubieni mentorzy | Uczeń | `/favorites` |
| U12 | Płatności i pakiety | Uczeń | `/billing` |
| M01 | Kreator profilu mentora / weryfikacja | Mentor | `/mentor/profile` |
| M02 | Dashboard mentora | Mentor | `/mentor` |
| M03 | Dostępność | Mentor | `/mentor/availability` |
| M04 | Prośby o rezerwację | Mentor | `/mentor/requests` |
| M05 | Moi uczniowie | Mentor | `/mentor/students` |
| M06 | Zarobki i wypłaty | Mentor | `/mentor/earnings` |
| A01 | Wnioski mentorów | Admin | `/admin/applications` |
| A02 | Zgłoszenia i spory | Admin | `/admin/reports` |
| A03 | Użytkownicy | Admin | `/admin/users` |
| S01 | Ustawienia konta | Zalogowany | `/settings` |
| S02 | Powiadomienia | Zalogowany | `/notifications` |

## Mapa nawigacji

```
GOŚĆ        [Logo] [Znajdź mentora P02] [Zostań mentorem P05] [Zaloguj P04] [Załóż konto P05]
 P01 ──► P02 ──► P03 ──► P04 ◄──► P05,  P04 ──► P06

UCZEŃ       [Logo→U02] [Znajdź mentora P02] [Moje sesje U06] [Wiadomości U10] [Ulubieni U11] [🔔 S02] [Płatności U12] [Ustawienia S01] [Wyloguj]
 U02 ─┬─► U06 ─► U07 ─┬─► U08 ─► U09 ─► U02
      │               ├─► (modal) zmiana terminu / anulowanie
      │               └─► U03 (zarezerwuj ponownie)
      ├─► P02 ─► P03 ─► U03 ─► U04 ─► U05 ─► U06
      └─► U10, U11, U12

MENTOR      [Logo→M02] [Kalendarz M03] [Prośby M04] [Uczniowie M05] [Wiadomości U10] [Zarobki M06] [Profil M01] [🔔 S02] [Ustawienia S01]
 M02 ─┬─► M04 ─► (akceptuj) ─► U07 ─► U08
      ├─► M03,  M05 ─► U10,  M06 (wypłata)
      └─► M01 (edycja profilu, status weryfikacji)

ADMIN       [Wnioski A01] [Zgłoszenia A02] [Użytkownicy A03] [Ustawienia S01]
```

## Zasady nawigacji

- Strażnik tras: brak sesji → przekierowanie do P04 z `returnTo`; niewłaściwa rola → ekran „Brak dostępu” z linkiem do domu roli.
- Przepływ rezerwacji (U03→U04→U05) ma pasek postępu i zachowuje stan przy powrocie wstecz.
- Na mobile: dolny tab-bar (Szukaj, Sesje, Wiadomości, Profil) zamiast górnego menu.
- Okruszki i przycisk „Wstecz” na ekranach szczegółowych (P03, U07, U08).
- Ekran 404 i ekran błędu globalnego (500/offline) z przyciskiem „Spróbuj ponownie”.
