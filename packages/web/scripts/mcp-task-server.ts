/**
 * MCP Server for the Optimitron Task System
 *
 * Exposes the task database to any MCP-compatible agent (Claude Code, Claude
 * mobile, third-party agents). Communicates over stdio.
 *
 * Usage:
 *   npx tsx packages/web/scripts/mcp-task-server.ts
 *
 * Configure in .claude/settings.json:
 *   {
 *     "mcpServers": {
 *       "optimitron-tasks": {
 *         "command": "npx",
 *         "args": ["tsx", "packages/web/scripts/mcp-task-server.ts"],
 *         "cwd": "<repo-root>"
 *       }
 *     }
 *   }
 */

import "./load-env";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  TaskCategory,
  TaskClaimPolicy,
  TaskDifficulty,
  TaskImpactFrameKey,
  TaskStatus,
} from "@optimitron/db";

// Lazy-import server functions so the prisma client isn't created until a tool
// is actually called (keeps startup fast and avoids connection errors during
// tool listing).

async function getTaskFunctions() {
  const [tasks, ranking, impact, contact] = await Promise.all([
    import("../src/lib/tasks.server"),
    import("../src/lib/tasks/rank-tasks"),
    import("../src/lib/tasks/impact"),
    import("../src/lib/tasks/contact.server"),
  ]);
  return { tasks, ranking, impact, contact };
}

