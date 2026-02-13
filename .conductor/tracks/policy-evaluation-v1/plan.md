# Plan: Policy Evaluation Pipeline (v1)

## Goal
Generalized pipeline that evaluates any policy using 3 layers of evidence,
all computed through `runFullAnalysis()`. Each policy gets a `PolicyEvaluation`
with aggregated scores from within-jurisdiction time series, natural experiments,
and cross-jurisdiction panels.

## Schema

- [ ] 1. Define `PolicyEvaluation` type in `packages/opg/src/policy-evaluation.ts`
  - `policy: string`
  - `expectedOutcomes: OutcomeMetric[]` (metric name, direction, unit)
  - `evidence.withinJurisdiction: FullAnalysisResult[]` (Layer 1)
  - `evidence.naturalExperiments: NaturalExperimentResult[]` (Layer 2)
  - `evidence.crossJurisdiction: PanelAnalysisResult | null` (Layer 3)
  - `aggregateScore: number` (weighted meta-analysis)
  - `evidenceGrade: string` (A-F derived from aggregate)

- [ ] 2. Define `NaturalExperiment` type
  - `jurisdiction: string`
  - `policy: string`
  - `interventionDate: string` (ISO date)
  - `preData: TimeSeries` (outcome before intervention)
  - `postData: TimeSeries` (outcome after intervention)
  - `result: FullAnalysisResult` (computed)

## Layer 1: Within-Jurisdiction Time Series (US)
- [x] 3. Run 14 US datasets through `runFullAnalysis()` → `policy-time-series-analysis.json`
  - Done: `packages/examples/src/policy-time-series-analysis/run-all-policies.ts`

## Layer 2: Natural Experiments (Multi-Jurisdiction Before/After)
- [ ] 4. Create time-series datasets for each PolicyExemplar (15 policies):
  - Portugal drug decriminalization (2001): drug deaths, HIV rates, 1995-2020
  - Singapore healthcare: LE, infant mortality, spending, 1980-2023
  - Finland education reform (1970s): PISA scores, spending, 1970-2020
  - Norway rehabilitative prisons: recidivism rates, 1990-2020
  - Australia gun buyback (1996): gun deaths, mass shootings, 1980-2020
  - Rwanda CHW program: maternal/child mortality, 2000-2020
  - Denmark cycling infrastructure: transport mode share, health, 1990-2020
  - South Korea broadband: GDP growth, internet penetration, 1995-2020
  - Costa Rica universal healthcare: LE, infant mortality, 1970-2020
  - Netherlands Housing First: homelessness rates, 2006-2020
  - Switzerland injection sites: overdose deaths, HIV, 1986-2020
  - Uruguay cannabis legalization (2013): drug arrests, use rates, 2008-2023
  - Singapore public housing (HDB): homeownership, affordability, 1965-2020
  - Estonia e-governance: digital service adoption, corruption index, 2000-2020
  - Japan Tokutei Kenshin: metabolic syndrome rates, 2008-2020

- [ ] 5. Build `runNaturalExperiment()` function
  - Takes: time-series data + intervention date
  - Splits into pre/post TimeSeries
  - Runs `runFullAnalysis()` on (time → outcome) for pre and post periods
  - Computes interrupted time-series statistics (level change, slope change)

- [ ] 6. Run all 15 exemplars through `runNaturalExperiment()`

## Layer 3: Cross-Jurisdiction Panel
- [ ] 7. Connect OBG efficient frontier results to policy evaluations
  - Map each policy to its spending category
  - Use overspend ratio + efficient frontier position as evidence

## Aggregation
- [ ] 8. Build `aggregatePolicyEvidence()` meta-analysis function
  - Weight by: data quality, sample size, number of jurisdictions
  - Combine effect sizes across layers
  - Derive final evidence grade (A-F)

## Output
- [ ] 9. Generate `policy-evaluations.json` for web display
- [ ] 10. Update web page to show 3-layer evidence for each policy
- [ ] 11. Generate markdown report: `reports/policy-evaluations.md`

## Coordination Note
- Generic predictor/outcome explorer and outcome-level mega studies are tracked in:
  - `analysis-explorer-v1`
  - `web-integration-v2`
  - `jurisdiction-nof1-v1`

## Priority
Start with items 1-2 (types), then 4-5 (natural experiments — most impactful),
then 7-8 (aggregation). Layer 1 is already done.
