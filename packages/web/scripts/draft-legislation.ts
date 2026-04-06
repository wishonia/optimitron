#!/usr/bin/env tsx
/**
 * Draft model legislation from the generated budget analysis artifact.
 *
 * Reads the typed us-budget-analysis report, derives legislation briefs from
 * @optimitron/obg, then uses Gemini + Google Search grounding to draft
 * evidence-based markdown into the repo-level content directory.
 *
 * Usage:
 *   pnpm --filter @optimitron/web run draft:legislation
 *   pnpm --filter @optimitron/web run draft:legislation -- --category Military
 *
 * Requires: GOOGLE_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY env var
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotenv } from "dotenv";
import {
  draftLegislation,
  insertCitations,
  generateSourceFootnotes,
  type PolicyExemplarInput,
} from "@optimitron/agent";
import { createBudgetLegislationBriefs, type BudgetLegislationBrief } from "@optimitron/obg";
import { POLICY_EXEMPLARS } from "@optimitron/data";
import { usBudgetAnalysis } from "../src/data/us-budget-analysis.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = resolve(__dirname, "../../..");
const envPath = resolve(monorepoRoot, ".env");

if (existsSync(envPath)) {
  loadDotenv({ path: envPath });
}

const outputDir = resolve(monorepoRoot, "content/legislation");

const EXEMPLAR_CATEGORY_MAP: Record<string, string[]> = {
  Military: [
    "Singapore 3M Health System (Medisave / MediShield / Medifund)",
    "Costa Rica CCSS Universal Healthcare",
  ],
  Medicare: ["Singapore 3M Health System (Medisave / MediShield / Medifund)"],
  Medicaid: [
    "Singapore 3M Health System (Medisave / MediShield / Medifund)",
    "Costa Rica CCSS Universal Healthcare",
  ],
  "Health (non-Medicare/Medicaid)": [
    "Singapore 3M Health System (Medisave / MediShield / Medifund)",
    "Japan Tokutei Kenshin Health Screening",
  ],
  "Social Security": [],
  Education: ["Finland Comprehensive Education Reform"],
  "Science / NASA": ["South Korea Broadband and Digital Infrastructure"],
};

function getExemplarsForCategory(categoryName: string): PolicyExemplarInput[] {
  const names = EXEMPLAR_CATEGORY_MAP[categoryName] ?? [];

  return POLICY_EXEMPLARS
    .filter((exemplar) => names.includes(exemplar.name))
    .map((exemplar) => ({
      name: exemplar.name,
      originCountry: exemplar.originCountry,
      description: exemplar.description,
      yearImplemented: exemplar.yearImplemented,
      adaptationNotes: exemplar.adaptationNotes,
    }));
}

function formatUsdCompact(value: number): string {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(1)}T/yr`;
  }

  if (absoluteValue >= 1_000_000_000) {
    return `$${Math.round(value / 1_000_000_000)}B/yr`;
  }

  if (absoluteValue >= 1_000_000) {
    return `$${Math.round(value / 1_000_000)}M/yr`;
  }

  return `$${Math.round(value)}/yr`;
}

function quoteFrontmatter(value: string): string {
  return JSON.stringify(value);
}

function buildFrontmatter(brief: BudgetLegislationBrief, generatedAt: string): string {
  return [
    "---",
    `title: ${quoteFrontmatter(brief.title)}`,
    `summary: ${quoteFrontmatter(brief.summary)}`,
    'status: "draft"',
    `category_id: ${quoteFrontmatter(brief.categoryId)}`,
    `category_name: ${quoteFrontmatter(brief.categoryName)}`,
    `model_country: ${quoteFrontmatter(brief.modelCountry)}`,
    `overspend_ratio: ${quoteFrontmatter(`${brief.evidence.overspendRatio.toFixed(1)}x`)}`,
    `us_rank: ${quoteFrontmatter(`${brief.evidence.rank}/${brief.evidence.totalCountries}`)}`,
    `potential_savings: ${quoteFrontmatter(formatUsdCompact(brief.evidence.potentialSavingsTotal))}`,
    'source_artifact: "packages/web/src/data/us-budget-analysis.ts"',
    'source_brief: "@optimitron/obg:createBudgetLegislationBriefs"',
    'generated_by: "optimitron-agent-gemini"',
    `generated_at: ${quoteFrontmatter(generatedAt)}`,
    `analysis_generated_at: ${quoteFrontmatter(brief.sourceGeneratedAt)}`,
    "---",
    "",
  ].join("\n");
}

async function main() {
  const categoryFilter = process.argv.find((_, index) => process.argv[index - 1] === "--category");
  const minOverspendRatio = parseFloat(
    process.argv.find((_, index) => process.argv[index - 1] === "--min-overspend") ?? "1.5",
  );

  const briefs = createBudgetLegislationBriefs(usBudgetAnalysis, {
    minOverspendRatio,
  }).filter((brief) => {
    if (!categoryFilter) {
      return true;
    }

    return (
      brief.categoryName === categoryFilter ||
      brief.categoryId === categoryFilter ||
      brief.slug === categoryFilter
    );
  });

  if (briefs.length === 0) {
    console.log(`No legislation briefs found with overspend ratio >= ${minOverspendRatio}.`);
    if (categoryFilter) {
      console.log(`  (filtered to: ${categoryFilter})`);
    }
    process.exit(0);
  }

  console.log(`Found ${briefs.length} legislation candidates:\n`);
  for (const brief of briefs) {
    console.log(
      `  ${brief.categoryName}: ${brief.evidence.overspendRatio.toFixed(1)}x overspend ` +
      `(rank ${brief.evidence.rank}/${brief.evidence.totalCountries})`,
    );
  }
  console.log("");

  mkdirSync(outputDir, { recursive: true });

  for (const brief of briefs) {
    const exemplars = getExemplarsForCategory(brief.categoryName);

    console.log(`Drafting legislation for ${brief.categoryName}...`);
    console.log(
      `  Evidence: ${brief.evidence.overspendRatio.toFixed(1)}x overspend, ` +
      `rank ${brief.evidence.rank}/${brief.evidence.totalCountries}`,
    );
    console.log(
      `  Exemplars: ${
        exemplars.length > 0
          ? exemplars.map((exemplar) => exemplar.originCountry).join(", ")
          : "none (Gemini will research)"
      }`,
    );

    try {
      const generatedAt = new Date().toISOString();
      const draft = await draftLegislation(brief.evidence, exemplars);
      const citedText = insertCitations(draft);
      const footnotes = generateSourceFootnotes(draft);
      const output = [
        buildFrontmatter(brief, generatedAt),
        `# ${brief.title}`,
        "",
        `> Generated by Optimitron OBG + Gemini (search-grounded)`,
        `> Based on ${brief.evidenceSource}`,
        `> Category: ${brief.categoryName} | Overspend: ${brief.evidence.overspendRatio.toFixed(1)}x | US Rank: ${brief.evidence.rank}/${brief.evidence.totalCountries}`,
        "",
        citedText,
        "",
        "---",
        "",
        footnotes,
        "",
        "---",
        "",
        "## Metadata",
        "",
        `- **Search queries**: ${draft.searchQueries.join("; ")}`,
        `- **Sources cited**: ${draft.sources.length}`,
        `- **Claims with citations**: ${draft.citations.length}`,
        `- **Category**: ${brief.categoryName}`,
        `- **Model country**: ${brief.modelCountry}`,
        `- **Overspend ratio**: ${brief.evidence.overspendRatio.toFixed(1)}x`,
        `- **Potential savings**: ${formatUsdCompact(brief.evidence.potentialSavingsTotal)}`,
      ].join("\n");

      const outPath = resolve(outputDir, `${brief.slug}.md`);
      writeFileSync(outPath, output);

      console.log(
        `  OK -> ${brief.slug}.md (${draft.sources.length} sources, ${draft.citations.length} cited claims)`,
      );
    } catch (error) {
      console.error(`  Failed: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log("\nDone! Legislation drafts are in content/legislation/");
}

main().catch(console.error);
