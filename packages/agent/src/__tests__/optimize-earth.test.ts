import { describe, expect, it } from 'vitest';
import {
  buildOptimizeEarthInstruction,
  OPTIMIZE_EARTH_PROTOCOL_STEPS,
} from '../optimize-earth.js';

describe('optimize earth prompt helpers', () => {
  it('publishes the DB-first protocol steps', () => {
    expect(OPTIMIZE_EARTH_PROTOCOL_STEPS).toContain(
      'Check the current branch or PR for broken GitHub Actions if that information is available.',
    );
    expect(OPTIMIZE_EARTH_PROTOCOL_STEPS).toContain(
      'Call getQueueAudit, then call getNextAction with your capabilities.',
    );
    expect(OPTIMIZE_EARTH_PROTOCOL_STEPS).toContain(
      'Do not create ACTIVE tasks directly; agent-created tasks must start as DRAFT.',
    );
  });

  it('builds an instruction that enforces lease-based work', () => {
    const instruction = buildOptimizeEarthInstruction({
      capabilities: ['typescript', 'policy analysis'],
      maxParallelTasks: 1,
    });

    expect(instruction).toContain(
      'Optimize earth using the task database via MCP as the source of truth.',
    );
    expect(instruction).toContain(
      'First, check the current branch or PR for broken GitHub Actions if that information is available; if repo code is breaking CI, fix that before trusting the queue.',
    );
    expect(instruction).toContain(
      'Advertise these capabilities when calling getNextAction: typescript, policy analysis.',
    );
    expect(instruction).toContain('Hold at most 1 active lease at a time.');
    expect(instruction).toContain('Do not create ACTIVE tasks directly.');
  });

  it('supports custom task source labels and parallelism caps', () => {
    const instruction = buildOptimizeEarthInstruction({
      maxParallelTasks: 2,
      taskSourceLabel: 'Optimitron task DB',
    });

    expect(instruction).toContain('Optimize earth using Optimitron task DB as the source of truth.');
    expect(instruction).toContain('Hold at most 2 active leases at a time.');
    expect(instruction).toContain('Use your actual capabilities when calling getNextAction.');
  });
});
