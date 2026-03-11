import {
  EVALUATION_COLLECTION,
  EvaluationInputSchema,
  HypercertEvaluationRecordSchema,
  type EvaluationInput,
  type HypercertEvaluationRecord,
} from './types.js';

function nowIso(): string {
  return new Date().toISOString();
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function buildSummary(input: EvaluationInput): string {
  if (input.summary) {
    return input.summary;
  }

  const preferencePct = input.citizenPreferenceWeight * 100;
  if (input.governmentAllocationPct === undefined || input.preferenceGapPct === undefined) {
    return `Citizen preference aggregation: ${input.participantCount} voters assigned ${formatPercent(preferencePct)} of ideal budget weight to this policy area.`;
  }

  return [
    `Citizen preference aggregation: ${input.participantCount} voters allocated ${formatPercent(preferencePct)} of ideal budget to this policy area.`,
    `Government allocation: ${formatPercent(input.governmentAllocationPct)}.`,
    `Preference gap: ${input.preferenceGapPct.toFixed(1)} percentage points.`,
  ].join(' ');
}

export function createEvaluationRecord(
  input: EvaluationInput,
): HypercertEvaluationRecord {
  const parsed = EvaluationInputSchema.parse(input);
  return HypercertEvaluationRecordSchema.parse({
    $type: EVALUATION_COLLECTION,
    createdAt: parsed.createdAt ?? nowIso(),
    subject: parsed.subject,
    evaluators: [parsed.evaluatorDid],
    summary: buildSummary(parsed),
    score: {
      min: 0,
      max: 100,
      value: Math.round(parsed.citizenPreferenceWeight * 100),
    },
    measurements: parsed.measurementRefs,
    content: parsed.contentUrls?.map((uri) => ({ uri })),
  });
}
