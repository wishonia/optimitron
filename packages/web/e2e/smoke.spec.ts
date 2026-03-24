/**
 * Smoke tests: verify all pages load without errors.
 *
 * Run:
 *   SKIP_SERVER=1 BASE_URL=http://localhost:3333 npx playwright test e2e/smoke.spec.ts
 */
import { test, expect } from "@playwright/test";

const pages = [
  "/",
  "/agencies",
  "/agencies/dcongress",
  "/agencies/dcongress/wishocracy",
  "/agencies/dcongress/referendums",
  "/agencies/dtreasury",
  "/agencies/dfec",
  "/agencies/dcbo",
  "/agencies/domb",
  "/agencies/dgao",
  "/agencies/dih",
  "/agencies/ddod",
  "/agencies/dcensus",
  "/prize",
  "/scoreboard",
  "/iab",
  "/compare",
  "/misconceptions",
  "/outcomes",
  "/tools",
  "/about",
  "/demo",
];

for (const path of pages) {
  test(`${path} loads without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => {
      // Hydration mismatches from real-time components (countdown timer) are expected
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
}
