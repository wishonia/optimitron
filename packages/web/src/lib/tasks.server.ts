import {
  OrgType,
  TaskClaimPolicy,
  TaskClaimStatus,
  TaskImpactFrameKey,
  TaskStatus,
  type Prisma,
} from "@optimitron/db";
import { findOrCreateOrganization } from "@/lib/organization.server";
import { findOrCreatePerson } from "@/lib/person.server";
import { prisma } from "@/lib/prisma";
import { countTaskContactActions } from "@/lib/tasks/contact.server";
import {
  DEFAULT_TASK_IMPACT_FRAME,
  deriveImpactRatios,
  selectImpactFrame,
  type TaskImpactSelection,
} from "@/lib/tasks/impact";
import {
  rankTasksForUser,
  scoreTaskForAccountability,
} from "@/lib/tasks/rank-tasks";
import { grantWishes } from "@/lib/wishes.server";

const ACTIVE_CLAIM_STATUSES = [
  TaskClaimStatus.CLAIMED,
  TaskClaimStatus.IN_PROGRESS,
  TaskClaimStatus.COMPLETED,
] as const;

const CLAIM_STATUSES_THAT_BLOCK_RECLAIM = [
  TaskClaimStatus.CLAIMED,
  TaskClaimStatus.IN_PROGRESS,
  TaskClaimStatus.COMPLETED,
  TaskClaimStatus.VERIFIED,
] as const;

const sourceArtifactSelect = {
  artifactType: true,
  contentHash: true,
  externalKey: true,
  id: true,
  sourceKey: true,
  sourceRef: true,
  sourceSystem: true,
  sourceUrl: true,
  title: true,
  versionKey: true,
} satisfies Prisma.SourceArtifactSelect;

const taskSourceArtifactSelect = {
  isPrimary: true,
  sourceArtifact: {
    select: sourceArtifactSelect,
  },
} satisfies Prisma.TaskSourceArtifactSelect;

const impactMetricSelect = {
  baseValue: true,
  displayGroup: true,
  highValue: true,
  lowValue: true,
  metadataJson: true,
  metricKey: true,
  summaryStatsJson: true,
  unit: true,
  valueJson: true,
} satisfies Prisma.TaskImpactMetricSelect;

const impactFrameSelect = {
  annualDiscountRate: true,
  adoptionRampYears: true,
  benefitDurationYears: true,
  customFrameLabel: true,
  delayDalysLostPerDayBase: true,
  delayDalysLostPerDayHigh: true,
  delayDalysLostPerDayLow: true,
  delayEconomicValueUsdLostPerDayBase: true,
  delayEconomicValueUsdLostPerDayHigh: true,
  delayEconomicValueUsdLostPerDayLow: true,
  estimatedCashCostUsdBase: true,
  estimatedCashCostUsdHigh: true,
  estimatedCashCostUsdLow: true,
  estimatedEffortHoursBase: true,
  estimatedEffortHoursHigh: true,
  estimatedEffortHoursLow: true,
  evaluationHorizonYears: true,
  expectedDalysAvertedBase: true,
  expectedDalysAvertedHigh: true,
  expectedDalysAvertedLow: true,
  expectedEconomicValueUsdBase: true,
  expectedEconomicValueUsdHigh: true,
  expectedEconomicValueUsdLow: true,
  frameKey: true,
  frameSlug: true,
  medianHealthyLifeYearsEffectBase: true,
  medianHealthyLifeYearsEffectHigh: true,
  medianHealthyLifeYearsEffectLow: true,
  medianIncomeGrowthEffectPpPerYearBase: true,
  medianIncomeGrowthEffectPpPerYearHigh: true,
  medianIncomeGrowthEffectPpPerYearLow: true,
  metrics: {
    where: {
      deletedAt: null,
    },
    orderBy: [{ metricKey: "asc" }],
    select: impactMetricSelect,
  },
  successProbabilityBase: true,
  successProbabilityHigh: true,
  successProbabilityLow: true,
  summaryStatsJson: true,
  timeToImpactStartDays: true,
} satisfies Prisma.TaskImpactFrameEstimateSelect;

