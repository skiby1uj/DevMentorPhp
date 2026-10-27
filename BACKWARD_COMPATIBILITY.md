# Backward compatibility

Protected contract surfaces of DevMentor. Review skills check changes against this file; implementation skills warn when a change violates it. The app is a web application (not a library), so the surfaces are data, HTTP and async contracts.

| Surface | Where | Breaking change | Required path |
|---|---|---|---|
| Database schema | `migrations/`, entities in `src/<Module>/Domain` | Dropping/renaming a column or table, narrowing a type, adding `NOT NULL` without default | Expand → migrate → contract across separate PRs; new migration only (merged migrations are immutable); `down()` where possible; rollback plan in PR body |
| Merged migrations | `migrations/` | Any edit of a migration already on `main` | Forbidden — fix with a new migration |
| HTTP routes and responses | `src/*/UI` controllers, `config/routes*` | Removing/renaming a route, changing parameters, response shape or status codes; `/health/live` and `/health/ready` semantics (`/health/ready` is used by the CI smoke `composer e2e`) | Keep the old route/shape until consumers move; document in PR; update `tests/e2e` |
| Concept API contract | `mentorhub-koncept/docs/` (API, roles, flows) | Implementation diverging from the documented API | Update the concept doc and the spec in the same PR, with owner approval |
| Messenger messages | `src/*/Application` message classes, Doctrine transport | Renaming/moving a message class or changing its payload while messages may be queued | Keep old class as handler alias until queue drains; additive fields only |
| Domain/integration events and Shared interfaces | `src/Shared` | Changing event payloads or public interfaces other modules use | Additive change or versioned event; update all consumers in the same PR |
| Console commands | `bin/console` commands in `src/` | Renaming commands/options used by CI or ops | Deprecate with alias first |
| Configuration and env | `.env`, `config/`, `compose.yaml`, `Dockerfile` | Renaming/removing env variables, changing required vars | Document in PR and README; keep fallback during transition |
| Translations keys | `translations/` | Removing keys still referenced by templates | Remove only with their usages |
| Module boundaries | `deptrac.yaml` | Adding cross-module dependencies or loosening rules | Needs a spec change and user approval (AGENTS.md) |
| Tech stack | `.ai/specs/2026-10-25-devmentor-tech-stack-and-engineering-standards.md` | Changing PHP/Symfony/PostgreSQL major versions | New ADR and user approval |
