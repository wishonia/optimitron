import {
  HypercertRightsRecordSchema,
  RightsInputSchema,
  RIGHTS_COLLECTION,
  type HypercertRightsRecord,
  type RightsInput,
} from './types.js';

function nowIso(): string {
  return new Date().toISOString();
}

export function createRightsRecord(input: RightsInput): HypercertRightsRecord {
  const parsed = RightsInputSchema.parse(input);
  return HypercertRightsRecordSchema.parse({
    $type: RIGHTS_COLLECTION,
    rightsName: parsed.rightsName,
    rightsType: parsed.rightsType,
    rightsDescription: parsed.rightsDescription,
    createdAt: parsed.createdAt ?? nowIso(),
    attachment: parsed.attachmentUri ? { uri: parsed.attachmentUri } : undefined,
  });
}
