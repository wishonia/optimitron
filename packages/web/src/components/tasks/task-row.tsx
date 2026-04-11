import Link from "next/link";
import { Avatar } from "@/components/retroui/Avatar";
import { ArcadeTag } from "@/components/ui/arcade-tag";
import {
  buildTaskShareText,
  formatDelayDuration,
  getTaskDelayStats,
} from "@/lib/tasks/accountability";
import type { TaskCardTask } from "./task-card";
import { TaskRowShare } from "./task-row-share";

function formatDueDate(value: Date) {
  return value.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

function getLeftBorderColor(task: TaskCardTask): string {
  const econ = task.impact?.selectedFrame?.expectedEconomicValueUsdBase;
  const dalys = task.impact?.selectedFrame?.expectedDalysAvertedBase;
  const hasNegative = (econ != null && econ < 0) || (dalys != null && dalys < 0);

  if (task.status === "VERIFIED" && hasNegative) return "border-l-brutal-red";
  if (task.claimPolicy === "ASSIGNED_ONLY") return "border-l-brutal-yellow";
  if (task.viewerHasClaim) return "border-l-brutal-cyan";
  return "border-l-muted";
}

export function TaskTableHeader() {
  return (
    <div className="flex items-center gap-3 border-b-2 border-foreground bg-muted/30 px-4 py-2">
      <span className="h-8 w-8 shrink-0" />
      <span className="hidden w-36 shrink-0 text-xs font-black uppercase tracking-wide text-muted-foreground sm:block">
        Assignee
      </span>
      <span className="min-w-0 flex-1 text-xs font-black uppercase tracking-wide text-muted-foreground">
        Task
      </span>
      <span className="hidden shrink-0 text-xs font-black uppercase tracking-wide text-muted-foreground sm:block">
        Status
      </span>
      <span className="hidden shrink-0 text-xs font-black uppercase tracking-wide text-muted-foreground md:block">
        Share
      </span>
      <span className="shrink-0 text-xs font-black uppercase tracking-wide text-muted-foreground">
        &nbsp;
      </span>
    </div>
  );
}

export function TaskRow({
  task,
}: {
  task: TaskCardTask;
}) {
  const delayStats = getTaskDelayStats(task);
  const targetLabel =
    task.assigneePerson?.displayName ?? task.assigneeOrganization?.name ?? task.title;
  const fallbackInitials = targetLabel
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const shareText = buildTaskShareText({
    currentDelayDays: delayStats.currentDelayDays,
    currentEconomicValueUsdLost: delayStats.currentEconomicValueUsdLost,
    currentHumanLivesLost: delayStats.currentHumanLivesLost,
    currentSufferingHoursLost: delayStats.currentSufferingHoursLost,
    targetLabel,
    taskTitle: task.title,
  });

  const isOverdue = task.dueAt != null && task.dueAt.getTime() < Date.now();

  return (
    <div
      className={`flex items-center gap-3 border-l-4 px-4 py-3 transition-colors hover:bg-muted/50 ${getLeftBorderColor(task)}`}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0 border-2 border-foreground bg-muted">
        <Avatar.Image
          alt={targetLabel}
          src={task.assigneePerson?.image ?? task.assigneeOrganization?.logo ?? undefined}
        />
        <Avatar.Fallback className="bg-brutal-pink text-xs font-black text-background">
          {fallbackInitials || "?"}
        </Avatar.Fallback>
      </Avatar>

      {/* Assignee name */}
      <span className="hidden w-36 shrink-0 truncate text-xs font-black uppercase sm:block">
        {targetLabel}
      </span>

      {/* Title */}
      <Link
        href={`/tasks/${task.id}`}
        className="min-w-0 flex-1 truncate text-sm font-black uppercase underline-offset-4 hover:underline"
      >
        {task.title}
      </Link>

      {/* Status tag */}
      <div className="hidden shrink-0 sm:block">
        {isOverdue ? (
          <ArcadeTag>{delayStats.currentDelayDays > 365
            ? `${formatDelayDuration(delayStats.currentDelayDays)} overdue`
            : "overdue"}</ArcadeTag>
        ) : task.dueAt ? (
          <ArcadeTag>{`due ${formatDueDate(task.dueAt)}`}</ArcadeTag>
        ) : task.status === "VERIFIED" ? (
          <ArcadeTag>verified</ArcadeTag>
        ) : null}
      </div>

      {/* Share icons */}
      <div className="hidden shrink-0 md:block">
        {task.isPublic ? (
          <TaskRowShare shareText={shareText} taskId={task.id} />
        ) : null}
      </div>

      {/* Details link */}
      <Link
        href={`/tasks/${task.id}`}
        className="shrink-0 text-xs font-black uppercase underline underline-offset-4"
      >
        Details
      </Link>
    </div>
  );
}
