# Pair Study: Education Expenditure Per Capita (PPP) -> Healthy Life Expectancy Growth (YoY %)

- Pair ID: `predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct`
- Lag years: 0
- Duration years: 3
- Temporal profile source: predictor_default
- Filling strategy: interpolation
- Temporal candidates evaluated: 15
- Temporal candidates with valid results: 15
- Temporal profile score: 0.3767
- Included subjects: 165
- Skipped subjects: 0
- Total aligned pairs: 3465
- Signal grade: F (very weak)
- Data status: enough data
- Confidence score: 0.413 (lower confidence)
- Signal tag: not enough data
- Direction: negative
- Uncertainty score: 0.8150 (lower is better)

## Quick Meanings

- `Recommended level`: main value to try first.
- `Data-backed level`: level directly supported by seen data.
- `Backup level`: safer fallback from the middle of the data.
- `Math-only guess`: unconstrained model output for technical comparison.
- `Not enough data`: we cannot safely recommend a level yet.

## Key Numeric Takeaways

- Recommended Education Expenditure Per Capita (PPP) level for higher Healthy Life Expectancy Growth (YoY %): 30.522 international $/person (data-backed level).
- Best level directly seen in the grouped data: 30.522 international $/person.
- Math-only guess is inside seen data but outside the best-performing bucket, so we still use the data-backed level.
- Best observed bin anchor (median/mean) is 33.103 international $/person; model-optimal minus observed-anchor difference is 711.21 (+2148.5%).
- Backup level check (middle 10-90% of data) suggests 62.367 international $/person.
- The math-only guess and backup level differ by 91.6%, which means extreme values may matter a lot.
- Could not find a clear minimum useful level (no_consistent_effective_dose_detected).
- Could not find a clear point where gains start slowing down (drop_below_detection_threshold).
- Saturation/plateau zone starts around 1899.3 international $/person and extends through 2949.8 international $/person.
- Highest observed mean Healthy Life Expectancy Growth (YoY %) appears when Education Expenditure Per Capita (PPP) is in [9.238, 48.180) (mean outcome 1.097).
- Direction is negative in this analysis, so lowering this predictor is associated with better outcomes.

## Decision Summary

- Interpretation: Early signal only; use this mainly to guide more testing.
- Pattern hint: lower Education Expenditure Per Capita (PPP) tends to go with better Healthy Life Expectancy Growth (YoY %).
- Signal strength: weak to moderate; avoid strong conclusions from this pair alone.

## Plain-Language Summary

- Higher Education Expenditure Per Capita (PPP) tends to align with worse Healthy Life Expectancy Growth (YoY %).
- The estimate uses 165 subjects and 3465 aligned predictor-outcome observations.
- Best observed mean outcome appears in predictor bin [9.238, 48.180) (mean outcome 1.097).
- Confidence score is 0.413 (lower confidence); data status is enough data.
- Outcome values in these summaries are welfare-aligned for cross-metric comparison (higher means better).

## Quality Warnings

- Weak significance score (<0.70).
- Forward and direction signals disagree; direction may be unstable.
- Top temporal profiles are close (score delta 0.0111); temporal assumptions are not yet robust.
- Robustness check: trimmed-range optimal differs by 91.6% from raw optimal; tail observations materially influence target.

## Appendix: Technical Diagnostics

### Core Metrics

| Metric | Value |
|--------|------:|
| Forward correlation | -0.1324 |
| Reverse correlation | -0.2078 |
| Direction score (forward - reverse) | 0.0753 |
| Effect size (% change from baseline) | -96.6542 |
| Significance score | 0.1850 |
| Weighted PIS | 0.0669 |
| Value linked with higher outcome | 744.3105 |
| Value linked with lower outcome | 783.1643 |
| Math-only best daily value | 744.3105 |
| Recommended level (reader-facing) | 30.522 international $/person (data-backed level) |
| Math-only guess (technical) | 744.31 international $/person |
| Data-backed level | 30.522 international $/person |
| Data-backed range | [9.238, 42.945) |
| Backup level (middle-data check) | 60.488 international $/person |
| Math-only guess inside seen data range? | yes |
| Math-only guess inside data-backed range? | no |
| Seen data range | [0.0000, 7006.1701] |
| Math-only guess outside seen data? | no (within observed range) |
| Math-only guess outside best observed bucket? | yes |
| Best observed range | [9.238, 48.180) |
| Best observed range (middle-data check) | [48.249, 82.428) |
| Best observed outcome average | 1.097 |
| Best observed outcome average (middle-data check) | 0.59262 |
| Backup level (bucket median) | 62.367 international $/person |
| Math-only vs backup difference | -681.94 (-91.6%) |
| Middle-data share kept | 80.0% (2771/3465) |
| Data status | enough data |
| Data-status details | none |
| Confidence score | 0.4135 (lower confidence) |
| Reliability support component | 0.7888 |
| Reliability significance component | 0.1850 |
| Reliability directional component | 0.5023 |
| Reliability temporal-stability component | 0.3707 |
| Reliability robustness component | 0.0931 |
| Signal tag | not enough data |

