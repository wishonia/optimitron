/**
 * Fetch health outcomes from WHO GHO API and write to generated JSON.
 *
 * Indicators fetched:
 *   - HALE (Healthy Life Expectancy) by country
 *   - Life expectancy by country
 *   - UHC service coverage index
 *
 * Usage: pnpm --filter @optimitron/data run data:refresh:health
 * Output: src/datasets/generated/health-outcomes.json
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  fetchWHOHealthyLifeExpectancy,
  fetchWHOLifeExpectancy,
  fetchWHOUHCIndex,
} from "../src/fetchers/who.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_DIR = join(__dirname, "..", "src", "datasets", "generated");
const OUTPUT_FILE = join(OUTPUT_DIR, "health-outcomes.json");

async function main() {
  console.log("Fetching health outcomes from WHO GHO API...\n");

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const opts = {
    period: { startYear: 2000, endYear: new Date().getFullYear() },
  };

  const [hale, lifeExp, uhc] = await Promise.all([
    fetchWHOHealthyLifeExpectancy(opts).catch((err) => {
      console.error("  [warn] HALE fetch failed:", err.message);
      return [];
    }),
    fetchWHOLifeExpectancy(opts).catch((err) => {
      console.error("  [warn] Life expectancy fetch failed:", err.message);
      return [];
    }),
    fetchWHOUHCIndex(opts).catch((err) => {
      console.error("  [warn] UHC index fetch failed:", err.message);
      return [];
    }),
  ]);

  console.log(`  HALE:            ${hale.length} records`);
  console.log(`  Life expectancy: ${lifeExp.length} records`);
  console.log(`  UHC index:       ${uhc.length} records`);

  const output = {
    generatedAt: new Date().toISOString(),
    indicators: {
      hale: hale.map((d) => ({
        country: d.jurisdictionIso3,
        year: d.year,
        value: d.value,
      })),
      lifeExpectancy: lifeExp.map((d) => ({
        country: d.jurisdictionIso3,
        year: d.year,
        value: d.value,
      })),
      uhcIndex: uhc.map((d) => ({
        country: d.jurisdictionIso3,
        year: d.year,
        value: d.value,
      })),
    },
    metadata: {
      source: "WHO Global Health Observatory (GHO) OData API",
      url: "https://ghoapi.azureedge.net/api/",
      recordCounts: {
        hale: hale.length,
        lifeExpectancy: lifeExp.length,
        uhcIndex: uhc.length,
      },
    },
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${OUTPUT_FILE}`);
  console.log(
    `Total: ${hale.length + lifeExp.length + uhc.length} records across 3 indicators`,
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
