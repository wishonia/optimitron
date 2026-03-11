import { describe, expect, it, vi } from 'vitest';
import {
  buildFeedbackHash,
  createErc8004RegistrationFile,
  giveAgentFeedback,
  registerAgentIdentity,
  toFeedbackFixedPoint,
  updateAgentUri,
  ZERO_BYTES32,
} from '../erc8004.js';
import { createAgentManifest } from '../manifest.js';

describe('erc8004 helpers', () => {
  it('creates ERC-8004 registration files with declared services', () => {
    const registration = createErc8004RegistrationFile(
      createAgentManifest(),
      {
        agentId: 7,
        agentRegistry: '0x1234',
        description: 'Autonomous public-goods policy analysis agent.',
        webEndpoint: 'https://example.com/agent',
        a2aEndpoint: 'https://example.com/a2a',
        mcpEndpoint: 'https://example.com/mcp',
      },
    );

    expect(registration.registrations[0]).toEqual({
      agentId: 7,
      agentRegistry: '0x1234',
    });
    expect(registration.services.map((service) => service.name)).toEqual([
      'web',
      'A2A',
      'MCP',
    ]);
  });

  it('converts and hashes feedback payloads deterministically', () => {
    expect(toFeedbackFixedPoint(0.815, 2)).toBe(82n);

    const first = buildFeedbackHash({
      score: 0.84,
      uri: 'ipfs://bafyexample',
    });
    const second = buildFeedbackHash({
      score: 0.84,
      uri: 'ipfs://bafyexample',
    });

    expect(first).toBe(second);
    expect(first).toMatch(/^0x[a-f0-9]{64}$/);
  });

  it('calls the identity and reputation registry interfaces correctly', async () => {
    const register = vi.fn().mockResolvedValue({
      hash: '0xregister',
    });
    const setAgentURI = vi.fn().mockResolvedValue({
      hash: '0xset',
    });
    const giveFeedback = vi.fn().mockResolvedValue({
      hash: '0xfeedback',
    });

    await registerAgentIdentity(
      {
        'register(string)': register,
        setAgentURI,
      },
      'ipfs://bafyagent',
    );
    await updateAgentUri(
      {
        'register(string)': register,
        setAgentURI,
      },
      7,
      'ipfs://bafyagent-v2',
    );
    await giveAgentFeedback(
      {
        'giveFeedback(uint256,int128,uint8,string,string,string,string,bytes32)':
          giveFeedback,
      },
      {
        agentId: 7,
        value: 0.84,
        valueDecimals: 2,
      },
    );

    expect(register).toHaveBeenCalledWith('ipfs://bafyagent');
    expect(setAgentURI).toHaveBeenCalledWith(7n, 'ipfs://bafyagent-v2');
    expect(giveFeedback).toHaveBeenCalledWith(
      7n,
      84n,
      2,
      'analysis',
      'quality',
      '',
      '',
      ZERO_BYTES32,
    );
  });
});
