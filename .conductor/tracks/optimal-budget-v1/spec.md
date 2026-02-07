# Track Spec: Universal Optimal Budget (v1)

## Background
The current `optimizeBudget()` works for single-outcome optimization per category. The goal is a universal budget optimizer that maximizes BOTH median after-tax income growth AND median healthy life years (HALE) simultaneously across 15+ spending categories.

## Objectives
- Determine the optimal allocation of the US federal budget ($6.7T) across all major categories
- Optimize for dual outcomes: income growth + healthy life years
- Every category must beat the "return money to citizens" baseline
- Use inflation-adjusted per-capita data to determine optimal LEVELS (not just directions)
- Produce "How the US Should Actually Spend $6.7 Trillion" report

## Key Gaps to Fill
1. **Multi-outcome optimization**: weighted welfare function `w1*income_z + w2*hale_z`
2. **Inflation-adjusted per-capita mode**: divide FRED spending by population × CPI deflator
3. **HALE data**: WHO Healthy Life Expectancy (quality-adjusted years)
4. **"Return to citizens" baseline**: tax burden changes → income growth as null hypothesis
5. **More spending categories**: social benefits, infrastructure, R&D, criminal justice, EPA, foreign aid, veterans

## Acceptance Criteria
- `optimizeBudget()` accepts multiple outcome variables with configurable weights
- All spending inputs are real per-capita inflation-adjusted dollars
- Report shows per-category: current spend, optimal spend, delta, evidence strength, ROI
- Every recommendation backed by N-of-1 analysis with Causal Direction Score
- Pareto frontier shows income-maximizing vs health-maximizing budget tradeoffs
