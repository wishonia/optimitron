/**
 * Optimal Interest Rate Calculator
 *
 * Applies the same N-of-1 country-level causal analysis pipeline used for
 * budget optimization, but with interest rates as the predictor instead of
 * spending categories.
 *
 * Predictor: Real interest rate (or Fed funds rate for US)
 * Outcomes: Median real income, life expectancy, inequality (Gini)
 *
 * Temporal parameters use longer delays than budget analysis because
 * monetary policy transmits through multiple intermediaries (banks, credit
 * markets, employment) before affecting welfare outcomes.
 *
 * @see packages/obg/src/country-analysis.ts — the underlying pipeline
 * @see packages/data/src/datasets/monetary-policy-panel.ts — data assembly
 */

import {
  runCountryAnalysis,
  type AnnualTimeSeries,
  type CountryAnalysisConfig,
  type CountryAnalysisResult,
} from './country-analysis.js';

// ─── Types ───────────────────────────────────────────────────────────

export interface MonetaryPolicyInput {
  /** Interest rate time series per jurisdiction */
  interestRateSeries: AnnualTimeSeries[];
  /** Outcome time series keyed by outcome name */
  outcomeSeries: Record<string, AnnualTimeSeries[]>;
  /** Current actual interest rate (for gap calculation) */
  currentRatePct: number;
  /** Analysis config overrides */
  config?: Partial<CountryAnalysisConfig>;
}

export interface OutcomeAnalysis {
  outcomeName: string;
  /** Optimal interest rate for this specific outcome */
  optimalRatePct: number;
  /** Forward Pearson correlation (aggregate) */
  meanCorrelation: number;
  /** Effect size z-score (aggregate) */
  meanEffectSize: number;
  /** Number of jurisdictions analyzed */
  jurisdictionCount: number;
  /** Full analysis result from runCountryAnalysis */
  countryAnalysis: CountryAnalysisResult;
}

export interface OptimalMonetaryPolicyResult {
  /** Current actual rate */
  currentRatePct: number;
  /** Composite optimal rate across all outcomes */
  optimalRatePct: number;
  /** Difference: optimal - current */
  gapPct: number;
  /** Direction recommendation */
  direction: 'raise' | 'lower' | 'maintain';
  /** Per-outcome breakdown */
  outcomeAnalyses: OutcomeAnalysis[];
  /** Composite welfare effect (mean PIS across outcomes) */
  compositeWelfareEffect: number;
  /** Evidence grade based on data quality and consistency */
  evidenceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  /** ISO timestamp */
  analyzedAt: string;
}

// ─── Defaults ────────────────────────────────────────────────────────

/** Monetary policy takes ~1 year to transmit through the economy */
const MONETARY_ONSET_DELAY_DAYS = 365;

/** Effects persist ~3 years (rate changes echo through credit cycles) */
const MONETARY_DURATION_OF_ACTION_DAYS = 1095;

const DEFAULT_MONETARY_CONFIG: Partial<CountryAnalysisConfig> = {
  onsetDelayDays: MONETARY_ONSET_DELAY_DAYS,
  durationOfActionDays: MONETARY_DURATION_OF_ACTION_DAYS,
  fillingType: 'interpolation',
  minimumDataPoints: 5,
  plausibilityScore: 0.8,
  coherenceScore: 0.7,
  analogyScore: 0.8,
  specificityScore: 0.4,
};

// ─── Helpers ─────────────────────────────────────────────────────────

/** Assign evidence grade based on jurisdiction count and consistency */
function gradeEvidence(outcomeAnalyses: OutcomeAnalysis[]): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (outcomeAnalyses.length === 0) return 'F';

  const totalJurisdictions = outcomeAnalyses.reduce(
    (sum, oa) => sum + oa.jurisdictionCount, 0,
  );
  const avgJurisdictions = totalJurisdictions / outcomeAnalyses.length;

  // Check directional consistency across outcomes
  const optimalRates = outcomeAnalyses.map(oa => oa.optimalRatePct);
  const range = Math.max(...optimalRates) - Math.min(...optimalRates);
  const isConsistent = range < 3; // optimal rates agree within 3 percentage points

  if (avgJurisdictions >= 15 && isConsistent) return 'A';
  if (avgJurisdictions >= 10 && isConsistent) return 'B';
  if (avgJurisdictions >= 5) return 'C';
  if (avgJurisdictions >= 2) return 'D';
  return 'F';
}

// ─── Core Pipeline ───────────────────────────────────────────────────

/**
 * Analyze the optimal interest rate by running causal analysis across
 * countries for each welfare outcome, then computing a composite.
 */
export function analyzeOptimalMonetaryPolicy(
  input: MonetaryPolicyInput,
): OptimalMonetaryPolicyResult {
  const config = { ...DEFAULT_MONETARY_CONFIG, ...input.config };

  const outcomeAnalyses: OutcomeAnalysis[] = [];

  for (const [outcomeName, outcomeSeries] of Object.entries(input.outcomeSeries)) {
    if (outcomeSeries.length === 0) continue;

    const countryAnalysis = runCountryAnalysis({
      predictors: input.interestRateSeries,
      outcomes: outcomeSeries,
      config,
    });

    if (countryAnalysis.jurisdictions.length === 0) continue;

    outcomeAnalyses.push({
      outcomeName,
      optimalRatePct: countryAnalysis.aggregate.meanOptimalValue,
      meanCorrelation: countryAnalysis.aggregate.meanForwardPearson,
      meanEffectSize: countryAnalysis.aggregate.meanEffectSize,
      jurisdictionCount: countryAnalysis.aggregate.n,
      countryAnalysis,
    });
  }

  // Composite optimal rate: average across outcomes
  const optimalRatePct = outcomeAnalyses.length > 0
    ? outcomeAnalyses.reduce((s, oa) => s + oa.optimalRatePct, 0) / outcomeAnalyses.length
    : input.currentRatePct;

  const gapPct = optimalRatePct - input.currentRatePct;

  // Direction: maintain if gap is within ±0.25pp
  const direction: 'raise' | 'lower' | 'maintain' =
    gapPct > 0.25 ? 'raise' :
    gapPct < -0.25 ? 'lower' :
    'maintain';

  const compositeWelfareEffect = outcomeAnalyses.length > 0
    ? outcomeAnalyses.reduce((s, oa) => s + oa.countryAnalysis.aggregate.meanPIS, 0) / outcomeAnalyses.length
    : 0;

  return {
    currentRatePct: input.currentRatePct,
    optimalRatePct,
    gapPct,
    direction,
    outcomeAnalyses,
    compositeWelfareEffect,
    evidenceGrade: gradeEvidence(outcomeAnalyses),
    analyzedAt: new Date().toISOString(),
  };
}
