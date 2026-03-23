import { prisma } from "@/lib/prisma";
import { calculateAllocationsFromPairwise } from "@/lib/wishocracy-calculations";
import { BUDGET_CATEGORIES, type BudgetCategoryId } from "@/lib/wishocracy-data";
import { createLogger } from "@/lib/logger";
import {
  isBudgetCategoryId,
  isValidAllocationPair,
  isValidWishocraticComparison,
  normalizeWishocraticComparison,
  type WishocraticComparisonInput,
} from "@/lib/wishocracy-comparison";

const logger = createLogger("wishocracy-community");
export {
  isBudgetCategoryId,
  isValidAllocationPair,
  isValidWishocraticComparison,
  normalizeWishocraticComparison,
  type WishocraticComparisonInput,
} from "@/lib/wishocracy-comparison";

export interface WishocraticStoredAllocation extends WishocraticComparisonInput {
  userId: string;
  updatedAt: Date;
}

export interface WishocracyCommunityCategory {
  categoryId: BudgetCategoryId;
  percentage: number;
}

export interface WishocracyCommunitySummary {
  averageAllocations: Record<BudgetCategoryId, number>;
  totalUsers: number;
  totalComparisons: number;
  topCategories: WishocracyCommunityCategory[];
}

export function createEmptyAverageAllocations(): Record<BudgetCategoryId, number> {
  return Object.keys(BUDGET_CATEGORIES).reduce((allocations, categoryId) => {
    allocations[categoryId as BudgetCategoryId] = 0;
    return allocations;
  }, {} as Record<BudgetCategoryId, number>);
}

function buildTopCategories(
  averageAllocations: Record<BudgetCategoryId, number>,
): WishocracyCommunityCategory[] {
  return Object.entries(averageAllocations)
    .map(([categoryId, percentage]) => ({
      categoryId: categoryId as BudgetCategoryId,
      percentage,
    }))
    .filter((entry) => entry.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);
}

function dedupeLatestAllocations(
  allocations: WishocraticStoredAllocation[],
): Map<string, Array<WishocraticComparisonInput & { itemAId: BudgetCategoryId; itemBId: BudgetCategoryId }>> {
  const latestByUserPair = new Map<
    string,
    WishocraticStoredAllocation & { itemAId: BudgetCategoryId; itemBId: BudgetCategoryId }
  >();

  for (const allocation of allocations) {
    const normalized = normalizeWishocraticComparison(allocation);
    if (!isValidWishocraticComparison(normalized)) {
      continue;
    }

    const key = `${normalized.userId}:${normalized.itemAId}_${normalized.itemBId}`;
    const existing = latestByUserPair.get(key);

    if (!existing || normalized.updatedAt > existing.updatedAt) {
      latestByUserPair.set(key, normalized);
    }
  }

  const allocationsByUser = new Map<
    string,
    Array<WishocraticComparisonInput & { itemAId: BudgetCategoryId; itemBId: BudgetCategoryId }>
  >();

  for (const allocation of latestByUserPair.values()) {
    const existing = allocationsByUser.get(allocation.userId) ?? [];
    existing.push(allocation);
    allocationsByUser.set(allocation.userId, existing);
  }

  return allocationsByUser;
}

export function buildWishocracyCommunitySummary(
  allocations: WishocraticStoredAllocation[],
): WishocracyCommunitySummary {
  const averageAllocations = createEmptyAverageAllocations();
  const allocationsByUser = dedupeLatestAllocations(allocations);

  if (allocationsByUser.size === 0) {
    return {
      averageAllocations,
      totalUsers: 0,
      totalComparisons: 0,
      topCategories: [],
    };
  }

  let totalComparisons = 0;
  for (const userComparisons of allocationsByUser.values()) {
    totalComparisons += userComparisons.length;
    const userAllocations = calculateAllocationsFromPairwise(userComparisons);

    for (const categoryId of Object.keys(BUDGET_CATEGORIES) as BudgetCategoryId[]) {
      averageAllocations[categoryId] += userAllocations[categoryId] / allocationsByUser.size;
    }
  }

  for (const categoryId of Object.keys(BUDGET_CATEGORIES) as BudgetCategoryId[]) {
    averageAllocations[categoryId] = Number(averageAllocations[categoryId].toFixed(1));
  }

  return {
    averageAllocations,
    totalUsers: allocationsByUser.size,
    totalComparisons,
    topCategories: buildTopCategories(averageAllocations),
  };
}

export async function getWishocracyCommunitySummary(): Promise<WishocracyCommunitySummary> {
  try {
    const allocations = await prisma.wishocraticAllocation.findMany({
      select: {
        userId: true,
        itemAId: true,
        itemBId: true,
        allocationA: true,
        allocationB: true,
        updatedAt: true,
      },
    });

    return buildWishocracyCommunitySummary(allocations);
  } catch (error) {
    logger.error("Failed to load wishocracy community summary", error);
    return buildWishocracyCommunitySummary([]);
  }
}
