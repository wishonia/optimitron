import { beforeEach, describe, expect, it, vi } from "vitest";

const getCurrentUser = vi.fn();
const findMany = vi.fn();
const deleteMany = vi.fn();
const createMany = vi.fn();

vi.mock("@/lib/auth-utils", () => ({
  getCurrentUser,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wishocraticAllocation: {
      findMany,
      deleteMany,
      createMany,
    },
  },
}));

vi.mock("@/lib/logger", () => ({
  createLogger: () => ({
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  }),
}));

import { GET, PATCH } from "./route";

describe("wishocracy allocations route", () => {
  beforeEach(() => {
    getCurrentUser.mockReset();
    findMany.mockReset();
    deleteMany.mockReset();
    createMany.mockReset();
  });

  it("dedupes by pair and normalizes the latest saved orientation on GET", async () => {
    getCurrentUser.mockResolvedValue({ id: "user_1" });
    findMany.mockResolvedValue([
      {
        categoryA: "ADDICTION_TREATMENT",
        categoryB: "MILITARY_OPERATIONS",
        allocationA: 40,
        allocationB: 60,
        updatedAt: new Date("2026-03-10T00:00:00.000Z"),
      },
      {
        categoryA: "MILITARY_OPERATIONS",
        categoryB: "ADDICTION_TREATMENT",
        allocationA: 70,
        allocationB: 30,
        updatedAt: new Date("2026-03-11T00:00:00.000Z"),
      },
    ]);

    const response = await GET();
    const body = (await response.json()) as { allocations: Array<Record<string, unknown>> };

    expect(body.allocations).toEqual([
      {
        categoryA: "ADDICTION_TREATMENT",
        categoryB: "MILITARY_OPERATIONS",
        allocationA: 30,
        allocationB: 70,
        timestamp: "2026-03-11T00:00:00.000Z",
      },
    ]);
  });

  it("returns 401 for unauthenticated PATCH requests", async () => {
    getCurrentUser.mockResolvedValue(null);

    const response = await PATCH(
      new Request("http://localhost/api/wishocracy/allocations", {
        method: "PATCH",
        body: JSON.stringify({ updatedComparisons: [], deletedCategories: [] }),
      }),
    );

    expect(response.status).toBe(401);
    expect(createMany).not.toHaveBeenCalled();
  });

  it("normalizes reversed comparisons before recreating saved allocations", async () => {
    getCurrentUser.mockResolvedValue({ id: "user_1" });

    const response = await PATCH(
      new Request("http://localhost/api/wishocracy/allocations", {
        method: "PATCH",
        body: JSON.stringify({
          updatedComparisons: [
            {
              categoryA: "MILITARY_OPERATIONS",
              categoryB: "ADDICTION_TREATMENT",
              allocationA: 75,
              allocationB: 25,
            },
          ],
          deletedCategories: [],
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(deleteMany).toHaveBeenCalledWith({
      where: {
        userId: "user_1",
        OR: [
          {
            categoryA: "ADDICTION_TREATMENT",
            categoryB: "MILITARY_OPERATIONS",
          },
          {
            categoryA: "MILITARY_OPERATIONS",
            categoryB: "ADDICTION_TREATMENT",
          },
        ],
      },
    });
    expect(createMany).toHaveBeenCalledWith({
      data: [
        {
          userId: "user_1",
          categoryA: "ADDICTION_TREATMENT",
          categoryB: "MILITARY_OPERATIONS",
          allocationA: 25,
          allocationB: 75,
        },
      ],
    });
  });
});
