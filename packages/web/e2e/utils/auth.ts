import type { APIRequestContext, Page } from "@playwright/test";

const DEMO_EMAIL = "demo@optimitron.org";
const DEMO_PASSWORD = "demo1234";

export async function signInViaApi(
  request: APIRequestContext,
): Promise<boolean> {
  const csrfResponse = await request.get("/api/auth/csrf");
  if (csrfResponse.status() >= 500) {
    return false;
  }

  const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };

  const signInResponse = await request.post(
    "/api/auth/callback/credentials",
    {
      form: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        csrfToken,
        json: "true",
      },
    },
  );

  return signInResponse.status() < 400;
}

export async function signInDemoUser(page: Page): Promise<boolean> {
  return signInViaApi(page.context().request);
}
