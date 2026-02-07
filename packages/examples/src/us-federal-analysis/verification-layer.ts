/**
 * Verification Layer — Multi-Source Consensus Scoring
 *
 * This is a lightweight, auditable scoring layer that summarizes how well
 * multiple independent sources agree on a metric (e.g., income, healthy life years).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VerificationSource {
  name: string;
  value: number;
  year?: number;
  weight?: number;
  quality?: number; // 0-1 subjective quality score
  notes?: string;
}

export interface VerificationResult {
  metric: string;
  consensusValue: number;
  agreementScore: number; // 0-1
  dispersion: number; // coefficient of variation
  sourceCount: number;
  qualityScore: number;
  sources: VerificationSource[];
}

export interface VerificationOptions {
  dispersionThreshold?: number; // lower = stricter
  minSourcesForFullConfidence?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function weightedMean(values: Array<{ value: number; weight: number }>): number {
  const total = values.reduce((sum, v) => sum + v.weight, 0);
  if (total === 0) return NaN;
  return values.reduce((sum, v) => sum + v.value * v.weight, 0) / total;
}

function weightedStd(values: Array<{ value: number; weight: number }>, mean: number): number {
  const total = values.reduce((sum, v) => sum + v.weight, 0);
  if (total === 0) return NaN;
  const variance =
    values.reduce((sum, v) => sum + v.weight * (v.value - mean) ** 2, 0) / total;
  return Math.sqrt(variance);
}

function weightedMedian(values: Array<{ value: number; weight: number }>): number {
  if (values.length === 0) return NaN;
  const sorted = [...values].sort((a, b) => a.value - b.value);
  const total = sorted.reduce((sum, v) => sum + v.weight, 0);
  if (total === 0) return sorted[0]!.value;

  let cumulative = 0;
  for (const entry of sorted) {
    cumulative += entry.weight;
    if (cumulative >= total / 2) {
      return entry.value;
    }
  }
  return sorted[sorted.length - 1]!.value;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function calculateVerification(
  metric: string,
  sources: VerificationSource[],
  options: VerificationOptions = {},
): VerificationResult {
  const {
    dispersionThreshold = 0.15,
    minSourcesForFullConfidence = 5,
  } = options;

  const weighted = sources.map((s) => ({
    value: s.value,
    weight: s.weight ?? s.quality ?? 1,
  }));

  const consensusValue = weightedMedian(weighted);
  const mean = weightedMean(weighted);
  const std = weightedStd(weighted, mean);
  const dispersion = mean !== 0 && Number.isFinite(mean) ? Math.abs(std / mean) : 0;

  const rawAgreement =
    1 - Math.min(1, dispersion / Math.max(1e-6, dispersionThreshold));
  const sourceFactor = Math.min(1, sources.length / minSourcesForFullConfidence);
  const agreementScore = Math.max(0, Math.min(1, rawAgreement * sourceFactor));

  const qualityValues = sources.map((s) => ({
    value: s.quality ?? 0.7,
    weight: s.weight ?? 1,
  }));
  const qualityScore = weightedMean(qualityValues);

  return {
    metric,
    consensusValue,
    agreementScore,
    dispersion,
    sourceCount: sources.length,
    qualityScore,
    sources,
  };
}
