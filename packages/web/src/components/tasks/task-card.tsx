import Link from "next/link";
import {
  TaskClaimPolicy,
  TaskStatus,
  type TaskCategory,
  type TaskDifficulty,
} from "@optimitron/db";
import { TaskShareButtons } from "@/components/tasks/TaskShareButtons";
import { TaskClaimButton } from "@/components/tasks/TaskClaimButton";
import { Avatar } from "@/components/retroui/Avatar";
import { ArcadeTag } from "@/components/ui/arcade-tag";
import { BrutalCard, type BrutalCardBgColor } from "@/components/ui/brutal-card";
import { getSignInPath, ROUTES } from "@/lib/routes";
import {
  buildTaskShareText,
  formatCompactCount,
  formatCompactCurrency,
  formatDelayDuration,
  getTaskDelayStats,
} from "@/lib/tasks/accountability";
import type {
  TaskImpactFrameSummary,
  TaskImpactMetricSummary,
} from "@/lib/tasks/impact";
import { canTaskAcceptMoreClaims } from "@/lib/tasks/rank-tasks";

export interface TaskCardTask {
  activeClaimCount: number;
  assigneeAffiliationSnapshot: string | null;
  assigneeOrganization: {
    id: string;
    logo: string | null;
    name: string;
    slug: string;
    type: string;
  } | null;
  assigneePerson: {
    currentAffiliation: string | null;
    displayName: string;
    id: string;
    image: string | null;
    isPublicFigure: boolean;
  } | null;
  category: TaskCategory;
  claimPolicy: TaskClaimPolicy;
  completedAt: Date | null;
  description: string;
  difficulty: TaskDifficulty;
  dueAt: Date | null;
  estimatedEffortHours: number | null;
  id: string;
  impact?: {
    selectedFrame?: TaskImpactFrameSummary | null;
    selectedMetrics?: Record<string, TaskImpactMetricSummary> | null;
  };
  interestTags: string[];
  maxClaims: number | null;
  roleTitle: string | null;
  recommendationScore?: number;
  sourceUrl: string | null;
  status: TaskStatus;
  title: string;
  skillTags: string[];
  verifiedAt: Date | null;
  viewerHasClaim: boolean;
}

function getCardColor(task: TaskCardTask): BrutalCardBgColor {
  if (task.claimPolicy === TaskClaimPolicy.ASSIGNED_ONLY) {
    return "yellow";
  }

  if (task.status === TaskStatus.VERIFIED) {
    return "green";
  }

  if (task.viewerHasClaim) {
    return "cyan";
  }

  return "background";
}

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}

