import {
  TaskClaimPolicy,
  TaskClaimStatus,
  TaskStatus,
} from "@optimitron/db";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  grantWishes: vi.fn(),
  prisma: {
    taskClaimFindUniqueOrThrow: vi.fn(),
    taskClaimUpdate: vi.fn(),
    transaction: vi.fn(),
    userFindUniqueOrThrow: vi.fn(),
  },
  tx: {
    taskClaimFindUniqueOrThrow: vi.fn(),
    taskClaimUpdate: vi.fn(),
    taskFindUniqueOrThrow: vi.fn(),
    taskUpdate: vi.fn(),
  },
}));

vi.mock("@/lib/person.server", () => ({
  findOrCreatePerson: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: mocks.prisma.transaction,
    taskClaim: {
      findUniqueOrThrow: mocks.prisma.taskClaimFindUniqueOrThrow,
      update: mocks.prisma.taskClaimUpdate,
    },
    user: {
      findUniqueOrThrow: mocks.prisma.userFindUniqueOrThrow,
    },
  },
}));

vi.mock("@/lib/wishes.server", () => ({
  grantWishes: mocks.grantWishes,
}));

import { completeTaskClaim, verifyTask } from "../tasks.server";

function createTransactionClient() {
  return {
    task: {
      findUniqueOrThrow: mocks.tx.taskFindUniqueOrThrow,
      update: mocks.tx.taskUpdate,
    },
    taskClaim: {
      findUniqueOrThrow: mocks.tx.taskClaimFindUniqueOrThrow,
      update: mocks.tx.taskClaimUpdate,
    },
  };
}

function resetAllMocks() {
  mocks.grantWishes.mockReset();

  for (const group of [mocks.prisma, mocks.tx]) {
    for (const mockFn of Object.values(group)) {
      mockFn.mockReset();
    }
  }
}

describe("tasks server", () => {
  beforeEach(() => {
    resetAllMocks();
    mocks.prisma.transaction.mockImplementation(
      async (callback: (tx: ReturnType<typeof createTransactionClient>) => unknown) =>
        callback(createTransactionClient()),
    );
  });

  it("completes active claims without overwriting their original start time", async () => {
    const claimedAt = new Date("2026-04-09T18:00:00.000Z");
    mocks.prisma.taskClaimFindUniqueOrThrow.mockResolvedValue({
      claimedAt,
      id: "claim_1",
      startedAt: null,
      status: TaskClaimStatus.CLAIMED,
    });
    mocks.prisma.taskClaimUpdate.mockResolvedValue({
      id: "claim_1",
      status: TaskClaimStatus.COMPLETED,
    });

    await completeTaskClaim("task_1", "user_1", "https://evidence.example");

    expect(mocks.prisma.taskClaimUpdate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        completionEvidence: "https://evidence.example",
        startedAt: claimedAt,
        status: TaskClaimStatus.COMPLETED,
      }),
      where: { id: "claim_1" },
    });
  });

  it("rejects claim verification before completion evidence has been submitted", async () => {
    mocks.prisma.userFindUniqueOrThrow.mockResolvedValue({
      id: "admin_1",
      isAdmin: true,
    });
    mocks.tx.taskFindUniqueOrThrow.mockResolvedValue({
      claimPolicy: TaskClaimPolicy.OPEN_SINGLE,
      id: "task_1",
      status: TaskStatus.ACTIVE,
    });
    mocks.tx.taskClaimFindUniqueOrThrow.mockResolvedValue({
      completionEvidence: null,
      id: "claim_1",
      status: TaskClaimStatus.CLAIMED,
      taskId: "task_1",
      userId: "user_1",
    });

    await expect(
      verifyTask("task_1", "admin_1", {
        claimId: "claim_1",
      }),
    ).rejects.toThrow("Claim must be completed before it can be verified.");

    expect(mocks.tx.taskClaimUpdate).not.toHaveBeenCalled();
    expect(mocks.tx.taskUpdate).not.toHaveBeenCalled();
    expect(mocks.grantWishes).not.toHaveBeenCalled();
  });
});
