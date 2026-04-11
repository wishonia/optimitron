/**
 * Fetch current world leaders from Wikidata and write to generated file.
 *
 * Usage: pnpm --filter @optimitron/data data:refresh:leaders
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchWorldLeaders } from "../src/fetchers/world-leaders";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("Fetching world leaders from Wikidata SPARQL...");
  const leaders = await fetchWorldLeaders();
  console.log(`Fetched ${leaders.length} leaders.`);

  const output = `/**
 * Auto-generated world leader dataset.
 * DO NOT EDIT — regenerate with: pnpm --filter @optimitron/data data:refresh:leaders
 * Generated: ${new Date().toISOString()}
 */

export interface WorldLeaderRow {
  countryCode: string;
  countryName: string;
  leaderName: string;
  leaderImageUrl: string | null;
  roleTitle: string;
  wikidataId: string;
}

export const WORLD_LEADERS: WorldLeaderRow[] = ${JSON.stringify(leaders, null, 2)};
`;

  const outPath = join(__dirname, "..", "src", "generated", "world-leaders.ts");
  writeFileSync(outPath, output, "utf-8");
  console.log(`Wrote ${leaders.length} leaders to ${outPath}`);
}

void main();
