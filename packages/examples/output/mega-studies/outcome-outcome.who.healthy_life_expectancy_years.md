# Outcome Mega Study: outcome.who.healthy_life_expectancy_years

- Outcome label: Healthy Life Expectancy (HALE)
- Multiple testing: benjamini_hochberg
- Alpha: 0.05
- Tests: 10
- Note: `Adj p` is derived from an internal uncertainty proxy, not a classical hypothesis-test p-value.

## Lead Takeaway

- Lead predictor for Healthy Life Expectancy (HALE): R&D Share of Government Spending.
- Recommendation status: actionable.
- Estimated best level: 3.820 % of government expenditure.
- Statistical status: no predictors pass adjusted-alpha threshold; treat these as exploratory signals.
- Bin-alignment note: 10/10 model-derived optimal levels sit outside the top observed outcome bin range.
- Quality tiers: strong 0, moderate 0, exploratory 10, insufficient 0.

## Top Recommendations

- Recommendations are directional heuristics, not causal prescriptions.
- `monitor` indicates exploratory evidence that does not pass actionability gates.

1. INCREASE R&D Share of Government Spending toward 3.820 % of government expenditure (actionable, evidence A, directional score 0.128).
2. MONITOR Civilian Government Expenditure Per Capita (PPP) toward 5094.1 international $/person (exploratory, evidence A, directional score -0.184).
3. MONITOR Government Health Expenditure Per Capita (PPP) toward 679.74 international $/person (exploratory, evidence A, directional score -0.194).
4. MONITOR Government Expenditure Per Capita (PPP) toward 5074.0 international $/person (exploratory, evidence A, directional score -0.170).
5. MONITOR Education Expenditure Per Capita (PPP) toward 842.63 international $/person (exploratory, evidence A, directional score -0.130).

## Evidence Snapshot

| Predictor | Action | Status | Quality Tier | Evidence | Significance | Directional Score | Included Subjects | Pairs |
|-----------|--------|--------|--------------|----------|-------------:|------------------:|------------------:|------:|
| Civilian Government Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | A | 0.937 | -0.184 | 126 | 8316 |
| Government Health Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | A | 0.926 | -0.194 | 179 | 11814 |
| Government Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | A | 0.933 | -0.170 | 147 | 9702 |
| Education Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | A | 0.935 | -0.130 | 165 | 10890 |
| R&D Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | A | 0.933 | -0.206 | 95 | 6270 |
| Military Expenditure Per Capita (PPP) | monitor | exploratory | exploratory | A | 0.933 | -0.142 | 159 | 10494 |
| Military Share of Government Spending | monitor | exploratory | exploratory | A | 0.921 | -0.032 | 126 | 8316 |
| R&D Share of Government Spending | increase | actionable | exploratory | A | 0.918 | 0.128 | 82 | 5412 |
| Government Health Share of Government Spending | monitor | exploratory | exploratory | A | 0.917 | -0.112 | 141 | 9306 |
| Education Share of Government Spending | monitor | exploratory | exploratory | A | 0.911 | 0.108 | 134 | 8844 |

## Budget Allocation Signals

- These rows isolate budget-composition predictors (share of total government spending).
- Use this section to compare suggested allocation mix targets across sectors.

| Allocation Share Predictor | Estimated Best Share | Robust Best Share (Trimmed) | Raw-Robust Delta | Direction | Status | Quality Tier | Pair Report |
|----------------------------|---------------------:|----------------------------:|-----------------:|----------:|--------|--------------|------------|
| R&D Share of Government Spending | 3.820 % of government expenditure | 7.223 % of government expenditure | 3.403 (+89.1%) | positive | actionable | exploratory | [pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md) |
| Education Share of Government Spending | 19.742 % of government expenditure | 14.703 % of government expenditure | -5.040 (-25.5%) | positive | exploratory | exploratory | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md) |
| Government Health Share of Government Spending | 13.614 % of government expenditure | 19.044 % of government expenditure | 5.430 (+39.9%) | negative | exploratory | exploratory | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md) |
| Military Share of Government Spending | 8.235 % of government expenditure | 3.213 % of government expenditure | -5.022 (-61.0%) | negative | exploratory | exploratory | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md) |

## Optimal Levels By Predictor

