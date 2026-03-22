# Government Size Analysis: World Bank Panel (1990-2023)

## Summary

Lag-aligned panel diagnostics suggest a **minimum efficient government spending floor** around **$16,638 PPP per capita** (support bin **$15,000 - $19,000**).

- **U.S.-equivalent floor share:** 20.2% of GDP (band 18.2-23.1)
- **Cross-country floor-bin median share (descriptive only):** 40.0% of GDP (IQR 35.7-43.5)
- **US latest spending share (2023):** 24.9%
- **US latest GDP per-capita PPP (2023):** $82,305
- **US latest spending per-capita PPP (2023):** $20,492
- **US gap to U.S.-equivalent floor:** +4.7 percentage points
- **US gap to per-capita floor estimate:** +$3,854
- **US status vs inferred band:** above optimal band
- **Headline outcomes used:** Healthy Life Expectancy (HALE)
- **Qualifying low-spend / high-outcome jurisdictions:** 29
- **Lowest direct-outcome floor in this model:** Healthy Life Expectancy Only at 20.2% of U.S. GDP
- **Federal current-budget composition view:** standalone category optima sum to $8,313,687,512,185 (+23.2% vs current federal budget), but the composition table below is constrained to today's federal budget

## Predictor Definition

Government Expense (% GDP):
- World Bank WDI `GC.XPN.TOTL.GD.ZS`
- World Bank labels this series as government expense; it is not a category decomposition.
- Cross-country headline comparisons should use per-capita PPP; raw % GDP is descriptive only.
- Source taxonomy and alternative definitions: `government-spending-metric-comparison.md`.

## Data Coverage

- Jurisdictions: 47
- Years: 1990-2023
- Country-year observations: 1402

## Objective Floors

These floors isolate direct welfare objectives instead of forcing a single combined headline. Each row uses the same lag-aligned floor method and then translates the per-capita floor into a U.S.-equivalent % GDP share.

| Objective | U.S.-Equiv Floor % GDP | U.S.-Equiv Band | Floor PPP / Capita | Qualifying Jurisdictions |
|-----------|-----------------------:|----------------|-------------------:|-------------------------:|
| Combined Direct Welfare | 26.4 | 23.1-44.7 | $21,719 | 16 |
| Healthy Life Expectancy Only | 20.2 | 18.2-23.1 | $16,638 | 29 |
| Median Income Only | 26.4 | 23.1-44.7 | $21,719 | 16 |

## Floor Tolerance

This checks how much the combined direct-welfare floor moves when the "within tolerance of best bin" rule is tightened or loosened.

| Tolerance | U.S.-Equiv Floor % GDP | U.S.-Equiv Band | Floor PPP / Capita |
|----------:|-----------------------:|----------------|-------------------:|
| 0.15 | 26.4 | 23.1-44.7 | $21,719 |
| 0.35 | 26.4 | 23.1-44.7 | $21,719 |
| 0.75 | 14.5 | 13.4-15.8 | $11,956 |

## Temporal Sensitivity (Start Year)

Start-year sensitivity re-runs the same floor benchmark with different left-window cutoffs; a separate COVID exclusion check drops 2020-2021 source years.

| Start Year | End Year | Country-Years | Jurisdictions | U.S.-Equiv Floor % GDP | U.S.-Equiv Band | Raw Bin Median % GDP | US % GDP | US Status |
|-----------:|---------:|--------------:|--------------:|------------------------:|----------------|---------------------:|---------:|----------|
| 1990 | 2023 | 1402 | 47 | 20.2 | 18.2-23.1 | 40.0 | 24.9 | above optimal band (primary) |
| 1995 | 2023 | 1233 | 47 | 17.8 | 16.4-19.4 | 39.1 | 24.9 | above optimal band |
| 2000 | 2023 | 1036 | 47 | 16.3 | 15.2-17.6 | 37.5 | 24.9 | above optimal band |

COVID exclusion check (dropping 2020-2021 source years): 18.9% GDP U.S.-equivalent (band 17.0-21.9; raw floor-bin median 39.9% GDP; US status above optimal band).

## Federal Composition

The budget-composition summary below comes from the existing US federal budget model, not the cross-country general-government panel. It is useful for "where should money go?" but should not be equated mechanically with the total government size floor.

- **Current federal budget:** $6,750,000,000,000
- **Standalone federal category optima sum:** $8,313,687,512,185
- **Gap vs current federal budget if each category hit its standalone optimum:** +$1,563,687,512,185 (+23.2%)
- **Caveat:** This composition model is federal-budget only; the category table below is constrained to the current federal budget even though standalone category optima sum to a different total.

| Top Scale-Ups At Current Budget | Reallocation % | Evidence | Target Share |
|---------------|------:|----------|--------------:|
| Education | +271.2% | A | 13.1% |
| Science & Space (NASA, NSF) | +329.5% | B | 5.2% |
| Income Security (SNAP, Housing) | +50.9% | D | 6.8% |
| Community & Regional Development | +89.2% | D | 1.1% |
| Energy Programs | +46.0% | D | 1.2% |

