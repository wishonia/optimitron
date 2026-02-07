# Type System — Single Source of Truth

## Principle

The Prisma schema (`packages/db/prisma/schema.prisma`) is the **canonical definition** of all data models. Types flow FROM the schema TO consuming packages — never the other direction.

## How Types Flow

```
schema.prisma
    │
    ▼
@optomitron/db exports:
    ├── Pure TS interfaces  ──→  ALL packages (type-only imports)
    ├── Zod schemas         ──→  Runtime validation where needed
    └── Prisma client       ──→  web/API layer ONLY
```

## Rules

### Library packages (optimizer, wishocracy, opg, obg, data, chat-ui)
```typescript
// ✅ DO: Type-only import (zero runtime cost, works in browser)
import type { Measurement, GlobalVariable } from '@optomitron/db';

// ❌ DON'T: Runtime import of Prisma client
import { PrismaClient } from '@optomitron/db';
```

### Web/API layer (packages/web)
```typescript
// ✅ Both type and runtime imports allowed here
import type { Measurement } from '@optomitron/db';
import { PrismaClient } from '@optomitron/db';
```

## Why This Matters

1. **Browser compatibility** — Library packages must work in PGlite (Postgres-in-browser). `@prisma/client` requires Node.js.
2. **No duplication** — Change a field once in schema.prisma, it propagates everywhere via generated types.
3. **Domain agnosticism** — The optimizer doesn't need to know about Prisma; it just needs the interface shape.
4. **Tree-shaking** — `import type` is erased at compile time. Zero bundle size impact.

## Current State

As of Feb 2026, library packages define their own types (duplicating DB models). The migration path:
1. Export pure TS interfaces from `@optomitron/db` (alongside Prisma client)
2. Gradually replace library-local types with `import type` from db
3. Keep Zod schemas in db for runtime validation (namespaced as `schemas`)

## Enum Handling

Prisma enums use UPPER_CASE (`ZERO`, `VALUE`). TypeScript code uses lowercase (`'zero'`, `'value'`).
Conversion utilities live in `@optomitron/db`:
- `fillingTypeToPrisma(optimizerType)` → Prisma enum
- `fillingTypeFromPrisma(prismaType)` → optimizer string