async function getPrisma() {
  const { prisma } = await import("../src/lib/prisma");
  return prisma;
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const server = new Server(
  { name: "optimitron-tasks", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "getNextTask",
      description:
        "Get the highest expected-value unblocked task that the caller can work on. Returns the single best task to execute right now.",
      inputSchema: {
        type: "object" as const,
        properties: {
          skillTags: {
            type: "array",
            items: { type: "string" },
            description: "Agent's skill tags for personalized ranking",
          },
          interestTags: {
            type: "array",
            items: { type: "string" },
            description: "Agent's interest tags for personalized ranking",
          },
          maxDifficulty: {
            type: "string",
            enum: ["TRIVIAL", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"],
            description: "Max difficulty the agent can handle",
          },
        },
      },
    },
    {
      name: "listTasks",
      description:
        "List tasks with optional filters. Returns up to 50 tasks sorted by accountability score.",
      inputSchema: {
        type: "object" as const,
        properties: {
          status: {
            type: "string",
            enum: ["ACTIVE", "DRAFT", "PAUSED", "VERIFIED", "COMPLETED", "ARCHIVED"],
            description: "Filter by task status",
          },
          category: {
            type: "string",
            description: "Filter by task category",
          },
          assigneePersonId: {
            type: "string",
            description: "Filter by assignee person ID",
          },
          parentTaskId: {
            type: "string",
            description: "Filter by parent task ID (get subtasks)",
          },
          limit: {
            type: "number",
            description: "Max results (default 20, max 50)",
          },
        },
      },
    },
    {
      name: "getTask",
      description:
        "Get full details for a single task including impact estimates, milestones, dependencies, and evidence.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taskId: { type: "string", description: "Task ID" },
        },
        required: ["taskId"],
      },
    },
    {
      name: "createTask",
      description:
        "Create a new task. Agents use this to decompose work into subtasks.",
      inputSchema: {
        type: "object" as const,
        properties: {
          title: { type: "string", description: "Short imperative title" },
          description: { type: "string", description: "Full explanation and acceptance criteria" },
          parentTaskId: { type: "string", description: "Parent task ID for subtask hierarchy" },
          category: {
            type: "string",
            enum: [
              "GOVERNANCE", "HEALTH", "ECONOMIC", "EDUCATION", "ENVIRONMENT",
              "INFRASTRUCTURE", "RESEARCH", "OUTREACH", "COMMUNICATION",
              "ORGANIZING", "TECHNICAL", "LEGAL", "OTHER",
            ],
            description: "Task category",
          },
          difficulty: {
            type: "string",
            enum: ["TRIVIAL", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"],
            description: "Estimated difficulty",
          },
          skillTags: {
            type: "array",
            items: { type: "string" },
            description: "Skills needed",
          },
          interestTags: {
            type: "array",
            items: { type: "string" },
            description: "Related topics/causes",
          },
          estimatedEffortHours: {
            type: "number",
            description: "Estimated hours to complete",
          },
          dueAt: {
            type: "string",
            description: "Due date (ISO 8601)",
          },
          claimPolicy: {
            type: "string",
            enum: ["ASSIGNED_ONLY", "OPEN_SINGLE", "OPEN_MANY"],
            description: "Who can claim this task",
          },
          contactUrl: { type: "string", description: "URL for contacting the assignee" },
          contactLabel: { type: "string", description: "Label for the contact channel" },
          impactStatement: { type: "string", description: "Why this matters" },
          isPublic: { type: "boolean", description: "Visible in public views (default true)" },
        },
        required: ["title", "description"],
      },
    },
    {
      name: "updateTask",
      description: "Update a task's status, description, or other fields.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taskId: { type: "string", description: "Task ID" },
          status: {
            type: "string",
            enum: ["ACTIVE", "DRAFT", "PAUSED", "VERIFIED", "COMPLETED", "ARCHIVED"],
          },
          title: { type: "string" },
          description: { type: "string" },
          completionEvidence: { type: "string", description: "Evidence that the task is done" },
          impactStatement: { type: "string" },
          difficulty: {
            type: "string",
            enum: ["TRIVIAL", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"],
          },
        },
        required: ["taskId"],
      },
    },
    {
      name: "claimTask",
      description:
        "Claim a task for a user. The agent declares intent to work on it.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taskId: { type: "string", description: "Task ID to claim" },
          userId: { type: "string", description: "User ID claiming the task" },
        },
        required: ["taskId", "userId"],
      },
    },
    {
      name: "completeTaskClaim",
      description:
        "Mark a claimed task as completed with evidence of what was done.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taskId: { type: "string", description: "Task ID" },
          userId: { type: "string", description: "User ID who claimed it" },
          completionEvidence: {
            type: "string",
            description: "What was done and proof it worked",
          },
        },
        required: ["taskId", "userId", "completionEvidence"],
      },
    },
    {
      name: "updateMilestone",
      description: "Update a task milestone's status with evidence.",
      inputSchema: {
        type: "object" as const,
        properties: {
          milestoneId: { type: "string", description: "Milestone ID" },
          status: {
            type: "string",
            enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "VERIFIED", "BLOCKED"],
            description: "New milestone status",
          },
          evidence: { type: "string", description: "Evidence for the status change" },
        },
        required: ["milestoneId", "status"],
      },
    },
    {
      name: "addDependency",
      description:
        "Add a dependency between tasks. The blocked task cannot proceed until the blocker is done.",
      inputSchema: {
        type: "object" as const,
        properties: {
          blockedTaskId: {
            type: "string",
            description: "Task that is blocked",
          },
          blockerTaskId: {
            type: "string",
            description: "Task that must complete first",
          },
          label: {
            type: "string",
            description: "Optional label describing the dependency",
          },
        },
        required: ["blockedTaskId", "blockerTaskId"],
      },
    },
    {
      name: "getBlockers",
      description:
        "Get all tasks blocking a given task, and all tasks this task blocks.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taskId: { type: "string", description: "Task ID" },
        },
        required: ["taskId"],
      },
    },
    {
      name: "logAgentRun",
      description:
        "Log an agent's work — what it did, what it cost, what task it advanced. Links spend to impact.",
      inputSchema: {
        type: "object" as const,
        properties: {
          runId: { type: "string", description: "Unique run identifier" },
          provider: {
            type: "string",
            description: "AI provider (gemini, anthropic, openai)",
          },
          costUsd: { type: "number", description: "Total cost in USD" },
          apiCalls: { type: "number", description: "Number of API calls" },
          taskId: {
            type: "string",
            description: "Task this run worked on",
          },
          status: {
            type: "string",
            enum: ["RUNNING", "COMPLETED", "FAILED", "PARTIAL"],
          },
          outputSummary: {
            type: "string",
            description: "What the run produced",
          },
          depositId: {
            type: "string",
            description: "Deposit that funded this run",
          },
        },
        required: ["runId", "provider", "costUsd", "apiCalls"],
      },
    },
    {
      name: "recordContactAction",
      description:
        "Log that an agent or user contacted a task assignee (e.g. submitted a leader contact form).",
      inputSchema: {
        type: "object" as const,
        properties: {
          taskId: { type: "string", description: "Task ID" },
          userId: { type: "string", description: "User or agent ID" },
          channel: {
            type: "string",
            enum: ["email", "link"],
            description: "Contact channel",
          },
          message: {
            type: "string",
            description: "Message sent (for audit)",
          },
          href: {
            type: "string",
            description: "URL that was contacted",
          },
        },
        required: ["taskId", "userId", "channel"],
      },
    },
    {
      name: "getFundingStats",
      description:
        "Get aggregate funding stats — total deposited, total spent, total agent runs, remaining budget.",
      inputSchema: {
        type: "object" as const,
        properties: {},
      },
    },
  ],
}));

// ---------------------------------------------------------------------------
// Tool handlers
// ---------------------------------------------------------------------------

