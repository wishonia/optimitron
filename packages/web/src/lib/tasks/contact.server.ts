import { ActivityType } from "@optimitron/db";
import { prisma } from "@/lib/prisma";

/** Minimum seconds between contact actions on the same task+channel. */
const CONTACT_COOLDOWN_SECONDS = 86_400; // 24 hours

export async function countTaskContactActions(taskId: string) {
  return prisma.activity.count({
    where: {
      entityId: taskId,
      entityType: "Task",
      type: ActivityType.CONTACTED_ASSIGNEE,
    },
  });
}

/**
 * Check whether a contact action is allowed (cooldown has elapsed).
 * Returns `{ allowed: true }` or `{ allowed: false, retryAfter }`.
 */
export async function checkContactCooldown(
  taskId: string,
  channel: "email" | "link",
) {
  const cutoff = new Date(Date.now() - CONTACT_COOLDOWN_SECONDS * 1000);

  const recent = await prisma.activity.findFirst({
    where: {
      entityId: taskId,
      entityType: "Task",
      type: ActivityType.CONTACTED_ASSIGNEE,
      createdAt: { gte: cutoff },
      metadata: { contains: `"channel":"${channel}"` },
    },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  if (!recent) {
    return { allowed: true as const };
  }

  const retryAfter = new Date(
    recent.createdAt.getTime() + CONTACT_COOLDOWN_SECONDS * 1000,
  );
  return { allowed: false as const, retryAfter };
}

export async function recordTaskContactAction(input: {
  taskId: string;
  userId: string;
  channel: "email" | "link";
  href?: string | null;
  message?: string | null;
  skipCooldownCheck?: boolean;
}) {
  if (!input.skipCooldownCheck) {
    const cooldown = await checkContactCooldown(input.taskId, input.channel);
    if (!cooldown.allowed) {
      throw new Error(
        `Contact cooldown active for this task+channel. Retry after ${cooldown.retryAfter.toISOString()}.`,
      );
    }
  }

  return prisma.activity.create({
    data: {
      description: "Opened assignee contact flow",
      entityId: input.taskId,
      entityType: "Task",
      metadata: JSON.stringify({
        channel: input.channel,
        href: input.href ?? null,
        message: input.message ?? null,
      }),
      type: ActivityType.CONTACTED_ASSIGNEE,
      userId: input.userId,
    },
  });
}
