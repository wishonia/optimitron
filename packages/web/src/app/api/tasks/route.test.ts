import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createOwnedTask: vi.fn(),
  getServerSession: vi.fn(),
  listTasks: vi.fn(),
  requireAuth: vi.fn(),
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
  createOwnedTask: mocks.createOwnedTask,
  listTasks: mocks.listTasks,
}));

import { GET, POST } from "./route";

describe("tasks route", () => {
  beforeEach(() => {
    mocks.createOwnedTask.mockReset();
    mocks.getServerSession.mockReset();
    mocks.listTasks.mockReset();
    mocks.requireAuth.mockReset();
  });

  it("lists owned tasks when requested", async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: "user_1" } });
    mocks.listTasks.mockResolvedValue([{ id: "task_1" }]);

    const response = await GET(
      new Request(
        "http://localhost/api/tasks?visibility=owned&status=ACTIVE&frameKey=TWENTY_YEAR",
      ),
    );

    expect(response.status).toBe(200);
    expect(mocks.listTasks).toHaveBeenCalledWith(
      expect.objectContaining({
        frameKey: "TWENTY_YEAR",
        status: "ACTIVE",
        userId: "user_1",
        visibility: "owned",
      }),
    );
    await expect(response.json()).resolves.toMatchObject({ success: true });
  });

  it("returns 401 when creating a task without auth", async () => {
    mocks.requireAuth.mockRejectedValue(new Error("Unauthorized"));

    const response = await POST(
      new Request("http://localhost/api/tasks", {
        body: JSON.stringify({ title: "Write docs" }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("creates an owned task for the authenticated user", async () => {
    mocks.requireAuth.mockResolvedValue({ userId: "user_1" });
    mocks.createOwnedTask.mockResolvedValue({ id: "task_1", title: "Write docs" });

    const response = await POST(
      new Request("http://localhost/api/tasks", {
        body: JSON.stringify({
          dueAt: "2026-04-15T00:00:00.000Z",
          isPublic: false,
          title: "Write docs",
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
    );

    expect(response.status).toBe(201);
    expect(mocks.createOwnedTask).toHaveBeenCalledWith(
      "user_1",
      expect.objectContaining({
        dueAt: expect.any(Date),
        isPublic: false,
        title: "Write docs",
      }),
    );
    await expect(response.json()).resolves.toMatchObject({ success: true });
  });
});
