# AGENTS.md — Instructions for All AI Agents

**Read this FIRST before making any changes.**

## Documentation

Detailed docs live in `docs/`. Read the relevant ones before working:
- `docs/TYPE_SYSTEM.md` — How types flow from Prisma → all packages


## Critical Architecture Rules

### 1. Type System — Single Source of Truth

The Prisma schema (`packages/db/prisma/schema.prisma`) is the canonical source for all data models.

**How types flow:**
```
schema.prisma → @optimitron/db exports:
  ├── Prisma client (for web/API layer ONLY)
  ├── Pure TS interfaces (for ALL packages)
  └── Zod schemas (for runtime validation)
```

**DO:**
- Import PLAIN TypeScript interfaces from `@optimitron/db` (type-only imports)
- Use `import type { Measurement, GlobalVariable } from '@optimitron/db'`
- Keep Prisma schema as the single source of truth

**DO NOT:**
- Import `@prisma/client` in library packages (optimizer, wishocracy, opg, obg, data)
- Define duplicate interfaces in library packages that mirror DB models
- Create separate "db-types" packages — the types live in `@optimitron/db`

### 2. Library Package Rules

They MAY import **type-only** exports from `@optimitron/db`.
They MUST NOT import Prisma client, database connections, or any runtime DB code.
They MUST work in the browser (for PGlite/local-first).

### 3. Domain Agnosticism

`@optimitron/optimizer` is **completely domain-agnostic**. NEVER reference:
- ❌ "drugs", "supplements", "treatments", "patients"
- ❌ "policies", "budgets", "politicians", "government"
- ✅ "predictor", "outcome", "variable", "measurement", "effect size"

Domain-specific naming belongs in opg/obg/wishocracy/data/web.

### 4. Naming Conventions

| Convention | Example |
|-----------|---------|
| FK field names match target model | `globalVariableId` not `variableId` |
| Predictor/outcome terminology | `predictorGlobalVariableId` not `causeVariableId` |
| Outcome not effect in properties | `outcomeBaselineAverage` (but `effectSize` stays — Cohen's d) |
| Enums over magic strings | Prisma enforces valid values |
| deletedAt on all models | Soft deletes for cr-sqlite sync |


### Papers (Algorithm Source of Truth)

Before implementing any algorithm, read the relevant paper:
- Optimizer → [dFDA Spec](https://dfda-spec.warondisease.org)
- Wishocracy → [Wishocracy](https://wishocracy.warondisease.org)
- OPG → [Optimal Policy Generator](https://opg.warondisease.org)
- OBG → [Optimal Budget Generator](https://obg.warondisease.org)
- IAB → [Incentive Alignment Bonds](https://iab.warondisease.org)


