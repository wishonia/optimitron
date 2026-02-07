# Agent Delegation Guide

## Three-Tier Model

| Agent | Strengths | Cost | Best For |
|-------|-----------|------|----------|
| **Gemini CLI** | Free, unlimited, good at file generation | $0 | Datasets, boilerplate, refactors, simple analysis scripts |
| **Codex CLI** | Good coding, reads repo context | Low (ChatGPT credits) | Substantial code changes, multi-file edits, test writing |
| **Claude (subagent)** | Best reasoning, architecture | Highest | Analysis interpretation, architecture decisions, complex debugging |

## How to Delegate

### Gemini CLI (preferred for datasets + boilerplate)
```bash
cd /mnt/e/code/optomitron
gemini -p "Read .conductor/workflow.md, then .conductor/tracks/<track>/spec.md and plan.md. \
Pick the next unchecked item: <specific item>. \
Follow the data pattern in packages/data/src/datasets/us-drug-war.ts. \
Create the file, add export to index.ts, verify it builds with: pnpm --filter @optomitron/data run build" \
-y --output-format text
```

### Codex CLI (for code changes with tests)
```bash
cd /mnt/e/code/optomitron
codex exec "Read .conductor/tracks/<track>/spec.md and plan.md. \
Implement <specific task>. Write tests. Run pnpm check before finishing. \
Do NOT search the web — use your training data." --full-auto
```

### Claude Subagent (for analysis + interpretation)
Spawn via `sessions_spawn` with task pointing to the track:
```
Read .conductor/tracks/<track>/spec.md and plan.md.
Run analysis for <specific item>.
Send results to Mike on Telegram (target: 1762827333).
```

## Rules for All Agents
1. **One task per run** — don't combine unrelated work
2. **Read spec.md first** — understand the goal before coding
3. **Follow existing patterns** — look at similar files in the repo
4. **Build must pass** — `pnpm --filter @optomitron/<pkg> run build`
5. **No code without tests** (for Codex/Claude, not dataset generation)
6. **Commit with conventional commits** — `feat(data):`, `fix(optimizer):`, etc.
7. **Don't search the web for data** — use training knowledge, cite sources in JSDoc

## Dataset File Pattern
Every dataset in `packages/data/src/datasets/` follows this pattern:
```typescript
/**
 * Title and description
 * Sources: (with URLs)
 */
export interface DataPointType {
  year: number;
  /** Field description */
  fieldName: number;
  /** Nullable field (data starts later) */
  optionalField: number | null;
}

export const DATASET_NAME: DataPointType[] = [
  { year: 2000, fieldName: 1.0, optionalField: null },
  // ...
];
```

## Analysis Script Pattern
```typescript
import { runFullAnalysis, TimeSeries } from '@optomitron/optimizer';
import { DATASET_NAME } from '@optomitron/data';

function toTS(data: Array<{year: number; value: number}>, id: string, name: string): TimeSeries {
  return { variableId: id, variableName: name, unitName: 'units',
    measurements: data.map(d => ({ timestamp: new Date(`${d.year}-07-01`).getTime(), value: d.value })) };
}

// Convert, filter nulls, run analysis with onset 1yr / duration 3yr
```

## Monitoring
- Gemini progress: `~/.gemini/tmp/*/chats/session-*.json`
- Codex: background exec session — poll for output
- Claude subagents: `sessions_list` + `sessions_history`
