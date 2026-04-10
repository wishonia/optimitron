import {
  TaskCategory,
  TaskClaimPolicy,
  TaskDifficulty,
  TaskStatus,
  type Prisma,
} from "@optimitron/db";
import { prisma } from "@/lib/prisma";
import {
  buildTreatySupporterTaskDrafts,
  TREATY_DUE_AT,
  TREATY_PARENT_TASK_KEY,
  TREATY_SIGNER_TASK_KEY_PREFIX,
  type TreatySignerSlot,
} from "./treaty-signer-network";

type DbClient = Prisma.TransactionClient | typeof prisma;

export async function ensureTreatyParentTask(
  input: {
    jurisdictionId?: string | null;
  },
  db: DbClient = prisma,
) {
  return db.task.upsert({
    where: {
      taskKey: TREATY_PARENT_TASK_KEY,
    },
    update: {
      category: TaskCategory.GOVERNANCE,
      claimPolicy: TaskClaimPolicy.ASSIGNED_ONLY,
      description:
        "Coordinate signature and ratification of the 1% Treaty across national leaders, then keep public pressure on every outstanding signer until the treaty is real.",
      difficulty: TaskDifficulty.EXPERT,
      dueAt: TREATY_DUE_AT,
      interestTags: ["treaty", "disease-eradication", "peace-dividend"],
      isPublic: true,
      jurisdictionId: input.jurisdictionId ?? null,
      skillTags: ["organizing", "diplomacy", "public-pressure"],
      sortOrder: -100,
      status: TaskStatus.ACTIVE,
      title: "Ratify the 1% Treaty",
    },
    create: {
      category: TaskCategory.GOVERNANCE,
      claimPolicy: TaskClaimPolicy.ASSIGNED_ONLY,
      description:
        "Coordinate signature and ratification of the 1% Treaty across national leaders, then keep public pressure on every outstanding signer until the treaty is real.",
      difficulty: TaskDifficulty.EXPERT,
      dueAt: TREATY_DUE_AT,
      interestTags: ["treaty", "disease-eradication", "peace-dividend"],
      isPublic: true,
      jurisdictionId: input.jurisdictionId ?? null,
      skillTags: ["organizing", "diplomacy", "public-pressure"],
      sortOrder: -100,
      status: TaskStatus.ACTIVE,
      taskKey: TREATY_PARENT_TASK_KEY,
      title: "Ratify the 1% Treaty",
    },
    select: {
      id: true,
      taskKey: true,
      title: true,
    },
  });
}

export async function syncTreatySupporterTasks(
  input: {
    assigneeOrganizationId?: string | null;
    parentTaskId: string;
    slot: TreatySignerSlot;
  },
  db: DbClient = prisma,
) {
  const drafts = buildTreatySupporterTaskDrafts(input.slot);

  for (const draft of drafts) {
    await db.task.upsert({
      where: {
        taskKey: draft.taskKey,
      },
      create: {
        assigneeAffiliationSnapshot: draft.assigneeAffiliationSnapshot,
        assigneeOrganizationId: input.assigneeOrganizationId ?? null,
        category: draft.category,
        claimPolicy: draft.claimPolicy,
        contactLabel: draft.contactLabel,
        contactTemplate: draft.contactTemplate,
        contactUrl: draft.contactUrl,
        contextJson: draft.contextJson as Prisma.InputJsonValue,
        description: draft.description,
        difficulty: draft.difficulty,
        dueAt: draft.dueAt,
        estimatedEffortHours: draft.estimatedEffortHours,
        impactStatement: draft.impactStatement,
        interestTags: draft.interestTags,
        isPublic: true,
        parentTaskId: input.parentTaskId,
        roleTitle: draft.roleTitle,
        skillTags: draft.skillTags,
        sortOrder: draft.sortOrder,
        status: draft.status,
        taskKey: draft.taskKey,
        title: draft.title,
      },
      update: {
        assigneeAffiliationSnapshot: draft.assigneeAffiliationSnapshot,
        assigneeOrganizationId: input.assigneeOrganizationId ?? null,
        category: draft.category,
        claimPolicy: draft.claimPolicy,
        contactLabel: draft.contactLabel,
        contactTemplate: draft.contactTemplate,
        contactUrl: draft.contactUrl,
        contextJson: draft.contextJson as Prisma.InputJsonValue,
        deletedAt: null,
        description: draft.description,
        difficulty: draft.difficulty,
        dueAt: draft.dueAt,
        estimatedEffortHours: draft.estimatedEffortHours,
        impactStatement: draft.impactStatement,
        interestTags: draft.interestTags,
        isPublic: true,
        parentTaskId: input.parentTaskId,
        roleTitle: draft.roleTitle,
        skillTags: draft.skillTags,
        sortOrder: draft.sortOrder,
        status: draft.status,
        title: draft.title,
      },
    });
  }

  const supporterTaskKeys = drafts.map((draft) => draft.taskKey);

  await db.task.updateMany({
    where: {
      deletedAt: null,
      parentTaskId: input.parentTaskId,
      taskKey: {
        notIn: supporterTaskKeys,
        startsWith: `${TREATY_SIGNER_TASK_KEY_PREFIX}:${input.slot.countryCode.toLowerCase()}:support:`,
      },
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return drafts;
}

export async function softDeleteMissingTreatySignerNetworkTasks(
  liveTaskKeys: string[],
  db: DbClient = prisma,
) {
  return db.task.updateMany({
    where: {
      deletedAt: null,
      taskKey: {
        notIn: liveTaskKeys,
        startsWith: TREATY_SIGNER_TASK_KEY_PREFIX,
      },
    },
    data: {
      deletedAt: new Date(),
    },
  });
}
