import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  updateTaskMilestone: vi.fn(),
}));

vi.mock("@/lib/auth-utils", () => ({
  requireAuth: mocks.requireAuth,
}));

vi.mock("@/lib/tasks/milestones.server", () => ({
  updateTaskMilestone: mocks.updateTaskMilestone,
}));

import { PATCH } from "./route";

describe("task milestone route", () => {
  beforeEach(() => {
    mocks.requireAuth.mockReset();
    mocks.updateTaskMilestone.mockReset();
  });

  it("returns 401 when authentication fails", async () => {
    mocks.requireAuth.mockRejectedValue(new Error("Unauthorized"));

    const response = await PATCH(
      new Request("http://localhost/api/tasks/task_1/milestones/m_1", {
        body: JSON.stringify({ status: "IN_PROGRESS" }),
        method: "PATCH",
      }),
      {
        params: Promise.resolve({ id: "task_1", milestoneId: "m_1" }),
      },
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("rejects invalid milestone status values", async () => {
    mocks.requireAuth.mockResolvedValue({ userId: "admin_1" });

    const response = await PATCH(
      new Request("http://localhost/api/tasks/task_1/milestones/m_1", {
        body: JSON.stringify({ status: "BOGUS" }),
        method: "PATCH",
      }),
      {
        params: Promise.resolve({ id: "task_1", milestoneId: "m_1" }),
      },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid milestone status." });
  });

  it("passes milestone updates through to the server helper", async () => {
    mocks.requireAuth.mockResolvedValue({ userId: "admin_1" });
    mocks.updateTaskMilestone.mockResolvedValue({ id: "m_1", status: "VERIFIED" });

    const response = await PATCH(
      new Request("http://localhost/api/tasks/task_1/milestones/m_1", {
        body: JSON.stringify({
          evidenceNote: "Office acknowledged via press release.",
          evidenceUrl: "https://example.com/proof",
          status: "VERIFIED",
        }),
        method: "PATCH",
      }),
      {
        params: Promise.resolve({ id: "task_1", milestoneId: "m_1" }),
      },
    );

    expect(response.status).toBe(200);
    expect(mocks.updateTaskMilestone).toHaveBeenCalledWith("task_1", "m_1", "admin_1", {
      evidenceNote: "Office acknowledged via press release.",
      evidenceUrl: "https://example.com/proof",
      status: "VERIFIED",
    });
    await expect(response.json()).resolves.toMatchObject({ success: true });
  });
});
