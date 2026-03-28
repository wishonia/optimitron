import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { grantWishes } from "@/lib/wishes.server";
import { checkBadgesAfterWish } from "@/lib/badges.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth();
    const body = await request.json();
    const { txHash, depositUsd } = body as {
      txHash: string;
      depositUsd: number;
    };

    if (!txHash || typeof txHash !== "string") {
      return NextResponse.json({ error: "txHash is required." }, { status: 400 });
    }
    if (!depositUsd || typeof depositUsd !== "number" || depositUsd <= 0) {
      return NextResponse.json({ error: "depositUsd must be a positive number." }, { status: 400 });
    }

    const wishAmount = Math.floor(depositUsd / 100);

    let wishesEarned = 0;
    if (wishAmount > 0) {
      try {
        const wishResult = await grantWishes({
          userId,
          reason: "PRIZE_DEPOSIT",
          amount: wishAmount,
          dedupeKey: "deposit-" + txHash,
          metadata: { txHash, depositUsd },
        });
        if (wishResult) wishesEarned = wishResult.amount;
        void checkBadgesAfterWish(userId, "PRIZE_DEPOSIT");
      } catch (wishError) {
        console.error("[PRIZE DEPOSIT] Wish grant error:", wishError);
      }
    }

    return NextResponse.json({ success: true, wishesEarned });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[PRIZE DEPOSIT] Failed:", error);
    return NextResponse.json({ error: "Failed to record deposit wishes." }, { status: 500 });
  }
}
