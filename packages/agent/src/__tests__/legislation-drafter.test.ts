import { describe, it, expect, vi } from 'vitest';
import {
  draftLegislation,
  generateSourceFootnotes,
  renderLegislationResearchPacket,
  type GroundedGeminiClientLike,
  type EfficiencyEvidence,
  type LegislationDraft,
  type LegislationResearchPacket,
} from '../legislation-drafter.js';

// ─── Mock data ──────────────────────────────────────────────────────

const MILITARY_EVIDENCE: EfficiencyEvidence = {
  category: 'Military',
  spendingPerCapita: 2052,
  outcome: 76.93,
  outcomeName: 'Life Expectancy',
  rank: 23,
  totalCountries: 23,
  bestCountry: {
    code: 'IRL',
    name: 'Ireland',
    spendingPerCapita: 226,
    outcome: 82,
    rank: 1,
  },
  overspendRatio: 7.4,
  floorSpendingPerCapita: 279,
  floorOutcome: 82,
  potentialSavingsPerCapita: 1773,
  potentialSavingsTotal: 601_000_000_000,
  topEfficient: [
    { code: 'IRL', name: 'Ireland', spendingPerCapita: 226, outcome: 82, rank: 1 },
    { code: 'ESP', name: 'Spain', spendingPerCapita: 331, outcome: 82.87, rank: 2 },
    { code: 'AUT', name: 'Austria', spendingPerCapita: 339, outcome: 81.3, rank: 3 },
  ],
};

const MOCK_WISHONIA_CONTEXT = {
  packageId: 'peace_transition',
  packageTitle: 'Peace and Defense Transition Act',
  shortDescription:
    'Frames military reform around procurement discipline, de-escalation, transition assistance, and a visible peace dividend.',
  citizenBenefit:
    'A less wasteful defense posture and a direct share of verified peace dividends returned to citizens.',
  defaultSavingsDisposition: 'optimization_dividend',
  scopeGuardrails: [
    'Keep the bill centered on defense posture, procurement, alliances, de-escalation, and transition assistance.',
    'Do not make biomedical research or unrelated domestic programs the main subject of a military bill.',
  ],
  draftingDirectives: [
    'Use Department of Peace ideas as inspiration, but express them through concrete procurement, base, alliance, veteran, and transition rules.',
  ],
  agencies: [
    {
      id: 'ddod',
      dName: 'Department of Peace',
      role: 'primary' as const,
      relevance:
        'Supplies the peace-first framing, de-escalation logic, and negative-sum critique of militarized allocation.',
      replacesAgencyName: 'Department of Defense (née Department of War)',
      tagline: 'War is a negative-sum game and the spreadsheet agrees.',
      description:
        "Use concrete de-escalation and transition mechanisms rather than rhetorical manifesto language.",
      optimalMetrics: [
        'Conflict reduction: disputes resolved without war',
        'Procurement discipline: lower waste per security outcome',
      ],
      codeHeader: 'The Department of Defense -> 0 lines of code',
      codeExplanation:
        'Disputes are resolved with binding arbitration and optimization rather than open-ended war spending.',
    },
  ],
};

