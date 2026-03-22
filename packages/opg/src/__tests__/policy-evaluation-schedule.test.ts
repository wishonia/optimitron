import { describe, it, expect } from 'vitest';
import {
  evaluateAgainstTargets,
  createDefaultEvaluationSchedule,
  PolicyEvaluationScheduleSchema,
  type WelfareTarget,
} from '../policy-evaluation-schedule.js';

describe('evaluateAgainstTargets', () => {
  const target: WelfareTarget = {
    expectedIncomeGrowthPpYear: 1.5,
    expectedHaleImprovementYears: 0.5,
    minimumIncomeGrowthPpYear: 0.75,
    minimumHaleImprovementYears: 0.25,
    targetYear: 2031,
  };

  it('returns continue when both targets fully met', () => {
    expect(evaluateAgainstTargets(
      { incomeGrowthPpYear: 2.0, haleImprovementYears: 0.8 },
      target,
    )).toBe('continue');
  });

  it('returns modify when minimum thresholds met but not full targets', () => {
    expect(evaluateAgainstTargets(
      { incomeGrowthPpYear: 1.0, haleImprovementYears: 0.3 },
      target,
    )).toBe('modify');
  });

  it('returns expire when below minimum thresholds', () => {
    expect(evaluateAgainstTargets(
      { incomeGrowthPpYear: 0.5, haleImprovementYears: 0.1 },
      target,
    )).toBe('expire');
  });

  it('returns expire when income meets but health fails minimum', () => {
    expect(evaluateAgainstTargets(
      { incomeGrowthPpYear: 2.0, haleImprovementYears: 0.1 },
      target,
    )).toBe('expire');
  });

  it('returns expire when health meets but income fails minimum', () => {
    expect(evaluateAgainstTargets(
      { incomeGrowthPpYear: 0.3, haleImprovementYears: 0.8 },
      target,
    )).toBe('expire');
  });

  it('returns continue when exactly at expected targets', () => {
    expect(evaluateAgainstTargets(
      { incomeGrowthPpYear: 1.5, haleImprovementYears: 0.5 },
      target,
    )).toBe('continue');
  });
});

describe('createDefaultEvaluationSchedule', () => {
  it('creates a valid schedule with correct defaults', () => {
    const schedule = createDefaultEvaluationSchedule(
      'military-reform-2026',
      { incomeEffect: 0.5, healthEffect: 1.2 },
      2026,
    );

    expect(schedule.policyId).toBe('military-reform-2026');
    expect(schedule.reviewCadence).toBe('biennial');
    expect(schedule.sunsetCondition).toBe('hard_sunset');
    expect(schedule.maxDurationYears).toBe(10);
    expect(schedule.firstReviewDate).toBe('2028-01-01');
    expect(schedule.baseline.measurementYear).toBe(2026);
    expect(schedule.dataCollectionMandates.length).toBe(3);
    expect(schedule.dataCollectionMandates.every(m => m.publicAccess)).toBe(true);

    // Targets should use the provided effects
    expect(schedule.targets[0]!.expectedIncomeGrowthPpYear).toBe(0.5);
    expect(schedule.targets[0]!.expectedHaleImprovementYears).toBe(1.2);
    // Minimums should be 50% of expected
    expect(schedule.targets[0]!.minimumIncomeGrowthPpYear).toBe(0.25);
    expect(schedule.targets[0]!.minimumHaleImprovementYears).toBe(0.6);
    expect(schedule.targets[0]!.targetYear).toBe(2031);
  });

  it('produces a schedule that validates against the Zod schema', () => {
    const schedule = createDefaultEvaluationSchedule(
      'test-policy',
      { incomeEffect: 1.0, healthEffect: 0.5 },
    );

    const result = PolicyEvaluationScheduleSchema.safeParse(schedule);
    expect(result.success).toBe(true);
  });
});
