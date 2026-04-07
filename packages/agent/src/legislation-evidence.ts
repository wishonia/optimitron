import { z } from 'zod';
import {
  citations as parameterCitations,
  parameters as parameterCorpus,
  type Citation,
} from '@optimitron/data/parameters';
import { createGeminiReasoner, resolveGeminiApiKey } from './gemini.js';
import type { StructuredReasoner } from './types.js';

const DEFAULT_LEGISLATION_EVIDENCE_MODEL =
  process.env['LEGISLATION_EVIDENCE_MODEL'] ?? 'gemini-3.1-pro-preview';

const MAX_PARAMETER_DESCRIPTION_LENGTH = 320;

export interface LegislationEvidenceContext {
  categoryName?: string;
  categoryId?: string;
  targetJurisdiction?: string;
  overspendRatio?: number;
  rank?: number;
  totalCountries?: number;
  modelCountry?: string;
  outcomeName?: string;
  spendingPerCapita?: number;
  floorSpendingPerCapita?: number;
  potentialSavingsTotal?: number;
  relatedPolicies?: Array<{
    policyName: string;
    recommendationType: string;
    evidenceGrade?: string;
    rationale?: string;
  }>;
}

export interface SynthesizeLegislationEvidenceOptions {
  objective: string;
  context?: LegislationEvidenceContext;
  apiKey?: string;
  model?: string;
  maxInsights?: number;
  reasoner?: StructuredReasoner;
}

export interface LegislationEvidenceParameter {
  parameterName: string;
  displayName: string;
  value: number;
  unit?: string;
  description?: string;
  sourceType?: string;
  confidence?: string;
  sourceRef?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  formula?: string;
  confidenceInterval?: [number, number];
  manualPageTitle?: string;
  manualPageUrl?: string;
}

export interface LegislationEvidenceCitation {
  id: string;
  title: string;
  url?: string;
  note?: string;
  publisher?: string;
  containerTitle?: string;
  issuedYear?: number;
}

export interface LegislationEvidenceInsight {
  title: string;
  claim: string;
  whyItMatters: string;
  policyImplication: string;
  derivation?: string;
  parameterRefs: string[];
  citationRefs: string[];
  implementationIdeas: string[];
  counterarguments: string[];
  openQuestions: string[];
  novelty: 'high' | 'medium' | 'low';
  confidence: 'high' | 'medium' | 'low' | 'estimated';
}

export interface LegislationEvidenceBundle {
  objective: string;
  generatedAt: string;
  model: string;
  summary: string;
  insights: LegislationEvidenceInsight[];
  missingEvidence: string[];
  rejectedIdeas: string[];
  parameters: LegislationEvidenceParameter[];
  citations: LegislationEvidenceCitation[];
}

const RawInsightSchema = z.object({
  title: z.string().min(1),
  claim: z.string().min(1),
  whyItMatters: z.string().min(1),
  policyImplication: z.string().min(1),
  derivation: z.string().min(1).optional(),
  parameterRefs: z.array(z.string().min(1)).min(1),
  citationRefs: z.array(z.string().min(1)).default([]),
  implementationIdeas: z.array(z.string().min(1)).default([]),
  counterarguments: z.array(z.string().min(1)).default([]),
  openQuestions: z.array(z.string().min(1)).default([]),
  novelty: z.enum(['high', 'medium', 'low']),
  confidence: z.enum(['high', 'medium', 'low', 'estimated']),
});

const RawEvidenceBundleSchema = z.object({
  summary: z.string().min(1),
  insights: z.array(RawInsightSchema).min(1),
  missingEvidence: z.array(z.string().min(1)).default([]),
  rejectedIdeas: z.array(z.string().min(1)).default([]),
});