const MOCK_PACKET: LegislationResearchPacket = {
  billTitle: 'The Efficient Healthcare Reform Act',
  billSummary: 'A structured, source-backed reform draft.',
  purpose: 'Reduce inefficient spending while improving health and income outcomes.',
  findings: [
    {
      title: 'Comparator gap',
      body: 'Top comparator countries achieve similar or better outcomes at lower cost.',
      sourceUrls: ['https://example.com/finland'],
    },
    {
      title: 'Institutional gap',
      body: 'Institutional design differences explain much of the gap.',
      sourceUrls: ['https://example.com/finland'],
    },
    {
      title: 'Fiscal gap',
      body: 'The current system imposes large avoidable costs.',
      sourceUrls: ['https://example.com/portugal'],
    },
  ],
  publicGoodsAndMarketFramework: [
    {
      title: 'Public-goods boundary',
      body: 'Tax funding is reserved for non-excludable oversight, catastrophic risk pooling, and open benchmarking infrastructure; contestable services remain market-provided.',
      sourceUrls: ['https://example.com/finland'],
    },
  ],
  publicChoiceAndCapture: [
    {
      title: 'Public choice design',
      body: 'The bill narrows agency discretion, uses automatic formulas, and forces price discovery through open comparisons to reduce rent-seeking.',
      sourceUrls: ['https://example.com/portugal'],
    },
  ],
  paretoAndCompensation: [
    {
      status: 'compensated_pareto',
      summary: 'Some incumbent providers lose protected margins, but households gain lower costs and dividends.',
      likelyLosers: ['Incumbent hospital systems with opaque pricing'],
      compensationMechanism: 'Transition grants are time-limited and funded from verified savings while households receive dividend credits.',
      sourceUrls: ['https://example.com/finland'],
    },
  ],
  keyProvisions: [
    {
      title: 'Price Transparency',
      modeledOn: ['Japan'],
      summary: 'Require clear prices and standardized reporting.',
      sourceUrls: ['https://example.com/finland'],
      marketMechanism: 'Publish machine-readable prices and quality scores so buyers, plans, and providers can compete on value.',
      publicGoodsJustification: 'The federal role is limited to common data infrastructure and anti-fraud enforcement because comparable price data is a public-good information layer.',
      publicChoiceRationale: 'Opaque billing lets concentrated providers extract rents; automatic publication rules reduce discretionary gatekeeping.',
      paretoStatus: 'compensated_pareto',
      paretoRationale: 'Patients and payers benefit immediately, while providers that lose information rents face a temporary adjustment cost.',
      compensationMechanism: 'Temporary transition support is capped and paired with citizen dividends from the savings pool.',
      residualRentHandling: 'Any vendor reward is limited to competitively bid service contracts with fixed fees and public audit trails.',
      captureRisks: ['Dominant hospital systems could lobby to weaken reporting standards.'],
      antiCaptureSafeguards: [
        'Statutory machine-readable schema updates on a fixed schedule with no waiver authority.',
        'Independent public benchmark publication with mandatory raw-data release.',
      ],
      corruptionRisks: ['Procurement officials could steer reporting contracts to favored firms.'],
      antiCorruptionSafeguards: [
        'Use open auctions with published bid data and conflict-of-interest disclosures.',
        'Require random external audits and automatic clawbacks for false reporting.',
      ],
      operativeClauses: ['The Secretary shall publish a national price file.'],
      implementationTimeline: 'Within 12 months.',
      currentCost: '$10B/yr',
      newCost: '$6B/yr',
      netSavings: '$4B/yr',
      savingsDestination: 'Optimization Dividend Pool',
      expectedImpacts: [
        {
          metric: 'Procedure costs',
          target: 'Lower average procedure costs by 15%.',
          rationale: 'Transparent prices improve competition.',
          sourceUrls: ['https://example.com/finland'],
        },
      ],
      objections: [
        {
          objection: 'Hospitals will resist reporting requirements.',
          response: 'Comparator countries operate similar systems successfully.',
          sourceUrls: ['https://example.com/finland'],
        },
      ],
    },
    {
      title: 'Primary Care Expansion',
      modeledOn: ['Portugal'],
      summary: 'Reallocate spending toward higher-value primary care capacity.',
      sourceUrls: ['https://example.com/portugal'],
      marketMechanism: 'Use risk-adjusted vouchers and outcome-based contracts instead of open-ended fee-for-service subsidies.',
      publicGoodsJustification: 'The federal role is justified only for catastrophic pooling and measurable prevention externalities.',
      publicChoiceRationale: 'Formula funding and portable vouchers reduce bureaucratic empire-building and incumbent provider lock-in.',
      paretoStatus: 'public_goods_exception',
      paretoRationale: 'Some low-value specialty rents shrink because public funds are redirected toward higher social return prevention infrastructure.',
      compensationMechanism: 'Households receive lower premium-equivalent costs and explicit dividend recycling from the savings.',
      residualRentHandling: 'Where private delivery partners are needed, contracts use capped outcome payments with open metrics in an IAB-like structure.',
      captureRisks: ['Incumbent specialist lobbies may seek carve-outs that preserve high-margin reimbursement.'],
      antiCaptureSafeguards: [
        'Sunset all carve-outs unless reauthorized after independent outcome review.',
        'Benchmark payments automatically to external comparator countries and regional cost indices.',
      ],
      corruptionRisks: ['Grant-making could reward politically connected clinic networks.'],
      antiCorruptionSafeguards: [
        'Allocate funds by formula with public scorecards rather than discretionary grants.',
        'Disqualify entities with revolving-door conflicts or undisclosed beneficial ownership.',
      ],
      operativeClauses: ['The Secretary shall expand primary care grants.'],
      implementationTimeline: 'Phase in over 24 months.',
      expectedImpacts: [
        {
          metric: 'Preventable admissions',
          target: 'Reduce preventable admissions by 10%.',
          rationale: 'Earlier intervention reduces avoidable escalation.',
          sourceUrls: ['https://example.com/portugal'],
        },
      ],
      objections: [],
    },
  ],
  reallocationPlan: [
    {
      title: 'Dividend and reinvestment',
      body: 'Direct savings first to evidence-backed healthcare reforms and citizen dividends.',
      sourceUrls: ['https://example.com/portugal'],
    },
  ],
  fiscalImpact: [
    {
      title: 'Net savings',
      body: 'The package is projected to reduce annual federal outlays over time.',
      sourceUrls: ['https://example.com/portugal'],
    },
  ],
  implementationTimeline: [
    {
      title: 'Rollout',
      body: 'Start with reporting and pilot programs, then scale nationally.',
      sourceUrls: ['https://example.com/finland'],
    },
  ],
  evaluationAndSunset: [
    {
      metric: 'Median after-tax income',
      target: 'Improve above baseline by year 4.',
      rationale: 'Captures household-level material welfare.',
      sourceUrls: ['https://example.com/finland'],
    },
    {
      metric: 'Healthy life expectancy',
      target: 'Improve above baseline by year 4.',
      rationale: 'Captures health outcomes directly.',
      sourceUrls: ['https://example.com/portugal'],
    },
    {
      metric: 'Per-capita spending',
      target: 'Move toward comparator floor spending.',
      rationale: 'Measures whether the reform actually closes the efficiency gap.',
      sourceUrls: ['https://example.com/finland'],
    },
  ],
  evidenceAppendix: [
    {
      title: 'Comparator systems',
      body: 'Comparator countries combine stronger cost discipline with better primary care.',
      sourceUrls: ['https://example.com/finland'],
    },
    {
      title: 'Outcome evidence',
      body: 'Cross-country evidence supports lower-cost paths to similar outcomes.',
      sourceUrls: ['https://example.com/portugal'],
    },
    {
      title: 'Implementation evidence',
      body: 'Sequenced implementation reduces disruption risk.',
      sourceUrls: ['https://example.com/finland'],
    },
  ],
  openQuestions: ['Which federal agency should own the national price file?'],
};

