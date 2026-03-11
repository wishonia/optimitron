import {
  CreateWishocracyAggregationInputSchema,
  WishocracyAggregationSnapshotSchema,
  type CreateWishocracyAggregationInput,
  type StoredSnapshotUpload,
  type WishocracyAggregationSnapshot,
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

export function createAggregationSnapshot(
  input: CreateWishocracyAggregationInput,
): WishocracyAggregationSnapshot {
  const parsed = CreateWishocracyAggregationInputSchema.parse(input);
  return WishocracyAggregationSnapshotSchema.parse({
    ...parsed,
    type: 'wishocracy-aggregation',
    timestamp: parsed.timestamp ?? nowIso(),
  });
}

export async function storeAggregation(
  client: StorachaUploadClient,
  input: CreateWishocracyAggregationInput,
): Promise<StoredSnapshotUpload<WishocracyAggregationSnapshot>> {
  const snapshot = createAggregationSnapshot(input);
  const cid = await uploadJson(client, snapshot);
  return { cid, snapshot };
}

export async function storeLinkedAggregation(
  client: StorachaUploadClient & StorachaListClient,
  input: CreateWishocracyAggregationInput,
  fetchImpl: typeof fetch = fetch,
): Promise<StoredSnapshotUpload<WishocracyAggregationSnapshot>> {
  const latestSnapshot = input.previousCid
    ? null
    : await findLatestStoredSnapshot(client, fetchImpl, {
      jurisdictionId: input.jurisdictionId,
      type: 'wishocracy-aggregation',
    });

  return storeAggregation(client, {
    ...input,
    previousCid: input.previousCid ?? latestSnapshot?.cid,
  });
}
