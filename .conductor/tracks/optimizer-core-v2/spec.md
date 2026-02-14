# Track Spec: Diminishing Returns + Minimum Effective Dose (v2)

## Background
Core optimizer utilities need first-class diminishing-returns and minimum-effective-dose diagnostics so downstream packages can produce decision-grade recommendation ranges even when a single "optimal point" is unstable.

## Objectives
- Add reusable diminishing-returns curve diagnostics.
- Add minimum effective dose (MED) and saturation/plateau detection.
- Provide support-constrained target helpers (raw model optimum vs decision-constrained optimum).
- Keep optimizer outputs domain-agnostic and reusable across any predictor/outcome pair.

## API Changes
- Add new helper contracts for:
  - `estimateDiminishingReturns(...)`
  - `estimateMinimumEffectiveDose(...)`
  - `estimateSaturationRange(...)`
  - `deriveSupportConstrainedTargets(...)`
- Keep these helpers independent of database/runtime infrastructure.
- Maintain backwards compatibility for existing optimizer consumers.

## Tests
- Synthetic null/linear/saturating/inverted-U datasets with known ground truth.
- Edge cases with sparse support and high-noise signals.
- Deterministic behavior checks for tie-breakers and fallback states.

## Acceptance Criteria
- MED and diminishing-returns estimators return expected markers on synthetic benchmarks.
- Insufficient-support cases return explicit "not identifiable" outputs instead of false precision.
- Support-constrained target helper returns stable, testable outputs for downstream reports.
- Adaptive binning remains stable and compatible with new diagnostics.
