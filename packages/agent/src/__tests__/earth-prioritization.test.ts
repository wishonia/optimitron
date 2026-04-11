import { describe, expect, it } from 'vitest';
import {
  classifyEarthTaskFamily,
  evaluateEarthTaskQueue,
  reviewEarthQueueAndBuildSystemImprovements,
} from '../earth-prioritization.js';
import type { EarthOperatorTask } from '../earth-operator.js';

describe('earth prioritization', () => {
  it('classifies treaty supporter families correctly', () => {
    expect(
      classifyEarthTaskFamily({
        category: 'COMMUNICATION',
        taskKey: 'program:one-percent-treaty:signer:dz:support:publish-explainer',
        title: "Publish Algeria's treaty explainer",
      }),
    ).toBe('treaty-support-explainer');
  });

  it('classifies page-leverage system tasks as growth/conversion work', () => {
    expect(
      classifyEarthTaskFamily({
        category: 'OTHER',
        taskKey: 'system:optimize-earth:weaponize-overdue-task-list',
        title: 'Turn the overdue leader task list into a memetic share-and-pressure machine',
      }),
    ).toBe('growth-conversion');
  });

  it('classifies system contact discovery tasks correctly', () => {
    expect(
      classifyEarthTaskFamily({
        category: 'OTHER',
        taskKey: 'system:optimize-earth:discover-country-journalist-and-coalition-targets',
        title: 'Discover country-specific journalists and coalition targets from the actual treaty queue',
      }),
    ).toBe('contact-discovery');
  });

  it('flags a narrow top-20 treaty queue as system-improvement-worthy', () => {
    const tasks: EarthOperatorTask[] = Array.from({ length: 20 }, (_, index) => ({
      category: 'COMMUNICATION',
      estimatedEffortHours: 1,
      id: `task_${index}`,
      impact: {
        delayEconomicValueUsdLostPerDay: 0,
        expectedValuePerHourUsd: 0,
      },
      status: 'ACTIVE',
      taskKey: `program:one-percent-treaty:signer:cc${index}:support:publish-explainer`,
      title: `Publish country explainer ${index}`,
    }));

    const audit = evaluateEarthTaskQueue(tasks);

    expect(audit.systemImprovementPriority).toBe('critical');
    expect(audit.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'impact-coverage-too-low',
        'missing-growth-conversion',
        'missing-system-improvement',
        'queue-too-concentrated',
      ]),
    );
  });

  it('builds reviewed system-improvement proposals when the queue is stupid', () => {
    const tasks: EarthOperatorTask[] = [
      {
        category: 'COMMUNICATION',
        estimatedEffortHours: 1,
        id: 'treaty_publish_dz',
        impact: {
          delayEconomicValueUsdLostPerDay: 0,
          expectedValuePerHourUsd: 0,
        },
        status: 'ACTIVE',
        taskKey: 'program:one-percent-treaty:signer:dz:support:publish-explainer',
        title: "Publish Algeria's treaty explainer",
      },
      {
        category: 'COMMUNICATION',
        estimatedEffortHours: 1,
        id: 'treaty_publish_tr',
        impact: {
          delayEconomicValueUsdLostPerDay: 0,
          expectedValuePerHourUsd: 0,
        },
        status: 'ACTIVE',
        taskKey: 'program:one-percent-treaty:signer:tr:support:publish-explainer',
        title: "Publish Türkiye's treaty explainer",
      },
    ];

    const result = reviewEarthQueueAndBuildSystemImprovements(tasks);

    expect(result.audit.systemImprovementPriority).toBe('critical');
    expect(result.roots[0]?.title).toBe('Improve the Optimize Earth task-selection system');
    expect(result.proposal.review.promotableCount).toBeGreaterThan(0);
    expect(result.proposal.candidates.map((candidate) => candidate.taskKey)).toEqual(
      expect.arrayContaining([
        'system:optimize-earth:improve-queue',
        'system:optimize-earth:propagate-downstream-impact',
        'system:optimize-earth:generate-growth-conversion-tasks',
      ]),
    );
  });
});
