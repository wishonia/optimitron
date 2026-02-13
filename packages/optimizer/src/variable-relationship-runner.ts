import type {
  FullAnalysisResult,
  AnalysisConfig,
} from './pipeline.js';
import type {
  TimeSeries,
  NOf1VariableRelationship,
  AggregateVariableRelationship,
} from './types.js';
import { runFullAnalysis } from './pipeline.js';
import { aggregateNOf1VariableRelationships } from './statistics.js';

export interface NOf1VariableRelationshipInput {
  unitId: string;
  unitName?: string;
  predictor: TimeSeries;
  outcome: TimeSeries;
}

export interface VariableRelationshipRunnerInput {
  units: NOf1VariableRelationshipInput[];
  analysisConfig?: AnalysisConfig;
  minimumPairs?: number;
  onUnitError?: 'skip' | 'throw';
}

export interface SkippedUnit {
  unitId: string;
  reason: string;
}

export interface NOf1VariableRelationshipResult {
  unitId: string;
  unitName?: string;
  analysis: FullAnalysisResult;
  nOf1VariableRelationship: NOf1VariableRelationship;
}

export interface VariableRelationshipRunnerResult {
  unitResults: NOf1VariableRelationshipResult[];
  skippedUnits: SkippedUnit[];
  aggregateVariableRelationship: AggregateVariableRelationship;
  analyzedAt: string;
}

const DEFAULT_MINIMUM_PAIRS = 2;

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/**
 * Convert p-value + sample size into a bounded significance weight [0,1].
 *
 * This is used for weighting global aggregation and is intentionally simple:
 * - lower p-value increases confidence
 * - more paired observations increases confidence
 */
export function deriveStatisticalSignificance(
  pValue: number,
  numberOfPairs: number,
): number {
  const pComponent = clamp01(1 - pValue);
  const pairComponent = 1 - Math.exp(-Math.max(0, numberOfPairs) / 30);
  return clamp01(0.7 * pComponent + 0.3 * pairComponent);
}

export function toNOf1VariableRelationship(
  unitId: string,
  analysis: FullAnalysisResult,
): NOf1VariableRelationship {
  return {
    unitId,
    forwardPearson: analysis.forwardPearson,
    reversePearson: analysis.reversePearson,
    predictivePearson: analysis.predictivePearson,
    effectSize: analysis.effectSize.percentChange,
    statisticalSignificance: deriveStatisticalSignificance(
      analysis.pValue,
      analysis.numberOfPairs,
    ),
    numberOfPairs: analysis.numberOfPairs,
    valuePredictingHighOutcome: analysis.optimalValues.valuePredictingHighOutcome,
    valuePredictingLowOutcome: analysis.optimalValues.valuePredictingLowOutcome,
    optimalDailyValue: analysis.optimalValues.optimalDailyValue,
    outcomeFollowUpPercentChangeFromBaseline:
      analysis.baselineFollowup.outcomeFollowUpPercentChangeFromBaseline,
  };
}

/**
 * Run per-unit N-of-1 analyses and aggregate them into one relationship.
 *
 * The optimizer stays domain-agnostic; "unit" can be a user, cohort,
 * organization, or any entity with longitudinal predictor/outcome series.
 */
export function runVariableRelationshipAnalysis(
  input: VariableRelationshipRunnerInput,
): VariableRelationshipRunnerResult {
  const minimumPairs = input.minimumPairs ?? DEFAULT_MINIMUM_PAIRS;
  const onUnitError = input.onUnitError ?? 'skip';
  const analysisConfig: AnalysisConfig = {
    analysisMode: 'individual',
    ...input.analysisConfig,
  };

  const unitResults: NOf1VariableRelationshipResult[] = [];
  const skippedUnits: SkippedUnit[] = [];

  for (const unit of input.units) {
    try {
      const analysis = runFullAnalysis(
        unit.predictor,
        unit.outcome,
        analysisConfig,
      );

      if (analysis.numberOfPairs < minimumPairs) {
        skippedUnits.push({
          unitId: unit.unitId,
          reason: `Insufficient pairs (${analysis.numberOfPairs} < ${minimumPairs}).`,
        });
        continue;
      }

      unitResults.push({
        unitId: unit.unitId,
        unitName: unit.unitName,
        analysis,
        nOf1VariableRelationship: toNOf1VariableRelationship(unit.unitId, analysis),
      });
    } catch (error) {
      if (onUnitError === 'throw') {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      skippedUnits.push({
        unitId: unit.unitId,
        reason: message,
      });
    }
  }

  const aggregateVariableRelationship = aggregateNOf1VariableRelationships(
    unitResults.map(result => result.nOf1VariableRelationship),
  );

  return {
    unitResults,
    skippedUnits,
    aggregateVariableRelationship,
    analyzedAt: new Date().toISOString(),
  };
}

