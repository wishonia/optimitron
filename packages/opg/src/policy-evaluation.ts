/**
 * Policy Evaluation — 3-Layer Evidence Framework
 *
 * Evaluates any policy using:
 * 1. Within-jurisdiction time series (e.g., US drug spending vs overdose deaths over time)
 * 2. Natural experiments (before/after an intervention in specific jurisdictions)
 * 3. Cross-jurisdiction panel data (OECD countries compared simultaneously)
 *
 * Each layer feeds through `runFullAnalysis()` from @optomitron/optimizer.
 * Results are aggregated via weighted meta-analysis into a final evidence grade.
 */

import type { FullAnalysisResult, TimeSeries } from '@optomitron/optimizer';

// ---------------------------------------------------------------------------
// Core Types
// ---------------------------------------------------------------------------

/** Direction: is a higher outcome value better or worse? */
export type OutcomeDirection = 'higher' | 'lower';

/** A specific outcome metric a policy is expected to affect */
export interface OutcomeMetric {
  /** Human-readable name (e.g., "Drug Overdose Deaths") */
  name: string;
  /** Machine-readable ID */
  id: string;
  /** Unit of measurement */
  unit: string;
  /** Is higher better or lower better? */
  direction: OutcomeDirection;
}

/** Result from a single natural experiment (one jurisdiction, one policy) */
export interface NaturalExperimentResult {
  /** Jurisdiction that implemented the policy */
  jurisdiction: string;
  /** ISO country code */
  jurisdictionCode: string;
  /** Policy name */
  policy: string;
  /** Date the policy was implemented */
  interventionDate: string;
  /** Outcome metric being measured */
  outcomeMetric: OutcomeMetric;
  /** Number of data points before intervention */
  preDataPoints: number;
  /** Number of data points after intervention */
  postDataPoints: number;
  /** Year range of data */
  yearRange: string;
  /** Mean outcome value before intervention */
  preMean: number;
  /** Mean outcome value after intervention */
  postMean: number;
  /** Absolute change (post - pre) */
  absoluteChange: number;
  /** Percent change from pre to post */
  percentChange: number;
  /** Full analysis result from the optimizer pipeline */
  analysisResult: FullAnalysisResult;
}

/** Panel analysis result (cross-jurisdiction comparison) */
export interface PanelAnalysisResult {
  /** Number of jurisdictions compared */
  jurisdictionCount: number;
  /** Jurisdictions included */
  jurisdictions: string[];
  /** Spending category being analyzed */
  spendingCategory: string;
  /** Average correlation across jurisdictions */
  averageCorrelation: number;
  /** Overspend ratio for the reference jurisdiction (usually US) */
  referenceOverspendRatio?: number;
  /** Efficient frontier position */
  efficientFrontierRank?: number;
}

/** Complete evaluation of a single policy across all evidence layers */
export interface PolicyEvaluation {
  /** Policy name */
  policy: string;
  /** Policy description */
  description: string;
  /** Category (health, education, justice, etc.) */
  category: string;
  /** Expected outcome metrics */
  expectedOutcomes: OutcomeMetric[];

  /** Layer 1: Within-jurisdiction time series (typically US) */
  withinJurisdiction: {
    jurisdiction: string;
    analyses: Array<{
      outcomeMetric: OutcomeMetric;
      correlation: number;
      pValue: number;
      dataPoints: number;
      yearRange: string;
      bradfordHillAverage: number;
      predictorImpactScore: number;
      effectSizePercent: number;
      interpretation: 'counterproductive' | 'effective' | 'neutral';
    }>;
  } | null;

  /** Layer 2: Natural experiments (multi-jurisdiction before/after) */
  naturalExperiments: NaturalExperimentResult[];

  /** Layer 3: Cross-jurisdiction panel */
  crossJurisdiction: PanelAnalysisResult | null;

  /** Aggregated evidence */
  aggregate: {
    /** Weighted average effect size across all layers */
    weightedEffectSize: number;
    /** Number of independent evidence sources */
    evidenceSources: number;
    /** Number of jurisdictions with data */
    jurisdictionCount: number;
    /** Overall evidence grade (A-F) */
    evidenceGrade: string;
    /** Confidence score (0-1) */
    confidence: number;
    /** Human-readable verdict */
    verdict: string;
  };
}

