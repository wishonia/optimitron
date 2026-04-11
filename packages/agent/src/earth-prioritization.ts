import {
  reviewTaskTreeBundle,
  type TaskTreeNode,
} from './task-tree.js';
import {
  CHAIN_WORLD_LEADER_COUNT,
  DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_ECONOMIC_VALUE,
  TREATY_PEACE_PLUS_RD_ANNUAL_BENEFITS,
  type Parameter,
} from '@optimitron/data/parameters';
import type { EarthOperatorImpact, EarthOperatorTask } from './earth-operator.js';

export type EarthTaskFamily =
  | 'contact-discovery'
  | 'growth-conversion'
  | 'other'
  | 'system-improvement'
  | 'treaty-signer'
  | 'treaty-support-contact'
  | 'treaty-support-endorsement'
  | 'treaty-support-evidence'
  | 'treaty-support-explainer';

export interface EarthQueueAuditIssue {
  code:
    | 'impact-coverage-too-low'
    | 'missing-contact-discovery'
    | 'missing-growth-conversion'
    | 'missing-system-improvement'
    | 'queue-too-concentrated'
    | 'suspected-treaty-roster-cap';
  message: string;
  severity: 'critical' | 'warning';
}

export interface EarthQueueAudit {
  aggregateDelayEconomicValueUsdPerDay: number;
  aggregateExpectedValuePerHourUsd: number;
  dominantFamily: EarthTaskFamily | null;
  dominantFamilyShare: number;
  familyCounts: Record<EarthTaskFamily, number>;
  impactCoverageRatio: number;
  issues: EarthQueueAuditIssue[];
  systemImprovementPriority: 'critical' | 'normal';
  treatySignerCount: number;
  taskCount: number;
}

export interface BuildSystemImprovementTreeInput {
  audit: EarthQueueAudit;
}

const ALL_FAMILIES: EarthTaskFamily[] = [
  'contact-discovery',
  'growth-conversion',
  'other',
  'system-improvement',
  'treaty-signer',
  'treaty-support-contact',
  'treaty-support-endorsement',
  'treaty-support-evidence',
  'treaty-support-explainer',
];

function parameterValue(parameter: Pick<Parameter, 'value'>) {
  return Number.isFinite(parameter.value) ? parameter.value : 0;
}

const MODELED_WORLD_LEADER_COUNT = Math.max(1, Math.round(parameterValue(CHAIN_WORLD_LEADER_COUNT)));
const MODELED_TREATY_MAX_ECONOMIC_VALUE_USD = Math.max(
  1,
  parameterValue(DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_ECONOMIC_VALUE),
);
const MODELED_TREATY_ANNUAL_BENEFITS_USD = Math.max(
  1,
  parameterValue(TREATY_PEACE_PLUS_RD_ANNUAL_BENEFITS),
);

function familyCountsRecord() {
  return Object.fromEntries(ALL_FAMILIES.map((family) => [family, 0])) as Record<EarthTaskFamily, number>;
}

function hasQuantifiedImpact(impact: EarthOperatorImpact | null | undefined) {
  return Boolean(
    (impact?.delayDalysLostPerDay ?? 0) > 0 ||
      (impact?.delayEconomicValueUsdLostPerDay ?? 0) > 0 ||
      (impact?.expectedValuePerHourDalys ?? 0) > 0 ||
      (impact?.expectedValuePerHourUsd ?? 0) > 0,
  );
}

