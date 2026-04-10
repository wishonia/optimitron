import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  recordTaskContactAction: vi.fn(),
}));

vi.mock("@/lib/auth-utils", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));

vi.mock("@/lib/tasks/contact.server", () => ({
  recordTaskContactAction: mocks.recordTaskContactAction,
}));

import { POST } from "./route";

describe("task contact route", () => {
  beforeEach(() => {
    mocks.getCurrentUser.mockReset();
    mocks.recordTaskContactAction.mockReset();
  });

  it("succeeds without tracking when the user is anonymous", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);

    const response = await POST(
      new Request("http://localhost/api/tasks/task_1/contact", {
        body: JSON.stringify({ channel: "link", href: "https://example.com/contact" }),
        method: "POST",
      }),
      {
        params: Promise.resolve({ id: "task_1" }),
      },
    );

    expect(response.status).toBe(200);
    expect(mocks.recordTaskContactAction).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({ success: true, tracked: false });
  });

  it("records tracked contact actions for signed-in users", async () => {
    mocks.getCurrentUser.mockResolvedValue({ id: "user_1" });
    mocks.recordTaskContactAction.mockResolvedValue({});

    const response = await POST(
      new Request("http://localhost/api/tasks/task_1/contact", {
        body: JSON.stringify({
          channel: "email",
          href: "mailto:test@example.com",
          message: "Please do the task.",
        }),
        method: "POST",
      }),
      {
        params: Promise.resolve({ id: "task_1" }),
      },
    );

    expect(response.status).toBe(200);
    expect(mocks.recordTaskContactAction).toHaveBeenCalledWith({
      channel: "email",
      href: "mailto:test@example.com",
      message: "Please do the task.",
      taskId: "task_1",
      userId: "user_1",
    });
    await expect(response.json()).resolves.toEqual({ success: true, tracked: true });
  });
});
