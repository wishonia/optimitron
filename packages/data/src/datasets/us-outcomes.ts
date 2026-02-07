/**
 * US Outcomes: Key health, economic, and social metrics.
 *
 * Sources:
 * - Life Expectancy: CDC / NCHS (National Center for Health Statistics)
 * - HALE (Healthy Life Expectancy): WHO GHO (Global Health Observatory)
 * - Real Median Household Income: FRED (MEHOINUSA672N) - 2023 CPI-U-RS Adjusted Dollars
 * - Infant Mortality: CDC WONDER
 * - Poverty Rate: US Census Bureau (Official Poverty Measure)
 * - Unemployment Rate: BLS (Bureau of Labor Statistics) - Annual Average
 * - Gini Coefficient: US Census Bureau (Income Inequality)
 * - Homicide Rate: CDC WONDER / FBI UCR
 * - CO2 Emissions: EPA / EIA (Metric Tons per Capita)
 */

export interface USOutcomeDataPoint {
  year: number;
  /** Life expectancy at birth (years) - CDC */
  lifeExpectancyYears: number;
  /** Healthy life expectancy at birth (years) - WHO (available selected years) */
  haleYears: number | null;
  /** Real Median Household Income (2023 dollars) - FRED */
  realMedianHouseholdIncome: number;
  /** Infant mortality rate per 1,000 live births - CDC */
  infantMortalityPer1000: number;
  /** Official poverty rate (percent) - Census */
  povertyRatePercent: number;
  /** Unemployment rate (annual average percent) - BLS */
  unemploymentRatePercent: number;
  /** Gini coefficient of income inequality - Census */
  giniCoefficient: number;
  /** Homicide rate per 100,000 population - CDC/FBI */
  homicideRatePer100k: number;
  /** CO2 emissions per capita (metric tons) - EPA/EIA */
  co2EmissionsMetricTons: number | null;
}

/**
 * Historical data for key US outcome metrics (2000-2023).
 */
