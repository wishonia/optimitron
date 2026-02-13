# Plan: Universal Predictor-Outcome Explorer + Outcome Hubs (v1)

1. [x] Define `VariableRegistry` contract for predictors/outcomes.
   - Implemented in `@optomitron/data` via `src/variable-registry.ts` + tests.
   - Includes canonical ID, unit, welfare direction (for outcomes), transform defaults, lag defaults, and coverage metadata.
2. [ ] Define generic `PairStudyResult` schema for predictor/outcome pairs.
   - Include adaptive bin tables, optimal values, evidence metrics, and quality flags.
3. [ ] Build a reusable pair-analysis runner (global aggregate + jurisdiction support).
4. [ ] Define and implement outcome "mega study" ranking method.
   - Rank strongest predictors per outcome with confidence and false-discovery control.
5. [ ] Build outcome hub pages (`/outcomes/:outcomeId`) with sortable predictor rankings.
6. [ ] Build pair study pages (`/studies/:outcomeId/:predictorId`) with:
   - summary report
   - adaptive binning table(s)
   - optimal value section
   - evidence/diagnostics section
7. [ ] Add click-through navigation from outcome hubs to pair study pages.
8. [ ] Add link-outs from pair study pages to jurisdiction drilldown views.
9. [ ] Add precompute/caching strategy for heavy pair computations.
10. [ ] Add tests:
    - schema/contract tests
    - ranking correctness tests
    - route-level smoke tests
