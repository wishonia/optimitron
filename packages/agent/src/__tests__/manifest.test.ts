import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  createAgentManifest,
  DEFAULT_AGENT_MANIFEST,
  validateAgentManifest,
} from '../manifest.js';

describe('manifest', () => {
  it('creates manifests with merged overrides', () => {
    const manifest = createAgentManifest({
      version: '1.2.3',
      computeConstraints: {
        maxAnalysesPerRun: 3,
        maxAPICallsPerRun:
          DEFAULT_AGENT_MANIFEST.computeConstraints.maxAPICallsPerRun,
        timeoutSeconds:
          DEFAULT_AGENT_MANIFEST.computeConstraints.timeoutSeconds,
      },
    });

    expect(manifest.version).toBe('1.2.3');
    expect(manifest.computeConstraints.maxAnalysesPerRun).toBe(3);
    expect(manifest.supportedTools).toContain('google-gemini-image-generation');
    expect(manifest.computeConstraints.maxAPICallsPerRun).toBe(
      DEFAULT_AGENT_MANIFEST.computeConstraints.maxAPICallsPerRun,
    );
  });

  it('validates the checked-in agent manifest fixture', async () => {
    const raw = await readFile(
      new URL('../../agent.json', import.meta.url),
      'utf8',
    );

    expect(validateAgentManifest(JSON.parse(raw))).toEqual(
      DEFAULT_AGENT_MANIFEST,
    );
  });

  it('rejects invalid manifest values', () => {
    expect(() =>
      validateAgentManifest({
        ...DEFAULT_AGENT_MANIFEST,
        operatorWallet: 'not-a-wallet',
      }),
    ).toThrow();
  });
});
