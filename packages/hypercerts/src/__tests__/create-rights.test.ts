import { describe, expect, it } from 'vitest';
import { createRightsRecord } from '../create-rights.js';

describe('create-rights', () => {
  it('creates a rights record', () => {
    const record = createRightsRecord({
      rightsName: 'CC BY 4.0',
      rightsType: 'CC-BY',
      rightsDescription: 'Reusable with attribution',
      attachmentUri: 'https://example.com/license',
      createdAt: '2026-03-11T00:00:00.000Z',
    });

    expect(record.$type).toBe('org.hypercerts.claim.rights');
    expect(record.attachment).toEqual({ uri: 'https://example.com/license' });
  });
});
