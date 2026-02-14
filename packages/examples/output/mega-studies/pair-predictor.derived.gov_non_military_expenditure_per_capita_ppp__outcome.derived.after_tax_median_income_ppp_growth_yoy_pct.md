# Pair Study: Civilian Government Expenditure Per Capita (PPP) -> After-Tax Median Income Growth (YoY %)

- Pair ID: `predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct`
- Lag years: 3
- Duration years: 1
- Temporal profile source: predictor_default
- Filling strategy: interpolation
- Temporal candidates evaluated: 12
- Temporal candidates with valid results: 12
- Temporal profile score: 0.6025
- Included subjects: 148
- Skipped subjects: 0
- Total aligned pairs: 4853
- Signal grade: B (strong)
- Data status: enough data
- Confidence score: 0.570 (medium confidence)
- Signal tag: early signal
- Direction: positive
- Uncertainty score: 0.3000 (lower is better)

## Quick Meanings

- `Recommended level`: main value to try first.
- `Data-backed level`: level directly supported by seen data.
- `Backup level`: safer fallback from the middle of the data.
- `Math-only guess`: unconstrained model output for technical comparison.
- `Not enough data`: we cannot safely recommend a level yet.

## Key Numeric Takeaways

- Recommended Civilian Government Expenditure Per Capita (PPP) level for higher After-Tax Median Income Growth (YoY %): 484.31 international $/person (data-backed level).
- Best level directly seen in the grouped data: 484.31 international $/person.
- Math-only guess is inside seen data but outside the best-performing bucket, so we still use the data-backed level.
- Best observed bin anchor (median/mean) is 622.18 international $/person; model-optimal minus observed-anchor difference is 3251.3 (+522.6%).
- Backup level check (middle 10-90% of data) suggests 511.72 international $/person.
- The math-only guess and backup level differ by 86.8%, which means extreme values may matter a lot.
- Minimum effective level (first consistently positive zone): 251.59 international $/person.
- Diminishing returns likely begin near 484.31 international $/person.
- Saturation/plateau zone starts around 3488.0 international $/person and extends through 15502.1 international $/person.
- Highest observed mean After-Tax Median Income Growth (YoY %) appears when Civilian Government Expenditure Per Capita (PPP) is in [457.16, 845.17) (mean outcome 5.931).
- Direction is positive in this analysis, so increasing this predictor is associated with better outcomes.

## Decision Summary

- Interpretation: Early signal only; use this mainly to guide more testing.
- Pattern hint: higher Civilian Government Expenditure Per Capita (PPP) tends to go with better After-Tax Median Income Growth (YoY %).
- Signal strength: weak to moderate; avoid strong conclusions from this pair alone.

## Plain-Language Summary

- Higher Civilian Government Expenditure Per Capita (PPP) tends to align with better After-Tax Median Income Growth (YoY %).
- The estimate uses 148 subjects and 4853 aligned predictor-outcome observations.
- Best observed mean outcome appears in predictor bin [457.16, 845.17) (mean outcome 5.931).
- A minimum effective predictor level appears near 251.59 international $/person in the binned response curve.
- Confidence score is 0.570 (medium confidence); data status is enough data.
- Outcome values in these summaries are welfare-aligned for cross-metric comparison (higher means better).

## Quality Warnings

- Top temporal profiles are close (score delta 0.0011); temporal assumptions are not yet robust.
- Robustness check: trimmed-range optimal differs by 86.8% from raw optimal; tail observations materially influence target.

## Appendix: Technical Diagnostics

### Core Metrics

| Metric | Value |
|--------|------:|
| Forward correlation | 0.0956 |
| Reverse correlation | -0.0119 |
| Direction score (forward - reverse) | 0.1075 |
| Effect size (% change from baseline) | 57.3407 |
| Significance score | 0.7000 |
| Weighted PIS | 0.1800 |
| Value linked with higher outcome | 3873.5181 |
| Value linked with lower outcome | 3720.4768 |
| Math-only best daily value | 3873.5181 |
| Recommended level (reader-facing) | 484.31 international $/person (data-backed level) |
| Math-only guess (technical) | 3873.5 international $/person |
| Data-backed level | 484.31 international $/person |
| Data-backed range | [328.32, 622.18) |
| Backup level (middle-data check) | 1778.8 international $/person |
| Math-only guess inside seen data range? | yes |
| Math-only guess inside data-backed range? | no |
| Seen data range | [7.6041, 62399.1940] |
| Math-only guess outside seen data? | no (within observed range) |
| Math-only guess outside best observed bucket? | yes |
| Best observed range | [457.16, 845.17) |
| Best observed range (middle-data check) | [372.83, 649.66) |
| Best observed outcome average | 5.931 |
| Best observed outcome average (middle-data check) | 6.166 |
| Backup level (bucket median) | 511.72 international $/person |
| Math-only vs backup difference | -3361.8 (-86.8%) |
| Middle-data share kept | 80.0% (3881/4853) |
| Data status | enough data |
| Data-status details | none |
| Confidence score | 0.5704 (medium confidence) |
| Reliability support component | 0.8978 |
| Reliability significance component | 0.7000 |
| Reliability directional component | 0.7168 |
| Reliability temporal-stability component | 0.0374 |
| Reliability robustness component | 0.1468 |
| Signal tag | early signal |