| Top Scale-Downs At Current Budget | Reallocation % | Evidence | Target Share |
|-----------------|------:|----------|--------------:|
| Military | -62.3% | D | 5.0% |

| Largest Target Shares At Current Budget | Target Share | Current | Target |
|--------------------------------|--------------:|--------:|--------:|
| Social Security | 21.0% | $1,418,000,000,000 | $1,418,000,000,000 |
| Education | 13.1% | $238,000,000,000 | $883,532,444,340 |
| Net Interest on Debt | 13.1% | $881,000,000,000 | $881,000,000,000 |
| Medicare | 12.9% | $874,000,000,000 | $874,000,000,000 |
| Medicaid & CHIP | 8.5% | $575,000,000,000 | $575,000,000,000 |
| Income Security (SNAP, Housing) | 6.8% | $304,000,000,000 | $458,830,755,271 |
| Science & Space (NASA, NSF) | 5.2% | $81,000,000,000 | $347,916,486,716 |
| Military | 5.0% | $886,000,000,000 | $334,312,540,436 |

## Efficient Jurisdictions

These are jurisdictions with at least two lag-aligned observations inside the minimum-efficient per-capita band and non-negative welfare benchmark scores within that band.

| Jurisdiction | Qualifying Obs | Median % GDP | Median Spend / Capita PPP | Median HALE | Median After-Tax Income |
|--------------|---------------:|-------------:|--------------------------:|------------:|--------------------:|
| Italy | 9 | 43.5 | $15,975 | 71.4 | $16,860 |
| Sweden | 7 | 32.1 | $16,148 | 70.9 | $19,788 |
| United Kingdom | 12 | 39.6 | $16,200 | 69.5 | $19,041 |
| New Zealand | 2 | 35.0 | $16,379 | 70.3 | $16,038 |
| Portugal | 3 | 42.5 | $16,412 | 69.5 | $12,025 |
| Greece | 4 | 56.5 | $16,468 | 69.1 | $10,301 |
| Germany | 3 | 27.9 | $16,525 | 69.1 | $24,841 |
| Norway | 4 | 32.6 | $16,670 | 69.3 | $23,370 |

## Spending Levels vs Typical Outcomes

Headline floor logic uses only outcomes that pass directionality/confounding gates; all four outcomes are still published below.
Rows are lag-aligned for causal interpretation: predictor at year t, outcomes summarized over t+1 to t+3.
Coverage notes for metric construction:
- Healthy life years level: WHO Healthy Life Expectancy (HALE) (direct).
- Healthy life years growth: annualized percent growth of HALE.
- Real after-tax median income level: best available real PPP median-income series.
- Real after-tax median income growth: annualized percent growth of the best-available level series.
- Source hierarchy: OECD direct after-tax disposable income where available; World Bank PIP real median-income fallback elsewhere.

### Spending Share (% GDP) Bins

- Adaptive bins: target 12, minimum 30 observations/bin, anchors at 20%, rounded to 1%

| Spending Level (% GDP) | Country-Years | Jurisdictions | Typical Healthy Life Years (HALE) | Typical Healthy Life Years Growth | Typical Real After-Tax Median Income | Typical Real After-Tax Median Income Growth | Notes |
|------------------------|-------------:|--------------:|-----------------------------------------:|-------------------------------------------:|----------------------------------------------------:|-----------------------------------------------------:|-------|
| 10.3-16% | 108 | 12 | 65.4 | +0.560 | $14,946 | +3.23% | — |
| 16-18% | 101 | 17 | 69.5 | +0.184 | $15,494 | +1.15% | — |
| 18-20% | 65 | 15 | 66.9 | +0.156 | $14,701 | +1.93% | — |
| 20-22% | 48 | 12 | 66.4 | +0.075 | $8,399 | +2.35% | — |
| 22-26% | 93 | 16 | 67.0 | +0.004 | $16,812 | +2.14% | — |
| 26-31% | 129 | 23 | 67.4 | +0.233 | $14,420 | +1.87% | — |
| 31-33% | 99 | 25 | 67.8 | +0.155 | $14,543 | +2.31% | — |
| 33-35% | 99 | 22 | 67.7 | +0.176 | $13,722 | +2.75% | — |
| 35-37% | 88 | 21 | 67.9 | -0.008 | $14,084 | +1.91% | — |
| 37-39% | 99 | 21 | 68.9 | +0.106 | $16,927 | +0.83% | — |
| 39-42% | 120 | 22 | 68.7 | +0.317 | $15,533 | +1.49% | — |
| 42-45% | 105 | 17 | 68.6 | +0.236 | $13,823 | +1.52% | — |
| 45-62.4% | 115 | 17 | 69.2 | +0.493 | $16,926 | +0.96% | — |

### Spending Per-Capita (PPP) Bins

