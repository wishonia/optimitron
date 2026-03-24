/**
 * Fetch economic indicators from World Bank API and write to generated JSON.
 *
 * Indicators fetched:
 *   - GDP per capita (PPP)
 *   - Military expenditure (% of GDP)
 *   - Health expenditure per capita
 *   - Education expenditure (% of GDP)
 *   - Homicide rate
 *   - Government debt (% of GDP)
 *   - Population
 *
 * Usage: pnpm --filter @optimitron/data run data:refresh:economic
 * Output: src/datasets/generated/economic-indicators.json
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  fetchGdpPerCapita,
  fetchMilitaryExpenditure,
  fetchHealthExpenditure,
  fetchEducationExpenditure,
  fetchHomicideRate,
  fetchGovDebt,
  fetchPopulation,
  fetchGovHealthExpenditure,
} from "../src/fetchers/world-bank.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_DIR = join(__dirname, "..", "src", "datasets", "generated");
const OUTPUT_FILE = join(OUTPUT_DIR, "economic-indicators.json");

interface FetchTask {
  name: string;
  fn: (opts: { period: { startYear: number; endYear: number } }) => Promise<
    Array<{ jurisdictionIso3: string; year: number; value: number }>
  >;
}

const tasks: FetchTask[] = [
  { name: "gdpPerCapita", fn: fetchGdpPerCapita },
  { name: "militaryExpPctGDP", fn: fetchMilitaryExpenditure },
  { name: "healthExpPerCapita", fn: fetchHealthExpenditure },
  { name: "educationExpPctGDP", fn: fetchEducationExpenditure },
  { name: "homicideRate", fn: fetchHomicideRate },
  { name: "govDebtPctGDP", fn: fetchGovDebt },
  { name: "population", fn: fetchPopulation },
  { name: "govHealthExpPctGDP", fn: fetchGovHealthExpenditure },
];

async function main() {
  console.log("Fetching economic indicators from World Bank API...\n");

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const opts = {
    period: { startYear: 2000, endYear: new Date().getFullYear() },
  };

  const results: Record<
    string,
    Array<{ country: string; year: number; value: number }>
  > = {};
  const counts: Record<string, number> = {};

  // Fetch sequentially to be polite to the API
  for (const task of tasks) {
    console.log(`  Fetching ${task.name}...`);
    try {
      const data = await task.fn(opts);
      results[task.name] = data.map((d) => ({
        country: d.jurisdictionIso3,
        year: d.year,
        value: d.value,
      }));
      counts[task.name] = data.length;
      console.log(`    ${data.length} records`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`    [warn] ${task.name} failed: ${message}`);
      results[task.name] = [];
      counts[task.name] = 0;
    }

    // Rate limit courtesy
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const totalRecords = Object.values(counts).reduce((s, n) => s + n, 0);

  const output = {
    generatedAt: new Date().toISOString(),
    indicators: results,
    metadata: {
      source: "World Bank Indicators API",
      url: "https://api.worldbank.org/v2",
      recordCounts: counts,
    },
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${OUTPUT_FILE}`);
  console.log(`Total: ${totalRecords} records across ${tasks.length} indicators`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
