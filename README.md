# Optomitron

**Time Series Causal Inference Engine** — Evidence-based governance & drug assessment

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Optomitron is a TypeScript library for **causal inference from time series data**. The core engine is domain-agnostic and can analyze any predictor-outcome relationship:

| Application | Predictor | Outcome | Use Case |
|-------------|-----------|---------|----------|
| **dFDA** | Drug/Supplement | Symptom/Biomarker | Treatment effectiveness |
| **OPG** | Policy | Welfare metrics | Policy recommendations |
| **OBG** | Spending level | Welfare metrics | Budget optimization |

All applications use the same underlying algorithms:
- **Temporal alignment** with onset delay and duration of action
- **Bradford Hill criteria** for causal confidence scoring
- **Predictor Impact Score (PIS)** composite metric
- **Optimal value** analysis (precision dosing / optimal spending)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   @optomitron/causal                         │
│          (Domain-agnostic causal inference core)            │
│                                                              │
│  • Temporal alignment (onset delay δ, duration τ)           │
│  • Bradford Hill criteria scoring                           │
│  • Predictor Impact Score (PIS)                             │
│  • Effect size calculation                                  │
│  • Optimal value analysis                                   │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ @optomitron/  │   │ @optomitron/  │   │ @optomitron/  │
│    dfda       │   │    policy     │   │    budget     │
│               │   │    (OPG)      │   │    (OBG)      │
│ Treatments →  │   │ Policies →    │   │ Spending →    │
│ Symptoms      │   │ Welfare       │   │ Welfare       │
└───────────────┘   └───────────────┘   └───────────────┘
```

## Installation

```bash
# Core causal inference engine
pnpm add @optomitron/causal

# Full package (includes OPG/OBG)
pnpm add @optomitron/core
```

## Quick Start

```typescript
import {
  alignTimeSeries,
  calculatePredictorImpactScore,
  validateDataQuality,
  type TimeSeries,
  type PredictorConfig,
} from '@optomitron/causal';

// Define predictor (e.g., drug intake)
const predictor: TimeSeries = {
  variableId: 'magnesium',
  name: 'Magnesium (mg)',
  measurements: [
    { timestamp: '2024-01-01T08:00:00Z', value: 400 },
    { timestamp: '2024-01-02T08:00:00Z', value: 0 },
    { timestamp: '2024-01-03T08:00:00Z', value: 400 },
    // ... more measurements
  ],
};

// Define outcome (e.g., sleep quality)
const outcome: TimeSeries = {
  variableId: 'sleep_quality',
  name: 'Sleep Quality (1-5)',
  measurements: [
    { timestamp: '2024-01-01T23:00:00Z', value: 4.2 },
    { timestamp: '2024-01-02T23:00:00Z', value: 2.8 },
    { timestamp: '2024-01-03T23:00:00Z', value: 4.5 },
    // ... more measurements
  ],
};

// Configure temporal parameters
const config: PredictorConfig = {
  onsetDelaySeconds: 14400,      // 4 hours (time for magnesium to affect sleep)
  durationOfActionSeconds: 86400, // 24 hours
  fillingType: 'zero',            // Assume 0mg if no measurement
};

// Align time series
const pairs = alignTimeSeries(predictor, outcome, config);

// Validate data quality
const quality = validateDataQuality(pairs);
if (!quality.isValid) {
  console.warn('Data quality issues:', quality.failureReasons);
}

// Calculate Predictor Impact Score
const pis = calculatePredictorImpactScore(pairs);

console.log(`
Predictor Impact Score: ${pis.score.toFixed(3)}
Evidence Grade: ${pis.evidenceGrade}
Correlation: ${pis.forwardCorrelation.pearson.toFixed(3)}
Effect Size: ${pis.effectSize.percentChange.toFixed(1)}% change
Optimal Dose: ${pis.optimalValue?.valuePredictingHighOutcome?.toFixed(0)}mg
Recommendation: ${pis.recommendation}
`);
```

## Key Algorithms

### Temporal Alignment

Accounts for the fact that effects take time to manifest:

```
Predictor (t=0) ──δ──> Effect begins ──τ──> Effect ends
                onset    duration of
                delay       action
```

Two pairing strategies:
- **Outcome-based**: For predictors with filling values (drugs: 0 = not taken)
- **Predictor-based**: For continuous predictors without filling values

### Predictor Impact Score (PIS)

Composite metric combining:

```
PIS = |r| × S × φ_z × φ_temporal × φ_users × φ_pairs
```

| Component | Formula | Bradford Hill Criterion |
|-----------|---------|------------------------|
| `\|r\|` | Correlation magnitude | **Strength** |
| `S` | 1 - p-value | **Strength** (significance) |
| `φ_z` | z / (z + 2) | **Strength** (effect magnitude) |
| `φ_temporal` | r_fwd / (r_fwd + r_rev) | **Temporality** |
| `φ_users` | 1 - e^(-N/10) | **Consistency** |
| `φ_gradient` | Dose-response coefficient | **Biological Gradient** |

### Evidence Grades

| PIS Range | Grade | Interpretation | Recommended Action |
|-----------|-------|----------------|-------------------|
| ≥ 0.5 | A | Strong evidence | High priority for RCT |
| 0.3 - 0.5 | B | Moderate evidence | Consider investigation |
| 0.1 - 0.3 | C | Weak evidence | Monitor for more data |
| < 0.1 | D/F | Insufficient | Low priority |

## Papers

This library implements algorithms from:

- [dFDA Spec](https://dfda-spec.warondisease.org) — Predictor Impact Score methodology
- [Optimocracy](https://optimocracy.warondisease.org) — Evidence-based governance framework
- [Optimal Policy Generator](https://opg.warondisease.org) — Policy recommendations
- [Optimal Budget Generator](https://obg.warondisease.org) — Budget optimization

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm tsc --noEmit
```

## Packages

| Package | Description |
|---------|-------------|
| `@optomitron/causal` | Core causal inference engine (domain-agnostic) |
| `@optomitron/core` | High-level API with OPG/OBG |
| `@optomitron/dfda` | dFDA-specific wrappers (coming soon) |
| `@optomitron/policy` | Policy analysis wrappers (coming soon) |
| `@optomitron/budget` | Budget analysis wrappers (coming soon) |

## License

MIT © [Mike P. Sinn](https://mikesinn.com)
