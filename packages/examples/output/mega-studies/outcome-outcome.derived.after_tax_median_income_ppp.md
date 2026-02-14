# Outcome Mega Study: outcome.derived.after_tax_median_income_ppp

- Outcome label: After-Tax Median Income (PPP)
- Multiple testing: benjamini_hochberg
- Alpha: 0.05
- Tests: 10
- Note: `Adj p` is derived from an internal uncertainty proxy, not a classical hypothesis-test p-value.
- Note: After-tax median income is currently proxied by World Bank GNI per-capita PPP in this report set.

## Lead Takeaway

- Lead predictor for After-Tax Median Income (PPP): Civilian Government Expenditure Per Capita (PPP).
- Recommendation status: exploratory only (lead signal did not pass actionability gate).
- Estimated best level: 5213.4 international $/person.
- Statistical status: no predictors pass adjusted-alpha threshold; treat these as exploratory signals.
- Bin-alignment note: 10/10 model-derived optimal levels sit outside the top observed outcome bin range.
- Quality tiers: strong 0, moderate 0, exploratory 10, insufficient 0.

## Top Recommendations

- Recommendations are directional heuristics, not causal prescriptions.
- `monitor` indicates exploratory evidence that does not pass actionability gates.

1. MONITOR R&D Expenditure Per Capita (PPP) toward 338.55 international $/person (exploratory, evidence A, directional score 0.032).
2. MONITOR Military Expenditure Per Capita (PPP) toward 399.58 international $/person (exploratory, evidence A, directional score -0.082).
3. MONITOR Civilian Government Expenditure Per Capita (PPP) toward 5213.4 international $/person (exploratory, evidence A, directional score -0.023).
4. MONITOR Government Expenditure Per Capita (PPP) toward 5310.5 international $/person (exploratory, evidence A, directional score -0.027).
5. MONITOR R&D Share of Government Spending toward 4.043 % of government expenditure (exploratory, evidence A, directional score 0.126).

## Evidence Snapshot

| Predictor | Action | Status | Quality Tier | Evidence | Significance | Directional Score | Included Subjects | Pairs |
|-----------|--------|--------|--------------|----------|-------------:|------------------:|------------------:|------:|
| R&D Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | A | 0.898 | 0.032 | 123 | 4134 |
| Military Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | A | 0.882 | -0.082 | 201 | 6630 |
| Civilian Government Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | A | 0.900 | -0.023 | 148 | 5001 |
| Government Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | A | 0.900 | -0.027 | 175 | 5915 |
| R&D Share of Government Spending | monitor | exploratory | exploratory | A | 0.876 | 0.126 | 100 | 3380 |
| Education Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | A | 0.893 | 0.018 | 216 | 7140 |
| Government Health Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | A | 0.890 | -0.016 | 229 | 7585 |
| Military Share of Government Spending | monitor | exploratory | exploratory | A | 0.887 | -0.122 | 148 | 5001 |
| Education Share of Government Spending | monitor | exploratory | exploratory | A | 0.866 | 0.114 | 159 | 5371 |
| Government Health Share of Government Spending | monitor | exploratory | exploratory | A | 0.881 | -0.041 | 168 | 5677 |

## Budget Allocation Signals

- These rows isolate budget-composition predictors (share of total government spending).
- Use this section to compare suggested allocation mix targets across sectors.

| Allocation Share Predictor | Estimated Best Share | Robust Best Share (Trimmed) | Raw-Robust Delta | Direction | Status | Quality Tier | Pair Report |
|----------------------------|---------------------:|----------------------------:|-----------------:|----------:|--------|--------------|------------|
| Education Share of Government Spending | 19.337 % of government expenditure | 13.284 % of government expenditure | -6.053 (-31.3%) | positive | exploratory | exploratory | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md) |
| Government Health Share of Government Spending | 13.790 % of government expenditure | 18.907 % of government expenditure | 5.117 (+37.1%) | negative | exploratory | exploratory | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md) |
| Military Share of Government Spending | 8.164 % of government expenditure | 3.573 % of government expenditure | -4.591 (-56.2%) | negative | exploratory | exploratory | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md) |
| R&D Share of Government Spending | 4.043 % of government expenditure | 7.495 % of government expenditure | 3.452 (+85.4%) | positive | exploratory | exploratory | [pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md) |

## Optimal Levels By Predictor

