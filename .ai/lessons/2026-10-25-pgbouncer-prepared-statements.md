# PgBouncer w trybie transaction a prepared statements

- Data: 2026-10-25
- Kontekst: [spec stacku](../specs/2026-10-25-devmentor-tech-stack-and-engineering-standards.md); wcześniejszy zapis w `AGENTS.md`
- Typ: korekta

## Co się stało
`AGENTS.md` sugerował unikanie prepared statements za PgBouncerem. Research: od PgBouncer 1.21 nazwane prepared statements działają w trybie `transaction` przy `max_prepared_statements` > 0 (w 1.25.2 domyślnie 200).

## Wniosek / reguła
Ograniczenia dotyczą stanu sesji (`SET`, sesyjne advisory locks, `LISTEN/NOTIFY`), nie prepared statements. Używaj `pg_advisory_xact_lock`; migracje i `LISTEN/NOTIFY` kieruj bezpośrednio do PostgreSQL.

## Jak zweryfikować
https://www.pgbouncer.org/changelog.html
