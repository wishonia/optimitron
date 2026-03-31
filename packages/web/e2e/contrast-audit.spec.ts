/**
 * Contrast Audit — Playwright + axe-core
 *
 * Crawls every static route and checks WCAG AA color-contrast.
 * Run with dev server already up:
 *   SKIP_SERVER=1 pnpm --filter @optimitron/web exec playwright test e2e/contrast-audit.spec.ts
 */
import { test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// All static routes from packages/web/src/lib/routes.ts
const PAGES = [
  "/",
  "/prize",
  "/iab",
  "/scoreboard",
  "/about",
  "/compare",
  "/misconceptions",
  "/outcomes",
  "/tools",
  "/wishonia",
  "/moronia",
  "/agencies",
  "/agencies/dcongress",
  "/agencies/dcongress/wishocracy",
  "/agencies/dcongress/referendums",
  "/agencies/dtreasury",
  "/agencies/dtreasury/dirs",
  "/agencies/dtreasury/dfed",
  "/agencies/dtreasury/dssa",
  "/agencies/dfec",
  "/agencies/dcbo",
  "/agencies/domb",
  "/agencies/dgao",
  "/agencies/dih",
  "/agencies/dih/discoveries",
  "/agencies/ddod",
  "/governments",
  "/demo",
];

interface ContrastViolation {
  page: string;
  selector: string;
  text: string;
  fg: string;
  bg: string;
  ratio: string;
  expected: string;
}

const allViolations: ContrastViolation[] = [];

for (const url of PAGES) {
  test(`contrast: ${url}`, async ({ page }) => {
    // Navigate and wait for content to settle
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15_000 });
    // Give client components time to hydrate
    await page.waitForTimeout(2000);

    const results = await new AxeBuilder({ page })
      .withRules(["color-contrast"])
      .analyze();

    const violations = results.violations.flatMap((v) =>
      v.nodes.map((node) => {
        const msg = node.any?.[0]?.message ?? "";
        // Parse "Element has insufficient color contrast of 1.07 (foreground color: rgb(0, 0, 0), background color: rgb(23, 23, 23), font size: 12.0pt ...)"
        const ratioMatch = msg.match(/contrast of ([\d.]+)/);
        const fgMatch = msg.match(/foreground color: ([^,)]+)/);
        const bgMatch = msg.match(/background color: ([^,)]+)/);
        const expectedMatch = msg.match(/expected contrast ratio of ([\d.:]+)/);

        return {
          page: url,
          selector: node.target.join(" > "),
          text: node.html.replace(/<[^>]+>/g, "").slice(0, 80).trim(),
          fg: fgMatch?.[1] ?? "unknown",
          bg: bgMatch?.[1] ?? "unknown",
          ratio: ratioMatch?.[1] ?? "unknown",
          expected: expectedMatch?.[1] ?? "4.5:1",
        };
      })
    );

    if (violations.length > 0) {
      allViolations.push(...violations);

      // Print violations for this page
      console.log(`\n${"=".repeat(60)}`);
      console.log(`CONTRAST VIOLATIONS: ${url} (${violations.length})`);
      console.log("=".repeat(60));
      for (const v of violations) {
        console.log(`  ${v.selector}`);
        console.log(`    Text: "${v.text}"`);
        console.log(`    FG: ${v.fg}  BG: ${v.bg}  Ratio: ${v.ratio} (need ${v.expected})`);
        console.log("");
      }
    }

    // Don't fail the test — we just want the report
    // To make it fail, uncomment:
    // expect(violations.length, `${violations.length} contrast issues on ${url}`).toBe(0);
  });
}

test.afterAll(() => {
  if (allViolations.length > 0) {
    console.log(`\n${"#".repeat(60)}`);
    console.log(`TOTAL CONTRAST VIOLATIONS: ${allViolations.length}`);
    console.log("#".repeat(60));

    // Group by page
    const byPage = new Map<string, ContrastViolation[]>();
    for (const v of allViolations) {
      const list = byPage.get(v.page) ?? [];
      list.push(v);
      byPage.set(v.page, list);
    }

    for (const [pg, vs] of byPage) {
      console.log(`\n  ${pg}: ${vs.length} violations`);
    }

    // Summary table
    console.log("\n\nFULL VIOLATION LIST (copy-pasteable):");
    console.log("Page | Selector | FG | BG | Ratio | Expected");
    console.log("--- | --- | --- | --- | --- | ---");
    for (const v of allViolations) {
      console.log(`${v.page} | ${v.selector} | ${v.fg} | ${v.bg} | ${v.ratio} | ${v.expected}`);
    }
  } else {
    console.log("\n✅ No contrast violations found across all pages!");
  }
});
