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
