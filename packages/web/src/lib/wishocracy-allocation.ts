import { WISHOCRATIC_ITEMS, type WishocraticItemId } from "@/lib/wishocracy-data";

export interface WishocraticAllocationInput {
  itemAId: string;
  itemBId: string;
  allocationA: number;
  allocationB: number;
}

export function isWishocraticItemId(value: string): value is WishocraticItemId {
  return Object.prototype.hasOwnProperty.call(WISHOCRATIC_ITEMS, value);
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

export function normalizeWishocraticAllocation<T extends WishocraticAllocationInput>(
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

export function isValidWishocraticAllocation(
  comparison: WishocraticAllocationInput,
): comparison is WishocraticAllocationInput & {
  itemAId: WishocraticItemId;
  itemBId: WishocraticItemId;
} {
  return (
    comparison.itemAId !== comparison.itemBId &&
    isWishocraticItemId(comparison.itemAId) &&
    isWishocraticItemId(comparison.itemBId) &&
    isValidAllocationPair(comparison.allocationA, comparison.allocationB)
  );
}
