# Workflow

This repo uses Conductor tracks to keep context, specs, and plans in the repo. Keep changes small and reproducible.
Use the lightest process that still preserves context and reproducibility.

## Default Flow
1. Read product context: `.conductor/product.md` and `.conductor/product-guidelines.md`.
2. Read stack context: `.conductor/tech-stack.md`.
3. For multi-step work, use or create a track under `.conductor/tracks/` with `spec.md`, `plan.md`, and `metadata.json`.
4. Implement against the plan and keep outputs reproducible.
5. Update the track plan as tasks are completed when you are using a track.

## Engineering Standards
- Prefer pure functions in core libraries.
- Keep domain-agnostic code free of policy-specific language.
- Use Zod schemas for inputs/outputs where applicable.
- Add tests when you change logic or data parsing.
- Keep documentation updated when output formats change.

## Data Standards
- Prefer real data sources for public reports.
- Clearly label simulated or seeded datasets.
- Track data provenance and versioning for reproducibility.