function ok(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

function err(message: string) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify({ error: message }) }],
    isError: true,
  };
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = (args ?? {}) as Record<string, unknown>;

  try {
    switch (name) {
      // ── getNextTask ──────────────────────────────────────────
      case "getNextTask": {
        const { tasks, ranking } = await getTaskFunctions();
        const allTasks = await tasks.listTasks({ visibility: "public", status: TaskStatus.ACTIVE });
        const user = {
          skillTags: (a.skillTags as string[]) ?? [],
          interestTags: (a.interestTags as string[]) ?? [],
          maxTaskDifficulty: (a.maxDifficulty as TaskDifficulty) ?? null,
          availableHoursPerWeek: null,
        };
        const ranked = ranking.rankTasksForUser(allTasks, user, 1);
        if (ranked.length === 0) {
          return ok({ message: "No actionable tasks found", task: null });
        }
        const best = ranked[0]!;
        return ok({
          score: best.score,
          task: summarizeTask(best.task),
        });
      }

      // ── listTasks ────────────────────────────────────────────
      case "listTasks": {
        const { tasks } = await getTaskFunctions();
        const status = a.status ? TaskStatus[a.status as keyof typeof TaskStatus] : null;
        const list = await tasks.listTasks({
          status,
          assigneePersonId: (a.assigneePersonId as string) ?? null,
          visibility: "public",
        });
        const limit = Math.min(Number(a.limit) || 20, 50);
        let filtered = list;
        if (a.parentTaskId) {
          filtered = list.filter((t: { parentTaskId?: string | null }) => t.parentTaskId === a.parentTaskId);
        }
        return ok(filtered.slice(0, limit).map(summarizeTask));
      }

      // ── getTask ──────────────────────────────────────────────
      case "getTask": {
        const { tasks } = await getTaskFunctions();
        const result = await tasks.getTaskDetailData(a.taskId as string);
        if (!result) return err("Task not found");
        return ok({
          task: result.task,
          contactActionCount: result.contactActionCount,
        });
      }

      // ── createTask ───────────────────────────────────────────
      case "createTask": {
        const prisma = await getPrisma();
        const data: Record<string, unknown> = {
          title: a.title as string,
          description: (a.description as string) ?? "",
          parentTaskId: (a.parentTaskId as string) ?? null,
          category: a.category ? TaskCategory[a.category as keyof typeof TaskCategory] : TaskCategory.OTHER,
          difficulty: a.difficulty ? TaskDifficulty[a.difficulty as keyof typeof TaskDifficulty] : TaskDifficulty.INTERMEDIATE,
          skillTags: (a.skillTags as string[]) ?? [],
          interestTags: (a.interestTags as string[]) ?? [],
          estimatedEffortHours: (a.estimatedEffortHours as number) ?? null,
          dueAt: a.dueAt ? new Date(a.dueAt as string) : null,
          claimPolicy: a.claimPolicy ? TaskClaimPolicy[a.claimPolicy as keyof typeof TaskClaimPolicy] : TaskClaimPolicy.OPEN_MANY,
          contactUrl: (a.contactUrl as string) ?? null,
          contactLabel: (a.contactLabel as string) ?? null,
          impactStatement: (a.impactStatement as string) ?? null,
          isPublic: a.isPublic !== false,
          status: TaskStatus.ACTIVE,
        };
        const task = await prisma.task.create({ data: data as any });
        return ok({ taskId: task.id, title: task.title });
      }

      // ── updateTask ───────────────────────────────────────────
      case "updateTask": {
        const prisma = await getPrisma();
        const updates: Record<string, unknown> = {};
        if (a.status) updates.status = TaskStatus[a.status as keyof typeof TaskStatus];
        if (a.title) updates.title = a.title;
        if (a.description) updates.description = a.description;
        if (a.completionEvidence) updates.completionEvidence = a.completionEvidence;
        if (a.impactStatement) updates.impactStatement = a.impactStatement;
        if (a.difficulty) updates.difficulty = TaskDifficulty[a.difficulty as keyof typeof TaskDifficulty];
        if (a.status === "COMPLETED") updates.completedAt = new Date();
        const task = await prisma.task.update({
          where: { id: a.taskId as string },
          data: updates as any,
        });
        return ok({ taskId: task.id, status: task.status, title: task.title });
      }

      // ── claimTask ────────────────────────────────────────────
      case "claimTask": {
        const { tasks } = await getTaskFunctions();
        const claim = await tasks.claimTask(a.taskId as string, a.userId as string);
        return ok({ claimId: claim.id, status: claim.status });
      }

      // ── completeTaskClaim ────────────────────────────────────
      case "completeTaskClaim": {
        const { tasks } = await getTaskFunctions();
        const claim = await tasks.completeTaskClaim(
          a.taskId as string,
          a.userId as string,
          a.completionEvidence as string,
        );
        return ok({ claimId: claim.id, status: claim.status });
      }

      // ── updateMilestone ──────────────────────────────────────
      case "updateMilestone": {
        const prisma = await getPrisma();
        const milestone = await prisma.taskMilestone.update({
          where: { id: a.milestoneId as string },
          data: {
            status: a.status as string,
            ...(a.evidence ? { verificationNote: a.evidence as string } : {}),
            ...(a.status === "COMPLETED" ? { completedAt: new Date() } : {}),
            ...(a.status === "VERIFIED" ? { verifiedAt: new Date() } : {}),
          },
        });
        return ok({ milestoneId: milestone.id, status: milestone.status });
      }

      // ── addDependency ────────────────────────────────────────
      case "addDependency": {
        const prisma = await getPrisma();
        const edge = await prisma.taskEdge.create({
          data: {
            sourceTaskId: a.blockerTaskId as string,
            targetTaskId: a.blockedTaskId as string,
            label: (a.label as string) ?? "blocks",
          },
        });
        return ok({ edgeId: edge.id });
      }

      // ── getBlockers ──────────────────────────────────────────
      case "getBlockers": {
        const prisma = await getPrisma();
        const [blockedBy, blocks] = await Promise.all([
          prisma.taskEdge.findMany({
            where: { targetTaskId: a.taskId as string },
            include: {
              sourceTask: { select: { id: true, title: true, status: true } },
            },
          }),
          prisma.taskEdge.findMany({
            where: { sourceTaskId: a.taskId as string },
            include: {
              targetTask: { select: { id: true, title: true, status: true } },
            },
          }),
        ]);
        return ok({
          blockedBy: blockedBy.map((e) => ({
            taskId: e.sourceTask.id,
            title: e.sourceTask.title,
            status: e.sourceTask.status,
            label: e.label,
          })),
          blocks: blocks.map((e) => ({
            taskId: e.targetTask.id,
            title: e.targetTask.title,
            status: e.targetTask.status,
            label: e.label,
          })),
        });
      }

      // ── logAgentRun ──────────────────────────────────────────
      case "logAgentRun": {
        const prisma = await getPrisma();
        const run = await prisma.agentRunCost.create({
          data: {
            runId: a.runId as string,
            provider: a.provider as string,
            costUsd: a.costUsd as number,
            apiCalls: a.apiCalls as number,
            taskId: (a.taskId as string) ?? null,
            status: (a.status as string) ?? "COMPLETED",
            outputSummary: (a.outputSummary as string) ?? null,
            depositId: (a.depositId as string) ?? null,
          },
        });
        return ok({ id: run.id, runId: run.runId });
      }

      // ── recordContactAction ──────────────────────────────────
      case "recordContactAction": {
        const { contact } = await getTaskFunctions();
        const activity = await contact.recordTaskContactAction({
          taskId: a.taskId as string,
          userId: a.userId as string,
          channel: a.channel as "email" | "link",
          message: (a.message as string) ?? null,
          href: (a.href as string) ?? null,
        });
        return ok({ activityId: activity.id });
      }

      // ── getFundingStats ──────────────────────────────────────
      case "getFundingStats": {
        const prisma = await getPrisma();
        const [deposits, runs] = await Promise.all([
          prisma.agentComputeDeposit.aggregate({
            _sum: { amountUsd: true, spentUsd: true },
            _count: true,
            where: { deletedAt: null },
          }),
          prisma.agentRunCost.aggregate({
            _sum: { costUsd: true, apiCalls: true },
            _count: true,
          }),
        ]);
        return ok({
          totalDepositedUsd: deposits._sum.amountUsd ?? 0,
          totalSpentUsd: deposits._sum.spentUsd ?? 0,
          remainingBudgetUsd: (deposits._sum.amountUsd ?? 0) - (deposits._sum.spentUsd ?? 0),
          depositCount: deposits._count,
          totalRunCostUsd: runs._sum.costUsd ?? 0,
          totalApiCalls: runs._sum.apiCalls ?? 0,
          runCount: runs._count,
        });
      }

      default:
        return err(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return err(message);
  }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function summarizeTask(task: Record<string, unknown>) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    category: task.category,
    difficulty: task.difficulty,
    taskKey: task.taskKey,
    dueAt: task.dueAt,
    parentTaskId: task.parentTaskId,
    impactStatement: task.impactStatement,
    contactUrl: task.contactUrl,
    contactLabel: task.contactLabel,
    claimPolicy: task.claimPolicy,
    skillTags: task.skillTags,
    interestTags: task.interestTags,
    estimatedEffortHours: task.estimatedEffortHours,
    assigneePersonName: (task as any).assigneePerson?.displayName ?? null,
    assigneeOrgName: (task as any).assigneeOrganization?.name ?? null,
    milestoneCount: (task as any).milestones?.length ?? 0,
    childTaskCount: (task as any).childTasks?.length ?? (task as any)._count?.childTasks ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const transport = new StdioServerTransport();
void server.connect(transport);
