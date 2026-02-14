# Pair Study: Education Expenditure Per Capita (PPP) -> After-Tax Median Income (PPP)

- Pair ID: `predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp`
- Lag years: 1
- Duration years: 5
- Temporal profile source: predictor_default
- Filling strategy: interpolation
- Temporal candidates evaluated: 12
- Temporal candidates with valid results: 12
- Temporal profile score: 0.5805
- Included subjects: 216
- Skipped subjects: 0
- Total aligned pairs: 7140
- Signal grade: A (very strong)
- Data status: enough data
- Confidence score: 0.552 (medium confidence)
- Signal tag: early signal
- Direction: neutral
- Uncertainty score: 0.1070 (lower is better)

## Quick Meanings

- `Recommended level`: main value to try first.
- `Data-backed level`: level directly supported by seen data.
- `Backup level`: safer fallback from the middle of the data.
- `Math-only guess`: unconstrained model output for technical comparison.
- `Not enough data`: we cannot safely recommend a level yet.

## Key Numeric Takeaways

- Recommended Education Expenditure Per Capita (PPP) level for higher After-Tax Median Income (PPP): 2563.5 international $/person (data-backed level).
- Best level directly seen in the grouped data: 2563.5 international $/person.
- Math-only guess is inside seen data but outside the best-performing bucket, so we still use the data-backed level.
- Best observed bin anchor (median/mean) is 2367.1 international $/person; model-optimal minus observed-anchor difference is -1544.7 (-65.3%).
- Backup level check (middle 10-90% of data) suggests 1376.5 international $/person.
- The math-only guess and backup level differ by 67.4%, which means extreme values may matter a lot.
- Minimum effective level (first consistently positive zone): 49.628 international $/person.
- Could not find a clear point where gains start slowing down (drop_below_detection_threshold).
- Could not find a stable flat zone (no_plateau_zone_detected).
- Highest observed mean After-Tax Median Income (PPP) appears when Education Expenditure Per Capita (PPP) is in [1682.9, 6496.0] (mean outcome 54699.5).
- Direction signal is neutral; use caution and rely on the data-backed level.

## Decision Summary

- Interpretation: Medium signal; still sensitive to model choices.
- Pattern hint: no clear up/down pattern; use data-backed levels only.
- Signal strength: stronger in this report set.

## Plain-Language Summary

- No strong directional pattern is detected between Education Expenditure Per Capita (PPP) and After-Tax Median Income (PPP).
- The estimate uses 216 subjects and 7140 aligned predictor-outcome observations.
- Best observed mean outcome appears in predictor bin [1682.9, 6496.0] (mean outcome 54699.5).
- A minimum effective predictor level appears near 49.628 international $/person in the binned response curve.
- Confidence score is 0.552 (medium confidence); data status is enough data.
- Outcome values in these summaries are welfare-aligned for cross-metric comparison (higher means better).

## Quality Warnings

- Some country-level direction scores are unusually high; this can happen with this scoring method.
- Top temporal profiles are close (score delta 0.0001); temporal assumptions are not yet robust.
- Robustness check: trimmed-range optimal differs by 67.4% from raw optimal; tail observations materially influence target.

## Appendix: Technical Diagnostics

### Core Metrics

| Metric | Value |
|--------|------:|
| Forward correlation | 0.8485 |
| Reverse correlation | 0.8305 |
| Direction score (forward - reverse) | 0.0180 |
| Effect size (% change from baseline) | 104.0700 |
| Significance score | 0.8930 |
| Weighted PIS | 0.7970 |
| Value linked with higher outcome | 822.4183 |
| Value linked with lower outcome | 440.6380 |
| Math-only best daily value | 822.4183 |
| Recommended level (reader-facing) | 2563.5 international $/person (data-backed level) |
| Math-only guess (technical) | 822.42 international $/person |
| Data-backed level | 2563.5 international $/person |
| Data-backed range | [1881.7, 6496.0] |
| Backup level (middle-data check) | 1402.6 international $/person |
| Math-only guess inside seen data range? | yes |
| Math-only guess inside data-backed range? | no |
| Seen data range | [0.0000, 7006.1701] |
| Math-only guess outside seen data? | no (within observed range) |
| Math-only guess outside best observed bucket? | yes |
| Best observed range | [1682.9, 6496.0] |
| Best observed range (middle-data check) | [1120.5, 1682.5] |
| Best observed outcome average | 54699.5 |
| Best observed outcome average (middle-data check) | 33546.4 |
| Backup level (bucket median) | 1376.5 international $/person |
| Math-only vs backup difference | 554.06 (+67.4%) |
| Middle-data share kept | 80.0% (5712/7140) |
| Data status | enough data |
| Data-status details | none |
| Confidence score | 0.5522 (medium confidence) |
| Reliability support component | 1.0000 |
| Reliability significance component | 0.8930 |
| Reliability directional component | 0.1200 |
| Reliability temporal-stability component | 0.0037 |
| Reliability robustness component | 0.3626 |
| Signal tag | early signal |

