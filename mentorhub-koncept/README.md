# MentorHub – wstępna koncepcja portalu mentoringowego

Benchmark funkcjonalny: Preply (mechaniki: wyszukiwarka, lekcja próbna, rezerwacja z kalendarza, płatność z góry, sala wideo, opinie, wypłaty). Brak kopiowania identyfikacji wizualnej, treści i kodu.

## Zawartość
- `docs/01-uzytkownicy-i-potrzeby.md` – role, persony, potrzeby
- `docs/02-use-case-i-przeplywy.md` – use case'y, przepływy end-to-end, reguły biznesowe
- `docs/03-mapa-ekranow-i-nawigacji.md` – 29 ekranów, trasy, mapa nawigacji
- `docs/04-specyfikacja-ekranow.md` – dla każdego ekranu: cel, funkcje, komponenty, stany (loading/empty/error/success), walidacje, API
- `docs/05-katalog-api.md` – zbiorczy katalog endpointów i encji
- `mockup/` – klikalne mockupy (HTML/CSS/TypeScript)

## Uruchomienie mockupów
Otwórz `mockup/index.html` w przeglądarce (działa bez serwera, skompilowany JS jest w `mockup/dist/app.js`).

Przebudowa z TypeScript: `cd mockup && npm i && npm run build` (źródła w `mockup/src/`).

## Jak oglądać
Dolny pasek **Demo** pozwala:
- przełączać **rolę** (gość / uczeń / mentor / admin),
- wymuszać **stan ekranu** (dane / loading / empty / error) na każdym ekranie,
- skakać do dowolnego **ekranu** po ID (P01…S02).

Zalecane ścieżki:
1. **Uczeń:** P01 → szukaj → P03 → „Umów lekcję próbną” → logowanie (np. kasia@example.com / dowolne hasło ≥8 zn.) → U03 wybierz termin → U04 karta `4242 4242 4242 4242` (`4000 0000 0000 0002` = odrzucona; kod `WITAJ10`) → U05 → U06/U07 → U02 „Dołącz do sali” → U08 → Zakończ → U09 opinia.
2. **Mentor:** rejestracja jako mentor lub rola „Mentor” → M01 kreator (4 kroki) → admin zatwierdza w A01 → M03 dostępność → M04 akceptacja prośby → M06 wypłata (IBAN `PL61109010140000071219812874`).
3. **Admin:** A01 zatwierdź/odrzuć (powód ≥10 zn.), A02 rozstrzygnij zgłoszenie, A03 zawieś użytkownika.

Dane są fikcyjne i trzymane w pamięci przeglądarki (odświeżenie strony resetuje stan).
