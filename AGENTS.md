# AGENTS.md — Instructions for All AI Agents

**Read this FIRST before making any changes.**

## Multi-Agent Coordination

Multiple AI agents work on this repo in parallel. Each agent is assigned to a **lane** — a set of packages it owns. Agents must not edit files outside their lane.

### Lane Assignments

| Lane | Packages | Focus |
|------|----------|-------|
| **Core Math** | `optimizer`, `wishocracy` | Algorithm correctness, paper compliance, test coverage |
| **Policy & Budget** | `opg`, `obg`, `data` | Data pipelines, policy scoring, budget optimization |
| **Web & API** | `web` | UI, API routes, task system, treaty pages |
| **Treasury & Contracts** | `treasury-prize`, `treasury-iab`, `treasury-wish`, `treasury-shared` | Smart contracts, agent funding mechanism |
| **Agent & Infra** | `agent`, `hypercerts`, `storage` | Autonomous analysis, publishing, agent orchestration |

### Coordination Rules

1. **One package per agent at a time.** Do not edit files in packages outside your lane.
2. **Types are the contract.** `@optimitron/db` exports are shared by everyone. Changes to the Prisma schema or exported types require explicit human approval.
3. **Branch per agent.** Use git worktrees. One branch per lane. Never push to main directly.
4. **Interface changes require coordination.** If you need to change a public export signature that other packages depend on, document the change and stop — let the human merge and coordinate.
5. **Read the package AGENTS.md.** Each package has its own `AGENTS.md` with scope, exports, rules, and off-limits.

### What Every Agent Must Do

- Run `pnpm check` (typecheck + lint + test) before considering work done
- Never import Prisma client in library packages (optimizer, wishocracy, opg, obg, data, agent, hypercerts, storage)
- Use `import type` for cross-package type imports
- Follow existing patterns — read surrounding code before writing new code

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
- "drugs", "supplements", "treatments", "patients"
- "policies", "budgets", "politicians", "government"
- Use: "predictor", "outcome", "variable", "measurement", "effect size"

Domain-specific naming belongs in opg/obg/wishocracy/data/web.

### 4. Naming Conventions

| Convention | Example |
|-----------|---------|
| FK field names match target model | `globalVariableId` not `variableId` |
| Predictor/outcome terminology | `predictorGlobalVariableId` not `causeVariableId` |
| Outcome not effect in properties | `outcomeBaselineAverage` (but `effectSize` stays — Cohen's d) |
| Enums over magic strings | Prisma enforces valid values |
| deletedAt on all models | Soft deletes for cr-sqlite sync |

### 5. Dependency Graph

```
optimizer ← (nothing, foundation)
wishocracy ← (nothing, standalone pure math)
opg ← optimizer, data
obg ← optimizer, opg
data ← optimizer
agent ← data, obg, opg, optimizer, storage, hypercerts, wishocracy
web ← everything
```

**No circular deps.** If you need something from both directions, it belongs in `optimizer`.

### Papers (Algorithm Source of Truth)

Before implementing any algorithm, read the relevant paper:
- Optimizer → [dFDA Spec](https://dfda-spec.warondisease.org)
- Wishocracy → [Wishocracy](https://wishocracy.warondisease.org)
- OPG → [Optimal Policy Generator](https://opg.warondisease.org)
- OBG → [Optimal Budget Generator](https://obg.warondisease.org)
- IAB → [Incentive Alignment Bonds](https://iab.warondisease.org)
