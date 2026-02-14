# Aggregated N-of-1: Public Order Spending vs Poisoning Deaths

- Time range: 1995-2023
- Jurisdictions included: 36/36
- Outcome source: oecd_accidental_poisoning

## Topline

| Metric | Value |
|--------|-------|
| Selected lag | 5 year(s) |
| Effect window | 3 year(s) |
| Aligned observations | 947 |
| Forward correlation | 0.142 |
| Predictive direction score | 0.106 |
| Significance score | 0.713 |
| Suggested level | $380.2 PPP/person |
| Minimum effective level | $216.6 PPP/person |
| First detected change level | $216.6 PPP/person |
| Slowdown knee | $380.2 PPP/person |
| Best observed spending bin | [355.1, 404) (mean deaths 2.78) |

## Spending Bins

| Spending Bin (PPP USD/person) | Observations | Mean Death Rate | Median Death Rate |
|-------------------------------|-------------:|----------------:|------------------:|
| [29.5, 180) | 95 | 6.62 | 3.9 |
| [180, 257.2) | 92 | 6.33 | 1.85 |
| [257.2, 320.8) | 97 | 4.25 | 2.8 |
| [320.8, 355.1) | 92 | 3.22 | 1.6 |
| [355.1, 404) | 95 | 2.78 | 1.7 |
| [404, 453.7) | 97 | 2.91 | 2.2 |
| [453.7, 516.4) | 95 | 2.91 | 2.1 |
| [516.4, 585) | 94 | 4.08 | 3.4 |
| [585, 720.4) | 95 | 3.15 | 2.1 |
| [720.4, 1,191.2] | 95 | 5.62 | 3.1 |

## Lag Sensitivity

| Lag | Duration | Score | Subjects | Pairs | Forward r | Predictive r | Significance |
|----:|---------:|------:|---------:|------:|----------:|-------------:|-------------:|
| 5 | 3 | 0.542 | 36 | 947 | 0.142 | 0.106 | 0.713 |
| 5 | 2 | 0.541 | 36 | 947 | 0.150 | 0.106 | 0.712 |
| 5 | 1 | 0.540 | 36 | 947 | 0.167 | 0.107 | 0.706 |
| 4 | 1 | 0.531 | 36 | 947 | 0.153 | 0.080 | 0.710 |
| 4 | 3 | 0.530 | 36 | 947 | 0.160 | 0.082 | 0.707 |
| 4 | 2 | 0.530 | 36 | 947 | 0.166 | 0.082 | 0.706 |
| 3 | 1 | 0.525 | 36 | 947 | 0.112 | 0.058 | 0.719 |
| 3 | 3 | 0.523 | 36 | 947 | 0.136 | 0.061 | 0.710 |
| 3 | 2 | 0.522 | 36 | 947 | 0.137 | 0.059 | 0.711 |
| 2 | 3 | 0.517 | 36 | 947 | 0.109 | 0.038 | 0.720 |
| 2 | 2 | 0.515 | 36 | 947 | 0.095 | 0.036 | 0.714 |
| 2 | 1 | 0.512 | 36 | 947 | 0.078 | 0.040 | 0.703 |
| 1 | 3 | 0.506 | 36 | 947 | 0.086 | 0.019 | 0.709 |
| 1 | 2 | 0.502 | 36 | 947 | 0.059 | 0.018 | 0.700 |
| 1 | 1 | 0.500 | 36 | 947 | 0.061 | 0.016 | 0.695 |
| 0 | 3 | 0.496 | 36 | 947 | 0.060 | 0.005 | 0.698 |
| 0 | 1 | 0.495 | 36 | 947 | 0.055 | 0.006 | 0.693 |
| 0 | 2 | 0.494 | 36 | 947 | 0.053 | 0.003 | 0.693 |

## Notes

- This is aggregated N-of-1 analysis across jurisdictions (countries treated as subjects).
- Predictor is a proxy: COFOG GF03 public order/safety spending, not pure narcotics-only spending.
- Outcome source: OECD accidental poisoning mortality (CICDPOSN).
- Decision target is constrained to observed support, not unconstrained extrapolation.

