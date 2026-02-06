import { z } from 'zod';

/**
 * Common types for data fetchers
 */

/**
 * Jurisdiction identifier
 */
export const JurisdictionCodeSchema = z.object({
  /** ISO 3166-1 alpha-3 country code */
  iso3: z.string().length(3),
  /** ISO 3166-1 alpha-2 country code */
  iso2: z.string().length(2).optional(),
  /** Human-readable name */
  name: z.string(),
  /** Jurisdiction type */
  type: z.enum(['country', 'state', 'region', 'city']),
  /** Parent jurisdiction (for subnational) */
  parentIso3: z.string().optional(),
});

export type JurisdictionCode = z.infer<typeof JurisdictionCodeSchema>;

/**
 * Time period for data queries
 */
export const TimePeriodSchema = z.object({
  startYear: z.number().int().min(1900).max(2100),
  endYear: z.number().int().min(1900).max(2100),
});

export type TimePeriod = z.infer<typeof TimePeriodSchema>;

/**
 * Generic data point with jurisdiction and time
 */
export const DataPointSchema = z.object({
  jurisdictionIso3: z.string(),
  year: z.number().int(),
  value: z.number(),
  unit: z.string().optional(),
  source: z.string(),
  sourceUrl: z.string().optional(),
  lastUpdated: z.string().optional(),
});

export type DataPoint = z.infer<typeof DataPointSchema>;

/**
 * Spending data by category
 */
export const SpendingDataSchema = z.object({
  jurisdictionIso3: z.string(),
  year: z.number().int(),
  category: z.string(),
  /** Spending in USD */
  amountUsd: z.number(),
  /** Spending per capita in USD */
  perCapitaUsd: z.number().optional(),
  /** Spending as % of GDP */
  percentGdp: z.number().optional(),
  source: z.string(),
});

export type SpendingData = z.infer<typeof SpendingDataSchema>;

/**
 * Outcome/welfare data
 */
export const OutcomeDataSchema = z.object({
  jurisdictionIso3: z.string(),
  year: z.number().int(),
  indicator: z.string(),
  value: z.number(),
  unit: z.string(),
  source: z.string(),
});

export type OutcomeData = z.infer<typeof OutcomeDataSchema>;

/**
 * Health-specific outcome data
 */
export const HealthDataSchema = z.object({
  jurisdictionIso3: z.string(),
  year: z.number().int(),
  /** Life expectancy at birth (years) */
  lifeExpectancy: z.number().optional(),
  /** Healthy life expectancy (years) */
  healthyLifeExpectancy: z.number().optional(),
  /** Infant mortality rate (per 1000 live births) */
  infantMortality: z.number().optional(),
  /** Maternal mortality ratio (per 100,000 live births) */
  maternalMortality: z.number().optional(),
  source: z.string(),
});

export type HealthData = z.infer<typeof HealthDataSchema>;

/**
 * Economic outcome data
 */
export const EconomicDataSchema = z.object({
  jurisdictionIso3: z.string(),
  year: z.number().int(),
  /** GDP per capita (USD, PPP) */
  gdpPerCapita: z.number().optional(),
  /** Median household income (USD) */
  medianIncome: z.number().optional(),
  /** Gini coefficient (0-100) */
  giniIndex: z.number().optional(),
  /** Unemployment rate (%) */
  unemploymentRate: z.number().optional(),
  source: z.string(),
});

export type EconomicData = z.infer<typeof EconomicDataSchema>;

/**
 * Policy data
 */
export const PolicyDataSchema = z.object({
  jurisdictionIso3: z.string(),
  policyId: z.string(),
  policyName: z.string(),
  category: z.string(),
  /** Whether jurisdiction has this policy */
  hasPolicy: z.boolean(),
  /** For continuous policies, the value/strength */
  policyValue: z.number().optional(),
  /** Unit for policy value */
  policyUnit: z.string().optional(),
  /** Implementation date */
  implementationDate: z.string().optional(),
  source: z.string(),
});

export type PolicyData = z.infer<typeof PolicyDataSchema>;

/**
 * Fetch options common to all data sources
 */
export const FetchOptionsSchema = z.object({
  /** Jurisdictions to fetch (ISO3 codes) */
  jurisdictions: z.array(z.string()).optional(),
  /** Time period */
  period: TimePeriodSchema.optional(),
  /** Specific indicators to fetch */
  indicators: z.array(z.string()).optional(),
  /** Maximum results to return */
  limit: z.number().optional(),
  /** Cache TTL in seconds (0 = no cache) */
  cacheTtlSeconds: z.number().optional(),
});

export type FetchOptions = z.infer<typeof FetchOptionsSchema>;
