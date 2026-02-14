# Pair Study: Government Health Expenditure Per Capita (PPP) -> After-Tax Median Income Growth (YoY %)

- Pair ID: `predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct`
- Lag years: 2
- Duration years: 2
- Temporal profile source: predictor_default
- Filling strategy: interpolation
- Temporal candidates evaluated: 12
- Temporal candidates with valid results: 12
- Temporal profile score: 0.6192
- Included subjects: 229
- Skipped subjects: 0
- Total aligned pairs: 7356
- Signal grade: C (moderate)
- Data status: enough data
- Confidence score: 0.633 (medium confidence)
- Signal tag: early signal
- Direction: positive
- Uncertainty score: 0.3180 (lower is better)

## Quick Meanings

- `Recommended level`: main value to try first.
- `Data-backed level`: level directly supported by seen data.
- `Backup level`: safer fallback from the middle of the data.
- `Math-only guess`: unconstrained model output for technical comparison.
- `Not enough data`: we cannot safely recommend a level yet.

## Key Numeric Takeaways

- Recommended Government Health Expenditure Per Capita (PPP) level for higher After-Tax Median Income Growth (YoY %): 361.49 international $/person (data-backed level).
- Best level directly seen in the grouped data: 361.49 international $/person.
- Math-only guess is inside seen data but outside the best-performing bucket, so we still use the data-backed level.
- Best observed bin anchor (median/mean) is 46.636 international $/person; model-optimal minus observed-anchor difference is 538.26 (+1154.2%).
- Backup level check (middle 10-90% of data) suggests 37.036 international $/person.
- The math-only guess and backup level differ by 93.7%, which means extreme values may matter a lot.
- Minimum effective level (first consistently positive zone): 35.834 international $/person.
- Diminishing returns likely begin near 35.834 international $/person.
- Saturation/plateau zone starts around 903.60 international $/person and extends through 2793.6 international $/person.
- Highest observed mean After-Tax Median Income Growth (YoY %) appears when Government Health Expenditure Per Capita (PPP) is in [34.371, 71.973) (mean outcome 5.158).
- Direction is positive in this analysis, so increasing this predictor is associated with better outcomes.

## Decision Summary

- Interpretation: Early signal only; use this mainly to guide more testing.
- Pattern hint: higher Government Health Expenditure Per Capita (PPP) tends to go with better After-Tax Median Income Growth (YoY %).
- Signal strength: weak to moderate; avoid strong conclusions from this pair alone.

## Plain-Language Summary

- Higher Government Health Expenditure Per Capita (PPP) tends to align with better After-Tax Median Income Growth (YoY %).
- The estimate uses 229 subjects and 7356 aligned predictor-outcome observations.
- Best observed mean outcome appears in predictor bin [34.371, 71.973) (mean outcome 5.158).
- A minimum effective predictor level appears near 35.834 international $/person in the binned response curve.
- Confidence score is 0.633 (medium confidence); data status is enough data.
- Outcome values in these summaries are welfare-aligned for cross-metric comparison (higher means better).

## Quality Warnings

- Weak significance score (<0.70).
- Top temporal profiles are close (score delta 0.0056); temporal assumptions are not yet robust.
- Robustness check: trimmed-range optimal differs by 93.7% from raw optimal; tail observations materially influence target.

## Appendix: Technical Diagnostics

### Core Metrics

| Metric | Value |
|--------|------:|
| Forward correlation | 0.0985 |
| Reverse correlation | -0.0320 |
| Direction score (forward - reverse) | 0.1305 |
| Effect size (% change from baseline) | 108.1561 |
| Significance score | 0.6820 |
| Weighted PIS | 0.1837 |
| Value linked with higher outcome | 584.8956 |
| Value linked with lower outcome | 558.2327 |
| Math-only best daily value | 584.8956 |
| Recommended level (reader-facing) | 361.49 international $/person (data-backed level) |
| Math-only guess (technical) | 584.90 international $/person |
| Data-backed level | 361.49 international $/person |
| Data-backed range | [290.77, 429.10) |
| Backup level (middle-data check) | 88.305 international $/person |
| Math-only guess inside seen data range? | yes |
| Math-only guess inside data-backed range? | no |
| Seen data range | [0.2591, 8503.2455] |
| Math-only guess outside seen data? | no (within observed range) |
| Math-only guess outside best observed bucket? | yes |
| Best observed range | [34.371, 71.973) |
| Best observed range (middle-data check) | [27.900, 52.150) |
| Best observed outcome average | 5.158 |
| Best observed outcome average (middle-data check) | 5.448 |
| Backup level (bucket median) | 37.036 international $/person |
| Math-only vs backup difference | -547.86 (-93.7%) |
| Middle-data share kept | 80.1% (5895/7356) |
| Data status | enough data |
| Data-status details | none |
| Confidence score | 0.6329 (medium confidence) |
| Reliability support component | 1.0000 |
| Reliability significance component | 0.6820 |
| Reliability directional component | 0.8697 |
| Reliability temporal-stability component | 0.1857 |
| Reliability robustness component | 0.0704 |
| Signal tag | early signal |

