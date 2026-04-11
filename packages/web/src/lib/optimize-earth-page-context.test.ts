import { describe, expect, it } from "vitest";
import { buildActionFollowThroughRoots } from "./optimize-earth-page-context";
import { OPTIMITRON_CANONICAL_ORIGIN } from "./site";

describe("buildActionFollowThroughRoots", () => {
  it("builds grounded funding follow-through tasks for a budget-blocked top action", () => {
    const roots = buildActionFollowThroughRoots({
      action: {
        actionKind: "FUNDING_UNBLOCKER",
        audit: {
          aggregateDelayEconomicValueUsdPerDay: 1,
          aggregateExpectedValuePerHourUsd: 1,
          dominantFamily: "growth-conversion",
          dominantFamilyShare: 0.3,
          familyCounts: {
            "contact-discovery": 1,
            "growth-conversion": 3,
            other: 0,
            "system-improvement": 2,
            "treaty-signer": 0,
            "treaty-support-contact": 0,
            "treaty-support-endorsement": 0,
            "treaty-support-evidence": 0,
            "treaty-support-explainer": 0,
          },
          impactCoverageRatio: 1,
          issues: [],
          systemImprovementPriority: "normal",
          taskCount: 6,
          treatySignerCount: 0,
        },
        autoExecutable: false,
        economics: {
          autoExecutable: false,
          availableBudgetUsd: 0,
          capabilityFit: 0.6,
          delayEconomicValueUsdLostPerDay: 1_000_000,
          estimatedExternalCostUsd: 500,
          estimatedNetValueUsd: 999_500,
          executionV1: {
            allowedExecutionModes: ["PREPARE_PROCUREMENT", "FUNDING_UNBLOCKER"],
            canAgentDoDirectly: false,
            counterpartyHints: ["growth-operator"],
            estimatedExternalCostUsd: 500,
            fundingGapUsd: 500,
            groundingRefs: [`${OPTIMITRON_CANONICAL_ORIGIN}/tasks`],
            lawfulSpendTypes: ["ADS"],
            maxRationalSpendUsd: 500_000,
            procurementPriority: "HIGH",
          },
          expectedEconomicValueUsd: 2_000_000,
          expectedValuePerHourUsd: 250_000,
          fundingGapUsd: 500,
          lawfulSpendTypes: ["ADS"],
          maxRationalSpendUsd: 500_000,
          options: [],
          requiredApproval: false,
          suggestedActionKind: "FUNDING_UNBLOCKER",
        },
        groundingRefs: [`${OPTIMITRON_CANONICAL_ORIGIN}/tasks`],
        queueRepairPlan: null,
        rationale: ["Top task is budget-blocked."],
        requiredApproval: false,
        task: {
          id: "task_memetic",
          taskKey: "system:optimize-earth:weaponize-overdue-task-list",
          title: "Turn the overdue leader task list into a memetic share-and-pressure machine",
          impact: {
            delayEconomicValueUsdLostPerDay: 1_000_000,
            expectedValuePerHourUsd: 250_000,
          },
        },
      } as any,
    });

    expect(roots).toHaveLength(1);
    expect(roots[0]?.taskKey).toContain("action-follow-through");
    expect(roots[0]?.children?.map((child) => child.taskKey)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("publish-budget-brief"),
        expect.stringContaining("route-proof-pages-into-funding"),
        expect.stringContaining("source-counterparties-and-price-ceiling"),
        expect.stringContaining("prepare-approval-packet"),
      ]),
    );
    expect(
      roots[0]?.children?.every((child) =>
        (child.sourceUrls ?? []).some(
          (url) =>
            url.includes("optimitron.com") || url.includes("manual.warondisease.org"),
        ),
      ),
    ).toBe(true);
  });

  it("does not generate follow-through tasks for existing follow-through work", () => {
    const roots = buildActionFollowThroughRoots({
      action: {
        actionKind: "FUNDING_UNBLOCKER",
        economics: {
          delayEconomicValueUsdLostPerDay: 1,
          estimatedExternalCostUsd: 1,
          expectedValuePerHourUsd: 1,
          fundingGapUsd: 1,
          maxRationalSpendUsd: 1,
        },
        groundingRefs: [],
        task: {
          id: "task_follow_through",
          taskKey:
            "system:optimize-earth:publish-budget-brief:system-optimize-earth-weaponize-overdue-task-list",
          title:
            "Publish the quantified budget brief for Turn the overdue leader task list into a memetic share-and-pressure machine",
        },
      } as any,
    });

    expect(roots).toEqual([]);
  });
});
