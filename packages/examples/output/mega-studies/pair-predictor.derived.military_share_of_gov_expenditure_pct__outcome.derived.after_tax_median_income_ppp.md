# Pair Study: Military Share of Government Spending -> After-Tax Median Income (PPP)

- Pair ID: `predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp`
- Lag years: 3
- Duration years: 3
- Temporal profile source: predictor_default
- Filling strategy: interpolation
- Temporal candidates evaluated: 12
- Temporal candidates with valid results: 12
- Temporal profile score: 0.6824
- Included subjects: 148
- Skipped subjects: 0
- Total aligned pairs: 5001
- Signal grade: A (very strong)
- Data status: enough data
- Confidence score: 0.751 (higher confidence)
- Signal tag: early signal
- Direction: negative
- Uncertainty score: 0.1130 (lower is better)

## Quick Meanings

- `Recommended level`: main value to try first.
- `Data-backed level`: level directly supported by seen data.
- `Backup level`: safer fallback from the middle of the data.
- `Math-only guess`: unconstrained model output for technical comparison.
- `Not enough data`: we cannot safely recommend a level yet.

## Key Numeric Takeaways

- Recommended Military Share of Government Spending level for higher After-Tax Median Income (PPP): 3.389 % of government expenditure (data-backed level).
- Best level directly seen in the grouped data: 3.389 % of government expenditure.
- Math-only guess is inside seen data but outside the best-performing bucket, so we still use the data-backed level.
- Best observed bin anchor (median/mean) is 3.627 % of government expenditure; model-optimal minus observed-anchor difference is 4.537 (+125.1%).
- Backup level check (middle 10-90% of data) suggests 3.573 % of government expenditure.
- The math-only guess and backup level differ by 56.2%, which means extreme values may matter a lot.
- Minimum effective level (first consistently positive zone): 3.389 % of government expenditure.
- Diminishing returns likely begin near 4.227 % of government expenditure.
- Could not find a stable flat zone (no_plateau_zone_detected).
- Highest observed mean After-Tax Median Income (PPP) appears when Military Share of Government Spending is in [3.111, 4.156) (mean outcome 27010.6).
- Direction is negative in this analysis, so lowering this predictor is associated with better outcomes.

## Decision Summary

- Interpretation: Medium signal; still sensitive to model choices.
- Pattern hint: lower Military Share of Government Spending tends to go with better After-Tax Median Income (PPP).
- Signal strength: stronger in this report set.

## Plain-Language Summary

- Higher Military Share of Government Spending tends to align with worse After-Tax Median Income (PPP).
- The estimate uses 148 subjects and 5001 aligned predictor-outcome observations.
- Best observed mean outcome appears in predictor bin [3.111, 4.156) (mean outcome 27010.6).
- A minimum effective predictor level appears near 3.389 % of government expenditure in the binned response curve.
- Confidence score is 0.751 (higher confidence); data status is enough data.
- Outcome values in these summaries are welfare-aligned for cross-metric comparison (higher means better).

## Quality Warnings

- Some country-level direction scores are unusually high; this can happen with this scoring method.
- Top temporal profiles are close (score delta 0.0133); temporal assumptions are not yet robust.
- Robustness check: trimmed-range optimal differs by 56.2% from raw optimal; tail observations materially influence target.

## Appendix: Technical Diagnostics

### Core Metrics

| Metric | Value |
|--------|------:|
| Forward correlation | -0.5554 |
| Reverse correlation | -0.4334 |
| Direction score (forward - reverse) | -0.1219 |
| Effect size (% change from baseline) | -28.3153 |
| Significance score | 0.8870 |
| Weighted PIS | 0.6375 |
| Value linked with higher outcome | 8.1639 |
| Value linked with lower outcome | 11.5591 |
| Math-only best daily value | 8.1639 |
| Recommended level (reader-facing) | 3.389 % of government expenditure (data-backed level) |
| Math-only guess (technical) | 8.164 % of government expenditure |
| Data-backed level | 3.389 % of government expenditure |
| Data-backed range | [2.746, 3.798) |
| Backup level (middle-data check) | 4.156 % of government expenditure |
| Math-only guess inside seen data range? | yes |
| Math-only guess inside data-backed range? | no |
| Seen data range | [0.4821, 100.9768] |
| Math-only guess outside seen data? | no (within observed range) |
| Math-only guess outside best observed bucket? | yes |
| Best observed range | [3.111, 4.156) |
| Best observed range (middle-data check) | [3.111, 3.976) |
| Best observed outcome average | 27010.6 |
| Best observed outcome average (middle-data check) | 26440.1 |
| Backup level (bucket median) | 3.573 % of government expenditure |
| Math-only vs backup difference | -4.591 (-56.2%) |
| Middle-data share kept | 80.0% (4002/5001) |
| Data status | enough data |
| Data-status details | none |
| Confidence score | 0.7514 (higher confidence) |
| Reliability support component | 0.9101 |
| Reliability significance component | 0.8870 |
| Reliability directional component | 0.8127 |
| Reliability temporal-stability component | 0.4446 |
| Reliability robustness component | 0.4863 |
| Signal tag | early signal |

