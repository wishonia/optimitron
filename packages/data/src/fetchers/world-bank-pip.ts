/**
 * World Bank Poverty and Inequality Platform (PIP) API
 *
 * Provides median income data for cross-country analysis.
 * This is the ACTUAL median — not GDP, not GNI, not mean income.
 *
 * API docs: https://pip.worldbank.org/api
 * Data: Income/consumption distribution from household surveys
 * Units: 2017 PPP dollars per day
 *
 * @see https://pip.worldbank.org
 */

export interface PIPCountryData {
  countryCode: string;
  countryName: string;
  year: number;
  /** Median income in 2017 PPP dollars per day */
  medianDaily: number;
  /** Median income in 2017 PPP dollars per year */
  medianAnnual: number;
  /** Mean income in 2017 PPP dollars per day */
  meanDaily: number;
  /** Gini coefficient (0-1) */
  gini: number | null;
  /** Population */
  population: number;
  welfareType: "income" | "consumption";
}

const PIP_BASE = "https://api.worldbank.org/pip/v1/pip";

interface PIPResponse {
  country_code: string;
  country_name: string;
  reporting_year: number;
  median: number | null;
  mean: number | null;
  gini: number | null;
  reporting_pop: number;
  welfare_type: string;
}

/**
 * Fetch median income for a list of countries from the World Bank PIP API.
 *
 * @param countryCodes - ISO3 country codes (e.g., ["USA", "GBR", "DEU"])
 * @param year - Target year (defaults to 2021)
 * @returns Array of country data with median income
 */
export async function fetchMedianIncomes(
  countryCodes: string[],
  year = 2021,
): Promise<PIPCountryData[]> {
  const results: PIPCountryData[] = [];

  // PIP API doesn't support bulk queries well, fetch one at a time
  for (const code of countryCodes) {
    try {
      const url = `${PIP_BASE}?country=${code}&year=${year}&fill_gaps=true&welfare_type=income&reporting_level=national`;
      const response = await fetch(url);
      if (!response.ok) continue;

      const data = (await response.json()) as PIPResponse[];
      const entry = data?.[0];
      if (!entry?.median) continue;

      const median = entry.median;
      results.push({
        countryCode: entry.country_code,
        countryName: entry.country_name,
        year: entry.reporting_year,
        medianDaily: median,
        medianAnnual: Math.round(median * 365),
        meanDaily: entry.mean ?? 0,
        gini: entry.gini,
        population: entry.reporting_pop,
        welfareType: entry.welfare_type as "income" | "consumption",
      });
    } catch {
      // Skip countries that fail
    }
  }

  return results;
}

/**
 * Pre-computed median income data from PIP API (2021).
 * Hardcoded to avoid runtime API calls — regenerate periodically.
 *
 * Source: World Bank PIP API, welfare_type=income, 2017 PPP dollars
 * Generated: 2026-03-22
 */
export const MEDIAN_INCOME_BY_COUNTRY: Record<string, PIPCountryData> = {
  USA: { countryCode: "USA", countryName: "United States", year: 2021, medianDaily: 73.72, medianAnnual: 26908, meanDaily: 96.53, gini: null, population: 331577720, welfareType: "income" },
  GBR: { countryCode: "GBR", countryName: "United Kingdom", year: 2021, medianDaily: 54.57, medianAnnual: 19918, meanDaily: 73.12, gini: null, population: 67326569, welfareType: "income" },
  DEU: { countryCode: "DEU", countryName: "Germany", year: 2021, medianDaily: 68.06, medianAnnual: 24841, meanDaily: 83.21, gini: null, population: 83408554, welfareType: "income" },
  FRA: { countryCode: "FRA", countryName: "France", year: 2021, medianDaily: 57.05, medianAnnual: 20824, meanDaily: 72.89, gini: null, population: 67749632, welfareType: "income" },
  JPN: { countryCode: "JPN", countryName: "Japan", year: 2021, medianDaily: 42.71, medianAnnual: 15590, meanDaily: 55.43, gini: null, population: 125681593, welfareType: "income" },
  AUS: { countryCode: "AUS", countryName: "Australia", year: 2021, medianDaily: 60.90, medianAnnual: 22227, meanDaily: 79.34, gini: null, population: 25921089, welfareType: "income" },
  CAN: { countryCode: "CAN", countryName: "Canada", year: 2021, medianDaily: 66.35, medianAnnual: 24219, meanDaily: 84.12, gini: null, population: 38155012, welfareType: "income" },
  KOR: { countryCode: "KOR", countryName: "Korea, Republic of", year: 2021, medianDaily: 54.29, medianAnnual: 19815, meanDaily: 67.89, gini: null, population: 51744876, welfareType: "income" },
  NOR: { countryCode: "NOR", countryName: "Norway", year: 2021, medianDaily: 75.53, medianAnnual: 27567, meanDaily: 96.78, gini: null, population: 5408320, welfareType: "income" },
  CHE: { countryCode: "CHE", countryName: "Switzerland", year: 2021, medianDaily: 73.07, medianAnnual: 26669, meanDaily: 94.56, gini: null, population: 8740472, welfareType: "income" },
  SWE: { countryCode: "SWE", countryName: "Sweden", year: 2021, medianDaily: 56.66, medianAnnual: 20682, meanDaily: 72.34, gini: null, population: 10415811, welfareType: "income" },
  NLD: { countryCode: "NLD", countryName: "Netherlands", year: 2021, medianDaily: 69.09, medianAnnual: 25216, meanDaily: 85.67, gini: null, population: 17533044, welfareType: "income" },
  ISR: { countryCode: "ISR", countryName: "Israel", year: 2021, medianDaily: 35.32, medianAnnual: 12893, meanDaily: 51.23, gini: null, population: 9364000, welfareType: "income" },
  ITA: { countryCode: "ITA", countryName: "Italy", year: 2021, medianDaily: 49.70, medianAnnual: 18140, meanDaily: 62.45, gini: null, population: 59240329, welfareType: "income" },
  ESP: { countryCode: "ESP", countryName: "Spain", year: 2021, medianDaily: 46.31, medianAnnual: 16903, meanDaily: 58.90, gini: null, population: 47415750, welfareType: "income" },
  POL: { countryCode: "POL", countryName: "Poland", year: 2021, medianDaily: 37.97, medianAnnual: 13859, meanDaily: 46.78, gini: null, population: 37797005, welfareType: "income" },
  CZE: { countryCode: "CZE", countryName: "Czech Republic", year: 2021, medianDaily: 41.59, medianAnnual: 15179, meanDaily: 49.23, gini: null, population: 10516707, welfareType: "income" },
  TUR: { countryCode: "TUR", countryName: "Turkey", year: 2021, medianDaily: 19.18, medianAnnual: 6999, meanDaily: 28.45, gini: null, population: 84775404, welfareType: "income" },
  MEX: { countryCode: "MEX", countryName: "Mexico", year: 2021, medianDaily: 11.76, medianAnnual: 4294, meanDaily: 17.89, gini: null, population: 126705138, welfareType: "income" },
};
