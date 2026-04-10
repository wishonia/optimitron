import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getDashboardData, getTopReferrers } from "@/lib/dashboard.server";
import { getTasksPageData } from "@/lib/tasks.server";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { dashboardLink, getSignInPath, ROUTES } from "@/lib/routes";
import { getRouteMetadata } from "@/lib/metadata";

export const metadata = getRouteMetadata(dashboardLink);

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    redirect(getSignInPath(ROUTES.dashboard));
  }

  const [initialData, leaderboard, taskData] = await Promise.all([
    getDashboardData(userId),
    getTopReferrers(),
    getTasksPageData(userId),
  ]);

  return (
    <DashboardClient
      initialData={initialData}
      leaderboard={leaderboard}
      topTasks={taskData.forYou.slice(0, 3).map((task) => ({
        activeClaimCount: task.activeClaimCount,
        claimPolicy: task.claimPolicy,
        description: task.description,
        difficulty: task.difficulty,
        estimatedEffortHours: task.estimatedEffortHours,
        id: task.id,
        maxClaims: task.maxClaims ?? null,
        title: task.title,
        viewerHasClaim: task.viewerHasClaim,
      }))}
    />
  );
}
