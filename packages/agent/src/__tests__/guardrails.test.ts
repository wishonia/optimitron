import { describe, expect, it } from 'vitest';
import {
  assertSufficientData,
  createGuardrailState,
  ensureRuntimeRemaining,
  hasSufficientData,
  recordApiCall,
  reserveAnalysisSlot,
  validateAgentRunInput,
} from '../guardrails.js';
import { createAgentManifest } from '../manifest.js';

const baseArtifact = {
  target: {
    itemId: 'preventive-care',
    itemName: 'Preventive Care',
    preferredPct: 0.28,
    actualPct: 0.11,
    gapPct: 0.17,
    availableDataSources: ['oecd', 'world-bank'],
    rationale: 'Large gap with public data coverage.',
  },
  policyName: 'Preventive Care Reallocation',
  recommendation: 'enact' as const,
  participantCount: 200,
  sourceUrls: ['https://example.com/report'],
  rawMetrics: {
    pis: 0.88,
  },
  qualityChecks: {
    sufficientData: true,
    predictorDataPoints: 40,
    outcomeDataPoints: 40,
    alignedPairs: 35,
    evidenceSources: 3,
    notes: [],
  },
};

describe('guardrails', () => {
  it('validates run input and applies defaults', () => {
    const parsed = validateAgentRunInput({
      jurisdictionId: 'us-federal',
      preferenceGaps: [
        {
          itemId: 'preventive-care',
          itemName: 'Preventive Care',
          preferredPct: 0.28,
          actualPct: 0.11,
          gapPct: 0.17,
        },
      ],
    });

    expect(parsed.availableDataSources).toEqual([]);
  });

  it('tracks API, analysis, and runtime caps', () => {
    const state = createGuardrailState(
      createAgentManifest({
        computeConstraints: {
          maxAnalysesPerRun: 1,
          maxAPICallsPerRun: 1,
          timeoutSeconds: 1,
        },
      }).computeConstraints,
      0,
    );

    recordApiCall(state);
    expect(() => recordApiCall(state)).toThrow('API call limit exceeded');

    reserveAnalysisSlot(state);
    expect(() => reserveAnalysisSlot(state)).toThrow(
      'Analysis limit exceeded',
    );

    expect(() => ensureRuntimeRemaining(state, 1001)).toThrow(
      'Runtime limit exceeded',
    );
  });

  it('detects insufficient analysis data', () => {
    expect(hasSufficientData(baseArtifact)).toBe(true);
    expect(() => assertSufficientData(baseArtifact)).not.toThrow();

    const insufficientArtifact = {
      ...baseArtifact,
      qualityChecks: {
        ...baseArtifact.qualityChecks,
        sufficientData: false,
      },
    };

    expect(hasSufficientData(insufficientArtifact)).toBe(false);
    expect(() => assertSufficientData(insufficientArtifact)).toThrow(
      'Insufficient data for autonomous analysis',
    );
  });
});
