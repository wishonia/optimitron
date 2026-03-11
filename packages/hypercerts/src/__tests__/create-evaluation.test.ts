import { describe, expect, it } from 'vitest';
import { createEvaluationRecord } from '../create-evaluation.js';

describe('create-evaluation', () => {
  it('creates evaluation records from aggregated preference weights', () => {
    const record = createEvaluationRecord({
      subject: {
        uri: 'at://did:plc:example/org.hypercerts.claim.activity/abc',
        cid: 'bafyclaim',
      },
      participantCount: 265,
      citizenPreferenceWeight: 0.85,
      governmentAllocationPct: 2,
      preferenceGapPct: 83,
      createdAt: '2026-03-11T00:00:00.000Z',
    });

    expect(record.$type).toBe('org.hypercerts.context.evaluation');
    expect(record.score?.value).toBe(85);
    expect(record.summary).toContain('265 voters');
  });
});
