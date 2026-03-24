/**
 * Import CSV datasets from disease-eradication-plan into typed TypeScript.
 *
 * Reads CSVs from E:\code\disease-eradication-plan\knowledge\data\
 * and generates typed TS files in src/datasets/generated/
 *
 * Usage: pnpm --filter @optimitron/data run data:import-csvs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SOURCE_DIR = "E:/code/disease-eradication-plan/knowledge/data";
const OUTPUT_DIR = join(__dirname, "..", "src", "datasets", "generated");

interface CsvRow {
  [key: string]: string;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0]!.split(",").map((h) => h.trim().replace(/"/g, ""));
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
    const row: CsvRow = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? "";
    });
    return row;
  });
}

function sanitizeKey(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .toUpperCase();
}

function camelCase(name: string): string {
  return name
    .replace(/[-_.](\w)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(\w)/, (_, c: string) => c.toLowerCase());
}

interface DatasetConfig {
  file: string;
  exportName: string;
  description: string;
  yearColumn: string;
  valueColumns: { csvHeader: string; tsName: string; unit: string }[];
}

const DATASETS: DatasetConfig[] = [
  {
    file: "global-military-spending-1900-2024-constant-2023-usd.csv",
    exportName: "GLOBAL_MILITARY_SPENDING_HISTORICAL",
    description: "Global military spending 1900-2024 in constant 2023 USD billions. Source: Correlates of War + SIPRI.",
    yearColumn: "Year",
    valueColumns: [
      { csvHeader: "Spending_2023_USD_Billions", tsName: "spendingBillions", unit: "USD_2023_billions" },
    ],
  },
  {
    file: "us-life-expectancy-fda-budget-1543-2019.csv",
    exportName: "US_LIFE_EXPECTANCY_FDA_BUDGET_HISTORICAL",
    description: "US life expectancy (1543-2019) + FDA budget (inflation-adjusted 2020 USD). Shows massive gains BEFORE FDA existed.",
    yearColumn: "Year",
    valueColumns: [
      { csvHeader: "US Life expectancy", tsName: "lifeExpectancy", unit: "years" },
      { csvHeader: "FDA Budget (Inflation Adjusted to 2020 USD)", tsName: "fdaBudget", unit: "USD_2020" },
    ],
  },
  {
    file: "consumer-price-index-inflation-1913-2020.csv",
    exportName: "CPI_INFLATION_HISTORICAL",
    description: "Consumer Price Index 1913-2020. Source: Minneapolis Fed. Shows dollar purchasing power erosion since Fed creation.",
    yearColumn: "Year",
    valueColumns: [
      { csvHeader: "Annual Average", tsName: "cpiAnnualAvg", unit: "index" },
    ],
  },
  {
    file: "military-vs-medical-spending-comparison.csv",
    exportName: "MILITARY_VS_MEDICAL_SPENDING",
    description: "Military spending vs medical research spending — the 604:1 ratio in detail.",
    yearColumn: "",  // No year column — this is a category comparison
    valueColumns: [],  // Special handling
  },
  {
    file: "disease-deaths-vs-historical-tragedies-comparison.csv",
    exportName: "DISEASE_DEATHS_VS_TRAGEDIES",
    description: "Scale comparison: daily disease deaths vs historical tragedies (9/11, Holocaust, etc.).",
    yearColumn: "",
    valueColumns: [],
  },
];

function generateTimeSeriesDataset(config: DatasetConfig, rows: CsvRow[]): string {
  const lines: string[] = [
    `/**`,
    ` * ${config.description}`,
    ` * Auto-generated from: ${config.file}`,
    ` * Generated: ${new Date().toISOString()}`,
    ` */`,
    ``,
    `import type { TimePoint } from "../agency-performance.js";`,
    ``,
  ];

  for (const col of config.valueColumns) {
    const dataPoints = rows
      .map((row) => {
        const year = parseInt(row[config.yearColumn] ?? "", 10);
        const rawValue = (row[col.csvHeader] ?? "").replace(/[$,%\s]/g, "");
        const value = parseFloat(rawValue);
        if (isNaN(year) || isNaN(value)) return null;
        return { year, value };
      })
      .filter(Boolean) as { year: number; value: number }[];

    lines.push(`/** ${col.tsName} — unit: ${col.unit} */`);
    lines.push(`export const ${config.exportName}_${col.tsName.toUpperCase()}: TimePoint[] = [`);
    for (const dp of dataPoints) {
      lines.push(`  { year: ${dp.year}, value: ${dp.value} },`);
    }
    lines.push(`];`);
    lines.push(``);
  }

  return lines.join("\n");
}

function generateCategoryDataset(config: DatasetConfig, rows: CsvRow[]): string {
  const headers = Object.keys(rows[0] ?? {});
  const lines: string[] = [
    `/**`,
    ` * ${config.description}`,
    ` * Auto-generated from: ${config.file}`,
    ` * Generated: ${new Date().toISOString()}`,
    ` */`,
    ``,
    `export interface ${config.exportName}Entry {`,
  ];

  for (const h of headers) {
    const key = camelCase(sanitizeKey(h).toLowerCase());
    // Guess type from first non-empty value
    const firstVal = rows.find((r) => r[h]?.trim())?.[h] ?? "";
    const isNum = !isNaN(parseFloat(firstVal.replace(/[$,%\s]/g, ""))) && firstVal.trim() !== "";
    lines.push(`  ${key}: ${isNum ? "number" : "string"};`);
  }

  lines.push(`}`);
  lines.push(``);
  lines.push(`export const ${config.exportName}: ${config.exportName}Entry[] = [`);

  for (const row of rows) {
    const entries: string[] = [];
    for (const h of headers) {
      const key = camelCase(sanitizeKey(h).toLowerCase());
      const rawVal = (row[h] ?? "").trim();
      const numVal = parseFloat(rawVal.replace(/[$,%\s]/g, ""));
      if (!isNaN(numVal) && rawVal !== "") {
        entries.push(`${key}: ${numVal}`);
      } else {
        entries.push(`${key}: ${JSON.stringify(rawVal)}`);
      }
    }
    lines.push(`  { ${entries.join(", ")} },`);
  }

  lines.push(`];`);
  return lines.join("\n");
}

async function main() {
  console.log("Importing CSV datasets from disease-eradication-plan...\n");

  if (!existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let imported = 0;

  for (const config of DATASETS) {
    const csvPath = join(SOURCE_DIR, config.file);
    if (!existsSync(csvPath)) {
      console.log(`  [skip] ${config.file} — not found`);
      continue;
    }

    console.log(`  [read] ${config.file}`);
    const content = readFileSync(csvPath, "utf8");
    const rows = parseCsv(content);
    console.log(`         ${rows.length} rows parsed`);

    let tsContent: string;
    if (config.yearColumn) {
      tsContent = generateTimeSeriesDataset(config, rows);
    } else {
      tsContent = generateCategoryDataset(config, rows);
    }

    const outFile = join(OUTPUT_DIR, config.file.replace(/\.csv$/, ".ts"));
    writeFileSync(outFile, tsContent);
    console.log(`  [wrote] ${basename(outFile)}`);
    imported++;
  }

  // Also import any remaining CSVs as raw category datasets
  const allCsvs = readdirSync(SOURCE_DIR).filter((f) => f.endsWith(".csv"));
  const alreadyImported = new Set(DATASETS.map((d) => d.file));
  const remaining = allCsvs.filter((f) => !alreadyImported.has(f));

  if (remaining.length > 0) {
    console.log(`\n  ${remaining.length} additional CSVs found (importing as raw):`);
    for (const file of remaining) {
      const csvPath = join(SOURCE_DIR, file);
      const content = readFileSync(csvPath, "utf8");
      const rows = parseCsv(content);
      if (rows.length === 0) {
        console.log(`  [skip] ${file} — empty or unparseable`);
        continue;
      }

      const exportName = sanitizeKey(file.replace(/\.csv$/, ""));
      const config: DatasetConfig = {
        file,
        exportName,
        description: `Auto-imported from ${file}`,
        yearColumn: "",
        valueColumns: [],
      };

      // Check if first column looks like a year
      const firstKey = Object.keys(rows[0]!)[0]!;
      const firstVal = parseInt(rows[0]![firstKey] ?? "", 10);
      if (firstKey.toLowerCase().includes("year") || (firstVal >= 1500 && firstVal <= 2100)) {
        config.yearColumn = firstKey;
        // Use all numeric columns as value columns
        for (const h of Object.keys(rows[0]!)) {
          if (h === firstKey) continue;
          const testVal = (rows[0]![h] ?? "").replace(/[$,%\s]/g, "");
          if (!isNaN(parseFloat(testVal)) && testVal !== "") {
            config.valueColumns.push({
              csvHeader: h,
              tsName: camelCase(sanitizeKey(h).toLowerCase()),
              unit: "auto",
            });
          }
        }
      }

      let tsContent: string;
      if (config.yearColumn && config.valueColumns.length > 0) {
        tsContent = generateTimeSeriesDataset(config, rows);
      } else {
        tsContent = generateCategoryDataset(config, rows);
      }

      const outFile = join(OUTPUT_DIR, file.replace(/\.csv$/, ".ts"));
      writeFileSync(outFile, tsContent);
      console.log(`  [wrote] ${basename(outFile)} (${rows.length} rows)`);
      imported++;
    }
  }

  console.log(`\nDone! ${imported} datasets imported to ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
