# Outcome Mega Study: outcome.derived.healthy_life_expectancy_growth_yoy_pct

- Outcome label: Healthy Life Expectancy Growth (YoY %)
- Multiple testing: benjamini_hochberg
- Alpha: 0.05
- Tests: 8
- Note: `Adj p` is an uncertainty score in this system (lower is better).

## Quick Meanings

- `Recommended level`: main value to try first.
- `Data-backed level`: level directly supported by seen data.
- `Backup level`: safer fallback from the middle of the data.
- `Math-only guess`: model output used for technical checks only.
- `Not enough data`: we cannot safely recommend a level yet.

## Lead Takeaway

- Lead predictor for Healthy Life Expectancy Growth (YoY %): Military Share of Government Spending.
- Recommended level: 9.950 % of government expenditure (data-backed level).
- Stats check: no predictors pass the adjusted threshold; treat these as early signals.
- Bucket check: 8/8 math-only guesses are outside the best observed bucket.
- Math-only guess (technical only): 9.048 % of government expenditure.
- Signal tags: strong 0, moderate 0, early 0, not-enough-data 8.
- Data status: 8/8 predictor rows have enough data.
- Average confidence score across predictors: 0.438.

## Pairs With Not Enough Data

- 2 predictor/outcome pairs were removed from ranking and recommendation tables because they did not have enough data.
| Predictor | Included Subjects | Aligned Pairs | Why Not Enough Data | Pair Report |
|-----------|------------------:|--------------:|---------------------|------------|
| R&D Expenditure Per Capita (PPP) | 95 | 1995 | aligned-pair support below minimum (1995 < 2000) | [pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.rd_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| R&D Share of Government Spending | 82 | 1722 | aligned-pair support below minimum (1722 < 2000) | [pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.rd_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |

## Top Recommended Levels

- These are the top recommended levels from the highest-scoring predictor/outcome relationships.
- Use them as practical guidance, not guaranteed cause-and-effect rules.

1. Military Share of Government Spending: recommended level 9.950 % of government expenditure (data-backed level); data-backed level 9.950 % of government expenditure; minimum useful level N/A; math-only guess 9.048 % of government expenditure; signal grade F (very weak); direction score 0.056.
2. Education Share of Government Spending: recommended level 33.378 % of government expenditure (data-backed level); data-backed level 33.378 % of government expenditure; minimum useful level 19.592 % of government expenditure; math-only guess 19.440 % of government expenditure; signal grade F (very weak); direction score 0.062.
3. Civilian Government Expenditure Per Capita (PPP): recommended level 112.66 international $/person (data-backed level); data-backed level 112.66 international $/person; minimum useful level N/A; math-only guess 4471.6 international $/person; signal grade F (very weak); direction score 0.069.
4. Government Expenditure Per Capita (PPP): recommended level 138.29 international $/person (data-backed level); data-backed level 138.29 international $/person; minimum useful level N/A; math-only guess 4531.5 international $/person; signal grade F (very weak); direction score 0.064.
5. Government Health Share of Government Spending: recommended level 15.035 % of government expenditure (data-backed level); data-backed level 15.035 % of government expenditure; minimum useful level N/A; math-only guess 13.024 % of government expenditure; signal grade F (very weak); direction score -0.122.

## Quick Confidence Table

| Predictor | Data Status | Confidence | Signal Tag | Signal Grade | Significance | Direction Score | Data-Backed Level | Minimum Useful Level | Slowdown Starts Near | Included Subjects | Pairs |
|-----------|-------------|-----------:|------------|--------------|-------------:|----------------:|------------------:|---------------------:|--------------------:|------------------:|------:|
| Military Share of Government Spending | enough data | 0.474 (lower confidence) | not enough data | F (very weak) | 0.193 | 0.056 | 9.950 % of government expenditure | N/A | 9.950 % of government expenditure | 126 | 2646 |
| Education Share of Government Spending | enough data | 0.508 (lower confidence) | not enough data | F (very weak) | 0.194 | 0.062 | 33.378 % of government expenditure | 19.592 % of government expenditure | 21.063 % of government expenditure | 134 | 2814 |
| Civilian Government Expenditure Per Capita (PPP) | enough data | 0.367 (lower confidence) | not enough data | F (very weak) | 0.191 | 0.069 | 112.66 international $/person | N/A | 5781.1 international $/person | 126 | 2646 |
| Government Expenditure Per Capita (PPP) | enough data | 0.407 (lower confidence) | not enough data | F (very weak) | 0.185 | 0.064 | 138.29 international $/person | N/A | 8422.5 international $/person | 147 | 3087 |
| Government Health Share of Government Spending | enough data | 0.663 (medium confidence) | not enough data | F (very weak) | 0.227 | -0.122 | 15.035 % of government expenditure | N/A | 15.035 % of government expenditure | 141 | 2961 |
| Education Expenditure Per Capita (PPP) | enough data | 0.413 (lower confidence) | not enough data | F (very weak) | 0.185 | 0.075 | 30.522 international $/person | N/A | 1237.4 international $/person | 165 | 3465 |
| Government Health Expenditure Per Capita (PPP) | enough data | 0.351 (lower confidence) | not enough data | F (very weak) | 0.220 | -0.050 | 6.995 international $/person | N/A | 869.53 international $/person | 179 | 3759 |
| Military Expenditure Per Capita (PPP) | enough data | 0.324 (lower confidence) | not enough data | F (very weak) | 0.197 | 0.053 | 8.665 international $/person | N/A | 340.45 international $/person | 159 | 3339 |

## Budget Allocation Signals

- These rows show spending mix predictors (share of total government spending).
- Use this section to compare recommended mix levels across sectors.

| Allocation Share Predictor | Recommended Share | Backup Share | Math-Only Guess | Guess-Backup Difference | Direction | Signal Tag | Pair Report |
|----------------------------|------------------:|-------------:|----------------:|------------------------:|----------:|------------|------------|
| Education Share of Government Spending | 33.378 % of government expenditure | 20.911 % of government expenditure | 19.440 % of government expenditure | 1.471 (+7.6%) | positive | not enough data | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Government Health Share of Government Spending | 15.035 % of government expenditure | 14.852 % of government expenditure | 13.024 % of government expenditure | 1.828 (+14.0%) | negative | not enough data | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Military Share of Government Spending | 9.950 % of government expenditure | 9.883 % of government expenditure | 9.048 % of government expenditure | 0.83424 (+9.2%) | positive | not enough data | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |

## Recommended Levels By Predictor

- Each row shows key numeric levels for one predictor.
- `Recommended level` is the main level to try.
- `Math-only guess` is shown only for technical comparison.
- `Math-only guess outside best bucket?` means the math-only guess is outside the best observed data bucket.

| Predictor | Recommended Level | Why This Level | Minimum Useful Level | Slowdown Starts Near | Backup Level | Math-Only Guess | Math-Only Guess Outside Seen Data? | Math-Only Guess Outside Best Bucket? | Guess-Backup Difference | Recommended PPP/Capita | Best Observed Range | Best Observed Range (Middle-Data Check) | Best Observed PPP/Capita (p10-p90) | Best Observed Outcome Mean | Direction | Data Status | Confidence | Signal Tag | Pair Report |
|-----------|------------------:|----------------|---------------------:|--------------------:|-------------:|----------------:|------------------------------------|--------------------------------------|------------------------:|----------------------:|--------------------:|----------------------------------------:|-----------------------------------:|---------------------------:|----------:|------------|-----------:|------------|------------|
| Civilian Government Expenditure Per Capita (PPP) | 112.66 international $/person | data-backed level | N/A | 5781.1 international $/person | 305.21 international $/person | 4471.6 international $/person | no | yes | -4166.3 (-93.2%) | N/A | [7.604, 214.06) | [214.06, 506.71) | N/A | 1.110 | negative | enough data | 0.367 (lower confidence) | not enough data | [pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Education Expenditure Per Capita (PPP) | 30.522 international $/person | data-backed level | N/A | 1237.4 international $/person | 62.367 international $/person | 744.31 international $/person | no | yes | -681.94 (-91.6%) | N/A | [9.238, 48.180) | [48.249, 82.428) | N/A | 1.097 | negative | enough data | 0.413 (lower confidence) | not enough data | [pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Education Share of Government Spending | 33.378 % of government expenditure | data-backed level | 19.592 % of government expenditure | 21.063 % of government expenditure | 20.911 % of government expenditure | 19.440 % of government expenditure | no | yes | 1.471 (+7.6%) | N/A | [28.681, 66.668] | [20.190, 21.607) | N/A | 0.72663 | positive | enough data | 0.508 (lower confidence) | not enough data | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Government Expenditure Per Capita (PPP) | 138.29 international $/person | data-backed level | N/A | 8422.5 international $/person | 716.19 international $/person | 4531.5 international $/person | no | yes | -3815.3 (-84.2%) | N/A | [20.664, 260.72) | [576.55, 888.95) | N/A | 1.070 | negative | enough data | 0.407 (lower confidence) | not enough data | [pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Government Health Expenditure Per Capita (PPP) | 6.995 international $/person | data-backed level | N/A | 869.53 international $/person | 17.662 international $/person | 506.82 international $/person | no | yes | -489.16 (-96.5%) | N/A | [0.25914, 13.927) | [13.941, 22.120) | N/A | 1.064 | negative | enough data | 0.351 (lower confidence) | not enough data | [pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Government Health Share of Government Spending | 15.035 % of government expenditure | data-backed level | N/A | 15.035 % of government expenditure | 14.852 % of government expenditure | 13.024 % of government expenditure | no | yes | 1.828 (+14.0%) | N/A | [0.93053, 5.930) | [14.275, 15.542) | N/A | 0.57112 | negative | enough data | 0.663 (medium confidence) | not enough data | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Military Expenditure Per Capita (PPP) | 8.665 international $/person | data-backed level | N/A | 340.45 international $/person | 21.730 international $/person | 372.10 international $/person | no | yes | -350.37 (-94.2%) | N/A | [0.91749, 16.666) | [16.681, 26.916) | N/A | 0.96572 | negative | enough data | 0.324 (lower confidence) | not enough data | [pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| Military Share of Government Spending | 9.950 % of government expenditure | data-backed level | N/A | 9.950 % of government expenditure | 9.883 % of government expenditure | 9.048 % of government expenditure | no | yes | 0.83424 (+9.2%) | N/A | [16.650, 88.206] | [9.079, 10.774) | N/A | 0.63575 | positive | enough data | 0.474 (lower confidence) | not enough data | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |

### Predictor Summaries In Plain English

- Civilian Government Expenditure Per Capita (PPP): recommended level 112.66 international $/person (data-backed level); minimum useful level N/A; gains start slowing near 5781.1 international $/person; backup level 305.21 international $/person; math-only guess 4471.6 international $/person (outside best observed bucket); data status enough data; confidence 0.367 (lower confidence); signal tag not enough data.
- Education Expenditure Per Capita (PPP): recommended level 30.522 international $/person (data-backed level); minimum useful level N/A; gains start slowing near 1237.4 international $/person; backup level 62.367 international $/person; math-only guess 744.31 international $/person (outside best observed bucket); data status enough data; confidence 0.413 (lower confidence); signal tag not enough data.
- Education Share of Government Spending: recommended level 33.378 % of government expenditure (data-backed level); minimum useful level 19.592 % of government expenditure; gains start slowing near 21.063 % of government expenditure; backup level 20.911 % of government expenditure; math-only guess 19.440 % of government expenditure (outside best observed bucket); data status enough data; confidence 0.508 (lower confidence); signal tag not enough data.
- Government Expenditure Per Capita (PPP): recommended level 138.29 international $/person (data-backed level); minimum useful level N/A; gains start slowing near 8422.5 international $/person; backup level 716.19 international $/person; math-only guess 4531.5 international $/person (outside best observed bucket); data status enough data; confidence 0.407 (lower confidence); signal tag not enough data.
- Government Health Expenditure Per Capita (PPP): recommended level 6.995 international $/person (data-backed level); minimum useful level N/A; gains start slowing near 869.53 international $/person; backup level 17.662 international $/person; math-only guess 506.82 international $/person (outside best observed bucket); data status enough data; confidence 0.351 (lower confidence); signal tag not enough data.
- Government Health Share of Government Spending: recommended level 15.035 % of government expenditure (data-backed level); minimum useful level N/A; gains start slowing near 15.035 % of government expenditure; backup level 14.852 % of government expenditure; math-only guess 13.024 % of government expenditure (outside best observed bucket); data status enough data; confidence 0.663 (medium confidence); signal tag not enough data.
- Military Expenditure Per Capita (PPP): recommended level 8.665 international $/person (data-backed level); minimum useful level N/A; gains start slowing near 340.45 international $/person; backup level 21.730 international $/person; math-only guess 372.10 international $/person (outside best observed bucket); data status enough data; confidence 0.324 (lower confidence); signal tag not enough data.
- Military Share of Government Spending: recommended level 9.950 % of government expenditure (data-backed level); minimum useful level N/A; gains start slowing near 9.950 % of government expenditure; backup level 9.883 % of government expenditure; math-only guess 9.048 % of government expenditure (outside best observed bucket); data status enough data; confidence 0.474 (lower confidence); signal tag not enough data.

## Plain-Language Summary

- Highest-ranked row is Civilian Government Expenditure Per Capita (PPP) with direction negative.
- This outcome page includes 8 predictor studies; 0 pass the stats threshold.
- Data status: 8/8 rows have enough data; average confidence is 0.438.
- Signal tags in this outcome: strong 0, moderate 0, early 0, not-enough-data 8.
- Recommended levels come from data-backed checks; math-only guesses are kept for technical comparison only.

## Appendix: Extra Technical Numbers

| Rank | Predictor | Score | Confidence | Adj p | Signal Grade | Signal Tag | Direction | Direction Score | Countries | Pairs | High-Outcome Value | Low-Outcome Value | Math-Only Best Daily | Pair Report |
|-----:|-----------|------:|-----------:|------:|--------------|------------|----------:|----------------:|----------:|------:|-------------------:|------------------:|---------------------:|------------|
| 1 | Military Share of Government Spending | 0.6582 | 0.4948 | 0.8151 | F (very weak) | not enough data | positive | 0.0560 | 126 | 2646 | 9.048 | 8.701 | 9.048 | [pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.military_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 2 | Education Share of Government Spending | 0.6399 | 0.4962 | 0.8151 | F (very weak) | not enough data | positive | 0.0623 | 134 | 2814 | 19.440 | 19.214 | 19.440 | [pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.education_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 3 | Civilian Government Expenditure Per Capita (PPP) | 0.5856 | 0.4958 | 0.8151 | F (very weak) | not enough data | negative | 0.0692 | 126 | 2646 | 4471.558 | 4689.740 | 4471.558 | [pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_non_military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 4 | Government Expenditure Per Capita (PPP) | 0.5317 | 0.4926 | 0.8151 | F (very weak) | not enough data | negative | 0.0636 | 147 | 3087 | 4531.514 | 4726.013 | 4531.514 | [pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 5 | Government Health Share of Government Spending | 0.4166 | 0.5204 | 0.8151 | F (very weak) | not enough data | negative | -0.1222 | 141 | 2961 | 13.024 | 13.165 | 13.024 | [pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_health_share_of_gov_expenditure_pct__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 6 | Education Expenditure Per Capita (PPP) | 0.3677 | 0.4945 | 0.8151 | F (very weak) | not enough data | negative | 0.0753 | 165 | 3465 | 744.310 | 783.164 | 744.310 | [pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.education_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 7 | Government Health Expenditure Per Capita (PPP) | 0.2525 | 0.5066 | 0.8151 | F (very weak) | not enough data | negative | -0.0503 | 179 | 3759 | 506.824 | 543.597 | 506.824 | [pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.gov_health_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
| 8 | Military Expenditure Per Capita (PPP) | 0.2516 | 0.4963 | 0.8151 | F (very weak) | not enough data | negative | 0.0525 | 159 | 3339 | 372.099 | 393.871 | 372.099 | [pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md](pair-predictor.derived.military_expenditure_per_capita_ppp__outcome.derived.healthy_life_expectancy_growth_yoy_pct.md) |
