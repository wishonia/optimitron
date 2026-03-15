import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { VotePosition } from "@optomitron/db";
import { findUserByUsernameOrReferralCode } from "@/lib/referral.server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { userId } = await requireAuth();
    const { slug } = await params;
    const body = (await request.json()) as {
      answer: string;
      ref?: string;
    };

    const answer = body.answer?.toUpperCase();
    if (!answer || !["YES", "NO", "ABSTAIN"].includes(answer)) {
      return NextResponse.json(
        { error: "Answer must be YES, NO, or ABSTAIN" },
        { status: 400 },
      );
    }

    const referendum = await prisma.referendum.findUnique({
      where: { slug, deletedAt: null },
    });

    if (!referendum) {
      return NextResponse.json(
        { error: "Referendum not found" },
        { status: 404 },
      );
    }

    if (referendum.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "This referendum is not currently accepting votes" },
        { status: 400 },
      );
    }

    // Resolve referrer if provided
    let referredByUserId: string | null = null;
    if (body.ref) {
      const referrer = await findUserByUsernameOrReferralCode(body.ref);
      if (referrer && referrer.id !== userId) {
        referredByUserId = referrer.id;
      }
    }

    const vote = await prisma.referendumVote.upsert({
      where: {
        userId_referendumId: {
          userId,
          referendumId: referendum.id,
        },
      },
      update: {
        answer: answer as VotePosition,
        deletedAt: null,
      },
      create: {
        userId,
        referendumId: referendum.id,
        answer: answer as VotePosition,
        referredByUserId,
      },
    });

    return NextResponse.json({ vote });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[REFERENDUM VOTE] Error:", error);
    return NextResponse.json(
      { error: "Failed to cast vote" },
      { status: 500 },
    );
  }
}
