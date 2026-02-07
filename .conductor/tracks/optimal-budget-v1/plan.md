# Plan: Universal Optimal Budget (v1)

## Phase 1: Data Infrastructure
- [ ] Add `toRealPerCapita()` helper to `@optomitron/data` (population × CPI deflator)
- [ ] Add HALE (Healthy Life Expectancy) fetcher from WHO GHO API
- [ ] Convert all FRED spending series to real per-capita
- [ ] Add population data to country-level datasets (World Bank SP.POP.TOTL)
- [ ] Add CPI/GDP deflator series from FRED (CPIAUCSL, GDPDEF)

## Phase 2: Spending Categories (FRED series needed)
- [x] Education (GOV_EDUCATION_SPENDING — 65 years)
- [x] Healthcare (GOV_HEALTH_SPENDING)
- [x] Military (FED_MILITARY_SPENDING)
- [ ] Social benefits / welfare (W823RC1Q027SBEA)
- [ ] Infrastructure / transportation
- [ ] R&D (federal R&D obligations — NSF data)
- [ ] Criminal justice / policing (BJS state+local)
- [ ] Environmental / EPA
- [ ] Foreign aid (USAID + State Dept)
- [ ] Veterans healthcare (VA budget)
- [ ] Interest on debt (FRED A091RC1Q027SBEA)
- [ ] Agriculture subsidies (USDA ERS)

## Phase 3: Multi-Outcome Optimizer
- [ ] Add `outcomes: OutcomeConfig[]` to `BudgetOptimizationInput`
- [ ] Implement weighted welfare function: `Σ(weight_i × z_score_i)`
- [ ] Add Pareto frontier computation (vary weights 0→1)
- [ ] "Return to citizens" baseline category (tax burden → income growth)

## Phase 4: Analysis Pipeline
- [ ] Run full US optimal budget with 15+ categories, dual outcomes
- [ ] Generate per-category evidence cards (r, direction, confidence)
- [ ] Compute "Life Years Gained per $1M" for each category
- [ ] Rank categories by ROI

## Phase 5: Report + Visualization
- [ ] Generate `reports/us-optimal-budget-v2.md` with all evidence
- [ ] Generate `optimal-budget-v2.json` for website
- [ ] Executive summary: 1-page "where every dollar should go"
- [ ] Interactive slider tool on website (adjust category → see welfare change)
