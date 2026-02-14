# Pair Study: Government Health Share of Government Spending -> After-Tax Median Income (PPP)

- Pair ID: `predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp`
- Lag years: 3
- Duration years: 5
- Temporal profile source: predictor_default
- Filling strategy: interpolation
- Temporal candidates evaluated: 12
- Temporal candidates with valid results: 12
- Temporal profile score: 0.5994
- Included subjects: 168
- Skipped subjects: 0
- Total aligned pairs: 5677
- Evidence grade: A
- Quality tier: exploratory
- Direction: negative
- Derived uncertainty score: 0.1187 (1 - aggregate significance, not NHST p-value)

## Actionable Takeaway

- Exploratory estimate of best Government Health Share of Government Spending level for higher After-Tax Median Income (PPP): 13.790 % of government expenditure.
- Model-derived optimum is within observed support but outside the highest-outcome bin; this reflects smooth objective optimization vs coarse bin averages.
- Best observed bin anchor (median/mean) is 26.086 % of government expenditure; model-optimal minus observed-anchor difference is -12.296 (-47.1%).
- Robust sensitivity (trimmed 10-90% predictor range) suggests 18.907 % of government expenditure.
- Raw vs robust optimal differs by 37.1%, indicating strong tail influence.
- Highest observed mean After-Tax Median Income (PPP) appears when Government Health Share of Government Spending is in [20.836, 65.863] (mean outcome 35031.9).
- Direction is negative in this analysis, so lowering this predictor is associated with better outcomes.
- Actionability gate: exploratory only (temporal-profile selection is unstable).

## Decision Summary

- Interpretation: Moderate evidence; plausible signal but still sensitive to model assumptions.
- Practical direction: exploratory signal only; do not treat this as a prescriptive target yet.
- Signal strength: relatively stronger within this report set.
- Actionability status: exploratory.
- Actionability gate reasons: temporal-profile selection is unstable.

## Plain-Language Summary

- Higher Government Health Share of Government Spending tends to align with worse After-Tax Median Income (PPP).
- The estimate uses 168 subjects and 5677 aligned predictor-outcome observations.
- Best observed mean outcome appears in predictor bin [20.836, 65.863] (mean outcome 35031.9).
- Outcome values in these summaries are welfare-aligned for cross-metric comparison (higher means better).

## Quality Warnings

- Some subject-level directional scores exceed |1|; this is valid because the score is a difference of two correlations.
- Top temporal profiles are close (score delta 0.0077); temporal assumptions are not yet robust.
- Robustness check: trimmed-range optimal differs by 37.1% from raw optimal; tail observations materially influence target.

## Appendix: Technical Diagnostics

### Core Metrics

| Metric | Value |
|--------|------:|
| Aggregate forward Pearson | 0.2629 |
| Aggregate reverse Pearson | 0.3039 |
| Aggregate directional score (forward - reverse) | -0.0410 |
| Aggregate effect size (% baseline delta) | 46.8374 |
| Aggregate statistical significance | 0.8813 |
| Weighted average PIS | 0.6363 |
| Aggregate value predicting high outcome | 13.7900 |
| Aggregate value predicting low outcome | 13.0360 |
| Aggregate optimal daily value | 13.7900 |
| Observed predictor range | [0.8069, 88.0822] |
| Model-derived optimal extrapolative? | no (within observed range) |
| Model-derived optimal outside best observed bin? | yes |
| Raw best observed range | [20.836, 65.863] |
| Robust best observed range (trimmed) | [17.435, 20.827] |
| Raw best observed outcome mean | 35031.9 |
| Robust best observed outcome mean | 24716.0 |
| Robust optimal value (bin median) | 18.907 % of government expenditure |
| Raw vs robust optimal delta | 5.117 (+37.1%) |
| Robustness retained fraction | 80.1% (4547/5677) |
| Quality tier | exploratory |
| Actionability status | exploratory |
| Actionability reasons | temporal-profile selection is unstable |

### Temporal Sensitivity