export function classifyEarthTaskFamily(task: Pick<EarthOperatorTask, 'category' | 'taskKey' | 'title'>): EarthTaskFamily {
  const taskKey = (task.taskKey ?? '').toLowerCase();
  const title = task.title.toLowerCase();
  const category = (task.category ?? '').toLowerCase();

  if (taskKey.includes(':support:contact-office')) {
    return 'treaty-support-contact';
  }
  if (taskKey.includes(':support:publish-explainer')) {
    return 'treaty-support-explainer';
  }
  if (taskKey.includes(':support:secure-endorsement')) {
    return 'treaty-support-endorsement';
  }
  if (taskKey.includes(':support:track-evidence')) {
    return 'treaty-support-evidence';
  }
  if (taskKey.includes('one-percent-treaty:signer')) {
    return 'treaty-signer';
  }
  if (taskKey.startsWith('system:') || category === 'technical') {
    return 'system-improvement';
  }
  if (
    taskKey.includes('conversion') ||
    title.includes('website') ||
    title.includes('landing page') ||
    title.includes('conversion') ||
    title.includes('signup') ||
    title.includes('vote')
  ) {
    return 'growth-conversion';
  }
  if (
    title.includes('journalist') ||
    title.includes('contact list') ||
    title.includes('email target') ||
    title.includes('press list') ||
    title.includes('contact discovery')
  ) {
    return 'contact-discovery';
  }

  return 'other';
}

function buildTaskImpact(input: {
  aggregateDelayEconomicValueUsdPerDay: number;
  aggregateExpectedValuePerHourUsd: number;
  delayWeight: number;
  hourlyWeight: number;
}) {
  const delayEconomicValueUsdPerDay = Math.max(
    MODELED_TREATY_ANNUAL_BENEFITS_USD,
    input.aggregateDelayEconomicValueUsdPerDay * input.delayWeight,
  );
  const expectedValuePerHourUsd = Math.max(
    MODELED_TREATY_MAX_ECONOMIC_VALUE_USD,
    input.aggregateExpectedValuePerHourUsd * input.hourlyWeight,
  );

  return {
    delayDalysLostPerDay: null,
    delayEconomicValueUsdLostPerDay: delayEconomicValueUsdPerDay,
    expectedValuePerHourDalys: null,
    expectedValuePerHourUsd,
  };
}

export function evaluateEarthTaskQueue(tasks: EarthOperatorTask[]): EarthQueueAudit {
  const familyCounts = familyCountsRecord();
  let quantifiedImpactCount = 0;
  let treatySignerCount = 0;
  let aggregateDelayEconomicValueUsdPerDay = 0;
  let aggregateExpectedValuePerHourUsd = 0;

  for (const task of tasks) {
    const family = classifyEarthTaskFamily(task);
    familyCounts[family] += 1;

    if (family === 'treaty-signer') {
      treatySignerCount += 1;
    }

    if (hasQuantifiedImpact(task.impact)) {
      quantifiedImpactCount += 1;
    }

    aggregateDelayEconomicValueUsdPerDay += task.impact?.delayEconomicValueUsdLostPerDay ?? 0;
    aggregateExpectedValuePerHourUsd += task.impact?.expectedValuePerHourUsd ?? 0;
  }

  const taskCount = tasks.length;
  const impactCoverageRatio = taskCount === 0 ? 0 : quantifiedImpactCount / taskCount;
  const dominantEntry =
    Object.entries(familyCounts).sort((left, right) => right[1] - left[1])[0] ?? null;
  const dominantFamily = (dominantEntry?.[0] as EarthTaskFamily | undefined) ?? null;
  const dominantFamilyShare =
    dominantEntry === null || taskCount === 0 ? 0 : dominantEntry[1] / taskCount;

  const issues: EarthQueueAuditIssue[] = [];

  if (treatySignerCount > 0 && treatySignerCount < MODELED_WORLD_LEADER_COUNT) {
    issues.push({
      code: 'suspected-treaty-roster-cap',
      message:
        `The treaty queue only covers ${treatySignerCount} signer tasks, but the modeled leader count is ${MODELED_WORLD_LEADER_COUNT}. Expand beyond the seeded subset so the system can pressure every required signer.`,
      severity: 'critical',
    });
  }

  if (impactCoverageRatio < 0.8) {
    issues.push({
      code: 'impact-coverage-too-low',
      message:
        'Too many active tasks lack quantified impact. The queue cannot reliably rank mathematically highest-value work yet.',
      severity: 'critical',
    });
  }

  if (familyCounts['system-improvement'] === 0) {
    issues.push({
      code: 'missing-system-improvement',
      message:
        'There are no active system-improvement tasks, so the optimizer cannot naturally fix ranking/model defects.',
      severity: 'critical',
    });
  }

  if (familyCounts['growth-conversion'] === 0) {
    issues.push({
      code: 'missing-growth-conversion',
      message:
        'There are no website/distribution conversion tasks in the active queue, even though growth likely dominates downstream impact.',
      severity: 'critical',
    });
  }

  if (familyCounts['contact-discovery'] === 0) {
    issues.push({
      code: 'missing-contact-discovery',
      message:
        'There are no contact-discovery tasks for journalists, coalition partners, or missing office channels.',
      severity: 'warning',
    });
  }

  if (dominantFamilyShare >= 0.55) {
    issues.push({
      code: 'queue-too-concentrated',
      message: `The queue is overly concentrated in ${dominantFamily ?? 'one family'}, which makes the top pick unreliable.`,
      severity: 'critical',
    });
  }

  return {
    aggregateDelayEconomicValueUsdPerDay,
    aggregateExpectedValuePerHourUsd,
    dominantFamily,
    dominantFamilyShare,
    familyCounts,
    impactCoverageRatio,
    issues,
    systemImprovementPriority: issues.some((issue) => issue.severity === 'critical') ? 'critical' : 'normal',
    taskCount,
    treatySignerCount,
  };
}

