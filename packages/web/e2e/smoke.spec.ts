/**
 * Smoke tests: verify all pages load without errors and have valid metadata.
 *
 * Page list is derived from ROUTES in routes.ts — adding a new route
 * automatically adds it to these tests.
 *
 * Auth-required pages are tested by signing in with the demo account first.
 *
 * Run:
 *   SKIP_SERVER=1 BASE_URL=http://localhost:3333 npx playwright test e2e/smoke.spec.ts
 */
import { test, expect } from "@playwright/test";
import {
  ALL_PAGE_PATHS,
  AUTH_REQUIRED_PATHS,
  PUBLIC_PAGE_PATHS,
} from "./utils/static-pages";

// ---------------------------------------------------------------------------
// Helper: sign in via credentials API
// ---------------------------------------------------------------------------

async function signInViaApi(
  request: import("@playwright/test").APIRequestContext,
): Promise<boolean> {
  const csrfResponse = await request.get("/api/auth/csrf");
  if (csrfResponse.status() >= 500) return false;

  const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };

  const signInResponse = await request.post(
    "/api/auth/callback/credentials",
    {
      form: {
        email: "demo@optimitron.org",
        password: "demo1234",
        csrfToken,
        json: "true",
      },
    },
  );

  return signInResponse.status() < 400;
}

// ---------------------------------------------------------------------------
// Public pages — no auth needed
// ---------------------------------------------------------------------------

for (const path of PUBLIC_PAGE_PATHS) {
  test(`${path} loads without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => {
      if (err.message.includes("Hydration")) return;
      errors.push(err.message);
    });

    const response = await page.goto(path);
    const status = response?.status() ?? 0;

    if (status >= 500) {
      test.skip(true, `${path} returned ${status} (needs database)`);
      return;
    }

    expect(status).toBeLessThan(400);
    expect(errors).toEqual([]);
  });

  test(`${path} has valid page metadata`, async ({ page }) => {
    const response = await page.goto(path);
    const status = response?.status() ?? 0;

    if (status >= 400) {
      test.skip(true, `${path} returned ${status}`);
      return;
    }

    const title = await page.title();
    expect(title, `<title> should not be empty`).toBeTruthy();

    const description = await page
      .$eval('meta[name="description"]', (el) => el.getAttribute("content"))
      .catch(() => null);
    expect(description, `should have <meta name="description">`).toBeTruthy();
    expect(
      (description ?? "").length,
      `<meta description> should not be empty`,
    ).toBeGreaterThan(0);
  });
}

// ---------------------------------------------------------------------------
// Auth-required pages — sign in with demo account first
// ---------------------------------------------------------------------------

for (const path of [...AUTH_REQUIRED_PATHS]) {
  test(`${path} loads without errors (authenticated)`, async ({
    page,
    request,
  }) => {
    const signedIn = await signInViaApi(request);
    if (!signedIn) {
      test.skip(true, "Auth API not available (needs database)");
      return;
    }

    const errors: string[] = [];
    page.on("pageerror", (err) => {
      if (err.message.includes("Hydration")) return;
      errors.push(err.message);
    });

    const response = await page.goto(path);
    const status = response?.status() ?? 0;

    if (status >= 500) {
      test.skip(true, `${path} returned ${status} (needs database)`);
      return;
    }

    expect(status).toBeLessThan(400);
    expect(errors).toEqual([]);
  });

  test(`${path} has valid page metadata (authenticated)`, async ({
    page,
    request,
  }) => {
    const signedIn = await signInViaApi(request);
    if (!signedIn) {
      test.skip(true, "Auth API not available (needs database)");
      return;
    }

    const response = await page.goto(path);
    const status = response?.status() ?? 0;

    if (status >= 400) {
      test.skip(true, `${path} returned ${status}`);
      return;
    }

    const title = await page.title();
    expect(title, `<title> should not be empty`).toBeTruthy();

    const description = await page
      .$eval('meta[name="description"]', (el) => el.getAttribute("content"))
      .catch(() => null);
    expect(description, `should have <meta name="description">`).toBeTruthy();
    expect(
      (description ?? "").length,
      `<meta description> should not be empty`,
    ).toBeGreaterThan(0);
  });
}
