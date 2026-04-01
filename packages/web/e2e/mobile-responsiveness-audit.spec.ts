/**
 * Mobile Responsiveness Audit — Playwright
 *
 * Crawls every static route at a mobile viewport (390x844) and detects:
 *   1. Horizontal overflow (page wider than viewport)
 *   2. Elements extending beyond viewport right edge
 *   3. Clipped text (overflow:hidden with truncated content)
 *   4. Tiny tap targets (< 44x44 interactive elements)
 *   5. Images wider than viewport
 *
 * Saves a mobile screenshot of every page.
 *
 * Run with dev server already up:
 *   SKIP_SERVER=1 pnpm --filter @optimitron/web exec playwright test e2e/mobile-responsiveness-audit.spec.ts
 */
import { test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Force mobile viewport for this entire spec regardless of project
test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

// Auto-discover all demo slide components from the sierra/ directory
const DEMO_SLIDES = fs
  .readdirSync(path.resolve(__dirname, "../src/components/demo/slides/sierra"))
  .filter((f) => f.startsWith("slide-") && f.endsWith(".tsx"))
  .map((f) => f.replace(/^slide-/, "").replace(/\.tsx$/, ""))
  .sort();

// Same page list as contrast-audit.spec.ts
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
  ...DEMO_SLIDES.map((id) => `/demo#${id}`),
];

interface ResponsivenessIssue {
  page: string;
  type:
    | "horizontal-overflow"
    | "element-overflow"
    | "clipped-text"
    | "tiny-tap-target"
    | "oversized-image";
  selector: string;
  details: string;
}

const allIssues: ResponsivenessIssue[] = [];

const screenshotDir = path.resolve(
  __dirname,
  "..",
  "public",
  "img",
  "screenshots",
  "mobile",
);

// Ensure screenshot dir exists before tests run
test.beforeAll(() => {
  fs.mkdirSync(screenshotDir, { recursive: true });
});

