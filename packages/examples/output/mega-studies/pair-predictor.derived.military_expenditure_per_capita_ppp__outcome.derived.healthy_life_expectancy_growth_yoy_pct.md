# Pair Study: Military Expenditure Per Capita (PPP) -> Healthy Life Expectancy Growth (YoY %)

- Pair ID: `predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct`
- Lag years: 0
- Duration years: 3
- Temporal profile source: predictor_default
- Filling strategy: interpolation
- Temporal candidates evaluated: 12
- Temporal candidates with valid results: 12
- Temporal profile score: 0.3548
- Included subjects: 159
- Skipped subjects: 0
- Total aligned pairs: 3339
- Signal grade: F (very weak)
- Data status: enough data
- Confidence score: 0.324 (lower confidence)
- Signal tag: not enough data
- Direction: negative
- Uncertainty score: 0.8034 (lower is better)

## Quick Meanings

- `Recommended level`: main value to try first.
- `Data-backed level`: level directly supported by seen data.
- `Backup level`: safer fallback from the middle of the data.
- `Math-only guess`: unconstrained model output for technical comparison.
- `Not enough data`: we cannot safely recommend a level yet.

## Key Numeric Takeaways

- Recommended Military Expenditure Per Capita (PPP) level for higher Healthy Life Expectancy Growth (YoY %): 8.665 international $/person (data-backed level).
- Best level directly seen in the grouped data: 8.665 international $/person.
- Math-only guess is inside seen data but outside the best-performing bucket, so we still use the data-backed level.
- Best observed bin anchor (median/mean) is 9.671 international $/person; model-optimal minus observed-anchor difference is 362.43 (+3747.5%).
- Backup level check (middle 10-90% of data) suggests 21.730 international $/person.
- The math-only guess and backup level differ by 94.2%, which means extreme values may matter a lot.
- Could not find a clear minimum useful level (no_consistent_effective_dose_detected).
- Could not find a clear point where gains start slowing down (drop_below_detection_threshold).
- Could not find a stable flat zone (no_plateau_zone_detected).
- Highest observed mean Healthy Life Expectancy Growth (YoY %) appears when Military Expenditure Per Capita (PPP) is in [0.91749, 16.666) (mean outcome 0.96572).
- Direction is negative in this analysis, so lowering this predictor is associated with better outcomes.

## Decision Summary

- Interpretation: Early signal only; use this mainly to guide more testing.
- Pattern hint: lower Military Expenditure Per Capita (PPP) tends to go with better Healthy Life Expectancy Growth (YoY %).
- Signal strength: weak to moderate; avoid strong conclusions from this pair alone.

## Plain-Language Summary

- Higher Military Expenditure Per Capita (PPP) tends to align with worse Healthy Life Expectancy Growth (YoY %).
- The estimate uses 159 subjects and 3339 aligned predictor-outcome observations.
- Best observed mean outcome appears in predictor bin [0.91749, 16.666) (mean outcome 0.96572).
- Confidence score is 0.324 (lower confidence); data status is enough data.
- Outcome values in these summaries are welfare-aligned for cross-metric comparison (higher means better).

## Quality Warnings

- Weak significance score (<0.70).
- Forward and direction signals disagree; direction may be unstable.
- Top temporal profiles are close (score delta 0.0001); temporal assumptions are not yet robust.
- Robustness check: trimmed-range optimal differs by 94.2% from raw optimal; tail observations materially influence target.

## Appendix: Technical Diagnostics

### Core Metrics

| Metric | Value |
|--------|------:|
| Forward correlation | -0.1187 |
| Reverse correlation | -0.1712 |
| Direction score (forward - reverse) | 0.0525 |
| Effect size (% change from baseline) | 0.0000 |
| Significance score | 0.1966 |
| Weighted PIS | 0.0776 |
| Value linked with higher outcome | 372.0985 |
| Value linked with lower outcome | 393.8712 |
| Math-only best daily value | 372.0985 |
| Recommended level (reader-facing) | 8.665 international $/person (data-backed level) |
| Math-only guess (technical) | 372.10 international $/person |
| Data-backed level | 8.665 international $/person |
| Data-backed range | [0.91749, 14.784) |
| Backup level (middle-data check) | 364.94 international $/person |
| Math-only guess inside seen data range? | yes |
| Math-only guess inside data-backed range? | no |
| Seen data range | [0.0063, 27448.6207] |
| Math-only guess outside seen data? | no (within observed range) |
| Math-only guess outside best observed bucket? | yes |
| Best observed range | [0.91749, 16.666) |
| Best observed range (middle-data check) | [16.681, 26.916) |
| Best observed outcome average | 0.96572 |
| Best observed outcome average (middle-data check) | 0.64970 |
| Backup level (bucket median) | 21.730 international $/person |
| Math-only vs backup difference | -350.37 (-94.2%) |
| Middle-data share kept | 80.0% (2671/3339) |
| Data status | enough data |
| Data-status details | none |
| Confidence score | 0.3240 (lower confidence) |
| Reliability support component | 0.7782 |
| Reliability significance component | 0.1966 |
| Reliability directional component | 0.3503 |
| Reliability temporal-stability component | 0.0034 |
| Reliability robustness component | 0.0649 |
| Signal tag | not enough data |

