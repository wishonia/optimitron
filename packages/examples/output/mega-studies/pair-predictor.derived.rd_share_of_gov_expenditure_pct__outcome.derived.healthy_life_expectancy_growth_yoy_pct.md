# Pair Study: R&D Share of Government Spending -> Healthy Life Expectancy Growth (YoY %)

- Pair ID: `predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct`
- Lag years: 5
- Duration years: 8
- Temporal profile source: predictor_default
- Filling strategy: interpolation
- Temporal candidates evaluated: 16
- Temporal candidates with valid results: 16
- Temporal profile score: 0.3594
- Included subjects: 82
- Skipped subjects: 0
- Total aligned pairs: 1722
- Signal grade: F (very weak)
- Data status: not enough data
- Confidence score: 0.490 (lower confidence)
- Signal tag: not enough data
- Direction: neutral
- Uncertainty score: 0.8059 (lower is better)

## Quick Meanings

- `Recommended level`: main value to try first.
- `Data-backed level`: level directly supported by seen data.
- `Backup level`: safer fallback from the middle of the data.
- `Math-only guess`: unconstrained model output for technical comparison.
- `Not enough data`: we cannot safely recommend a level yet.

## Key Numeric Takeaways

- No recommended level is shown for R&D Share of Government Spending -> Healthy Life Expectancy Growth (YoY %) because there is not enough data.
- Why: aligned-pair support below minimum (1722 < 2000).
- Observed support in this run: 82 subjects, 1722 aligned pairs, 10 predictor bins, 16 temporal candidates with valid results.
- Use this pair for background learning only until we have enough data.

## Decision Summary

- Interpretation: not enough data for a safe recommendation.
- Recommendation status: no recommended level until data improves.
- Why: aligned-pair support below minimum (1722 < 2000).

## Plain-Language Summary

- No strong directional pattern is detected between R&D Share of Government Spending and Healthy Life Expectancy Growth (YoY %).
- The estimate uses 82 subjects and 1722 aligned predictor-outcome observations.
- Best observed mean outcome appears in predictor bin [9.525, 20.356] (mean outcome 0.44588).
- Confidence score is 0.490 (lower confidence); data status is not enough data.
- Outcome values in these summaries are welfare-aligned for cross-metric comparison (higher means better).

## Quality Warnings

- Weak significance score (<0.70).
- Some country-level direction scores are unusually high; this can happen with this scoring method.
- Robustness check: trimmed-range optimal differs by 32.5% from raw optimal; tail observations materially influence target.
- Data status warning: aligned-pair support below minimum (1722 < 2000)

## Appendix: Technical Diagnostics

### Core Metrics

| Metric | Value |
|--------|------:|
| Forward correlation | 0.0009 |
| Reverse correlation | -0.1450 |
| Direction score (forward - reverse) | 0.1459 |
| Effect size (% change from baseline) | 283.7272 |
| Significance score | 0.1941 |
| Weighted PIS | 0.0698 |
| Value linked with higher outcome | 3.4806 |
| Value linked with lower outcome | 3.5086 |
| Math-only best daily value | 3.4806 |
| Recommended level (reader-facing) | N/A (not enough data) |
| Math-only guess (technical) | 3.481 % of government expenditure |
| Data-backed level | 13.243 % of government expenditure |
| Data-backed range | [10.327, 20.356] |
| Backup level (middle-data check) | 0.99475 % of government expenditure |
| Math-only guess inside seen data range? | yes |
| Math-only guess inside data-backed range? | no |
| Seen data range | [0.0487, 35.0684] |
| Math-only guess outside seen data? | no (within observed range) |
| Math-only guess outside best observed bucket? | yes |
| Best observed range | [9.525, 20.356] |
| Best observed range (middle-data check) | [4.384, 5.030) |
| Best observed outcome average | 0.44588 |
| Best observed outcome average (middle-data check) | 0.31515 |
| Backup level (bucket median) | 4.613 % of government expenditure |
| Math-only vs backup difference | 1.133 (+32.5%) |
| Middle-data share kept | 79.9% (1376/1722) |
| Data status | not enough data |
| Data-status details | aligned-pair support below minimum (1722 < 2000) |
| Confidence score | 0.4900 (lower confidence) |
| Reliability support component | 0.4168 |
| Reliability significance component | 0.1941 |
| Reliability directional component | 0.9728 |
| Reliability temporal-stability component | 1.0000 |
| Reliability robustness component | 0.7495 |
| Signal tag | not enough data |

### Response-Curve Diagnostics

