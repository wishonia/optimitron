# AGENTS.md — @optimitron/agent

**Lane:** Agent & Infra
**Owner rule:** One agent per lane at a time. Do not edit files outside your lane (`agent`, `hypercerts`, `storage`).

## Scope

Autonomous policy analyst — Gemini-powered orchestrator that discovers preference gaps, plans analyses, executes them, verifies results, and publishes Hypercerts. This is the brain that turns money into earth optimization.

## Key Exports (do not break these signatures)

- `runAgent(options)` — main orchestration pipeline (discover → plan → execute → interpret → verify → publish)
- `AgentExecutionAdapters` — adapter interface for plugging in analysis, hypercerts, storage, registries
- `RunAgentOptions` — configuration for agent runs
- `createGuardrailState`, `ensureRuntimeRemaining`, `recordApiCall` — compute safety limits
- Gemini integration, image generation, ERC-8004 standard
- Legislation drafter and evidence gatherer

## Dependencies

- `@optimitron/data`, `@optimitron/obg`, `@optimitron/opg`, `@optimitron/optimizer` — analysis inputs
- `@optimitron/storage`, `@optimitron/hypercerts`, `@optimitron/wishocracy` — publishing outputs

## Current Priority

- **Agent cost tracking.** Add cost-per-run logging so deposits can be mapped to impact.
- **Agent scheduler.** Cron/queue that checks budget pool and runs agents when funded.

## Rules

- **Guardrails are sacred.** Never remove or weaken compute constraints (maxAnalysesPerRun, maxRuntimeMs, maxApiCalls).
- **Adapters, not hardcoding.** All external integrations go through `AgentExecutionAdapters`.

## Off-Limits

- `packages/web/*` — web agent handles UI
- `packages/treasury-*/*` — treasury agent handles contracts
- `packages/db/prisma/schema.prisma` — coordinate with web agent for schema changes