- This table is predictor-centric: each row shows the estimated best level and a plain status label.
- `actionable` rows pass coverage, significance, directional-signal, and temporal-stability gates.
- `Estimated Best Level` is the raw model-derived optimum and can be extrapolative when outside observed support.
- `Outside Best Observed Bin?` means the model target differs from the highest-outcome bin interval from binned summaries.
- Compare `Estimated Best Level` with `Best Observed Range` and `Robust Best Level (Trimmed)` before interpreting as a practical target.

| Predictor | Estimated Best Level | Extrapolative? | Outside Best Observed Bin? | Robust Best Level (Trimmed) | Raw-Robust Delta | Estimated Best PPP/Capita | Best Observed Range | Robust Best Range (Trimmed) | Best Observed PPP/Capita (p10-p90) | Best Observed Outcome Mean | Direction | Status | Quality Tier | Pair Report |
|-----------|---------------------:|---------------|----------------------------|----------------------------:|-----------------:|--------------------------:|--------------------:|---------------------------:|-----------------------------------:|---------------------------:|----------:|--------|--------------|------------|
| R&D Share of Government Spending | 3.820 % of government expenditure | no | yes | 7.223 % of government expenditure | 3.403 (+89.1%) | N/A | [9.390, 20.356] | [5.019, 9.390] | N/A | 69.965 | positive | actionable | exploratory | [pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md) |
| Civilian Government Expenditure Per Capita (PPP) | 5094.1 international $/person | no | yes | 9966.4 international $/person | 4872.3 (+95.6%) | N/A | [11484.0, 42959.9] | [8814.1, 11484.0] | N/A | 69.705 | negative | exploratory | exploratory | [pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md) |
| Education Expenditure Per Capita (PPP) | 842.63 international $/person | no | yes | 1635.7 international $/person | 793.04 (+94.1%) | N/A | [2046.9, 6496.0] | [1333.9, 2046.9] | N/A | 69.030 | negative | exploratory | exploratory | [pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md) |
| Education Share of Government Spending | 19.742 % of government expenditure | no | yes | 14.703 % of government expenditure | -5.040 (-25.5%) | N/A | [12.846, 14.703) | [14.004, 15.850) | N/A | 65.740 | positive | exploratory | exploratory | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md) |
| Government Expenditure Per Capita (PPP) | 5074.0 international $/person | no | yes | 10258.3 international $/person | 5184.3 (+102.2%) | N/A | [12137.9, 43487.5] | [8614.8, 12137.9] | N/A | 68.988 | negative | exploratory | exploratory | [pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md) |
| Government Health Expenditure Per Capita (PPP) | 679.74 international $/person | no | yes | 1454.7 international $/person | 774.95 (+114.0%) | N/A | [1819.1, 5486.7] | [1114.6, 1819.1] | N/A | 69.427 | negative | exploratory | exploratory | [pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md) |
| Government Health Share of Government Spending | 13.614 % of government expenditure | no | yes | 19.044 % of government expenditure | 5.430 (+39.9%) | N/A | [20.671, 66.811] | [17.457, 20.671] | N/A | 67.739 | negative | exploratory | exploratory | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md) |
| Military Expenditure Per Capita (PPP) | 387.90 international $/person | no | yes | 509.10 international $/person | 121.19 (+31.2%) | N/A | [405.15, 641.54) | [432.28, 639.59] | N/A | 67.710 | negative | exploratory | exploratory | [pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md) |
| Military Share of Government Spending | 8.235 % of government expenditure | no | yes | 3.213 % of government expenditure | -5.022 (-61.0%) | N/A | [2.653, 3.717) | [2.653, 3.579) | N/A | 65.359 | negative | exploratory | exploratory | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md) |
| R&D Expenditure Per Capita (PPP) | 349.10 international $/person | no | yes | 805.20 international $/person | 456.10 (+130.7%) | N/A | [984.07, 2227.7] | [641.05, 983.99] | N/A | 70.299 | negative | exploratory | exploratory | [pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md) |

### Human-Readable Predictor Targets

