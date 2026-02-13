# Track Spec: Universal Predictor-Outcome Explorer + Outcome Hubs (v1)

## Background
Current analysis outputs are report-specific and mostly precomputed around selected scenarios. Product direction now requires a general explorer where users can choose any predictor/outcome pair, inspect causal evidence, and navigate between global and jurisdiction-level evidence.

## Objective
Ship a web-native explorer with:
- A universal predictor/outcome selector.
- Outcome hub pages ranking strongest predictors ("mega studies").
- Pair study pages with global aggregate evidence and jurisdiction N-of-1 drilldowns.

## Scope
- Variable registry for predictors and outcomes (IDs, units, directionality, valid transforms, lag windows, coverage).
- Generic pair-analysis contract and reusable report payload.
- Outcome-level ranking methodology with uncertainty controls.
- Cross-linking navigation:
  - Outcome hub -> pair study
  - Pair study -> jurisdiction N-of-1 detail
  - Pair study -> related outcomes and predictors

## Deliverables
- `VariableRegistry` schema and source map.
- Pair-analysis output schema including:
  - adaptive binning tables
  - optimal value estimates and uncertainty bands
  - evidence metrics and data coverage diagnostics
- Outcome hub ranking schema and renderer.
- Study-page route and deep-linking conventions.

## Acceptance Criteria
- Any predictor/outcome in the registry can render a study payload without custom code paths.
- Outcome hubs rank predictors with effect size, confidence, and multiple-testing-adjusted significance.
- Users can click from an outcome ranking row to a predictor/outcome study page.
- Study pages expose both global aggregate and jurisdiction N-of-1 evidence summaries.

## Risks
- Sparse pair coverage can yield unstable rankings without adequate quality thresholds.
- Multiple comparison risk can create misleading "top predictors" if corrections are omitted.
- Runtime generation cost may be high without precompute/caching strategy.
