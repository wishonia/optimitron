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
  overdueTaskCount: number;
  sampleTargets: string[];
}

export function ReminderActionCard({
  href,
  currentEconomicValueUsdLost,
  currentWorstDelayDays,
  currentHumanLivesLost,
  currentSufferingHoursLost,
  overdueTaskCount,
  sampleTargets,
}: ReminderActionCardProps) {
  return (
    <BrutalCard bgColor="pink" padding="lg" shadowSize={12}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          <ArcadeTag>Top Task For You</ArcadeTag>
          <ArcadeTag>{`${overdueTaskCount} overdue leaders`}</ArcadeTag>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase leading-tight sm:text-4xl">
            Remind The Overdue Leaders Below To Ratify The 1% Treaty
          </h2>
          <p className="max-w-4xl text-sm font-bold leading-7 text-muted-foreground">
            Below are your employees. Their job is to promote the general welfare. That means
            increasing median health and wealth. You are their boss. Your job is to tell them to
            do their fucking jobs.
          </p>
          <p className="max-w-4xl text-sm font-bold leading-7 text-muted-foreground">
            Since neither you nor they have been doing that, the end of war and disease has already
            been pushed back by at least {formatDelayDuration(currentWorstDelayDays)}, and{" "}
            {formatCompactCount(currentHumanLivesLost)} people will now die as a result. Please tell
            them to do their fucking jobs and take 30 seconds to sign the 1% Treaty.
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