### Response-Curve Diagnostics

| Diagnostic | Result |
|------------|--------|
| Minimum useful level | 49.628 international $/person (z=13.26) |
| Point where gains start slowing | Not identified (drop_below_detection_threshold) |
| Flat zone range | Not identified (no_plateau_zone_detected) |
| Why this data-backed level was chosen | identified |
| Math-only guess minus data-backed level | -1741.0 (-67.9%) |

### Temporal Sensitivity

| Profile | Source | Lag (years) | Duration (years) | Filling | Score | Delta vs Best | Included Subjects | Total Pairs |
|---------|--------|------------:|-----------------:|---------|------:|--------------:|------------------:|------------:|
| Selected | predictor_default | 1 | 5 | interpolation | 0.5805 | 0.0000 | 216 | 7140 |
| Runner-up | predictor_default | 0 | 5 | interpolation | 0.5804 | 0.0001 | 216 | 7140 |
| Runner-up | predictor_default | 1 | 3 | interpolation | 0.5769 | 0.0037 | 216 | 7140 |
| Runner-up | predictor_default | 0 | 3 | interpolation | 0.5765 | 0.0040 | 216 | 7140 |

### Binned Pattern Table

| Bin | Predictor Range | Pairs | Subjects | Predictor Mean | Predictor Median | Outcome Mean | Outcome Median |
|----:|-----------------|------:|---------:|---------------:|-----------------:|-------------:|---------------:|
| 1 | [0.00000, 41.763) | 714 | 45 | 26.1067 | 26.9829 | 1450.4651 | 1187.2845 |
| 2 | [41.763, 81.905) | 713 | 67 | 60.2241 | 59.6390 | 2426.7822 | 2160.0000 |
| 3 | [81.905, 148.87) | 715 | 79 | 116.5201 | 116.5714 | 3759.3223 | 3490.4011 |
| 4 | [148.87, 229.47) | 714 | 93 | 187.9368 | 187.8862 | 5356.1852 | 5240.7444 |
| 5 | [229.47, 324.71) | 713 | 98 | 276.0364 | 274.5759 | 7512.9409 | 7207.7585 |
| 6 | [324.71, 462.03) | 715 | 102 | 382.7696 | 373.5335 | 9629.6356 | 9530.0000 |
| 7 | [462.03, 674.99) | 714 | 94 | 550.9566 | 546.8969 | 14370.6716 | 13735.0679 |
| 8 | [674.99, 1023.8) | 714 | 91 | 843.0233 | 835.5614 | 19523.6070 | 19475.0000 |
| 9 | [1023.8, 1682.9) | 714 | 73 | 1311.0133 | 1304.1626 | 32013.5731 | 29685.0000 |
| 10 | [1682.9, 6496.0] | 714 | 46 | 2609.7230 | 2367.1491 | 54699.5441 | 49615.0000 |

### Distribution Charts

```text
Predictor Distribution (Education Expenditure Per Capita (PPP))
[0.00000, 541.33) | ############################## 4626
[541.33, 1082.7) | ######## 1160
[1082.7, 1624.0) | #### 613
[1624.0, 2165.3) | ## 320
[2165.3, 2706.6) | # 172
[2706.6, 3248.0) | # 120
[3248.0, 3789.3) | # 63
[3789.3, 4330.6) | # 29
[4330.6, 4872.0) | # 16
[4872.0, 5413.3) | # 12
[5413.3, 5954.6) | # 4
[5954.6, 6496.0] | # 5
```

```text
Outcome Distribution (After-Tax Median Income (PPP), welfare-aligned)
[280.00, 14356.7) | ############################## 4726
[14356.7, 28433.3) | ######## 1248
[28433.3, 42510.0) | #### 585
[42510.0, 56586.7) | ## 288
[56586.7, 70663.3) | # 144
[70663.3, 84740.0) | # 82
[84740.0, 98816.7) | # 31
[98816.7, 112893) | # 16
[112893, 126970) | # 15
[126970, 141047) | # 1
[141047, 155123) | # 1
[155123, 169200] | # 3
```

### Top Subjects

| Subject | Forward r | Directional Score | Effect % | Pairs |
|---------|----------:|------------------:|---------:|------:|
| CUW | 0.7145 | 1.1128 | 10.195 | 19 |
| PRI | -0.7001 | -1.0579 | -36.553 | 34 |
| HTI | 0.9084 | 0.7229 | 38.678 | 34 |
| FCS | 0.8537 | 0.7219 | 18.607 | 16 |
| BMU | -0.0268 | -0.7018 | 4.272 | 14 |
| JOR | -0.6725 | -0.6591 | -25.301 | 34 |
| NRU | -0.0436 | -0.5964 | -19.697 | 34 |
| ATG | 0.8439 | 0.5675 | 40.597 | 34 |
