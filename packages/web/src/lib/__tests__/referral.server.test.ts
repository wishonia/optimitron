import { beforeEach, describe, expect, it, vi } from "vitest";

const findFirst = vi.fn();
const count = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findFirst },
    vote: { count },
  },
}));

import {
  findUserByUsernameOrReferralCode,
  getReferralVoteCount,
} from "../referral.server";

describe("referral server helpers", () => {
  beforeEach(() => {
    findFirst.mockReset();
    count.mockReset();
  });

  it("skips database lookup for blank identifiers", async () => {
    await expect(findUserByUsernameOrReferralCode("   ")).resolves.toBeNull();
    expect(findFirst).not.toHaveBeenCalled();
  });

  it("uses case-insensitive referral and username lookup", async () => {
    findFirst.mockResolvedValue({ id: "user_1" });

    await findUserByUsernameOrReferralCode(" ReF123 ");

    expect(findFirst).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            referralCode: {
              equals: "ReF123",
              mode: "insensitive",
            },
          },
          {
            username: {
              equals: "ReF123",
              mode: "insensitive",
            },
          },
        ],
      },
    });
  });

  it("counts referral votes by referrer id", async () => {
    count.mockResolvedValue(4);

    await expect(getReferralVoteCount("user_9")).resolves.toBe(4);
    expect(count).toHaveBeenCalledWith({
      where: { referredByUserId: "user_9" },
    });
  });
});
