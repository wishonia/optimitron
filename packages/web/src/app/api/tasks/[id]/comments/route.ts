/**
 * GET  /api/tasks/[id]/comments — public, cursor-paginated feed of comments + activities
 * POST /api/tasks/[id]/comments — auth required, rate-limited, background-fires Wishonia reply
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import {
  countUserCommentsInWindow,
  getTaskActivityTimeline,
  getTaskCommentFeed,
  postComment,
  type CommentSortKey,
} from "@/lib/tasks/task-comments.server";
import { generateAndPostWishoniaReply } from "@/lib/tasks/wishonia-task-reply.server";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 20_000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_COMMENTS = 5;

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: taskId } = await context.params;
    const url = new URL(request.url);
    const sortParam = url.searchParams.get("sort");
    const sort: CommentSortKey = sortParam === "top" ? "top" : "new";
    const cursorParam = url.searchParams.get("cursor");
    const cursor = cursorParam ? new Date(cursorParam) : null;
    const limitParam = Number(url.searchParams.get("limit") ?? 50);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 50;

    const currentUser = await getCurrentUser();

    const [{ comments, nextCursor }, activityEvents] = await Promise.all([
      getTaskCommentFeed({
        taskId,
        sort,
        cursor: cursor && !Number.isNaN(cursor.getTime()) ? cursor : null,
        limit,
        currentUserId: currentUser?.id ?? null,
      }),
      // Only fetch activities on the first page load (no cursor) — they're
      // not paginated, they're just a supplementary timeline.
      cursor ? Promise.resolve([]) : getTaskActivityTimeline(taskId, 50),
    ]);

    return NextResponse.json({
      comments,
      nextCursor: nextCursor?.toISOString() ?? null,
      activityEvents,
    });
  } catch (error) {
    console.error("[TASKS] Failed to fetch comment feed:", error);
    return NextResponse.json({ error: "Failed to fetch comments." }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { id: taskId } = await context.params;
    const body = (await request.json().catch(() => null)) as
      | {
          message?: unknown;
          parentCommentId?: unknown;
          mediaUrl?: unknown;
        }
      | null;

    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (message.length < 1) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message exceeds ${MAX_MESSAGE_LENGTH} character limit.` },
        { status: 400 },
      );
    }

    const parentCommentId =
      typeof body?.parentCommentId === "string" && body.parentCommentId.length > 0
        ? body.parentCommentId
        : null;
    const mediaUrl =
      typeof body?.mediaUrl === "string" && body.mediaUrl.length > 0 ? body.mediaUrl : null;

    // Rate limit: 5 comments per user per task per hour
    const recentCount = await countUserCommentsInWindow(
      taskId,
      currentUser.id,
      RATE_LIMIT_WINDOW_MS,
    );
    if (recentCount >= RATE_LIMIT_MAX_COMMENTS) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Max ${RATE_LIMIT_MAX_COMMENTS} comments per task per hour.`,
        },
        { status: 429 },
      );
    }

    const comment = await postComment({
      taskId,
      authorUserId: currentUser.id,
      parentCommentId,
      message,
      mediaUrl,
    });

    // Background-fire Wishonia reply. Do not await.
    void generateAndPostWishoniaReply({
      taskId,
      parentCommentId: comment.id,
      userComment: message,
      userCommentAuthorId: currentUser.id,
    });

    return NextResponse.json({ comment });
  } catch (error) {
    console.error("[TASKS] Failed to post comment:", error);
    return NextResponse.json({ error: "Failed to post comment." }, { status: 500 });
  }
}