const impactEstimateSetSelect = {
  assumptionsJson: true,
  calculationVersion: true,
  counterfactualKey: true,
  createdAt: true,
  estimateKind: true,
  frames: {
    where: {
      deletedAt: null,
    },
    orderBy: [{ createdAt: "asc" }],
    select: impactFrameSelect,
  },
  id: true,
  isCurrent: true,
  methodologyKey: true,
  parameterSetHash: true,
  publicationStatus: true,
  sourceArtifacts: {
    where: {
      deletedAt: null,
    },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
    select: {
      isPrimary: true,
      sourceArtifact: {
        select: sourceArtifactSelect,
      },
    },
  },
  sourceSystem: true,
} satisfies Prisma.TaskImpactEstimateSetSelect;

const taskListSelect = {
  actualCashCostUsd: true,
  actualEffortSeconds: true,
  assigneeOrganization: {
    select: {
      contactEmail: true,
      id: true,
      logo: true,
      name: true,
      slug: true,
      type: true,
      website: true,
    },
  },
  assigneePerson: {
    select: {
      currentAffiliation: true,
      displayName: true,
      id: true,
      image: true,
      isPublicFigure: true,
    },
  },
  category: true,
  claimPolicy: true,
  claims: {
    where: {
      deletedAt: null,
    },
    select: {
      actualCashCostUsd: true,
      actualEffortSeconds: true,
      claimedAt: true,
      completedAt: true,
      completionEvidence: true,
      id: true,
      status: true,
      user: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
      userId: true,
      verificationNote: true,
      verifiedAt: true,
    },
  },
  completedAt: true,
  completionEvidence: true,
  contactLabel: true,
  contactTemplate: true,
  contactUrl: true,
  assigneeAffiliationSnapshot: true,
  currentImpactEstimateSet: {
    select: impactEstimateSetSelect,
  },
  description: true,
  difficulty: true,
  dueAt: true,
  estimatedEffortHours: true,
  id: true,
  interestTags: true,
  isPublic: true,
  maxClaims: true,
  roleTitle: true,
  parentTaskId: true,
  skillTags: true,
  sourceArtifacts: {
    where: {
      deletedAt: null,
    },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
    select: taskSourceArtifactSelect,
  },
  status: true,
  taskKey: true,
  title: true,
  verifiedAt: true,
} satisfies Prisma.TaskSelect;

const taskMilestoneSelect = {
  completedAt: true,
  description: true,
  evidenceNote: true,
  evidenceUrl: true,
  id: true,
  key: true,
  metadataJson: true,
  sortOrder: true,
  status: true,
  title: true,
  verifiedAt: true,
  verifiedByUser: {
    select: {
      id: true,
      name: true,
      username: true,
    },
  },
} satisfies Prisma.TaskMilestoneSelect;