### Response-Curve Diagnostics

| Diagnostic | Result |
|------------|--------|
| Minimum useful level | Not identified (no_consistent_effective_dose_detected) |
| Point where gains start slowing | Not identified (drop_below_detection_threshold) |
| Flat zone range | Not identified (no_plateau_zone_detected) |
| Why this data-backed level was chosen | identified |
| Math-only guess minus data-backed level | 363.43 (+4194.3%) |

### Temporal Sensitivity

| Profile | Source | Lag (years) | Duration (years) | Filling | Score | Delta vs Best | Included Subjects | Total Pairs |
|---------|--------|------------:|-----------------:|---------|------:|--------------:|------------------:|------------:|
| Selected | predictor_default | 0 | 3 | interpolation | 0.3548 | 0.0000 | 159 | 3339 |
| Runner-up | predictor_default | 1 | 3 | interpolation | 0.3547 | 0.0001 | 159 | 3339 |
| Runner-up | predictor_default | 0 | 2 | interpolation | 0.3530 | 0.0018 | 159 | 3339 |
| Runner-up | predictor_default | 0 | 1 | interpolation | 0.3432 | 0.0116 | 159 | 3339 |

### Binned Pattern Table

| Bin | Predictor Range | Pairs | Subjects | Predictor Mean | Predictor Median | Outcome Mean | Outcome Median |
|----:|-----------------|------:|---------:|---------------:|-----------------:|-------------:|---------------:|
| 1 | [0.91749, 16.666) | 334 | 25 | 9.7429 | 9.6712 | 0.9657 | 0.7161 |
| 2 | [16.666, 30.728) | 334 | 42 | 23.2103 | 22.9926 | 0.6398 | 0.6872 |
| 3 | [30.728, 59.752) | 334 | 48 | 42.5468 | 41.1122 | 0.5055 | 0.5273 |
| 4 | [59.752, 106.35) | 334 | 47 | 82.6251 | 82.5890 | 0.1075 | 0.1865 |
| 5 | [106.35, 164.59) | 333 | 52 | 135.8080 | 135.0267 | 0.1569 | 0.2259 |
| 6 | [164.59, 233.35) | 334 | 55 | 197.5707 | 197.2850 | 0.2368 | 0.2897 |
| 7 | [233.35, 337.86) | 334 | 51 | 279.9020 | 275.4107 | -0.2222 | 0.1726 |
| 8 | [337.86, 450.48) | 334 | 49 | 385.3254 | 379.9434 | 0.5768 | 0.2683 |
| 9 | [450.48, 733.41) | 334 | 52 | 559.6639 | 540.1821 | -0.2031 | 0.0783 |
| 10 | [733.41, 7538.5] | 334 | 31 | 2272.8856 | 2037.8634 | 0.1481 | 0.2053 |

### Distribution Charts

```text
Predictor Distribution (Military Expenditure Per Capita (PPP))
[0.91749, 629.05) | ############################## 2929
[629.05, 1257.2) | ## 191
[1257.2, 1885.3) | # 37
[1885.3, 2513.4) | # 69
[2513.4, 3141.6) | # 36
[3141.6, 3769.7) | # 18
[3769.7, 4397.8) | # 15
[4397.8, 5025.9) | # 28
[5025.9, 5654.1) | # 7
[5654.1, 6282.2) | # 5
[6282.2, 6910.3) | # 3
[6910.3, 7538.5] | # 1
```

```text
Outcome Distribution (Healthy Life Expectancy Growth (YoY %), welfare-aligned)
[-33.373, -25.372) | # 1
[-25.372, -17.372) | # 1
[-17.372, -9.372) | # 21
[-9.372, -1.372) | ######## 684
[-1.372, 6.629) | ############################## 2535
[6.629, 14.629) | # 89
[14.629, 22.629) | # 7
[54.630, 62.630] | # 1
```

### Top Subjects

| Subject | Forward r | Directional Score | Effect % | Pairs |
|---------|----------:|------------------:|---------:|------:|
| MRT | -0.4465 | -0.8555 | -165.962 | 21 |
| CPV | 0.4727 | 0.8237 | -131.947 | 21 |
| LKA | -0.1715 | -0.7803 | -100.744 | 21 |
| MMR | -0.0709 | 0.7434 | -45.133 | 21 |
| BIH | 0.3145 | 0.7226 | 460.937 | 21 |
| GBR | 0.0107 | -0.6889 | -89.709 | 21 |
| BWA | 0.0976 | 0.6698 | -26.446 | 21 |
| FIN | -0.0359 | 0.6665 | -97.841 | 21 |
