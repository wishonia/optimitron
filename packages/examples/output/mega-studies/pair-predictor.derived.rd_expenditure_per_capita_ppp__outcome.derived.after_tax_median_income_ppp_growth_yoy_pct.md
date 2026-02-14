# Pair Study: R&D Expenditure Per Capita (PPP) -> After-Tax Median Income Growth (YoY %)

- Pair ID: `predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct`
- Lag years: 1
- Duration years: 2
- Temporal profile source: predictor_default
- Filling strategy: interpolation
- Temporal candidates evaluated: 12
- Temporal candidates with valid results: 12
- Temporal profile score: 0.6345
- Included subjects: 123
- Skipped subjects: 0
- Total aligned pairs: 4011
- Signal grade: C (moderate)
- Data status: enough data
- Confidence score: 0.664 (medium confidence)
- Signal tag: early signal
- Direction: positive
- Uncertainty score: 0.3286 (lower is better)

## Quick Meanings

- `Recommended level`: main value to try first.
- `Data-backed level`: level directly supported by seen data.
- `Backup level`: safer fallback from the middle of the data.
- `Math-only guess`: unconstrained model output for technical comparison.
- `Not enough data`: we cannot safely recommend a level yet.

## Key Numeric Takeaways

- Recommended R&D Expenditure Per Capita (PPP) level for higher After-Tax Median Income Growth (YoY %): 15.455 international $/person (data-backed level).
- Best level directly seen in the grouped data: 15.455 international $/person.
- Math-only guess is inside seen data but outside the best-performing bucket, so we still use the data-backed level.
- Best observed bin anchor (median/mean) is 3.140 international $/person; model-optimal minus observed-anchor difference is 279.67 (+8906.3%).
- Backup level check (middle 10-90% of data) suggests 18.124 international $/person.
- The math-only guess and backup level differ by 93.6%, which means extreme values may matter a lot.
- Could not find a clear minimum useful level (no_consistent_effective_dose_detected).
- Diminishing returns likely begin near 15.455 international $/person.
- Saturation/plateau zone starts around 93.634 international $/person and extends through 1333.4 international $/person.
- Highest observed mean After-Tax Median Income Growth (YoY %) appears when R&D Expenditure Per Capita (PPP) is in [0.19723, 4.911) (mean outcome 5.327).
- Direction is positive in this analysis, so increasing this predictor is associated with better outcomes.

## Decision Summary

- Interpretation: Early signal only; use this mainly to guide more testing.
- Pattern hint: higher R&D Expenditure Per Capita (PPP) tends to go with better After-Tax Median Income Growth (YoY %).
- Signal strength: weak to moderate; avoid strong conclusions from this pair alone.

## Plain-Language Summary

- Higher R&D Expenditure Per Capita (PPP) tends to align with better After-Tax Median Income Growth (YoY %).
- The estimate uses 123 subjects and 4011 aligned predictor-outcome observations.
- Best observed mean outcome appears in predictor bin [0.19723, 4.911) (mean outcome 5.327).
- Confidence score is 0.664 (medium confidence); data status is enough data.
- Outcome values in these summaries are welfare-aligned for cross-metric comparison (higher means better).

## Quality Warnings

- Weak significance score (<0.70).
- Top temporal profiles are close (score delta 0.0201); temporal assumptions are not yet robust.
- Robustness check: trimmed-range optimal differs by 93.6% from raw optimal; tail observations materially influence target.

## Appendix: Technical Diagnostics

### Core Metrics

| Metric | Value |
|--------|------:|
| Forward correlation | 0.1030 |
| Reverse correlation | -0.0465 |
| Direction score (forward - reverse) | 0.1495 |
| Effect size (% change from baseline) | 18.4336 |
| Significance score | 0.6714 |
| Weighted PIS | 0.1516 |
| Value linked with higher outcome | 282.8121 |
| Value linked with lower outcome | 271.9464 |
| Math-only best daily value | 282.8121 |
| Recommended level (reader-facing) | 15.455 international $/person (data-backed level) |
| Math-only guess (technical) | 282.81 international $/person |
| Data-backed level | 15.455 international $/person |
| Data-backed range | [10.830, 22.540) |
| Backup level (middle-data check) | 14.138 international $/person |
| Math-only guess inside seen data range? | yes |
| Math-only guess inside data-backed range? | no |
| Seen data range | [0.1972, 3227.4604] |
| Math-only guess outside seen data? | no (within observed range) |
| Math-only guess outside best observed bucket? | yes |
| Best observed range | [0.19723, 4.911) |
| Best observed range (middle-data check) | [12.117, 23.120) |
| Best observed outcome average | 5.327 |
| Best observed outcome average (middle-data check) | 5.629 |
| Backup level (bucket median) | 18.124 international $/person |
| Math-only vs backup difference | -264.69 (-93.6%) |
| Middle-data share kept | 80.0% (3209/4011) |
| Data status | enough data |
| Data-status details | none |
| Confidence score | 0.6643 (medium confidence) |
| Reliability support component | 0.7442 |
| Reliability significance component | 0.6714 |
| Reliability directional component | 0.9967 |
| Reliability temporal-stability component | 0.6693 |
| Reliability robustness component | 0.0712 |
| Signal tag | early signal |

