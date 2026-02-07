# Plan: Optimizer Core v2

## DONE
- [x] Add `partialCorrelation()` in `statistics.ts` (committed 5f6c0d6)
- [x] Add `diminishingReturnsDetection()` helper (committed 5f6c0d6)
- [x] Add tests (67 new tests committed)

## PAUSED — Complexity cost too high for marginal value
- [ ] ~~Add `partialR` to `FullAnalysisResult`~~ — not needed yet; ad-hoc scripts handle this
- [ ] ~~Update report generator~~ — reports already include confound analysis from scripts

**Decision:** Functions exist if needed, but don't wire into core pipeline until a real use case demands it. YAGNI.
