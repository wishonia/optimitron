# Outcome Mega Study: outcome.derived.after_tax_median_income_ppp_growth_yoy_pct

- Outcome label: After-Tax Median Income Growth (YoY %)
- Multiple testing: benjamini_hochberg
- Alpha: 0.05
- Tests: 10
- Note: `Adj p` is derived from an internal uncertainty proxy, not a classical hypothesis-test p-value.
- Note: After-tax median income is currently proxied by World Bank GNI per-capita PPP in this report set.

## Lead Takeaway

- Lead predictor for After-Tax Median Income Growth (YoY %): Civilian Government Expenditure Per Capita (PPP).
- Recommendation status: exploratory only (lead signal did not pass actionability gate).
- Estimated best level: 3873.5 international $/person.
- Statistical status: no predictors pass adjusted-alpha threshold; treat these as exploratory signals.
- Bin-alignment note: 8/10 model-derived optimal levels sit outside the top observed outcome bin range.
- Quality tiers: strong 0, moderate 0, exploratory 10, insufficient 0.

## Top Recommendations

- Recommendations are directional heuristics, not causal prescriptions.
- `monitor` indicates exploratory evidence that does not pass actionability gates.

1. MONITOR Government Health Expenditure Per Capita (PPP) toward 584.90 international $/person (exploratory, evidence C, directional score 0.130).
2. MONITOR Education Expenditure Per Capita (PPP) toward 685.87 international $/person (exploratory, evidence C, directional score -0.068).
3. MONITOR Government Health Share of Government Spending toward 13.149 % of government expenditure (exploratory, evidence C, directional score 0.127).
4. MONITOR Civilian Government Expenditure Per Capita (PPP) toward 3873.5 international $/person (exploratory, evidence B, directional score 0.108).
5. MONITOR Government Expenditure Per Capita (PPP) toward 4144.5 international $/person (exploratory, evidence C, directional score 0.098).

## Evidence Snapshot

| Predictor | Action | Status | Quality Tier | Evidence | Significance | Directional Score | Included Subjects | Pairs |
|-----------|--------|--------|--------------|----------|-------------:|------------------:|------------------:|------:|
| Government Health Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | C | 0.682 | 0.130 | 229 | 7356 |
| Education Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | C | 0.685 | -0.068 | 216 | 6924 |
| Government Health Share of Government Spending | monitor | exploratory | exploratory | C | 0.698 | 0.127 | 168 | 5509 |
| Civilian Government Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | B | 0.700 | 0.108 | 148 | 4853 |
| Government Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | C | 0.695 | 0.098 | 175 | 5740 |
| R&D Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | C | 0.671 | 0.150 | 123 | 4011 |
| Military Share of Government Spending | monitor | exploratory | exploratory | C | 0.681 | -0.129 | 148 | 4853 |
| Education Share of Government Spending | monitor | exploratory | exploratory | C | 0.681 | -0.134 | 159 | 5212 |
| R&D Share of Government Spending | monitor | exploratory | exploratory | B | 0.702 | 0.102 | 100 | 3280 |
| Military Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | C | 0.693 | -0.103 | 201 | 6429 |

## Budget Allocation Signals

- These rows isolate budget-composition predictors (share of total government spending).
- Use this section to compare suggested allocation mix targets across sectors.

