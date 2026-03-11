import { z } from 'zod';

export const ACTIVITY_COLLECTION = 'org.hypercerts.claim.activity' as const;
export const RIGHTS_COLLECTION = 'org.hypercerts.claim.rights' as const;
export const MEASUREMENT_COLLECTION = 'org.hypercerts.context.measurement' as const;
export const EVALUATION_COLLECTION = 'org.hypercerts.context.evaluation' as const;
export const ATTACHMENT_COLLECTION = 'org.hypercerts.context.attachment' as const;

export const HypercertStrongRefSchema = z.object({
  uri: z.string().min(1),
  cid: z.string().min(1),
});

export type HypercertStrongRef = z.infer<typeof HypercertStrongRefSchema>;

export const HypercertUriSchema = z.object({
  uri: z.string().min(1),
});

export type HypercertUri = z.infer<typeof HypercertUriSchema>;

export const HypercertBlobSchema = z.object({
  blob: z.unknown(),
});

export const HypercertContentSchema = z.union([
  HypercertUriSchema,
  HypercertBlobSchema,
]);

export const HypercertRightsRecordSchema = z.object({
  $type: z.literal(RIGHTS_COLLECTION),
  rightsName: z.string().min(1).max(100),
  rightsType: z.string().min(1).max(10),
  rightsDescription: z.string().min(1),
  createdAt: z.string().datetime(),
  attachment: HypercertContentSchema.optional(),
});

export type HypercertRightsRecord = z.infer<typeof HypercertRightsRecordSchema>;

export const HypercertContributorSchema = z.object({
  contributorIdentity: z.union([
    z.object({ identity: z.string().min(1) }),
    HypercertStrongRefSchema,
  ]),
  contributionWeight: z.string().optional(),
  contributionDetails: z.union([
    z.object({ role: z.string().min(1) }),
    HypercertStrongRefSchema,
  ]).optional(),
});

export type HypercertContributor = z.infer<typeof HypercertContributorSchema>;

export const HypercertActivityClaimRecordSchema = z.object({
  $type: z.literal(ACTIVITY_COLLECTION),
  title: z.string().min(1).max(256),
  shortDescription: z.string().min(1).max(3000),
  createdAt: z.string().datetime(),
  description: z.string().optional(),
  rights: HypercertStrongRefSchema.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  workScope: z.union([
    z.string().min(1).max(1000),
    z.object({ scope: z.string().min(1).max(1000) }),
  ]).optional(),
  contributors: z.array(HypercertContributorSchema).max(1000).optional(),
  locations: z.array(HypercertStrongRefSchema).max(1000).optional(),
  image: z.union([
    HypercertUriSchema,
    z.object({ image: z.unknown() }),
  ]).optional(),
});

export type HypercertActivityClaimRecord = z.infer<typeof HypercertActivityClaimRecordSchema>;

