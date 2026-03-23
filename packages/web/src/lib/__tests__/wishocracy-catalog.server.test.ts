import { beforeEach, describe, expect, it, vi } from "vitest";
import { getActualGovernmentAllocations } from "@/lib/wishocracy-data";

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    jurisdiction: {
      findUnique: mocks.findUnique,
    },
    wishocraticItem: {
      upsert: mocks.upsert,
    },
  },
}));

import {
  buildWishocraticCatalogRecord,
  ensureWishocraticItemsExist,
} from "../wishocracy-catalog.server";

describe("wishocracy catalog sync", () => {
  beforeEach(() => {
    mocks.findUnique.mockReset();
    mocks.upsert.mockReset();
    mocks.upsert.mockResolvedValue({});
  });

  it("builds catalog records from the default wishocratic items registry", () => {
    const allocations = getActualGovernmentAllocations();
    const record = buildWishocraticCatalogRecord("PRAGMATIC_CLINICAL_TRIALS");

    expect(record).toEqual({
      id: "PRAGMATIC_CLINICAL_TRIALS",
      name: "Pragmatic Clinical Trials",
      description: expect.any(String),
      currentAllocationUsd: 1e9,
      currentAllocationPct: allocations.PRAGMATIC_CLINICAL_TRIALS,
      sourceUrl: expect.any(String),
    });
  });

  it("upserts each requested item into the default wishocracy jurisdiction", async () => {
    mocks.findUnique.mockResolvedValue({ id: "jurisdiction_usa" });

    await ensureWishocraticItemsExist([
      "PRAGMATIC_CLINICAL_TRIALS",
      "MILITARY_OPERATIONS",
      "PRAGMATIC_CLINICAL_TRIALS",
    ]);

    expect(mocks.findUnique).toHaveBeenCalledWith({
      where: { code: "USA" },
      select: { id: true },
    });
    expect(mocks.upsert).toHaveBeenCalledTimes(2);
    expect(mocks.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "PRAGMATIC_CLINICAL_TRIALS" },
        create: expect.objectContaining({
          id: "PRAGMATIC_CLINICAL_TRIALS",
          jurisdictionId: "jurisdiction_usa",
          active: true,
        }),
        update: expect.objectContaining({
          name: "Pragmatic Clinical Trials",
          deletedAt: null,
        }),
      }),
    );
  });

  it("throws when the default wishocracy jurisdiction has not been seeded", async () => {
    mocks.findUnique.mockResolvedValue(null);

    await expect(
      ensureWishocraticItemsExist(["PRAGMATIC_CLINICAL_TRIALS"]),
    ).rejects.toThrow("Wishocracy jurisdiction not found: USA");
  });
});
