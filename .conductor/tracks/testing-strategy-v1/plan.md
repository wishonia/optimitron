# Plan: Hypothesis-Driven Tests for Findings (v1)

1. [x] Define a `HypothesisTestCase` format and helpers.
2. [x] Add tests for partial correlation confounds (GDP example).
3. [x] Add tests for minimum effective spending logic.
4. [x] Add tests for policy scoring and evidence grades.
5. [ ] Add a report-to-tests mapping table in `reports/`.
6. [x] Add tests for adaptive binning and report output contracts.
   - `@optomitron/optimizer`: adaptive binning unit tests.
   - `@optomitron/examples`: assertions for low-spending `% GDP` tiers and per-capita PPP tier output.