- This table is predictor-centric: each row shows the estimated best level and a plain status label.
- `actionable` rows pass coverage, significance, directional-signal, and temporal-stability gates.
- `Estimated Best Level` is the raw model-derived optimum and can be extrapolative when outside observed support.
- `Outside Best Observed Bin?` means the model target differs from the highest-outcome bin interval from binned summaries.
- Compare `Estimated Best Level` with `Best Observed Range` and `Robust Best Level (Trimmed)` before interpreting as a practical target.

| Predictor | Estimated Best Level | Extrapolative? | Outside Best Observed Bin? | Robust Best Level (Trimmed) | Raw-Robust Delta | Estimated Best PPP/Capita | Best Observed Range | Robust Best Range (Trimmed) | Best Observed PPP/Capita (p10-p90) | Best Observed Outcome Mean | Direction | Status | Quality Tier | Pair Report |
|-----------|---------------------:|---------------|----------------------------|----------------------------:|-----------------:|--------------------------:|--------------------:|---------------------------:|-----------------------------------:|---------------------------:|----------:|--------|--------------|------------|
| Civilian Government Expenditure Per Capita (PPP) | 5213.4 international $/person | no | yes | 8929.0 international $/person | 3715.7 (+71.3%) | N/A | [10279.3, 47874.3] | [7202.5, 10279.3] | N/A | 50214.8 | negative | exploratory | exploratory | [pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md) |
| Education Expenditure Per Capita (PPP) | 822.42 international $/person | no | yes | 1376.5 international $/person | 554.06 (+67.4%) | N/A | [1682.9, 6496.0] | [1120.5, 1682.5] | N/A | 54699.5 | neutral | exploratory | exploratory | [pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md) |
| Education Share of Government Spending | 19.337 % of government expenditure | no | yes | 13.284 % of government expenditure | -6.053 (-31.3%) | N/A | [12.888, 14.666) | [12.488, 13.891) | N/A | 23743.9 | positive | exploratory | exploratory | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md) |
| Government Expenditure Per Capita (PPP) | 5310.5 international $/person | no | yes | 8890.1 international $/person | 3579.6 (+67.4%) | N/A | [10869.0, 48525.1] | [7136.5, 10868.1] | N/A | 50585.9 | negative | exploratory | exploratory | [pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md) |
| Government Health Expenditure Per Capita (PPP) | 685.68 international $/person | no | yes | 1369.4 international $/person | 683.73 (+99.7%) | N/A | [1635.2, 5977.9] | [1002.6, 1630.3] | N/A | 46324.6 | neutral | exploratory | exploratory | [pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md) |
| Government Health Share of Government Spending | 13.790 % of government expenditure | no | yes | 18.907 % of government expenditure | 5.117 (+37.1%) | N/A | [20.836, 65.863] | [17.435, 20.827] | N/A | 35031.9 | negative | exploratory | exploratory | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md) |
| Military Expenditure Per Capita (PPP) | 399.58 international $/person | no | yes | 501.20 international $/person | 101.61 (+25.4%) | N/A | [625.06, 21187.0] | [423.09, 624.77] | N/A | 49136.2 | negative | exploratory | exploratory | [pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md) |
| Military Share of Government Spending | 8.164 % of government expenditure | no | yes | 3.573 % of government expenditure | -4.591 (-56.2%) | N/A | [3.111, 4.156) | [3.111, 3.976) | N/A | 27010.6 | negative | exploratory | exploratory | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md) |
| R&D Expenditure Per Capita (PPP) | 338.55 international $/person | no | yes | 597.32 international $/person | 258.77 (+76.4%) | N/A | [774.74, 2285.7] | [482.31, 774.12] | N/A | 53568.3 | positive | exploratory | exploratory | [pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md) |
| R&D Share of Government Spending | 4.043 % of government expenditure | no | yes | 7.495 % of government expenditure | 3.452 (+85.4%) | N/A | [8.637, 26.042] | [5.623, 8.636] | N/A | 49865.4 | positive | exploratory | exploratory | [pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md) |

### Human-Readable Predictor Targets