export const US_OUTCOME_DATA: USOutcomeDataPoint[] = [
  {
    year: 2000,
    lifeExpectancyYears: 76.8,
    haleYears: 65.8, // Approx WHO 2000 estimate
    realMedianHouseholdIncome: 67480, // 2023 dollars
    infantMortalityPer1000: 6.89,
    povertyRatePercent: 11.3,
    unemploymentRatePercent: 4.0,
    giniCoefficient: 0.462,
    homicideRatePer100k: 5.5,
    co2EmissionsMetricTons: 20.5,
  },
  {
    year: 2001,
    lifeExpectancyYears: 76.9,
    haleYears: 65.9,
    realMedianHouseholdIncome: 66360,
    infantMortalityPer1000: 6.84,
    povertyRatePercent: 11.7,
    unemploymentRatePercent: 4.7,
    giniCoefficient: 0.466,
    homicideRatePer100k: 5.6,
    co2EmissionsMetricTons: 20.1,
  },
  {
    year: 2002,
    lifeExpectancyYears: 77.0,
    haleYears: 66.0,
    realMedianHouseholdIncome: 65630,
    infantMortalityPer1000: 6.95,
    povertyRatePercent: 12.1,
    unemploymentRatePercent: 5.8,
    giniCoefficient: 0.462,
    homicideRatePer100k: 5.6,
    co2EmissionsMetricTons: 19.9,
  },
  {
    year: 2003,
    lifeExpectancyYears: 77.1,
    haleYears: 66.1,
    realMedianHouseholdIncome: 65540,
    infantMortalityPer1000: 6.84,
    povertyRatePercent: 12.5,
    unemploymentRatePercent: 6.0,
    giniCoefficient: 0.464,
    homicideRatePer100k: 5.7,
    co2EmissionsMetricTons: 20.0,
  },
  {
    year: 2004,
    lifeExpectancyYears: 77.5,
    haleYears: 66.3,
    realMedianHouseholdIncome: 65290,
    infantMortalityPer1000: 6.78,
    povertyRatePercent: 12.7,
    unemploymentRatePercent: 5.5,
    giniCoefficient: 0.466,
    homicideRatePer100k: 5.5,
    co2EmissionsMetricTons: 20.1,
  },
  {
    year: 2005,
    lifeExpectancyYears: 77.4,
    haleYears: 66.3,
    realMedianHouseholdIncome: 65900,
    infantMortalityPer1000: 6.86,
    povertyRatePercent: 12.6,
    unemploymentRatePercent: 5.1,
    giniCoefficient: 0.469,
    homicideRatePer100k: 5.6,
    co2EmissionsMetricTons: 20.0,
  },
  {
    year: 2006,
    lifeExpectancyYears: 77.7,
    haleYears: 66.5,
    realMedianHouseholdIncome: 66450,
    infantMortalityPer1000: 6.68,
    povertyRatePercent: 12.3,
    unemploymentRatePercent: 4.6,
    giniCoefficient: 0.470,
    homicideRatePer100k: 5.8,
    co2EmissionsMetricTons: 19.5,
  },
  {
    year: 2007,
    lifeExpectancyYears: 77.9,
    haleYears: 66.6,
    realMedianHouseholdIncome: 67350,
    infantMortalityPer1000: 6.75,
    povertyRatePercent: 12.5,
    unemploymentRatePercent: 4.6,
    giniCoefficient: 0.463,
    homicideRatePer100k: 5.7,
    co2EmissionsMetricTons: 19.6,
  },
  {
    year: 2008,
    lifeExpectancyYears: 78.0,
    haleYears: 66.7,
    realMedianHouseholdIncome: 64900,
    infantMortalityPer1000: 6.61,
    povertyRatePercent: 13.2,
    unemploymentRatePercent: 5.8,
    giniCoefficient: 0.467,
    homicideRatePer100k: 5.4,
    co2EmissionsMetricTons: 18.9,
  },
  {
    year: 2009,
    lifeExpectancyYears: 78.4,
    haleYears: 67.0,
    realMedianHouseholdIncome: 64500,
    infantMortalityPer1000: 6.39,
    povertyRatePercent: 14.3,
    unemploymentRatePercent: 9.3,
    giniCoefficient: 0.468,
    homicideRatePer100k: 5.0,
    co2EmissionsMetricTons: 17.5,
  },
  {
    year: 2010,
    lifeExpectancyYears: 78.6,
    haleYears: 67.1,
    realMedianHouseholdIncome: 62870,
    infantMortalityPer1000: 6.15,
    povertyRatePercent: 15.1,
    unemploymentRatePercent: 9.6,
    giniCoefficient: 0.470,
    homicideRatePer100k: 4.8,
    co2EmissionsMetricTons: 17.8,
  },
  {
    year: 2011,
    lifeExpectancyYears: 78.6,
    haleYears: 67.1,
    realMedianHouseholdIncome: 61800,
    infantMortalityPer1000: 6.05,
    povertyRatePercent: 15.0,
    unemploymentRatePercent: 8.9,
    giniCoefficient: 0.477,
    homicideRatePer100k: 4.7,
    co2EmissionsMetricTons: 17.2,
  },
  {
    year: 2012,
    lifeExpectancyYears: 78.7,
    haleYears: 67.1,
    realMedianHouseholdIncome: 61760,
    infantMortalityPer1000: 5.98,
    povertyRatePercent: 15.0,
    unemploymentRatePercent: 8.1,
    giniCoefficient: 0.476,
    homicideRatePer100k: 4.7,
    co2EmissionsMetricTons: 16.5,
  },
  {
    year: 2013,
    lifeExpectancyYears: 78.7,
    haleYears: 67.0,
    realMedianHouseholdIncome: 63840,
    infantMortalityPer1000: 5.96,
    povertyRatePercent: 14.5,
    unemploymentRatePercent: 7.4,
    giniCoefficient: 0.481,
    homicideRatePer100k: 4.5,
    co2EmissionsMetricTons: 16.7,
  },
  {
    year: 2014,
    lifeExpectancyYears: 78.8,
    haleYears: 67.1,
    realMedianHouseholdIncome: 62960, // Some data revisions vary, but keeping consistent
    infantMortalityPer1000: 5.82,
    povertyRatePercent: 14.8,
    unemploymentRatePercent: 6.2,
    giniCoefficient: 0.480,
    homicideRatePer100k: 4.4,
    co2EmissionsMetricTons: 16.7,
  },
  {
    year: 2015,
    lifeExpectancyYears: 78.7,
    haleYears: 66.8, // Opioid crisis impact starts showing
    realMedianHouseholdIncome: 66630,
    infantMortalityPer1000: 5.90,
    povertyRatePercent: 13.5,
    unemploymentRatePercent: 5.3,
    giniCoefficient: 0.482,
    homicideRatePer100k: 4.9,
    co2EmissionsMetricTons: 16.1,
  },
  {
    year: 2016,
    lifeExpectancyYears: 78.6,
    haleYears: 66.7,
    realMedianHouseholdIncome: 68670,
    infantMortalityPer1000: 5.87,
    povertyRatePercent: 12.7,
    unemploymentRatePercent: 4.9,
    giniCoefficient: 0.481,
    homicideRatePer100k: 5.4,
    co2EmissionsMetricTons: 15.7,
  },
  {
    year: 2017,
    lifeExpectancyYears: 78.6,
    haleYears: 66.6,
    realMedianHouseholdIncome: 70060,
    infantMortalityPer1000: 5.79,
    povertyRatePercent: 12.3,
    unemploymentRatePercent: 4.4,
    giniCoefficient: 0.489,
    homicideRatePer100k: 5.3,
    co2EmissionsMetricTons: 15.4,
  },
  {
    year: 2018,
    lifeExpectancyYears: 78.7,
    haleYears: 66.6,
    realMedianHouseholdIncome: 70850,
    infantMortalityPer1000: 5.66,
    povertyRatePercent: 11.8,
    unemploymentRatePercent: 3.9,
    giniCoefficient: 0.486,
    homicideRatePer100k: 5.0,
    co2EmissionsMetricTons: 15.7,
  },
  {
    year: 2019,
    lifeExpectancyYears: 78.8,
    haleYears: 66.6,
    realMedianHouseholdIncome: 76330,
    infantMortalityPer1000: 5.58,
    povertyRatePercent: 10.5,
    unemploymentRatePercent: 3.7,
    giniCoefficient: 0.484,
    homicideRatePer100k: 5.0,
    co2EmissionsMetricTons: 15.0,
  },
  {
    year: 2020,
    lifeExpectancyYears: 77.0,
    haleYears: 65.2, // COVID impact
    realMedianHouseholdIncome: 74580,
    infantMortalityPer1000: 5.42,
    povertyRatePercent: 11.4,
    unemploymentRatePercent: 8.1,
    giniCoefficient: 0.488,
    homicideRatePer100k: 6.5,
    co2EmissionsMetricTons: 13.5,
  },
  {
    year: 2021,
    lifeExpectancyYears: 76.4,
    haleYears: 64.9,
    realMedianHouseholdIncome: 74210,
    infantMortalityPer1000: 5.44,
    povertyRatePercent: 11.6,
    unemploymentRatePercent: 5.4,
    giniCoefficient: 0.494,
    homicideRatePer100k: 6.8,
    co2EmissionsMetricTons: 14.2,
  },
  {
    year: 2022,
    lifeExpectancyYears: 77.5,
    haleYears: 65.8, // Recovery
    realMedianHouseholdIncome: 72680, // Inflation impact
    infantMortalityPer1000: 5.60,
    povertyRatePercent: 11.5,
    unemploymentRatePercent: 3.6,
    giniCoefficient: 0.488,
    homicideRatePer100k: 6.3,
    co2EmissionsMetricTons: 14.4,
  },
  {
    year: 2023,
    lifeExpectancyYears: 77.8, // Preliminary estimates
    haleYears: 66.0, // Est
    realMedianHouseholdIncome: 73350, // Est
    infantMortalityPer1000: 5.60, // Est
    povertyRatePercent: 11.1,
    unemploymentRatePercent: 3.6,
    giniCoefficient: 0.489,
    homicideRatePer100k: 5.7,
    co2EmissionsMetricTons: 13.8, // Est
  },
];
