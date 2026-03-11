import { z } from 'zod';

export const HexAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
export const HexHashSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
export const IsoDateTimeSchema = z.string().datetime();

export const ComputeConstraintsSchema = z.object({
  maxAnalysesPerRun: z.number().int().positive(),
  maxAPICallsPerRun: z.number().int().positive(),
  timeoutSeconds: z.number().int().positive(),
});

export type ComputeConstraints = z.infer<typeof ComputeConstraintsSchema>;

export const AgentManifestSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  operatorWallet: HexAddressSchema,
  erc8004Identity: z.string().min(1),
  erc8004RegistrationTx: z.string().min(1),
  supportedTools: z.array(z.string().min(1)).min(1),
  supportedTechStack: z.array(z.string().min(1)).min(1),
  computeConstraints: ComputeConstraintsSchema,
  supportedTaskCategories: z.array(z.string().min(1)).min(1),
});

export type AgentManifest = z.infer<typeof AgentManifestSchema>;

export const PreferenceGapCandidateSchema = z.object({
  itemId: z.string().min(1),
  itemName: z.string().min(1),
  preferredPct: z.number(),
  actualPct: z.number(),
  gapPct: z.number(),
  gapUsd: z.number().optional(),
});

export type PreferenceGapCandidate = z.infer<typeof PreferenceGapCandidateSchema>;

export const WishocracySnapshotInputSchema = z.object({
  jurisdictionId: z.string().min(1),
  participantCount: z.number().int().nonnegative(),
  consistencyRatio: z.number().min(0).optional(),
  preferenceWeights: z.array(
    z.object({
      itemId: z.string().min(1),
      weight: z.number().min(0).max(1),
      label: z.string().optional(),
      rank: z.number().int().positive().optional(),
      ciLow: z.number().optional(),
      ciHigh: z.number().optional(),
    }),
  ).default([]),
  aggregatedComparisonMatrix: z.array(
    z.object({
      itemAId: z.string().min(1),
      itemBId: z.string().min(1),
      ratio: z.number(),
      count: z.number().int().nonnegative(),
      stdDev: z.number().optional(),
    }),
  ).optional(),
  convergenceAnalysis: z.object({
    stable: z.boolean(),
    minComparisonsNeeded: z.number().int().nonnegative().optional(),
  }).optional(),
});

export type WishocracySnapshotInput = z.infer<typeof WishocracySnapshotInputSchema>;

export const AgentRunInputSchema = z.object({
  runId: z.string().min(1).optional(),
  jurisdictionId: z.string().min(1),
  jurisdictionName: z.string().min(1).optional(),
  startedAt: IsoDateTimeSchema.optional(),
  preferenceGaps: z.array(PreferenceGapCandidateSchema).min(1),
  availableDataSources: z.array(z.string().min(1)).default([]),
  wishocracySnapshot: WishocracySnapshotInputSchema.optional(),
});

export type AgentRunInput = z.infer<typeof AgentRunInputSchema>;

export const AgentAnalysisTargetSchema = PreferenceGapCandidateSchema.extend({
  availableDataSources: z.array(z.string().min(1)).default([]),
  tractabilityScore: z.number().min(0).max(1).optional(),
  rationale: z.string().min(1).optional(),
});

export type AgentAnalysisTarget = z.infer<typeof AgentAnalysisTargetSchema>;

export const AgentDiscoveryDecisionSchema = z.object({
  selectedTargets: z.array(AgentAnalysisTargetSchema).min(1),
  rationale: z.string().min(1),
  discardedItemIds: z.array(z.string().min(1)).default([]),
});

export type AgentDiscoveryDecision = z.infer<typeof AgentDiscoveryDecisionSchema>;

export const AgentPlanDecisionSchema = z.object({
  plannedTargets: z.array(AgentAnalysisTargetSchema).min(1),
  rationale: z.string().min(1),
  executionNotes: z.array(z.string().min(1)).default([]),
});

export type AgentPlanDecision = z.infer<typeof AgentPlanDecisionSchema>;

export const AnalysisQualityCheckSchema = z.object({
  sufficientData: z.boolean(),
  predictorDataPoints: z.number().int().nonnegative(),
  outcomeDataPoints: z.number().int().nonnegative(),
  alignedPairs: z.number().int().nonnegative().optional(),
  evidenceSources: z.number().int().nonnegative().optional(),
  notes: z.array(z.string().min(1)).default([]),
});

export type AnalysisQualityCheck = z.infer<typeof AnalysisQualityCheckSchema>;

