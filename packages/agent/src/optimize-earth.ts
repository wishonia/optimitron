export interface OptimizeEarthPromptOptions {
  capabilities?: string[];
  maxParallelTasks?: number | null;
  taskSourceLabel?: string | null;
}

const DEFAULT_TASK_SOURCE_LABEL = 'the task database via MCP';

export const OPTIMIZE_EARTH_PROTOCOL_STEPS = [
  'Call getNextTask with your capabilities.',
  'If a task is returned, call acquireLease before doing any work.',
  'Work only on the leased task and touch only files required for that task.',
  'If the task runs longer than the lease TTL, call heartbeatLease.',
  'If no executable task exists, propose only high-value missing tasks or unblockers via proposeTaskBundle.',
  'Do not create ACTIVE tasks directly; agent-created tasks must start as DRAFT.',
  'Respect checkContactCooldown and recordContactAction before outreach.',
  'Log the run with logAgentRun and release the lease when done.',
] as const;

export function buildOptimizeEarthInstruction(input: OptimizeEarthPromptOptions = {}) {
  const capabilities = (input.capabilities ?? []).map((value) => value.trim()).filter(Boolean);
  const taskSourceLabel = input.taskSourceLabel?.trim() ?? DEFAULT_TASK_SOURCE_LABEL;
  const maxParallelTasks = input.maxParallelTasks ?? 1;
  const capabilityLine =
    capabilities.length === 0
      ? 'Use your actual capabilities when calling getNextTask.'
      : `Advertise these capabilities when calling getNextTask: ${capabilities.join(', ')}.`;

  return [
    `Optimize earth using ${taskSourceLabel} as the source of truth.`,
    'Before editing code or creating tasks, fetch the highest-value executable task and acquire a lease.',
    capabilityLine,
    `Hold at most ${maxParallelTasks} active lease${maxParallelTasks === 1 ? '' : 's'} at a time.`,
    'If no executable task exists, propose only high-value unblockers or missing subtasks via proposeTaskBundle.',
    'Do not create ACTIVE tasks directly. Do not promote tasks unless review passes.',
    'Respect outreach cooldowns, log your run, and release the lease when done.',
  ].join(' ');
}
