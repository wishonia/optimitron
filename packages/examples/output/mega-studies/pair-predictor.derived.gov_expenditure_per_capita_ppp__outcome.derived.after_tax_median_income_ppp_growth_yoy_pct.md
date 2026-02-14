# Pair Study: Government Expenditure Per Capita (PPP) -> After-Tax Median Income Growth (YoY %)

- Pair ID: `predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct`
- Lag years: 2
- Duration years: 2
- Temporal profile source: predictor_default
- Filling strategy: interpolation
- Temporal candidates evaluated: 12
- Temporal candidates with valid results: 12
- Temporal profile score: 0.5911
- Included subjects: 175
- Skipped subjects: 0
- Total aligned pairs: 5740
- Signal grade: C (moderate)
- Data status: enough data
- Confidence score: 0.590 (medium confidence)
- Signal tag: early signal
- Direction: positive
- Uncertainty score: 0.3050 (lower is better)

## Quick Meanings

- `Recommended level`: main value to try first.
- `Data-backed level`: level directly supported by seen data.
- `Backup level`: safer fallback from the middle of the data.
- `Math-only guess`: unconstrained model output for technical comparison.
- `Not enough data`: we cannot safely recommend a level yet.

## Key Numeric Takeaways

- Recommended Government Expenditure Per Capita (PPP) level for higher After-Tax Median Income Growth (YoY %): 931.16 international $/person (data-backed level).
- Best level directly seen in the grouped data: 931.16 international $/person.
- Math-only guess is inside seen data but outside the best-performing bucket, so we still use the data-backed level.
- Best observed bin anchor (median/mean) is 752.26 international $/person; model-optimal minus observed-anchor difference is 3392.3 (+450.9%).
- Backup level check (middle 10-90% of data) suggests 974.44 international $/person.
- The math-only guess and backup level differ by 76.5%, which means extreme values may matter a lot.
- Minimum effective level (first consistently positive zone): 1837.8 international $/person.
- Diminishing returns likely begin near 931.16 international $/person.
- Saturation/plateau zone starts around 4886.2 international $/person and extends through 16263.2 international $/person.
- Highest observed mean After-Tax Median Income Growth (YoY %) appears when Government Expenditure Per Capita (PPP) is in [576.55, 979.24) (mean outcome 5.390).
- Direction is positive in this analysis, so increasing this predictor is associated with better outcomes.

## Decision Summary

- Interpretation: Early signal only; use this mainly to guide more testing.
- Pattern hint: higher Government Expenditure Per Capita (PPP) tends to go with better After-Tax Median Income Growth (YoY %).
- Signal strength: weak to moderate; avoid strong conclusions from this pair alone.

## Plain-Language Summary

- Higher Government Expenditure Per Capita (PPP) tends to align with better After-Tax Median Income Growth (YoY %).
- The estimate uses 175 subjects and 5740 aligned predictor-outcome observations.
- Best observed mean outcome appears in predictor bin [576.55, 979.24) (mean outcome 5.390).
- A minimum effective predictor level appears near 1837.8 international $/person in the binned response curve.
- Confidence score is 0.590 (medium confidence); data status is enough data.
- Outcome values in these summaries are welfare-aligned for cross-metric comparison (higher means better).

## Quality Warnings

- Weak significance score (<0.70).
- Top temporal profiles are close (score delta 0.0005); temporal assumptions are not yet robust.
- Robustness check: trimmed-range optimal differs by 76.5% from raw optimal; tail observations materially influence target.

## Appendix: Technical Diagnostics

### Core Metrics

| Metric | Value |
|--------|------:|
| Forward correlation | 0.0955 |
| Reverse correlation | -0.0023 |
| Direction score (forward - reverse) | 0.0978 |
| Effect size (% change from baseline) | 49.7617 |
| Significance score | 0.6950 |
| Weighted PIS | 0.1759 |
| Value linked with higher outcome | 4144.5190 |
| Value linked with lower outcome | 3894.9646 |
| Math-only best daily value | 4144.5190 |
| Recommended level (reader-facing) | 931.16 international $/person (data-backed level) |
| Math-only guess (technical) | 4144.5 international $/person |
| Data-backed level | 931.16 international $/person |
| Data-backed range | [755.20, 1122.2) |
| Backup level (middle-data check) | 850.26 international $/person |
| Math-only guess inside seen data range? | yes |
| Math-only guess inside data-backed range? | no |
| Seen data range | [8.5216, 63562.8926] |
| Math-only guess outside seen data? | no (within observed range) |
| Math-only guess outside best observed bucket? | yes |
| Best observed range | [576.55, 979.24) |
| Best observed range (middle-data check) | [806.31, 1164.4) |
| Best observed outcome average | 5.390 |
| Best observed outcome average (middle-data check) | 5.328 |
| Backup level (bucket median) | 974.44 international $/person |
| Math-only vs backup difference | -3170.1 (-76.5%) |
| Middle-data share kept | 80.0% (4592/5740) |
| Data status | enough data |
| Data-status details | none |
| Confidence score | 0.5903 (medium confidence) |
| Reliability support component | 0.9783 |
| Reliability significance component | 0.6950 |
| Reliability directional component | 0.6522 |
| Reliability temporal-stability component | 0.0157 |
| Reliability robustness component | 0.2612 |
| Signal tag | early signal |

