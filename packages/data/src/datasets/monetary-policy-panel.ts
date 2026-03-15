/**
 * Monetary Policy Cross-Country Panel Dataset
 *
 * Assembles interest rate + outcome data across OECD countries for the
 * optimal interest rate calculator. Pattern matches oecd-budget-panel.ts.
 *
 * Sources:
 *   - World Bank WDI: Real interest rate (FR.INR.RINR), life expectancy,
 *     GNI per capita PPP, GDP per capita PPP, Gini index, inflation
 *   - FRED: Federal funds rate (FEDFUNDS), median household income (US only)
 *
 * @see packages/obg/src/monetary-policy.ts — consumer of this dataset
 */

import type { DataPoint } from '../types.js';

/**
 * Annual time series for one variable in one jurisdiction.
 * Structurally compatible with @optomitron/obg's AnnualTimeSeries.
 */
export interface MonetaryPolicyTimeSeries {
  jurisdictionId: string;
  jurisdictionName: string;
  variableId: string;
  variableName: string;
  unit: string;
  annualValues: Map<number, number>;
}

// ─── Interface ────────────────────────────────────────────────────────

export interface MonetaryPolicyPanelRow {
  jurisdictionIso3: string;
  year: number;
  /** Real interest rate (%), lending rate adjusted for inflation */
  realInterestRate: number | null;
  /** Lending interest rate (%), proxy for policy transmission */
  lendingRate: number | null;
  /** Life expectancy at birth (years) */
  lifeExpectancy: number | null;
  /** GNI per capita, PPP (current international $) */
  gniPerCapitaPpp: number | null;
  /** GDP per capita, PPP (current international $) */
  gdpPerCapitaPpp: number | null;
  /** Gini index (0–100) */
  giniIndex: number | null;
  /** Inflation rate (%) */
  inflationRate: number | null;
}

// ─── OECD Countries with good monetary/outcome data coverage ──────────

export const MONETARY_POLICY_COUNTRIES = [
  'AUS', 'AUT', 'BEL', 'CAN', 'CHE', 'CZE', 'DEU', 'DNK',
  'ESP', 'FIN', 'FRA', 'GBR', 'GRC', 'HUN', 'IRL', 'ISL',
  'ITA', 'JPN', 'KOR', 'MEX', 'NLD', 'NOR', 'NZL', 'POL',
  'PRT', 'SVK', 'SWE', 'TUR', 'USA',
] as const;

const COUNTRY_NAMES: Record<string, string> = {
  AUS: 'Australia', AUT: 'Austria', BEL: 'Belgium', CAN: 'Canada',
  CHE: 'Switzerland', CZE: 'Czech Republic', DEU: 'Germany', DNK: 'Denmark',
  ESP: 'Spain', FIN: 'Finland', FRA: 'France', GBR: 'United Kingdom',
  GRC: 'Greece', HUN: 'Hungary', IRL: 'Ireland', ISL: 'Iceland',
  ITA: 'Italy', JPN: 'Japan', KOR: 'South Korea', MEX: 'Mexico',
  NLD: 'Netherlands', NOR: 'Norway', NZL: 'New Zealand', POL: 'Poland',
  PRT: 'Portugal', SVK: 'Slovakia', SWE: 'Sweden', TUR: 'Turkey',
  USA: 'United States',
};

// ─── Helpers ──────────────────────────────────────────────────────────

/** Group DataPoint[] by jurisdiction → year → value, averaging sub-annual data */
function groupByJurisdictionYear(points: DataPoint[]): Map<string, Map<number, number>> {
  const grouped = new Map<string, Map<number, { sum: number; count: number }>>();

  for (const dp of points) {
    if (!grouped.has(dp.jurisdictionIso3)) {
      grouped.set(dp.jurisdictionIso3, new Map());
    }
    const byYear = grouped.get(dp.jurisdictionIso3)!;
    const existing = byYear.get(dp.year);
    if (existing) {
      existing.sum += dp.value;
      existing.count += 1;
    } else {
      byYear.set(dp.year, { sum: dp.value, count: 1 });
    }
  }

  const result = new Map<string, Map<number, number>>();
  for (const [iso3, byYear] of grouped) {
    const averaged = new Map<number, number>();
    for (const [year, { sum, count }] of byYear) {
      averaged.set(year, sum / count);
    }
    result.set(iso3, averaged);
  }
  return result;
}

/**
 * Convert grouped DataPoint data into MonetaryPolicyTimeSeries[] for a specific variable.
 * One AnnualTimeSeries per jurisdiction.
 */
export function dataPointsToTimeSeries(
  points: DataPoint[],
  variableId: string,
  variableName: string,
  unit: string,
): MonetaryPolicyTimeSeries[] {
  const grouped = groupByJurisdictionYear(points);
  const result: MonetaryPolicyTimeSeries[] = [];

  for (const [iso3, annualValues] of grouped) {
    if (annualValues.size === 0) continue;
    result.push({
      jurisdictionId: iso3,
      jurisdictionName: COUNTRY_NAMES[iso3] ?? iso3,
      variableId,
      variableName,
      unit,
      annualValues,
    });
  }

  return result;
}

/**
 * Build AnnualTimeSeries for interest rates and outcomes from raw DataPoint arrays.
 *
 * This is the main entry point. Callers pass pre-fetched data (from World Bank
 * or FRED fetchers) and get back structured time series ready for
 * `runCountryAnalysis()`.
 */
export function buildMonetaryPolicyTimeSeries(data: {
  realInterestRates: DataPoint[];
  lifeExpectancy: DataPoint[];
  gniPerCapitaPpp: DataPoint[];
  gdpPerCapitaPpp?: DataPoint[];
  giniIndex?: DataPoint[];
  inflationRate?: DataPoint[];
}): {
  interestRateSeries: MonetaryPolicyTimeSeries[];
  outcomeSeries: Record<string, MonetaryPolicyTimeSeries[]>;
} {
  const interestRateSeries = dataPointsToTimeSeries(
    data.realInterestRates,
    'real_interest_rate',
    'Real Interest Rate',
    '%',
  );

  const outcomeSeries: Record<string, MonetaryPolicyTimeSeries[]> = {
    lifeExpectancy: dataPointsToTimeSeries(
      data.lifeExpectancy,
      'life_expectancy',
      'Life Expectancy',
      'years',
    ),
    gniPerCapitaPpp: dataPointsToTimeSeries(
      data.gniPerCapitaPpp,
      'gni_per_capita_ppp',
      'GNI per Capita (PPP)',
      'international $',
    ),
  };

  if (data.gdpPerCapitaPpp?.length) {
    outcomeSeries['gdpPerCapitaPpp'] = dataPointsToTimeSeries(
      data.gdpPerCapitaPpp,
      'gdp_per_capita_ppp',
      'GDP per Capita (PPP)',
      'international $',
    );
  }

  if (data.giniIndex?.length) {
    outcomeSeries['giniIndex'] = dataPointsToTimeSeries(
      data.giniIndex,
      'gini_index',
      'Gini Index',
      'index (0-100)',
    );
  }

  if (data.inflationRate?.length) {
    outcomeSeries['inflationRate'] = dataPointsToTimeSeries(
      data.inflationRate,
      'inflation_rate',
      'Inflation Rate',
      '%',
    );
  }

  return { interestRateSeries, outcomeSeries };
}
