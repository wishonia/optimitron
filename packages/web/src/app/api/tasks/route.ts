import { TaskImpactFrameKey, TaskStatus } from "@optimitron/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listTasks } from "@/lib/tasks.server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id ?? null;
    const { searchParams } = new URL(request.url);
    const assigneeOrganizationId = searchParams.get("assigneeOrganizationId");
    const assigneePersonId = searchParams.get("assigneePersonId");
    const rawStatus = searchParams.get("status");
    const rawFrameKey = searchParams.get("frameKey");
    const status =
      rawStatus && rawStatus in TaskStatus
        ? TaskStatus[rawStatus as keyof typeof TaskStatus]
        : null;
    const frameKey =
      rawFrameKey && rawFrameKey in TaskImpactFrameKey
        ? TaskImpactFrameKey[rawFrameKey as keyof typeof TaskImpactFrameKey]
        : null;

    const tasks = await listTasks({
      assigneeOrganizationId,
      assigneePersonId,
      frameKey,
      status,
      userId,
    });

    return NextResponse.json({ data: tasks, success: true });
  } catch (error) {
    console.error("[TASKS] Failed to list tasks:", error);
    return NextResponse.json({ error: "Failed to list tasks." }, { status: 500 });
  }
}
