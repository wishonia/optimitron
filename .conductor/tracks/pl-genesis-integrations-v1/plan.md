# Plan: PL Genesis Integrations (v1)

## Phase 1: Scaffolding
- [x] Add workspace package scaffolds for `hypercerts`, `storage`, and `agent`.
- [x] Add track metadata/spec/plan for reproducibility.

## Phase 2: Storacha Storage (done)
- [x] Add linked snapshot schemas for Wishocracy and Optomitron payloads.
- [x] Add Storacha client wrapper and chain/history helpers.
- [x] Add package tests for upload/retrieve/history behavior.

## Phase 3: Hypercerts
- [ ] Add record schemas and mapping helpers for activity claims, measurements, evaluations, and attachments.
- [ ] Add publish/read helpers with injected AT Protocol clients.
- [ ] Add package tests for mapping and publish flows.

## Phase 4: Autonomous Agent (Google ADK + Gemini + ERC-8004)
- [ ] Define `FunctionTool`s (with Zod parameter schemas) wrapping each pipeline step: discover preference gaps, run causal analysis, generate policy/budget reports, publish hypercerts, store on Storacha.
- [ ] Wire tools into a `LlmAgent` (`@google/adk`) with Gemini model for autonomous orchestration.
- [ ] Add Gemini reasoning at each step: discovery rationale, result interpretation, verify/abort decisions, publish summaries.
- [ ] Add ERC-8004 interaction helpers using ethers v6 interfaces (identity + reputation registries, Sepolia testnet).
- [ ] Add `agent.json` manifest and `agent_log.json` structured execution logging.
- [ ] Add safety guardrails: input validation, API response checks, insufficient-data abort, call/runtime caps.
- [ ] Add end-to-end orchestration tests with mocked tools and publishers.
