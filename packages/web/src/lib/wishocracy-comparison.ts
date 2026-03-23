import { BUDGET_CATEGORIES, type BudgetCategoryId } from "@/lib/wishocracy-data";

export interface WishocraticComparisonInput {
  itemAId: string;
  itemBId: string;
  allocationA: number;
  allocationB: number;
}

export function isBudgetCategoryId(value: string): value is BudgetCategoryId {
  return Object.prototype.hasOwnProperty.call(BUDGET_CATEGORIES, value);
}

export function isValidAllocationPair(allocationA: number, allocationB: number): boolean {
  const sum = allocationA + allocationB;
  const inRange =
    allocationA >= 0 &&
    allocationA <= 100 &&
    allocationB >= 0 &&
    allocationB <= 100;

  return inRange && (sum === 100 || sum === 0);
}

export function normalizeWishocraticComparison<T extends WishocraticComparisonInput>(
  comparison: T,
): T {
  if (comparison.itemAId <= comparison.itemBId) {
    return comparison;
  }

  return {
    ...comparison,
    itemAId: comparison.itemBId,
    itemBId: comparison.itemAId,
    allocationA: comparison.allocationB,
    allocationB: comparison.allocationA,
  };
}

export function isValidWishocraticComparison(
  comparison: WishocraticComparisonInput,
): comparison is WishocraticComparisonInput & {
  itemAId: BudgetCategoryId;
  itemBId: BudgetCategoryId;
} {
  return (
    comparison.itemAId !== comparison.itemBId &&
    isBudgetCategoryId(comparison.itemAId) &&
    isBudgetCategoryId(comparison.itemBId) &&
    isValidAllocationPair(comparison.allocationA, comparison.allocationB)
  );
}
