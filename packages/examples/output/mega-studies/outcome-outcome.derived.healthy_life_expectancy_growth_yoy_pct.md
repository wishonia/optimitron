# Outcome Mega Study: outcome.derived.healthy_life_expectancy_growth_yoy_pct

- Outcome label: Healthy Life Expectancy Growth (YoY %)
- Multiple testing: benjamini_hochberg
- Alpha: 0.05
- Tests: 10
- Note: `Adj p` is derived from an internal uncertainty proxy, not a classical hypothesis-test p-value.

## Lead Takeaway

- Lead predictor for Healthy Life Expectancy Growth (YoY %): Civilian Government Expenditure Per Capita (PPP).
- Recommendation status: exploratory only (lead signal did not pass actionability gate).
- Estimated best level: 4471.6 international $/person.
- Statistical status: no predictors pass adjusted-alpha threshold; treat these as exploratory signals.
- Bin-alignment note: 10/10 model-derived optimal levels sit outside the top observed outcome bin range.
- Quality tiers: strong 0, moderate 0, exploratory 0, insufficient 10.

## Top Recommendations

- Recommendations are directional heuristics, not causal prescriptions.
- `monitor` indicates exploratory evidence that does not pass actionability gates.

1. MONITOR Military Share of Government Spending toward 9.048 % of government expenditure (exploratory, evidence F, directional score 0.056).
2. MONITOR Education Share of Government Spending toward 19.440 % of government expenditure (exploratory, evidence F, directional score 0.062).
3. MONITOR R&D Share of Government Spending toward 3.481 % of government expenditure (exploratory, evidence F, directional score 0.146).
4. MONITOR Civilian Government Expenditure Per Capita (PPP) toward 4471.6 international $/person (exploratory, evidence F, directional score 0.069).
5. MONITOR Government Expenditure Per Capita (PPP) toward 4531.5 international $/person (exploratory, evidence F, directional score 0.064).

## Evidence Snapshot

| Predictor | Action | Status | Quality Tier | Evidence | Significance | Directional Score | Included Subjects | Pairs |
|-----------|--------|--------|--------------|----------|-------------:|------------------:|------------------:|------:|
| Military Share of Government Spending | monitor | exploratory | insufficient | F | 0.193 | 0.056 | 126 | 2646 |
| Education Share of Government Spending | monitor | exploratory | insufficient | F | 0.194 | 0.062 | 134 | 2814 |
| R&D Share of Government Spending | monitor | exploratory | insufficient | F | 0.194 | 0.146 | 82 | 1722 |
| Civilian Government Expenditure Per Capita (PPP) | monitor | exploratory | insufficient | F | 0.191 | 0.069 | 126 | 2646 |
| Government Expenditure Per Capita (PPP) | monitor | exploratory | insufficient | F | 0.185 | 0.064 | 147 | 3087 |
| R&D Expenditure Per Capita (PPP) | monitor | exploratory | insufficient | F | 0.291 | -0.170 | 95 | 1995 |
| Government Health Share of Government Spending | monitor | exploratory | insufficient | F | 0.227 | -0.122 | 141 | 2961 |
| Education Expenditure Per Capita (PPP) | monitor | exploratory | insufficient | F | 0.185 | 0.075 | 165 | 3465 |
| Government Health Expenditure Per Capita (PPP) | monitor | exploratory | insufficient | F | 0.220 | -0.050 | 179 | 3759 |
| Military Expenditure Per Capita (PPP) | monitor | exploratory | insufficient | F | 0.197 | 0.053 | 159 | 3339 |

## Budget Allocation Signals

- These rows isolate budget-composition predictors (share of total government spending).
- Use this section to compare suggested allocation mix targets across sectors.

