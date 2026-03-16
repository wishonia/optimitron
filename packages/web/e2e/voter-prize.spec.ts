/**
 * Earth Optimization Prize page — smoke + content tests.
 *
 * Run against the running dev server:
 *   SKIP_SERVER=1 npx playwright test e2e/contribute.spec.ts
 */
import { test, expect } from "@playwright/test";

test("contribute: loads successfully", async ({ page }) => {
  const response = await page.goto("/contribute");
  const status = response?.status() ?? 0;

  if (status >= 500) {
    test.skip(true, "Voter prize page returned 500 (likely needs database)");
    return;
  }

  expect(status).toBeLessThan(400);
  await expect(page).toHaveTitle(/Earth Optimization Prize/i);
});

test("contribute: renders hero and how-it-works", async ({ page }) => {
  const response = await page.goto("/contribute");
  if ((response?.status() ?? 0) >= 500) {
    test.skip(true, "Needs database");
    return;
  }
  await page.waitForLoadState("domcontentloaded");

  await expect(
    page.locator("text=Fund the Future. Reward the Voters."),
  ).toBeVisible({ timeout: 10_000 });

  await expect(
    page.locator("text=Depositors Fund the Treasury").first(),
  ).toBeVisible({ timeout: 10_000 });

  await expect(
    page.locator("text=Voters Earn VOTE Tokens").first(),
  ).toBeVisible();
});

test("contribute: renders wallet connect and deposit form", async ({
  page,
}) => {
  const response = await page.goto("/contribute");
  if ((response?.status() ?? 0) >= 500) {
    test.skip(true, "Needs database");
    return;
  }
  await page.waitForLoadState("domcontentloaded");

  await expect(
    page.locator("text=Connect Wallet").first(),
  ).toBeVisible({ timeout: 10_000 });

  await expect(
    page.locator("text=Deposit to Prize Treasury").first(),
  ).toBeVisible({ timeout: 10_000 });

  // Preset amount buttons
  for (const amount of ["$100", "$500", "$1,000", "$5,000"]) {
    await expect(
      page.locator(`button:has-text("${amount}")`),
    ).toBeVisible();
  }
});

test("contribute: renders contract architecture", async ({ page }) => {
  const response = await page.goto("/contribute");
  if ((response?.status() ?? 0) >= 500) {
    test.skip(true, "Needs database");
    return;
  }
  await page.waitForLoadState("domcontentloaded");

  await expect(
    page.locator("text=Contract Architecture").first(),
  ).toBeVisible({ timeout: 10_000 });

  await expect(page.locator("text=VOTE (ERC-20)").first()).toBeVisible();
  await expect(
    page.locator("text=PRIZE (ERC-20 Vault)").first(),
  ).toBeVisible();
  await expect(page.locator("text=Aave V3 (USDC)").first()).toBeVisible();
});

test("contribute: renders VOTE token section and CTA", async ({ page }) => {
  const response = await page.goto("/contribute");
  if ((response?.status() ?? 0) >= 500) {
    test.skip(true, "Needs database");
    return;
  }
  await page.waitForLoadState("domcontentloaded");

  await expect(
    page.locator("h2:has-text('Your VOTE Tokens')").first(),
  ).toBeVisible({ timeout: 10_000 });

  await expect(
    page.locator("text=Democracy Should Pay").first(),
  ).toBeVisible({ timeout: 10_000 });

  const referendumLinks = page.locator('a[href="/referendum"]');
  expect(await referendumLinks.count()).toBeGreaterThan(0);
});