export const HypercertMeasurementRecordSchema = z.object({
  $type: z.literal(MEASUREMENT_COLLECTION),
  metric: z.string().min(1).max(500),
  value: z.string().min(1).max(500),
  unit: z.string().min(1).max(50),
  createdAt: z.string().datetime(),
  comment: z.string().optional(),
  subjects: z.array(HypercertStrongRefSchema).max(100).optional(),
  measurers: z.array(z.string().min(1)).max(100).optional(),
  methodType: z.string().max(30).optional(),
  methodURI: z.string().min(1).optional(),
  evidenceURI: z.array(z.string().min(1)).max(50).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type HypercertMeasurementRecord = z.infer<typeof HypercertMeasurementRecordSchema>;

export const HypercertEvaluationRecordSchema = z.object({
  $type: z.literal(EVALUATION_COLLECTION),
  createdAt: z.string().datetime(),
  subject: HypercertStrongRefSchema.optional(),
  evaluators: z.array(z.string().min(1)).max(1000),
  summary: z.string().min(1).max(5000),
  score: z.object({
    min: z.number().int(),
    max: z.number().int(),
    value: z.number().int(),
  }).optional(),
  measurements: z.array(HypercertStrongRefSchema).max(100).optional(),
  content: z.array(HypercertContentSchema).max(100).optional(),
});

export type HypercertEvaluationRecord = z.infer<typeof HypercertEvaluationRecordSchema>;

export const HypercertAttachmentRecordSchema = z.object({
  $type: z.literal(ATTACHMENT_COLLECTION),
  title: z.string().min(1).max(256),
  createdAt: z.string().datetime(),
  content: z.array(HypercertContentSchema).max(100).optional(),
  subjects: z.array(HypercertStrongRefSchema).max(100).optional(),
  contentType: z.string().max(64).optional(),
  shortDescription: z.string().optional(),
});

export type HypercertAttachmentRecord = z.infer<typeof HypercertAttachmentRecordSchema>;

export const HypercertRecordSchema = z.discriminatedUnion('$type', [
  HypercertRightsRecordSchema,
  HypercertActivityClaimRecordSchema,
  HypercertMeasurementRecordSchema,
  HypercertEvaluationRecordSchema,
  HypercertAttachmentRecordSchema,
]);

export type HypercertRecord = z.infer<typeof HypercertRecordSchema>;

export const ActivityClaimInputSchema = z.object({
  policyName: z.string().min(1),
  policyDescription: z.string().optional(),
  evidenceGrade: z.enum(['A', 'B', 'C', 'D', 'F']).optional(),
  welfareScore: z.number().optional(),
  analysisSummary: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  contributorDid: z.string().min(1),
  contributorWeight: z.string().optional(),
  contributorRole: z.string().optional(),
  workScope: z.string().optional(),
  rights: HypercertStrongRefSchema.optional(),
  imageUri: z.string().min(1).optional(),
  locations: z.array(HypercertStrongRefSchema).optional(),
  sourceUrls: z.array(z.string().min(1)).optional(),
});

export type ActivityClaimInput = z.infer<typeof ActivityClaimInputSchema>;

export const MeasurementMetricInputSchema = z.object({
  metric: z.string().min(1),
  value: z.union([z.number(), z.string()]),
  unit: z.string().min(1),
  comment: z.string().optional(),
});

export type MeasurementMetricInput = z.infer<typeof MeasurementMetricInputSchema>;

export const PolicyMeasurementInputSchema = z.object({
  subject: HypercertStrongRefSchema,
  createdAt: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  methodType: z.string().optional(),
  methodURI: z.string().optional(),
  measurerDid: z.string().optional(),
  evidenceURI: z.array(z.string().min(1)).optional(),
  welfareScore: z.number().optional(),
  causalConfidenceScore: z.number().min(0).max(1).optional(),
  policyImpactScore: z.number().optional(),
  evidenceGrade: z.enum(['A', 'B', 'C', 'D', 'F']).optional(),
  citizenPreferenceWeight: z.number().optional(),
  governmentAllocationPct: z.number().optional(),
  preferenceGapPct: z.number().optional(),
  extraMetrics: z.array(MeasurementMetricInputSchema).optional(),
});

export type PolicyMeasurementInput = z.infer<typeof PolicyMeasurementInputSchema>;

export const EvaluationInputSchema = z.object({
  subject: HypercertStrongRefSchema,
  participantCount: z.number().int().nonnegative(),
  citizenPreferenceWeight: z.number().min(0).max(1),
  governmentAllocationPct: z.number().optional(),
  preferenceGapPct: z.number().optional(),
  createdAt: z.string().datetime().optional(),
  evaluatorDid: z.string().default('did:plc:wishocracy-aggregate'),
  measurementRefs: z.array(HypercertStrongRefSchema).optional(),
  summary: z.string().optional(),
  contentUrls: z.array(z.string().min(1)).optional(),
});

export type EvaluationInput = z.infer<typeof EvaluationInputSchema>;

export const AttachmentInputSchema = z.object({
  title: z.string().min(1),
  urls: z.array(z.string().min(1)).min(1),
  createdAt: z.string().datetime().optional(),
  subjects: z.array(HypercertStrongRefSchema).optional(),
  contentType: z.string().optional(),
  shortDescription: z.string().optional(),
});

export type AttachmentInput = z.infer<typeof AttachmentInputSchema>;

export const RightsInputSchema = z.object({
  rightsName: z.string().min(1),
  rightsType: z.string().min(1),
  rightsDescription: z.string().min(1),
  createdAt: z.string().datetime().optional(),
  attachmentUri: z.string().min(1).optional(),
});

export type RightsInput = z.infer<typeof RightsInputSchema>;
