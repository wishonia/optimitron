import Link from "next/link";
import { Button } from "@/components/retroui/Button";
import { ArcadeTag } from "@/components/ui/arcade-tag";
import { BrutalCard } from "@/components/ui/brutal-card";
import {
  formatCompactCount,
  formatCompactCurrency,
  formatDelayDuration,
} from "@/lib/tasks/accountability";

interface ReminderActionCardProps {
  href: string;
  currentEconomicValueUsdLost: number | null;
  currentWorstDelayDays: number;
  currentHumanLivesLost: number | null;
  currentSufferingHoursLost: number | null;
  harmfulTaskCount?: number;
  overdueTaskCount: number;
  sampleTargets: string[];
  totalHarmCostUsd?: number;
}

function getEscalatedCopy(
  delayDays: number,
  harmfulTaskCount: number | undefined,
  totalHarmCostUsd: number | undefined,
) {
  const hasHarmData = (harmfulTaskCount ?? 0) > 0 && (totalHarmCostUsd ?? 0) > 0;

  if (delayDays > 730) {
    return {
      heading: "Your Employees Have Had Two Years. They Chose Golf.",
      body: hasHarmData
        ? `Below are your employees. In the time they have not signed the 1% Treaty, they completed ${harmfulTaskCount} activities that cost you ${formatCompactCurrency(totalHarmCostUsd ?? 0)} and helped no one. The treaty costs nothing and takes thirty seconds. On my planet, this would be considered a resignation event. On yours, it appears to be called "Tuesday."`
        : "Below are your employees. They have had over two years. The treaty takes thirty seconds. On my planet, a governance system this slow would be considered broken. On yours, it appears to be working as designed. That is the problem.",
    };
  }

  if (delayDays > 365) {
    return {
      heading: "Over A Year. Still No Signature. Still More Golf.",
      body: hasHarmData
        ? `Your employees found time to complete ${harmfulTaskCount} activities costing ${formatCompactCurrency(totalHarmCostUsd ?? 0)}. They did not find thirty seconds for a signature that redirects 1% of military spending to clinical trials. The arithmetic suggests their priorities may be slightly miscalibrated.`
        : "Your employees have had over a year. The treaty takes thirty seconds. They have instead been doing literally anything else. Please inform them that thirty seconds is, in fact, less than a year.",
    };
  }

  if (delayDays > 100) {
    return {
      heading: "Remind The Overdue Leaders Below To Ratify The 1% Treaty",
      body: hasHarmData
        ? `Below are your employees. Their job is to promote the general welfare. Meanwhile, they have completed ${harmfulTaskCount} activities costing ${formatCompactCurrency(totalHarmCostUsd ?? 0)} that did not promote the general welfare. Your job is to inform them of this discrepancy.`
        : "Below are your employees. Their job is to promote the general welfare. That means increasing median health and wealth. You are their boss. Your job is to remind them what their job is.",
    };
  }

  return {
    heading: "Remind The Overdue Leaders Below To Ratify The 1% Treaty",
    body: "Below are your employees. Their job is to promote the general welfare. That means increasing median health and wealth. You are their boss. Your job is to remind them what their job is.",
  };
}

export function ReminderActionCard({
  href,
  currentEconomicValueUsdLost,
  currentWorstDelayDays,
  currentHumanLivesLost,
  currentSufferingHoursLost,
  harmfulTaskCount,
  overdueTaskCount,
  sampleTargets,
  totalHarmCostUsd,
}: ReminderActionCardProps) {
  const escalated = getEscalatedCopy(currentWorstDelayDays, harmfulTaskCount, totalHarmCostUsd);

  return (
    <BrutalCard bgColor="pink" padding="lg" shadowSize={12}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          <ArcadeTag>Top Task For You</ArcadeTag>
          <ArcadeTag>{`${overdueTaskCount} overdue leaders`}</ArcadeTag>
          {(harmfulTaskCount ?? 0) > 0 ? (
            <ArcadeTag>{`${harmfulTaskCount} bullshit tasks completed instead`}</ArcadeTag>
          ) : null}
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase leading-tight sm:text-4xl">
            {escalated.heading}
          </h2>
          <p className="max-w-4xl text-sm font-bold leading-7 text-muted-foreground">
            {escalated.body}
          </p>
          <p className="max-w-4xl text-sm font-bold leading-7 text-muted-foreground">
            Since neither you nor they have been doing that, the end of war and disease has already
            been pushed back by at least {formatDelayDuration(currentWorstDelayDays)}, and{" "}
            {formatCompactCount(currentHumanLivesLost)} people will now die as a result. Please tell
            them to do their jobs and take 30 seconds to sign the 1% Treaty.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="border-4 border-foreground bg-background p-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-red">
              Human Cost
            </p>
            <p className="mt-2 text-2xl font-black uppercase">
              {formatCompactCount(currentHumanLivesLost)}
            </p>
            <p className="text-xs font-bold uppercase text-muted-foreground">lives delayed so far</p>
          </div>
          <div className="border-4 border-foreground bg-background p-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-red">
              Suffering
            </p>
            <p className="mt-2 text-2xl font-black uppercase">
              {formatCompactCount(currentSufferingHoursLost)}
            </p>
            <p className="text-xs font-bold uppercase text-muted-foreground">hours delayed so far</p>
          </div>
          <div className="border-4 border-foreground bg-background p-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-red">
              Economic Loss
            </p>
            <p className="mt-2 text-2xl font-black uppercase">
              {formatCompactCurrency(currentEconomicValueUsdLost)}
            </p>
            <p className="text-xs font-bold uppercase text-muted-foreground">lost so far</p>
          </div>
        </div>
        {sampleTargets.length > 0 ? (
          <p className="text-sm font-bold">
            Start with: {sampleTargets.join(", ")}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild className="font-black uppercase">
            <Link href={href}>Open Overdue Leaders</Link>
          </Button>
          <Link className="text-sm font-black uppercase underline underline-offset-4" href={href}>
            Jump to the accountability list
          </Link>
        </div>
      </div>
    </BrutalCard>
  );
}
