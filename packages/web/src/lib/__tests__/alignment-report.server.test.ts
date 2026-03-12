import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  allocationsFindMany: vi.fn(),
  selectionsFindMany: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wishocraticAllocation: {
      findMany: mocks.allocationsFindMany,
    },
    wishocraticCategorySelection: {
      findMany: mocks.selectionsFindMany,
    },
  },
}));

import { getPersonalAlignmentState } from "@/lib/alignment-report.server";

describe("alignment report server loader", () => {
  beforeEach(() => {
    mocks.allocationsFindMany.mockReset();
    mocks.selectionsFindMany.mockReset();
  });

  it("returns an empty state when the user has no saved allocations", async () => {
    mocks.allocationsFindMany.mockResolvedValue([]);
    mocks.selectionsFindMany.mockResolvedValue([]);

    const state = await getPersonalAlignmentState("user-1");

    expect(state.status).toBe("empty");
    if (state.status !== "empty") {
      throw new Error("Expected empty state.");
    }
    expect(state.comparisonCount).toBe(0);
  });

  it("returns a ready state when the user has saved comparisons", async () => {
    mocks.allocationsFindMany.mockResolvedValue([
      {
        userId: "user-1",
        categoryA: "PRAGMATIC_CLINICAL_TRIALS",
        categoryB: "MILITARY_OPERATIONS",
        allocationA: 90,
        allocationB: 10,
        updatedAt: new Date("2026-03-11T00:00:00.000Z"),
      },
      {
        userId: "user-1",
        categoryA: "ADDICTION_TREATMENT",
        categoryB: "MILITARY_OPERATIONS",
        allocationA: 85,
        allocationB: 15,
        updatedAt: new Date("2026-03-11T00:05:00.000Z"),
      },
      {
        userId: "user-1",
        categoryA: "PRAGMATIC_CLINICAL_TRIALS",
        categoryB: "ADDICTION_TREATMENT",
        allocationA: 55,
        allocationB: 45,
        updatedAt: new Date("2026-03-11T00:10:00.000Z"),
      },
    ]);
    mocks.selectionsFindMany.mockResolvedValue([
      { categoryId: "PRAGMATIC_CLINICAL_TRIALS" },
      { categoryId: "ADDICTION_TREATMENT" },
      { categoryId: "MILITARY_OPERATIONS" },
    ]);

    const state = await getPersonalAlignmentState("user-1");

    expect(state.status).toBe("ready");
    if (state.status !== "ready") {
      throw new Error("Expected ready state.");
    }
    expect(state.report.comparisonCount).toBe(3);
    expect(state.report.totalPossiblePairs).toBe(3);
    expect(state.report.ranking.length).toBeGreaterThan(0);
  });
});
