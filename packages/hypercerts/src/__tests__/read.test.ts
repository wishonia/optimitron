import { describe, expect, it, vi } from 'vitest';
import {
  buildHyperscanDataUrl,
  buildHyperscanGuideUrl,
  buildHyperscanLexiconUrl,
  readHyperscanMarkdown,
} from '../read.js';

describe('read helpers', () => {
  it('builds Hyperscan URLs', () => {
    expect(buildHyperscanLexiconUrl('org.hypercerts.claim.activity')).toBe(
      'https://www.hyperscan.dev/agents/lexicon/org.hypercerts.claim.activity',
    );
    expect(buildHyperscanGuideUrl('create-hypercert')).toBe(
      'https://www.hyperscan.dev/agents/guides/create-hypercert',
    );
    expect(buildHyperscanDataUrl('did:plc:abc', 'org.hypercerts.claim.activity', '123')).toContain(
      'did=did%3Aplc%3Aabc',
    );
  });

  it('reads markdown responses from Hyperscan', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => '# Agent API',
    });

    await expect(
      readHyperscanMarkdown('https://www.hyperscan.dev/agents/page', fetchImpl as typeof fetch),
    ).resolves.toBe('# Agent API');
  });
});