### Response-Curve Diagnostics

| Diagnostic | Result |
|------------|--------|
| Minimum useful level | Not identified (no_consistent_effective_dose_detected) |
| Point where gains start slowing | Not identified (drop_below_detection_threshold) |
| Flat zone range | [1489.8, 6748.5] |
| Why this data-backed level was chosen | identified |
| Math-only guess minus data-backed level | 713.79 (+2338.6%) |

### Temporal Sensitivity

| Profile | Source | Lag (years) | Duration (years) | Filling | Score | Delta vs Best | Included Subjects | Total Pairs |
|---------|--------|------------:|-----------------:|---------|------:|--------------:|------------------:|------------:|
| Selected | predictor_default | 0 | 3 | interpolation | 0.3767 | 0.0000 | 165 | 3465 |
| Runner-up | predictor_default | 0 | 2 | interpolation | 0.3656 | 0.0111 | 165 | 3465 |
| Runner-up | predictor_default | 5 | 3 | interpolation | 0.3615 | 0.0152 | 165 | 3465 |
| Runner-up | predictor_default | 0 | 5 | interpolation | 0.3613 | 0.0154 | 165 | 3465 |

### Binned Pattern Table

| Bin | Predictor Range | Pairs | Subjects | Predictor Mean | Predictor Median | Outcome Mean | Outcome Median |
|----:|-----------------|------:|---------:|---------------:|-----------------:|-------------:|---------------:|
| 1 | [9.238, 48.180) | 347 | 34 | 31.3061 | 33.1032 | 1.0972 | 0.8549 |
| 2 | [48.180, 97.226) | 346 | 46 | 68.9218 | 67.7947 | 0.5429 | 0.5217 |
| 3 | [97.226, 189.92) | 347 | 58 | 142.6699 | 144.5609 | 0.3111 | 0.3639 |
| 4 | [189.92, 288.15) | 346 | 54 | 238.7348 | 241.5524 | 0.1395 | 0.1730 |
| 5 | [288.15, 419.48) | 346 | 67 | 346.9482 | 347.3066 | -0.2223 | 0.2041 |
| 6 | [419.48, 562.72) | 347 | 61 | 497.1832 | 500.3409 | 0.1077 | 0.1656 |
| 7 | [562.72, 874.88) | 346 | 58 | 697.8663 | 693.2735 | 0.1465 | 0.2009 |
| 8 | [874.88, 1286.7) | 347 | 49 | 1062.2493 | 1051.1284 | -0.0829 | 0.1144 |
| 9 | [1286.7, 2107.7) | 346 | 43 | 1664.4297 | 1623.4717 | 0.0810 | 0.2487 |
| 10 | [2107.7, 6748.5] | 347 | 30 | 3035.7235 | 2835.2890 | 0.1262 | 0.1584 |

### Distribution Charts

```text
Predictor Distribution (Education Expenditure Per Capita (PPP))
[9.238, 570.85) | ############################## 2096
[570.85, 1132.5) | ######## 555
[1132.5, 1694.1) | #### 313
[1694.1, 2255.7) | ### 200
[2255.7, 2817.3) | ## 125
[2817.3, 3378.9) | # 90
[3378.9, 3940.5) | # 41
[3940.5, 4502.1) | # 22
[4502.1, 5063.7) | # 13
[5063.7, 5625.3) | # 3
[5625.3, 6186.9) | # 5
[6186.9, 6748.5] | # 2
```

```text
Outcome Distribution (Healthy Life Expectancy Growth (YoY %), welfare-aligned)
[-33.373, -25.372) | # 1
[-25.372, -17.372) | # 1
[-17.372, -9.372) | # 20
[-9.372, -1.372) | ######## 738
[-1.372, 6.629) | ############################## 2610
[6.629, 14.629) | # 90
[14.629, 22.629) | # 4
[54.630, 62.630] | # 1
```

### Top Subjects

| Subject | Forward r | Directional Score | Effect % | Pairs |
|---------|----------:|------------------:|---------:|------:|
| LUX | 0.0732 | 0.9265 | -214.706 | 21 |
| AUS | 0.1056 | -0.8912 | -59.581 | 21 |
| EGY | 0.0386 | -0.8483 | -321.243 | 21 |
| SUR | -0.2100 | -0.8348 | 214.822 | 21 |
| OMN | 0.0210 | 0.8094 | -86.221 | 21 |
| NOR | -0.0789 | -0.8056 | 13.263 | 21 |
| TUR | -0.0819 | 0.8029 | -87.909 | 21 |
| GBR | 0.0146 | -0.7511 | -62.569 | 21 |