### Response-Curve Diagnostics

| Diagnostic | Result |
|------------|--------|
| Minimum useful level | 251.59 international $/person (z=1.06) |
| Point where gains start slowing | 484.31 international $/person (ratio=-0.106) |
| Flat zone range | [3073.5, 51665.2] |
| Why this data-backed level was chosen | identified |
| Math-only guess minus data-backed level | 3389.2 (+699.8%) |

### Temporal Sensitivity

| Profile | Source | Lag (years) | Duration (years) | Filling | Score | Delta vs Best | Included Subjects | Total Pairs |
|---------|--------|------------:|-----------------:|---------|------:|--------------:|------------------:|------------:|
| Selected | predictor_default | 3 | 1 | interpolation | 0.6025 | 0.0000 | 148 | 4853 |
| Runner-up | predictor_default | 2 | 1 | interpolation | 0.6014 | 0.0011 | 148 | 4853 |
| Runner-up | predictor_default | 2 | 2 | interpolation | 0.6013 | 0.0012 | 148 | 4853 |
| Runner-up | predictor_default | 0 | 1 | interpolation | 0.5910 | 0.0115 | 148 | 4853 |

### Binned Pattern Table

| Bin | Predictor Range | Pairs | Subjects | Predictor Mean | Predictor Median | Outcome Mean | Outcome Median |
|----:|-----------------|------:|---------:|---------------:|-----------------:|-------------:|---------------:|
| 1 | [7.604, 211.08) | 486 | 24 | 119.9166 | 107.9202 | 4.3827 | 4.7707 |
| 2 | [211.08, 457.16) | 485 | 41 | 307.1541 | 287.8307 | 4.6044 | 4.7331 |
| 3 | [457.16, 845.17) | 485 | 50 | 625.1364 | 622.1792 | 5.9309 | 5.2556 |
| 4 | [845.17, 1259.4) | 485 | 60 | 1032.5545 | 1022.9992 | 4.1873 | 5.0776 |
| 5 | [1259.4, 2058.6) | 484 | 58 | 1649.4765 | 1648.9683 | 5.1004 | 4.6831 |
| 6 | [2058.6, 3277.1) | 487 | 60 | 2637.5121 | 2635.5958 | 4.4317 | 4.5317 |
| 7 | [3277.1, 4544.8) | 485 | 68 | 3832.8515 | 3782.2386 | 4.4793 | 4.4813 |
| 8 | [4544.8, 7053.8) | 485 | 70 | 5644.8697 | 5493.8454 | 4.9722 | 4.7417 |
| 9 | [7053.8, 10886.0) | 485 | 55 | 8919.0912 | 9049.4836 | 4.4251 | 4.1062 |
| 10 | [10886.0, 51665.2] | 486 | 46 | 16379.1383 | 14642.5590 | 4.6249 | 4.4589 |

### Distribution Charts

```text
Predictor Distribution (Civilian Government Expenditure Per Capita (PPP))
[7.604, 4312.4) | ############################## 3323
[4312.4, 8617.2) | ####### 752
[8617.2, 12922.0) | #### 463
[12922.0, 17226.8) | # 158
[17226.8, 21531.6) | # 86
[21531.6, 25836.4) | # 34
[25836.4, 30141.2) | # 24
[30141.2, 34446.0) | # 3
[34446.0, 38750.8) | # 3
[38750.8, 43055.6) | # 4
[43055.6, 47360.4) | # 2
[47360.4, 51665.2] | # 1
```

```text
Outcome Distribution (After-Tax Median Income Growth (YoY %), welfare-aligned)
[-49.393, -31.954) | # 8
[-31.954, -14.516) | # 43
[-14.516, 2.923) | ############## 1482
[2.923, 20.361) | ############################## 3253
[20.361, 37.799) | # 54
[37.799, 55.238) | # 6
[55.238, 72.676) | # 6
[142.43, 159.87] | # 1
```

### Top Subjects

| Subject | Forward r | Directional Score | Effect % | Pairs |
|---------|----------:|------------------:|---------:|------:|
| GAB | -0.4567 | -0.9776 | -87.203 | 33 |
| ECU | 0.5503 | 0.9538 | 190.003 | 33 |
| BOL | 0.1520 | 0.9437 | 52.022 | 33 |
| SST | 0.2185 | 0.7911 | 3.623 | 33 |
| TLA | 0.1874 | 0.7049 | 4.517 | 33 |
| LAC | 0.1748 | 0.7031 | -4.783 | 33 |
| LCN | 0.1907 | 0.7026 | 4.662 | 33 |
| LDC | 0.2132 | 0.7004 | 24.611 | 33 |