export function buildSystemImprovementTaskTree(input: BuildSystemImprovementTreeInput): TaskTreeNode[] {
  const { audit } = input;
  const root: TaskTreeNode = {
    description:
      'Improve the Optimize Earth system so task selection tracks downstream expected value instead of shallow local fit.',
    estimatedEffortHours: 1,
    id: 'system_improve_optimize_earth',
    impact: buildTaskImpact({
      aggregateDelayEconomicValueUsdPerDay: audit.aggregateDelayEconomicValueUsdPerDay || 1_000_000,
      aggregateExpectedValuePerHourUsd: audit.aggregateExpectedValuePerHourUsd || 100_000,
      delayWeight: 0.6,
      hourlyWeight: 0.5,
    }),
    isPublic: true,
    roleTitle: 'System Operator',
    sourceUrls: ['https://optimitron.com/tasks', 'https://optimitron.com/docs/optimize-earth'],
    status: 'DRAFT',
    taskKey: 'system:optimize-earth:improve-queue',
    title: 'Improve the Optimize Earth task-selection system',
    children: [],
  };
  const roots: TaskTreeNode[] = [
    root,
  ];
  const children = root.children ?? [];

  const criticalCodes = new Set(audit.issues.filter((issue) => issue.severity === 'critical').map((issue) => issue.code));

  if (criticalCodes.has('suspected-treaty-roster-cap')) {
    children.push({
      blockerRefs: [],
      description:
        'Replace the arbitrary top-20 treaty signer cap with a full required signer roster and generate signer/supporter tasks for every required signature.',
      estimatedEffortHours: 4,
      id: 'system_expand_treaty_signer_roster',
      impact: buildTaskImpact({
        aggregateDelayEconomicValueUsdPerDay: audit.aggregateDelayEconomicValueUsdPerDay || 1_000_000,
        aggregateExpectedValuePerHourUsd: audit.aggregateExpectedValuePerHourUsd || 100_000,
        delayWeight: 0.9,
        hourlyWeight: 1.2,
      }),
      isPublic: true,
      roleTitle: 'System Operator',
      sourceUrls: ['https://optimitron.com/tasks'],
      status: 'DRAFT',
      taskKey: 'system:optimize-earth:expand-treaty-signer-roster',
      title: 'Expand treaty signer coverage to the full required roster',
    });
  }

  if (criticalCodes.has('impact-coverage-too-low')) {
    children.push({
      blockerRefs: [],
      description:
        'Propagate quantified downstream impact into supporter and system tasks so getNextTask can rank by real expected value instead of sparse local metadata.',
      estimatedEffortHours: 3,
      id: 'system_propagate_downstream_impact',
      impact: buildTaskImpact({
        aggregateDelayEconomicValueUsdPerDay: audit.aggregateDelayEconomicValueUsdPerDay || 1_000_000,
        aggregateExpectedValuePerHourUsd: audit.aggregateExpectedValuePerHourUsd || 100_000,
        delayWeight: 0.7,
        hourlyWeight: 1,
      }),
      isPublic: true,
      roleTitle: 'System Operator',
      sourceUrls: ['https://optimitron.com/tasks'],
      status: 'DRAFT',
      taskKey: 'system:optimize-earth:propagate-downstream-impact',
      title: 'Propagate downstream impact into supporter and system tasks',
    });
  }

  if (criticalCodes.has('missing-growth-conversion')) {
    children.push({
      blockerRefs: [],
      description:
        'Generate and rank website conversion, distribution, and vote-driving tasks so agents can improve the funnel instead of only producing campaign content.',
      estimatedEffortHours: 2,
      id: 'system_generate_growth_tasks',
      impact: buildTaskImpact({
        aggregateDelayEconomicValueUsdPerDay: audit.aggregateDelayEconomicValueUsdPerDay || 1_000_000,
        aggregateExpectedValuePerHourUsd: audit.aggregateExpectedValuePerHourUsd || 100_000,
        delayWeight: 0.6,
        hourlyWeight: 0.9,
      }),
      isPublic: true,
      roleTitle: 'Growth Operator',
      sourceUrls: ['https://optimitron.com/tasks'],
      status: 'DRAFT',
      taskKey: 'system:optimize-earth:generate-growth-conversion-tasks',
      title: 'Generate growth and conversion tasks for the website and distribution funnel',
    });
  }

  if (criticalCodes.has('missing-system-improvement')) {
    children.push({
      blockerRefs: [],
      description:
        'Make the system explicitly generate, review, and prioritize meta-tasks that improve the queue, the model, and the task generator itself.',
      estimatedEffortHours: 2,
      id: 'system_generate_meta_tasks',
      impact: buildTaskImpact({
        aggregateDelayEconomicValueUsdPerDay: audit.aggregateDelayEconomicValueUsdPerDay || 1_000_000,
        aggregateExpectedValuePerHourUsd: audit.aggregateExpectedValuePerHourUsd || 100_000,
        delayWeight: 0.5,
        hourlyWeight: 0.8,
      }),
      isPublic: true,
      roleTitle: 'System Operator',
      sourceUrls: ['https://optimitron.com/tasks'],
      status: 'DRAFT',
      taskKey: 'system:optimize-earth:generate-system-improvement-tasks',
      title: 'Generate and prioritize system-improvement tasks in the queue',
    });
  }

  if (audit.issues.some((issue) => issue.code === 'missing-contact-discovery')) {
    children.push({
      blockerRefs: [],
      description:
        'Generate contact-discovery tasks for missing office channels, journalists, coalition partners, and other high-leverage outreach targets.',
      estimatedEffortHours: 2,
      id: 'system_generate_contact_discovery',
      impact: buildTaskImpact({
        aggregateDelayEconomicValueUsdPerDay: audit.aggregateDelayEconomicValueUsdPerDay || 1_000_000,
        aggregateExpectedValuePerHourUsd: audit.aggregateExpectedValuePerHourUsd || 100_000,
        delayWeight: 0.45,
        hourlyWeight: 0.6,
      }),
      isPublic: true,
      roleTitle: 'Outreach Operator',
      sourceUrls: ['https://optimitron.com/tasks'],
      status: 'DRAFT',
      taskKey: 'system:optimize-earth:generate-contact-discovery-tasks',
      title: 'Generate contact-discovery tasks for offices, journalists, and coalition targets',
    });
  }

  return roots;
}

export function reviewEarthQueueAndBuildSystemImprovements(tasks: EarthOperatorTask[]) {
  const audit = evaluateEarthTaskQueue(tasks);
  const roots = buildSystemImprovementTaskTree({ audit });
  const proposal = reviewTaskTreeBundle({ roots });

  return {
    audit,
    proposal,
    roots,
  };
}
