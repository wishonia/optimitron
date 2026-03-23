import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await requireAuth();
    const data = await req.json();

    let normalizedUsername: string | null | undefined = undefined;

    if ("username" in data) {
      const raw = (data.username ?? "").trim();

      if (raw === "") {
        normalizedUsername = null;
      } else {
        if (raw.length < 3 || raw.length > 24) {
          return NextResponse.json(
            { error: "Player name must be between 3 and 24 characters." },
            { status: 400 },
          );
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(raw)) {
          return NextResponse.json(
            {
              error:
                "Player name can only include letters, numbers, hyphens, and underscores.",
            },
            { status: 400 },
          );
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            username: { equals: raw, mode: "insensitive" },
            NOT: { id: userId },
          },
          select: { id: true },
        });

        if (existingUser) {
          return NextResponse.json(
            { error: "That player name is already taken. Please choose another." },
            { status: 400 },
          );
        }

        normalizedUsername = raw;
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        bio: data.bio,
        isPublic: data.isPublic,
        newsletterSubscribed: data.newsletterSubscribed,
        website: data.website,
        headline: data.headline,
        coverImage: data.coverImage,
        ...(normalizedUsername !== undefined
          ? { username: normalizedUsername }
          : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
