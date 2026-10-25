# 05. Katalog API (wstępny)

Prefiks `/api/v1`. Auth: cookie sesyjne + CSRF. Role: **G** gość, **U** uczeń, **M** mentor, **A** admin.

| Obszar | Metoda i ścieżka | Rola | Opis | Ekrany |
|---|---|---|---|---|
| Auth | `POST /auth/register` | G | Rejestracja | P05 |
| Auth | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | G/zalog. | Sesja | P04 |
| Auth | `POST /auth/verify-email`, `/auth/resend-verification` | G | Weryfikacja e-mail | P05 |
| Auth | `POST /auth/password-reset/request`, `/confirm` | G | Reset hasła | P06 |
| Katalog | `GET /topics`, `GET /testimonials` | G | Słowniki | P01, P02 |
| Katalog | `GET /mentors` (q, topic, price_max, lang, rating_min, available_within, sort, cursor, featured, recommended_for) | G | Wyszukiwanie | P01, P02, U02 |
| Katalog | `GET /mentors/{id}`, `/reviews`, `/availability` | G | Profil | P03, U03 |
| Ulubieni | `GET /me/favorites`, `PUT|DELETE /me/favorites/{id}` | U | Ulubieni | P02, P03, U11 |
| Konto | `GET|PATCH /me`, `POST /me/password`, `PUT /me/preferences`, `PUT /me/notification-settings`, `POST /me/export`, `DELETE /me` | zalog. | Konto | S01, U01 |
| Rezerwacje | `POST /bookings/draft` | U | Blokada slotu 10 min | U03 |
| Rezerwacje | `POST /bookings` | U | Utworzenie po płatności | U04 |
| Rezerwacje | `GET /bookings` (status, role, cursor), `GET /bookings/{id}`, `GET /bookings/{id}/ics` | U/M | Lista i szczegóły | U02, U05–U07, M02, M04 |
| Rezerwacje | `POST /bookings/{id}/reschedule`, `/cancel` | U/M | Zmiana, anulowanie | U07 |
| Rezerwacje | `POST /bookings/{id}/accept`, `/decline` | M | Obsługa próśb | M04 |
| Płatności | `POST /promo-codes/validate`, `POST /payments/intents` | U | Płatność | U04 |
| Płatności | `GET|POST /me/payment-methods`, `DELETE …/{id}`, `GET /me/packages`, `GET /me/invoices`, `GET …/{id}/pdf` | U | Finanse ucznia | U12 |
| Płatności | `POST /webhooks/payments` | system | Potwierdzenie płatności | U04, U05 |
| Sesje | `POST /sessions/{id}/join`, `/end` | U/M | Token wideo | U08 |
| Sesje | `GET|PUT /sessions/{id}/notes` | U/M | Notatki | U07, U08 |
| Sesje | `WS /sessions/{id}/chat` | U/M | Czat w sali | U08 |
| Opinie | `POST|GET /sessions/{id}/review` | U | Opinia | U09 |
| Wiadomości | `GET /conversations`, `GET|POST /conversations/{id}/messages`, `POST …/read`, `WS /ws` | U/M | Czat | U10 |
| Powiadomienia | `GET /notifications`, `POST …/{id}/read`, `POST …/read-all` | zalog. | Centrum | S02 |
| Mentor | `GET|PUT /mentor/profile`, `POST /mentor/documents`, `GET /mentor/application`, `POST /mentor/application/submit` | M | Profil i wniosek | M01 |
| Mentor | `GET /mentor/dashboard`, `GET|PUT /mentor/availability`, `POST /mentor/time-off` | M | Panel i kalendarz | M02, M03 |
| Mentor | `GET /mentor/students`, `GET|PUT /mentor/students/{id}/notes` | M | Uczniowie | M05 |
| Mentor | `GET /mentor/earnings`, `GET /mentor/transactions`, `POST /mentor/payouts`, `PUT /mentor/payout-account` | M | Finanse | M06 |
| Moderacja | `POST /reports` | U/M | Zgłoszenie | P03, U07 |
| Admin | `GET /admin/mentor-applications`, `POST …/{id}/approve|reject|request-changes` | A | Weryfikacja | A01 |
| Admin | `GET /admin/reports`, `POST …/{id}/resolve`, `POST /admin/payments/{id}/refund` | A | Spory | A02 |
| Admin | `GET /admin/users`, `POST …/{id}/suspend|activate` | A | Konta | A03 |

## Główne encje
User, MentorProfile, Topic, AvailabilityRule, TimeOff, Booking (status: draft, pending, confirmed, completed, cancelled, no_show), Payment, Payout, Package, Review, Conversation, Message, Notification, Report, MentorApplication, AuditLog.

## Zalecany stack (propozycja)
Frontend: TypeScript (np. React/Vue lub Symfony UX), backend: istniejący projekt Symfony w repozytorium (API Platform), PostgreSQL, Redis, Stripe (płatności + Connect do wypłat), LiveKit/Daily (wideo), Mercure/WebSocket (czas rzeczywisty), S3 (dokumenty).