const EVIDENCE_BUNDLE_JSON_SCHEMA: Record<string, unknown> = {
  type: 'object',
  required: ['summary', 'insights', 'missingEvidence', 'rejectedIdeas'],
  additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    missingEvidence: {
      type: 'array',
      items: { type: 'string' },
    },
    rejectedIdeas: {
      type: 'array',
      items: { type: 'string' },
    },
    insights: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'title',
          'claim',
          'whyItMatters',
          'policyImplication',
          'parameterRefs',
          'citationRefs',
          'implementationIdeas',
          'counterarguments',
          'openQuestions',
          'novelty',
          'confidence',
        ],
        properties: {
          title: { type: 'string' },
          claim: { type: 'string' },
          whyItMatters: { type: 'string' },
          policyImplication: { type: 'string' },
          derivation: { type: 'string' },
          parameterRefs: {
            type: 'array',
            minItems: 1,
            items: { type: 'string' },
          },
          citationRefs: {
            type: 'array',
            items: { type: 'string' },
          },
          implementationIdeas: {
            type: 'array',
            items: { type: 'string' },
          },
          counterarguments: {
            type: 'array',
            items: { type: 'string' },
          },
          openQuestions: {
            type: 'array',
            items: { type: 'string' },
          },
          novelty: {
            type: 'string',
            enum: ['high', 'medium', 'low'],
          },
          confidence: {
            type: 'string',
            enum: ['high', 'medium', 'low', 'estimated'],
          },
        },
      },
    },
  },
};

function truncateDescription(description?: string): string | undefined {
  if (!description) {
    return undefined;
  }

  if (description.length <= MAX_PARAMETER_DESCRIPTION_LENGTH) {
    return description;
  }

  return `${description.slice(0, MAX_PARAMETER_DESCRIPTION_LENGTH - 3)}...`;
}

function toIssuedYear(citation: Citation): number | undefined {
  return citation.issued?.['date-parts']?.[0]?.[0];
}

function getCorpusParameters(): LegislationEvidenceParameter[] {
  return Object.entries(parameterCorpus)
    .map(([parameterName, parameter]) => {
      const sourceCitation = parameter.sourceRef
        ? parameterCitations[parameter.sourceRef]
        : undefined;

      return {
        parameterName,
        displayName: parameter.displayName ?? parameterName,
        value: parameter.value,
        unit: parameter.unit,
        description: truncateDescription(parameter.description),
        sourceType: parameter.sourceType,
        confidence: parameter.confidence,
        sourceRef: parameter.sourceRef,
        sourceUrl: parameter.sourceUrl ?? sourceCitation?.URL,
        sourceTitle: sourceCitation?.title,
        formula: parameter.formula,
        confidenceInterval: parameter.confidenceInterval,
        manualPageTitle: parameter.manualPageTitle,
        manualPageUrl: parameter.manualPageUrl,
      };
    })
    .sort((left, right) => left.parameterName.localeCompare(right.parameterName));
}

function getCorpusParameterMap(): Map<string, LegislationEvidenceParameter> {
  return new Map(
    getCorpusParameters().map((parameter) => [parameter.parameterName, parameter]),
  );
}

function serializeContext(context?: LegislationEvidenceContext): string {
  if (!context) {
    return 'No additional category-specific context provided.';
  }

  return JSON.stringify(context, null, 2);
}

function buildCorpusPrompt(parameterList: LegislationEvidenceParameter[]): string {
  return parameterList
    .map((parameter) => JSON.stringify(parameter))
    .join('\n');
}

