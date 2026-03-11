import {
  HypercertMeasurementRecordSchema,
  MEASUREMENT_COLLECTION,
  MeasurementMetricInputSchema,
  PolicyMeasurementInputSchema,
  type HypercertMeasurementRecord,
  type MeasurementMetricInput,
  type PolicyMeasurementInput,
} from './types.js';

function nowIso(): string {
  return new Date().toISOString();
}

function toMetricValue(value: number | string): string {
  if (typeof value === 'string') {
    return value;
  }
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

export function createMeasurementRecord(
  metric: MeasurementMetricInput,
  options: Omit<PolicyMeasurementInput, 'extraMetrics'>,
): HypercertMeasurementRecord {
  const parsedMetric = MeasurementMetricInputSchema.parse(metric);
  const parsedOptions = PolicyMeasurementInputSchema.omit({
    extraMetrics: true,
  }).parse(options);

  return HypercertMeasurementRecordSchema.parse({
    $type: MEASUREMENT_COLLECTION,
    metric: parsedMetric.metric,
    value: toMetricValue(parsedMetric.value),
    unit: parsedMetric.unit,
    comment: parsedMetric.comment,
    createdAt: parsedOptions.createdAt ?? nowIso(),
    subjects: [parsedOptions.subject],
    methodType: parsedOptions.methodType ?? 'causal-inference-bradford-hill',
    methodURI: parsedOptions.methodURI,
    evidenceURI: parsedOptions.evidenceURI,
    measurers: parsedOptions.measurerDid ? [parsedOptions.measurerDid] : undefined,
    startDate: parsedOptions.startDate,
    endDate: parsedOptions.endDate,
  });
}

export function createPolicyMeasurementRecords(
  input: PolicyMeasurementInput,
): HypercertMeasurementRecord[] {
  const parsed = PolicyMeasurementInputSchema.parse(input);
  const metrics: MeasurementMetricInput[] = [];

  if (parsed.welfareScore !== undefined) {
    metrics.push({ metric: 'Welfare Score', value: parsed.welfareScore, unit: 'points' });
  }
  if (parsed.causalConfidenceScore !== undefined) {
    metrics.push({
      metric: 'Causal Confidence Score',
      value: parsed.causalConfidenceScore,
      unit: 'score 0-1',
    });
  }
  if (parsed.policyImpactScore !== undefined) {
    metrics.push({
      metric: 'Policy Impact Score',
      value: parsed.policyImpactScore,
      unit: 'score 0-1',
    });
  }
  if (parsed.evidenceGrade) {
    metrics.push({ metric: 'Evidence Grade', value: parsed.evidenceGrade, unit: 'grade' });
  }
  if (parsed.citizenPreferenceWeight !== undefined) {
    metrics.push({
      metric: 'Citizen Preference Weight',
      value: parsed.citizenPreferenceWeight * 100,
      unit: 'percent',
    });
  }
  if (parsed.governmentAllocationPct !== undefined) {
    metrics.push({
      metric: 'Government Allocation',
      value: parsed.governmentAllocationPct,
      unit: 'percent',
    });
  }
  if (parsed.preferenceGapPct !== undefined) {
    metrics.push({
      metric: 'Preference Gap',
      value: parsed.preferenceGapPct,
      unit: 'percentage points',
    });
  }

  for (const metric of parsed.extraMetrics ?? []) {
    metrics.push(metric);
  }

  return metrics.map((metric) => createMeasurementRecord(metric, parsed));
}
