import {
  planNextTaskOperatorStep,
  type RuntimePlan,
  type RuntimeTask,
  type TaskOperatorRuntimeAdapters,
  type TaskPlannerInput,
  type TaskPlannerResult,
  type TaskRuntimeAgentProfile,
  type TaskRuntimeResult,
} from './task-runtime.js';
import {
  selectNextTreatyAction,
  type TreatyExecutionMode,
  type TreatyOperatorExecutionRecord,
  type TreatyOperatorPolicy,
  type TreatyOperatorTask,
} from './treaty-operator.js';

export interface EarthOperatorImpact {
  delayDalysLostPerDay?: number | null;
  delayEconomicValueUsdLostPerDay?: number | null;
  expectedValuePerHourDalys?: number | null;
  expectedValuePerHourUsd?: number | null;
}

export interface EarthOperatorTask extends RuntimeTask {
  activeClaimCount?: number | null;
  blockedByTaskIds?: string[];
  category?: string | null;
  claimPolicy?: string | null;
  contactTemplate?: string | null;
  contactUrl?: string | null;
  contextJson?: Record<string, unknown> | null;
  countryCode?: string | null;
  countryName?: string | null;
  description?: string | null;
  difficulty?: string | null;
  dueAt?: Date | string | null;
  estimatedEffortHours?: number | null;
  impact?: EarthOperatorImpact | null;
  interestTags?: string[];
  maxClaims?: number | null;
  programKey?: string | null;
  roleTitle?: string | null;
  skillTags?: string[];
  sourceUrls?: string[];
  status?: string | null;
  taskKey?: string | null;
}

export interface EarthExecutionDraft {
  body: string;
  references: string[];
  subject: string;
}

export interface EarthExecutionPlan extends RuntimePlan {
  draft?: EarthExecutionDraft | null;
  estimatedEffortHours?: number | null;
  guardrails: string[];
  mode: TreatyExecutionMode | 'manual-review';
  plannerId: string;
  taskKind: string;
  whyNow: string[];
}

export interface EarthOperatorAgentProfile extends TaskRuntimeAgentProfile {
  allowedCountryCodes?: string[];
  allowedPlannerIds?: string[];
  channels: string[];
  executions?: TreatyOperatorExecutionRecord[];
  maxDailyLiveActions?: number | null;
  mode?: TreatyExecutionMode | 'manual-review' | null;
  requiresHumanReview?: boolean;
}

export interface EarthTaskPlanner {
  id: string;
  matches(task: EarthOperatorTask): boolean;
  plan(input: {
    agent: EarthOperatorAgentProfile;
    now: Date;
    task: EarthOperatorTask;
  }): TaskPlannerResult<EarthExecutionPlan>;
}

export interface PlanNextEarthOperatorStepInput {
  adapters: TaskOperatorRuntimeAdapters<EarthOperatorTask>;
  agent: EarthOperatorAgentProfile;
  now?: Date;
  planners?: EarthTaskPlanner[];
  treatyPolicy?: Partial<TreatyOperatorPolicy>;
}

function formatUsd(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return 'unknown';
  }

  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    notation: Math.abs(value) >= 1000 ? 'compact' : 'standard',
    style: 'currency',
  }).format(value);
}

function normalizeMode(mode: EarthOperatorAgentProfile['mode']): TreatyExecutionMode {
  if (mode === 'auto' || mode === 'human-review') {
    return mode;
  }

  return 'dry-run';
}

function isTreatyTask(task: EarthOperatorTask) {
  const taskKey = task.taskKey ?? '';
  const programKey = task.programKey ?? '';

  return (
    taskKey.includes('one-percent-treaty') ||
    programKey.includes('one-percent-treaty') ||
    typeof task.contextJson?.['treatySignerSlot'] === 'object'
  );
}

function buildGenericDraft(task: EarthOperatorTask) {
  const references = [...(task.sourceUrls ?? []), task.contactUrl ?? ''].filter(Boolean);

  return {
    body: [
      `Task: ${task.title}.`,
      task.description?.trim() ?? 'Summarize the objective, blockers, and concrete next action.',
      `Expected value per hour: ${formatUsd(task.impact?.expectedValuePerHourUsd)}.`,
      `Delay cost per day: ${formatUsd(task.impact?.delayEconomicValueUsdLostPerDay)}.`,
    ].join(' '),
    references,
    subject: `Execution brief: ${task.title}`,
  } satisfies EarthExecutionDraft;
}

