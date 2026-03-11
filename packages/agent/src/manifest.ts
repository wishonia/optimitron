import { AgentManifestSchema, type AgentManifest } from './types.js';

const DEFAULT_MANIFEST = {
  name: 'Optomitron Policy Analyst',
  version: '1.0.0',
  operatorWallet: '0x0000000000000000000000000000000000000000',
  erc8004Identity: 'eip155:11155111:0x0000000000000000000000000000000000000000/0',
  erc8004RegistrationTx: '0x',
  supportedTools: [
    'optomitron-optimizer',
    'optomitron-opg',
    'optomitron-obg',
    'optomitron-data-oecd',
    'optomitron-data-worldbank',
    'optomitron-data-who',
    'google-gemini-reasoning',
    'hypercerts-atproto',
    'storacha-storage',
    'erc8004-identity-registry',
    'erc8004-reputation-registry',
  ],
  supportedTechStack: ['typescript', 'node22', 'gemini', 'atproto', 'storacha', 'erc8004'],
  computeConstraints: {
    maxAnalysesPerRun: 10,
    maxAPICallsPerRun: 100,
    timeoutSeconds: 300,
  },
  supportedTaskCategories: [
    'policy-analysis',
    'budget-optimization',
    'preference-aggregation',
    'impact-attestation',
  ],
} satisfies AgentManifest;

export type AgentManifestOverrides =
  Partial<Omit<AgentManifest, 'computeConstraints'>> & {
    computeConstraints?: Partial<AgentManifest['computeConstraints']>;
  };

export function createAgentManifest(
  overrides: AgentManifestOverrides = {},
): AgentManifest {
  return AgentManifestSchema.parse({
    ...DEFAULT_MANIFEST,
    ...overrides,
    computeConstraints: {
      ...DEFAULT_MANIFEST.computeConstraints,
      ...overrides.computeConstraints,
    },
  });
}

export function validateAgentManifest(manifest: unknown): AgentManifest {
  return AgentManifestSchema.parse(manifest);
}

export const DEFAULT_AGENT_MANIFEST = createAgentManifest();
