import { keccak256, toUtf8Bytes } from 'ethers';
import { z } from 'zod';
import type { AgentManifest } from './types.js';
import { HexHashSchema } from './types.js';

export const ZERO_BYTES32 = `0x${'0'.repeat(64)}` as const;

export const Erc8004ServiceSchema = z.object({
  name: z.string().min(1),
  endpoint: z.string().min(1),
  version: z.string().optional(),
  skills: z.array(z.string().min(1)).optional(),
  domains: z.array(z.string().min(1)).optional(),
});

export const Erc8004RegistrationEntrySchema = z.object({
  agentId: z.number().int().nonnegative(),
  agentRegistry: z.string().min(1),
});

export const Erc8004RegistrationFileSchema = z.object({
  type: z.literal('https://eips.ethereum.org/EIPS/eip-8004#registration-v1'),
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1).optional(),
  services: z.array(Erc8004ServiceSchema).min(1),
  x402Support: z.boolean(),
  active: z.boolean(),
  registrations: z.array(Erc8004RegistrationEntrySchema).min(1),
  supportedTrust: z.array(z.string().min(1)).default([]),
});

export type Erc8004RegistrationFile = z.infer<typeof Erc8004RegistrationFileSchema>;

export interface IdentityRegistryContractLike {
  'register(string)'(agentURI: string): Promise<unknown>;
  setAgentURI(agentId: bigint, newURI: string): Promise<unknown>;
}

export interface ReputationRegistryContractLike {
  'giveFeedback(uint256,int128,uint8,string,string,string,string,bytes32)'(
    agentId: bigint,
    value: bigint,
    valueDecimals: number,
    tag1: string,
    tag2: string,
    endpoint: string,
    feedbackURI: string,
    feedbackHash: string,
  ): Promise<unknown>;
}

export const Erc8004FeedbackInputSchema = z.object({
  agentId: z.union([z.bigint(), z.number().int().nonnegative()]),
  value: z.number(),
  valueDecimals: z.number().int().min(0).max(18).default(2),
  tag1: z.string().default('analysis'),
  tag2: z.string().default('quality'),
  endpoint: z.string().default(''),
  feedbackURI: z.string().default(''),
  feedbackHash: HexHashSchema.default(ZERO_BYTES32),
});

export type Erc8004FeedbackInput = z.infer<typeof Erc8004FeedbackInputSchema>;

export function toFeedbackFixedPoint(
  value: number,
  valueDecimals: number,
): bigint {
  const factor = 10 ** valueDecimals;
  return BigInt(Math.round(value * factor));
}

export function buildFeedbackHash(value: unknown): string {
  return HexHashSchema.parse(keccak256(toUtf8Bytes(JSON.stringify(value))));
}

export function createErc8004RegistrationFile(
  manifest: AgentManifest,
  options: {
    agentId: number;
    agentRegistry: string;
    a2aEndpoint?: string;
    description: string;
    image?: string;
    mcpEndpoint?: string;
    webEndpoint?: string;
    x402Support?: boolean;
  },
): Erc8004RegistrationFile {
  const services = [
    options.webEndpoint ? { name: 'web', endpoint: options.webEndpoint } : null,
    options.a2aEndpoint ? { name: 'A2A', endpoint: options.a2aEndpoint, version: '0.3.0' } : null,
    options.mcpEndpoint ? { name: 'MCP', endpoint: options.mcpEndpoint, version: '2025-06-18' } : null,
  ].filter((service): service is NonNullable<typeof service> => service !== null);

  return Erc8004RegistrationFileSchema.parse({
    type: 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1',
    name: manifest.name,
    description: options.description,
    image: options.image,
    services,
    x402Support: options.x402Support ?? false,
    active: true,
    registrations: [
      {
        agentId: options.agentId,
        agentRegistry: options.agentRegistry,
      },
    ],
    supportedTrust: ['reputation'],
  });
}

export async function registerAgentIdentity(
  contract: IdentityRegistryContractLike,
  agentURI: string,
): Promise<unknown> {
  return contract['register(string)'](agentURI);
}

export async function updateAgentUri(
  contract: IdentityRegistryContractLike,
  agentId: bigint | number,
  newURI: string,
): Promise<unknown> {
  return contract.setAgentURI(BigInt(agentId), newURI);
}

export async function giveAgentFeedback(
  contract: ReputationRegistryContractLike,
  input: Erc8004FeedbackInput,
): Promise<unknown> {
  const parsed = Erc8004FeedbackInputSchema.parse(input);
  return contract['giveFeedback(uint256,int128,uint8,string,string,string,string,bytes32)'](
    BigInt(parsed.agentId),
    toFeedbackFixedPoint(parsed.value, parsed.valueDecimals),
    parsed.valueDecimals,
    parsed.tag1,
    parsed.tag2,
    parsed.endpoint,
    parsed.feedbackURI,
    parsed.feedbackHash,
  );
}
