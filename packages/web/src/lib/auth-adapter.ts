import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { ensurePersonForUser } from "@/lib/person.server";
import { prisma } from "@/lib/prisma";
import {
  createUniqueReferralCode,
  createUniqueUsername,
} from "@/lib/user-identity.server";

export function createAuthAdapter(): Adapter {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,
    async createUser(user: Parameters<NonNullable<Adapter["createUser"]>>[0]) {
      const username = await createUniqueUsername();
      const referralCode = await createUniqueReferralCode();

      const createdUser = await prisma.user.create({
        data: {
          email: user.email,
          emailVerified: user.emailVerified ?? null,
          image: user.image ?? null,
          name: user.name ?? null,
          username,
          referralCode,
        },
      });

      await ensurePersonForUser(createdUser.id);

      return createdUser;
    },
  };
}
