import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
  runAggregatedDrugWarProxyStudy,
  writeAggregatedDrugWarProxyStudyFiles,
} from "./drug-war-proxy-aggregated-study.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_OUTPUT_DIR = path.resolve(__dirname, "../../output");

function formatValue(value: number | null, fractionDigits = 1): string {
  if (value == null || !Number.isFinite(value)) return "N/A";
  return value.toLocaleString("en-US", { maximumFractionDigits: fractionDigits });
}

function formatPerCapita(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "N/A";
  return `$${formatValue(value)} PPP/person`;
}

function renderComparisonMarkdown(
  traffickingStudy: ReturnType<typeof runAggregatedDrugWarProxyStudy>,
  lawStudy: ReturnType<typeof runAggregatedDrugWarProxyStudy>,
): string {
  const lines: string[] = [];
  lines.push("# Aggregated Drug-Enforcement Study Comparison");
  lines.push("");
  lines.push("## ELI5");
  lines.push("");
  lines.push(
    "You are looking at two ways to estimate drug-enforcement spending. One uses only drug-trafficking share. The other uses trafficking plus possession share.",
  );
  lines.push(
    "If both methods point to a similar range, that range is more believable than either one alone.",
  );
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Trafficking-Weighted | Drug-Law-Weighted |");
  lines.push("|--------|----------------------|-------------------|");
  lines.push(`| Jurisdictions included | ${traffickingStudy.includedSubjects} | ${lawStudy.includedSubjects} |`);
  lines.push(`| Aligned observations | ${traffickingStudy.pairCount} | ${lawStudy.pairCount} |`);
  lines.push(
    `| Selected lag / duration | ${traffickingStudy.bestTemporalProfile.lagYears}y / ${traffickingStudy.bestTemporalProfile.durationYears}y | ${lawStudy.bestTemporalProfile.lagYears}y / ${lawStudy.bestTemporalProfile.durationYears}y |`,
  );
  lines.push(`| Forward correlation | ${traffickingStudy.forwardPearson.toFixed(3)} | ${lawStudy.forwardPearson.toFixed(3)} |`);
  lines.push(
    `| Predictive direction score | ${traffickingStudy.predictivePearson.toFixed(3)} | ${lawStudy.predictivePearson.toFixed(3)} |`,
  );
  lines.push(
    `| Significance score | ${traffickingStudy.statisticalSignificance.toFixed(3)} | ${lawStudy.statisticalSignificance.toFixed(3)} |`,
  );
  lines.push(
    `| Suggested level | ${formatPerCapita(traffickingStudy.suggestedSpendingPerCapitaPpp)} | ${formatPerCapita(lawStudy.suggestedSpendingPerCapitaPpp)} |`,
  );
  lines.push(
    `| Minimum effective level | ${formatPerCapita(traffickingStudy.minimumEffectiveDosePerCapitaPpp)} | ${formatPerCapita(lawStudy.minimumEffectiveDosePerCapitaPpp)} |`,
  );
  lines.push(
    `| First detected change | ${formatPerCapita(traffickingStudy.firstDetectedChangeDosePerCapitaPpp)} | ${formatPerCapita(lawStudy.firstDetectedChangeDosePerCapitaPpp)} |`,
  );
  lines.push(
    `| Slowdown knee | ${formatPerCapita(traffickingStudy.diminishingReturnsKneePerCapitaPpp)} | ${formatPerCapita(lawStudy.diminishingReturnsKneePerCapitaPpp)} |`,
  );
  lines.push("");
  lines.push("## File Outputs");
  lines.push("");
  lines.push("- `drug-enforcement-aggregated-study-trafficking.md/.json`");
  lines.push("- `drug-enforcement-aggregated-study-drug-law.md/.json`");
  lines.push("");
  return lines.join("\n");
}

function main(): void {
  const traffickingStudy = runAggregatedDrugWarProxyStudy({
    predictorSource: "estimated_drug_trafficking_enforcement",
  });
  const lawStudy = runAggregatedDrugWarProxyStudy({
    predictorSource: "estimated_drug_law_enforcement",
  });

  const traffickingPaths = writeAggregatedDrugWarProxyStudyFiles(
    traffickingStudy,
    DEFAULT_OUTPUT_DIR,
    "drug-enforcement-aggregated-study-trafficking",
  );
  const lawPaths = writeAggregatedDrugWarProxyStudyFiles(
    lawStudy,
    DEFAULT_OUTPUT_DIR,
    "drug-enforcement-aggregated-study-drug-law",
  );

  // Keep default canonical files pointed at trafficking-weighted baseline.
  writeAggregatedDrugWarProxyStudyFiles(traffickingStudy, DEFAULT_OUTPUT_DIR);

  const comparisonMarkdown = renderComparisonMarkdown(traffickingStudy, lawStudy);
  const comparisonJson = {
    generatedAt: new Date().toISOString(),
    outcomes: traffickingStudy.outcomeSource,
    studies: {
      trafficking: traffickingStudy,
      drugLaw: lawStudy,
    },
    files: {
      trafficking: traffickingPaths,
      drugLaw: lawPaths,
    },
  };

  const comparisonMarkdownPath = path.join(
    DEFAULT_OUTPUT_DIR,
    "drug-enforcement-aggregated-comparison.md",
  );
  const comparisonJsonPath = path.join(
    DEFAULT_OUTPUT_DIR,
    "drug-enforcement-aggregated-comparison.json",
  );
  fs.writeFileSync(comparisonMarkdownPath, `${comparisonMarkdown}\n`, "utf8");
  fs.writeFileSync(comparisonJsonPath, `${JSON.stringify(comparisonJson, null, 2)}\n`, "utf8");

  console.log("Generated aggregated drug-enforcement side-by-side comparison:");
  console.log(`- Trafficking Markdown: ${traffickingPaths.markdownPath}`);
  console.log(`- Trafficking JSON: ${traffickingPaths.jsonPath}`);
  console.log(`- Drug-Law Markdown: ${lawPaths.markdownPath}`);
  console.log(`- Drug-Law JSON: ${lawPaths.jsonPath}`);
  console.log(`- Comparison Markdown: ${comparisonMarkdownPath}`);
  console.log(`- Comparison JSON: ${comparisonJsonPath}`);
}

main();
