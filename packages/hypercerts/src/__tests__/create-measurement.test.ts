import { describe, expect, it } from 'vitest';
import {
  createMeasurementRecord,
  createPolicyMeasurementRecords,
} from '../create-measurement.js';

const subject = {
  uri: 'at://did:plc:example/org.hypercerts.claim.activity/abc',
  cid: 'bafyclaim',
};

describe('create-measurement', () => {
  it('creates a single measurement record', () => {
    const record = createMeasurementRecord(
      { metric: 'Welfare Score', value: 42, unit: 'points' },
      { subject, createdAt: '2026-03-11T00:00:00.000Z' },
    );

    expect(record.$type).toBe('org.hypercerts.context.measurement');
    expect(record.value).toBe('42');
    expect(record.subjects).toEqual([subject]);
  });

  it('builds the default policy measurement bundle', () => {
    const records = createPolicyMeasurementRecords({
      subject,
      createdAt: '2026-03-11T00:00:00.000Z',
      welfareScore: 40,
      causalConfidenceScore: 0.64,
      evidenceGrade: 'B',
      citizenPreferenceWeight: 0.85,
      governmentAllocationPct: 2,
      preferenceGapPct: 83,
    });

    expect(records).toHaveLength(6);
    expect(records[0]?.metric).toBe('Welfare Score');
    expect(records[4]?.value).toBe('2');
  });
});
