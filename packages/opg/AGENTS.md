# AGENTS.md — @optimitron/opg

**Lane:** Policy & Budget
**Owner rule:** One agent per lane at a time. Do not edit files outside your lane (`opg`, `obg`, `data`).

## Scope

Optimal Policy Generator — policy scoring, jurisdiction analysis, Bradford Hill criteria, welfare metrics, evidence grades, and policy evaluation scheduling.

## Key Exports (do not break these signatures)

- `calculateWelfare`, `WelfareMetricsSchema`, `WelfareFunctionConfigSchema`
- `PolicyEvaluationSchema`, policy impact score calculation
- Bradford Hill scoring functions
- Evidence grade classification
- Report and legislation brief generators

## Dependencies

- `@optimitron/optimizer` — uses causal inference pipeline
- `@optimitron/data` — uses data fetchers
- `import type` from `@optimitron/db` is OK (type-only)

## Rules

- **No Prisma runtime imports.** Use `import type` only from `@optimitron/db`.
- **Paper compliance.** Read the OPG paper (`opg.warondisease.org`) before algorithm changes.
- **Browser-safe.** Library code must work in browser for PGlite/local-first.

## Off-Limits

- `packages/optimizer/*` — use it, don't modify it
- `packages/web/*`
- `packages/db/prisma/schema.prisma`
