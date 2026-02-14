# Pair Study: Education Share of Government Spending -> After-Tax Median Income (PPP)

- Pair ID: `predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp`
- Lag years: 3
- Duration years: 5
- Temporal profile source: predictor_default
- Filling strategy: interpolation
- Temporal candidates evaluated: 12
- Temporal candidates with valid results: 12
- Temporal profile score: 0.6668
- Included subjects: 159
- Skipped subjects: 0
- Total aligned pairs: 5371
- Signal grade: A (very strong)
- Data status: enough data
- Confidence score: 0.826 (higher confidence)
- Signal tag: early signal
- Direction: neutral
- Uncertainty score: 0.1343 (lower is better)

## Quick Meanings

- `Recommended level`: main value to try first.
- `Data-backed level`: level directly supported by seen data.
- `Backup level`: safer fallback from the middle of the data.
- `Math-only guess`: unconstrained model output for technical comparison.
- `Not enough data`: we cannot safely recommend a level yet.

## Key Numeric Takeaways

- Recommended Education Share of Government Spending level for higher After-Tax Median Income (PPP): 13.062 % of government expenditure (data-backed level).
- Best level directly seen in the grouped data: 13.062 % of government expenditure.
- Math-only guess is inside seen data but outside the best-performing bucket, so we still use the data-backed level.
- Best observed bin anchor (median/mean) is 13.743 % of government expenditure; model-optimal minus observed-anchor difference is 5.594 (+40.7%).
- Backup level check (middle 10-90% of data) suggests 13.284 % of government expenditure.
- The math-only guess and backup level differ by 31.3%, which means extreme values may matter a lot.
- Minimum effective level (first consistently positive zone): 11.702 % of government expenditure.
- Diminishing returns likely begin near 13.062 % of government expenditure.
- Could not find a stable flat zone (no_plateau_zone_detected).
- Highest observed mean After-Tax Median Income (PPP) appears when Education Share of Government Spending is in [12.888, 14.666) (mean outcome 23743.9).
- Direction signal is neutral; use caution and rely on the data-backed level.

## Decision Summary

- Interpretation: Medium signal; still sensitive to model choices.
- Pattern hint: no clear up/down pattern; use data-backed levels only.
- Signal strength: stronger in this report set.

## Plain-Language Summary

- No strong directional pattern is detected between Education Share of Government Spending and After-Tax Median Income (PPP).
- The estimate uses 159 subjects and 5371 aligned predictor-outcome observations.
- Best observed mean outcome appears in predictor bin [12.888, 14.666) (mean outcome 23743.9).
- A minimum effective predictor level appears near 11.702 % of government expenditure in the binned response curve.
- Confidence score is 0.826 (higher confidence); data status is enough data.
- Outcome values in these summaries are welfare-aligned for cross-metric comparison (higher means better).

## Quality Warnings

- Some country-level direction scores are unusually high; this can happen with this scoring method.
- Top temporal profiles are close (score delta 0.0213); temporal assumptions are not yet robust.
- Robustness check: trimmed-range optimal differs by 31.3% from raw optimal; tail observations materially influence target.

## Appendix: Technical Diagnostics

### Core Metrics

| Metric | Value |
|--------|------:|
| Forward correlation | -0.0356 |
| Reverse correlation | -0.1493 |
| Direction score (forward - reverse) | 0.1138 |
| Effect size (% change from baseline) | 17.3779 |
| Significance score | 0.8657 |
| Weighted PIS | 0.5397 |
| Value linked with higher outcome | 19.3370 |
| Value linked with lower outcome | 19.1834 |
| Math-only best daily value | 19.3370 |
| Recommended level (reader-facing) | 13.062 % of government expenditure (data-backed level) |
| Math-only guess (technical) | 19.337 % of government expenditure |
| Data-backed level | 13.062 % of government expenditure |
| Data-backed range | [12.325, 13.756) |
| Backup level (middle-data check) | 13.934 % of government expenditure |
| Math-only guess inside seen data range? | yes |
| Math-only guess inside data-backed range? | no |
| Seen data range | [0.0000, 70.8565] |
| Math-only guess outside seen data? | no (within observed range) |
| Math-only guess outside best observed bucket? | yes |
| Best observed range | [12.888, 14.666) |
| Best observed range (middle-data check) | [12.488, 13.891) |
| Best observed outcome average | 23743.9 |
| Best observed outcome average (middle-data check) | 23254.2 |
| Backup level (bucket median) | 13.284 % of government expenditure |
| Math-only vs backup difference | -6.053 (-31.3%) |
| Middle-data share kept | 80.1% (4304/5371) |
| Data status | enough data |
| Data-status details | none |
| Confidence score | 0.8258 (higher confidence) |
| Reliability support component | 0.9476 |
| Reliability significance component | 0.8657 |
| Reliability directional component | 0.7587 |
| Reliability temporal-stability component | 0.7086 |
| Reliability robustness component | 0.7633 |
| Signal tag | early signal |

