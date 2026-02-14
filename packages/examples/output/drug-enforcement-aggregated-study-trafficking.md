# Aggregated N-of-1: Estimated Drug Enforcement Spending vs Poisoning Deaths

- Time range: 1995-2023
- Jurisdictions included: 23/23
- Outcome source: oecd_accidental_poisoning
- Predictor source: estimated_drug_trafficking_enforcement

## Topline

| Metric | Value |
|--------|-------|
| Selected lag | 4 year(s) |
| Effect window | 3 year(s) |
| Aligned observations | 146 |
| Forward correlation | -0.117 |
| Predictive direction score | -0.566 |
| Significance score | 0.556 |
| Suggested level | $51.9 PPP/person |
| Minimum effective level | N/A |
| First detected change level | $9.6 PPP/person |
| Slowdown knee | $15.9 PPP/person |
| Best observed spending bin | [47.2, 58.5] (mean deaths 1.09) |

## Spending Bins

| Spending Bin (PPP USD/person) | Observations | Mean Death Rate | Median Death Rate |
|-------------------------------|-------------:|----------------:|------------------:|
| [0, 5.8) | 14 | 2.31 | 2.2 |
| [5.8, 10.3) | 14 | 9.02 | 9.05 |
| [10.3, 15.8) | 14 | 6.01 | 7.4 |
| [15.8, 19.5) | 16 | 1.84 | 1.85 |
| [19.5, 24.6) | 14 | 3.26 | 3.45 |
| [24.6, 27.1) | 15 | 11.57 | 8.1 |
| [27.1, 32.2) | 14 | 3.49 | 3.25 |
| [32.2, 38.3) | 12 | 2.23 | 2.05 |
| [38.3, 47.2) | 18 | 3.51 | 2.25 |
| [47.2, 58.5] | 15 | 1.09 | 1.1 |

## Lag Sensitivity

| Lag | Duration | Score | Subjects | Pairs | Forward r | Predictive r | Significance |
|----:|---------:|------:|---------:|------:|----------:|-------------:|-------------:|
| 4 | 3 | 0.534 | 23 | 146 | -0.117 | -0.566 | 0.556 |
| 4 | 2 | 0.510 | 23 | 146 | -0.092 | -0.512 | 0.548 |
| 3 | 3 | 0.456 | 23 | 146 | 0.024 | -0.327 | 0.607 |
| 2 | 3 | 0.446 | 23 | 146 | 0.035 | -0.270 | 0.644 |
| 3 | 2 | 0.428 | 23 | 146 | 0.053 | -0.260 | 0.604 |
| 1 | 3 | 0.401 | 23 | 146 | 0.067 | -0.166 | 0.632 |
| 2 | 1 | 0.396 | 23 | 146 | 0.016 | -0.158 | 0.628 |
| 1 | 1 | 0.395 | 23 | 146 | 0.011 | -0.180 | 0.599 |
| 2 | 2 | 0.384 | 23 | 146 | 0.072 | -0.139 | 0.615 |
| 3 | 1 | 0.380 | 23 | 146 | 0.106 | -0.159 | 0.581 |
| 1 | 2 | 0.377 | 23 | 146 | 0.005 | -0.106 | 0.632 |
| 0 | 2 | 0.372 | 23 | 146 | -0.020 | -0.078 | 0.650 |
| 0 | 3 | 0.355 | 23 | 146 | 0.017 | -0.016 | 0.674 |
| 4 | 1 | 0.350 | 23 | 146 | 0.094 | -0.139 | 0.516 |
| 0 | 1 | 0.342 | 23 | 146 | 0.054 | -0.004 | 0.649 |
| 5 | 2 | 0.294 | 23 | 146 | 0.273 | 0.011 | 0.504 |
| 5 | 3 | 0.294 | 23 | 146 | 0.273 | 0.011 | 0.504 |
| 5 | 1 | 0.294 | 23 | 146 | 0.273 | 0.011 | 0.504 |

## Notes

- This is aggregated N-of-1 analysis across jurisdictions (countries treated as subjects).
- Predictor source: estimated drug-trafficking enforcement spending (GF03 PPP per-capita weighted by UNODC drug-trafficking arrest share).
- Outcome source: OECD accidental poisoning mortality (CICDPOSN).
- Decision target is constrained to observed support, not unconstrained extrapolation.
- Estimated predictor should be interpreted as a budget-allocation proxy, not direct audited drug-enforcement ledger totals.

