import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { createLogger } from "@/lib/logger";
import {
  isValidWishocraticComparison,
  normalizeWishocraticComparison,
} from "@/lib/wishocracy-community";

const logger = createLogger("api/wishocracy/allocations");

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ allocations: [] });
    }

    const dbAllocations = await prisma.wishocraticAllocation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "asc" },
      select: {
        categoryA: true,
        categoryB: true,
        allocationA: true,
        allocationB: true,
        updatedAt: true,
      },
    });

    const seen = new Map<string, (typeof dbAllocations)[number]>();
    for (const allocation of dbAllocations) {
      const normalized = normalizeWishocraticComparison(allocation);
      if (!isValidWishocraticComparison(normalized)) {
        continue;
      }

      const key = `${normalized.categoryA}_${normalized.categoryB}`;
      const existing = seen.get(key);
      if (!existing || allocation.updatedAt > existing.updatedAt) {
        seen.set(key, allocation);
      }
    }

    const allocations = Array.from(seen.values()).map((allocation) => {
      const normalized = normalizeWishocraticComparison(allocation);
      return {
        categoryA: normalized.categoryA,
        categoryB: normalized.categoryB,
        allocationA: normalized.allocationA,
        allocationB: normalized.allocationB,
        timestamp: allocation.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({ allocations });
  } catch (error) {
    logger.error("Failed to fetch allocations:", error);
    return NextResponse.json({ allocations: [] });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { updatedComparisons, deletedCategories } = body as {
      updatedComparisons: Array<{
        categoryA: string;
        categoryB: string;
        allocationA: number;
        allocationB: number;
      }>;
      deletedCategories: string[];
    };

    if (deletedCategories?.length) {
      await prisma.wishocraticAllocation.deleteMany({
        where: {
          userId: user.id,
          OR: [
            { categoryA: { in: deletedCategories } },
            { categoryB: { in: deletedCategories } },
          ],
        },
      });
    }

    if (updatedComparisons?.length) {
      const normalizedComparisons = updatedComparisons.map(normalizeWishocraticComparison);

      if (!normalizedComparisons.every(isValidWishocraticComparison)) {
        return NextResponse.json(
          { error: "Allocations must reference valid categories and sum to 100 or 0." },
          { status: 400 },
        );
      }

      for (const comparison of normalizedComparisons) {
        await prisma.wishocraticAllocation.deleteMany({
          where: {
            userId: user.id,
            OR: [
              { categoryA: comparison.categoryA, categoryB: comparison.categoryB },
              { categoryA: comparison.categoryB, categoryB: comparison.categoryA },
            ],
          },
        });
      }

      await prisma.wishocraticAllocation.createMany({
        data: normalizedComparisons.map((comparison) => ({
          userId: user.id,
          categoryA: comparison.categoryA,
          categoryB: comparison.categoryB,
          allocationA: comparison.allocationA,
          allocationB: comparison.allocationB,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to update allocations:", error);
    return NextResponse.json({ error: "Failed to update allocations." }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.wishocraticAllocation.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete allocations:", error);
    return NextResponse.json({ error: "Failed to delete allocations." }, { status: 500 });
  }
}
