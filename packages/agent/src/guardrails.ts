import {
  AgentAnalysisArtifactSchema,
  AgentRunInputSchema,
  ComputeConstraintsSchema,
  type AgentAnalysisArtifact,
  type AgentRunInput,
  type ComputeConstraints,
} from './types.js';

export interface GuardrailState {
  analysesUsed: number;
  apiCallsUsed: number;
  startedAtMs: number;
  constraints: ComputeConstraints;
}

export function validateAgentRunInput(input: unknown): AgentRunInput {
  return AgentRunInputSchema.parse(input);
}

export function createGuardrailState(
  constraints: ComputeConstraints,
  startedAtMs: number = Date.now(),
): GuardrailState {
  return {
    analysesUsed: 0,
    apiCallsUsed: 0,
    constraints: ComputeConstraintsSchema.parse(constraints),
    startedAtMs,
  };
}

export function recordApiCall(
  state: GuardrailState,
  count = 1,
): void {
  state.apiCallsUsed += count;
  if (state.apiCallsUsed > state.constraints.maxAPICallsPerRun) {
    throw new Error('API call limit exceeded');
  }
}

export function reserveAnalysisSlot(
  state: GuardrailState,
  count = 1,
): void {
  state.analysesUsed += count;
  if (state.analysesUsed > state.constraints.maxAnalysesPerRun) {
    throw new Error('Analysis limit exceeded');
  }
}

export function ensureRuntimeRemaining(
  state: GuardrailState,
  nowMs: number = Date.now(),
): void {
  const elapsedMs = nowMs - state.startedAtMs;
  if (elapsedMs > state.constraints.timeoutSeconds * 1000) {
    throw new Error('Runtime limit exceeded');
  }
}

export function hasSufficientData(
  artifact: AgentAnalysisArtifact,
): boolean {
  const parsed = AgentAnalysisArtifactSchema.parse(artifact);
  return parsed.qualityChecks.sufficientData;
}

export function assertSufficientData(
  artifact: AgentAnalysisArtifact,
): void {
  if (!hasSufficientData(artifact)) {
    throw new Error('Insufficient data for autonomous analysis');
  }
}
