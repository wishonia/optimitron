# Product Roadmap

## Principles

- Treaty is Sprint 1, not the permanent only task type.
- The product center of gravity is the ranked task loop:
  1. show the highest-value overdue tasks
  2. make delay cost obvious
  3. let people share the task
  4. let people contact the assignee
  5. track whether pressure moves the task forward
- The task foundation is already the main system:
  - `Task`
  - `Person`
  - `Organization`
  - impact frames / metrics / provenance
  - claims / edges / source artifacts
- Humor stays as framing. It is not a major implementation track.
- `Questionnaire`, referendums, and other civic systems should support tasks, not distract from them.
- Private tasks and agent-managed project tasks should use the same `Task` model with ownership and visibility, not a separate app.

## Now

### Ranked task loop

- Make `/tasks` the clearest entry into the product.
- Keep the top section focused on highest-value overdue accountability tasks.
- Ensure visible public tasks have:
  - clear assignee
  - quantified delay stats
  - share action
  - contact / push action
  - task detail page with sources and methodology

### Task detail as performance review

- Treat each task page as the assignee’s accountability page.
- Keep:
  - task ID
  - overdue / priority framing
  - assignee emphasis
  - parent-child hierarchy and breadcrumbs
  - acceptance criteria where useful
  - dynamic share image
- Add / maintain:
  - contact flow
  - milestone tracker with evidence
  - source and methodology display

### Treaty-first operations

- Keep `Ratify the 1% Treaty` as the canonical parent task.
- Keep per-leader signer tasks as child tasks.
- Seed / sync:
  - leaders
  - organizations
  - contact info
  - due dates
  - stable task keys
- Preserve the generalized impact import path so non-treaty quantified tasks can be added without schema changes.

### Private and agent-managed tasks

- Support owned private tasks in the same task system.
- Add authenticated CRUD and API/MCP support for owner-managed tasks.
- Keep ownership separate from assignee identity:
  - owner = `User`
  - accountable assignee = `Person` / `Organization`

## Next

- Backlog browser for quantified non-treaty tasks
- Promotion rules for moving backlog tasks into the active spotlight
- Better treaty signer sync and roster maintenance
- Agent/MCP task management surface for owned tasks
- Broader task views and filters for different operator roles

## Later

- Board / kanban parody
- Timeline / Gantt views
- Burndown charts and sprint parody chrome
- Broader gamified civics surfaces that do not directly improve the task loop
- Embeddable widgets
- Multi-language support
- Push notifications keyed to milestone progress

## Done / Landed Foundations

- Person-centered task schema with organization targeting
- Task impact frames, metrics, and provenance
- Task share buttons and dynamic task OG images
- Accountability delay counters on task list/detail pages
- Treaty policy-model import path
- Production migration automation in CI
- Schema usage audit tooling

## Tracking

- This file is the canonical roadmap.
- GitHub issues and projects should mirror `Now`, `Next`, and `Later`.
- Avoid adding roadmap items that do not directly improve:
  - conversion into the ranked task list
  - sharing
  - pressure on assignees
  - trust in the quantified model
  - future generalized task ranking