| Profile | Source | Lag (years) | Duration (years) | Filling | Score | Delta vs Best | Included Subjects | Total Pairs |
|---------|--------|------------:|-----------------:|---------|------:|--------------:|------------------:|------------:|
| Selected | predictor_default | 3 | 5 | interpolation | 0.5994 | 0.0000 | 168 | 5677 |
| Runner-up | predictor_default | 3 | 3 | interpolation | 0.5917 | 0.0077 | 168 | 5677 |
| Runner-up | predictor_default | 3 | 2 | interpolation | 0.5896 | 0.0098 | 168 | 5677 |
| Runner-up | predictor_default | 2 | 5 | interpolation | 0.5821 | 0.0173 | 168 | 5677 |

### Binned Pattern Table

| Bin | Predictor Range | Pairs | Subjects | Predictor Mean | Predictor Median | Outcome Mean | Outcome Median |
|----:|-----------------|------:|---------:|---------------:|-----------------:|-------------:|---------------:|
| 1 | [0.93053, 6.049) | 562 | 26 | 4.7660 | 4.8966 | 3538.6788 | 2485.0000 |
| 2 | [6.049, 8.425) | 574 | 42 | 7.2350 | 7.1360 | 9381.4857 | 5205.0000 |
| 3 | [8.425, 9.678) | 566 | 50 | 9.0836 | 9.1043 | 8624.0793 | 3930.0000 |
| 4 | [9.678, 10.915) | 569 | 66 | 10.2898 | 10.3254 | 10009.8525 | 6480.0000 |
| 5 | [10.915, 12.168) | 567 | 68 | 11.4876 | 11.4731 | 14143.9470 | 9610.0000 |
| 6 | [12.168, 13.359) | 568 | 65 | 12.7165 | 12.7043 | 13909.3589 | 10955.0000 |
| 7 | [13.359, 14.871) | 568 | 64 | 14.1474 | 14.0939 | 17083.6589 | 13180.0000 |
| 8 | [14.871, 16.642) | 560 | 53 | 15.6261 | 15.5760 | 17683.2071 | 12795.0000 |
| 9 | [16.642, 20.836) | 575 | 40 | 18.5864 | 18.5633 | 24920.3546 | 21140.0000 |
| 10 | [20.836, 65.863] | 568 | 28 | 29.5985 | 26.0862 | 35031.9135 | 30859.5082 |

### Distribution Charts

```text
Predictor Distribution (Government Health Share of Government Spending)
[0.93053, 6.342) | ########## 663
[6.342, 11.753) | ############################## 2028
[11.753, 17.164) | ############################# 1942
[17.164, 22.575) | ######### 616
[22.575, 27.986) | ### 204
[27.986, 33.397) | ## 138
[33.397, 38.808) | # 26
[38.808, 44.219) | # 17
[44.219, 49.630) | # 3
[49.630, 55.041) | # 6
[55.041, 60.452) | # 1
[60.452, 65.863] | # 33
```

```text
Outcome Distribution (After-Tax Median Income (PPP), welfare-aligned)
[280.00, 10724.2) | ############################## 3129
[10724.2, 21168.3) | ########### 1134
[21168.3, 31612.5) | ###### 601
[31612.5, 42056.7) | ### 337
[42056.7, 52500.8) | ## 225
[52500.8, 62945.0) | # 111
[62945.0, 73389.2) | # 65
[73389.2, 83833.3) | # 31
[83833.3, 94277.5) | # 24
[94277.5, 104722) | # 14
[104722, 115166) | # 4
[115166, 125610] | # 2
```

### Top Subjects

| Subject | Forward r | Directional Score | Effect % | Pairs |
|---------|----------:|------------------:|---------:|------:|
| PSS | -0.7288 | -1.5069 | -39.169 | 34 |
| ARE | 0.6472 | 1.2114 | 27.522 | 34 |
| RWA | -0.8044 | -1.1610 | -63.249 | 34 |
| KGZ | -0.8096 | -1.1233 | -54.301 | 33 |
| TGO | 0.7838 | 1.0962 | 72.266 | 34 |
| ITA | 0.5917 | 1.0789 | 67.197 | 34 |
| ZMB | -0.8955 | -1.0021 | -48.499 | 34 |
| IDX | -0.8618 | -0.9966 | -55.389 | 34 |
