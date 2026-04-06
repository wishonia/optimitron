# Government Size Analysis: World Bank Panel (1990-2023)

## Summary

Lag-aligned panel diagnostics suggest a **minimum efficient government spending floor** around **$19,299 PPP per capita** (support bin **$18,500 - $20,000**).

- **U.S.-equivalent floor share:** 23.4% of GDP (band 22.5-24.3)
- **Cross-country floor-bin median share (descriptive only):** 40.0% of GDP (IQR 33.9-42.5)
- **US latest spending share (2023):** 24.9%
- **US latest GDP per-capita PPP (2023):** $82,305
- **US latest spending per-capita PPP (2023):** $20,492
- **US gap to U.S.-equivalent floor:** +1.5 percentage points
- **US gap to per-capita floor estimate:** +$1,194
- **US status vs inferred band:** above optimal band
- **Headline outcomes used:** Healthy Life Expectancy (HALE), After-Tax Median Income (PPP)
- **Qualifying low-spend / high-outcome jurisdictions:** 18
- **Lowest direct-outcome floor in this model:** Healthy Life Expectancy Only at 20.1% of U.S. GDP
- **Federal current-budget composition view:** standalone category optima sum to $8,126,336,263,304 (+20.4% vs current federal budget), but the composition table below is constrained to today's federal budget

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
| Combined Direct Welfare | 23.4 | 22.5-24.3 | $19,299 | 18 |
| Healthy Life Expectancy Only | 20.1 | 18.2-22.5 | $16,506 | 29 |
| Median Income Only | 27.8 | 24.3-44.7 | $22,912 | 16 |

## Floor Tolerance

This checks how much the combined direct-welfare floor moves when the "within tolerance of best bin" rule is tightened or loosened.

| Tolerance | U.S.-Equiv Floor % GDP | U.S.-Equiv Band | Floor PPP / Capita |
|----------:|-----------------------:|----------------|-------------------:|
| 0.15 | 27.8 | 24.3-44.7 | $22,912 |
| 0.35 | 23.4 | 22.5-24.3 | $19,299 |
| 0.75 | 20.1 | 18.2-22.5 | $16,506 |

## Temporal Sensitivity (Start Year)

Start-year sensitivity re-runs the same floor benchmark with different left-window cutoffs; a separate COVID exclusion check drops 2020-2021 source years.

| Start Year | End Year | Country-Years | Jurisdictions | U.S.-Equiv Floor % GDP | U.S.-Equiv Band | Raw Bin Median % GDP | US % GDP | US Status |
|-----------:|---------:|--------------:|--------------:|------------------------:|----------------|---------------------:|---------:|----------|
| 1990 | 2023 | 1402 | 47 | 23.4 | 22.5-24.3 | 40.0 | 24.9 | above optimal band (primary) |
| 1995 | 2023 | 1233 | 47 | 27.8 | 24.3-44.7 | 40.7 | 24.9 | within optimal band |
| 2000 | 2023 | 1036 | 47 | 22.0 | 20.0-24.3 | 40.0 | 24.9 | above optimal band |

COVID exclusion check (dropping 2020-2021 source years): 23.0% GDP U.S.-equivalent (band 21.3-24.3; raw floor-bin median 40.1% GDP; US status above optimal band).

## Federal Composition

The budget-composition summary below comes from the existing US federal budget model, not the cross-country general-government panel. It is useful for "where should money go?" but should not be equated mechanically with the total government size floor.

- **Current federal budget:** $6,750,000,000,000
- **Standalone federal category optima sum:** $8,126,336,263,304
- **Gap vs current federal budget if each category hit its standalone optimum:** +$1,376,336,263,304 (+20.4%)
- **Caveat:** This composition model is federal-budget only; the category table below is constrained to the current federal budget even though standalone category optima sum to a different total.

| Top Scale-Ups At Current Budget | Reallocation % | Evidence | Target Share |
|---------------|------:|----------|--------------:|
| Education | +281.9% | A | 13.5% |
| Income Security (SNAP, Housing) | +61.4% | D | 7.3% |
| Science & Space (NASA, NSF) | +217.0% | A | 3.8% |
| Community & Regional Development | +102.4% | D | 1.2% |
| Energy Programs | +56.1% | D | 1.2% |

| Top Scale-Downs At Current Budget | Reallocation % | Evidence | Target Share |
|-----------------|------:|----------|--------------:|
| Military | -59.7% | D | 5.3% |

| Largest Target Shares At Current Budget | Target Share | Current | Target |
|--------------------------------|--------------:|--------:|--------:|
| Social Security | 21.0% | $1,418,000,000,000 | $1,418,000,000,000 |
| Education | 13.5% | $238,000,000,000 | $908,859,999,363 |
| Net Interest on Debt | 13.1% | $881,000,000,000 | $881,000,000,000 |
| Medicare | 12.9% | $874,000,000,000 | $874,000,000,000 |
| Medicaid & CHIP | 8.5% | $575,000,000,000 | $575,000,000,000 |
| Income Security (SNAP, Housing) | 7.3% | $304,000,000,000 | $490,636,825,233 |
| Military | 5.3% | $886,000,000,000 | $357,487,028,912 |
| Veterans Benefits | 4.0% | $270,000,000,000 | $270,000,000,000 |

## Efficient Jurisdictions

These are jurisdictions with at least two lag-aligned observations inside the minimum-efficient per-capita band and non-negative welfare benchmark scores within that band.