### Response-Curve Diagnostics

| Diagnostic | Result |
|------------|--------|
| Minimum useful level | Not identified (no_consistent_effective_dose_detected) |
| Point where gains start slowing | 15.455 international $/person (ratio=-0.371) |
| Flat zone range | [76.100, 2948.5] |
| Why this data-backed level was chosen | identified |
| Math-only guess minus data-backed level | 267.36 (+1729.9%) |

### Temporal Sensitivity

| Profile | Source | Lag (years) | Duration (years) | Filling | Score | Delta vs Best | Included Subjects | Total Pairs |
|---------|--------|------------:|-----------------:|---------|------:|--------------:|------------------:|------------:|
| Selected | predictor_default | 1 | 2 | interpolation | 0.6345 | 0.0000 | 123 | 4011 |
| Runner-up | predictor_default | 2 | 2 | interpolation | 0.6144 | 0.0201 | 123 | 4011 |
| Runner-up | predictor_default | 2 | 3 | interpolation | 0.6045 | 0.0300 | 123 | 4011 |
| Runner-up | predictor_default | 2 | 5 | interpolation | 0.6006 | 0.0339 | 123 | 4011 |

### Binned Pattern Table

| Bin | Predictor Range | Pairs | Subjects | Predictor Mean | Predictor Median | Outcome Mean | Outcome Median |
|----:|-----------------|------:|---------:|---------------:|-----------------:|-------------:|---------------:|
| 1 | [0.19723, 4.911) | 401 | 18 | 2.8467 | 3.1402 | 5.3267 | 5.0445 |
| 2 | [4.911, 14.231) | 401 | 34 | 9.5944 | 9.4844 | 5.1562 | 5.5375 |
| 3 | [14.231, 28.491) | 401 | 45 | 21.7821 | 22.5401 | 5.0783 | 5.2556 |
| 4 | [28.491, 47.930) | 401 | 54 | 37.8205 | 37.9368 | 4.9059 | 5.8468 |
| 5 | [47.930, 76.100) | 401 | 53 | 59.1117 | 58.4383 | 5.2599 | 5.2652 |
| 6 | [76.100, 129.82) | 401 | 53 | 98.6215 | 96.4321 | 5.2457 | 5.5459 |
| 7 | [129.82, 261.40) | 401 | 50 | 186.2917 | 181.2867 | 5.0168 | 5.1784 |
| 8 | [261.40, 482.00) | 401 | 51 | 373.5176 | 373.5937 | 4.9778 | 4.7493 |
| 9 | [482.00, 879.05) | 401 | 48 | 654.1199 | 646.5337 | 4.2484 | 4.0711 |
| 10 | [879.05, 2948.5] | 402 | 30 | 1333.6187 | 1249.0209 | 4.4293 | 4.0044 |

### Distribution Charts

```text
Predictor Distribution (R&D Expenditure Per Capita (PPP))
[0.19723, 245.89) | ############################## 2766
[245.89, 491.57) | ##### 477
[491.57, 737.26) | ### 245
[737.26, 982.95) | ## 190
[982.95, 1228.6) | # 120
[1228.6, 1474.3) | # 105
[1474.3, 1720.0) | # 47
[1720.0, 1965.7) | # 28
[1965.7, 2211.4) | # 19
[2211.4, 2457.1) | # 7
[2457.1, 2702.8) | # 5
[2702.8, 2948.5] | # 2
```

```text
Outcome Distribution (After-Tax Median Income Growth (YoY %), welfare-aligned)
[-49.393, -40.524) | # 2
[-40.524, -31.654) | # 4
[-31.654, -22.785) | # 7
[-22.785, -13.916) | # 29
[-13.916, -5.047) | ## 137
[-5.047, 3.822) | ################## 1342
[3.822, 12.691) | ############################## 2246
[12.691, 21.560) | ### 207
[21.560, 30.430) | # 25
[30.430, 39.299) | # 7
[39.299, 48.168) | # 2
[48.168, 57.037] | # 3
```

### Top Subjects

| Subject | Forward r | Directional Score | Effect % | Pairs |
|---------|----------:|------------------:|---------:|------:|
| OMN | 0.0063 | -0.7112 | -144.977 | 33 |
| TJK | 0.1768 | 0.6872 | 288.500 | 33 |
| PAK | -0.1524 | -0.6426 | -8.998 | 33 |
| ISL | 0.2453 | 0.5840 | 16.582 | 33 |
| LMY | 0.1697 | 0.5810 | -4.778 | 33 |
| OSS | 0.2131 | 0.5807 | 2.108 | 33 |
| MIC | 0.1816 | 0.5805 | -3.803 | 33 |
| UGA | -0.0591 | -0.5751 | -22.755 | 33 |
