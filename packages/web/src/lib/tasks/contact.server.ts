import { ActivityType } from "@optimitron/db";
import { prisma } from "@/lib/prisma";

export async function countTaskContactActions(taskId: string) {
  return prisma.activity.count({
    where: {
      entityId: taskId,
      entityType: "Task",
      type: ActivityType.CONTACTED_ASSIGNEE,
    },
  });
}

export async function recordTaskContactAction(input: {
  taskId: string;
  userId: string;
  channel: "email" | "link";
  href?: string | null;
  message?: string | null;
}) {
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
