import Link from "next/link";
import { TaskClaimPolicy } from "@optimitron/db";
import { getServerSession } from "next-auth";
import { ReminderActionCard } from "@/components/tasks/ReminderActionCard";
import { TaskRow, TaskTableHeader } from "@/components/tasks/task-row";
import { Button } from "@/components/retroui/Button";
import { ArcadeTag } from "@/components/ui/arcade-tag";
import { BrutalCard } from "@/components/ui/brutal-card";
import { authOptions } from "@/lib/auth";
import { getRouteMetadata } from "@/lib/metadata";
import { getSignInPath, tasksLink, ROUTES } from "@/lib/routes";
import { getConfiguredSiteOrigin } from "@/lib/site";
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

function TaskList({ tasks }: { tasks: Parameters<typeof TaskRow>[0]["task"][] }) {
  if (tasks.length === 0) return null;
  return (
    <div className="overflow-hidden border-4 border-primary bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <TaskTableHeader />
      <div className="divide-y-2 divide-foreground/10">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id ?? null;
  const data = await getTasksPageData(userId);
  const signInHref = getSignInPath(ROUTES.tasks);
  const overdueLeaders = data.allTasks.filter((task) => {
    if (task.claimPolicy !== TaskClaimPolicy.ASSIGNED_ONLY) return false;
    return getTaskDelayStats(task).isOverdue;
  });
  const overdueLeaderSummary = aggregateTaskDelayStats(overdueLeaders);
  const remainingTasks = data.allTasks.filter(
    (task) => !overdueLeaders.some((overdueTask) => overdueTask.id === task.id),
  );
  const tasksUrl = `${getConfiguredSiteOrigin({ allowLocalFallback: true })}${ROUTES.tasks}`;

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
            currentHumanLivesLost={overdueLeaderSummary.currentHumanLivesLost}
            currentSufferingHoursLost={overdueLeaderSummary.currentSufferingHoursLost}
            overdueTaskCount={overdueLeaderSummary.overdueTaskCount}
            tasksUrl={tasksUrl}
          />
        ) : null}

        {overdueLeaders.length > 0 ? (
          <Section title="Overdue Leaders">
            <TaskList tasks={overdueLeaders} />
          </Section>
        ) : null}

        {userId && data.ownedPrivateTasks.length > 0 ? (
          <Section title="My Private Tasks">
            <TaskList tasks={data.ownedPrivateTasks} />
          </Section>
        ) : null}

        {userId && data.forYou.length > 0 ? (
          <Section title="For You">
            <TaskList tasks={data.forYou.slice(0, 12)} />
          </Section>
        ) : null}

        {data.assignedToYou.length > 0 ? (
          <Section title="Assigned To You">
            <TaskList tasks={data.assignedToYou} />
          </Section>
        ) : null}

        {userId && data.myClaims.length > 0 ? (
          <Section title="My Claims">
            <TaskList
              tasks={data.myClaims.map((claim) => ({
                ...claim.task,
                activeClaimCount: claim.task.claims.filter((taskClaim) =>
                  ["CLAIMED", "IN_PROGRESS", "COMPLETED"].includes(taskClaim.status),
                ).length,
                viewerHasClaim: true,
              }))}
            />
          </Section>
        ) : null}

        {remainingTasks.length > 0 ? (
          <Section title="All Tasks">
            <TaskList tasks={remainingTasks.slice(0, 50)} />
          </Section>
        ) : null}
      </div>
    </div>
  );
}