Per-capita PPP spending is derived as: government expense % GDP × GDP per capita PPP.
- Adaptive bins: target 12, minimum 30 observations/bin, anchors at $5,000, $10,000, $20,000, rounded to $500

| Spending Per-Capita PPP Level | Country-Years | Jurisdictions | Typical Healthy Life Years (HALE) | Typical Healthy Life Years Growth | Typical Real After-Tax Median Income | Typical Real After-Tax Median Income Growth | Notes |
|-------------------------------|-------------:|--------------:|-----------------------------------------:|-------------------------------------------:|----------------------------------------------------:|-----------------------------------------------------:|-------|
| $257-$2,000 | 119 | 16 | 60.9 | +0.327 | $3,135 | +3.25% | — |
| $2,000-$3,500 | 92 | 16 | 64.7 | +0.335 | $4,700 | +4.26% | — |
| $3,500-$4,500 | 97 | 24 | 65.3 | +0.364 | $6,765 | +4.10% | — |
| $4,500-$5,000 | 52 | 24 | 65.5 | -0.037 | $8,399 | +1.29% | — |
| $5,000-$5,500 | 49 | 25 | 66.6 | -0.794 | $12,367 | +1.98% | — |
| $5,500-$7,000 | 117 | 32 | 67.6 | +0.104 | $14,383 | +1.86% | — |
| $7,000-$8,500 | 120 | 32 | 67.9 | +0.261 | $14,578 | +2.18% | — |
| $8,500-$10,000 | 112 | 34 | 67.8 | +0.256 | $15,296 | +1.78% | — |
| $10,000-$11,000 | 78 | 30 | 68.6 | +0.208 | $14,460 | +1.95% | — |
| $11,000-$13,000 | 126 | 33 | 68.9 | +0.124 | $17,046 | +1.85% | — |
| $13,000-$15,000 | 92 | 30 | 69.3 | +0.205 | $17,421 | +1.47% | — |
| $15,000-$19,000 | 111 | 28 | 69.6 | +0.205 | $19,235 | +1.09% | — |
| $19,000-$36,758 | 104 | 16 | 70.2 | +0.041 | $22,264 | +0.48% | — |

## Outcome-Level Results

| Outcome | Weight | N | Mean r | Mean pred r | Mean % Change | Partial r (%GDP \| GDP/cap) | Headline | Confidence |
|---------|-------:|---:|-------:|------------:|--------------:|-----------------------------:|----------|------------|
| Healthy Life Expectancy (HALE) | 0.25 | 47 | 0.195 | -0.026 | +1.17% | 0.176 | Yes | C (0.46) |
| Healthy Life Expectancy Growth (Annualized %) | 0.25 | 47 | -0.036 | -0.006 | +311.70% | -0.016 | No: Excluded from headline because this outcome is a growth diagnostic. | D (0.23) |
| After-Tax Median Income (PPP) | 0.25 | 37 | 0.155 | -0.004 | +22.92% | 0.027 | No: Excluded from headline because directionality is weak and the confound-adjusted pooled signal is not positive. | D (0.39) |
| After-Tax Median Income Growth (Annualized %) | 0.25 | 37 | -0.004 | 0.140 | +10.61% | -0.182 | No: Excluded from headline because this outcome is a growth diagnostic. | F (0.19) |

## Method

- Run N-of-1 longitudinal causal analysis within each jurisdiction.
- Keep Bradford Hill scoring, forward vs reverse Pearson, and change-from-baseline as the core within-jurisdiction diagnostics.
- Build lag-aligned bin tables from predictor year t to outcome follow-up window t+1..t+3.
- Compute pooled partial correlations controlling for GDP per capita as a confounding check.
- Derive the headline from Lowest per-capita PPP spending bin within 0.35 composite-score units of the best bin.
- Score the floor bin via Composite z-score across selected direct-welfare outcomes, weighted by outcome weights.
- Translate the per-capita floor into a U.S.-equivalent % GDP share using the latest U.S. GDP per-capita PPP.
- Re-run the same floor logic for HALE-only, income-only, and tolerance-sensitivity scenarios.
- Import the separate federal budget model to summarize minimum-budget composition recommendations by category.
- Report start-year and COVID-excluded sensitivity to show how stable the floor estimate is.

## Limitations

- This is cross-country observational panel analysis; confounding remains possible.
- Total government expense still collapses composition quality, capture, and corruption into a single scalar.
- Raw cross-country % GDP medians are descriptive and not portable across countries with very different GDP per capita.
- The federal composition summary is a separate model and a different budget level from the general-government size floor.
- Category-level floors are a better policy object than a single total-size number.
- Real after-tax median income now uses the best-available real PPP series: OECD direct after-tax disposable income where available, with World Bank PIP fallback elsewhere.
- Cross-country comparability is improved versus the old GNI proxy, but this is still a mixed-source series rather than a perfectly homogeneous single-source panel.
- HALE growth and income-growth series are annualized derivatives and can be noisy in sparse panels.
- Indicator revisions in source databases can shift historical estimates over time.
