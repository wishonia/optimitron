# Track Spec: PL Genesis Integrations (v1)

## Background
Optomitron already has the core analysis and preference aggregation engines. This track adds decentralized infrastructure integrations: tamper-proof storage for analysis results, verifiable impact attestations via Hypercerts, and an autonomous agent that orchestrates the full pipeline.

## Objectives
- Add a `@optomitron/storage` package that stores analysis and aggregation snapshots as linked Storacha/IPFS JSON payloads with verifiable history chains.
- Add a `@optomitron/hypercerts` package that maps Optomitron and Wishocracy outputs into Hypercerts-compatible AT Protocol records.
- Add a `@optomitron/agent` package built on Google ADK (`@google/adk`) that discovers preference gaps, plans analyses, executes internal tools via Gemini-orchestrated `FunctionTool`s, verifies outputs, and publishes results as hypercerts stored on Storacha. Includes ERC-8004 on-chain agent identity.

## Scope
In scope:
- Pure library packages with Zod schemas, mapping helpers, injected network adapters, and tests.
- Google ADK agent with `LlmAgent` + `FunctionTool` definitions wrapping the Optomitron pipeline.
- Agent manifest/log generation plus ERC-8004 helper wrappers for identity and reputation calls.

Out of scope (v1):
- Full `packages/web` UI integration.
- Production wallet custody, OAuth callback hosting, or secret management.
- On-chain deployment automation (testnet only).

## Deliverables
- `packages/storage`
- `packages/hypercerts`
- `packages/agent`

## Acceptance Criteria
- New packages build under the monorepo and expose typed public APIs.
- Core functions are covered by package tests.
- Agent execution (via Google ADK `LlmAgent`) produces a structured run log and manifest.
- External network operations are abstracted behind adapters so tests run without credentials.
