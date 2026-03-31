# Conventions

## Naming

| Convention | Example | Rationale |
|-----------|---------|-----------|
| FK field names match target model | `globalVariableId` not `variableId` | Unambiguous foreign keys |
| Predictor/outcome terminology | `predictorGlobalVariableId` | More scientifically honest than cause/effect |
| Outcome not effect in properties | `outcomeBaselineAverage` | But `effectSize` stays (Cohen's d is correct) |
| Enums over magic strings | `FillingType.ZERO` | DB-enforced valid values |
| `deletedAt` on all models | Soft deletes | cr-sqlite sync, audit trail, data recovery |
| No CureDAO/QuantiModo branding | "legacy API" | Mike doesn't want DAO association |

## Package Naming

Each package is named after its corresponding paper:
- `optimizer` → dFDA Spec (causal inference engine)
- `wishocracy` → Wishocracy paper (RAPPA)
- `opg` → Optimal Policy Generator paper
- `obg` → Optimal Budget Generator paper
- `data` → Data fetchers (no paper)
- `db` → Database schema (no paper)

## Commit Messages

Conventional commits:
```
feat(optimizer): Add reverse Pearson correlation
fix(data): Guard against NaN in daily aggregation
test(wishocracy): Add weighted aggregation tests
docs: Update ARCHITECTURE.md
ci: Fix deploy workflow pnpm version
```

## Domain Agnosticism

`@optimitron/optimizer` MUST be completely domain-agnostic:
- ❌ "drugs", "supplements", "patients", "policies", "budgets", "politicians"
- ✅ "predictor", "outcome", "variable", "measurement", "effect size", "time series"

A business analyst should be able to use it for revenue optimization without seeing the word "government".

## Testing

- Test behavior, invariants, and regressions; do not chase line-by-line coverage.
- New logic, bug fixes, parsing, and boundary conversions should add or update tests.
- Tiny wrappers, passive re-exports, and other low-risk mechanical changes do not need dedicated tests when higher-level coverage already exists.
- Integration tests spanning packages go in `packages/examples/`
- Delete or rewrite skipped tests that no longer cover a supported path.
- Use `describe.skip` for tests that need pending work, not deletion
- Edge cases: NaN, Infinity, empty arrays, single-element arrays, zero values
- `pnpm review:test-output -- --file <path>` is available for non-blocking AI triage of test/build/typecheck logs

## Architecture Heuristic

Prefer rules with explicit operational value. If a rule forces duplicate data,
extra conversion layers, or awkward file placement, re-evaluate it and document
the actual tradeoff instead of preserving the rule by default.

## Code Size Heuristic

- Prefer functions that fit on one screen and files that stay easy to review.
- Treat roughly 30-line functions and 300-line files as smell thresholds, not hard caps.
- Split code when it improves comprehension; do not fragment cohesive logic just to satisfy a number.
