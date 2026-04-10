import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  getTaskDetailData: vi.fn(),
  requireAuth: vi.fn(),
  updateOwnedTask: vi.fn(),
}));

vi.mock("next-auth", () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("@/lib/auth-utils", () => ({
  requireAuth: mocks.requireAuth,
}));

vi.mock("@/lib/tasks.server", () => ({
  getTaskDetailData: mocks.getTaskDetailData,
  updateOwnedTask: mocks.updateOwnedTask,
}));

import { GET, PATCH } from "./route";

describe("task detail route", () => {
  beforeEach(() => {
    mocks.getServerSession.mockReset();
    mocks.getTaskDetailData.mockReset();
    mocks.requireAuth.mockReset();
    mocks.updateOwnedTask.mockReset();
  });

  it("returns 404 when the task is not accessible", async () => {
    mocks.getServerSession.mockResolvedValue(null);
    mocks.getTaskDetailData.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/api/tasks/task_1"), {
      params: Promise.resolve({ id: "task_1" }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Task not found." });
  });

  it("returns detail data for an accessible task", async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: "user_1" } });
    mocks.getTaskDetailData.mockResolvedValue({ task: { id: "task_1" }, viewer: null });

    const response = await GET(new Request("http://localhost/api/tasks/task_1"), {
      params: Promise.resolve({ id: "task_1" }),
    });

    expect(response.status).toBe(200);
    expect(mocks.getTaskDetailData).toHaveBeenCalledWith("task_1", "user_1");
    await expect(response.json()).resolves.toMatchObject({ success: true });
  });

  it("updates an owned task for the authenticated user", async () => {
    mocks.requireAuth.mockResolvedValue({ userId: "user_1" });
    mocks.updateOwnedTask.mockResolvedValue({ id: "task_1", title: "Updated" });

    const response = await PATCH(
      new Request("http://localhost/api/tasks/task_1", {
        body: JSON.stringify({
          dueAt: "2026-04-20T00:00:00.000Z",
          title: "Updated",
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      }),
      {
        params: Promise.resolve({ id: "task_1" }),
      },
    );

    expect(response.status).toBe(200);
    expect(mocks.updateOwnedTask).toHaveBeenCalledWith(
      "task_1",
      "user_1",
      expect.objectContaining({
        dueAt: expect.any(Date),
        title: "Updated",
      }),
    );
    await expect(response.json()).resolves.toMatchObject({ success: true });
  });
});