| Diagnostic | Result |
|------------|--------|
| Minimum useful level | Not identified (no_consistent_effective_dose_detected) |
| Point where gains start slowing | 1.027 % of government expenditure (ratio=0.069) |
| Flat zone range | [5.920, 20.356] |
| Why this data-backed level was chosen | identified |
| Math-only guess minus data-backed level | -9.762 (-73.7%) |

### Temporal Sensitivity

| Profile | Source | Lag (years) | Duration (years) | Filling | Score | Delta vs Best | Included Subjects | Total Pairs |
|---------|--------|------------:|-----------------:|---------|------:|--------------:|------------------:|------------:|
| Selected | predictor_default | 5 | 8 | interpolation | 0.3594 | 0.0000 | 82 | 1722 |
| Runner-up | predictor_default | 2 | 5 | interpolation | 0.3282 | 0.0312 | 82 | 1722 |
| Runner-up | predictor_default | 3 | 3 | interpolation | 0.3121 | 0.0473 | 82 | 1722 |
| Runner-up | predictor_default | 1 | 5 | interpolation | 0.3099 | 0.0495 | 82 | 1722 |

### Binned Pattern Table

| Bin | Predictor Range | Pairs | Subjects | Predictor Mean | Predictor Median | Outcome Mean | Outcome Median |
|----:|-----------------|------:|---------:|---------------:|-----------------:|-------------:|---------------:|
| 1 | [0.06241, 0.67640) | 173 | 13 | 0.4154 | 0.4445 | -0.0858 | 0.1274 |
| 2 | [0.67640, 0.99311) | 172 | 18 | 0.8277 | 0.8021 | -0.0006 | 0.0682 |
| 3 | [0.99311, 1.392) | 172 | 27 | 1.1943 | 1.2058 | 0.0634 | 0.2505 |
| 4 | [1.392, 1.750) | 163 | 25 | 1.5505 | 1.5385 | -0.4861 | 0.0396 |
| 5 | [1.750, 2.211) | 181 | 31 | 1.9643 | 1.9515 | 0.0291 | 0.1335 |
| 6 | [2.211, 2.952) | 172 | 21 | 2.5341 | 2.5010 | 0.1104 | 0.1903 |
| 7 | [2.952, 3.973) | 172 | 20 | 3.4756 | 3.5838 | -0.0268 | 0.3048 |
| 8 | [3.973, 4.711) | 171 | 16 | 4.4125 | 4.4787 | 0.1708 | 0.2165 |
| 9 | [4.711, 9.525) | 173 | 17 | 6.7981 | 6.8821 | 0.1381 | 0.2307 |
| 10 | [9.525, 20.356] | 173 | 11 | 13.4376 | 12.6047 | 0.4459 | 0.2270 |

### Distribution Charts

```text
Predictor Distribution (R&D Share of Government Spending)
[0.06241, 1.754) | ############################## 692
[1.754, 3.445) | ################# 403
[3.445, 5.136) | ############## 323
[5.136, 6.827) | ## 42
[6.827, 8.518) | ### 60
[8.518, 10.209) | ## 55
[10.209, 11.900) | ## 36
[11.900, 13.591) | ## 47
[13.591, 15.283) | # 10
[15.283, 16.974) | # 23
[16.974, 18.665) | # 22
[18.665, 20.356] | # 9
```

```text
Outcome Distribution (Healthy Life Expectancy Growth (YoY %), welfare-aligned)
[-18.191, -14.967) | # 3
[-14.967, -11.743) | # 7
[-11.743, -8.519) | # 17
[-8.519, -5.296) | ## 77
[-5.296, -2.072) | ######## 234
[-2.072, 1.152) | ############################## 927
[1.152, 4.376) | ########## 324
[4.376, 7.600) | ### 94
[7.600, 10.824) | # 27
[10.824, 14.048) | # 7
[14.048, 17.272) | # 4
[17.272, 20.496] | # 1
```

### Top Subjects

| Subject | Forward r | Directional Score | Effect % | Pairs |
|---------|----------:|------------------:|---------:|------:|
| TTO | 0.7288 | 1.5620 | -130.048 | 21 |
| EGY | -0.6588 | -1.5307 | -447.096 | 21 |
| MDG | 0.6026 | 1.3028 | -795.271 | 21 |
| RUS | 0.3988 | 1.2427 | -115.103 | 21 |
| BGR | -0.4387 | -1.1256 | -293.821 | 21 |
| PHL | -0.1943 | -1.0333 | -699.249 | 21 |
| TUR | 0.2482 | 0.8825 | -188.559 | 21 |
| CRI | -0.1903 | -0.8522 | -58.957 | 21 |
