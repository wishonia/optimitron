import { describe, expect, it } from "vitest";
import {
  buildTreatyWishocraticComparison,
  getMilitaryAllocationPercentFromPendingVote,
  getTreatyWishocraticComparison,
} from "../treaty-vote";

describe("treaty vote helpers", () => {
  it("builds the canonical military-versus-trials comparison", () => {
    expect(
      buildTreatyWishocraticComparison(35, "2026-03-23T12:00:00.000Z"),
    ).toEqual({
      itemAId: "MILITARY_OPERATIONS",
      itemBId: "PRAGMATIC_CLINICAL_TRIALS",
      allocationA: 35,
      allocationB: 65,
      timestamp: "2026-03-23T12:00:00.000Z",
    });
  });

  it("extracts military allocation from canonical and legacy pending vote shapes", () => {
    expect(
      getMilitaryAllocationPercentFromPendingVote({
        answer: "",
        referredBy: null,
        timestamp: "2026-03-23T12:00:00.000Z",
        wishocraticComparison: {
          itemAId: "PRAGMATIC_CLINICAL_TRIALS",
          itemBId: "MILITARY_OPERATIONS",
          allocationA: 70,
          allocationB: 30,
          timestamp: "2026-03-23T12:00:00.000Z",
        },
        organizationId: null,
      }),
    ).toBe(30);

    expect(
      getMilitaryAllocationPercentFromPendingVote({
        answer: "",
        referredBy: null,
        timestamp: "2026-03-23T12:00:00.000Z",
        militaryAllocationPercent: 42,
        organizationId: null,
      }),
    ).toBe(42);
  });

  it("upgrades legacy staged allocations into canonical comparison records", () => {
    expect(
      getTreatyWishocraticComparison({
        answer: "",
        referredBy: null,
        timestamp: "2026-03-23T12:00:00.000Z",
        militaryAllocationPercent: 55,
        organizationId: null,
      }),
    ).toEqual({
      itemAId: "MILITARY_OPERATIONS",
      itemBId: "PRAGMATIC_CLINICAL_TRIALS",
      allocationA: 55,
      allocationB: 45,
      timestamp: "2026-03-23T12:00:00.000Z",
    });
  });
});
