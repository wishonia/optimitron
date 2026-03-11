import {
  CreateOptomitronPolicyAnalysisInputSchema,
  OptomitronPolicyAnalysisSnapshotSchema,
  type CreateOptomitronPolicyAnalysisInput,
  type OptomitronPolicyAnalysisSnapshot,
  type StoredSnapshotUpload,
} from './types.js';
import {
  findLatestStoredSnapshot,
  uploadJson,
  type StorachaListClient,
  type StorachaUploadClient,
} from './client.js';

function nowIso(): string {
  return new Date().toISOString();
}

export function createPolicyAnalysisSnapshot(
  input: CreateOptomitronPolicyAnalysisInput,
): OptomitronPolicyAnalysisSnapshot {
  const parsed = CreateOptomitronPolicyAnalysisInputSchema.parse(input);
  return OptomitronPolicyAnalysisSnapshotSchema.parse({
    ...parsed,
    type: 'optomitron-policy-analysis',
    timestamp: parsed.timestamp ?? nowIso(),
  });
}

export async function storePolicyAnalysis(
  client: StorachaUploadClient,
  input: CreateOptomitronPolicyAnalysisInput,
): Promise<StoredSnapshotUpload<OptomitronPolicyAnalysisSnapshot>> {
  const snapshot = createPolicyAnalysisSnapshot(input);
  const cid = await uploadJson(client, snapshot);
  return { cid, snapshot };
}

export async function storeLinkedPolicyAnalysis(
  client: StorachaUploadClient & StorachaListClient,
  input: CreateOptomitronPolicyAnalysisInput,
  fetchImpl: typeof fetch = fetch,
): Promise<StoredSnapshotUpload<OptomitronPolicyAnalysisSnapshot>> {
  const latestSnapshot = input.previousCid
    ? null
    : await findLatestStoredSnapshot(client, fetchImpl, {
      jurisdictionId: input.jurisdictionId,
      type: 'optomitron-policy-analysis',
    });

  return storePolicyAnalysis(client, {
    ...input,
    previousCid: input.previousCid ?? latestSnapshot?.cid,
  });
}
