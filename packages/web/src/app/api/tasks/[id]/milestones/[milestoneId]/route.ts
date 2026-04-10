import { TaskMilestoneStatus } from "@optimitron/db";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { updateTaskMilestone } from "@/lib/tasks/milestones.server";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; milestoneId: string }> },
) {
  try {
    const { userId } = await requireAuth();
    const body = (await request.json().catch(() => null)) as
      | {
          evidenceNote?: unknown;
          evidenceUrl?: unknown;
          status?: unknown;
        }
      | null;
    const { id, milestoneId } = await context.params;
    const rawStatus = typeof body?.status === "string" ? body.status : null;

    if (!rawStatus || !(rawStatus in TaskMilestoneStatus)) {
      return NextResponse.json({ error: "Invalid milestone status." }, { status: 400 });
    }

    const result = await updateTaskMilestone(id, milestoneId, userId, {
      evidenceNote:
        typeof body?.evidenceNote === "string" ? body.evidenceNote : null,
      evidenceUrl: typeof body?.evidenceUrl === "string" ? body.evidenceUrl : null,
      status: TaskMilestoneStatus[rawStatus as keyof typeof TaskMilestoneStatus],
    });

    return NextResponse.json({ data: result, success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("[TASKS] Failed to update task milestone:", error);
    return NextResponse.json({ error: "Failed to update task milestone." }, { status: 500 });
  }
}
