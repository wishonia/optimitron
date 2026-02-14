# Plan: Optimizer Core v2

## DONE
- [x] Add `partialCorrelation()` in `statistics.ts` (committed 5f6c0d6)
- [x] Add `diminishingReturnsDetection()` helper (committed 5f6c0d6)
- [x] Add tests (67 new tests committed)
- [x] Add `buildAdaptiveNumericBins()` in `packages/optimizer` with exports and tests (2026-02-13)
  - Supports quantile-seeded bins, anchor constraints, edge rounding, and minimum sample-size merging.
  - Added coverage in `packages/optimizer/src/__tests__/adaptive-binning.test.ts`.

## REOPENED PRIORITIES (2026-02-13)
Execution priority note:
- This track is foundational for analysis-explorer-v2 decision outputs and should be completed before explorer items that depend on support-constrained targeting.

1. [ ] Add decision-grade diminishing-returns API.
   - Expose a reusable curve diagnostics helper that estimates marginal gains across predictor values.
   - Return knee-point / diminishing-returns onset candidate with support diagnostics.
2. [ ] Add minimum effective dose (MED) estimator.
   - Detect the lowest predictor level where outcome gains become consistently positive beyond noise thresholds.
   - Include uncertainty/support metadata and "not identifiable" fallback state.
3. [ ] Add saturation/plateau-zone estimator.
   - Detect ranges where marginal gains are near-zero or inconsistent.
   - Return a practical upper bound for decision-grade recommendations when detectable.
4. [ ] Add support-constrained target helpers for downstream report generators.
   - Compute model-optimal (raw), support-constrained optimal, and robust-window optimal in one contract.
   - Provide delta metrics among the three targets.
5. [ ] Add synthetic-test fixtures for known response shapes.
   - Null/no effect, monotonic linear, saturating Michaelis-Menten, and inverted-U patterns.
   - Validate MED/knee/plateau detection behavior and uncertainty flags.
6. [ ] Add lightweight integration hooks for explorer pair studies.
   - Keep optimizer domain-agnostic (predictor/outcome terminology only).
   - Surface MED/diminishing-returns outputs without coupling to jurisdiction semantics.

## DEFERRED (YAGNI)
- [ ] ~~Add `partialR` to `FullAnalysisResult`~~ — not needed yet; ad-hoc scripts handle this
- [ ] ~~Update report generator solely for partialR~~ — use focused report changes when a concrete consumer needs it