function formatDueDate(value: Date) {
  return value.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TaskCard({
  showRecommendationScore = false,
  signedIn,
  task,
}: {
  showRecommendationScore?: boolean;
  signedIn: boolean;
  task: TaskCardTask;
}) {
  const delayStats = getTaskDelayStats(task);
  const canClaim = canTaskAcceptMoreClaims({
    activeClaimCount: task.activeClaimCount,
    claimPolicy: task.claimPolicy,
    difficulty: task.difficulty,
    estimatedEffortHours: task.estimatedEffortHours,
    interestTags: task.interestTags,
    maxClaims: task.maxClaims,
    skillTags: task.skillTags,
    status: task.status,
  });
  const signInHref = getSignInPath(ROUTES.tasks);
  const targetLabel =
    task.assigneePerson?.displayName ?? task.assigneeOrganization?.name ?? task.title;
  const shareText = buildTaskShareText({
    currentDelayDays: delayStats.currentDelayDays,
    currentEconomicValueUsdLost: delayStats.currentEconomicValueUsdLost,
    currentHumanLivesLost: delayStats.currentHumanLivesLost,
    currentSufferingHoursLost: delayStats.currentSufferingHoursLost,
    targetLabel,
    taskTitle: task.title,
  });
  const fallbackInitials = targetLabel
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <BrutalCard bgColor={getCardColor(task)} className="h-full" hover padding="lg">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <ArcadeTag>{task.category.toLowerCase()}</ArcadeTag>
          <ArcadeTag>{task.difficulty.toLowerCase()}</ArcadeTag>
          <ArcadeTag>
            {task.claimPolicy === TaskClaimPolicy.ASSIGNED_ONLY
              ? "assigned"
              : task.claimPolicy === TaskClaimPolicy.OPEN_SINGLE
                ? "single-active"
                : "open-many"}
          </ArcadeTag>
          {task.dueAt ? (
            <ArcadeTag>
              {task.dueAt.getTime() < Date.now() ? "overdue" : `due ${formatDueDate(task.dueAt)}`}
            </ArcadeTag>
          ) : null}
          {task.estimatedEffortHours != null ? (
            <ArcadeTag>{`${task.estimatedEffortHours}h`}</ArcadeTag>
          ) : null}
          {showRecommendationScore && typeof task.recommendationScore === "number" ? (
            <ArcadeTag>{`fit ${Math.round(task.recommendationScore * 100)}`}</ArcadeTag>
          ) : null}
        </div>

        <div className="space-y-2">
          {task.assigneePerson || task.assigneeOrganization ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 border-4 border-foreground bg-muted">
                <Avatar.Image
                  alt={targetLabel}
                  src={task.assigneePerson?.image ?? task.assigneeOrganization?.logo ?? undefined}
                />
                <Avatar.Fallback className="bg-brutal-pink font-black text-background">
                  {fallbackInitials || "?"}
                </Avatar.Fallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-pink">
                  Accountability Target
                </p>
                <p className="truncate text-sm font-black uppercase">{targetLabel}</p>
              </div>
            </div>
          ) : null}
          <Link href={`/tasks/${task.id}`} className="block">
            <h3 className="text-2xl font-black uppercase leading-tight underline-offset-4 hover:underline">
              {task.title}
            </h3>
          </Link>
          <p className="text-sm font-bold leading-6">
            {truncate(task.description, 220)}
          </p>
        </div>

        <div className="space-y-2 text-sm font-bold">
          {task.assigneePerson ? (
            <p>
              Assigned to{" "}
              <span className="underline underline-offset-4">
                {task.assigneePerson.displayName}
              </span>
              {task.roleTitle ? `, ${task.roleTitle}` : ""}
            </p>
          ) : null}
          {!task.assigneePerson && task.assigneeOrganization ? (
            <p>
              Assigned to{" "}
              <span className="underline underline-offset-4">
                {task.assigneeOrganization.name}
              </span>
              {task.roleTitle ? `, ${task.roleTitle}` : ""}
            </p>
          ) : null}
          {task.assigneeAffiliationSnapshot || task.assigneePerson?.currentAffiliation ? (
            <p>
              {task.assigneeAffiliationSnapshot ??
                task.assigneeOrganization?.name ??
                task.assigneePerson?.currentAffiliation}
            </p>
          ) : null}
          {task.skillTags.length > 0 ? (
            <p>{`Skills: ${task.skillTags.slice(0, 4).join(", ")}`}</p>
          ) : null}
          {task.interestTags.length > 0 ? (
            <p>{`Interests: ${task.interestTags.slice(0, 4).join(", ")}`}</p>
          ) : null}
          {delayStats.isOverdue ? (
            <div className="space-y-1 border-t-2 border-foreground/20 pt-2">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-red">
                Delay Clock
              </p>
              <p>{`${formatDelayDuration(delayStats.currentDelayDays)} overdue`}</p>
              <p>{`${formatCompactCurrency(delayStats.currentEconomicValueUsdLost)} lost so far`}</p>
              {delayStats.currentHumanLivesLost != null ? (
                <p>{`${formatCompactCount(delayStats.currentHumanLivesLost)} lives delayed`}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3">
          <TaskClaimButton
            canClaim={canClaim}
            signedIn={signedIn}
            signInHref={signInHref}
            taskId={task.id}
            viewerHasClaim={task.viewerHasClaim}
          />
          <Link
            className="text-sm font-black uppercase underline underline-offset-4"
            href={`/tasks/${task.id}`}
          >
            Details
          </Link>
          {task.sourceUrl ? (
            <Link
              className="text-sm font-black uppercase underline underline-offset-4"
              href={task.sourceUrl}
              target="_blank"
            >
              Source
            </Link>
          ) : null}
        </div>

        {task.claimPolicy === TaskClaimPolicy.ASSIGNED_ONLY &&
        (task.assigneePerson || task.assigneeOrganization) ? (
          <TaskShareButtons
            taskId={task.id}
            shareText={shareText}
            taskTitle={task.title}
          />
        ) : null}
      </div>
    </BrutalCard>
  );
}
