import Link from "next/link";
import { TaskClaimPolicy } from "@optimitron/db";
import { getServerSession } from "next-auth";
import { ReminderActionCard } from "@/components/tasks/ReminderActionCard";
import { TaskCard } from "@/components/tasks/task-card";
import { Button } from "@/components/retroui/Button";
import { ArcadeTag } from "@/components/ui/arcade-tag";
import { BrutalCard } from "@/components/ui/brutal-card";
import { authOptions } from "@/lib/auth";
import { getRouteMetadata } from "@/lib/metadata";
import { getSignInPath, tasksLink, ROUTES } from "@/lib/routes";
import { aggregateTaskDelayStats, getTaskDelayStats } from "@/lib/tasks/accountability";
import { getTasksPageData } from "@/lib/tasks.server";

export const metadata = getRouteMetadata(tasksLink);

function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-black uppercase">{title}</h2>
      {children}
    </section>
  );
}

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id ?? null;
  const data = await getTasksPageData(userId);
  const signInHref = getSignInPath(ROUTES.tasks);
  const overdueLeaders = data.allTasks.filter((task) => {
    if (task.claimPolicy !== TaskClaimPolicy.ASSIGNED_ONLY) {
      return false;
    }

    return getTaskDelayStats(task).isOverdue;
  });
  const overdueLeaderSummary = aggregateTaskDelayStats(overdueLeaders);
  const currentWorstDelayDays = overdueLeaders.reduce((maxDelay, task) => {
    return Math.max(maxDelay, getTaskDelayStats(task).currentDelayDays);
  }, 0);
  const remainingTasks = data.allTasks.filter(
    (task) => !overdueLeaders.some((overdueTask) => overdueTask.id === task.id),
  );
  const reminderTargets = overdueLeaders
    .slice(0, 4)
    .map((task) => task.assigneePerson?.displayName ?? task.assigneeOrganization?.name ?? task.title);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8">
        <section className="space-y-4">
          <ArcadeTag>Task Network</ArcadeTag>
          <h1 className="text-5xl font-black uppercase leading-none sm:text-6xl">
            Highest-Value
            <span className="text-brutal-pink"> Tasks</span>
          </h1>
          <p className="max-w-4xl text-lg font-bold leading-8 text-muted-foreground">
            Ranked accountability tasks first. Share them. Push the assignee. Then claim
            the useful supporting work beneath them.
          </p>
          {!userId ? (
            <BrutalCard bgColor="yellow" className="max-w-3xl" padding="md" shadowSize={8}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xl font-black uppercase">Sign in for your personalized task feed</p>
                  <p className="text-sm font-bold">
                    Public accountability tasks stay visible either way.
                  </p>
                </div>
                <Button asChild className="font-black uppercase">
                  <Link href={signInHref}>Sign In</Link>
                </Button>
              </div>
            </BrutalCard>
          ) : null}
        </section>

        {overdueLeaders.length > 0 ? (
          <ReminderActionCard
            currentEconomicValueUsdLost={overdueLeaderSummary.currentEconomicValueUsdLost}
            currentWorstDelayDays={currentWorstDelayDays}
            currentHumanLivesLost={overdueLeaderSummary.currentHumanLivesLost}
            currentSufferingHoursLost={overdueLeaderSummary.currentSufferingHoursLost}
            href="#highest-value-overdue-tasks"
            overdueTaskCount={overdueLeaderSummary.overdueTaskCount}
            sampleTargets={reminderTargets}
          />
        ) : null}

        {overdueLeaders.length > 0 ? (
          <Section title="Highest Value Overdue Tasks">
            <div
              id="highest-value-overdue-tasks"
              className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3"
            >
              {overdueLeaders.map((task) => (
                <TaskCard key={task.id} signedIn={Boolean(userId)} task={task} />
              ))}
            </div>
          </Section>
        ) : null}

        {userId ? (
          <Section title="For You">
            {data.forYou.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {data.forYou.slice(0, 12).map((task) => (
                  <TaskCard
                    key={task.id}
                    showRecommendationScore
                    signedIn={Boolean(userId)}
                    task={task}
                  />
                ))}
              </div>
            ) : (
              <BrutalCard bgColor="background" padding="md">
                <p className="text-sm font-bold">
                  Add skills, interests, and available hours in your census profile to improve matching.
                </p>
              </BrutalCard>
            )}
          </Section>
        ) : null}

        {data.assignedToYou.length > 0 ? (
          <Section title="Assigned To You">
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {data.assignedToYou.map((task) => (
                <TaskCard key={task.id} signedIn={Boolean(userId)} task={task} />
              ))}
            </div>
          </Section>
        ) : null}

        {userId ? (
          <Section title="My Claims">
            {data.myClaims.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {data.myClaims.map((claim) => (
                  <TaskCard
                    key={claim.id}
                    signedIn={Boolean(userId)}
                    task={{
                      ...claim.task,
                      activeClaimCount: claim.task.claims.filter((taskClaim) =>
                        ["CLAIMED", "IN_PROGRESS", "COMPLETED"].includes(taskClaim.status),
                      ).length,
                      viewerHasClaim: true,
                    }}
                  />
                ))}
              </div>
            ) : (
              <BrutalCard bgColor="background" padding="md">
                <p className="text-sm font-bold">
                  No active claims yet. Claim something real.
                </p>
              </BrutalCard>
            )}
          </Section>
        ) : null}

        <Section title="All Tasks">
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {remainingTasks.slice(0, 24).map((task) => (
                <TaskCard key={task.id} signedIn={Boolean(userId)} task={task} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
