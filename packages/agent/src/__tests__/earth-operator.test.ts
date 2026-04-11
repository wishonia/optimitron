import { describe, expect, it, vi } from 'vitest';
import {
  createGenericTaskPlanner,
  createTreatyTaskPlanner,
  planNextEarthOperatorStep,
  selectEarthTaskPlanner,
  type EarthOperatorAgentProfile,
  type EarthOperatorTask,
} from '../earth-operator.js';
import type { TaskOperatorRuntimeAdapters } from '../task-runtime.js';

const baseAgent: EarthOperatorAgentProfile = {
  agentId: 'earth_agent',
  channels: ['email', 'research', 'manual-review'],
  interestTags: ['health', 'governance'],
  mode: 'dry-run',
  skillTags: ['research', 'policy'],
};

function createAdapters(
  task: EarthOperatorTask,
  overrides: Partial<TaskOperatorRuntimeAdapters<EarthOperatorTask>> = {},
): TaskOperatorRuntimeAdapters<EarthOperatorTask> {
  return {
    acquireLease: vi.fn(async () => ({
      acquired: true,
      leaseExpiresAt: '2026-04-10T12:15:00.000Z',
      leaseId: 'lease_earth',
    })),
    getNextTask: vi.fn(async () => task),
    logAgentRun: vi.fn(async () => undefined),
    releaseLease: vi.fn(async () => undefined),
    ...overrides,
  };
}

describe('selectEarthTaskPlanner', () => {
  it('selects the treaty planner for treaty tasks', () => {
    const task: EarthOperatorTask = {
      id: 'task_treaty',
      status: 'ACTIVE',
      taskKey: 'program:one-percent-treaty:signer:us:support:contact-office',
      title: 'Contact the US office',
    };

    const planner = selectEarthTaskPlanner({
      planners: [createTreatyTaskPlanner(), createGenericTaskPlanner()],
      task,
    });

    expect(planner?.id).toBe('treaty');
  });

  it('respects the planner allowlist', () => {
    const task: EarthOperatorTask = {
      id: 'task_treaty',
      status: 'ACTIVE',
      taskKey: 'program:one-percent-treaty:signer:us:support:contact-office',
      title: 'Contact the US office',
    };

    const planner = selectEarthTaskPlanner({
      allowedPlannerIds: ['generic-manual-review'],
      planners: [createTreatyTaskPlanner(), createGenericTaskPlanner()],
      task,
    });

    expect(planner?.id).toBe('generic-manual-review');
  });
});

describe('planNextEarthOperatorStep', () => {
  it('routes treaty tasks through the treaty planner', async () => {
    const task: EarthOperatorTask = {
      contactUrl: 'https://www.whitehouse.gov/contact/',
      countryCode: 'US',
      countryName: 'United States',
      estimatedEffortHours: 0.25,
      id: 'task_treaty',
      impact: {
        delayDalysLostPerDay: 10000,
        delayEconomicValueUsdLostPerDay: 500000000,
        expectedValuePerHourDalys: 2500,
        expectedValuePerHourUsd: 120000000,
      },
      skillTags: ['policy'],
      status: 'ACTIVE',
      taskKey: 'program:one-percent-treaty:signer:us:support:contact-office',
      title: 'Contact the President of the United States about the 1% Treaty',
    };
    const adapters = createAdapters(task, {
      checkContactCooldown: vi.fn(async () => ({ allowed: true })),
    });

    const result = await planNextEarthOperatorStep({
      adapters,
      agent: baseAgent,
    });

    expect(result.status).toBe('planned');
    if (result.status !== 'planned') {
      throw new Error('expected a planned result');
    }
    expect(result.plan.plannerId).toBe('treaty');
    expect(result.plan.channel).toBe('email');
    expect(result.plan.taskKind).toBe('contact-office');
  });

  it('falls back to a generic manual-review plan for non-treaty tasks', async () => {
    const task: EarthOperatorTask = {
      description: 'Write the implementation brief and identify the first blocker to remove.',
      estimatedEffortHours: 2,
      id: 'task_generic',
      impact: {
        delayEconomicValueUsdLostPerDay: 2500000,
        expectedValuePerHourUsd: 450000,
      },
      sourceUrls: ['https://optimitron.com/docs/system'],
      status: 'ACTIVE',
      title: 'Draft the deployment plan for the compute scheduler',
    };
    const adapters = createAdapters(task);

    const result = await planNextEarthOperatorStep({
      adapters,
      agent: {
        ...baseAgent,
        allowedPlannerIds: ['generic-manual-review'],
      },
    });

    expect(result.status).toBe('planned');
    if (result.status !== 'planned') {
      throw new Error('expected a planned result');
    }
    expect(result.plan.plannerId).toBe('generic-manual-review');
    expect(result.plan.channel).toBe('manual-review');
    expect(result.plan.draft?.references).toContain('https://optimitron.com/docs/system');
  });

  it('skips when no registered planner is allowed for the task', async () => {
    const task: EarthOperatorTask = {
      id: 'task_generic',
      status: 'ACTIVE',
      title: 'Unroutable task',
    };
    const adapters = createAdapters(task);

    const result = await planNextEarthOperatorStep({
      adapters,
      agent: {
        ...baseAgent,
        allowedPlannerIds: ['nonexistent-planner'],
      },
      planners: [createTreatyTaskPlanner()],
    });

    expect(result.status).toBe('skipped');
    if (result.status !== 'skipped') {
      throw new Error('expected a skipped result');
    }
    expect(result.reason).toContain('No registered planner supports');
  });
});
