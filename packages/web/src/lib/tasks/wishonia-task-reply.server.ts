/**
 * Wishonia auto-reply generator for task comments.
 *
 * When a user posts a comment, this fires in the background, runs a RAG
 * query against the manual/parameters, generates a deadpan data-first
 * response, and posts it as a reply to the user's comment.
 *
 * Reuses the exact pattern from the `askWishonia` MCP handler in mcp-server.ts:
 * retrieveManualContext() → GoogleGenAI.generateContent() → return answer.
 *
 * Unlike wishonia's old /api/visuals pipeline, we do NOT make a second
 * generation call for structured visuals. Wishonia generates plain markdown
 * with embedded fences (mermaid, chart, math) — the RichMarkdown renderer
 * handles everything. One generation call, one code path, same surface as
 * any other agent.
 */

import { Prisma } from "@optimitron/db";
import { prisma } from "@/lib/prisma";
import { retrieveManualContext } from "@/lib/manual-search.server";
import { WISHONIA_VOICE_SYSTEM_PROMPT, RAG_MODEL } from "@/lib/voice-config";
import { getWishoniaUserId } from "@/lib/wishonia.server";
import { countUserCommentsInWindow, postComment } from "@/lib/tasks/task-comments.server";

const WISHONIA_MIN_COMMENT_LENGTH = 20;
const WISHONIA_TASK_REPLY_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const WISHONIA_MAX_REPLIES_PER_TASK_PER_HOUR = 3;
const WISHONIA_GENERATION_TIMEOUT_MS = 30_000;

/**
 * System prompt wrapper for task comment replies. Augments the base Wishonia
 * voice prompt with task-specific context and instructions about the extended
 * markdown fence format (mermaid, chart, math).
 */
function buildTaskReplySystemPrompt(args: {
  taskTitle: string;
  taskDescription: string;
  impactSummary: string | null;
  retrievedContext: string;
}): string {
  return `${WISHONIA_VOICE_SYSTEM_PROMPT}

--- TASK CONTEXT ---
You are commenting on a specific task on Optimitron: "${args.taskTitle}".
Task description: ${args.taskDescription.slice(0, 1500)}
${args.impactSummary ? `Impact summary: ${args.impactSummary}` : ""}

--- RETRIEVED CONTEXT FROM MANUAL + PARAMETERS ---
${args.retrievedContext || "No specific context retrieved for this question."}

--- RENDERING INSTRUCTIONS ---
Your reply will be rendered as GitHub-flavored markdown with these extensions:
- Math: \`$inline$\` or \`$$block$$\` via KaTeX
- Diagrams: \`\`\`mermaid fenced blocks\`\`\` via Mermaid
- Charts: \`\`\`chart fenced blocks containing Chart.js JSON config\`\`\`
- Images: \`![alt](url)\`
- Standard markdown: tables, lists, code blocks, blockquotes

Use these visuals only when they genuinely help the argument. A deadpan one-paragraph reply citing specific numbers is usually better than a wall of diagrams. Never dump multiple visuals for the sake of it. If the user is arguing against the numbers, cite the specific parameter values and sources from the retrieved context. Respond in 1-4 short paragraphs. End with a sardonic one-liner when appropriate.`;
}

/**
 * Build a short impact summary for a task to inject into Wishonia's context.
 */
async function buildImpactSummary(taskId: string): Promise<string | null> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { currentImpactEstimateSetId: true },
  });
  if (!task?.currentImpactEstimateSetId) return null;

  const frame = await prisma.taskImpactFrameEstimate.findFirst({
    where: { taskImpactEstimateSetId: task.currentImpactEstimateSetId },
    select: {
      expectedEconomicValueUsdBase: true,
      expectedDalysAvertedBase: true,
      delayEconomicValueUsdLostPerDayBase: true,
      delayDalysLostPerDayBase: true,
      estimatedCashCostUsdBase: true,
      successProbabilityBase: true,
      benefitDurationYears: true,
    },
  });
  if (!frame) return null;

  const parts: string[] = [];
  if (frame.expectedDalysAvertedBase != null) {
    parts.push(`Expected healthy years saved: ${frame.expectedDalysAvertedBase.toLocaleString()}`);
  }
  if (frame.expectedEconomicValueUsdBase != null) {
    parts.push(`Economic value: $${frame.expectedEconomicValueUsdBase.toLocaleString()}`);
  }
  if (frame.delayDalysLostPerDayBase != null) {
    parts.push(
      `Delay cost: ${(frame.delayDalysLostPerDayBase * 365).toLocaleString()} healthy years per year of delay`,
    );
  }
  if (frame.estimatedCashCostUsdBase != null) {
    parts.push(`Task cost: $${frame.estimatedCashCostUsdBase.toLocaleString()}`);
  }
  if (frame.successProbabilityBase != null) {
    parts.push(`Success probability: ${(frame.successProbabilityBase * 100).toFixed(0)}%`);
  }
  if (frame.benefitDurationYears != null) {
    parts.push(`Benefit horizon: ${frame.benefitDurationYears} years`);
  }
  return parts.join(". ");
}