| Allocation Share Predictor | Estimated Best Share | Robust Best Share (Trimmed) | Raw-Robust Delta | Direction | Status | Quality Tier | Pair Report |
|----------------------------|---------------------:|----------------------------:|-----------------:|----------:|--------|--------------|------------|
| Education Share of Government Spending | 19.036 % of government expenditure | 13.288 % of government expenditure | -5.748 (-30.2%) | negative | exploratory | exploratory | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| Government Health Share of Government Spending | 13.149 % of government expenditure | 12.600 % of government expenditure | -0.54889 (-4.2%) | positive | exploratory | exploratory | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| Military Share of Government Spending | 9.785 % of government expenditure | 4.759 % of government expenditure | -5.025 (-51.4%) | negative | exploratory | exploratory | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| R&D Share of Government Spending | 3.711 % of government expenditure | 1.513 % of government expenditure | -2.197 (-59.2%) | positive | exploratory | exploratory | [pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |

## Optimal Levels By Predictor

- This table is predictor-centric: each row shows the estimated best level and a plain status label.
- `actionable` rows pass coverage, significance, directional-signal, and temporal-stability gates.
- `Estimated Best Level` is the raw model-derived optimum and can be extrapolative when outside observed support.
- `Outside Best Observed Bin?` means the model target differs from the highest-outcome bin interval from binned summaries.
- Compare `Estimated Best Level` with `Best Observed Range` and `Robust Best Level (Trimmed)` before interpreting as a practical target.

| Predictor | Estimated Best Level | Extrapolative? | Outside Best Observed Bin? | Robust Best Level (Trimmed) | Raw-Robust Delta | Estimated Best PPP/Capita | Best Observed Range | Robust Best Range (Trimmed) | Best Observed PPP/Capita (p10-p90) | Best Observed Outcome Mean | Direction | Status | Quality Tier | Pair Report |
|-----------|---------------------:|---------------|----------------------------|----------------------------:|-----------------:|--------------------------:|--------------------:|---------------------------:|-----------------------------------:|---------------------------:|----------:|--------|--------------|------------|
| Civilian Government Expenditure Per Capita (PPP) | 3873.5 international $/person | no | yes | 511.72 international $/person | -3361.8 (-86.8%) | N/A | [457.16, 845.17) | [372.83, 649.66) | N/A | 5.931 | positive | exploratory | exploratory | [pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| Education Expenditure Per Capita (PPP) | 685.87 international $/person | no | no | 544.13 international $/person | -141.74 (-20.7%) | N/A | [510.99, 751.14) | [478.16, 631.39) | N/A | 5.154 | negative | exploratory | exploratory | [pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| Education Share of Government Spending | 19.036 % of government expenditure | no | yes | 13.288 % of government expenditure | -5.748 (-30.2%) | N/A | [12.937, 14.674) | [12.548, 13.910) | N/A | 5.598 | negative | exploratory | exploratory | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| Government Expenditure Per Capita (PPP) | 4144.5 international $/person | no | yes | 974.44 international $/person | -3170.1 (-76.5%) | N/A | [576.55, 979.24) | [806.31, 1164.4) | N/A | 5.390 | positive | exploratory | exploratory | [pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| Government Health Expenditure Per Capita (PPP) | 584.90 international $/person | no | yes | 37.036 international $/person | -547.86 (-93.7%) | N/A | [34.371, 71.973) | [27.900, 52.150) | N/A | 5.158 | positive | exploratory | exploratory | [pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| Government Health Share of Government Spending | 13.149 % of government expenditure | no | no | 12.600 % of government expenditure | -0.54889 (-4.2%) | N/A | [12.186, 13.363) | [12.164, 12.930) | N/A | 5.778 | positive | exploratory | exploratory | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| Military Expenditure Per Capita (PPP) | 387.15 international $/person | no | yes | 174.77 international $/person | -212.38 (-54.9%) | N/A | [151.11, 211.92) | [151.11, 199.11) | N/A | 5.249 | negative | exploratory | exploratory | [pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| Military Share of Government Spending | 9.785 % of government expenditure | no | yes | 4.759 % of government expenditure | -5.025 (-51.4%) | N/A | [4.760, 5.660) | [4.441, 5.096) | N/A | 5.170 | negative | exploratory | exploratory | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| R&D Expenditure Per Capita (PPP) | 282.81 international $/person | no | yes | 18.124 international $/person | -264.69 (-93.6%) | N/A | [0.19723, 4.911) | [12.117, 23.120) | N/A | 5.327 | positive | exploratory | exploratory | [pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| R&D Share of Government Spending | 3.711 % of government expenditure | no | yes | 1.513 % of government expenditure | -2.197 (-59.2%) | N/A | [1.523, 2.042) | [1.388, 1.750) | N/A | 5.853 | positive | exploratory | exploratory | [pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |

### Human-Readable Predictor Targets

- Civilian Government Expenditure Per Capita (PPP): monitor toward 3873.5 international $/person (outside best observed bin range); robust sensitivity target 511.72 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Education Expenditure Per Capita (PPP): monitor toward 685.87 international $/person; robust sensitivity target 544.13 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Education Share of Government Spending: monitor toward 19.036 % of government expenditure (outside best observed bin range); robust sensitivity target 13.288 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).
- Government Expenditure Per Capita (PPP): monitor toward 4144.5 international $/person (outside best observed bin range); robust sensitivity target 974.44 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Government Health Expenditure Per Capita (PPP): monitor toward 584.90 international $/person (outside best observed bin range); robust sensitivity target 37.036 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Government Health Share of Government Spending: monitor toward 13.149 % of government expenditure; robust sensitivity target 12.600 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).
- Military Expenditure Per Capita (PPP): monitor toward 387.15 international $/person (outside best observed bin range); robust sensitivity target 174.77 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Military Share of Government Spending: monitor toward 9.785 % of government expenditure (outside best observed bin range); robust sensitivity target 4.759 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).
- R&D Expenditure Per Capita (PPP): monitor toward 282.81 international $/person (outside best observed bin range); robust sensitivity target 18.124 international $/person; status is exploratory (exploratory and not yet prescriptive).
- R&D Share of Government Spending: monitor toward 3.711 % of government expenditure (outside best observed bin range); robust sensitivity target 1.513 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).

## Plain-Language Summary

- First row by status/alphabetical ordering is Civilian Government Expenditure Per Capita (PPP) with direction positive and status exploratory.
- This outcome page includes 10 predictor studies; 0 are currently actionable and 0 pass the configured adjusted-alpha threshold.
- Quality tiers in this outcome: strong 0, moderate 0, exploratory 10, insufficient 0.
- Estimated best levels come from aggregate causal-direction scoring with temporal-profile search and confidence gating.

## Appendix: Technical Ranking Details

| Rank | Predictor | Score | Confidence | Adj p | Evidence | Quality Tier | Direction | Dir Score | Units | Pairs | Optimal High | Optimal Low | Optimal Daily | Pair Report |
|-----:|-----------|------:|-----------:|------:|---------:|--------------|----------:|----------:|------:|------:|-------------:|------------:|--------------:|------------|
| 1 | Government Health Expenditure Per Capita (PPP) | 0.8433 | 0.7265 | 0.3286 | C | exploratory | positive | 0.1305 | 229 | 7356 | 584.896 | 558.233 | 584.896 | [pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| 2 | Education Expenditure Per Capita (PPP) | 0.7527 | 0.7185 | 0.3286 | C | exploratory | negative | -0.0676 | 216 | 6924 | 685.869 | 659.317 | 685.869 | [pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| 3 | Government Health Share of Government Spending | 0.6793 | 0.7330 | 0.3286 | C | exploratory | positive | 0.1267 | 168 | 5509 | 13.149 | 13.120 | 13.149 | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| 4 | Civilian Government Expenditure Per Capita (PPP) | 0.6459 | 0.7310 | 0.3286 | B | exploratory | positive | 0.1075 | 148 | 4853 | 3873.518 | 3720.477 | 3873.518 | [pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| 5 | Government Expenditure Per Capita (PPP) | 0.5819 | 0.7274 | 0.3286 | C | exploratory | positive | 0.0978 | 175 | 5740 | 4144.519 | 3894.965 | 4144.519 | [pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| 6 | R&D Expenditure Per Capita (PPP) | 0.5564 | 0.7241 | 0.3286 | C | exploratory | positive | 0.1495 | 123 | 4011 | 282.812 | 271.946 | 282.812 | [pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| 7 | Military Share of Government Spending | 0.5480 | 0.7256 | 0.3286 | C | exploratory | negative | -0.1291 | 148 | 4853 | 9.785 | 10.219 | 9.785 | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| 8 | Education Share of Government Spending | 0.4932 | 0.7263 | 0.3286 | C | exploratory | negative | -0.1336 | 159 | 5212 | 19.036 | 18.888 | 19.036 | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| 9 | R&D Share of Government Spending | 0.4653 | 0.7300 | 0.3286 | B | exploratory | positive | 0.1019 | 100 | 3280 | 3.711 | 3.666 | 3.711 | [pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
| 10 | Military Expenditure Per Capita (PPP) | 0.4452 | 0.7272 | 0.3286 | C | exploratory | negative | -0.1032 | 201 | 6429 | 387.150 | 388.403 | 387.150 | [pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md](pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp_growth_yoy_pct.md) |
