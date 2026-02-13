# Plan: Wire Library Outputs to Pages + JSON Schema (v2)

1. [ ] Define JSON schema for outcome hub ranking payload.
2. [ ] Define JSON schema for pair study payload.
3. [ ] Define JSON schema for jurisdiction N-of-1 summary payload.
4. [ ] Add route map and URL contract docs for:
   - `/outcomes/:outcomeId`
   - `/studies/:outcomeId/:predictorId`
   - `/studies/:outcomeId/:predictorId/jurisdictions/:jurisdictionId`
5. [ ] Implement web pages for the above routes.
6. [ ] Add provenance/freshness block shared component.
7. [ ] Add schema validation in build or CI.
8. [ ] Add end-to-end smoke test for explorer navigation flow.
