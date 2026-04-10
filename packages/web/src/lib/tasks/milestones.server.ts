import {
  TaskMilestoneStatus,
  type Prisma,
} from "@optimitron/db";
import { prisma } from "@/lib/prisma";

export interface TaskMilestoneDraft {
  completedAt?: Date | null;
  description?: string | null;
  evidenceNote?: string | null;
  evidenceUrl?: string | null;
  key: string;
  metadataJson?: Record<string, unknown> | null;
  sortOrder?: number;
  status?: TaskMilestoneStatus;
  title: string;
  verifiedAt?: Date | null;
  verifiedByUserId?: string | null;
}

type TaskMilestoneClient = Pick<Prisma.TransactionClient, "taskMilestone" | "user">;

function toJsonValue(
  value: Record<string, unknown> | unknown[] | null | undefined,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (value == null) {
    return undefined;
  }

  return value as Prisma.InputJsonValue;
}

async function requireTaskReviewer(userId: string, tx: TaskMilestoneClient = prisma) {
  const reviewer = await tx.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      isAdmin: true,
    },
  });

  if (!reviewer.isAdmin) {
    throw new Error("Forbidden");
  }

  return reviewer;
}

function deriveMilestoneTimestamps(
  status: TaskMilestoneStatus,
  previous: {
    completedAt?: Date | null;
    verifiedAt?: Date | null;
  },
) {
  const now = new Date();

  switch (status) {
    case TaskMilestoneStatus.NOT_STARTED:
      return {
        completedAt: null,
        verifiedAt: null,
      };
    case TaskMilestoneStatus.IN_PROGRESS:
      return {
        completedAt: null,
        verifiedAt: null,
      };
    case TaskMilestoneStatus.COMPLETED:
      return {
        completedAt: previous.completedAt ?? now,
        verifiedAt: null,
      };
    case TaskMilestoneStatus.VERIFIED:
      return {
        completedAt: previous.completedAt ?? now,
        verifiedAt: previous.verifiedAt ?? now,
      };
  }
}

export async function syncTaskMilestones(
  taskId: string,
  drafts: TaskMilestoneDraft[],
  tx: TaskMilestoneClient = prisma,
) {
  const keys = drafts.map((draft) => draft.key);

  for (const draft of drafts) {
    await tx.taskMilestone.upsert({
      where: {
        taskId_key: {
          key: draft.key,
          taskId,
        },
      },
      create: {
        completedAt: draft.completedAt ?? null,
        description: draft.description ?? null,
        evidenceNote: draft.evidenceNote ?? null,
        evidenceUrl: draft.evidenceUrl ?? null,
        key: draft.key,
        metadataJson: toJsonValue(draft.metadataJson ?? null),
        sortOrder: draft.sortOrder ?? 0,
        status: draft.status ?? TaskMilestoneStatus.NOT_STARTED,
        taskId,
        title: draft.title,
        verifiedAt: draft.verifiedAt ?? null,
        verifiedByUserId: draft.verifiedByUserId ?? null,
      },
      update: {
        completedAt: draft.completedAt ?? undefined,
        deletedAt: null,
        description: draft.description ?? null,
        evidenceNote: draft.evidenceNote ?? undefined,
        evidenceUrl: draft.evidenceUrl ?? undefined,
        metadataJson: toJsonValue(draft.metadataJson ?? null),
        sortOrder: draft.sortOrder ?? 0,
        status: draft.status ?? undefined,
        title: draft.title,
        verifiedAt: draft.verifiedAt ?? undefined,
        verifiedByUserId: draft.verifiedByUserId ?? undefined,
      },
    });
  }

  await tx.taskMilestone.updateMany({
    where: {
      deletedAt: null,
      taskId,
      ...(keys.length > 0
        ? {
            key: {
              notIn: keys,
            },
          }
        : {}),
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function updateTaskMilestone(
  taskId: string,
  milestoneId: string,
  reviewerUserId: string,
  input: {
    evidenceNote?: string | null;
    evidenceUrl?: string | null;
    status: TaskMilestoneStatus;
  },
) {
  await requireTaskReviewer(reviewerUserId);

  const milestone = await prisma.taskMilestone.findUniqueOrThrow({
    where: {
      id: milestoneId,
    },
    select: {
      completedAt: true,
      id: true,
      taskId: true,
      verifiedAt: true,
    },
  });

  if (milestone.taskId !== taskId) {
    throw new Error("Milestone does not belong to this task.");
  }

  const timestamps = deriveMilestoneTimestamps(input.status, milestone);

  return prisma.taskMilestone.update({
    where: {
      id: milestone.id,
    },
    data: {
      completedAt: timestamps.completedAt,
      evidenceNote: input.evidenceNote?.trim() || null,
      evidenceUrl: input.evidenceUrl?.trim() || null,
      status: input.status,
      verifiedAt: timestamps.verifiedAt,
      verifiedByUserId:
        input.status === TaskMilestoneStatus.VERIFIED ? reviewerUserId : null,
    },
  });
}
