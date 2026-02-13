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
  subjectId: string;
  subjectName?: string;
  predictor: TimeSeries;
  outcome: TimeSeries;
}

export interface VariableRelationshipRunnerInput {
  subjects: NOf1VariableRelationshipInput[];
  analysisConfig?: AnalysisConfig;
  minimumPairs?: number;
  onSubjectError?: 'skip' | 'throw';
}

export interface SkippedSubject {
  subjectId: string;
  reason: string;
}

export interface NOf1VariableRelationshipResult {
  subjectId: string;
  subjectName?: string;
  analysis: FullAnalysisResult;
  nOf1VariableRelationship: NOf1VariableRelationship;
}

export interface VariableRelationshipRunnerResult {
  subjectResults: NOf1VariableRelationshipResult[];
  skippedSubjects: SkippedSubject[];
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
  subjectId: string,
  analysis: FullAnalysisResult,
): NOf1VariableRelationship {
  return {
    subjectId,
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
 * Run per-subject N-of-1 analyses and aggregate them into one relationship.
 *
 * The optimizer stays domain-agnostic; a "subject" can be a user, cohort,
 * organization, or any unit with longitudinal predictor/outcome series.
 */
export function runVariableRelationshipAnalysis(
  input: VariableRelationshipRunnerInput,
): VariableRelationshipRunnerResult {
  const minimumPairs = input.minimumPairs ?? DEFAULT_MINIMUM_PAIRS;
  const onSubjectError = input.onSubjectError ?? 'skip';
  const analysisConfig: AnalysisConfig = {
    analysisMode: 'individual',
    ...input.analysisConfig,
  };

  const subjectResults: NOf1VariableRelationshipResult[] = [];
  const skippedSubjects: SkippedSubject[] = [];

  for (const subject of input.subjects) {
    try {
      const analysis = runFullAnalysis(
        subject.predictor,
        subject.outcome,
        analysisConfig,
      );

      if (analysis.numberOfPairs < minimumPairs) {
        skippedSubjects.push({
          subjectId: subject.subjectId,
          reason: `Insufficient pairs (${analysis.numberOfPairs} < ${minimumPairs}).`,
        });
        continue;
      }

      subjectResults.push({
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        analysis,
        nOf1VariableRelationship: toNOf1VariableRelationship(subject.subjectId, analysis),
      });
    } catch (error) {
      if (onSubjectError === 'throw') {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      skippedSubjects.push({
        subjectId: subject.subjectId,
        reason: message,
      });
    }
  }

  const aggregateVariableRelationship = aggregateNOf1VariableRelationships(
    subjectResults.map(result => result.nOf1VariableRelationship),
  );

  return {
    subjectResults,
    skippedSubjects,
    aggregateVariableRelationship,
    analyzedAt: new Date().toISOString(),
  };
}


