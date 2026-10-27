# Code review rules

Repo-specific rules applied by `om-code-review` / `om-auto-review-pr`, in addition to the built-in checklist. Source of truth for project rules: [`AGENTS.md`](AGENTS.md) and `.ai/specs/2026-10-25-devmentor-tech-stack-and-engineering-standards.md`.

## Review priorities

1. **Correctness** — behavior matches the spec in `.ai/specs/`; no scope beyond the spec.
2. **Security** — authorization via Voters, validation via Validator/Form, no secrets committed (`DATABASE_URL`, keys only in `.env.local`/env).
3. **Contracts** — see [`BACKWARD_COMPATIBILITY.md`](BACKWARD_COMPATIBILITY.md).
4. **Tests** — every new class/method in `src/` has unit tests in `tests/Unit/` (mirror of `src/`), 100% line and method coverage, no `@codeCoverageIgnore`, no narrowed `<source>`.

## Repo-specific checks

- New PHP files start with `declare(strict_types=1)`; no syntax newer than `composer.json` allows (`>=8.2`).
- Classes are `final`, value objects `final readonly`; dependencies injected via constructor; time only via `ClockInterface`; money only as `App\Shared\Domain\Money` (grosze).
- Module layout `src/<Module>/{Domain,Application,Infrastructure,UI}`; Deptrac boundaries hold (Domain → Shared only; modules do not depend on each other). Controllers are thin, live in `UI`.
- Commands go through `command.bus` (transaction in `doctrine_transaction` middleware) — **manual `flush()` is a blocker**; queries through `query.bus`.
- Doctrine: schema changes only via a migration (never `schema:update`); merged migrations are never edited; `down()` present where possible; `timestamptz`/`jsonb`/`uuid` used deliberately, times in UTC `DateTimeImmutable`; indexes on FKs and filter columns; no N+1.
- PgBouncer (transaction mode) compatibility: no session state (`SET`, session advisory locks, `LISTEN/NOTIFY`); use `pg_advisory_xact_lock`.
- Multi-step operations (booking + payment) are in one transaction; async work goes through Messenger (Doctrine transport).
- No `@phpstan-ignore`, no PHPStan baseline. Symfony packages stay on `7.4.*`; config via PHP attributes, never XML/annotations.
- UI strings go through the translator (`translations/`, default PL); code, class names and comments are in English.
- A change to mapping/migrations shows `doctrine:schema:validate` and a clean-database migration run as evidence.

## Validation gate

`composer qa`, `composer test:coverage`, `composer test:integration` must be green (see `.ai/agentic.config.json`).

## Severity

- **Blocker** — wrong behavior, security hole, data loss, broken contract, missing tests/coverage, manual `flush()`, edited merged migration, Deptrac violation, `@phpstan-ignore`.
- **Major** — missing validation/authorization, N+1, missing index, session-state use with PgBouncer, spec drift.
- **Minor/nit** — naming, style not caught by PHP-CS-Fixer, small simplifications.
