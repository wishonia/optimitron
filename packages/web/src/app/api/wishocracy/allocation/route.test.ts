import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAuth = vi.fn();
const findFirst = vi.fn();
const update = vi.fn();
const create = vi.fn();

vi.mock("@/lib/auth-utils", () => ({
  requireAuth,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wishocraticAllocation: {
      findFirst,
      update,
      create,
    },
  },
}));

import { POST } from "./route";

describe("wishocracy allocation route", () => {
  beforeEach(() => {
    requireAuth.mockReset();
    findFirst.mockReset();
    update.mockReset();
    create.mockReset();
  });

  it("returns 401 when authentication fails", async () => {
    requireAuth.mockRejectedValue(new Error("Unauthorized"));

    const response = await POST(
      new Request("http://localhost/api/wishocracy/allocation", {
        method: "POST",
        body: JSON.stringify({}),
      }) as never,
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("rejects invalid allocation totals", async () => {
    requireAuth.mockResolvedValue({ userId: "user_1" });

    const response = await POST(
      new Request("http://localhost/api/wishocracy/allocation", {
        method: "POST",
        body: JSON.stringify({
          categoryA: "MILITARY_OPERATIONS",
          categoryB: "ADDICTION_TREATMENT",
          allocationA: 80,
          allocationB: 30,
        }),
      }) as never,
    );

    expect(response.status).toBe(400);
    expect(create).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  it("normalizes reversed category pairs before creating allocations", async () => {
    requireAuth.mockResolvedValue({ userId: "user_1" });
    findFirst.mockResolvedValue(null);

    const response = await POST(
      new Request("http://localhost/api/wishocracy/allocation", {
        method: "POST",
        body: JSON.stringify({
          categoryA: "MILITARY_OPERATIONS",
          categoryB: "ADDICTION_TREATMENT",
          allocationA: 80,
          allocationB: 20,
        }),
      }) as never,
    );

    expect(response.status).toBe(200);
    expect(findFirst).toHaveBeenCalledWith({
      where: {
        userId: "user_1",
        categoryA: "ADDICTION_TREATMENT",
        categoryB: "MILITARY_OPERATIONS",
      },
    });
    expect(create).toHaveBeenCalledWith({
      data: {
        userId: "user_1",
        categoryA: "ADDICTION_TREATMENT",
        categoryB: "MILITARY_OPERATIONS",
        allocationA: 20,
        allocationB: 80,
      },
    });
  });
});
