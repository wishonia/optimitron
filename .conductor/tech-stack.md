# Tech Stack

## Languages and Runtime
- TypeScript (strict)
- Node.js >= 18
- ESM modules across packages

## Monorepo Tooling
- pnpm workspaces
- Vitest for tests
- eslint (typescript-eslint) for linting

## Core Libraries
- @optomitron/optimizer (causal inference)
- @optomitron/wishocracy (preference aggregation)
- @optomitron/opg (policy generator)
- @optomitron/obg (budget generator)
- @optomitron/data (data sources + importers)

## Data and Validation
- Zod schemas in core packages
- Prisma + Postgres for persistence

## UI and Apps
- Next.js 14 + React 18 (packages/web)
- Tailwind CSS + framer-motion
- Chrome extension built with esbuild

## Build
- tsc for library builds
- tsup for chat-ui
- esbuild for the extension