function normalizeReferenceUrl(value: string): string {
  return value
    .trim()
    .replace(/##+/g, '#')
    .replace(/\/+$/g, '');
}

function assertKnownReferences(
  insights: z.infer<typeof RawInsightSchema>[],
  parameterMap: Map<string, LegislationEvidenceParameter>,
): { parameterNames: string[]; citationIds: string[] } {
  const parameterNames = new Set<string>();
  const citationIds = new Set<string>();
  const parameterBackedUrls = new Set<string>();
  const citationIdByUrl = new Map<string, string>();

  for (const [citationId, citation] of Object.entries(parameterCitations)) {
    if (citation.URL) {
      citationIdByUrl.set(normalizeReferenceUrl(citation.URL), citationId);
    }
  }

  for (const insight of insights) {
    for (const parameterRef of insight.parameterRefs) {
      const parameter = parameterMap.get(parameterRef);
      if (!parameter) {
        throw new Error(`Unknown parameter ref returned by evidence synthesis: ${parameterRef}`);
      }

      parameterNames.add(parameterRef);

      if (parameter.sourceRef) {
        citationIds.add(parameter.sourceRef);
      }

      if (parameter.sourceUrl) {
        parameterBackedUrls.add(normalizeReferenceUrl(parameter.sourceUrl));
      }

      if (parameter.manualPageUrl) {
        parameterBackedUrls.add(normalizeReferenceUrl(parameter.manualPageUrl));
      }
    }

    for (const citationRef of insight.citationRefs) {
      if (citationRef in parameterCitations) {
        citationIds.add(citationRef);
        continue;
      }

      const normalizedCitationRef = normalizeReferenceUrl(citationRef);
      const matchedCitationId = citationIdByUrl.get(normalizedCitationRef);

      if (matchedCitationId) {
        citationIds.add(matchedCitationId);
        continue;
      }

      if (parameterBackedUrls.has(normalizedCitationRef)) {
        continue;
      }

      if (!/^https?:\/\//i.test(citationRef)) {
        throw new Error(`Unknown citation ref returned by evidence synthesis: ${citationRef}`);
      }
    }
  }

  return {
    parameterNames: [...parameterNames].sort(),
    citationIds: [...citationIds].sort(),
  };
}

function toCitationSummary(citationId: string): LegislationEvidenceCitation {
  const citation = parameterCitations[citationId];

  if (!citation) {
    return {
      id: citationId,
      title: citationId,
      url: /^https?:\/\//i.test(citationId) ? citationId : undefined,
    };
  }

  return {
    id: citationId,
    title: citation.title,
    url: citation.URL,
    note: citation.note,
    publisher: citation.publisher,
    containerTitle: citation['container-title'],
    issuedYear: toIssuedYear(citation),
  };
}

function buildSynthesisPrompt(
  objective: string,
  context: LegislationEvidenceContext | undefined,
  parameterList: LegislationEvidenceParameter[],
  maxInsights: number,
): string {
  return `You are extracting decision-useful legislative evidence from Optimitron's canonical parameter corpus.

## OBJECTIVE
${objective}

## CONTEXT
${serializeContext(context)}

## TASK
Review the full parameter corpus below and return the most valuable information that should shape legislation for this objective.

Prioritize:
- non-obvious portfolio inversions
- neglected leverage points
- bottlenecks where reallocation dominates net-new spending
- quantified efficiency gaps
- unconventional recommendations that are still defensible from the corpus

Hard rules:
- Use ONLY parameter names that appear in the corpus.
- Use ONLY citation IDs that are implied by those parameter entries.
- If you derive a recommendation, explain the derivation and cite the parameters.
- Distinguish factual observations from normative implications.
- Do NOT invent parameters, citations, URLs, or numbers.
- If the corpus is missing something important, put it in missingEvidence.
- Reject seductive but weak ideas by putting them in rejectedIdeas.
- Return between 4 and ${maxInsights} insight cards.

## PARAMETER CORPUS
${buildCorpusPrompt(parameterList)}`;
}

export async function synthesizeLegislationEvidenceBundle(
  options: SynthesizeLegislationEvidenceOptions,
): Promise<LegislationEvidenceBundle> {
  const parameterList = getCorpusParameters();
  const parameterMap = new Map(
    parameterList.map((parameter) => [parameter.parameterName, parameter]),
  );
  const maxInsights = options.maxInsights ?? 8;
  const prompt = buildSynthesisPrompt(
    options.objective,
    options.context,
    parameterList,
    maxInsights,
  );

  const runSynthesis = async (
    reasoner: StructuredReasoner,
  ): Promise<z.infer<typeof RawEvidenceBundleSchema>> => reasoner.generateObject({
    schemaName: 'legislation_evidence_bundle',
    prompt,
    responseJsonSchema: EVIDENCE_BUNDLE_JSON_SCHEMA,
    parse(value) {
      return RawEvidenceBundleSchema.parse(value);
    },
  });

  let raw: z.infer<typeof RawEvidenceBundleSchema>;
  const model = options.model ?? DEFAULT_LEGISLATION_EVIDENCE_MODEL;

  if (options.reasoner) {
    raw = await runSynthesis(options.reasoner);
  } else {
    const apiKey = resolveGeminiApiKey(options.apiKey);
    const reasoner = createGeminiReasoner({
      apiKey,
      model,
      temperature: 0.15,
      maxOutputTokens: 4096,
    });

    try {
      raw = await runSynthesis(reasoner);
    } catch (error) {
      const shouldRetry =
        error instanceof Error &&
        /function|tool|json|parse|schema/i.test(error.message);

      if (!shouldRetry) {
        throw error;
      }

      raw = await runSynthesis(reasoner);
    }
  }

  const { parameterNames, citationIds } = assertKnownReferences(
    raw.insights,
    parameterMap,
  );

  return {
    objective: options.objective,
    generatedAt: new Date().toISOString(),
    model,
    summary: raw.summary,
    insights: raw.insights,
    missingEvidence: raw.missingEvidence,
    rejectedIdeas: raw.rejectedIdeas,
    parameters: parameterNames
      .map((parameterName) => parameterMap.get(parameterName))
      .filter((parameter): parameter is LegislationEvidenceParameter => Boolean(parameter)),
    citations: citationIds.map(toCitationSummary),
  };
}

function formatParameterCard(parameter: LegislationEvidenceParameter): string {
  const value = parameter.unit
    ? `${parameter.value} ${parameter.unit}`
    : `${parameter.value}`;
  const details = [
    `name=${parameter.parameterName}`,
    `value=${value}`,
    parameter.confidence ? `confidence=${parameter.confidence}` : null,
    parameter.sourceRef ? `sourceRef=${parameter.sourceRef}` : null,
    parameter.sourceTitle ? `sourceTitle=${parameter.sourceTitle}` : null,
    parameter.sourceUrl ? `sourceUrl=${parameter.sourceUrl}` : null,
    parameter.formula ? `formula=${parameter.formula}` : null,
  ].filter(Boolean);

  return `- ${parameter.displayName}: ${details.join(' | ')}`;
}

function formatCitationCard(citation: LegislationEvidenceCitation): string {
  const details = [
    `id=${citation.id}`,
    `title=${citation.title}`,
    citation.url ? `url=${citation.url}` : null,
    citation.issuedYear ? `year=${citation.issuedYear}` : null,
  ].filter(Boolean);

  return `- ${details.join(' | ')}`;
}

export function renderLegislationEvidenceBundle(
  bundle: LegislationEvidenceBundle,
): string {
  const insightLines = bundle.insights.map((insight, index) => [
    `### Insight ${index + 1}: ${insight.title}`,
    `Claim: ${insight.claim}`,
    `Why it matters: ${insight.whyItMatters}`,
    `Policy implication: ${insight.policyImplication}`,
    insight.derivation ? `Derivation: ${insight.derivation}` : null,
    `Parameters: ${insight.parameterRefs.join(', ')}`,
    insight.citationRefs.length > 0
      ? `Citation refs: ${insight.citationRefs.join(', ')}`
      : null,
    insight.counterarguments.length > 0
      ? `Counterarguments: ${insight.counterarguments.join(' | ')}`
      : null,
    insight.openQuestions.length > 0
      ? `Open questions: ${insight.openQuestions.join(' | ')}`
      : null,
  ].filter(Boolean).join('\n'));

  const parameterLines = bundle.parameters.map(formatParameterCard).join('\n');
  const citationLines = bundle.citations.map(formatCitationCard).join('\n');

  return `## STRUCTURED INTERNAL EVIDENCE BUNDLE

Summary: ${bundle.summary}
Objective: ${bundle.objective}
Evidence synthesis model: ${bundle.model}

${insightLines.join('\n\n')}

## Parameter Cards
${parameterLines}

## Citation Cards
${citationLines}

## Missing Evidence
${bundle.missingEvidence.length > 0 ? bundle.missingEvidence.map(item => `- ${item}`).join('\n') : '- none identified'}

## Rejected Ideas
${bundle.rejectedIdeas.length > 0 ? bundle.rejectedIdeas.map(item => `- ${item}`).join('\n') : '- none identified'}`;
}

export function getLegislationEvidenceParameter(
  parameterName: string,
): LegislationEvidenceParameter | undefined {
  return getCorpusParameterMap().get(parameterName);
}

export function getLegislationEvidenceCitation(
  citationId: string,
): LegislationEvidenceCitation | undefined {
  if (!(citationId in parameterCitations)) {
    return undefined;
  }

  return toCitationSummary(citationId);
}
