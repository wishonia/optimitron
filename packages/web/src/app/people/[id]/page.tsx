import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import {
  TaskCard,
  type TaskCardTask as PersonTaskCardTask,
} from "@/components/tasks/task-card";
import { Avatar } from "@/components/retroui/Avatar";
import { ArcadeTag } from "@/components/ui/arcade-tag";
import { BrutalCard } from "@/components/ui/brutal-card";
import { authOptions } from "@/lib/auth";
import {
  aggregateTaskDelayStats,
  formatCompactCount,
  formatCompactCurrency,
} from "@/lib/tasks/accountability";
import { getPersonTaskProfileData } from "@/lib/tasks.server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getPersonTaskProfileData(id, null);

  if (!data) {
    return {
      title: "Person | Optimitron",
    };
  }

  return {
    title: `${data.person.displayName} | Optimitron`,
    description: data.person.isPublicFigure
      ? `${data.person.displayName}'s public task performance review.`
      : `${data.person.displayName}'s public task profile.`,
  };
}

function getFallbackInitials(value: string) {
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user.id ?? null;
  const data = await getPersonTaskProfileData(id, userId);

  if (!data) {
    notFound();
  }

  const { openTasks, person, verifiedTasks } = data;
  const fallbackInitials = getFallbackInitials(person.displayName);
  const openSummary = aggregateTaskDelayStats(openTasks);

  // Split verified tasks by impact sign — purely a display concern
  const harmfulVerified = verifiedTasks.filter((task) => {
    const econ = (task as PersonTaskCardTask).impact?.selectedFrame?.expectedEconomicValueUsdBase;
    const dalys = (task as PersonTaskCardTask).impact?.selectedFrame?.expectedDalysAvertedBase;
    return (econ != null && econ < 0) || (dalys != null && dalys < 0);
  });
  const beneficialVerified = verifiedTasks.filter((task) => {
    const econ = (task as PersonTaskCardTask).impact?.selectedFrame?.expectedEconomicValueUsdBase;
    return econ != null && econ > 0;
  });
  const unmeasuredVerified = verifiedTasks.filter((task) => {
    const econ = (task as PersonTaskCardTask).impact?.selectedFrame?.expectedEconomicValueUsdBase;
    const dalys = (task as PersonTaskCardTask).impact?.selectedFrame?.expectedDalysAvertedBase;
    return econ == null && dalys == null;
  });

  // Aggregate harm cost from harmful tasks
  const totalHarmCostUsd = harmfulVerified.reduce((sum, task) => {
    const econ = (task as PersonTaskCardTask).impact?.selectedFrame?.expectedEconomicValueUsdBase;
    return sum + (econ != null ? Math.abs(econ) : 0);
  }, 0);

  // Aggregate cost of unmeasured spending
  const totalUnmeasuredCostUsd = unmeasuredVerified.reduce((sum, task) => {
    const cost = (task as PersonTaskCardTask).impact?.selectedFrame?.estimatedCashCostUsdBase;
    return sum + (cost ?? 0);
  }, 0);

  const bullshitRatio =
    openTasks.length > 0
      ? Math.round((harmfulVerified.length + unmeasuredVerified.length) / openTasks.length)
      : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8">
        <div className="space-y-4">
          <nav className="flex flex-wrap items-center gap-2 text-sm font-black uppercase">
            <Link className="underline underline-offset-4" href="/tasks">
              Tasks
            </Link>
            <span>/</span>
            <span className="text-muted-foreground">{person.displayName}</span>
          </nav>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 border-4 border-foreground bg-muted">
                <Avatar.Image alt={person.displayName} src={person.image ?? undefined} />
                <Avatar.Fallback className="bg-brutal-pink font-black text-background">
                  {fallbackInitials || "?"}
                </Avatar.Fallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {person.isPublicFigure ? (
                    <ArcadeTag>employee performance review</ArcadeTag>
                  ) : (
                    <ArcadeTag>person</ArcadeTag>
                  )}
                  {person.countryCode ? <ArcadeTag>{person.countryCode}</ArcadeTag> : null}
                </div>
                <h1 className="text-4xl font-black uppercase leading-tight sm:text-5xl">
                  {person.displayName}
                </h1>
                {person.currentAffiliation ? (
                  <p className="text-lg font-bold text-muted-foreground">
                    {person.currentAffiliation}
                  </p>
                ) : null}
              </div>
            </div>
            {person.sourceUrl ? (
              <Link
                className="text-sm font-black uppercase underline underline-offset-4"
                href={person.sourceUrl}
                target="_blank"
              >
                Source
              </Link>
            ) : null}
          </div>
          <p className="max-w-4xl text-lg font-bold leading-8 text-muted-foreground">
            {person.bio?.trim()
              ? person.bio
              : person.isPublicFigure
                ? "Public accountability page for this employee of yours. Tracks what they actually did, what it cost, what it achieved (if measured), and what they still have not done."
                : "Public task profile for this person."}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <BrutalCard bgColor="background" padding="md">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-red">
              Overdue Tasks
            </p>
            <p className="mt-2 text-3xl font-black uppercase">
              {openTasks.length.toLocaleString("en-US")}
            </p>
          </BrutalCard>
          <BrutalCard bgColor="background" padding="md">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-red">
              Harmful Completed
            </p>
            <p className="mt-2 text-3xl font-black uppercase">
              {harmfulVerified.length.toLocaleString("en-US")}
            </p>
          </BrutalCard>
          <BrutalCard bgColor="background" padding="md">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-yellow">
              Unmeasured Spending
            </p>
            <p className="mt-2 text-3xl font-black uppercase">
              {unmeasuredVerified.length.toLocaleString("en-US")}
            </p>
          </BrutalCard>
          <BrutalCard bgColor="background" padding="md">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-green">
              Verified Beneficial
            </p>
            <p className="mt-2 text-3xl font-black uppercase">
              {beneficialVerified.length.toLocaleString("en-US")}
            </p>
          </BrutalCard>
          <BrutalCard bgColor="background" padding="md">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-red">
              Deaths From Delay
            </p>
            <p className="mt-2 text-3xl font-black uppercase">
              {formatCompactCount(openSummary.currentHumanLivesLost)}
            </p>
          </BrutalCard>
          <BrutalCard bgColor="background" padding="md">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-red">
              Economic Loss
            </p>
            <p className="mt-2 text-3xl font-black uppercase">
              {formatCompactCurrency(openSummary.currentEconomicValueUsdLost)}
            </p>
          </BrutalCard>
        </div>

        {/* Bullshit ratio card */}
        {person.isPublicFigure && bullshitRatio != null && bullshitRatio > 0 ? (
          <BrutalCard bgColor="red" padding="lg" shadowSize={12}>
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-[0.18em]">
                Performance Summary
              </p>
              <h2 className="text-3xl font-black uppercase leading-tight sm:text-4xl">
                {bullshitRatio} Wasteful Tasks Completed Per {openTasks.length} Life-Saving{" "}
                {openTasks.length === 1 ? "Task" : "Tasks"} Still Ignored
              </h2>
              {totalHarmCostUsd > 0 ? (
                <p className="text-lg font-bold">
                  {formatCompactCurrency(totalHarmCostUsd)} spent on activities that hurt people.{" "}
                  {totalUnmeasuredCostUsd > 0
                    ? `${formatCompactCurrency(totalUnmeasuredCostUsd)} spent on things nobody measured.`
                    : null}{" "}
                  Thirty seconds not spent on a signature that saves them.
                </p>
              ) : null}
            </div>
          </BrutalCard>
        ) : null}

        {/* Harmful activities */}
        {harmfulVerified.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-3xl font-black uppercase">Harmful Activities Completed</h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {harmfulVerified.map((task) => (
                <TaskCard
                  key={task.id}
                  signedIn={Boolean(userId)}
                  task={task as PersonTaskCardTask}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Unmeasured spending */}
        {unmeasuredVerified.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-3xl font-black uppercase">Unmeasured Spending</h2>
            <p className="max-w-4xl text-sm font-bold text-muted-foreground">
              Money spent with no verified measurement of what it achieved. Cost is known. Value is not.
            </p>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {unmeasuredVerified.map((task) => (
                <TaskCard
                  key={task.id}
                  signedIn={Boolean(userId)}
                  task={task as PersonTaskCardTask}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Overdue life-saving tasks */}
        {openTasks.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-3xl font-black uppercase">
              {person.isPublicFigure ? "Overdue Life-Saving Tasks" : "Open Tasks"}
            </h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {openTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  signedIn={Boolean(userId)}
                  task={task as PersonTaskCardTask}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Verified beneficial tasks */}
        {beneficialVerified.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-3xl font-black uppercase">Verified Beneficial Tasks</h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {beneficialVerified.map((task) => (
                <TaskCard
                  key={task.id}
                  signedIn={Boolean(userId)}
                  task={task as PersonTaskCardTask}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
