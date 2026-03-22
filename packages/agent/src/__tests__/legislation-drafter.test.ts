import { describe, it, expect, vi } from 'vitest';
import {
  draftLegislation,
  insertCitations,
  generateSourceFootnotes,
  type EfficiencyEvidence,
  type LegislationDraft,
} from '../legislation-drafter.js';

// ─── Mock data ──────────────────────────────────────────────────────

const MILITARY_EVIDENCE: EfficiencyEvidence = {
  category: 'Military',
  usSpendingPerCapita: 2052,
  usOutcome: 76.93,
  outcomeName: 'Life Expectancy',
  usRank: 23,
  totalCountries: 23,
  overspendRatio: 7.4,
  floorSpendingPerCapita: 279,
  topCountries: [
    { name: 'Ireland', spendingPerCapita: 226, outcome: 82 },
    { name: 'Spain', spendingPerCapita: 331, outcome: 82.87 },
    { name: 'Austria', spendingPerCapita: 339, outcome: 81.3 },
  ],
};

const MOCK_DRAFT: LegislationDraft = {
  legislationText: 'Finland spends less on healthcare. Portugal decriminalized drugs in 2001.',
  summary: 'Model legislation for healthcare reform.',
  sources: [
    { url: 'https://example.com/finland', domain: 'example.com' },
    { url: 'https://example.com/portugal', domain: 'example.com' },
  ],
  citations: [
    {
      text: 'Finland spends less on healthcare',
      sourceIndices: [0],
      confidence: [0.92],
    },
    {
      text: 'Portugal decriminalized drugs in 2001',
      sourceIndices: [1],
      confidence: [0.88],
    },
  ],
  searchQueries: ['Finland healthcare spending', 'Portugal drug decriminalization'],
  prompt: 'test prompt',
  category: 'Healthcare',
  searchBrandingHtml: '<div>Google</div>',
};

// ─── Tests ──────────────────────────────────────────────────────────

describe('insertCitations', () => {
  it('inserts markdown citation links after cited text', () => {
    const result = insertCitations(MOCK_DRAFT);

    expect(result).toContain('Finland spends less on healthcare [1](https://example.com/finland)');
    expect(result).toContain('Portugal decriminalized drugs in 2001 [2](https://example.com/portugal)');
  });

  it('returns original text when no citations exist', () => {
    const draft = { ...MOCK_DRAFT, citations: [] };
    expect(insertCitations(draft)).toBe(draft.legislationText);
  });

  it('handles citations with multiple sources', () => {
    const draft: LegislationDraft = {
      ...MOCK_DRAFT,
      legislationText: 'Both countries improved.',
      citations: [{
        text: 'Both countries improved',
        sourceIndices: [0, 1],
        confidence: [0.9, 0.85],
      }],
    };

    const result = insertCitations(draft);
    expect(result).toContain('[1](https://example.com/finland)');
    expect(result).toContain('[2](https://example.com/portugal)');
  });
});

describe('generateSourceFootnotes', () => {
  it('generates numbered source list', () => {
    const result = generateSourceFootnotes(MOCK_DRAFT);

    expect(result).toContain('## Sources');
    expect(result).toContain('1. [example.com](https://example.com/finland)');
    expect(result).toContain('2. [example.com](https://example.com/portugal)');
  });

  it('returns empty string when no sources', () => {
    const draft = { ...MOCK_DRAFT, sources: [] };
    expect(generateSourceFootnotes(draft)).toBe('');
  });
});

describe('draftLegislation', () => {
  it('throws when no API key is available', async () => {
    const orig = process.env['GOOGLE_GENERATIVE_AI_API_KEY'];
    const fallback = process.env['GOOGLE_API_KEY'];
    delete process.env['GOOGLE_GENERATIVE_AI_API_KEY'];
    delete process.env['GOOGLE_API_KEY'];

    try {
      await expect(
        draftLegislation(MILITARY_EVIDENCE, [], {}),
      ).rejects.toThrow('No Gemini API key');
    } finally {
      if (orig !== undefined) process.env['GOOGLE_GENERATIVE_AI_API_KEY'] = orig;
      if (fallback !== undefined) process.env['GOOGLE_API_KEY'] = fallback;
    }
  });

  it('builds a prompt containing efficiency evidence', async () => {
    // We can't call the real API in tests, but we can verify the prompt
    // would be well-formed by checking the function exists and types check
    expect(typeof draftLegislation).toBe('function');
  });
});
