import Link from "next/link";
import { Avatar } from "@/components/retroui/Avatar";
import {
  buildTaskShareText,
  formatCompactCount,
  formatCompactCurrency,
  formatDelayDuration,
  getTaskDelayStats,
} from "@/lib/tasks/accountability";
import type { TaskCardTask } from "./task-card";
import { TaskRowShare } from "./task-row-share";

export type TaskSortKey =
  | "title"
  | "assignee"
  | "status"
  | "annualHealthyYears"
  | "annualEconLoss"
  | "costPerHealthyYear";

/** Format cost per healthy year with enough precision for sub-penny values (e.g. $0.00177). */
function formatCostPerHealthyYear(value: number): string {
  if (value >= 1) {
    return formatCompactCurrency(value);
  }
  if (value >= 0.01) {
    return `$${value.toFixed(2)}`;
  }
  // Sub-penny — use 3 significant figures
  return `$${value.toPrecision(3)}`;
}

function formatDueDate(value: Date) {
  return value.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

function ImpactCell({
  value,
  href,
  className,
}: {
  value: string;
  href: string | null;
  className?: string;
}) {
  const base = `${className ?? ""} shrink-0 text-right text-xs font-bold text-muted-foreground`;
  if (href && value !== "—") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} underline underline-offset-4 hover:text-foreground`}
      >
        {value}
      </a>
    );
  }
  return <span className={base}>{value}</span>;
}

function StatusBadge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "overdue" | "done" }) {
  const colors = {
    default: "bg-muted text-muted-foreground",
    overdue: "bg-brutal-red text-brutal-red-foreground",
    done: "bg-brutal-green text-brutal-green-foreground",
  };
  return (
    <span className={`inline-block rounded-sm border-2 border-foreground px-2 py-0.5 text-xs font-bold ${colors[variant]}`}>
      {children}
    </span>
  );
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

const SORT_LABELS: Record<TaskSortKey, string> = {
  title: "Task",
  assignee: "Assignee",
  status: "Status",
  annualHealthyYears: "Healthy Years / Year",
  annualEconLoss: "Economic Loss / Year",
  costPerHealthyYear: "Cost / Healthy Year",
};

export function TaskTableHeader({
  sortKey,
  sortDir,
  onSort,
}: {
  sortKey?: TaskSortKey;
  sortDir?: "asc" | "desc";
  onSort?: (key: TaskSortKey) => void;
}) {
  function headerCell(key: TaskSortKey, className: string) {
    const isActive = sortKey === key;
    const arrow = isActive ? (sortDir === "asc" ? " \u2191" : " \u2193") : "";
    return (
      <span
        className={`${className} ${onSort ? "cursor-pointer select-none hover:text-foreground" : ""}`}
        onClick={onSort ? () => onSort(key) : undefined}
      >
        {SORT_LABELS[key]}{arrow}
      </span>
    );
  }

  const hdr = "text-xs font-bold uppercase tracking-wide text-muted-foreground";

  return (
    <div className="flex items-center gap-3 border-b-2 border-foreground bg-muted/30 px-4 py-2">
      <span className="h-8 w-8 shrink-0" />
      {headerCell("assignee", `hidden w-36 shrink-0 sm:block ${hdr}`)}
      {headerCell("title", `min-w-0 flex-1 ${hdr}`)}
      {headerCell("status", `hidden shrink-0 sm:block ${hdr}`)}
      {headerCell("annualHealthyYears", `hidden w-32 shrink-0 text-right lg:block ${hdr}`)}
      {headerCell("annualEconLoss", `hidden w-32 shrink-0 text-right lg:block ${hdr}`)}
      {headerCell("costPerHealthyYear", `hidden w-28 shrink-0 text-right xl:block ${hdr}`)}
      <span className="hidden shrink-0 md:block text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Share
      </span>
      <span className="w-12 shrink-0" />
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

  // Annualized rates: per-day × 365 = per-year delay cost
  const perDayDalys = task.impact?.selectedFrame?.delayDalysLostPerDayBase;
  const perDayEcon = task.impact?.selectedFrame?.delayEconomicValueUsdLostPerDayBase;
  const annualHealthyYears = perDayDalys != null && perDayDalys > 0 ? perDayDalys * 365 : null;
  const annualEconLoss = perDayEcon != null && perDayEcon > 0 ? perDayEcon * 365 : null;
  const costPerHealthyYear = task.impact?.costPerDalyUsd;

  const calculationsUrl =
    (task.currentImpactEstimateSet?.assumptionsJson as { calculationsUrl?: string } | null)
      ?.calculationsUrl ?? null;
  const assigneeHref = task.assigneePerson
    ? `/people/${task.assigneePerson.id}`
    : null;

  const avatarEl = (
    <Avatar className="h-8 w-8 shrink-0 border-2 border-foreground bg-muted">
      <Avatar.Image
        alt={targetLabel}
        src={task.assigneePerson?.image ?? task.assigneeOrganization?.logo ?? undefined}
      />
      <Avatar.Fallback className="bg-brutal-pink text-xs font-black text-background">
        {fallbackInitials || "?"}
      </Avatar.Fallback>
    </Avatar>
  );

  return (
    <div
      className={`flex items-center gap-3 border-l-4 px-4 py-3 transition-colors hover:bg-muted/50 ${getLeftBorderColor(task)}`}
    >
      {assigneeHref ? (
        <Link href={assigneeHref} className="shrink-0" title={targetLabel}>
          {avatarEl}
        </Link>
      ) : (
        avatarEl
      )}

      {assigneeHref ? (
        <Link
          href={assigneeHref}
          className="hidden w-36 shrink-0 truncate text-xs font-bold uppercase underline-offset-4 hover:underline sm:block"
        >
          {targetLabel}
        </Link>
      ) : (
        <span className="hidden w-36 shrink-0 truncate text-xs font-bold uppercase sm:block">
          {targetLabel}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <Link
          href={`/tasks/${task.id}`}
          className="block truncate text-sm font-bold underline-offset-4 hover:underline"
        >
          {task.title}
        </Link>
        {/* Mobile badges — show data from hidden columns */}
        <div className="mt-1 flex flex-wrap gap-1 lg:hidden">
          {isOverdue ? (
            <StatusBadge variant="overdue">
              {delayStats.currentDelayDays > 365
                ? `${formatDelayDuration(delayStats.currentDelayDays)} overdue`
                : "overdue"}
            </StatusBadge>
          ) : task.dueAt ? (
            <StatusBadge>{`due ${formatDueDate(task.dueAt)}`}</StatusBadge>
          ) : task.status === "VERIFIED" ? (
            <StatusBadge variant="done">verified</StatusBadge>
          ) : null}
          {annualHealthyYears != null ? (
            <StatusBadge>{formatCompactCount(annualHealthyYears)} healthy years/yr lost</StatusBadge>
          ) : null}
          {annualEconLoss != null ? (
            <StatusBadge>{formatCompactCurrency(annualEconLoss)}/yr lost</StatusBadge>
          ) : null}
          {costPerHealthyYear != null ? (
            <StatusBadge>{formatCostPerHealthyYear(costPerHealthyYear)}/healthy year</StatusBadge>
          ) : null}
        </div>
      </div>

      {/* Desktop status */}
      <div className="hidden shrink-0 sm:block lg:hidden">
        {isOverdue ? (
          <StatusBadge variant="overdue">
            {delayStats.currentDelayDays > 365
              ? `${formatDelayDuration(delayStats.currentDelayDays)} overdue`
              : "overdue"}
          </StatusBadge>
        ) : task.dueAt ? (
          <StatusBadge>{`due ${formatDueDate(task.dueAt)}`}</StatusBadge>
        ) : task.status === "VERIFIED" ? (
          <StatusBadge variant="done">verified</StatusBadge>
        ) : null}
      </div>

      {/* Healthy Years Lost Per Year — desktop */}
      <ImpactCell
        value={annualHealthyYears != null ? formatCompactCount(annualHealthyYears) : "—"}
        href={calculationsUrl}
        className="hidden w-32 lg:block"
      />

      {/* Economic Loss Per Year — desktop */}
      <ImpactCell
        value={annualEconLoss != null ? formatCompactCurrency(annualEconLoss) : "—"}
        href={calculationsUrl}
        className="hidden w-32 lg:block"
      />

      {/* Cost per Healthy Year — xl desktop */}
      <ImpactCell
        value={costPerHealthyYear != null ? formatCostPerHealthyYear(costPerHealthyYear) : "—"}
        href={calculationsUrl}
        className="hidden w-28 xl:block"
      />

      <div className="hidden shrink-0 md:block">
        {task.isPublic ? (
          <TaskRowShare shareText={shareText} taskId={task.id} />
        ) : null}
      </div>

      <Link
        href={`/tasks/${task.id}`}
        className="w-12 shrink-0 text-right text-xs font-bold uppercase underline underline-offset-4"
      >
        Details
      </Link>
    </div>
  );
}

export function getTaskSortValue(task: TaskCardTask, key: TaskSortKey): string | number {
  switch (key) {
    case "annualHealthyYears": {
      const perDay = task.impact?.selectedFrame?.delayDalysLostPerDayBase;
      return perDay != null ? perDay * 365 : 0;
    }
    case "annualEconLoss": {
      const perDay = task.impact?.selectedFrame?.delayEconomicValueUsdLostPerDayBase;
      return perDay != null ? perDay * 365 : 0;
    }
    case "costPerHealthyYear":
      // Lower cost/DALY = more cost-effective, so put best-first via ascending sort
      return task.impact?.costPerDalyUsd ?? Infinity;
    case "assignee":
      return task.assigneePerson?.displayName ?? task.assigneeOrganization?.name ?? "";
    case "status":
      return task.dueAt?.getTime() ?? Infinity;
    case "title":
      return task.title;
  }
}