- Civilian Government Expenditure Per Capita (PPP): monitor toward 5213.4 international $/person (outside best observed bin range); robust sensitivity target 8929.0 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Education Expenditure Per Capita (PPP): monitor toward 822.42 international $/person (outside best observed bin range); robust sensitivity target 1376.5 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Education Share of Government Spending: monitor toward 19.337 % of government expenditure (outside best observed bin range); robust sensitivity target 13.284 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).
- Government Expenditure Per Capita (PPP): monitor toward 5310.5 international $/person (outside best observed bin range); robust sensitivity target 8890.1 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Government Health Expenditure Per Capita (PPP): monitor toward 685.68 international $/person (outside best observed bin range); robust sensitivity target 1369.4 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Government Health Share of Government Spending: monitor toward 13.790 % of government expenditure (outside best observed bin range); robust sensitivity target 18.907 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).
- Military Expenditure Per Capita (PPP): monitor toward 399.58 international $/person (outside best observed bin range); robust sensitivity target 501.20 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Military Share of Government Spending: monitor toward 8.164 % of government expenditure (outside best observed bin range); robust sensitivity target 3.573 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).
- R&D Expenditure Per Capita (PPP): monitor toward 338.55 international $/person (outside best observed bin range); robust sensitivity target 597.32 international $/person; status is exploratory (exploratory and not yet prescriptive).
- R&D Share of Government Spending: monitor toward 4.043 % of government expenditure (outside best observed bin range); robust sensitivity target 7.495 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).

## Plain-Language Summary

- First row by status/alphabetical ordering is Civilian Government Expenditure Per Capita (PPP) with direction negative and status exploratory.
- This outcome page includes 10 predictor studies; 0 are currently actionable and 0 pass the configured adjusted-alpha threshold.
- Quality tiers in this outcome: strong 0, moderate 0, exploratory 10, insufficient 0.
- Estimated best levels come from aggregate causal-direction scoring with temporal-profile search and confidence gating.

## Appendix: Technical Ranking Details

| Rank | Predictor | Score | Confidence | Adj p | Evidence | Quality Tier | Direction | Dir Score | Units | Pairs | Optimal High | Optimal Low | Optimal Daily | Pair Report |
|-----:|-----------|------:|-----------:|------:|---------:|--------------|----------:|----------:|------:|------:|-------------:|------------:|--------------:|------------|
| 1 | R&D Expenditure Per Capita (PPP) | 0.7666 | 0.8083 | 0.1343 | A | exploratory | positive | 0.0324 | 123 | 4134 | 338.547 | 161.656 | 338.547 | [pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md) |
| 2 | Military Expenditure Per Capita (PPP) | 0.7586 | 0.8090 | 0.1343 | A | exploratory | negative | -0.0823 | 201 | 6630 | 399.585 | 343.865 | 399.585 | [pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md) |
| 3 | Civilian Government Expenditure Per Capita (PPP) | 0.7231 | 0.8084 | 0.1343 | A | exploratory | negative | -0.0231 | 148 | 5001 | 5213.371 | 2660.372 | 5213.371 | [pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md) |
| 4 | Government Expenditure Per Capita (PPP) | 0.7184 | 0.8089 | 0.1343 | A | exploratory | negative | -0.0270 | 175 | 5915 | 5310.506 | 2896.863 | 5310.506 | [pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md) |
| 5 | R&D Share of Government Spending | 0.7137 | 0.8118 | 0.1343 | A | exploratory | positive | 0.1257 | 100 | 3380 | 4.043 | 3.618 | 4.043 | [pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md) |
| 6 | Education Expenditure Per Capita (PPP) | 0.6984 | 0.8045 | 0.1343 | A | exploratory | neutral | 0.0180 | 216 | 7140 | 822.418 | 440.638 | 822.418 | [pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md) |
| 7 | Government Health Expenditure Per Capita (PPP) | 0.6832 | 0.8031 | 0.1343 | A | exploratory | neutral | -0.0159 | 229 | 7585 | 685.682 | 391.334 | 685.682 | [pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.after_tax_median_income_ppp.md) |
| 8 | Military Share of Government Spending | 0.6451 | 0.8173 | 0.1343 | A | exploratory | negative | -0.1219 | 148 | 5001 | 8.164 | 11.559 | 8.164 | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md) |
| 9 | Education Share of Government Spending | 0.5883 | 0.8066 | 0.1343 | A | exploratory | positive | 0.1138 | 159 | 5371 | 19.337 | 19.183 | 19.337 | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md) |
| 10 | Government Health Share of Government Spending | 0.5448 | 0.8027 | 0.1343 | A | exploratory | negative | -0.0410 | 168 | 5677 | 13.790 | 13.036 | 13.790 | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.after_tax_median_income_ppp.md) |
