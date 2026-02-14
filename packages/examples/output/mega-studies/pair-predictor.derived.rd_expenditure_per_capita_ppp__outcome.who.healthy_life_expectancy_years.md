# Pair Study: R&D Expenditure Per Capita (PPP) -> Healthy Life Expectancy (HALE)

- Pair ID: `predictor.derived.rd_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years`
- Lag years: 2
- Duration years: 3
- Temporal profile source: predictor_default
- Filling strategy: interpolation
- Temporal candidates evaluated: 16
- Temporal candidates with valid results: 16
- Temporal profile score: 0.7514
- Included subjects: 95
- Skipped subjects: 0
- Total aligned pairs: 6270
- Evidence grade: A
- Quality tier: exploratory
- Direction: negative
- Derived uncertainty score: 0.0667 (1 - aggregate significance, not NHST p-value)

## Actionable Takeaway

- Exploratory estimate of best R&D Expenditure Per Capita (PPP) level for higher Healthy Life Expectancy (HALE): 349.10 international $/person.
- Model-derived optimum is within observed support but outside the highest-outcome bin; this reflects smooth objective optimization vs coarse bin averages.
- Best observed bin anchor (median/mean) is 1302.4 international $/person; model-optimal minus observed-anchor difference is -953.35 (-73.2%).
- Robust sensitivity (trimmed 10-90% predictor range) suggests 805.20 international $/person.
- Raw vs robust optimal differs by 130.7%, indicating strong tail influence.
- Highest observed mean Healthy Life Expectancy (HALE) appears when R&D Expenditure Per Capita (PPP) is in [984.07, 2227.7] (mean outcome 70.299).
- Direction is negative in this analysis, so lowering this predictor is associated with better outcomes.
- Actionability gate: exploratory only (temporal-profile selection is unstable).

## Decision Summary

- Interpretation: Moderate evidence; plausible signal but still sensitive to model assumptions.
- Practical direction: exploratory signal only; do not treat this as a prescriptive target yet.
- Signal strength: relatively stronger within this report set.
- Actionability status: exploratory.
- Actionability gate reasons: temporal-profile selection is unstable.

## Plain-Language Summary

- Higher R&D Expenditure Per Capita (PPP) tends to align with worse Healthy Life Expectancy (HALE).
- The estimate uses 95 subjects and 6270 aligned predictor-outcome observations.
- Best observed mean outcome appears in predictor bin [984.07, 2227.7] (mean outcome 70.299).
- Outcome values in these summaries are welfare-aligned for cross-metric comparison (higher means better).

## Quality Warnings

- Some subject-level directional scores exceed |1|; this is valid because the score is a difference of two correlations.
- Top temporal profiles are close (score delta 0.0040); temporal assumptions are not yet robust.
- Robustness check: trimmed-range optimal differs by 130.7% from raw optimal; tail observations materially influence target.

## Appendix: Technical Diagnostics

### Core Metrics

| Metric | Value |
|--------|------:|
| Aggregate forward Pearson | 0.4412 |
| Aggregate reverse Pearson | 0.6472 |
| Aggregate directional score (forward - reverse) | -0.2060 |
| Aggregate effect size (% baseline delta) | 2.7541 |
| Aggregate statistical significance | 0.9333 |
| Weighted average PIS | 0.4793 |
| Aggregate value predicting high outcome | 349.0992 |
| Aggregate value predicting low outcome | 240.1539 |
| Aggregate optimal daily value | 349.0992 |
| Observed predictor range | [0.1972, 3227.4604] |
| Model-derived optimal extrapolative? | no (within observed range) |
| Model-derived optimal outside best observed bin? | yes |
| Raw best observed range | [984.07, 2227.7] |
| Robust best observed range (trimmed) | [641.05, 983.99] |
| Raw best observed outcome mean | 70.299 |
| Robust best observed outcome mean | 69.426 |
| Robust optimal value (bin median) | 805.20 international $/person |
| Raw vs robust optimal delta | 456.10 (+130.7%) |
| Robustness retained fraction | 80.1% (5025/6270) |
| Quality tier | exploratory |
| Actionability status | exploratory |
| Actionability reasons | temporal-profile selection is unstable |

### Temporal Sensitivity

