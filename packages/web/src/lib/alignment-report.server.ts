import { prisma } from "@/lib/prisma";
import { ALIGNMENT_BENCHMARKS } from "@/lib/alignment-benchmarks";
import {
  buildEmptyPersonalAlignmentState,
  buildPersonalAlignmentReport,
  type PersonalAlignmentState,
} from "@/lib/alignment-report";

export async function getPersonalAlignmentState(
  userId: string,
): Promise<PersonalAlignmentState> {
  const [allocations, selections] = await Promise.all([
    prisma.wishocraticAllocation.findMany({
      where: { userId },
      orderBy: { updatedAt: "asc" },
      select: {
        userId: true,
        categoryA: true,
        categoryB: true,
        allocationA: true,
        allocationB: true,
        updatedAt: true,
      },
    }),
    prisma.wishocraticCategorySelection.findMany({
      where: { userId, selected: true },
      select: {
        categoryId: true,
      },
    }),
  ]);

  if (allocations.length === 0) {
    return buildEmptyPersonalAlignmentState({
      comparisonCount: 0,
      selectedCategoryCount: selections.length,
    });
  }

  const report = buildPersonalAlignmentReport({
    comparisons: allocations.map((allocation) => ({
      userId: allocation.userId,
      categoryA: allocation.categoryA,
      categoryB: allocation.categoryB,
      allocationA: allocation.allocationA,
      allocationB: allocation.allocationB,
      timestamp: allocation.updatedAt,
    })),
    selectedCategoryCount: selections.length,
    benchmarkProfiles: ALIGNMENT_BENCHMARKS,
  });

  if (report.comparisonCount === 0 || report.topPriorities.length === 0) {
    return buildEmptyPersonalAlignmentState({
      comparisonCount: report.comparisonCount,
      selectedCategoryCount: selections.length,
    });
  }

  return {
    status: "ready",
    report,
  };
}