for (const url of PAGES) {
  test(`mobile: ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15_000 });
    // Let client hydrate + animations settle
    await page.waitForTimeout(2000);

    const pageIssues: ResponsivenessIssue[] = [];
    const viewportWidth = 390;

    // --- 1. Horizontal overflow ---
    const scrollInfo = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    if (scrollInfo.scrollWidth > scrollInfo.clientWidth) {
      pageIssues.push({
        page: url,
        type: "horizontal-overflow",
        selector: "html",
        details: `scrollWidth=${scrollInfo.scrollWidth} > clientWidth=${scrollInfo.clientWidth} (${scrollInfo.scrollWidth - scrollInfo.clientWidth}px overflow)`,
      });
    }

    // --- 2. Elements overflowing viewport right edge ---
    const overflowingElements = await page.evaluate((vw: number) => {
      const results: { selector: string; right: number; width: number }[] = [];
      const els = document.querySelectorAll("*");
      for (const el of els) {
        const rect = el.getBoundingClientRect();
        // Skip invisible / zero-size elements
        if (rect.width === 0 || rect.height === 0) continue;
        // Skip elements fully off-screen vertically (not in current scroll view)
        if (rect.right > vw + 5) {
          // +5px tolerance
          // Build a readable selector
          const tag = el.tagName.toLowerCase();
          const id = el.id ? `#${el.id}` : "";
          const cls = el.className && typeof el.className === "string"
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
            : "";
          const text = el.textContent?.trim().slice(0, 40) || "";
          results.push({
            selector: `${tag}${id}${cls}`,
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          });
          if (results.length >= 20) break; // cap to avoid noise
        }
      }
      return results;
    }, viewportWidth);

    for (const el of overflowingElements) {
      pageIssues.push({
        page: url,
        type: "element-overflow",
        selector: el.selector,
        details: `right=${el.right}px, width=${el.width}px (viewport=${viewportWidth}px)`,
      });
    }

    // --- 3. Clipped text ---
    const clippedElements = await page.evaluate(() => {
      const results: { selector: string; scrollW: number; clientW: number; text: string }[] = [];
      const els = document.querySelectorAll("*");
      for (const el of els) {
        const htmlEl = el as HTMLElement;
        const style = window.getComputedStyle(htmlEl);
        if (
          (style.overflow === "hidden" || style.overflowX === "hidden") &&
          htmlEl.scrollWidth > htmlEl.clientWidth + 2 &&
          htmlEl.clientWidth > 0
        ) {
          const tag = htmlEl.tagName.toLowerCase();
          const id = htmlEl.id ? `#${htmlEl.id}` : "";
          const text = htmlEl.textContent?.trim().slice(0, 50) || "";
          // Skip containers that intentionally clip (carousels, etc.)
          if (["html", "body", "main"].includes(tag)) continue;
          results.push({
            selector: `${tag}${id}`,
            scrollW: htmlEl.scrollWidth,
            clientW: htmlEl.clientWidth,
            text,
          });
          if (results.length >= 15) break;
        }
      }
      return results;
    });

    for (const el of clippedElements) {
      pageIssues.push({
        page: url,
        type: "clipped-text",
        selector: el.selector,
        details: `scrollWidth=${el.scrollW} > clientWidth=${el.clientW} "${el.text}"`,
      });
    }

    // --- 4. Tiny tap targets (< 44x44) ---
    const tinyTargets = await page.evaluate(() => {
      const results: { selector: string; w: number; h: number; text: string }[] = [];
      const interactiveEls = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      for (const el of interactiveEls) {
        const rect = el.getBoundingClientRect();
        // Skip invisible elements
        if (rect.width === 0 || rect.height === 0) continue;
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        if (rect.width < 44 || rect.height < 44) {
          const tag = el.tagName.toLowerCase();
          const text = el.textContent?.trim().slice(0, 30) || "";
          results.push({
            selector: `${tag}${el.id ? "#" + el.id : ""}`,
            w: Math.round(rect.width),
            h: Math.round(rect.height),
            text,
          });
          if (results.length >= 20) break;
        }
      }
      return results;
    });

    for (const el of tinyTargets) {
      pageIssues.push({
        page: url,
        type: "tiny-tap-target",
        selector: el.selector,
        details: `${el.w}x${el.h}px (min 44x44) "${el.text}"`,
      });
    }

    // --- 5. Oversized images ---
    const oversizedImages = await page.evaluate((vw: number) => {
      const results: { selector: string; naturalW: number; renderedW: number; src: string }[] = [];
      const imgs = document.querySelectorAll("img");
      for (const img of imgs) {
        const rect = img.getBoundingClientRect();
        if (rect.width > vw + 5) {
          results.push({
            selector: `img${img.id ? "#" + img.id : ""}`,
            naturalW: img.naturalWidth,
            renderedW: Math.round(rect.width),
            src: img.src.slice(-60),
          });
        }
      }
      return results;
    }, viewportWidth);

    for (const img of oversizedImages) {
      pageIssues.push({
        page: url,
        type: "oversized-image",
        selector: img.selector,
        details: `rendered=${img.renderedW}px (viewport=${viewportWidth}px) src=...${img.src}`,
      });
    }

    // --- Take screenshot ---
    const filename = url === "/" ? "home" : url.replace(/[/#]/g, "_").replace(/^_/, "");
    await page.screenshot({
      path: path.join(screenshotDir, `${filename}.png`),
      fullPage: true,
    });

    // Collect issues
    if (pageIssues.length > 0) {
      allIssues.push(...pageIssues);

      console.log(`\n${"=".repeat(60)}`);
      console.log(`MOBILE ISSUES: ${url} (${pageIssues.length})`);
      console.log("=".repeat(60));
      for (const issue of pageIssues) {
        console.log(`  [${issue.type}] ${issue.selector}`);
        console.log(`    ${issue.details}`);
        console.log("");
      }
    }
  });
}

test.afterAll(() => {
  if (allIssues.length > 0) {
    console.log(`\n${"#".repeat(60)}`);
    console.log(`TOTAL MOBILE RESPONSIVENESS ISSUES: ${allIssues.length}`);
    console.log("#".repeat(60));

    // Group by type
    const byType = new Map<string, number>();
    for (const issue of allIssues) {
      byType.set(issue.type, (byType.get(issue.type) ?? 0) + 1);
    }
    for (const [type, count] of byType) {
      console.log(`  ${type}: ${count}`);
    }

    // Group by page
    const byPage = new Map<string, ResponsivenessIssue[]>();
    for (const issue of allIssues) {
      const list = byPage.get(issue.page) ?? [];
      list.push(issue);
      byPage.set(issue.page, list);
    }

    console.log("\nBY PAGE:");
    for (const [pg, issues] of byPage) {
      console.log(`  ${pg}: ${issues.length} issues`);
    }

    // Full table
    console.log("\n\nFULL ISSUE LIST:");
    console.log("Page | Type | Selector | Details");
    console.log("--- | --- | --- | ---");
    for (const issue of allIssues) {
      console.log(
        `${issue.page} | ${issue.type} | ${issue.selector} | ${issue.details}`,
      );
    }
  } else {
    console.log("\nNo mobile responsiveness issues found across all pages!");
  }

  console.log(`\nMobile screenshots saved to: ${screenshotDir}`);
});