export const AgentAnalysisArtifactSchema = z.object({
  target: AgentAnalysisTargetSchema,
  policyId: z.string().optional(),
  policyName: z.string().min(1),
  recommendation: z.enum(['enact', 'replace', 'repeal', 'maintain']),
  policyDescription: z.string().optional(),
  evidenceGrade: z.enum(['A', 'B', 'C', 'D', 'F']).optional(),
  welfareScore: z.number().optional(),
  policyImpactScore: z.number().optional(),
  causalConfidenceScore: z.number().min(0).max(1).optional(),
  citizenPreferenceWeight: z.number().min(0).max(1).optional(),
  governmentAllocationPct: z.number().optional(),
  preferenceGapPct: z.number().optional(),
  participantCount: z.number().int().nonnegative().default(0),
  sourceUrls: z.array(z.string().min(1)).default([]),
  rawMetrics: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
  ).default({}),
  qualityChecks: AnalysisQualityCheckSchema,
});

export type AgentAnalysisArtifact = z.infer<typeof AgentAnalysisArtifactSchema>;

export const AgentInterpretationSchema = z.object({
  summary: z.string().min(1),
  confidenceAssessment: z.string().min(1),
  caveats: z.array(z.string().min(1)).default([]),
  additionalDataNeeded: z.array(z.string().min(1)).default([]),
});

export type AgentInterpretation = z.infer<typeof AgentInterpretationSchema>;

export const AgentVerificationDecisionSchema = z.object({
  verdict: z.enum(['proceed', 'retry', 'abort']),
  rationale: z.string().min(1),
  retryReason: z.string().min(1).optional(),
});

export type AgentVerificationDecision = z.infer<typeof AgentVerificationDecisionSchema>;

export const AgentPublishReceiptSchema = z.object({
  activityUri: z.string().min(1),
  evaluationUri: z.string().min(1),
  attachmentUris: z.array(z.string().min(1)).default([]),
  measurementUris: z.array(z.string().min(1)).default([]),
  policyStorageCid: z.string().min(1).optional(),
  aggregationStorageCid: z.string().min(1).optional(),
  reputationTxHash: z.string().min(1).optional(),
});

export type AgentPublishReceipt = z.infer<typeof AgentPublishReceiptSchema>;

export const AgentToolCallSchema = z.object({
  name: z.string().min(1),
  status: z.enum(['success', 'failed', 'skipped']),
  inputSummary: z.string().min(1).optional(),
  outputSummary: z.string().min(1).optional(),
  error: z.string().min(1).optional(),
  at: IsoDateTimeSchema,
});

export type AgentToolCall = z.infer<typeof AgentToolCallSchema>;

export const AgentStepLogSchema = z.object({
  step: z.enum(['discover', 'plan', 'execute', 'interpret', 'verify', 'publish']),
  status: z.enum(['completed', 'failed', 'skipped']),
  startedAt: IsoDateTimeSchema,
  completedAt: IsoDateTimeSchema,
  reasoning: z.string().min(1).optional(),
  toolCalls: z.array(AgentToolCallSchema).default([]),
  error: z.string().min(1).optional(),
});

export type AgentStepLog = z.infer<typeof AgentStepLogSchema>;

export const AgentTargetExecutionSchema = z.object({
  target: AgentAnalysisTargetSchema,
  attemptCount: z.number().int().positive(),
  analysis: AgentAnalysisArtifactSchema.optional(),
  interpretation: AgentInterpretationSchema.optional(),
  verification: AgentVerificationDecisionSchema.optional(),
  publishReceipt: AgentPublishReceiptSchema.optional(),
  status: z.enum(['completed', 'aborted', 'failed']),
});

export type AgentTargetExecution = z.infer<typeof AgentTargetExecutionSchema>;

export const AgentRunLogSchema = z.object({
  runId: z.string().min(1),
  startedAt: IsoDateTimeSchema,
  completedAt: IsoDateTimeSchema,
  status: z.enum(['completed', 'partial', 'failed']),
  manifestName: z.string().min(1),
  manifestVersion: z.string().min(1),
  operatorWallet: HexAddressSchema,
  erc8004Identity: z.string().min(1),
  jurisdictionId: z.string().min(1),
  discovery: AgentDiscoveryDecisionSchema.optional(),
  plan: AgentPlanDecisionSchema.optional(),
  targetExecutions: z.array(AgentTargetExecutionSchema),
  steps: z.array(AgentStepLogSchema),
  outputs: z.object({
    activityUris: z.array(z.string().min(1)).default([]),
    storageCids: z.array(z.string().min(1)).default([]),
    reputationTxHashes: z.array(z.string().min(1)).default([]),
  }),
  failures: z.array(z.string().min(1)).default([]),
});

export type AgentRunLog = z.infer<typeof AgentRunLogSchema>;

export interface StructuredReasoningRequest<T> {
  parse(value: unknown): T;
  prompt: string;
  responseJsonSchema: Record<string, unknown>;
  schemaName: string;
}

export interface StructuredReasoner {
  generateObject<T>(request: StructuredReasoningRequest<T>): Promise<T>;
}
