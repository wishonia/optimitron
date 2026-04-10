# Task Model

This document defines the invariants for the task system. If a future change violates these rules, it should be treated as a schema or architecture change, not a routine feature edit.

## Core Identity

- `Person` is the canonical human record.
- `User` is an authenticated account that may link to a `Person` through `User.personId`.
- A `Person` may exist without any `User`. This is how public figures and non-signed-up assignees are represented.
- `Person.sourceRef` is the stable import key for non-email identities. It must be unique when present.

## Task Ownership

- `Task` is the only execution node. Do not introduce separate “objective”, “mission”, or “policy task” tables unless the task abstraction has clearly failed.
- `Task.assigneePersonId` points to the human the task is addressed to, if any.
- `Task.assigneeOrganizationId` points to the institution the task is addressed to, if any.
- A task may point to neither, one, or both. This covers pure public work, institution-addressed work, and person-in-institution accountability work.
- `Task.assigneeAffiliationSnapshot` is task-local snapshot data. It is not the live source of truth for a person’s current affiliation.
- `Person.currentAffiliation` is actor metadata. It may change over time.
- `Task.roleTitle` is task-facing display context, not a durable office-seat model.
- `Organization.sourceRef` is the stable import key for institution identities when present.

## Claimability

- `ASSIGNED_ONLY`: public accountability item, not claimable by other users.
- `OPEN_SINGLE`: claimable, but only one active claimant at a time.
- `OPEN_MANY`: claimable by multiple users at once, optionally capped by `maxClaims`.

## Task Lifecycle

Task status is intentionally narrow:

- `DRAFT`: not yet live
- `ACTIVE`: available or pending
- `VERIFIED`: accepted as complete
- `STALE`: superseded by source or no longer current

There is no separate long-lived `COMPLETED` task state. Completion that matters publicly should end in `VERIFIED`.

## Deadlines

- `Task.dueAt` is the first-class accountability deadline / target date field.
- Ranking logic may use `dueAt`, but the schema does not force any particular overdue formula.
- If a task needs a soft, explanatory date without query semantics, keep it in `contextJson` instead.

## Claim Lifecycle

Claim status is more expressive than task status because claims represent user workflow:

- `CLAIMED`
- `IN_PROGRESS`
- `COMPLETED`
- `VERIFIED`
- `REJECTED`
- `ABANDONED`

Current public workflow is primarily:

- `CLAIMED -> COMPLETED -> VERIFIED`

`ABANDONED` and `REJECTED` exist so claims can be released or reviewed without deleting history.

## Provenance

- `TaskSourceArtifact` describes where the task came from.
- `TaskImpactSourceArtifact` describes where the impact estimate came from.
- These are intentionally separate. Do not collapse them.
- `SourceArtifact.sourceKey` is the canonical upstream artifact identity.

## Impact Estimates

- `Task.currentImpactEstimateSetId` is the canonical pointer to the estimate currently used by APIs and ranking.
- `TaskImpactEstimateSet.isCurrent` is denormalized query state and must stay in sync with the task pointer.
- `TaskImpactFrameEstimate` stores frame-specific rolled-up values.
- `TaskImpactMetric` stores extensible per-frame metrics that should not force schema churn.

## Ranking Semantics

- The schema stores impact channels and fit inputs.
- The schema does not freeze ranking formulas.
- DALY-vs-USD weighting belongs in application logic, not schema.

## When To Add New Fields

Add a first-class column only if one of these is true:

- the value is part of a stable invariant
- the value is used for filtering, joining, or uniqueness
- the value must be queried often enough that hiding it in JSON is a mistake

Otherwise prefer:

- `contextJson` for task-local structured details
- `TaskImpactMetric` for new impact outputs
- `SourceArtifact.payloadJson` for upstream artifact payloads