### Response-Curve Diagnostics

| Diagnostic | Result |
|------------|--------|
| Minimum useful level | 3.389 % of government expenditure (z=1.74) |
| Point where gains start slowing | 4.227 % of government expenditure (ratio=-2.700) |
| Flat zone range | Not identified (no_plateau_zone_detected) |
| Why this data-backed level was chosen | identified |
| Math-only guess minus data-backed level | 4.774 (+140.9%) |

### Temporal Sensitivity

| Profile | Source | Lag (years) | Duration (years) | Filling | Score | Delta vs Best | Included Subjects | Total Pairs |
|---------|--------|------------:|-----------------:|---------|------:|--------------:|------------------:|------------:|
| Selected | predictor_default | 3 | 3 | interpolation | 0.6824 | 0.0000 | 148 | 5001 |
| Runner-up | predictor_default | 2 | 3 | interpolation | 0.6690 | 0.0133 | 148 | 5001 |
| Runner-up | predictor_default | 3 | 2 | interpolation | 0.6648 | 0.0175 | 148 | 5001 |
| Runner-up | predictor_default | 2 | 2 | interpolation | 0.6585 | 0.0238 | 148 | 5001 |

### Binned Pattern Table

| Bin | Predictor Range | Pairs | Subjects | Predictor Mean | Predictor Median | Outcome Mean | Outcome Median |
|----:|-----------------|------:|---------:|---------------:|-----------------:|-------------:|---------------:|
| 1 | [0.62702, 3.111) | 500 | 33 | 2.0714 | 2.2002 | 22974.0213 | 15765.0000 |
| 2 | [3.111, 4.156) | 500 | 52 | 3.6515 | 3.6270 | 27010.5590 | 24370.0000 |
| 3 | [4.156, 4.924) | 500 | 60 | 4.5361 | 4.5419 | 18373.8238 | 16315.1862 |
| 4 | [4.924, 5.876) | 494 | 67 | 5.4098 | 5.4861 | 16007.6308 | 12888.3469 |
| 5 | [5.876, 7.222) | 506 | 71 | 6.5455 | 6.5621 | 14461.4499 | 10515.0000 |
| 6 | [7.222, 9.087) | 500 | 69 | 8.1068 | 8.1388 | 12625.3537 | 8170.0000 |
| 7 | [9.087, 11.456) | 497 | 64 | 10.0888 | 9.9499 | 10502.3347 | 5060.0000 |
| 8 | [11.456, 14.865) | 503 | 64 | 13.1102 | 13.0919 | 7834.7930 | 4320.0000 |
| 9 | [14.865, 18.315) | 500 | 49 | 16.4018 | 16.3419 | 11703.9278 | 6080.0000 |
| 10 | [18.315, 100.98] | 501 | 40 | 30.3576 | 24.4708 | 18174.5916 | 6190.0000 |

### Distribution Charts

```text
Predictor Distribution (Military Share of Government Spending)
[0.62702, 8.990) | ############################## 2983
[8.990, 17.352) | ############## 1415
[17.352, 25.714) | #### 377
[25.714, 34.077) | # 102
[34.077, 42.439) | # 46
[42.439, 50.802) | # 29
[50.802, 59.164) | # 6
[59.164, 67.527) | # 8
[67.527, 75.889) | # 17
[75.889, 84.252) | # 1
[84.252, 92.614) | # 13
[92.614, 100.98] | # 4
```

```text
Outcome Distribution (After-Tax Median Income (PPP), welfare-aligned)
[280.00, 10724.2) | ############################## 2692
[10724.2, 21168.3) | ########### 985
[21168.3, 31612.5) | ###### 541
[31612.5, 42056.7) | #### 319
[42056.7, 52500.8) | ### 227
[52500.8, 62945.0) | # 112
[62945.0, 73389.2) | # 70
[73389.2, 83833.3) | # 29
[83833.3, 94277.5) | # 13
[94277.5, 104722) | # 8
[104722, 115166) | # 3
[115166, 125610] | # 2
```

### Top Subjects

| Subject | Forward r | Directional Score | Effect % | Pairs |
|---------|----------:|------------------:|---------:|------:|
| TJK | -0.7363 | -1.3521 | -62.811 | 34 |
| AFE | 0.6478 | 1.2383 | 44.419 | 34 |
| SEN | 0.7449 | 1.1369 | 81.877 | 34 |
| BFA | -0.7645 | -1.1096 | -44.188 | 34 |
| SAU | -0.2781 | -1.0407 | -12.558 | 34 |
| PRY | 0.4669 | 1.0107 | 63.665 | 34 |
| TGO | -0.5392 | -0.9892 | -37.926 | 34 |
| UKR | -0.3908 | -0.9649 | -25.067 | 34 |
