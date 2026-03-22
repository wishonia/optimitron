#!/usr/bin/env tsx
/**
 * Regenerate efficient frontier data with median income.
 *
 * Reads the OECD budget panel, groups countries into spending deciles,
 * and computes average outcomes including median income from PIP data.
 *
 * Run: npx tsx scripts/regenerate-efficient-frontier.ts
 */

import { OECD_BUDGET_PANEL, type OECDBudgetPanelDataPoint } from "@optimitron/data";

// PIP median income data (2021, 2017 PPP dollars annual)
// Source: World Bank Poverty and Inequality Platform
const MEDIAN_INCOME_BY_COUNTRY: Record<string, number> = {
  USA: 26908, GBR: 19918, DEU: 24841, FRA: 20824, JPN: 15590,
  AUS: 22227, CAN: 24219, KOR: 19815, NOR: 27567, CHE: 26669,
  SWE: 20682, NLD: 25216, ISR: 12893, ITA: 18140, ESP: 16903,
  POL: 13859, CZE: 15179, TUR: 6999, MEX: 4294,
};
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ISO3 → ISO2 mapping for PIP data lookup
const ISO3_TO_PIP: Record<string, string> = {
  USA: "USA", GBR: "GBR", DEU: "DEU", FRA: "FRA", JPN: "JPN",
  AUS: "AUS", CAN: "CAN", KOR: "KOR", NOR: "NOR", CHE: "CHE",
  SWE: "SWE", NLD: "NLD", ISR: "ISR", ITA: "ITA", ESP: "ESP",
  POL: "POL", CZE: "CZE", TUR: "TUR", MEX: "MEX",
};

interface CategoryConfig {
  id: string;
  label: string;
  spendingField: keyof OECDBudgetPanelDataPoint;
}

const CATEGORIES: CategoryConfig[] = [
  { id: "health", label: "Health", spendingField: "healthSpendingPerCapitaPpp" },
  { id: "education", label: "Education", spendingField: "educationSpendingPerCapitaPpp" },
  { id: "military", label: "Military", spendingField: "militarySpendingPerCapitaPpp" },
  { id: "social", label: "Social", spendingField: "socialSpendingPerCapitaPpp" },
  { id: "rd", label: "R&D", spendingField: "rdSpendingPerCapitaPpp" },
];

function latestCountryData(spendingField: keyof OECDBudgetPanelDataPoint) {
  const byCountry = new Map<string, { spending: number[]; le: number[]; gdp: number[]; im: number[] }>();

  for (const row of OECD_BUDGET_PANEL) {
    const s = row[spendingField] as number | null;
    const le = row.lifeExpectancyYears;
    const gdp = row.gdpPerCapitaPpp;
    const im = row.infantMortalityPer1000;
    if (s == null || le == null) continue;

    if (!byCountry.has(row.jurisdictionIso3)) {
      byCountry.set(row.jurisdictionIso3, { spending: [], le: [], gdp: [], im: [] });
    }
    const entry = byCountry.get(row.jurisdictionIso3)!;
    entry.spending.push(s);
    entry.le.push(le);
    if (gdp != null) entry.gdp.push(gdp);
    if (im != null) entry.im.push(im);
  }

  return [...byCountry.entries()].map(([code, data]) => {
    const recent = (arr: number[]) => {
      const r = arr.slice(-3);
      return r.reduce((a, b) => a + b, 0) / r.length;
    };

    const medianIncome = MEDIAN_INCOME_BY_COUNTRY[ISO3_TO_PIP[code] ?? code];

    return {
      code,
      spending: recent(data.spending),
      lifeExpectancy: recent(data.le),
      gdpPerCapita: data.gdp.length > 0 ? recent(data.gdp) : null,
      infantMortality: data.im.length > 0 ? recent(data.im) : null,
      medianIncomeAnnual: medianIncome ?? null,
    };
  }).filter(c => c.spending > 0);
}

function buildDeciles(countries: ReturnType<typeof latestCountryData>) {
  const sorted = [...countries].sort((a, b) => a.spending - b.spending);
  const decileSize = Math.ceil(sorted.length / 10);
  const deciles = [];

  for (let i = 0; i < 10; i++) {
    const slice = sorted.slice(i * decileSize, (i + 1) * decileSize);
    if (slice.length === 0) continue;

    const avg = (arr: (number | null)[]) => {
      const valid = arr.filter((v): v is number => v != null);
      return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
    };

    deciles.push({
      decile: i + 1,
      count: slice.length,
      avgSpending: Math.round(avg(slice.map(c => c.spending))! * 100) / 100,
      avgLifeExpectancy: Math.round((avg(slice.map(c => c.lifeExpectancy)) ?? 0) * 100) / 100,
      avgInfantMortality: Math.round((avg(slice.map(c => c.infantMortality)) ?? 0) * 100) / 100,
      avgGdpPerCapita: Math.round((avg(slice.map(c => c.gdpPerCapita)) ?? 0) * 100) / 100,
      avgMedianIncome: Math.round((avg(slice.map(c => c.medianIncomeAnnual)) ?? 0)),
      countries: slice.map(c => c.code),
    });
  }

  return deciles;
}

// Generate
const result: Record<string, unknown> = {
  generatedAt: new Date().toISOString(),
  currentYears: [2019, 2020, 2021, 2022],
  categories: {} as Record<string, unknown>,
  totals: {} as Record<string, unknown>,
};

const categories = result.categories as Record<string, unknown>;

let usTotalSpending = 0;
let frontierTotalSpending = 0;

for (const cat of CATEGORIES) {
  const countries = latestCountryData(cat.spendingField);
  const deciles = buildDeciles(countries);

  categories[cat.id] = {
    label: cat.label,
    spendingField: cat.spendingField,
    deciles,
  };

  // Find US spending and frontier floor
  const usCountry = countries.find(c => c.code === "USA");
  if (usCountry) {
    usTotalSpending += usCountry.spending;
    // Floor = spending level of the decile with the best life expectancy per dollar
    const bestDecile = deciles.reduce((best, d) =>
      (d.avgLifeExpectancy / d.avgSpending) > (best.avgLifeExpectancy / best.avgSpending) ? d : best
    );
    frontierTotalSpending += bestDecile.avgSpending;
  }
}

result.totals = {
  usCurrentTotalPerCapita: Math.round(usTotalSpending * 100) / 100,
  efficientFrontierTotalPerCapita: Math.round(frontierTotalSpending * 100) / 100,
  ratio: Math.round((usTotalSpending / frontierTotalSpending) * 1000) / 1000,
  missingUsCategories: 0,
  missingFloorCategories: 0,
};

const outPath = resolve(__dirname, "../src/data/efficient-frontier.json");
writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log(`✅ Written to ${outPath}`);
console.log(`   US total: $${Math.round(usTotalSpending).toLocaleString()}/capita`);
console.log(`   Frontier: $${Math.round(frontierTotalSpending).toLocaleString()}/capita`);
console.log(`   Ratio: ${(usTotalSpending / frontierTotalSpending).toFixed(2)}x`);
console.log(`   Categories: ${CATEGORIES.length}`);
console.log(`   Deciles per category: ${Object.values(categories).map((c: any) => c.deciles.length).join(", ")}`);
