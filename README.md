# Optomitron

**Optomitron optimizes everyone's health, wealth, and happiness — as well as that of humanity — using time series data and causal inference.**

We're building the operating system for evidence-based decision-making. Whether you're a person trying to figure out if magnesium helps you sleep, a city deciding where to spend its budget, or a business optimizing ad spend — the math is the same. Optomitron provides a universal causal inference engine that takes any two time series and answers: *Does changing X cause Y to change? By how much? What's the optimal value of X?*

[![CI](https://github.com/mikepsinn/optomitron/actions/workflows/ci.yml/badge.svg)](https://github.com/mikepsinn/optomitron/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Packages](https://img.shields.io/badge/packages-13-blue.svg)](#packages)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220.svg)](https://pnpm.io/)

---

## The Problem

Governance inefficiency costs humanity an estimated [**$101 trillion per year**](https://political-dysfunction-tax.warondisease.org) — roughly **$12,600 per person** ($50,500 per household of four). This "Political Dysfunction Tax" comes from two ledgers:

- **Waste** — $4T+ in administrative bloat, compliance friction, fossil fuel subsidies, and mass incarceration costs
- **Buried multipliers** — $34T in health innovation delayed by regulatory bottlenecks, $57T in output lost to migration restrictions, $6T in lead poisoning damage, and trillions more in underfunded science

The result: global civilization operates at roughly **52% of its technological potential**. Over 20 years, the gap between status quo and evidence-based governance is staggering:

| Scenario | Per Capita Income (Year 20) |
|----------|----------------------------:|
| Status quo (2.5% growth) | $20,500 |
| Treaty path (military + health reform) | $339,000 |
| Optimal governance (full implementation) | $1,160,000 |

**Governments fly blind.** The US federal government allocates a [$6.75 trillion budget](https://www.cbo.gov/topics/budget) based on political negotiation, not evidence. Nobody knows the optimal amount to spend on education vs. healthcare vs. defense — or even how to measure it. The same is true for every city, county, and state.

**Individuals fly blind too.** 77% of Americans take dietary supplements, but almost none of them know whether those supplements actually work *for them*. People make health decisions based on anecdote, marketing, and vibes — not data.

**Businesses guess.** Marketing budgets, pricing strategies, and feature investments are set by intuition and A/B tests that measure correlation, not causation.

**The core issue is the same everywhere:** we have time series data and we need to know what causes what. The tools to answer that question should be universal, open, and free.

---

## The Solution

Optomitron is a five-layer system that turns raw data into optimal decisions:

| Layer | Name | What It Does |
|:-----:|------|-------------|
| 🔒 | **Digital Twin Safe** | All personal data stays on your device. Causal engine runs locally. |
| 🪪 | **Decentralized Identity** | Proof-of-personhood (ZK) — one person, one vote, zero surveillance. |
| ⛓️ | **Anonymous On-Chain** | Anonymized effect sizes stored publicly. No single entity owns the data. |
| 📊 | **Aggregation Server** | Meta-analysis across all submissions → population-level insights. |
| 💸 | **Incentive Layer** | Data contribution tokens + automatic campaign funding for aligned politicians. |

---

## What You Can Do Today

- **Run domain-agnostic causal inference on any time series**: temporal alignment, Bradford Hill scoring, effect sizes, confidence intervals, and optimal values in `@optomitron/optimizer`. The same core engine works for health, budgets, policy, and business.
- **Generate reproducible public-good analyses from real data**: the examples package produces federal budget, policy, government-size, drug-war, health, education, and cross-country reports from OECD, World Bank, FRED, WHO, Congress.gov, and the `economic-data` CSV catalog.
- **Collect citizen priorities and rank politicians against them**: Wishocracy turns pairwise budget trade-offs into stable preference weights, preference gaps, and personal alignment scores.
- **Use a live civic web app**: Google sign-in, magic-link auth, referrals, `/vote`, saved allocations, personal alignment reports, public share URLs, profile/census tracking, daily health-happiness-income check-ins, and World ID verification all exist in `packages/web`.
- **Sync current federal politician data with legislative provenance**: benchmark politicians use real Congress identities, recent roll-call ingestion, and explicit source notes so reports can move from curated priors toward reproducible legislative behavior.
- **Parse personal health exports locally**: `@optomitron/data` includes 9 file-based importers for Apple Health, Fitbit, Oura, MyFitnessPal, Withings, Google Fit, Cronometer, Strava, and generic CSV. They normalize records into one common format without requiring OAuth.
- **Publish auditable outputs**: `@optomitron/storage` stores content-addressed Storacha/IPFS snapshots, and `@optomitron/hypercerts` turns Optomitron results into Hypercert-compatible AT Protocol records.
- **Use an autonomous analysis layer where it helps**: `@optomitron/agent` provides Gemini-guided review/orchestration plus ERC-8004 helpers for structured manifests, publication review, and test-output triage.
- **Build on a rigor-first monorepo**: Prisma + Zod types, strict TypeScript, pure-function libraries, and roughly 1,900+ tests across the workspace.

---

## Quick Start

```bash
# Clone (with data submodule)
git clone --recurse-submodules https://github.com/mikepsinn/optomitron.git
cd optomitron

# Install dependencies
pnpm install

# Start local Postgres, run migrations, generate Prisma client, and seed data
pnpm db:setup

# Build all packages
pnpm build

# Run all tests
pnpm test

# Start the web app on http://localhost:3001
pnpm dev

# Sync benchmark politicians from Congress.gov into the web app database
pnpm alignment:sync

# Run example demos / generators
pnpm --filter @optomitron/examples demo:causal
pnpm --filter @optomitron/examples demo:budget
pnpm --filter @optomitron/examples demo:alignment
pnpm --filter @optomitron/examples generate:policy
pnpm --filter @optomitron/examples generate:government-size
```

---

## Packages

| Package | Why it matters | Current state |
|---------|----------------|---------------|
| [`@optomitron/optimizer`](packages/optimizer/) | Domain-agnostic causal inference engine: temporal alignment, Bradford Hill, effect sizes, Predictor Impact Score, optimal values | Core foundation, heavily tested |
| [`@optomitron/wishocracy`](packages/wishocracy/) | Pairwise preference aggregation, convergence analysis, preference gaps, and politician alignment scoring | Live in the web app |
| [`@optomitron/opg`](packages/opg/) | Turns policy evidence into enact/replace/repeal/maintain recommendations with explicit confidence scoring | Used by report generators |
| [`@optomitron/obg`](packages/obg/) | Finds minimum-effective and optimal spending levels, overspend ratios, and budget reallocation targets | Used by budget analyses |
| [`@optomitron/data`](packages/data/) | Public-data fetchers plus 9 local-first health importers and the international dataset catalog | Real-source ingestion layer |
| [`@optomitron/db`](packages/db/) | Prisma schema, governance models, auth/session/referral data, and Zod validators | Production schema layer, not a stub |
| [`@optomitron/web`](packages/web/) | Live Next.js app for auth, voting, alignment reports, referrals, World ID, and daily tracking | Active product surface |
| [`@optomitron/chat-ui`](packages/chat-ui/) | Reusable conversational UI components plus text-to-measurement parsing for personal tracking flows | Reusable UI package |
| [`@optomitron/storage`](packages/storage/) | Content-addressed Storacha/IPFS snapshots for analysis and aggregation history chains | Verifiable audit trail layer |
| [`@optomitron/hypercerts`](packages/hypercerts/) | Hypercert-compatible record builders and AT Protocol publishing helpers for Optomitron outputs | Verifiable publication layer |
| [`@optomitron/agent`](packages/agent/) | Autonomous policy analyst helpers: Gemini reasoning, manifests, review flows, and ERC-8004 identity/reputation helpers | AI orchestration layer |
| [`@optomitron/examples`](packages/examples/) | Runnable demos and reproducible report generators for budget, policy, causal, and alignment analyses | Best place to see outputs fast |
| [`@optomitron/extension`](packages/extension/) | Chrome extension scaffold for the Digital Twin Safe / local-first health workflow | Early Layer 1 scaffold |

---

## How It Works

```
 ┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
 │  COLLECT     │     │  INFER           │     │  RECOMMEND       │
 │              │     │                  │     │                  │
 │  Health data │────▶│  Temporal        │────▶│  Personal optimal│
 │  Preferences │     │  alignment       │     │  values & doses  │
 │  Outcomes    │     │  Bradford Hill   │     │  Policy rankings │
 │  Spending    │     │  Effect sizes    │     │  Budget levels   │
 │  Policies    │     │  PIS scoring     │     │  Alignment scores│
 └─────────────┘     └──────────────────┘     └──────────────────┘
```

1. **Collect** — Import time series data from any source: wearables, health apps, government statistics, business metrics.
2. **Align** — Pair predictor and outcome measurements using configurable onset delays and durations of action.
3. **Score** — Apply all 9 Bradford Hill criteria for causation via saturation functions, producing a Predictor Impact Score (PIS) with evidence grade (A–F).
4. **Optimize** — Find the optimal predictor value (dosage, spending level, price point) that produces the best outcomes, with confidence intervals.
5. **Recommend** — Generate actionable recommendations: take this supplement, enact this policy, allocate this budget, fund this candidate.

---

## For Individuals

### 🔒 Digital Twin Safe

The local-first health stack already has real foundations in the repo even though the full personal app is still being productized.

- **9 local-first health importers** in `@optomitron/data` parse Apple Health, Fitbit, Oura, MyFitnessPal, Withings, Google Fit, Cronometer, Strava, and CSV exports into one normalized record shape.
- **Conversational tracking UI** in `@optomitron/chat-ui` includes cards and text-to-measurement parsing for symptom, treatment, mood, food, and insight flows.
- **Daily wellbeing capture** already exists in the web app: profile, census context, and daily health-happiness-income check-ins.
- **Pure TypeScript inference engine** means the core math can run locally in a browser, extension, Electron shell, or server job without being rewritten.
- **Digital Twin Safe extension scaffold** exists in `packages/extension` as the start of the fully local Layer 1 product.

```typescript
import { calculatePredictorImpactScore } from '@optomitron/optimizer';

const result = calculatePredictorImpactScore(
  magnesiumIntake,   // predictor time series
  sleepQuality       // outcome time series
);

console.log(result.effectSize);     // +18% improvement
console.log(result.optimalValue);   // 450 mg/day
console.log(result.evidenceGrade);  // "B"
```

---

## For Governments

### 🏛️ Government OS

Deploy Optomitron for any jurisdiction as a reproducible analysis and accountability stack.

- **Preference collection**: citizens allocate trade-offs through RAPPA pairwise surveys at `/vote`, and the system turns those into stable priority weights.
- **Budget optimization**: `@optomitron/obg` and the examples package generate reallocation targets, minimum-effective spending floors, overspend diagnostics, and constrained budget reports.
- **Policy scoring**: `@optomitron/opg` evaluates policies with Bradford Hill-style causal confidence scoring instead of ideology-first labeling.
- **Political accountability**: personal alignment reports show which benchmark politicians best match a citizen's stated priorities, with public share URLs for distribution.
- **Legislative provenance**: the web app syncs current federal identities from Congress.gov and increasingly derives profiles from recent classified roll calls instead of only curated priors.
- **Cross-jurisdiction analysis**: the examples package already runs international comparisons for health, education, drug policy, criminal justice, and federal spending questions.

The database is multi-tenant: every jurisdiction is a tenant with its own priorities, officials, and data. Think Shopify, but for governments.

---

## Verifiability And AI

- **Storacha/IPFS snapshots** preserve analysis and aggregation outputs as content-addressed history chains.
- **Hypercert-compatible publication helpers** turn Optomitron outputs into activity, measurement, evaluation, and attachment records that can be published with receipts.
- **Autonomous agent workflows** can review publication readiness, interpret test output, and produce structured manifests instead of opaque free-text summaries.
- **World ID integration** is already in the web app as the first step toward sybil-resistant civic aggregation.

---

## For Businesses

### 📈 Same Engine, Different Domain

`@optomitron/optimizer` is **completely domain-agnostic**. It doesn't know the difference between a drug and an ad campaign. Feed it any two time series and it answers: *Does X cause Y? By how much? What's the optimal value of X?*

| Domain | Predictor (X) | Outcome (Y) | Question |
|--------|--------------|-------------|----------|
| Marketing | Ad spend | Revenue | "What's the optimal weekly ad budget?" |
| Pricing | Price point | Conversion rate | "What price maximizes revenue?" |
| Product | Feature release | User retention | "Did this feature improve retention?" |
| Manufacturing | Temperature | Defect rate | "What setting minimizes defects?" |
| Agriculture | Fertilizer | Crop yield | "What's the optimal fertilizer level?" |

All use the same pipeline: **Temporal alignment → Bradford Hill → Predictor Impact Score → Optimal value.**

---

## Architecture

> Full details in **[ARCHITECTURE.md](./ARCHITECTURE.md)**

```
                    ┌──────────────┐
                    │  optimizer   │  ← Domain-agnostic math core
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌─────────┐  ┌────────────┐  ┌─────────┐
        │   opg   │  │ wishocracy │  │   obg   │
        └─────────┘  └────────────┘  └─────────┘

        ┌─────────┐  ┌─────────┐  ┌──────────┐
        │  data   │  │   db    │  │ chat-ui  │
        └─────────┘  └─────────┘  └──────────┘

        ┌─────────┐  ┌────────────┐  ┌────────┐
        │   web   │  │  examples  │  │extension│
        └─────────┘  └────────────┘  └────────┘

        ┌──────────┐ ┌────────────┐ ┌─────────┐
        │ storage  │ │ hypercerts │ │ agent   │
        └──────────┘ └────────────┘ └─────────┘
```

**Hard rules:**
- `@optomitron/optimizer` depends on **nothing** — it's the foundation
- Library packages are **pure TypeScript** — no server, no database
- `@optomitron/optimizer` is **domain-agnostic** — no references to "drugs", "policies", or "budgets"
- No circular dependencies

---

## Contributing

```bash
# Install
pnpm install

# Full check (typecheck + lint + test) — must pass before committing
pnpm check

# Run tests for a specific package
pnpm --filter @optomitron/optimizer test

# Build all packages
pnpm build
```

### Guidelines

- **Every function gets a test.** No exceptions.
- **TypeScript strict mode** is on — `noUncheckedIndexedAccess`, `noImplicitOverride`, no `any`.
- **Conventional commits** — `feat:`, `fix:`, `test:`, `refactor:`, `docs:`
- **Lint-staged + Husky** pre-commit hooks run automatically.
- **Zod schemas** for runtime validation where types alone aren't enough.
- Functions should be <30 lines, files <300 lines.
- Read [CLAUDE.md](./CLAUDE.md) for the full developer guide and methodology references.

---

## Papers

Every algorithm in this codebase is defined in a published paper with exact formulas, worked examples, and parameter justifications.

### Core Algorithm Papers

| Paper | Implements | Web |
|-------|-----------|-----|
| **dFDA Specification** | `@optomitron/optimizer` — PIS, temporal alignment, Bradford Hill, effect sizes | [dfda-spec.warondisease.org](https://dfda-spec.warondisease.org) |
| **Wishocracy** | `@optomitron/wishocracy` — RAPPA, eigenvector weights, Citizen Alignment Scores | [wishocracy.warondisease.org](https://wishocracy.warondisease.org) |
| **Optimal Policy Generator** | `@optomitron/opg` — Policy Impact Score, Causal Confidence Score, method weights | [opg.warondisease.org](https://opg.warondisease.org) |
| **Optimal Budget Generator** | `@optomitron/obg` — Diminishing returns, Optimal Spending Level, Budget Impact Score | [obg.warondisease.org](https://obg.warondisease.org) |
| **Optimocracy** | Two-metric welfare function (shared by OPG + OBG) | [optimocracy.warondisease.org](https://optimocracy.warondisease.org) |
| **Incentive Alignment Bonds** | `@optomitron/treasury` — IAB mechanism, smart contract campaign funding | [iab.warondisease.org](https://iab.warondisease.org) |

### Motivation & Impact Papers

| Paper | What it quantifies | Web |
|-------|-------------------|-----|
| **Political Dysfunction Tax** | $101T/year governance inefficiency — the problem Optomitron exists to solve | [political-dysfunction-tax.warondisease.org](https://political-dysfunction-tax.warondisease.org) |
| **The Invisible Graveyard** | 102M deaths from FDA efficacy delays since 1962, $1.19 quadrillion deadweight loss | [invisible-graveyard.warondisease.org](https://invisible-graveyard.warondisease.org) |
| **The 1% Treaty** | Redirecting 1% of military spending ($27.2B/yr) → 10.7B deaths prevented, 212-year treatment acceleration | [impact.warondisease.org](https://impact.warondisease.org) |
| **dFDA Impact Analysis** | Trial costs from $41K to $929/patient, $84.8 quadrillion cumulative value | [dfda-impact.warondisease.org](https://dfda-impact.warondisease.org) |
| **US Efficiency Audit** | $4.9T annual US governance waste, $2.45T recoverable capital | [us-efficiency-audit.warondisease.org](https://us-efficiency-audit.warondisease.org) |
| **The Price of Political Change** | Max $25B cost to change US policy — ROI framework for reform incentivization | [cost-of-change.warondisease.org](https://cost-of-change.warondisease.org) |
| **Drug Development Cost Analysis** | 105x real-term cost increase since 1962 Kefauver-Harris Amendment | [drug-cost.warondisease.org](https://drug-cost.warondisease.org) |
| **Right to Trial & FDA Upgrade Act** | Legislative implementation: open-source FDA platform + patient trial participation rights | [right-to-trial.warondisease.org](https://right-to-trial.warondisease.org) |
| **How to End War and Disease** | Complete manual synthesizing all components of the framework | [manual.warondisease.org](https://manual.warondisease.org) |

---

## License

[MIT](https://opensource.org/licenses/MIT) © [Mike P. Sinn](https://github.com/mikepsinn)
