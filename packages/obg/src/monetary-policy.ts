/**
 * Optimal Supply Expansion Rate Calculator
 *
 * Answers: "At what annual rate should new money be created to maximize
 * median real welfare outcomes?"
 *
 * KEY FRAMING: This is NOT about interest rates. In the Wishonian system,
 * new money goes directly to citizens via UBI (anti-Cantillon). The
 * transmission mechanism is completely different from central banking,
 * where banks get money first and asset prices inflate before wages.
 *
 * Predictor: Broad money growth rate (annual %) — the rate at which the
 * money supply expands. This maps directly to the MonetaryPolicyOracle
 * contract's `expansionRateBps`.
 *
 * Outcomes: Real welfare metrics (PPP-adjusted income, life expectancy).
 * NOT nominal metrics that inflate alongside money supply.
 *
 * Historical data caveat: All historical data comes from Cantillon-distribution
 * systems. The optimal expansion rate under equal distribution (UBI) would
 * likely differ — the analysis provides a ceiling/floor, not a direct answer.
 * The real answer requires running the Wishonian system and measuring.
 *
 * @see packages/obg/src/country-analysis.ts — the underlying N-of-1 pipeline
 * @see packages/data/src/datasets/monetary-policy-panel.ts — data assembly
 * @see packages/treasury/contracts/MonetaryPolicyOracle.sol — on-chain consumer
 */

import {
  runCountryAnalysis,
  type AnnualTimeSeries,
  type CountryAnalysisConfig,
  type CountryAnalysisResult,
} from './country-analysis.js';

// ─── Types ───────────────────────────────────────────────────────────

export interface SupplyExpansionInput {
  /** Money supply growth rate series per jurisdiction (annual %) */
  expansionRateSeries: AnnualTimeSeries[];
  /** Outcome time series keyed by outcome name */
  outcomeSeries: Record<string, AnnualTimeSeries[]>;
  /** Current actual expansion rate (annual %, for gap calculation) */
  currentExpansionPct: number;
  /** Analysis config overrides */
  config?: Partial<CountryAnalysisConfig>;
}

export interface OutcomeAnalysis {
  outcomeName: string;
  /** Optimal expansion rate for this specific outcome (annual %) */
  optimalExpansionPct: number;
  /** Forward Pearson correlation (aggregate across jurisdictions) */
  meanCorrelation: number;
  /** Effect size z-score (aggregate) */
  meanEffectSize: number;
  /** Number of jurisdictions analyzed */
  jurisdictionCount: number;
  /** Full analysis result from runCountryAnalysis */
  countryAnalysis: CountryAnalysisResult;
}

export interface OptimalSupplyExpansionResult {
  /** Current actual expansion rate (annual %) */
  currentExpansionPct: number;
  /** Composite optimal expansion rate across all outcomes (annual %) */
  optimalExpansionPct: number;
  /** Equivalent in basis points (for MonetaryPolicyOracle contract) */
  optimalExpansionBps: number;
  /** Difference: optimal - current (percentage points) */
  gapPct: number;
  /** Direction recommendation */
  direction: 'expand' | 'contract' | 'maintain';
  /** Per-outcome breakdown */
  outcomeAnalyses: OutcomeAnalysis[];
  /** Composite welfare effect (mean PIS across outcomes) */
  compositeWelfareEffect: number;
  /** Evidence grade based on data quality and consistency */
  evidenceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  /** Caveat: historical data uses Cantillon distribution, not UBI */
  caveat: string;
  /** ISO timestamp */
  analyzedAt: string;
}

// ─── Defaults ────────────────────────────────────────────────────────

/**
 * Money supply expansion takes ~6 months to flow through the economy.
 * Shorter than interest rate transmission (1yr) because UBI is direct —
 * no bank intermediaries, no credit channel delays.
 */
const EXPANSION_ONSET_DELAY_DAYS = 180;

/** Effects of a supply expansion persist ~2 years */
const EXPANSION_DURATION_OF_ACTION_DAYS = 730;

const DEFAULT_EXPANSION_CONFIG: Partial<CountryAnalysisConfig> = {
  onsetDelayDays: EXPANSION_ONSET_DELAY_DAYS,
  durationOfActionDays: EXPANSION_DURATION_OF_ACTION_DAYS,
  fillingType: 'interpolation',
  minimumDataPoints: 5,
  plausibilityScore: 0.7,
  coherenceScore: 0.6,
  analogyScore: 0.7,
  specificityScore: 0.3,
};