### Response-Curve Diagnostics

| Diagnostic | Result |
|------------|--------|
| Minimum useful level | 35.834 international $/person (z=2.36) |
| Point where gains start slowing | 35.834 international $/person (ratio=-0.028) |
| Flat zone range | [660.26, 7046.4] |
| Why this data-backed level was chosen | identified |
| Math-only guess minus data-backed level | 223.41 (+61.8%) |

### Temporal Sensitivity

| Profile | Source | Lag (years) | Duration (years) | Filling | Score | Delta vs Best | Included Subjects | Total Pairs |
|---------|--------|------------:|-----------------:|---------|------:|--------------:|------------------:|------------:|
| Selected | predictor_default | 2 | 2 | interpolation | 0.6192 | 0.0000 | 229 | 7356 |
| Runner-up | predictor_default | 3 | 5 | interpolation | 0.6136 | 0.0056 | 229 | 7356 |
| Runner-up | predictor_default | 3 | 2 | interpolation | 0.6045 | 0.0147 | 229 | 7356 |
| Runner-up | predictor_default | 3 | 3 | interpolation | 0.6032 | 0.0159 | 229 | 7356 |

### Binned Pattern Table

| Bin | Predictor Range | Pairs | Subjects | Predictor Mean | Predictor Median | Outcome Mean | Outcome Median |
|----:|-----------------|------:|---------:|---------------:|-----------------:|-------------:|---------------:|
| 1 | [0.25914, 16.696) | 725 | 38 | 9.2346 | 9.1744 | 3.9030 | 4.3478 |
| 2 | [16.696, 34.371) | 746 | 59 | 23.0983 | 22.1919 | 4.4561 | 4.6186 |
| 3 | [34.371, 71.973) | 735 | 67 | 49.5645 | 46.6361 | 5.1579 | 4.5070 |
| 4 | [71.973, 125.91) | 736 | 72 | 96.8725 | 96.2316 | 5.0635 | 5.0445 |
| 5 | [125.91, 212.54) | 730 | 77 | 168.0951 | 165.1033 | 4.3921 | 4.5059 |
| 6 | [212.54, 315.50) | 731 | 91 | 256.1248 | 256.3404 | 4.4768 | 4.4870 |
| 7 | [315.50, 515.31) | 746 | 94 | 403.4852 | 397.6217 | 5.1340 | 5.4006 |
| 8 | [515.31, 951.90) | 735 | 82 | 685.7724 | 660.2362 | 4.5894 | 4.8509 |
| 9 | [951.90, 1767.6) | 736 | 66 | 1339.7332 | 1379.7371 | 3.9307 | 4.0695 |
| 10 | [1767.6, 7046.4] | 736 | 50 | 2903.1890 | 2591.1084 | 4.3465 | 4.0894 |

### Distribution Charts

```text
Predictor Distribution (Government Health Expenditure Per Capita (PPP))
[0.25914, 587.44) | ############################## 5383
[587.44, 1174.6) | #### 726
[1174.6, 1761.8) | ### 494
[1761.8, 2349.0) | ## 316
[2349.0, 2936.2) | # 158
[2936.2, 3523.3) | # 108
[3523.3, 4110.5) | # 71
[4110.5, 4697.7) | # 43
[4697.7, 5284.9) | # 35
[5284.9, 5872.0) | # 11
[5872.0, 6459.2) | # 7
[6459.2, 7046.4] | # 4
```

```text
Outcome Distribution (After-Tax Median Income Growth (YoY %), welfare-aligned)
[-62.405, -43.867) | # 5
[-43.867, -25.329) | # 29
[-25.329, -6.791) | # 265
[-6.791, 11.747) | ############################## 6459
[11.747, 30.285) | ### 564
[30.285, 48.823) | # 19
[48.823, 67.360) | # 9
[67.360, 85.898) | # 4
[141.51, 160.05] | # 2
```

### Top Subjects

| Subject | Forward r | Directional Score | Effect % | Pairs |
|---------|----------:|------------------:|---------:|------:|
| LBN | -0.5432 | -0.9711 | -113.983 | 33 |
| WSM | 0.1395 | 0.8005 | 14.812 | 33 |
| NRU | -0.4213 | -0.7690 | -144.111 | 33 |
| HTI | -0.2396 | -0.7619 | -74.434 | 33 |
| PHL | 0.3607 | 0.6988 | 38.203 | 33 |
| SDN | -0.1634 | -0.6754 | -97.582 | 33 |
| CSS | 0.0571 | 0.6692 | -29.528 | 33 |
| SOM | -0.0654 | 0.6528 | -84.072 | 32 |
