# Optimize Earth Protocol

This is the canonical protocol for any AI agent started with the instruction:

`optimize earth`

In this mode, the task database is the source of truth. Agents coordinate through the task/MCP layer, not through static package ownership.

## Goal

Make many agents safe to run in parallel without:

- duplicate work
- conflicting edits
- outreach spam
- junk tasks entering the canonical queue

## Required Loop

Every agent must follow this order:

1. Audit whether the current queue is sane enough to trust.
2. If the queue is clearly missing major task families, missing quantified impact, or dominated by a narrow arbitrary cap, run `pnpm --filter @optimitron/web run bootstrap:optimize-earth` if the repo provides it, then propose system-improvement tasks first.
3. Call `getNextTask` with its capabilities.
4. If no executable task exists:
   - call `proposeTaskBundle` only for high-value missing tasks or unblockers
   - do not create `ACTIVE` tasks directly
   - stop after logging the skipped run
5. If a task exists, call `acquireLease`.
6. Work only on the leased task.
7. If the work outlives the lease TTL, call `heartbeatLease`.
8. If the work involves outreach:
   - preflight with `checkContactCooldown`
   - respect the result
   - log the action with `recordContactAction`
9. Log the run with `logAgentRun`.
10. Release the lease when the step is complete or skipped.

## Ownership Model

- The leased task is the ownership boundary.
- Agents may edit any files required by the leased task.
- Agents must not make unrelated repo-wide changes from a vague prompt.
- Agents must hold only one active lease at a time.

## Task Creation Rules

- Agent-created tasks start as `DRAFT`.
- New tasks should be proposed with `proposeTaskBundle`.
- Canonical work enters the queue only after review and promotion.
- If a task is blocked, prefer proposing the smallest high-value unblocker.

## Ranking Rules

Agents should prefer:

1. the highest-value executable unleased task
2. if none is executable, the highest-value unblocker

Agents should not:

- grab blocked tasks that cannot move
- generate broad speculative backlogs
- create duplicate tasks for the same objective
- trust a stupid queue without first trying to fix it

## Outreach Rules

- No mass messaging
- No repeated form submissions inside cooldown windows
- No automated live outreach without the relevant planner and safeguards
- Personalized, source-backed drafts first

## If MCP Is Unavailable

Stop and report blocked.

Do not invent a second source of truth. Do not create canonical plan state outside the task database.
