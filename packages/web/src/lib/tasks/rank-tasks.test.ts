import {
  TaskClaimPolicy,
  TaskDifficulty,
  TaskImpactFrameKey,
  TaskStatus,
} from "@optimitron/db";
import { describe, expect, it } from "vitest";
import {
  canTaskAcceptMoreClaims,
  rankTasksForUser,
  scoreTaskForAccountability,
  scoreTaskForUser,
} from "./rank-tasks";

describe("rankTasksForUser", () => {
  const user = {
    availableHoursPerWeek: 5,
    interestTags: ["tobacco-policy", "public-health"],
    maxTaskDifficulty: TaskDifficulty.INTERMEDIATE,
    skillTags: ["writing", "spanish"],
  };

  const strongFitTask = {
    activeClaimCount: 0,
    claimPolicy: TaskClaimPolicy.OPEN_SINGLE,
    difficulty: TaskDifficulty.BEGINNER,
    estimatedEffortHours: 2,
    interestTags: ["tobacco-policy"],
    maxClaims: null,
    selectedImpactFrame: {
      annualDiscountRate: 0.03,
      adoptionRampYears: 1,
      benefitDurationYears: 20,
      customFrameLabel: null,
      delayDalysLostPerDayBase: 15,
      delayDalysLostPerDayHigh: 25,
      delayDalysLostPerDayLow: 10,
      delayEconomicValueUsdLostPerDayBase: 1_000_000,
      delayEconomicValueUsdLostPerDayHigh: 2_000_000,
      delayEconomicValueUsdLostPerDayLow: 500_000,
      estimatedCashCostUsdBase: 10,
      estimatedCashCostUsdHigh: 20,
      estimatedCashCostUsdLow: 5,
      estimatedEffortHoursBase: 2,
      estimatedEffortHoursHigh: 3,
      estimatedEffortHoursLow: 1,
      evaluationHorizonYears: 20,
      expectedDalysAvertedBase: 50_000,
      expectedDalysAvertedHigh: 75_000,
      expectedDalysAvertedLow: 25_000,
      expectedEconomicValueUsdBase: 100_000_000,
      expectedEconomicValueUsdHigh: 150_000_000,
      expectedEconomicValueUsdLow: 50_000_000,
      frameKey: TaskImpactFrameKey.TWENTY_YEAR,
      frameSlug: "twenty-year",
      medianHealthyLifeYearsEffectBase: 0.5,
      medianHealthyLifeYearsEffectHigh: 0.7,
      medianHealthyLifeYearsEffectLow: 0.2,
      medianIncomeGrowthEffectPpPerYearBase: 0.2,
      medianIncomeGrowthEffectPpPerYearHigh: 0.3,
      medianIncomeGrowthEffectPpPerYearLow: 0.1,
      metrics: [],
      successProbabilityBase: 0.3,
      successProbabilityHigh: 0.5,
      successProbabilityLow: 0.1,
      summaryStatsJson: null,
      timeToImpactStartDays: 30,
    },
    skillTags: ["writing"],
    status: TaskStatus.ACTIVE,
  };

  const weakFitTask = {
    activeClaimCount: 0,
    claimPolicy: TaskClaimPolicy.OPEN_SINGLE,
    difficulty: TaskDifficulty.ADVANCED,
    estimatedEffortHours: 8,
    interestTags: ["defi"],
    maxClaims: null,
    selectedImpactFrame: {
      ...strongFitTask.selectedImpactFrame,
      delayDalysLostPerDayBase: 0.1,
      delayEconomicValueUsdLostPerDayBase: 100,
      estimatedCashCostUsdBase: 500,
      estimatedEffortHoursBase: 8,
      expectedDalysAvertedBase: 10,
      expectedEconomicValueUsdBase: 1_000,
    },
    skillTags: ["solidity"],
    status: TaskStatus.ACTIVE,
  };

  it("scores stronger overlaps above weak fits", () => {
    expect(scoreTaskForUser(strongFitTask, user)).toBeGreaterThan(0.3);
    expect(scoreTaskForUser(weakFitTask, user)).toBeLessThan(0.2);

    const ranked = rankTasksForUser([weakFitTask, strongFitTask], user, 2);

    expect(ranked[0]?.task).toBe(strongFitTask);
    expect(ranked[1]?.task).toBe(weakFitTask);
  });

  it("enforces claim-capacity constraints before ranking", () => {
    expect(
      canTaskAcceptMoreClaims({
        ...strongFitTask,
        activeClaimCount: 1,
      }),
    ).toBe(false);

    expect(
      canTaskAcceptMoreClaims({
        ...strongFitTask,
        claimPolicy: TaskClaimPolicy.OPEN_MANY,
        activeClaimCount: 3,
        maxClaims: 3,
      }),
    ).toBe(false);

    expect(
      canTaskAcceptMoreClaims({
        ...strongFitTask,
        claimPolicy: TaskClaimPolicy.ASSIGNED_ONLY,
      }),
    ).toBe(false);
  });

  it("keeps accountability scores normalized instead of summing raw units", () => {
    expect(scoreTaskForAccountability(strongFitTask)).toBeGreaterThan(0);
    expect(scoreTaskForAccountability(strongFitTask)).toBeLessThanOrEqual(1);
  });
});