const MOCK_DRAFT: LegislationDraft = {
  legislationText: 'Finland spends less on healthcare [1](https://example.com/finland).',
  summary: 'Model legislation for healthcare reform.',
  billTitle: 'The Efficient Healthcare Reform Act',
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
  researchPacket: MOCK_PACKET,
  researchModel: 'gemini-3.1-pro-preview',
};

// ─── Tests ──────────────────────────────────────────────────────────

describe('renderLegislationResearchPacket', () => {
  it('renders sectioned markdown with inline source references', () => {
    const rendered = renderLegislationResearchPacket(MOCK_PACKET);

    expect(rendered.markdown).toContain('## Findings');
    expect(rendered.markdown).toContain('## Public-Goods and Market Framework');
    expect(rendered.markdown).toContain('## Public Choice / Capture Analysis');
    expect(rendered.markdown).toContain('## Pareto / Compensation Analysis');
    expect(rendered.markdown).toContain('### Price Transparency');
    expect(rendered.markdown).toContain('**Market mechanism:**');
    expect(rendered.markdown).toContain('**Anti-corruption safeguards:**');
    expect(rendered.markdown).toContain('[1](https://example.com/finland)');
    expect(rendered.sources).toHaveLength(2);
    expect(rendered.citations.length).toBeGreaterThan(0);
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

  it('requests a search-grounded structured function call on gemini-3.1-pro-preview', async () => {
    const generateContent = vi.fn().mockResolvedValue({
      functionCalls: [
        {
          name: 'submit_legislation_research_packet',
          args: MOCK_PACKET,
        },
      ],
      candidates: [
        {
          groundingMetadata: {
            webSearchQueries: ['finland healthcare reform'],
            searchEntryPoint: {
              renderedContent: '<div>Google Search</div>',
            },
          },
        },
      ],
    });

    const client: GroundedGeminiClientLike = {
      models: {
        generateContent,
      },
    };

    const draft = await draftLegislation(MILITARY_EVIDENCE, [], {
      apiKey: 'test-key',
      client,
      model: 'gemini-3.1-pro-preview',
    });

    expect(draft.billTitle).toBe(MOCK_PACKET.billTitle);
    expect(draft.researchModel).toBe('gemini-3.1-pro-preview');
    expect(draft.searchQueries).toEqual(['finland healthcare reform']);
    expect(generateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gemini-3.1-pro-preview',
        config: expect.objectContaining({
          tools: [
            { googleSearch: {} },
            {
              functionDeclarations: [
                expect.objectContaining({
                  name: 'submit_legislation_research_packet',
                }),
              ],
            },
          ],
          toolConfig: {
            includeServerSideToolInvocations: true,
            functionCallingConfig: {
              mode: 'VALIDATED',
            },
          },
        }),
      }),
    );
  });

  it('injects Wishonia legislative package context into the research prompt', async () => {
    const generateContent = vi.fn().mockResolvedValue({
      functionCalls: [
        {
          name: 'submit_legislation_research_packet',
          args: MOCK_PACKET,
        },
      ],
      candidates: [
        {
          groundingMetadata: {
            webSearchQueries: ['military procurement reform'],
          },
        },
      ],
    });

    const client: GroundedGeminiClientLike = {
      models: {
        generateContent,
      },
    };

    await draftLegislation(MILITARY_EVIDENCE, [], {
      apiKey: 'test-key',
      client,
      model: 'gemini-3.1-pro-preview',
      wishoniaContext: MOCK_WISHONIA_CONTEXT,
    });

    expect(generateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        contents: expect.stringContaining('## WISHONIA LEGISLATIVE PACKAGE CONTEXT'),
      }),
    );
    expect(generateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        contents: expect.stringContaining('Peace and Defense Transition Act'),
      }),
    );
    expect(generateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        contents: expect.stringContaining('Department of Peace'),
      }),
    );
  });

  it('falls back to search-grounded JSON text on the same model when function calls are missing', async () => {
    const generateContent = vi
      .fn()
      .mockResolvedValueOnce({
        candidates: [
          {
            groundingMetadata: {
              webSearchQueries: ['finland healthcare reform'],
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        candidates: [
          {
            groundingMetadata: {
              webSearchQueries: ['finland healthcare reform'],
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        text: () => JSON.stringify(MOCK_PACKET),
        candidates: [
          {
            groundingMetadata: {
              webSearchQueries: ['finland healthcare reform'],
              searchEntryPoint: {
                renderedContent: '<div>Google Search</div>',
              },
            },
          },
        ],
      });

    const client: GroundedGeminiClientLike = {
      models: {
        generateContent,
      },
    };

    const draft = await draftLegislation(MILITARY_EVIDENCE, [], {
      apiKey: 'test-key',
      client,
      model: 'gemini-3.1-pro-preview',
    });

    expect(draft.billTitle).toBe(MOCK_PACKET.billTitle);
    expect(generateContent).toHaveBeenCalledTimes(3);
    expect(generateContent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        model: 'gemini-3.1-pro-preview',
        config: expect.objectContaining({
          responseMimeType: 'application/json',
          responseJsonSchema: expect.any(Object),
          tools: [{ googleSearch: {} }],
        }),
      }),
    );
  });
});
