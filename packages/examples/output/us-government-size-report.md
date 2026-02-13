# Government Size Analysis: World Bank Panel (1990-2023)

## Summary

Evidence-weighted N-of-1 analysis suggests an optimal government spending share of **32.1% of GDP** (band: **21.5% - 37.8%**).

- **US latest spending share (2023):** 24.9%
- **US gap to central estimate:** -7.2 percentage points
- **US status vs inferred band:** within optimal band

## Predictor Definition

Government Expenditure (% GDP):
- World Bank WDI `GC.XPN.TOTL.GD.ZS`
- Includes total general government spending share relative to GDP (not category-level decomposition).

## Data Coverage

- Jurisdictions: 47
- Years: 1990-2023
- Country-year observations: 1402

## Temporal Sensitivity (Start Year)

All scenarios use the same methodology and countries where data is available; only the start year changes.

| Start Year | End Year | Country-Years | Jurisdictions | Optimal % GDP | Inferred Band | US % GDP | US Status |
|-----------:|---------:|--------------:|--------------:|--------------:|--------------|---------:|----------|
| 1990 | 2023 | 1402 | 47 | 32.1 | 21.5-37.8 | 24.9 | within optimal band (primary) |
| 1995 | 2023 | 1233 | 47 | 32.6 | 22.2-38.6 | 24.9 | within optimal band |
| 2000 | 2023 | 1036 | 47 | 32.7 | 23.1-38.7 | 24.9 | within optimal band |

## Spending Levels vs Typical Outcomes

Primary welfare outcomes are median healthy life years and real after-tax median income growth.
Cross-country panel proxies are used here because direct country-year series for those metrics are incomplete in-repo:
- Healthy life years level proxy: Life expectancy at birth
- Healthy life years growth proxy: Life expectancy YoY change
- Real after-tax median income level proxy: GDP per capita PPP level
- Real after-tax median income growth proxy: Real GDP per capita YoY growth

| Spending Level (% GDP) | Country-Years | Jurisdictions | Typical Healthy Life Years (proxy level) | Typical Healthy Life Years Growth (proxy) | Typical Real After-Tax Median Income (proxy level) | Typical Real After-Tax Median Income Growth (proxy) | Notes |
|------------------------|-------------:|--------------:|-----------------------------------------:|-------------------------------------------:|----------------------------------------------------:|-----------------------------------------------------:|-------|
| <20% | 330 | 20 | 75.3 | +0.271 | $15,458 | +5.22% | — |
| 20-25% | 127 | 20 | 77.1 | +0.200 | $23,474 | +4.51% | — |
| 25-30% | 135 | 23 | 76.5 | +0.190 | $22,201 | +4.93% | — |
| 30-35% | 259 | 29 | 77.0 | +0.229 | $26,949 | +5.74% | — |
| 35-40% | 248 | 29 | 77.6 | +0.202 | $28,110 | +4.98% | — |
| 40-45% | 181 | 22 | 78.9 | +0.205 | $29,108 | +4.27% | — |
| 45-50% | 99 | 17 | 79.9 | +0.205 | $28,921 | +3.87% | — |
| >=50% | 23 | 9 | 80.4 | +0.198 | $26,608 | +1.90% | Small sample: interpret cautiously |

## Outcome-Level Results

| Outcome | Direction | Weight | N | +/- | Mean r | Mean % Change | Optimal %GDP (Median) | IQR | Confidence |
|---------|-----------|-------:|---:|-----|-------:|--------------:|----------------------:|-----|------------|
| Life Expectancy | Higher is better | 0.35 | 47 | 32/15 | 0.305 | +2.12% | 32.4 | 21.4-37.9 | C (0.50) |
| GDP per Capita (PPP) | Higher is better | 0.35 | 47 | 34/13 | 0.301 | +39.39% | 32.2 | 21.9-38.0 | C (0.53) |
| Infant Mortality | Lower is better (negated) | 0.15 | 47 | 33/14 | 0.328 | -13.78% | 32.0 | 21.2-37.5 | C (0.53) |
| Income Inequality (Gini) | Lower is better (negated) | 0.15 | 45 | 21/24 | 0.078 | -1.18% | 30.8 | 21.1-37.8 | D (0.30) |

## Method

- Run N-of-1 longitudinal causal analysis within each jurisdiction.
- Estimate per-jurisdiction optimal predictor value from high-outcome periods.
- Aggregate outcome-level medians and uncertainty bands (IQR).
- Combine outcomes via outcome-weighted average with evidence modulation (0.2 + 0.8*confidence).
- Report start-year sensitivity to show temporal robustness of the estimate.

## Limitations

- This is cross-country observational panel analysis; confounding remains possible.
- Government spending % GDP captures scale, not composition quality.
- Healthy life years and after-tax median income are represented by in-repo proxies in the level table.
- Indicator revisions in source databases can shift historical estimates over time.