| Allocation Share Predictor | Estimated Best Share | Robust Best Share (Trimmed) | Raw-Robust Delta | Direction | Status | Quality Tier | Pair Report |
|----------------------------|---------------------:|----------------------------:|-----------------:|----------:|--------|--------------|------------|
| Education Share of Government Spending | 19.440 % of government expenditure | 20.911 % of government expenditure | 1.471 (+7.6%) | positive | exploratory | insufficient | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Government Health Share of Government Spending | 13.024 % of government expenditure | 14.852 % of government expenditure | 1.828 (+14.0%) | negative | exploratory | insufficient | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Military Share of Government Spending | 9.048 % of government expenditure | 9.883 % of government expenditure | 0.83424 (+9.2%) | positive | exploratory | insufficient | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| R&D Share of Government Spending | 3.481 % of government expenditure | 4.613 % of government expenditure | 1.133 (+32.5%) | positive | exploratory | insufficient | [pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |

## Optimal Levels By Predictor

- This table is predictor-centric: each row shows the estimated best level and a plain status label.
- `actionable` rows pass coverage, significance, directional-signal, and temporal-stability gates.
- `Estimated Best Level` is the raw model-derived optimum and can be extrapolative when outside observed support.
- `Outside Best Observed Bin?` means the model target differs from the highest-outcome bin interval from binned summaries.
- Compare `Estimated Best Level` with `Best Observed Range` and `Robust Best Level (Trimmed)` before interpreting as a practical target.

| Predictor | Estimated Best Level | Extrapolative? | Outside Best Observed Bin? | Robust Best Level (Trimmed) | Raw-Robust Delta | Estimated Best PPP/Capita | Best Observed Range | Robust Best Range (Trimmed) | Best Observed PPP/Capita (p10-p90) | Best Observed Outcome Mean | Direction | Status | Quality Tier | Pair Report |
|-----------|---------------------:|---------------|----------------------------|----------------------------:|-----------------:|--------------------------:|--------------------:|---------------------------:|-----------------------------------:|---------------------------:|----------:|--------|--------------|------------|
| Civilian Government Expenditure Per Capita (PPP) | 4471.6 international $/person | no | yes | 305.21 international $/person | -4166.3 (-93.2%) | N/A | [7.604, 214.06) | [214.06, 506.71) | N/A | 1.110 | positive | exploratory | insufficient | [pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Education Expenditure Per Capita (PPP) | 744.31 international $/person | no | yes | 62.367 international $/person | -681.94 (-91.6%) | N/A | [9.238, 48.180) | [48.249, 82.428) | N/A | 1.097 | positive | exploratory | insufficient | [pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Education Share of Government Spending | 19.440 % of government expenditure | no | yes | 20.911 % of government expenditure | 1.471 (+7.6%) | N/A | [28.681, 66.668] | [20.190, 21.607) | N/A | 0.72663 | positive | exploratory | insufficient | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Government Expenditure Per Capita (PPP) | 4531.5 international $/person | no | yes | 716.19 international $/person | -3815.3 (-84.2%) | N/A | [20.664, 260.72) | [576.55, 888.95) | N/A | 1.070 | positive | exploratory | insufficient | [pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Government Health Expenditure Per Capita (PPP) | 506.82 international $/person | no | yes | 17.662 international $/person | -489.16 (-96.5%) | N/A | [0.25914, 13.927) | [13.941, 22.120) | N/A | 1.064 | negative | exploratory | insufficient | [pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Government Health Share of Government Spending | 13.024 % of government expenditure | no | yes | 14.852 % of government expenditure | 1.828 (+14.0%) | N/A | [0.93053, 5.930) | [14.275, 15.542) | N/A | 0.57112 | negative | exploratory | insufficient | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Military Expenditure Per Capita (PPP) | 372.10 international $/person | no | yes | 21.730 international $/person | -350.37 (-94.2%) | N/A | [0.91749, 16.666) | [16.681, 26.916) | N/A | 0.96572 | positive | exploratory | insufficient | [pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Military Share of Government Spending | 9.048 % of government expenditure | no | yes | 9.883 % of government expenditure | 0.83424 (+9.2%) | N/A | [16.650, 88.206] | [9.079, 10.774) | N/A | 0.63575 | positive | exploratory | insufficient | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| R&D Expenditure Per Capita (PPP) | 228.03 international $/person | no | yes | 492.19 international $/person | 264.16 (+115.8%) | N/A | [0.19723, 4.621) | [392.51, 642.18) | N/A | 0.64005 | negative | exploratory | insufficient | [pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| R&D Share of Government Spending | 3.481 % of government expenditure | no | yes | 4.613 % of government expenditure | 1.133 (+32.5%) | N/A | [9.525, 20.356] | [4.384, 5.030) | N/A | 0.44588 | positive | exploratory | insufficient | [pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |

### Human-Readable Predictor Targets

- Civilian Government Expenditure Per Capita (PPP): monitor toward 4471.6 international $/person (outside best observed bin range); robust sensitivity target 305.21 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Education Expenditure Per Capita (PPP): monitor toward 744.31 international $/person (outside best observed bin range); robust sensitivity target 62.367 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Education Share of Government Spending: monitor toward 19.440 % of government expenditure (outside best observed bin range); robust sensitivity target 20.911 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).
- Government Expenditure Per Capita (PPP): monitor toward 4531.5 international $/person (outside best observed bin range); robust sensitivity target 716.19 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Government Health Expenditure Per Capita (PPP): monitor toward 506.82 international $/person (outside best observed bin range); robust sensitivity target 17.662 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Government Health Share of Government Spending: monitor toward 13.024 % of government expenditure (outside best observed bin range); robust sensitivity target 14.852 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).
- Military Expenditure Per Capita (PPP): monitor toward 372.10 international $/person (outside best observed bin range); robust sensitivity target 21.730 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Military Share of Government Spending: monitor toward 9.048 % of government expenditure (outside best observed bin range); robust sensitivity target 9.883 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).
- R&D Expenditure Per Capita (PPP): monitor toward 228.03 international $/person (outside best observed bin range); robust sensitivity target 492.19 international $/person; status is exploratory (exploratory and not yet prescriptive).
- R&D Share of Government Spending: monitor toward 3.481 % of government expenditure (outside best observed bin range); robust sensitivity target 4.613 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).

## Plain-Language Summary

- First row by status/alphabetical ordering is Civilian Government Expenditure Per Capita (PPP) with direction positive and status exploratory.
- This outcome page includes 10 predictor studies; 0 are currently actionable and 0 pass the configured adjusted-alpha threshold.
- Quality tiers in this outcome: strong 0, moderate 0, exploratory 0, insufficient 10.
- Estimated best levels come from aggregate causal-direction scoring with temporal-profile search and confidence gating.

## Appendix: Technical Ranking Details

| Rank | Predictor | Score | Confidence | Adj p | Evidence | Quality Tier | Direction | Dir Score | Units | Pairs | Optimal High | Optimal Low | Optimal Daily | Pair Report |
|-----:|-----------|------:|-----------:|------:|---------:|--------------|----------:|----------:|------:|------:|-------------:|------------:|--------------:|------------|
| 1 | Military Share of Government Spending | 0.6260 | 0.4948 | 0.8151 | F | insufficient | positive | 0.0560 | 126 | 2646 | 9.048 | 8.701 | 9.048 | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 2 | Education Share of Government Spending | 0.6041 | 0.4962 | 0.8151 | F | insufficient | positive | 0.0623 | 134 | 2814 | 19.440 | 19.214 | 19.440 | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 3 | R&D Share of Government Spending | 0.5660 | 0.5053 | 0.8151 | F | insufficient | positive | 0.1459 | 82 | 1722 | 3.481 | 3.509 | 3.481 | [pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 4 | Civilian Government Expenditure Per Capita (PPP) | 0.5458 | 0.4958 | 0.8151 | F | insufficient | positive | 0.0692 | 126 | 2646 | 4471.558 | 4689.740 | 4471.558 | [pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 5 | Government Expenditure Per Capita (PPP) | 0.4951 | 0.4926 | 0.8151 | F | insufficient | positive | 0.0636 | 147 | 3087 | 4531.514 | 4726.013 | 4531.514 | [pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 6 | R&D Expenditure Per Capita (PPP) | 0.4744 | 0.5543 | 0.8151 | F | insufficient | negative | -0.1701 | 95 | 1995 | 228.025 | 264.240 | 228.025 | [pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 7 | Government Health Share of Government Spending | 0.3462 | 0.5204 | 0.8151 | F | insufficient | negative | -0.1222 | 141 | 2961 | 13.024 | 13.165 | 13.024 | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 8 | Education Expenditure Per Capita (PPP) | 0.3243 | 0.4945 | 0.8151 | F | insufficient | positive | 0.0753 | 165 | 3465 | 744.310 | 783.164 | 744.310 | [pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 9 | Government Health Expenditure Per Capita (PPP) | 0.2235 | 0.5066 | 0.8151 | F | insufficient | negative | -0.0503 | 179 | 3759 | 506.824 | 543.597 | 506.824 | [pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 10 | Military Expenditure Per Capita (PPP) | 0.2213 | 0.4963 | 0.8151 | F | insufficient | positive | 0.0525 | 159 | 3339 | 372.099 | 393.871 | 372.099 | [pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