const taskDetailSelect = {
  ...taskListSelect,
  childTasks: {
    where: {
      deletedAt: null,
      isPublic: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: taskListSelect,
  },
  contextJson: true,
  milestones: {
    where: {
      deletedAt: null,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: taskMilestoneSelect,
  },
  parentTask: {
    select: {
      id: true,
      title: true,
    },
  },
  verifiedByUser: {
    select: {
      id: true,
      name: true,
      username: true,
    },
  },
} satisfies Prisma.TaskSelect;

type TaskListItem = Prisma.TaskGetPayload<{ select: typeof taskListSelect }>;
type TaskDetailItem = Prisma.TaskGetPayload<{ select: typeof taskDetailSelect }>;
type TaskViewer = Awaited<ReturnType<typeof getTaskViewer>>;

function countActiveClaims(task: TaskListItem | TaskDetailItem) {
  return task.claims.filter((claim) =>
    ACTIVE_CLAIM_STATUSES.includes(claim.status as (typeof ACTIVE_CLAIM_STATUSES)[number]),
  ).length;
}

function hasViewerClaim(task: TaskListItem | TaskDetailItem, userId: string | null) {
  if (!userId) {
    return false;
  }

  return task.claims.some(
    (claim) =>
      claim.userId === userId &&
      CLAIM_STATUSES_THAT_BLOCK_RECLAIM.includes(
        claim.status as (typeof CLAIM_STATUSES_THAT_BLOCK_RECLAIM)[number],
      ),
  );
}

function getPrimaryTaskSourceArtifact(task: TaskListItem | TaskDetailItem) {
  return (
    task.sourceArtifacts.find((entry) => entry.isPrimary)?.sourceArtifact ??
    task.sourceArtifacts[0]?.sourceArtifact ??
    null
  );
}

function decorateTask<T extends TaskListItem | TaskDetailItem>(
  task: T,
  options?: {
    frameKey?: TaskImpactFrameKey | string | null;
    userId?: string | null;
  },
): T & {
  activeClaimCount: number;
  impact: {
    availableFrames: TaskImpactSelection["availableFrames"];
    confidenceSummary: unknown;
    costPerDalyUsd: number | null;
    currentSet: TaskImpactSelection["currentSet"];
    expectedValuePerDollar: number | null;
    expectedValuePerHourDalys: number | null;
    expectedValuePerHourUsd: number | null;
    selectedFrame: TaskImpactSelection["selectedFrame"];
    selectedMetrics: TaskImpactSelection["metricsByKey"];
  };
  primarySourceArtifact: ReturnType<typeof getPrimaryTaskSourceArtifact>;
  selectedImpactFrame: TaskImpactSelection["selectedFrame"];
  sourceUrl: string | null;
  viewerHasClaim: boolean;
} {
  const impactSelection = selectImpactFrame(
    task.currentImpactEstimateSet,
    options?.frameKey ?? DEFAULT_TASK_IMPACT_FRAME,
  );
  const primarySourceArtifact = getPrimaryTaskSourceArtifact(task);
  const derivedImpact = deriveImpactRatios(impactSelection.selectedFrame);
  const decoratedChildTasks: unknown[] | undefined =
    "childTasks" in task
      ? task.childTasks.map((childTask) => decorateTask(childTask, options))
      : undefined;

  return {
    ...task,
    activeClaimCount: countActiveClaims(task),
    ...(decoratedChildTasks ? { childTasks: decoratedChildTasks } : {}),
    impact: {
      availableFrames: impactSelection.availableFrames,
      confidenceSummary: impactSelection.selectedFrame?.summaryStatsJson ?? null,
      currentSet: impactSelection.currentSet,
      selectedFrame: impactSelection.selectedFrame,
      selectedMetrics: impactSelection.metricsByKey,
      ...derivedImpact,
    },
    primarySourceArtifact,
    selectedImpactFrame: impactSelection.selectedFrame,
    sourceUrl: primarySourceArtifact?.sourceUrl ?? null,
    viewerHasClaim: hasViewerClaim(task, options?.userId ?? null),
  } as T & {
    activeClaimCount: number;
    impact: {
      availableFrames: TaskImpactSelection["availableFrames"];
      confidenceSummary: unknown;
      costPerDalyUsd: number | null;
      currentSet: TaskImpactSelection["currentSet"];
      expectedValuePerDollar: number | null;
      expectedValuePerHourDalys: number | null;
      expectedValuePerHourUsd: number | null;
      selectedFrame: TaskImpactSelection["selectedFrame"];
      selectedMetrics: TaskImpactSelection["metricsByKey"];
    };
    primarySourceArtifact: ReturnType<typeof getPrimaryTaskSourceArtifact>;
    selectedImpactFrame: TaskImpactSelection["selectedFrame"];
    sourceUrl: string | null;
    viewerHasClaim: boolean;
  };
}

async function getTaskViewer(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      availableHoursPerWeek: true,
      id: true,
      isAdmin: true,
      interestTags: true,
      maxTaskDifficulty: true,
      personId: true,
      skillTags: true,
    },
  });
}

