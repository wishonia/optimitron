import { describe, expect, it } from 'vitest';
import { reviewTaskProposalBundle } from '../task-governance.js';

const treatySupportTask = {
  assigneeOrganizationId: 'org_us_gov',
  blockerRefs: [],
  contactUrl: 'https://www.whitehouse.gov/contact/',
  description:
    'Send one evidence-based message to the office, link the accountability page, and log any response for milestone review.',
  estimatedEffortHours: 0.25,
  id: 'draft_contact_us',
  impact: {
    delayDalysLostPerDay: 12000,
    delayEconomicValueUsdLostPerDay: 580000000,
    expectedValuePerHourDalys: 3200,
    expectedValuePerHourUsd: 145000000,
  },
  isPublic: true,
  roleTitle: 'President',
  sourceUrls: ['https://optimitron.com/tasks/task_us', 'https://www.whitehouse.gov/contact/'],
  status: 'DRAFT',
  taskKey: 'program:one-percent-treaty:signer:us:support:contact-office',
  title: 'Contact the President of the United States about the 1% Treaty',
} as const;

describe('reviewTaskProposalBundle', () => {
  it('approves a well-formed treaty supporter task for promotion review', () => {
    const review = reviewTaskProposalBundle({
      candidates: [treatySupportTask],
    });

    expect(review.promotableCount).toBe(1);
    expect(review.decisions[0]?.promotable).toBe(true);
    expect(review.decisions[0]?.issues).toHaveLength(0);
    expect(review.decisions[0]?.evaluation.qualityScore).toBeGreaterThan(0.35);
  });

  it('rejects public tasks with missing source URLs and missing assignee context', () => {
    const review = reviewTaskProposalBundle({
      candidates: [
        {
          ...treatySupportTask,
          assigneeOrganizationId: null,
          contactUrl: null,
          roleTitle: null,
          sourceUrls: [],
          taskKey: 'program:one-percent-treaty:signer:us:support:publish-explainer',
          title: 'Publish an explainer for the US signer task',
        },
      ],
    });

    expect(review.promotableCount).toBe(0);
    expect(review.decisions[0]?.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['missing-assignee-context', 'missing-source-urls']),
    );
  });

  it('rejects duplicate task keys and duplicate-equivalent tasks', () => {
    const review = reviewTaskProposalBundle({
      candidates: [treatySupportTask],
      existingTasks: [
        {
          assigneeOrganizationId: 'org_us_gov',
          id: 'existing_task',
          roleTitle: 'President',
          taskKey: treatySupportTask.taskKey,
          title: treatySupportTask.title,
        },
      ],
    });

    expect(review.promotableCount).toBe(0);
    expect(review.decisions[0]?.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['duplicate-task-key', 'duplicate-fingerprint']),
    );
  });

  it('rejects blocker cycles and unknown blockers', () => {
    const review = reviewTaskProposalBundle({
      candidates: [
        {
          ...treatySupportTask,
          blockerRefs: ['draft_evidence_us'],
        },
        {
          ...treatySupportTask,
          blockerRefs: ['draft_contact_us', 'missing_ref'],
          contactUrl: null,
          id: 'draft_evidence_us',
          taskKey: 'program:one-percent-treaty:signer:us:support:track-evidence',
          title: 'Track US treaty evidence',
        },
      ],
    });

    expect(review.promotableCount).toBe(0);
    expect(review.decisions[0]?.issues.map((issue) => issue.code)).toContain('cyclic-blockers');
    expect(review.decisions[1]?.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['cyclic-blockers', 'unknown-blocker']),
    );
  });

  it('warns when an agent proposal tries to start active', () => {
    const review = reviewTaskProposalBundle({
      candidates: [
        {
          ...treatySupportTask,
          status: 'ACTIVE',
          taskKey: 'program:one-percent-treaty:signer:us:support:secure-endorsement',
          title: 'Secure one US endorsement for the 1% Treaty',
        },
      ],
    });

    expect(review.promotableCount).toBe(1);
    expect(review.decisions[0]?.issues.map((issue) => issue.code)).toContain(
      'agent-proposals-should-start-draft',
    );
  });

  it('rejects low-quality proposals below the promotion threshold', () => {
    const review = reviewTaskProposalBundle({
      candidates: [
        {
          ...treatySupportTask,
          estimatedEffortHours: 10,
          impact: {
            delayDalysLostPerDay: 1,
            delayEconomicValueUsdLostPerDay: 10,
            expectedValuePerHourDalys: 1,
            expectedValuePerHourUsd: 25,
          },
          taskKey: 'program:one-percent-treaty:signer:us:support:weak-proposal',
          title: 'Weak low-value proposal',
        },
      ],
    });

    expect(review.promotableCount).toBe(0);
    expect(review.decisions[0]?.issues.map((issue) => issue.code)).toContain(
      'quality-below-threshold',
    );
  });

  it('rejects oversized proposal bundles', () => {
    const review = reviewTaskProposalBundle({
      candidates: Array.from({ length: 13 }, (_, index) => ({
        ...treatySupportTask,
        id: `draft_contact_${index}`,
        taskKey: `program:one-percent-treaty:signer:us:support:contact-office:${index}`,
        title: `Contact bundle task ${index}`,
      })),
    });

    expect(review.promotableCount).toBe(0);
    expect(review.decisions.every((decision) => decision.issues.some((issue) => issue.code === 'bundle-too-large'))).toBe(true);
  });
});
