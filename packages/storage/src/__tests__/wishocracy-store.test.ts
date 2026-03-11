import { describe, expect, it, vi } from 'vitest';
import {
  createAggregationSnapshot,
  storeAggregation,
  storeLinkedAggregation,
} from '../wishocracy-store.js';

describe('wishocracy-store', () => {
  it('creates linked aggregation snapshots', () => {
    const snapshot = createAggregationSnapshot({
      jurisdictionId: 'us-federal',
      participantCount: 265,
      preferenceWeights: [
        {
          itemId: 'clinical-trials',
          weight: 0.292,
          label: 'Pragmatic Clinical Trials',
        },
      ],
      consistencyRatio: 0.04,
      convergenceAnalysis: {
        stable: true,
        minComparisonsNeeded: 18,
      },
      previousCid: 'bafyprevious',
    });

    expect(snapshot.type).toBe('wishocracy-aggregation');
    expect(snapshot.previousCid).toBe('bafyprevious');
    expect(snapshot.timestamp).toMatch(/^2026|^20/);
  });

  it('stores aggregation snapshots via the upload client', async () => {
    const client = {
      uploadFile: vi.fn().mockResolvedValue('bafyaggregation'),
    };

    const result = await storeAggregation(client, {
      jurisdictionId: 'us-federal',
      participantCount: 3,
      preferenceWeights: [{ itemId: 'rd', weight: 0.5 }],
    });

    expect(result.cid).toBe('bafyaggregation');
    expect(result.snapshot.type).toBe('wishocracy-aggregation');
    expect(client.uploadFile).toHaveBeenCalledTimes(1);
  });

  it('auto-links aggregation snapshots to the latest snapshot for the same jurisdiction', async () => {
    const client = {
      capability: {
        upload: {
          list: vi.fn().mockResolvedValue({
            results: [
              { root: { toString: () => 'bafy-older' } },
              { root: { toString: () => 'bafy-latest' } },
            ],
          }),
        },
      },
      uploadFile: vi.fn().mockResolvedValue('bafy-next'),
    };
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          type: 'wishocracy-aggregation',
          timestamp: '2026-03-10T00:00:00.000Z',
          jurisdictionId: 'us-federal',
          participantCount: 2,
          preferenceWeights: [],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          type: 'wishocracy-aggregation',
          timestamp: '2026-03-11T00:00:00.000Z',
          jurisdictionId: 'us-federal',
          participantCount: 3,
          preferenceWeights: [],
          previousCid: 'bafy-older',
        }),
      });

    const result = await storeLinkedAggregation(
      client,
      {
        jurisdictionId: 'us-federal',
        participantCount: 4,
        preferenceWeights: [{ itemId: 'rd', weight: 0.5 }],
      },
      fetchImpl as typeof fetch,
    );

    expect(result.snapshot.previousCid).toBe('bafy-latest');
    expect(result.cid).toBe('bafy-next');
  });
});
