# Plan: Universal Optimal Budget (v1)

## Phase 1: Data Infrastructure ✅ COMPLETE
- [x] Add `deflateToRealDollars()` / `toPerCapita()` / `deflateAndPerCapita()` (commit `e6eb641`)
- [x] CPI + population hardcoded 1950-2023
- [x] US budget categories dataset — 12 categories 2000-2023 (commit `91fef8d`)
- [x] US outcome metrics dataset — 9 outcomes including HALE (commit `91fef8d`)

## Phase 2: Multi-Outcome Optimizer ✅ COMPLETE
- [x] `optimizeBudgetMultiOutcome()` with weighted welfare function (commit `2106d40`)
- [x] z-scored welfare ranking across categories
- [x] "Return to citizens" baseline category
- [x] 25 tests passing (commit `568ef35`)

## Phase 3: US-Only Analysis (v2 + v3) ✅ COMPLETE (but limited)
- [x] v2: Absolute values, 12 categories, dual outcomes (commit `cbb56fc`)
- [x] v3: YoY detrended — honest: N=23 too small, nothing survives Bonferroni
- [x] Codex critical review — identified major methodology issues
- **Lesson**: US-only (N=23) is statistically fragile. Need cross-country panel.

## Phase 4: Cross-Country Panel Data 🔄 IN PROGRESS
- [ ] OECD 23-country budget/outcome panel (2000-2022, ~500 obs) — subagent running
- [ ] Include BOTH per-capita PPP spending AND % GDP (per-capita is primary)
- [ ] Swap US deflator from CPI to GDP deflator
- [ ] Add World Bank PPP constant dollar series for all spending categories

## Phase 5: Robust Panel Analysis (v4)
- [ ] N-of-1 within each country, then aggregate across countries
- [ ] Lead with change-from-baseline + z-score (NOT Pearson r)
- [ ] Auto-test multiple lag structures (0, 1, 2, 3, 5, 10 years)
- [ ] COVID sensitivity check (with/without 2020-2021)
- [ ] Bonferroni correction for multiple testing
- [ ] Predictive Pearson for causal direction on each pair
- [ ] Compare US allocation vs "what works globally"

## Phase 6: Report + Visualization
- [ ] Generate `reports/us-optimal-budget-v4.md` with panel evidence
- [ ] Generate `optimal-budget-v4.json` for website
- [ ] Executive summary: 1-page "where every dollar should go"
- [ ] Per-category evidence cards with change-from-baseline headlines
- [ ] Pareto frontier visualization (income vs health weights)
- [ ] Interactive slider on website (adjust category → see welfare change)

## Phase 7: Critical Review
- [ ] Codex critical review of v4 methodology
- [ ] Document known limitations prominently
- [ ] Compare findings to established health economics literature
- [ ] Peer review checklist: would this survive journal submission?
