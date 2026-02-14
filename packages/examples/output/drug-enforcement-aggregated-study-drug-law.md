# Aggregated N-of-1: Estimated Drug Enforcement Spending vs Poisoning Deaths

- Time range: 1995-2023
- Jurisdictions included: 19/19
- Outcome source: oecd_accidental_poisoning
- Predictor source: estimated_drug_law_enforcement

## Topline

| Metric | Value |
|--------|-------|
| Selected lag | 1 year(s) |
| Effect window | 3 year(s) |
| Aligned observations | 121 |
| Forward correlation | -0.003 |
| Predictive direction score | -0.401 |
| Significance score | 0.657 |
| Suggested level | $23.2 PPP/person |
| Minimum effective level | N/A |
| First detected change level | $31 PPP/person |
| Slowdown knee | $133.4 PPP/person |
| Best observed spending bin | [15.5, 29.4) (mean deaths 1.97) |

## Spending Bins

| Spending Bin (PPP USD/person) | Observations | Mean Death Rate | Median Death Rate |
|-------------------------------|-------------:|----------------:|------------------:|
| [15.5, 29.4) | 12 | 1.97 | 1.9 |
| [29.4, 34.8) | 12 | 6.73 | 6.35 |
| [34.8, 82.8) | 23 | 5.59 | 4.2 |
| [82.8, 119.1) | 24 | 2.64 | 1.95 |
| [119.1, 163.3) | 13 | 4.42 | 2.4 |
| [163.3, 226) | 23 | 8.89 | 6.3 |
| [226, 327.2] | 14 | 3.69 | 3.6 |

## Lag Sensitivity

| Lag | Duration | Score | Subjects | Pairs | Forward r | Predictive r | Significance |
|----:|---------:|------:|---------:|------:|----------:|-------------:|-------------:|
| 1 | 3 | 0.484 | 19 | 121 | -0.003 | -0.401 | 0.657 |
| 4 | 3 | 0.482 | 19 | 121 | -0.268 | -0.565 | 0.464 |
| 1 | 2 | 0.463 | 19 | 121 | -0.036 | -0.342 | 0.663 |
| 4 | 2 | 0.444 | 19 | 121 | -0.180 | -0.521 | 0.405 |
| 4 | 1 | 0.431 | 19 | 121 | -0.233 | -0.440 | 0.463 |
| 2 | 3 | 0.410 | 19 | 121 | 0.014 | -0.254 | 0.612 |
| 3 | 3 | 0.406 | 19 | 121 | 0.032 | -0.265 | 0.592 |
| 1 | 1 | 0.396 | 19 | 121 | 0.089 | -0.189 | 0.648 |
| 3 | 2 | 0.395 | 19 | 121 | 0.026 | -0.255 | 0.571 |
| 2 | 2 | 0.389 | 19 | 121 | 0.080 | -0.210 | 0.605 |
| 2 | 1 | 0.377 | 19 | 121 | 0.075 | -0.164 | 0.623 |
| 0 | 2 | 0.352 | 19 | 121 | 0.164 | -0.088 | 0.639 |
| 0 | 1 | 0.341 | 19 | 121 | 0.278 | 0.064 | 0.632 |
| 3 | 1 | 0.337 | 19 | 121 | 0.201 | -0.124 | 0.555 |
| 5 | 2 | 0.337 | 19 | 121 | -0.025 | -0.243 | 0.419 |
| 5 | 3 | 0.337 | 19 | 121 | -0.025 | -0.243 | 0.419 |
| 5 | 1 | 0.337 | 19 | 121 | -0.025 | -0.243 | 0.419 |
| 0 | 3 | 0.337 | 19 | 121 | 0.184 | -0.032 | 0.658 |

## Notes

- This is aggregated N-of-1 analysis across jurisdictions (countries treated as subjects).
- Predictor source: estimated drug-law enforcement spending (GF03 PPP per-capita weighted by UNODC drug-law arrest share).
- Outcome source: OECD accidental poisoning mortality (CICDPOSN).
- Decision target is constrained to observed support, not unconstrained extrapolation.
- Estimated predictor should be interpreted as a budget-allocation proxy, not direct audited drug-enforcement ledger totals.

