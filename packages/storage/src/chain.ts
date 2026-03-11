import {
  findLatestStoredSnapshot,
  retrieveStoredSnapshot,
  type StorachaListClient,
  type StoredSnapshotFilter,
} from './client.js';
import type { StoredSnapshot, StoredSnapshotUpload } from './types.js';

export interface VerifiedSnapshotUpload<TSnapshot extends StoredSnapshot = StoredSnapshot>
  extends StoredSnapshotUpload<TSnapshot> {
  depth: number;
}

export interface SnapshotChainVerification {
  errors: string[];
  records: VerifiedSnapshotUpload[];
  valid: boolean;
}

export async function getLatest(
  client: StorachaListClient,
  fetchImpl: typeof fetch = fetch,
  filter: StoredSnapshotFilter = {},
): Promise<string | null> {
  return (await findLatestStoredSnapshot(client, fetchImpl, filter))?.cid ?? null;
}

export async function getHistory(
  latestCid: string,
  depth: number,
  fetchImpl: typeof fetch = fetch,
): Promise<string[]> {
  const history: string[] = [];
  const visited = new Set<string>();
  let currentCid: string | undefined = latestCid;

  while (currentCid && history.length < depth) {
    if (visited.has(currentCid)) {
      break;
    }

    visited.add(currentCid);
    history.push(currentCid);
    const snapshot = await retrieveStoredSnapshot(currentCid, fetchImpl);
    currentCid = snapshot.previousCid;
  }

  return history;
}

export async function verifyHistoryChain(
  latestCid: string,
  depth: number,
  fetchImpl: typeof fetch = fetch,
  filter: StoredSnapshotFilter = {},
): Promise<SnapshotChainVerification> {
  const errors: string[] = [];
  const records: VerifiedSnapshotUpload[] = [];
  const visited = new Set<string>();
  let currentCid: string | undefined = latestCid;

  while (currentCid && records.length < depth) {
    if (visited.has(currentCid)) {
      errors.push(`Cycle detected at CID ${currentCid}`);
      break;
    }

    visited.add(currentCid);
    const snapshot = await retrieveStoredSnapshot(currentCid, fetchImpl);
    records.push({ cid: currentCid, depth: records.length, snapshot });

    if (filter.type && snapshot.type !== filter.type) {
      errors.push(`Snapshot ${currentCid} has type ${snapshot.type}, expected ${filter.type}`);
    }

    if (filter.jurisdictionId && snapshot.jurisdictionId !== filter.jurisdictionId) {
      errors.push(
        `Snapshot ${currentCid} has jurisdiction ${snapshot.jurisdictionId}, expected ${filter.jurisdictionId}`,
      );
    }

    currentCid = snapshot.previousCid;
  }

  for (let index = 1; index < records.length; index += 1) {
    const newer = records[index - 1];
    const older = records[index];

    if (!newer || !older) {
      continue;
    }

    if (new Date(older.snapshot.timestamp).getTime() > new Date(newer.snapshot.timestamp).getTime()) {
      errors.push(
        `Snapshot ${older.cid} is newer than its successor ${newer.cid}`,
      );
    }
  }

  return {
    errors,
    records,
    valid: errors.length === 0,
  };
}