/**
 * Generate and post a Wishonia reply to a user's comment on a task.
 *
 * Called in the background from the POST /api/tasks/:id/comments route
 * (and from the MCP postTaskComment tool). Failures are logged but do not
 * block the original comment post.
 */
export async function generateAndPostWishoniaReply(input: {
  taskId: string;
  parentCommentId: string;
  userComment: string;
  userCommentAuthorId: string;
}): Promise<void> {
  try {
    if (process.env.WISHONIA_AUTO_REPLY_ENABLED === "false") {
      return;
    }

    const wishoniaUserId = await getWishoniaUserId();

    // Don't reply to Wishonia's own comments
    if (input.userCommentAuthorId === wishoniaUserId) {
      return;
    }

    // Skip very short comments — no RAG on "👍"
    if (input.userComment.trim().length < WISHONIA_MIN_COMMENT_LENGTH) {
      return;
    }

    // Rate limit: max 3 Wishonia replies per task per hour
    const recentReplyCount = await countUserCommentsInWindow(
      input.taskId,
      wishoniaUserId,
      WISHONIA_TASK_REPLY_WINDOW_MS,
    );
    if (recentReplyCount >= WISHONIA_MAX_REPLIES_PER_TASK_PER_HOUR) {
      console.log(
        `[wishonia-task-reply] Rate limit hit for task ${input.taskId} (${recentReplyCount} replies this hour)`,
      );
      return;
    }

    // Fetch task metadata for context
    const task = await prisma.task.findUnique({
      where: { id: input.taskId },
      select: { id: true, title: true, description: true },
    });
    if (!task) {
      console.warn(`[wishonia-task-reply] Task ${input.taskId} not found`);
      return;
    }

    const impactSummary = await buildImpactSummary(input.taskId);

    // RAG retrieval
    const ragQuery = `${input.userComment}\n\nTask: ${task.title}`;
    const ragResult = await retrieveManualContext(ragQuery, { maxResults: 5 });

    const systemPrompt = buildTaskReplySystemPrompt({
      taskTitle: task.title,
      taskDescription: task.description,
      impactSummary,
      retrievedContext: ragResult.context,
    });

    // Generate the reply with timeout
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.warn("[wishonia-task-reply] GOOGLE_GENERATIVE_AI_API_KEY not configured");
      return;
    }

    // Dynamic import so we don't pull in GoogleGenAI at build time for every route
    const { GoogleGenAI } = await import("@google/genai");
    const genai = new GoogleGenAI({ apiKey });

    const generatePromise = genai.models.generateContent({
      model: RAG_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `A user just commented on a task page:\n\n"${input.userComment}"\n\nRespond as Wishonia. Keep it under 4 short paragraphs. Lead with specific numbers from the context.`,
            },
          ],
        },
      ],
      config: {
        systemInstruction: systemPrompt.replace(
          "Keep every response to 2-4 sentences. This is voice, not a lecture.",
          "Keep responses focused — under 4 short paragraphs. You are writing, not speaking.",
        ),
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Wishonia generation exceeded ${WISHONIA_GENERATION_TIMEOUT_MS}ms`)),
        WISHONIA_GENERATION_TIMEOUT_MS,
      ),
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const answer = response.text?.trim();

    if (!answer) {
      console.warn("[wishonia-task-reply] Empty response from Gemini");
      return;
    }

    // Post the reply
    const citationsJson: Prisma.InputJsonValue | null =
      ragResult.citations.length > 0
        ? ({
            citations: ragResult.citations.map((c) => ({
              title: c.title,
              url: c.url,
              path: c.path ?? null,
              description: c.description ?? null,
            })),
          } as Prisma.InputJsonValue)
        : null;

    await postComment({
      taskId: input.taskId,
      authorUserId: wishoniaUserId,
      parentCommentId: input.parentCommentId,
      message: answer,
      citationsJson,
    });

    console.log(
      `[wishonia-task-reply] Posted reply to comment ${input.parentCommentId} on task ${input.taskId}`,
    );
  } catch (error) {
    // Never throw — this is a background task
    console.error("[wishonia-task-reply] Failed to generate reply:", error);
  }
}
