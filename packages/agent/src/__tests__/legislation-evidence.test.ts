import { describe, expect, it } from 'vitest';
import {
  getLegislationEvidenceCitation,
  getLegislationEvidenceParameter,
  renderLegislationEvidenceBundle,
  synthesizeLegislationEvidenceBundle,
} from '../legislation-evidence.js';
import type { StructuredReasoner } from '../types.js';

describe('legislation evidence bundle', () => {
  it('hydrates validated parameter and citation refs from synthesis output', async () => {
    const reasoner: StructuredReasoner = {
      async generateObject(request) {
        return request.parse({
          summary: 'NIH allocates too little toward the most decision-useful trial activity.',
          missingEvidence: ['Need a cleaner direct estimate of pragmatic-trial share within NIH.'],
          rejectedIdeas: ['Assume every NIH dollar can be switched immediately without constraints.'],
          insights: [
            {
              title: 'Clinical trials are a small slice of NIH',
              claim: 'Only a small share of the NIH budget is allocated to clinical trials at all.',
              whyItMatters: 'Portfolio composition may be more important than topline appropriation.',
              policyImplication: 'A bill should reallocate existing NIH funds before arguing for new money.',
              derivation: 'Use NIH_CLINICAL_TRIALS_SPENDING_PCT alongside NIH_ANNUAL_BUDGET.',
              parameterRefs: ['NIH_CLINICAL_TRIALS_SPENDING_PCT', 'NIH_ANNUAL_BUDGET'],
              citationRefs: ['nih-clinical-trials-spending-pct-3-3'],
              implementationIdeas: ['Create a minimum portfolio share for pragmatic trials.'],
              counterarguments: ['Basic science still matters for long-run discovery.'],
              openQuestions: ['What transition constraints should apply to institute-level budgets?'],
              novelty: 'high',
              confidence: 'high',
            },
            {
              title: 'Pragmatic evidence generation can be radically cheaper',
              claim: 'Embedded pragmatic trials can generate real-world evidence at much lower cost per patient.',
              whyItMatters: 'This changes the efficient frontier for public medical research.',
              policyImplication: 'Shift funding toward embedded and pragmatic trial infrastructure.',
              derivation: 'Compare RECOVERY_TRIAL_COST_REDUCTION_FACTOR with DFDA_PRAGMATIC_TRIAL_COST_PER_PATIENT.',
              parameterRefs: [
                'RECOVERY_TRIAL_COST_REDUCTION_FACTOR',
                'DFDA_PRAGMATIC_TRIAL_COST_PER_PATIENT',
              ],
              citationRefs: ['recovery-trial-82x-cost-reduction'],
              implementationIdeas: ['Create a dedicated pragmatic trials office.'],
              counterarguments: ['Not every research question fits a pragmatic design.'],
              openQuestions: ['Which therapeutic areas should be prioritized first?'],
              novelty: 'high',
              confidence: 'medium',
            },
          ],
        });
      },
    };

    const bundle = await synthesizeLegislationEvidenceBundle({
      objective: 'Optimize NIH legislation around pragmatic clinical trial funding.',
      apiKey: 'test-key',
      reasoner,
    });

    expect(bundle.parameters.map((parameter) => parameter.parameterName)).toEqual([
      'DFDA_PRAGMATIC_TRIAL_COST_PER_PATIENT',
      'NIH_ANNUAL_BUDGET',
      'NIH_CLINICAL_TRIALS_SPENDING_PCT',
      'RECOVERY_TRIAL_COST_REDUCTION_FACTOR',
    ]);
    expect(bundle.citations.map((citation) => citation.id)).toEqual([
      'nih-budget-fy2025',
      'nih-clinical-trials-spending-pct-3-3',
      'pragmatic-trials-cost-advantage',
      'recovery-trial-82x-cost-reduction',
    ]);
    expect(renderLegislationEvidenceBundle(bundle)).toContain('STRUCTURED INTERNAL EVIDENCE BUNDLE');
    expect(renderLegislationEvidenceBundle(bundle)).toContain('RECOVERY_TRIAL_COST_REDUCTION_FACTOR');
  });

  it('rejects unknown parameter refs returned by the synthesizer', async () => {
    const reasoner: StructuredReasoner = {
      async generateObject(request) {
        return request.parse({
          summary: 'Invalid result.',
          missingEvidence: [],
          rejectedIdeas: [],
          insights: [
            {
              title: 'Bad ref',
              claim: 'This should fail.',
              whyItMatters: 'Validation matters.',
              policyImplication: 'Reject fabricated refs.',
              parameterRefs: ['NOT_A_REAL_PARAMETER'],
              citationRefs: [],
              implementationIdeas: [],
              counterarguments: [],
              openQuestions: [],
              novelty: 'low',
              confidence: 'low',
            },
          ],
        });
      },
    };

    await expect(
      synthesizeLegislationEvidenceBundle({
        objective: 'Test validation.',
        apiKey: 'test-key',
        reasoner,
      }),
    ).rejects.toThrow('Unknown parameter ref');
  });

  it('exposes known parameters and citations directly', () => {
    expect(getLegislationEvidenceParameter('NIH_CLINICAL_TRIALS_SPENDING_PCT')?.value).toBe(0.033);
    expect(getLegislationEvidenceCitation('recovery-trial-82x-cost-reduction')?.title).toContain('RECOVERY');
  });

  it('accepts citation URLs when they resolve to known parameter-backed sources', async () => {
    const reasoner: StructuredReasoner = {
      async generateObject(request) {
        return request.parse({
          summary: 'Use the manual page and source URLs already embedded in the parameter corpus.',
          missingEvidence: [],
          rejectedIdeas: [],
          insights: [
            {
              title: 'IAB-style rent caps',
              claim: 'Residual rents should be explicit, rule-bound, and capped.',
              whyItMatters: 'This constrains hidden privilege and turns lobbying rents into auditable incentive payments.',
              policyImplication: 'Bills should use open, capped outcome contracts rather than opaque discretion.',
              parameterRefs: ['VICTORY_BOND_FUNDING_PCT'],
              citationRefs: ['https://iab.warondisease.org##welfare-analysis'],
              implementationIdeas: ['Cap residual upside and disclose all payout formulas.'],
              counterarguments: ['Poorly designed caps could still invite gaming.'],
              openQuestions: ['What is the right cap level?'],
              novelty: 'medium',
              confidence: 'estimated',
            },
          ],
        });
      },
    };

    const bundle = await synthesizeLegislationEvidenceBundle({
      objective: 'Test URL-backed citation refs.',
      apiKey: 'test-key',
      reasoner,
    });

    expect(bundle.parameters.some((parameter) => parameter.parameterName === 'VICTORY_BOND_FUNDING_PCT')).toBe(true);
  });
});
