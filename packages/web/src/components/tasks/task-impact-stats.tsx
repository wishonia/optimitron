import Link from "next/link";
import {
  formatCompactCount,
  formatCompactCurrency,
  formatDelayDuration,
  type TaskDelayStats,
} from "@/lib/tasks/accountability";

interface TaskImpactStatsProps {
  delayStats: TaskDelayStats;
  /** "full" shows overdue + totals + per-day rates. "compact" shows just totals. */
  variant?: "full" | "compact";
  /** Link to the calculation methodology page */
  calculationsUrl?: string | null;
}

function StatBox({
  label,
  value,
  accent = "red",
}: {
  label: string;
  value: string;
  accent?: "red" | "pink";
}) {
  const accentClass = accent === "red"
    ? "text-brutal-red"
    : "text-brutal-pink";
  return (
    <div className="border-4 border-foreground bg-muted/20 p-3">
      <p className={`text-xs font-black uppercase tracking-[0.18em] ${accentClass}`}>
        {label}
      </p>
      <p className="mt-2 text-2xl font-black uppercase">{value}</p>
    </div>
  );
}

export function TaskImpactStats({ delayStats, variant = "full", calculationsUrl }: TaskImpactStatsProps) {
  const dalysFromDelay =
    delayStats.delayDalysLostPerDay != null
      ? delayStats.delayDalysLostPerDay * delayStats.currentDelayDays
      : null;

  const hasPerDayData =
    delayStats.delayEconomicValueUsdLostPerDay != null ||
    delayStats.delayDalysLostPerDay != null;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-3">
        {delayStats.isOverdue ? (
          <StatBox label="Days Overdue" value={formatDelayDuration(delayStats.currentDelayDays)} />
        ) : null}
        {dalysFromDelay != null ? (
          <StatBox label="DALYs Lost From Delay" value={formatCompactCount(dalysFromDelay)} />
        ) : delayStats.currentHumanLivesLost != null ? (
          <StatBox label="Deaths From Delay" value={formatCompactCount(delayStats.currentHumanLivesLost)} />
        ) : null}
        {delayStats.currentEconomicValueUsdLost != null ? (
          <StatBox label="Economic Loss From Delay" value={formatCompactCurrency(delayStats.currentEconomicValueUsdLost)} />
        ) : null}
      </div>

      {variant === "full" && hasPerDayData ? (
        <div className="grid gap-3 md:grid-cols-2">
          {delayStats.delayDalysLostPerDay != null ? (
            <StatBox label="DALYs Lost Per Day" value={formatCompactCount(delayStats.delayDalysLostPerDay)} accent="pink" />
          ) : null}
          {delayStats.delayEconomicValueUsdLostPerDay != null ? (
            <StatBox label="Economic Loss Per Day" value={formatCompactCurrency(delayStats.delayEconomicValueUsdLostPerDay)} accent="pink" />
          ) : null}
        </div>
      ) : null}

      {calculationsUrl ? (
        <Link
          href={calculationsUrl}
          target="_blank"
          className="text-xs font-bold underline underline-offset-4 text-muted-foreground"
        >
          View calculations and methodology
        </Link>
      ) : null}
    </div>
  );
}
