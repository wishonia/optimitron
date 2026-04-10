import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { recordTaskContactAction } from "@/lib/tasks/contact.server";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const body = (await request.json().catch(() => null)) as
      | {
          channel?: unknown;
          href?: unknown;
          message?: unknown;
        }
      | null;
    const currentUser = await getCurrentUser();
    const { id } = await context.params;

    if (currentUser) {
      await recordTaskContactAction({
        channel: body?.channel === "email" ? "email" : "link",
        href: typeof body?.href === "string" ? body.href : null,
        message: typeof body?.message === "string" ? body.message : null,
        taskId: id,
        userId: currentUser.id,
      });
    }

    return NextResponse.json({
      success: true,
      tracked: Boolean(currentUser),
    });
  } catch (error) {
    console.error("[TASKS] Failed to track contact action:", error);
    return NextResponse.json({ error: "Failed to track contact action." }, { status: 500 });
  }
}