export function createTreatyTaskPlanner(input?: {
  policy?: Partial<TreatyOperatorPolicy>;
}): EarthTaskPlanner {
  return {
    id: 'treaty',
    matches(task) {
      return isTreatyTask(task);
    },
    plan({ agent, now, task }) {
      const decision = selectNextTreatyAction({
        capabilities: {
          allowedCountryCodes: agent.allowedCountryCodes,
          channels: agent.channels as never[],
          maxDailyLiveActions: agent.maxDailyLiveActions ?? null,
          maxTaskDifficulty: agent.maxTaskDifficulty ?? null,
          mode: normalizeMode(agent.mode),
          requiresHumanReview: agent.requiresHumanReview,
          skillTags: agent.skillTags,
        },
        executions: agent.executions ?? [],
        now,
        policy: input?.policy,
        tasks: [task as TreatyOperatorTask],
      });

      if (decision.selectedPlan === null) {
        return {
          plan: null,
          summary: decision.summary,
        };
      }

      return {
        plan: {
          channel: decision.selectedPlan.channel,
          draft: decision.selectedPlan.draft,
          estimatedEffortHours: decision.selectedPlan.estimatedEffortHours,
          guardrails: decision.selectedPlan.guardrails,
          mode: decision.selectedPlan.mode,
          plannerId: 'treaty',
          summary: decision.selectedPlan.title,
          taskKind: decision.selectedPlan.kind,
          whyNow: decision.selectedPlan.whyNow,
        },
        summary: decision.summary,
      };
    },
  };
}

export function createGenericTaskPlanner(): EarthTaskPlanner {
  return {
    id: 'generic-manual-review',
    matches() {
      return true;
    },
    plan({ agent, task }) {
      const guardrails = [
        'Do not execute irreversible actions without human review or a program-specific planner.',
        'Cite sources before sending outreach or publishing claims.',
      ];
      const whyNow = [
        `Expected value per hour: ${formatUsd(task.impact?.expectedValuePerHourUsd)}.`,
        `Delay cost per day: ${formatUsd(task.impact?.delayEconomicValueUsdLostPerDay)}.`,
      ];

      return {
        plan: {
          channel: 'manual-review',
          draft: buildGenericDraft(task),
          estimatedEffortHours: task.estimatedEffortHours ?? null,
          guardrails,
          mode: agent.requiresHumanReview ? 'human-review' : 'manual-review',
          plannerId: 'generic-manual-review',
          summary: task.title,
          taskKind: task.category ?? 'generic',
          whyNow,
        },
        summary: `Prepared a generic execution brief for ${task.title}.`,
      };
    },
  };
}

export function getDefaultEarthTaskPlanners(input?: {
  treatyPolicy?: Partial<TreatyOperatorPolicy>;
}) {
  return [createTreatyTaskPlanner({ policy: input?.treatyPolicy }), createGenericTaskPlanner()];
}

export function selectEarthTaskPlanner(input: {
  allowedPlannerIds?: string[];
  planners: EarthTaskPlanner[];
  task: EarthOperatorTask;
}) {
  const allowlist = input.allowedPlannerIds?.length
    ? new Set(input.allowedPlannerIds.map((plannerId) => plannerId.trim()).filter(Boolean))
    : null;

  return (
    input.planners.find((planner) => {
      if (allowlist !== null && !allowlist.has(planner.id)) {
        return false;
      }

      return planner.matches(input.task);
    }) ?? null
  );
}

export async function planNextEarthOperatorStep(
  input: PlanNextEarthOperatorStepInput,
): Promise<TaskRuntimeResult<EarthOperatorTask, EarthExecutionPlan>> {
  const planners = input.planners ?? getDefaultEarthTaskPlanners({ treatyPolicy: input.treatyPolicy });

  return planNextTaskOperatorStep<EarthOperatorTask, EarthExecutionPlan>({
    adapters: input.adapters,
    agent: input.agent,
    now: input.now,
    planner: ({ now, task }: TaskPlannerInput<EarthOperatorTask>) => {
      const planner = selectEarthTaskPlanner({
        allowedPlannerIds: input.agent.allowedPlannerIds,
        planners,
        task,
      });

      if (planner === null) {
        return {
          plan: null,
          summary: `No registered planner supports ${task.title}.`,
        };
      }

      return planner.plan({
        agent: input.agent,
        now,
        task,
      });
    },
  });
}
