# TypeScript Style Guide

## General
- Prefer `type` aliases over `interface` unless extending is required.
- Use `import type` for type-only imports.
- Avoid `any`. Prefer explicit types and narrowing.
- Use `readonly` where it improves safety.

## Architecture
- Keep optimizer, wishocracy, opg, obg pure and dependency-light.
- Keep data ingestion separate from inference logic.
- Keep Prisma usage isolated to db and db-types.

## Error Handling
- Validate inputs at module boundaries (Zod where appropriate).
- Return structured error results rather than throwing in core logic.

## Formatting
- Follow existing formatting and naming conventions in each package.
- Prefer small, composable functions and stable public APIs.
