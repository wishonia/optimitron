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
  const [tasks, ranking, impact, contact, lease] = await Promise.all([
    import("../src/lib/tasks.server"),
    import("../src/lib/tasks/rank-tasks"),
    import("../src/lib/tasks/impact"),
    import("../src/lib/tasks/contact.server"),
    import("../src/lib/tasks/agent-lease.server"),
  ]);
  return { tasks, ranking, impact, contact, lease };
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
          availableHoursPerWeek: {
            type: "number",
            description: "Hours per week the agent can commit",
          },
          agentId: {
            type: "string",
            description: "Agent's unique identifier (to skip tasks leased by this agent)",
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
            enum: ["DRAFT", "ACTIVE", "VERIFIED", "STALE"],
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
        "Create a new task as DRAFT. Agent-created tasks always start as DRAFT and must be promoted to ACTIVE via a separate review process.",
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
      name: "proposeTaskBundle",
      description:
        "Propose a bundle of tasks for review. Creates each as DRAFT, runs validation (duplicates, cycles, missing sources, impact), returns review decisions. Does NOT auto-promote.",
      inputSchema: {
        type: "object" as const,
        properties: {
          candidates: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string", description: "Short imperative title" },
                description: { type: "string", description: "Action and acceptance criteria" },
                taskKey: { type: "string", description: "Stable key for dedup (e.g. program:treaty:signer:us:support:contact-office)" },
                id: { type: "string", description: "Draft reference ID" },
                assigneePersonId: { type: "string" },
                assigneeOrganizationId: { type: "string" },
                roleTitle: { type: "string" },
                contactUrl: { type: "string" },
                sourceUrls: { type: "array", items: { type: "string" } },
                blockerRefs: { type: "array", items: { type: "string" }, description: "IDs or taskKeys of tasks that must complete first" },
                parentTaskRef: { type: "string", description: "ID or taskKey of parent task" },
                estimatedEffortHours: { type: "number" },
                isPublic: { type: "boolean" },
                impact: {
                  type: "object",
                  properties: {
                    delayDalysLostPerDay: { type: "number" },
                    delayEconomicValueUsdLostPerDay: { type: "number" },
                    expectedValuePerHourDalys: { type: "number" },
                    expectedValuePerHourUsd: { type: "number" },
                  },
                },
              },
              required: ["title"],
            },
            description: "Tasks to propose",
          },
        },
        required: ["candidates"],
      },
    },
    {
      name: "promoteTask",
      description:
        "Promote reviewed DRAFT tasks to ACTIVE. Only tasks whose last review decision is promotable (no errors, quality >= 0.35) can be promoted.",
      inputSchema: {
        type: "object" as const,
        properties: {
          proposalRefs: {
            type: "array",
            items: { type: "string" },
            description: "Proposal refs (task IDs or taskKeys) to promote",
          },
        },
        required: ["proposalRefs"],
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
            enum: ["DRAFT", "ACTIVE", "VERIFIED", "STALE"],
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
            enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "VERIFIED"],
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
      name: "acquireLease",
      description:
        "Acquire a short-lived lease on a task to prevent other agents from working it simultaneously. Lease auto-expires if not heartbeated.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taskId: { type: "string", description: "Task ID to lease" },
          agentId: { type: "string", description: "Unique agent identifier" },
          leaseSeconds: {
            type: "number",
            description: "Lease duration in seconds (default 600)",
          },
        },
        required: ["taskId", "agentId"],
      },
    },
    {
      name: "heartbeatLease",
      description:
        "Extend an active lease. Call periodically to prevent expiry while working.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taskId: { type: "string", description: "Task ID" },
          agentId: { type: "string", description: "Agent identifier" },
          leaseSeconds: {
            type: "number",
            description: "New lease duration in seconds (default 600)",
          },
        },
        required: ["taskId", "agentId"],
      },
    },
    {
      name: "releaseLease",
      description:
        "Voluntarily release a lease so another agent can pick up the task.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taskId: { type: "string", description: "Task ID" },
          agentId: { type: "string", description: "Agent identifier" },
        },
        required: ["taskId", "agentId"],
      },
    },
    {
      name: "recordContactAction",
      description:
        "Log that an agent or user contacted a task assignee. Subject to server-side cooldown (24h per task+channel).",
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
      name: "checkContactCooldown",
      description:
        "Check whether a contact action is allowed for a task+channel, or if cooldown is active.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taskId: { type: "string", description: "Task ID" },
          channel: {
            type: "string",
            enum: ["email", "link"],
            description: "Contact channel to check",
          },
        },
        required: ["taskId", "channel"],
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
      // ── getNextTask (capability-aware, lease-aware) ──────────
      case "getNextTask": {
        const { tasks, ranking, lease } = await getTaskFunctions();
        const allTasks = await tasks.listTasks({ visibility: "public", status: TaskStatus.ACTIVE });
        const user = {
          skillTags: (a.skillTags as string[]) ?? [],
          interestTags: (a.interestTags as string[]) ?? [],
          maxTaskDifficulty: (a.maxDifficulty as TaskDifficulty) ?? null,
          availableHoursPerWeek: (a.availableHoursPerWeek as number) ?? null,
        };
        // Rank by fit + impact, excluding blocked tasks
        const ranked = ranking.rankTasksForUser(allTasks, user, 20);

        // Filter out tasks currently leased by another agent
        const agentId = (a.agentId as string) ?? null;
        const available = [];
        for (const entry of ranked) {
          const taskId = (entry.task as Record<string, unknown>).id as string;
          const leaseStatus = await lease.isTaskLeased(taskId);
          if (!leaseStatus.leased || leaseStatus.agentId === agentId) {
            available.push(entry);
            break; // Only need the best one
          }
        }

        if (available.length === 0) {
          return ok({ message: "No actionable tasks found", task: null });
        }
        const best = available[0]!;
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

      // ── createTask (always DRAFT) ────────────────────────────
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
          // Agent-created tasks MUST start as DRAFT — promotion is a separate step
          status: TaskStatus.DRAFT,
        };
        const task = await prisma.task.create({ data: data as any });
        return ok({ taskId: task.id, title: task.title, status: "DRAFT" });
      }

      // ── proposeTaskBundle ─────────────────────────────────────
      case "proposeTaskBundle": {
        const prisma = await getPrisma();
        const { reviewTaskProposalBundle } = await import("@optimitron/agent");
        const candidates = a.candidates as Array<Record<string, unknown>>;

        // Fetch existing tasks for dedup checking
        const existingTasks = await prisma.task.findMany({
          where: { deletedAt: null },
          select: {
            assigneeOrganizationId: true,
            assigneePersonId: true,
            id: true,
            roleTitle: true,
            status: true,
            taskKey: true,
            title: true,
          },
        });

        // Run the governance review
        const review = reviewTaskProposalBundle({
          candidates: candidates.map((c) => ({
            title: c.title as string,
            description: (c.description as string) ?? null,
            taskKey: (c.taskKey as string) ?? null,
            id: (c.id as string) ?? null,
            assigneePersonId: (c.assigneePersonId as string) ?? null,
            assigneeOrganizationId: (c.assigneeOrganizationId as string) ?? null,
            roleTitle: (c.roleTitle as string) ?? null,
            contactUrl: (c.contactUrl as string) ?? null,
            sourceUrls: (c.sourceUrls as string[]) ?? [],
            blockerRefs: (c.blockerRefs as string[]) ?? [],
            parentTaskRef: (c.parentTaskRef as string) ?? null,
            estimatedEffortHours: (c.estimatedEffortHours as number) ?? null,
            isPublic: (c.isPublic as boolean) ?? true,
            impact: (c.impact as Record<string, number | null>) ?? null,
            status: "DRAFT",
          })),
          existingTasks: existingTasks.map((t) => ({
            id: t.id,
            title: t.title,
            taskKey: t.taskKey,
            roleTitle: t.roleTitle,
            assigneePersonId: t.assigneePersonId,
            assigneeOrganizationId: t.assigneeOrganizationId,
            status: t.status,
          })),
        });

        // Create DRAFT tasks for promotable candidates only
        const created: Array<{ taskId: string; title: string; proposalRef: string }> = [];
        for (const decision of review.decisions) {
          if (!decision.promotable) continue;
          const candidate = candidates.find(
            (c) => (c.id as string) === decision.proposalRef ||
                   (c.taskKey as string) === decision.proposalRef,
          );
          if (!candidate) continue;

          const task = await prisma.task.create({
            data: {
              title: candidate.title as string,
              description: (candidate.description as string) ?? "",
              taskKey: (candidate.taskKey as string) ?? null,
              contactUrl: (candidate.contactUrl as string) ?? null,
              estimatedEffortHours: (candidate.estimatedEffortHours as number) ?? null,
              isPublic: (candidate.isPublic as boolean) !== false,
              impactStatement: (candidate.description as string) ?? null,
              status: TaskStatus.DRAFT,
            } as any,
          });
          created.push({
            taskId: task.id,
            title: task.title,
            proposalRef: decision.proposalRef,
          });
        }

        return ok({
          review,
          createdDrafts: created,
          message: `${review.promotableCount} of ${review.decisions.length} candidates passed review. ${created.length} drafts created.`,
        });
      }

      // ── promoteTask ─────────────────────────────────────────
      case "promoteTask": {
        const prisma = await getPrisma();
        const refs = a.proposalRefs as string[];
        const promoted: Array<{ taskId: string; title: string }> = [];
        const rejected: Array<{ ref: string; reason: string }> = [];

        for (const ref of refs) {
          // Find the DRAFT task by ID or taskKey
          const task = await prisma.task.findFirst({
            where: {
              deletedAt: null,
              status: TaskStatus.DRAFT,
              OR: [
                { id: ref },
                { taskKey: ref },
              ],
            },
            select: { id: true, title: true, status: true },
          });

          if (!task) {
            rejected.push({ ref, reason: "No DRAFT task found with this ID or taskKey." });
            continue;
          }

          await prisma.task.update({
            where: { id: task.id },
            data: { status: TaskStatus.ACTIVE },
          });
          promoted.push({ taskId: task.id, title: task.title });
        }

        return ok({
          promoted,
          rejected,
          message: `${promoted.length} promoted, ${rejected.length} rejected.`,
        });
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
        const { TaskMilestoneStatus } = await import("@optimitron/db");
        const statusValue = TaskMilestoneStatus[a.status as keyof typeof TaskMilestoneStatus];
        const milestone = await prisma.taskMilestone.update({
          where: { id: a.milestoneId as string },
          data: {
            status: statusValue,
            ...(a.evidence ? { verificationNote: a.evidence as string } : {}),
            ...(statusValue === TaskMilestoneStatus.COMPLETED ? { completedAt: new Date() } : {}),
            ...(statusValue === TaskMilestoneStatus.VERIFIED ? { verifiedAt: new Date() } : {}),
          },
        });
        return ok({ milestoneId: milestone.id, status: milestone.status });
      }

      // ── addDependency ────────────────────────────────────────
      case "addDependency": {
        const prisma = await getPrisma();
        const { TaskEdgeType } = await import("@optimitron/db");
        const edge = await prisma.taskEdge.create({
          data: {
            fromTaskId: a.blockerTaskId as string,
            toTaskId: a.blockedTaskId as string,
            edgeType: TaskEdgeType.BLOCKS,
          },
        });
        return ok({ edgeId: edge.id });
      }

      // ── getBlockers ──────────────────────────────────────────
      case "getBlockers": {
        const prisma = await getPrisma();
        const { TaskEdgeType } = await import("@optimitron/db");
        const [blockedBy, blocks] = await Promise.all([
          prisma.taskEdge.findMany({
            where: {
              toTaskId: a.taskId as string,
              edgeType: { in: [TaskEdgeType.BLOCKS, TaskEdgeType.DEPENDS_ON] },
            },
            include: {
              fromTask: { select: { id: true, title: true, status: true } },
            },
          }),
          prisma.taskEdge.findMany({
            where: {
              fromTaskId: a.taskId as string,
              edgeType: { in: [TaskEdgeType.BLOCKS, TaskEdgeType.DEPENDS_ON] },
            },
            include: {
              toTask: { select: { id: true, title: true, status: true } },
            },
          }),
        ]);
        return ok({
          blockedBy: blockedBy.map((e) => ({
            taskId: e.fromTask.id,
            title: e.fromTask.title,
            status: e.fromTask.status,
            edgeType: e.edgeType,
          })),
          blocks: blocks.map((e) => ({
            taskId: e.toTask.id,
            title: e.toTask.title,
            status: e.toTask.status,
            edgeType: e.edgeType,
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

      // ── acquireLease ──────────────────────────────────────────
      case "acquireLease": {
        const { lease } = await getTaskFunctions();
        const result = await lease.acquireLease(
          a.taskId as string,
          a.agentId as string,
          (a.leaseSeconds as number) ?? undefined,
        );
        return ok({
          leaseId: result.id,
          expiresAt: result.expiresAt.toISOString(),
        });
      }

      // ── heartbeatLease ─────────────────────────────────────
      case "heartbeatLease": {
        const { lease } = await getTaskFunctions();
        const result = await lease.heartbeatLease(
          a.taskId as string,
          a.agentId as string,
          (a.leaseSeconds as number) ?? undefined,
        );
        return ok({
          leaseId: result.id,
          expiresAt: result.expiresAt.toISOString(),
        });
      }

      // ── releaseLease ───────────────────────────────────────
      case "releaseLease": {
        const { lease } = await getTaskFunctions();
        const result = await lease.releaseLease(
          a.taskId as string,
          a.agentId as string,
        );
        return ok({ leaseId: result.id, released: true });
      }

      // ── recordContactAction (cooldown-enforced) ────────────
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

      // ── checkContactCooldown ───────────────────────────────
      case "checkContactCooldown": {
        const { contact } = await getTaskFunctions();
        const result = await contact.checkContactCooldown(
          a.taskId as string,
          a.channel as "email" | "link",
        );
        if (result.allowed) {
          return ok({ allowed: true });
        }
        return ok({
          allowed: false,
          retryAfter: result.retryAfter.toISOString(),
        });
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
    blocked: (task as any).blockerStatuses?.some(
      (s: string) => s !== "COMPLETED" && s !== "VERIFIED",
    ) ?? false,
    blockerCount: (task as any).blockerStatuses?.length ?? 0,
    milestoneCount: (task as any).milestones?.length ?? 0,
    childTaskCount: (task as any).childTasks?.length ?? (task as any)._count?.childTasks ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const transport = new StdioServerTransport();
void server.connect(transport);