| Profile | Source | Lag (years) | Duration (years) | Filling | Score | Delta vs Best | Included Subjects | Total Pairs |
|---------|--------|------------:|-----------------:|---------|------:|--------------:|------------------:|------------:|
| Selected | predictor_default | 2 | 3 | interpolation | 0.7514 | 0.0000 | 95 | 6270 |
| Runner-up | predictor_default | 3 | 2 | interpolation | 0.7474 | 0.0040 | 95 | 6270 |
| Runner-up | predictor_default | 1 | 5 | interpolation | 0.7445 | 0.0069 | 95 | 6270 |
| Runner-up | predictor_default | 2 | 2 | interpolation | 0.7445 | 0.0070 | 95 | 6270 |

### Binned Pattern Table

| Bin | Predictor Range | Pairs | Subjects | Predictor Mean | Predictor Median | Outcome Mean | Outcome Median |
|----:|-----------------|------:|---------:|---------------:|-----------------:|-------------:|---------------:|
| 1 | [0.19723, 4.613) | 618 | 18 | 2.3694 | 2.2318 | 58.9927 | 60.1360 |
| 2 | [4.613, 11.087) | 636 | 21 | 7.4869 | 7.6446 | 61.4661 | 61.8401 |
| 3 | [11.087, 24.172) | 627 | 30 | 17.1634 | 16.2550 | 62.1412 | 62.4978 |
| 4 | [24.172, 43.740) | 627 | 38 | 33.0305 | 32.7531 | 63.6085 | 64.1014 |
| 5 | [43.740, 71.336) | 627 | 35 | 57.2962 | 56.6989 | 64.4015 | 65.3388 |
| 6 | [71.336, 120.66) | 627 | 35 | 91.3537 | 89.0756 | 64.5696 | 65.4448 |
| 7 | [120.66, 273.12) | 627 | 30 | 183.1283 | 175.8964 | 66.6598 | 66.9342 |
| 8 | [273.12, 573.37) | 627 | 33 | 413.8453 | 421.4101 | 68.1867 | 68.4392 |
| 9 | [573.37, 984.07) | 627 | 26 | 769.8248 | 763.4699 | 69.3222 | 69.4762 |
| 10 | [984.07, 2227.7] | 627 | 21 | 1340.2222 | 1302.4465 | 70.2989 | 70.5071 |

### Distribution Charts

```text
Predictor Distribution (R&D Expenditure Per Capita (PPP))
[0.19723, 185.82) | ############################## 4119
[185.82, 371.45) | #### 483
[371.45, 557.07) | ### 390
[557.07, 742.69) | ## 297
[742.69, 928.32) | ## 273
[928.32, 1113.9) | ## 225
[1113.9, 1299.6) | # 165
[1299.6, 1485.2) | # 162
[1485.2, 1670.8) | # 75
[1670.8, 1856.4) | # 48
[1856.4, 2042.1) | # 24
[2042.1, 2227.7] | # 9
```

```text
Outcome Distribution (Healthy Life Expectancy (HALE), welfare-aligned)
[41.561, 44.357) | # 9
[44.357, 47.153) | # 39
[47.153, 49.949) | # 33
[49.949, 52.745) | # 69
[52.745, 55.541) | #### 183
[55.541, 58.337) | ###### 286
[58.337, 61.133) | ############ 591
[61.133, 63.929) | #################### 1019
[63.929, 66.725) | ########################### 1387
[66.725, 69.521) | ############################## 1530
[69.521, 72.317) | ##################### 1046
[72.317, 75.113] | ## 78
```

### Top Subjects

| Subject | Forward r | Directional Score | Effect % | Pairs |
|---------|----------:|------------------:|---------:|------:|
| HND | -0.2633 | -1.0573 | -0.196 | 66 |
| PRY | -0.2993 | -0.9549 | -0.678 | 66 |
| PER | -0.1839 | -0.8456 | -0.068 | 66 |
| ARE | -0.0270 | -0.8015 | 0.675 | 66 |
| MUS | 0.1804 | -0.7516 | 0.844 | 66 |
| BGR | 0.2091 | -0.7296 | 1.557 | 66 |
| USA | -0.1167 | -0.7214 | 0.269 | 66 |
| PHL | -0.1450 | -0.7159 | -0.513 | 66 |