| Jurisdiction | Qualifying Obs | Median % GDP | Median Spend / Capita PPP | Median HALE | Median After-Tax Income |
|--------------|---------------:|-------------:|--------------------------:|------------:|--------------------:|
| Finland | 2 | 37.5 | $19,030 | 70.2 | $27,576 |
| Denmark | 5 | 39.9 | $19,082 | 70.2 | $26,079 |
| Norway | 2 | 33.0 | $19,373 | 69.7 | $31,694 |
| France | 3 | 49.1 | $19,755 | 70.4 | $25,526 |

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
| 9.7-15% | 92 | 10 | 65.2 | +0.417 | $1,938 | +2.94% | — |
| 15-18% | 146 | 18 | 67.7 | +0.157 | $8,874 | +2.35% | — |
| 18-20% | 71 | 16 | 66.1 | +0.295 | $4,400 | +2.29% | — |
| 20-21% | 33 | 10 | 66.3 | +0.057 | $4,767 | +2.50% | — |
| 21-26% | 116 | 20 | 67.0 | -0.489 | $7,944 | +2.72% | — |
| 26-30% | 98 | 21 | 67.7 | +0.102 | $7,062 | +2.21% | — |
| 30-32% | 93 | 22 | 67.3 | +0.233 | $9,314 | +1.89% | — |
| 32-35% | 152 | 27 | 68.0 | +0.156 | $11,720 | +2.96% | — |
| 35-37% | 89 | 21 | 68.0 | +0.152 | $10,543 | +2.56% | — |
| 37-39% | 100 | 21 | 68.9 | +0.098 | $12,889 | +2.12% | — |
| 39-42% | 121 | 22 | 68.7 | +0.249 | $15,818 | +1.96% | — |
| 42-45% | 105 | 17 | 68.4 | +0.378 | $16,577 | +1.60% | — |
| 45-62.4% | 117 | 19 | 69.1 | +0.310 | $18,851 | +1.53% | — |

### Spending Per-Capita (PPP) Bins

Per-capita PPP spending is derived as: government expense % GDP × GDP per capita PPP.
- Adaptive bins: target 12, minimum 30 observations/bin, anchors at $5,000, $10,000, $20,000, rounded to $500

| Spending Per-Capita PPP Level | Country-Years | Jurisdictions | Typical Healthy Life Years (HALE) | Typical Healthy Life Years Growth | Typical Real After-Tax Median Income | Typical Real After-Tax Median Income Growth | Notes |
|-------------------------------|-------------:|--------------:|-----------------------------------------:|-------------------------------------------:|----------------------------------------------------:|-----------------------------------------------------:|-------|
| $188-$1,500 | 122 | 14 | 60.9 | -0.006 | $1,369 | +2.78% | — |
| $1,500-$2,500 | 86 | 14 | 64.2 | +0.099 | $2,123 | +3.06% | — |
| $2,500-$4,000 | 104 | 22 | 65.2 | +0.440 | $2,625 | +3.20% | — |
| $4,000-$5,000 | 109 | 29 | 64.9 | +0.235 | $4,432 | +2.39% | — |
| $5,000-$6,500 | 127 | 29 | 66.6 | +0.054 | $8,821 | +2.39% | — |
| $6,500-$8,000 | 128 | 31 | 68.2 | +0.233 | $10,990 | +1.58% | — |
| $8,000-$9,500 | 106 | 34 | 67.6 | +0.192 | $11,813 | +1.95% | — |
| $9,500-$10,000 | 40 | 24 | 67.9 | +0.256 | $12,838 | +2.51% | — |
| $10,000-$11,000 | 78 | 30 | 68.6 | +0.146 | $14,739 | +2.48% | — |
| $11,000-$12,500 | 101 | 33 | 68.5 | +0.302 | $16,861 | +2.56% | — |
| $12,500-$15,000 | 117 | 31 | 69.3 | +0.031 | $17,741 | +1.58% | — |
| $15,000-$18,500 | 103 | 28 | 69.6 | +0.168 | $22,994 | +1.20% | — |
| $18,500-$20,000 | 31 | 13 | 70.0 | +0.455 | $25,526 | +1.87% | — |
| $20,000-$36,758 | 81 | 16 | 70.3 | +0.162 | $28,859 | +1.53% | — |

## Outcome-Level Results

| Outcome | Weight | N | Mean r | Mean pred r | Mean % Change | Partial r (%GDP \| GDP/cap) | Headline | Confidence |
|---------|-------:|---:|-------:|------------:|--------------:|-----------------------------:|----------|------------|
| Healthy Life Expectancy (HALE) | 0.25 | 47 | 0.185 | -0.059 | +1.01% | 0.169 | Yes | C (0.44) |
| Healthy Life Expectancy Growth (Annualized %) | 0.25 | 47 | -0.021 | -0.006 | -277.86% | 0.036 | No: Excluded from headline because this outcome is a growth diagnostic. | D (0.24) |
| After-Tax Median Income (PPP) | 0.25 | 46 | 0.207 | -0.020 | +204.70% | 0.066 | Yes | C (0.42) |
| After-Tax Median Income Growth (Annualized %) | 0.25 | 46 | 0.033 | 0.115 | +5064.53% | -0.030 | No: Excluded from headline because this outcome is a growth diagnostic. | F (0.16) |

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
