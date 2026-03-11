import { beforeEach, describe, expect, it, vi } from "vitest";

const getPendingWishocracy = vi.fn();

vi.mock("@/lib/storage", () => ({
  storage: {
    getPendingWishocracy,
  },
}));

import {
  buildSelectedPairQueue,
  getRejectedCategories,
  hydrateGuestState,
  shouldShowIntro,
} from "../wishocracy-state-utils";

describe("wishocracy state utils", () => {
  beforeEach(() => {
    getPendingWishocracy.mockReset();
  });

  it("marks both categories as rejected for 0/0 comparisons", () => {
    const rejected = getRejectedCategories([
      {
        categoryA: "PRAGMATIC_CLINICAL_TRIALS",
        categoryB: "MILITARY_OPERATIONS",
        allocationA: 0,
        allocationB: 0,
      },
      {
        categoryA: "ADDICTION_TREATMENT",
        categoryB: "EARLY_CHILDHOOD_EDUCATION",
        allocationA: 70,
        allocationB: 30,
      },
    ]);

    expect(rejected).toEqual(
      new Set(["PRAGMATIC_CLINICAL_TRIALS", "MILITARY_OPERATIONS"]),
    );
  });

  it("builds selected queues without completed or rejected pairs", () => {
    const selectedCategories = new Set([
      "PRAGMATIC_CLINICAL_TRIALS",
      "ADDICTION_TREATMENT",
      "EARLY_CHILDHOOD_EDUCATION",
      "MILITARY_OPERATIONS",
    ] as const);

    const queue = buildSelectedPairQueue(
      selectedCategories,
      [
        {
          categoryA: "PRAGMATIC_CLINICAL_TRIALS",
          categoryB: "ADDICTION_TREATMENT",
          allocationA: 60,
          allocationB: 40,
        },
      ],
      new Set(["MILITARY_OPERATIONS"]),
    );

    expect(queue).toEqual([
      ["PRAGMATIC_CLINICAL_TRIALS", "EARLY_CHILDHOOD_EDUCATION"],
      ["ADDICTION_TREATMENT", "EARLY_CHILDHOOD_EDUCATION"],
    ]);
  });

  it("hydrates guest progress from local storage and filters invalid pairs", () => {
    getPendingWishocracy.mockReturnValue({
      comparisons: [
        {
          categoryA: "PRAGMATIC_CLINICAL_TRIALS",
          categoryB: "ADDICTION_TREATMENT",
          allocationA: 60,
          allocationB: 40,
          timestamp: "2026-03-11T00:00:00.000Z",
        },
        {
          categoryA: "ADDICTION_TREATMENT",
          categoryB: "MILITARY_OPERATIONS",
          allocationA: 0,
          allocationB: 0,
          timestamp: "2026-03-11T00:01:00.000Z",
        },
      ],
      currentPairIndex: 0,
      shuffledPairs: [
        ["PRAGMATIC_CLINICAL_TRIALS", "EARLY_CHILDHOOD_EDUCATION"],
        ["MILITARY_OPERATIONS", "EARLY_CHILDHOOD_EDUCATION"],
        ["PRAGMATIC_CLINICAL_TRIALS", "NOT_REAL_CATEGORY"],
      ],
      selectedCategories: [
        "PRAGMATIC_CLINICAL_TRIALS",
        "ADDICTION_TREATMENT",
        "EARLY_CHILDHOOD_EDUCATION",
        "MILITARY_OPERATIONS",
      ],
    });

    const state = hydrateGuestState();

    expect(state.comparisons).toHaveLength(2);
    expect(state.selectedCategories).toEqual(
      new Set([
        "PRAGMATIC_CLINICAL_TRIALS",
        "ADDICTION_TREATMENT",
        "EARLY_CHILDHOOD_EDUCATION",
        "MILITARY_OPERATIONS",
      ]),
    );
    expect(state.rejectedCategories).toEqual(
      new Set(["ADDICTION_TREATMENT", "MILITARY_OPERATIONS"]),
    );
    expect(state.shuffledPairs).toEqual([["PRAGMATIC_CLINICAL_TRIALS", "EARLY_CHILDHOOD_EDUCATION"]]);
    expect(state.showIntro).toBe(false);
  });

  it("shows the intro only for empty runs with no category selection", () => {
    expect(shouldShowIntro([], new Set())).toBe(true);
    expect(shouldShowIntro([], new Set(["PRAGMATIC_CLINICAL_TRIALS"]))).toBe(false);
    expect(
      shouldShowIntro(
        [
          {
            categoryA: "PRAGMATIC_CLINICAL_TRIALS",
            categoryB: "ADDICTION_TREATMENT",
            allocationA: 50,
            allocationB: 50,
          },
        ],
        new Set(),
      ),
    ).toBe(false);
  });
});
