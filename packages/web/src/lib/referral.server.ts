import { prisma } from "@/lib/prisma";

export async function findUserByUsernameOrReferralCode(identifier: string | null | undefined) {
  const value = identifier?.trim();
  if (!value) {
    return null;
  }

  return prisma.user.findFirst({
    where: {
      OR: [
        {
          referralCode: {
            equals: value,
            mode: "insensitive",
          },
        },
        {
          username: {
            equals: value,
            mode: "insensitive",
          },
        },
      ],
    },
  });
}

export function getReferralVoteCount(userId: string) {
  return prisma.vote.count({
    where: { referredByUserId: userId },
  });
}
