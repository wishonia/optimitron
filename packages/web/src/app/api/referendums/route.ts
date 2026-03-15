import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET() {
  try {
    const referendums = await prisma.referendum.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        status: true,
        createdAt: true,
        _count: { select: { votes: { where: { deletedAt: null } } } },
      },
    });

    return NextResponse.json({ referendums });
  } catch (error) {
    console.error("[REFERENDUMS] Error listing referendums:", error);
    return NextResponse.json(
      { error: "Failed to list referendums" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth();
    const { title, slug, description } = (await request.json()) as {
      title: string;
      slug: string;
      description?: string;
    };

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
        { status: 400 },
      );
    }

    const existing = await prisma.referendum.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A referendum with this slug already exists" },
        { status: 409 },
      );
    }

    const referendum = await prisma.referendum.create({
      data: {
        title,
        slug,
        description: description ?? null,
        createdByUserId: userId,
      },
    });

    return NextResponse.json({ referendum }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[REFERENDUMS] Error creating referendum:", error);
    return NextResponse.json(
      { error: "Failed to create referendum" },
      { status: 500 },
    );
  }
}
