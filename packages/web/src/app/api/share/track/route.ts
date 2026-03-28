import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { grantWishes } from "@/lib/wishes.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth();

    let templateLabel: string | undefined;
    try {
      const body = await request.json();
      templateLabel = typeof body.templateLabel === "string" ? body.templateLabel : undefined;
    } catch {
      // Empty body is fine — templateLabel is optional
    }

    // Grant wish points for sharing (one-time per user)
    let wishesEarned = 0;
    try {
      const wishResult = await grantWishes({
        userId,
        reason: "SHARE_REPORT",
        amount: 1,
        dedupeKey: "share-" + userId,
        metadata: templateLabel ? { templateLabel } : undefined,
      });
      if (wishResult) wishesEarned = wishResult.amount;
    } catch (wishError) {
      console.error("[SHARE TRACK] Wish grant error:", wishError);
    }

    return NextResponse.json({ success: true, wishesEarned });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[SHARE TRACK] Failed:", error);
    return NextResponse.json({ error: "Failed to track share." }, { status: 500 });
  }
}