async function requireTaskReviewer(userId: string) {
  const reviewer = await prisma.user.findUniqueOrThrow({
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

function sortTasksForAccountability<T extends ReturnType<typeof decorateTask>>(tasks: T[]) {
  return [...tasks].sort((left, right) => {
    const rightScore = scoreTaskForAccountability(right);
    const leftScore = scoreTaskForAccountability(left);

    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    const rightVerifiedAt = right.verifiedAt?.getTime() ?? 0;
    const leftVerifiedAt = left.verifiedAt?.getTime() ?? 0;
    if (rightVerifiedAt !== leftVerifiedAt) {
      return rightVerifiedAt - leftVerifiedAt;
    }

    return (right.completedAt?.getTime() ?? 0) - (left.completedAt?.getTime() ?? 0);
  });
}

export async function getTasksPageData(
  userId?: string | null,
  options?: {
    frameKey?: TaskImpactFrameKey | string | null;
  },
) {
  const [viewer, allTasks, myClaims] = await Promise.all([
    userId ? getTaskViewer(userId) : Promise.resolve(null),
    prisma.task.findMany({
      where: {
        deletedAt: null,
        isPublic: true,
      },
      orderBy: [{ verifiedAt: "desc" }, { createdAt: "desc" }],
      take: 120,
      select: taskListSelect,
    }),
    userId
      ? prisma.taskClaim.findMany({
          where: {
            deletedAt: null,
            userId,
          },
          orderBy: [{ claimedAt: "desc" }],
          select: {
            actualCashCostUsd: true,
            actualEffortSeconds: true,
            claimedAt: true,
            completedAt: true,
            id: true,
            status: true,
            task: {
              select: taskListSelect,
            },
            verificationNote: true,
            verifiedAt: true,
          },
          take: 40,
        })
      : Promise.resolve([]),
  ]);

  const decoratedTasks = allTasks.map((task) =>
    decorateTask(task, {
      frameKey: options?.frameKey,
      userId: viewer?.id ?? null,
    }),
  );
  const allTasksSorted = sortTasksForAccountability(decoratedTasks);

  const assignedToYou =
    viewer?.personId != null
      ? sortTasksForAccountability(
          decoratedTasks.filter((task) => task.assigneePerson?.id === viewer.personId),
        )
      : [];

  const forYou =
    viewer == null
      ? []
      : rankTasksForUser(
          decoratedTasks.filter((task) => !task.viewerHasClaim),
          viewer,
          24,
        ).map((entry) => ({
          ...entry.task,
          recommendationScore: entry.score,
        }));

  return {
    allTasks: allTasksSorted,
    assignedToYou,
    forYou,
    myClaims: myClaims.map((claim) => ({
      ...claim,
      task: decorateTask(claim.task, {
        frameKey: options?.frameKey,
        userId,
      }),
    })),
    viewer,
  };
}

export async function getTaskDetailData(
  taskId: string,
  userId?: string | null,
  options?: {
    frameKey?: TaskImpactFrameKey | string | null;
  },
) {
  const [task, viewer, contactActionCount] = await Promise.all([
    prisma.task.findFirst({
      where: {
        deletedAt: null,
        id: taskId,
        isPublic: true,
      },
      select: taskDetailSelect,
    }),
    userId ? getTaskViewer(userId) : Promise.resolve(null),
    countTaskContactActions(taskId),
  ]);

  if (!task) {
    return null;
  }

  const viewerClaim =
    userId == null
      ? null
      : await prisma.taskClaim.findUnique({
          where: {
            taskId_userId: {
              taskId,
              userId,
            },
          },
          select: {
            actualCashCostUsd: true,
            actualEffortSeconds: true,
            claimedAt: true,
            completedAt: true,
            completionEvidence: true,
            id: true,
            status: true,
            verificationNote: true,
            verifiedAt: true,
          },
        });

  return {
    contactActionCount,
    task: decorateTask(task, {
      frameKey: options?.frameKey,
      userId: viewer?.id ?? null,
    }),
    viewer,
    viewerClaim,
  };
}

export async function listTasks(options?: {
  assigneeOrganizationId?: string | null;
  assigneePersonId?: string | null;
  frameKey?: TaskImpactFrameKey | string | null;
  status?: TaskStatus | null;
  userId?: string | null;
}) {
  const tasks = await prisma.task.findMany({
    where: {
      assigneeOrganizationId: options?.assigneeOrganizationId ?? undefined,
      assigneePersonId: options?.assigneePersonId ?? undefined,
      deletedAt: null,
      isPublic: true,
      status: options?.status ?? undefined,
    },
    orderBy: [{ verifiedAt: "desc" }, { createdAt: "desc" }],
    select: taskListSelect,
    take: 100,
  });

  return sortTasksForAccountability(
    tasks.map((task) =>
      decorateTask(task, {
        frameKey: options?.frameKey,
        userId: options?.userId ?? null,
      }),
    ),
  );
}

export async function claimTask(taskId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findUniqueOrThrow({
      where: { id: taskId },
      select: {
        claimPolicy: true,
        id: true,
        maxClaims: true,
        status: true,
      },
    });

    if (task.status !== TaskStatus.ACTIVE) {
      throw new Error("Task is not active.");
    }

    if (task.claimPolicy === TaskClaimPolicy.ASSIGNED_ONLY) {
      throw new Error("This task is assigned directly and cannot be claimed.");
    }

    const existingClaim = await tx.taskClaim.findUnique({
      where: {
        taskId_userId: {
          taskId,
          userId,
        },
      },
    });

    if (
      existingClaim &&
      CLAIM_STATUSES_THAT_BLOCK_RECLAIM.includes(
        existingClaim.status as (typeof CLAIM_STATUSES_THAT_BLOCK_RECLAIM)[number],
      )
    ) {
      return existingClaim;
    }

    const activeClaimCount = await tx.taskClaim.count({
      where: {
        deletedAt: null,
        status: {
          in: [...ACTIVE_CLAIM_STATUSES],
        },
        taskId,
      },
    });

    if (task.claimPolicy === TaskClaimPolicy.OPEN_SINGLE && activeClaimCount > 0) {
      throw new Error("This task already has an active claimant.");
    }

    if (
      task.claimPolicy === TaskClaimPolicy.OPEN_MANY &&
      task.maxClaims != null &&
      activeClaimCount >= task.maxClaims
    ) {
      throw new Error("This task has reached its claim limit.");
    }

    if (existingClaim) {
      return tx.taskClaim.update({
        where: { id: existingClaim.id },
        data: {
          abandonedAt: null,
          actualCashCostUsd: null,
          actualEffortSeconds: null,
          claimedAt: new Date(),
          completedAt: null,
          completionEvidence: null,
          deletedAt: null,
          startedAt: null,
          status: TaskClaimStatus.CLAIMED,
          verificationNote: null,
          verifiedAt: null,
          verifiedByUserId: null,
        },
      });
    }

    return tx.taskClaim.create({
      data: {
        status: TaskClaimStatus.CLAIMED,
        taskId,
        userId,
      },
    });
  });
}

export async function completeTaskClaim(
  taskId: string,
  userId: string,
  completionEvidence: string,
  actuals?: {
    actualCashCostUsd?: number | null;
    actualEffortSeconds?: number | null;
  },
) {
  const evidence = completionEvidence.trim();

  if (!evidence) {
    throw new Error("Completion evidence is required.");
  }

  const claim = await prisma.taskClaim.findUniqueOrThrow({
    where: {
      taskId_userId: {
        taskId,
        userId,
      },
    },
    select: {
      claimedAt: true,
      id: true,
      startedAt: true,
      status: true,
    },
  });

  if (
    claim.status !== TaskClaimStatus.CLAIMED &&
    claim.status !== TaskClaimStatus.IN_PROGRESS
  ) {
    throw new Error("Only active claims can be completed.");
  }

  return prisma.taskClaim.update({
    where: { id: claim.id },
    data: {
      actualCashCostUsd: actuals?.actualCashCostUsd ?? null,
      actualEffortSeconds: actuals?.actualEffortSeconds ?? null,
      completedAt: new Date(),
      completionEvidence: evidence,
      startedAt: claim.startedAt ?? claim.claimedAt,
      status: TaskClaimStatus.COMPLETED,
    },
  });
}

export async function verifyTask(
  taskId: string,
  reviewerUserId: string,
  input: {
    actualCashCostUsd?: number | null;
    actualEffortSeconds?: number | null;
    claimId?: string | null;
    completionEvidence?: string | null;
    verificationNote?: string | null;
  },
) {
  await requireTaskReviewer(reviewerUserId);

  const result = await prisma.$transaction(async (tx) => {
    const task = await tx.task.findUniqueOrThrow({
      where: { id: taskId },
      select: {
        claimPolicy: true,
        id: true,
        status: true,
      },
    });

    if (input.claimId) {
      const claim = await tx.taskClaim.findUniqueOrThrow({
        where: { id: input.claimId },
        select: {
          completionEvidence: true,
          id: true,
          status: true,
          taskId: true,
          userId: true,
        },
      });

      if (claim.taskId !== task.id) {
        throw new Error("Claim does not belong to this task.");
      }

      if (claim.status !== TaskClaimStatus.COMPLETED) {
        throw new Error("Claim must be completed before it can be verified.");
      }

      if (!claim.completionEvidence?.trim()) {
        throw new Error("Claim completion evidence is required before verification.");
      }

      const verifiedClaim = await tx.taskClaim.update({
        where: { id: claim.id },
        data: {
          actualCashCostUsd: input.actualCashCostUsd ?? undefined,
          actualEffortSeconds: input.actualEffortSeconds ?? undefined,
          status: TaskClaimStatus.VERIFIED,
          verificationNote: input.verificationNote?.trim() || null,
          verifiedAt: new Date(),
          verifiedByUserId: reviewerUserId,
        },
      });

      if (task.claimPolicy !== TaskClaimPolicy.OPEN_MANY) {
        await tx.task.update({
          where: { id: task.id },
          data: {
            completedAt: new Date(),
            status: TaskStatus.VERIFIED,
            verifiedAt: new Date(),
            verifiedByUserId: reviewerUserId,
          },
        });
      }

      return {
        rewardUserId: claim.userId,
        rewardKey: `task:${task.id}:claim:${claim.id}:verified`,
        value: verifiedClaim,
      };
    }

    const evidence = input.completionEvidence?.trim();

    if (!evidence) {
      throw new Error("Completion evidence is required.");
    }

    return {
      rewardKey: null,
      rewardUserId: null,
      value: await tx.task.update({
        where: { id: task.id },
        data: {
          actualCashCostUsd: input.actualCashCostUsd ?? null,
          actualEffortSeconds: input.actualEffortSeconds ?? null,
          completedAt: new Date(),
          completionEvidence: evidence,
          status: TaskStatus.VERIFIED,
          verifiedAt: new Date(),
          verifiedByUserId: reviewerUserId,
        },
      }),
    };
  });

  if (result.rewardUserId && result.rewardKey) {
    await grantWishes({
      dedupeKey: result.rewardKey,
      reason: "TASK_COMPLETED",
      userId: result.rewardUserId,
    });
  }

  return result.value;
}

export async function reassignTask(
  taskId: string,
  reviewerUserId: string,
  input: {
    currentAffiliation?: string | null;
    displayName?: string | null;
    email?: string | null;
    organizationId?: string | null;
    organizationName?: string | null;
    organizationType?: OrgType | null;
    personId?: string | null;
    roleTitle?: string | null;
  },
) {
  await requireTaskReviewer(reviewerUserId);

  const assigneeOrganization =
    input.organizationId?.trim()
      ? await prisma.organization.findUniqueOrThrow({
          where: { id: input.organizationId.trim() },
        })
      : input.organizationName?.trim()
        ? await findOrCreateOrganization({
            name: input.organizationName.trim(),
            type: input.organizationType ?? undefined,
          })
        : null;

  const shouldResolvePerson =
    Boolean(input.personId?.trim()) ||
    Boolean(input.displayName?.trim()) ||
    Boolean(input.email?.trim());

  const assigneePerson =
    !shouldResolvePerson
      ? null
      : input.personId?.trim()
        ? await prisma.person.findUniqueOrThrow({
            where: { id: input.personId.trim() },
          })
        : await findOrCreatePerson({
            currentAffiliation: input.currentAffiliation ?? assigneeOrganization?.name ?? null,
            displayName: input.displayName?.trim() || "",
            email: input.email ?? null,
            isPublicFigure: true,
            roleTitle: input.roleTitle ?? null,
          });

  return prisma.task.update({
    where: { id: taskId },
    data: {
      assigneeOrganizationId: assigneeOrganization?.id ?? null,
      assigneePersonId: assigneePerson?.id ?? null,
      assigneeAffiliationSnapshot:
        input.currentAffiliation ??
        assigneeOrganization?.name ??
        assigneePerson?.currentAffiliation ??
        null,
      roleTitle: input.roleTitle ?? null,
    },
  });
}
