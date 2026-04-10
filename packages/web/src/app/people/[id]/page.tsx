import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { TaskCard, type TaskCardTask } from "@/components/tasks/task-card";
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
                  <ArcadeTag>{person.isPublicFigure ? "public-figure" : "person"}</ArcadeTag>
                  {person.countryCode ? <ArcadeTag>{person.countryCode}</ArcadeTag> : null}
                  {person.sourceRef ? <ArcadeTag>{person.sourceRef}</ArcadeTag> : null}
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
                ? "Public accountability page for this assignee. It currently tracks public task execution first; term-level welfare scorecards can be layered on once the time-series data is wired in."
                : "Public task profile for this person."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <BrutalCard bgColor="background" padding="md">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-pink">
              Open Tasks
            </p>
            <p className="mt-2 text-3xl font-black uppercase">
              {openTasks.length.toLocaleString("en-US")}
            </p>
          </BrutalCard>
          <BrutalCard bgColor="background" padding="md">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-pink">
              Verified Tasks
            </p>
            <p className="mt-2 text-3xl font-black uppercase">
              {verifiedTasks.length.toLocaleString("en-US")}
            </p>
          </BrutalCard>
          <BrutalCard bgColor="background" padding="md">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-red">
              Lives Delayed
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

        {openTasks.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-3xl font-black uppercase">
              {person.isPublicFigure ? "Incomplete Public Tasks" : "Open Tasks"}
            </h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {openTasks.map((task) => (
                <TaskCard key={task.id} signedIn={Boolean(userId)} task={task as TaskCardTask} />
              ))}
            </div>
          </section>
        ) : null}

        {verifiedTasks.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-3xl font-black uppercase">Verified Completed Tasks</h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {verifiedTasks.map((task) => (
                <TaskCard key={task.id} signedIn={Boolean(userId)} task={task as TaskCardTask} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
