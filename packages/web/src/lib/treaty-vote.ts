import type { PendingVoteComparison, PendingVoteData } from "@/lib/storage";
import type { BudgetCategoryId } from "@/lib/wishocracy-data";
import { normalizeWishocraticComparison } from "@/lib/wishocracy-comparison";

export const TREATY_BUDGET_ITEM_IDS = {
  military: "MILITARY_OPERATIONS",
  pragmaticClinicalTrials: "PRAGMATIC_CLINICAL_TRIALS",
} as const satisfies Record<string, BudgetCategoryId>;

function isTreatyWishocraticComparison(
  comparison: { itemAId: string; itemBId: string },
): comparison is { itemAId: BudgetCategoryId; itemBId: BudgetCategoryId } {
  const ids = new Set([comparison.itemAId, comparison.itemBId]);
  return (
    ids.size === 2 &&
    ids.has(TREATY_BUDGET_ITEM_IDS.military) &&
    ids.has(TREATY_BUDGET_ITEM_IDS.pragmaticClinicalTrials)
  );
}

export function buildTreatyWishocraticComparison(
  militaryAllocationPercent: number,
  timestamp: string = new Date().toISOString(),
): PendingVoteComparison {
  return normalizeWishocraticComparison({
    itemAId: TREATY_BUDGET_ITEM_IDS.military,
    itemBId: TREATY_BUDGET_ITEM_IDS.pragmaticClinicalTrials,
    allocationA: militaryAllocationPercent,
    allocationB: 100 - militaryAllocationPercent,
    timestamp,
  });
}

export function getTreatyWishocraticComparison(
  pendingVote?: PendingVoteData | null,
): PendingVoteComparison | null {
  if (pendingVote?.wishocraticComparison && isTreatyWishocraticComparison(pendingVote.wishocraticComparison)) {
    return normalizeWishocraticComparison(pendingVote.wishocraticComparison);
  }

  if (typeof pendingVote?.militaryAllocationPercent === "number") {
    return buildTreatyWishocraticComparison(
      pendingVote.militaryAllocationPercent,
      pendingVote.timestamp,
    );
  }

  return null;
}

export function getMilitaryAllocationPercentFromPendingVote(
  pendingVote?: PendingVoteData | null,
): number | null {
  const comparison = getTreatyWishocraticComparison(pendingVote);
  if (!comparison) {
    return null;
  }

  return comparison.itemAId === TREATY_BUDGET_ITEM_IDS.military
    ? comparison.allocationA
    : comparison.allocationB;
}