### Response-Curve Diagnostics

| Diagnostic | Result |
|------------|--------|
| Minimum useful level | 11.702 % of government expenditure (z=1.46) |
| Point where gains start slowing | 13.062 % of government expenditure (ratio=-0.765) |
| Flat zone range | Not identified (no_plateau_zone_detected) |
| Why this data-backed level was chosen | identified |
| Math-only guess minus data-backed level | 6.275 (+48.0%) |

### Temporal Sensitivity

| Profile | Source | Lag (years) | Duration (years) | Filling | Score | Delta vs Best | Included Subjects | Total Pairs |
|---------|--------|------------:|-----------------:|---------|------:|--------------:|------------------:|------------:|
| Selected | predictor_default | 3 | 5 | interpolation | 0.6668 | 0.0000 | 159 | 5371 |
| Runner-up | predictor_default | 3 | 3 | interpolation | 0.6455 | 0.0213 | 159 | 5371 |
| Runner-up | predictor_default | 2 | 5 | interpolation | 0.6394 | 0.0274 | 159 | 5371 |
| Runner-up | predictor_default | 3 | 2 | interpolation | 0.6287 | 0.0381 | 159 | 5371 |

### Binned Pattern Table

| Bin | Predictor Range | Pairs | Subjects | Predictor Mean | Predictor Median | Outcome Mean | Outcome Median |
|----:|-----------------|------:|---------:|---------------:|-----------------:|-------------:|---------------:|
| 1 | [0.00000, 11.044) | 536 | 36 | 9.0534 | 9.5865 | 18643.9192 | 12975.0000 |
| 2 | [11.044, 12.888) | 538 | 44 | 12.0773 | 12.0995 | 19385.6371 | 15305.0000 |
| 3 | [12.888, 14.666) | 523 | 57 | 13.7444 | 13.7429 | 23743.9046 | 21770.0000 |
| 4 | [14.666, 16.814) | 543 | 69 | 15.6535 | 15.6496 | 17480.3702 | 12539.6706 |
| 5 | [16.814, 18.510) | 536 | 70 | 17.6724 | 17.7295 | 18004.5249 | 12380.0000 |
| 6 | [18.510, 19.989) | 546 | 72 | 19.1815 | 19.1897 | 13933.6599 | 8345.5500 |
| 7 | [19.989, 21.764) | 526 | 68 | 20.8362 | 20.9103 | 13642.7516 | 4630.0000 |
| 8 | [21.764, 23.881) | 548 | 65 | 22.8904 | 22.9692 | 14520.8224 | 8220.0000 |
| 9 | [23.881, 27.700) | 531 | 52 | 25.6919 | 25.7999 | 9054.5610 | 5360.0000 |
| 10 | [27.700, 66.586] | 544 | 35 | 34.6267 | 31.5266 | 8302.7201 | 3085.0000 |

### Distribution Charts

```text
Predictor Distribution (Education Share of Government Spending)
[0.00000, 5.549) | # 29
[5.549, 11.098) | ######### 522
[11.098, 16.647) | ########################## 1545
[16.647, 22.195) | ############################## 1760
[22.195, 27.744) | ################# 987
[27.744, 33.293) | ##### 321
[33.293, 38.842) | ## 143
[38.842, 44.391) | # 15
[44.391, 49.940) | # 9
[49.940, 55.488) | # 6
[55.488, 61.037) | # 2
[61.037, 66.586] | # 32
```

```text
Outcome Distribution (After-Tax Median Income (PPP), welfare-aligned)
[280.00, 10724.2) | ############################## 2917
[10724.2, 21168.3) | ########### 1078
[21168.3, 31612.5) | ###### 594
[31612.5, 42056.7) | ### 339
[42056.7, 52500.8) | ## 206
[52500.8, 62945.0) | # 106
[62945.0, 73389.2) | # 63
[73389.2, 83833.3) | # 31
[83833.3, 94277.5) | # 14
[94277.5, 104722) | # 11
[104722, 115166) | # 8
[115166, 125610] | # 4
```

### Top Subjects

| Subject | Forward r | Directional Score | Effect % | Pairs |
|---------|----------:|------------------:|---------:|------:|
| COD | -0.5533 | -1.3458 | -47.883 | 34 |
| TZA | 0.4630 | 1.2276 | 71.859 | 34 |
| RWA | -0.8224 | -1.2233 | -63.153 | 34 |
| WSM | -0.7487 | -1.2211 | -42.187 | 34 |
| LBN | -0.7977 | -1.1927 | -47.976 | 34 |
| ECA | 0.8092 | 1.1701 | 145.380 | 34 |
| PSE | -0.8196 | -1.1025 | -48.956 | 30 |
| NPL | 0.8155 | 1.0960 | 167.826 | 34 |