// ─── Helpers ─────────────────────────────────────────────────────────

function gradeEvidence(outcomeAnalyses: OutcomeAnalysis[]): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (outcomeAnalyses.length === 0) return 'F';

  const totalJurisdictions = outcomeAnalyses.reduce(
    (sum, oa) => sum + oa.jurisdictionCount, 0,
  );
  const avgJurisdictions = totalJurisdictions / outcomeAnalyses.length;

  const optimalRates = outcomeAnalyses.map(oa => oa.optimalExpansionPct);
  const range = Math.max(...optimalRates) - Math.min(...optimalRates);
  const isConsistent = range < 5; // expansion rates agree within 5 pp

  if (avgJurisdictions >= 15 && isConsistent) return 'A';
  if (avgJurisdictions >= 10 && isConsistent) return 'B';
  if (avgJurisdictions >= 5) return 'C';
  if (avgJurisdictions >= 2) return 'D';
  return 'F';
}

const CANTILLON_CAVEAT =
  'Historical data reflects Cantillon-distribution systems where banks receive ' +
  'new money first. Under equal UBI distribution, the relationship between ' +
  'supply expansion and welfare outcomes would differ. This analysis provides ' +
  'an empirical ceiling — the actual optimal rate under UBI requires live measurement.';

// ─── Core Pipeline ───────────────────────────────────────────────────

/**
 * Analyze the optimal money supply expansion rate by running causal analysis
 * across countries for each welfare outcome, then computing a composite.
 *
 * The output includes `optimalExpansionBps` ready for the MonetaryPolicyOracle
 * contract's `updatePolicy(expansionRateBps)` call.
 */
export function analyzeOptimalSupplyExpansion(
  input: SupplyExpansionInput,
): OptimalSupplyExpansionResult {
  const config = { ...DEFAULT_EXPANSION_CONFIG, ...input.config };

  const outcomeAnalyses: OutcomeAnalysis[] = [];

  for (const [outcomeName, outcomeSeries] of Object.entries(input.outcomeSeries)) {
    if (outcomeSeries.length === 0) continue;

    const countryAnalysis = runCountryAnalysis({
      predictors: input.expansionRateSeries,
      outcomes: outcomeSeries,
      config,
    });

    if (countryAnalysis.jurisdictions.length === 0) continue;

    outcomeAnalyses.push({
      outcomeName,
      optimalExpansionPct: countryAnalysis.aggregate.meanOptimalValue,
      meanCorrelation: countryAnalysis.aggregate.meanForwardPearson,
      meanEffectSize: countryAnalysis.aggregate.meanEffectSize,
      jurisdictionCount: countryAnalysis.aggregate.n,
      countryAnalysis,
    });
  }

  const optimalExpansionPct = outcomeAnalyses.length > 0
    ? outcomeAnalyses.reduce((s, oa) => s + oa.optimalExpansionPct, 0) / outcomeAnalyses.length
    : input.currentExpansionPct;

  const gapPct = optimalExpansionPct - input.currentExpansionPct;

  const direction: 'expand' | 'contract' | 'maintain' =
    gapPct > 0.5 ? 'expand' :
    gapPct < -0.5 ? 'contract' :
    'maintain';

  const compositeWelfareEffect = outcomeAnalyses.length > 0
    ? outcomeAnalyses.reduce((s, oa) => s + oa.countryAnalysis.aggregate.meanPIS, 0) / outcomeAnalyses.length
    : 0;

  // Convert annual % to basis points (2% → 200 bps)
  const optimalExpansionBps = Math.round(Math.max(0, optimalExpansionPct) * 100);

  return {
    currentExpansionPct: input.currentExpansionPct,
    optimalExpansionPct,
    optimalExpansionBps,
    gapPct,
    direction,
    outcomeAnalyses,
    compositeWelfareEffect,
    evidenceGrade: gradeEvidence(outcomeAnalyses),
    caveat: CANTILLON_CAVEAT,
    analyzedAt: new Date().toISOString(),
  };
}

// ─── Backwards compat (deprecated) ───────────────────────────────────

/** @deprecated Use SupplyExpansionInput instead */
export type MonetaryPolicyInput = SupplyExpansionInput;
/** @deprecated Use OptimalSupplyExpansionResult instead */
export type OptimalMonetaryPolicyResult = OptimalSupplyExpansionResult;
/** @deprecated Use analyzeOptimalSupplyExpansion instead */
export const analyzeOptimalMonetaryPolicy = analyzeOptimalSupplyExpansion;