// ---------------------------------------------------------------------------
// Natural Experiment Data Definition
// ---------------------------------------------------------------------------

/** Input definition for a natural experiment */
export interface NaturalExperimentDef {
  /** Policy name */
  policy: string;
  /** Jurisdiction that implemented it */
  jurisdiction: string;
  /** ISO country code */
  jurisdictionCode: string;
  /** Year the policy was implemented */
  interventionYear: number;
  /** Outcome metrics with year-by-year data */
  outcomes: Array<{
    metric: OutcomeMetric;
    /** Year-by-year data: { year, value } */
    data: Array<{ year: number; value: number }>;
  }>;
}

// ---------------------------------------------------------------------------
// Evidence Grading
// ---------------------------------------------------------------------------

/**
 * Derive evidence grade from aggregate metrics.
 *
 * A = Strong evidence (multiple jurisdictions, consistent direction, large effect)
 * B = Good evidence (some jurisdictions, mostly consistent)
 * C = Moderate evidence (limited data, mixed signals)
 * D = Weak evidence (single source, small effect)
 * F = Counter-evidence (policy appears harmful)
 */
export function deriveEvidenceGrade(
  effectSize: number,
  evidenceSources: number,
  jurisdictionCount: number,
  consistency: number, // 0-1: what fraction of analyses agree on direction
): { grade: string; confidence: number; verdict: string } {
  const absEffect = Math.abs(effectSize);

  // Counter-evidence: effect goes wrong way with high confidence
  if (effectSize < -0.3 && consistency > 0.7 && evidenceSources >= 2) {
    return {
      grade: 'F',
      confidence: Math.min(consistency, 0.95),
      verdict: 'Strong evidence that this policy is counterproductive',
    };
  }

  // Grade based on effect size, sources, and consistency
  if (absEffect > 0.5 && evidenceSources >= 3 && jurisdictionCount >= 3 && consistency > 0.8) {
    return { grade: 'A', confidence: 0.9, verdict: 'Strong evidence of effectiveness across multiple jurisdictions' };
  }
  if (absEffect > 0.3 && evidenceSources >= 2 && consistency > 0.7) {
    return { grade: 'B', confidence: 0.75, verdict: 'Good evidence of effectiveness' };
  }
  if (absEffect > 0.2 && evidenceSources >= 1) {
    return { grade: 'C', confidence: 0.5, verdict: 'Moderate evidence — more data needed' };
  }
  if (absEffect > 0.1) {
    return { grade: 'D', confidence: 0.3, verdict: 'Weak evidence — effect is small or inconsistent' };
  }

  return { grade: 'D', confidence: 0.2, verdict: 'Insufficient evidence to evaluate' };
}

// ---------------------------------------------------------------------------
// Meta-Analysis Aggregation
// ---------------------------------------------------------------------------

/**
 * Aggregate effect sizes across multiple analyses using inverse-variance weighting.
 * 
 * Each analysis contributes proportionally to its data quality (more data points = more weight).
 * Direction is normalized: positive = policy works as intended, negative = counterproductive.
 */
export function aggregateEffectSizes(
  effects: Array<{
    effectSize: number;
    dataPoints: number;
    direction: OutcomeDirection;
    correlation: number;
  }>,
): { weightedEffect: number; consistency: number; totalWeight: number } {
  if (effects.length === 0) {
    return { weightedEffect: 0, consistency: 0, totalWeight: 0 };
  }

  let totalWeight = 0;
  let weightedSum = 0;
  let positiveCount = 0;

  for (const e of effects) {
    const weight = Math.sqrt(e.dataPoints); // sqrt(N) weighting
    // Normalize direction: for "lower is better" outcomes, flip the sign
    // A negative correlation with a "lower is better" outcome = policy works
    const normalizedEffect = e.direction === 'lower' ? -e.correlation : e.correlation;

    weightedSum += normalizedEffect * weight;
    totalWeight += weight;

    if (normalizedEffect > 0) positiveCount++;
  }

  const weightedEffect = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const consistency = effects.length > 0 ? positiveCount / effects.length : 0;

  return { weightedEffect, consistency, totalWeight };
}