- R&D Share of Government Spending: increase toward 3.820 % of government expenditure (outside best observed bin range); robust sensitivity target 7.223 % of government expenditure; status is actionable (usable as a decision target).
- Civilian Government Expenditure Per Capita (PPP): monitor toward 5094.1 international $/person (outside best observed bin range); robust sensitivity target 9966.4 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Education Expenditure Per Capita (PPP): monitor toward 842.63 international $/person (outside best observed bin range); robust sensitivity target 1635.7 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Education Share of Government Spending: monitor toward 19.742 % of government expenditure (outside best observed bin range); robust sensitivity target 14.703 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).
- Government Expenditure Per Capita (PPP): monitor toward 5074.0 international $/person (outside best observed bin range); robust sensitivity target 10258.3 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Government Health Expenditure Per Capita (PPP): monitor toward 679.74 international $/person (outside best observed bin range); robust sensitivity target 1454.7 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Government Health Share of Government Spending: monitor toward 13.614 % of government expenditure (outside best observed bin range); robust sensitivity target 19.044 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).
- Military Expenditure Per Capita (PPP): monitor toward 387.90 international $/person (outside best observed bin range); robust sensitivity target 509.10 international $/person; status is exploratory (exploratory and not yet prescriptive).
- Military Share of Government Spending: monitor toward 8.235 % of government expenditure (outside best observed bin range); robust sensitivity target 3.213 % of government expenditure; status is exploratory (exploratory and not yet prescriptive).
- R&D Expenditure Per Capita (PPP): monitor toward 349.10 international $/person (outside best observed bin range); robust sensitivity target 805.20 international $/person; status is exploratory (exploratory and not yet prescriptive).

## Plain-Language Summary

- First row by status/alphabetical ordering is R&D Share of Government Spending with direction positive and status actionable.
- This outcome page includes 10 predictor studies; 1 are currently actionable and 0 pass the configured adjusted-alpha threshold.
- Quality tiers in this outcome: strong 0, moderate 0, exploratory 10, insufficient 0.
- Estimated best levels come from aggregate causal-direction scoring with temporal-profile search and confidence gating.

## Appendix: Technical Ranking Details

| Rank | Predictor | Score | Confidence | Adj p | Evidence | Quality Tier | Direction | Dir Score | Units | Pairs | Optimal High | Optimal Low | Optimal Daily | Pair Report |
|-----:|-----------|------:|-----------:|------:|---------:|--------------|----------:|----------:|------:|------:|-------------:|------------:|--------------:|------------|
| 1 | Civilian Government Expenditure Per Capita (PPP) | 0.9353 | 0.8491 | 0.0893 | A | exploratory | negative | -0.1838 | 126 | 8316 | 5094.058 | 3754.331 | 5094.058 | [pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md) |
| 2 | Government Health Expenditure Per Capita (PPP) | 0.9248 | 0.8456 | 0.0893 | A | exploratory | negative | -0.1937 | 179 | 11814 | 679.740 | 502.832 | 679.740 | [pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md) |
| 3 | Government Expenditure Per Capita (PPP) | 0.8961 | 0.8449 | 0.0893 | A | exploratory | negative | -0.1695 | 147 | 9702 | 5074.013 | 3906.731 | 5074.013 | [pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md) |
| 4 | Education Expenditure Per Capita (PPP) | 0.8490 | 0.8403 | 0.0893 | A | exploratory | negative | -0.1295 | 165 | 10890 | 842.630 | 658.059 | 842.630 | [pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md) |
| 5 | R&D Expenditure Per Capita (PPP) | 0.8041 | 0.8492 | 0.0893 | A | exploratory | negative | -0.2060 | 95 | 6270 | 349.099 | 240.154 | 349.099 | [pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md) |
| 6 | Military Expenditure Per Capita (PPP) | 0.7582 | 0.8411 | 0.0893 | A | exploratory | negative | -0.1424 | 159 | 10494 | 387.905 | 369.122 | 387.905 | [pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.who.healthy_life_expectancy_years.md) |
| 7 | Military Share of Government Spending | 0.5620 | 0.8187 | 0.0893 | A | exploratory | negative | -0.0317 | 126 | 8316 | 8.235 | 10.030 | 8.235 | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md) |
| 8 | R&D Share of Government Spending | 0.5133 | 0.8291 | 0.0893 | A | exploratory | positive | 0.1277 | 82 | 5412 | 3.820 | 3.562 | 3.820 | [pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md) |
| 9 | Government Health Share of Government Spending | 0.4956 | 0.8293 | 0.0893 | A | exploratory | negative | -0.1123 | 141 | 9306 | 13.614 | 13.236 | 13.614 | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md) |
| 10 | Education Share of Government Spending | 0.4461 | 0.8257 | 0.0893 | A | exploratory | positive | 0.1079 | 134 | 8844 | 19.742 | 19.661 | 19.742 | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.who.healthy_life_expectancy_years.md) |