### Response-Curve Diagnostics

| Diagnostic | Result |
|------------|--------|
| Minimum useful level | 1837.8 international $/person (z=1.30) |
| Point where gains start slowing | 931.16 international $/person (ratio=-0.190) |
| Flat zone range | [4163.3, 52862.3] |
| Why this data-backed level was chosen | identified |
| Math-only guess minus data-backed level | 3213.4 (+345.1%) |

### Temporal Sensitivity

| Profile | Source | Lag (years) | Duration (years) | Filling | Score | Delta vs Best | Included Subjects | Total Pairs |
|---------|--------|------------:|-----------------:|---------|------:|--------------:|------------------:|------------:|
| Selected | predictor_default | 2 | 2 | interpolation | 0.5911 | 0.0000 | 175 | 5740 |
| Runner-up | predictor_default | 2 | 1 | interpolation | 0.5906 | 0.0005 | 175 | 5740 |
| Runner-up | predictor_default | 3 | 1 | interpolation | 0.5870 | 0.0041 | 175 | 5740 |
| Runner-up | predictor_default | 0 | 1 | interpolation | 0.5626 | 0.0285 | 175 | 5740 |

### Binned Pattern Table

| Bin | Predictor Range | Pairs | Subjects | Predictor Mean | Predictor Median | Outcome Mean | Outcome Median |
|----:|-----------------|------:|---------:|---------------:|-----------------:|-------------:|---------------:|
| 1 | [15.672, 269.79) | 574 | 28 | 159.6083 | 153.0826 | 4.1690 | 4.6333 |
| 2 | [269.79, 576.55) | 570 | 50 | 405.4567 | 388.7454 | 4.7892 | 4.7601 |
| 3 | [576.55, 979.24) | 578 | 60 | 763.9379 | 752.2567 | 5.3896 | 5.0627 |
| 4 | [979.24, 1447.9) | 574 | 69 | 1202.7435 | 1203.7000 | 4.4667 | 4.8325 |
| 5 | [1447.9, 2186.1) | 574 | 70 | 1779.9840 | 1776.1705 | 4.7186 | 4.5000 |
| 6 | [2186.1, 3320.4) | 574 | 73 | 2741.7016 | 2691.7226 | 4.8471 | 5.0000 |
| 7 | [3320.4, 4721.7) | 574 | 80 | 3985.4212 | 3979.0739 | 4.1673 | 4.4198 |
| 8 | [4721.7, 7102.5) | 563 | 82 | 5807.4854 | 5730.1915 | 4.5521 | 4.5113 |
| 9 | [7102.5, 11754.6) | 585 | 63 | 9191.4021 | 9092.0325 | 4.7112 | 4.4430 |
| 10 | [11754.6, 52862.3] | 574 | 49 | 17326.0967 | 15466.7074 | 4.4247 | 4.2229 |

### Distribution Charts

```text
Predictor Distribution (Government Expenditure Per Capita (PPP))
[15.672, 4419.6) | ############################## 3907
[4419.6, 8823.4) | ####### 927
[8823.4, 13227.3) | #### 462
[13227.3, 17631.2) | ## 259
[17631.2, 22035.1) | # 98
[22035.1, 26439.0) | # 41
[26439.0, 30842.9) | # 30
[30842.9, 35246.8) | # 5
[35246.8, 39650.7) | # 3
[39650.7, 44054.6) | # 4
[44054.6, 48458.4) | # 2
[48458.4, 52862.3] | # 2
```

```text
Outcome Distribution (After-Tax Median Income Growth (YoY %), welfare-aligned)
[-62.405, -43.867) | # 4
[-43.867, -25.329) | # 22
[-25.329, -6.791) | # 204
[-6.791, 11.747) | ############################## 5039
[11.747, 30.285) | ### 445
[30.285, 48.823) | # 14
[48.823, 67.360) | # 8
[67.360, 85.898) | # 2
[141.51, 160.05] | # 2
```

### Top Subjects

| Subject | Forward r | Directional Score | Effect % | Pairs |
|---------|----------:|------------------:|---------:|------:|
| BOL | 0.1457 | 0.9546 | 52.022 | 33 |
| LBN | -0.5612 | -0.9188 | -94.069 | 33 |
| LDC | 0.2184 | 0.9094 | 15.065 | 33 |
| ALB | 0.2091 | 0.8940 | 18.224 | 33 |
| ECU | 0.3393 | 0.8716 | 54.882 | 33 |
| KGZ | 0.2860 | 0.8113 | 150.303 | 32 |
| GAB | -0.3638 | -0.8068 | -79.553 | 33 |
| MUS | 0.1292 | 0.7967 | 1.132 | 33 |
