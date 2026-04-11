import {
  OrgType,
  SourceArtifactType,
  SourceSystem,
  TaskCategory,
  TaskClaimPolicy,
  TaskDifficulty,
  TaskStatus,
} from "@optimitron/db";
import type {
  ImportedImpactFrameDraft,
  ImportedImpactMetricDraft,
  ImportedSourceArtifactDraft,
} from "./opg-obg-adapters";
import type { PolicyModelRunImportDraft } from "./policy-model-run-to-imported-task-bundle";

export const TREATY_PARENT_TASK_KEY = "program:one-percent-treaty:ratify";
export const TREATY_SIGNER_TASK_KEY_PREFIX = "program:one-percent-treaty:signer";
export const TREATY_DUE_AT = new Date("2024-12-31T00:00:00.000Z");
export const SIPRI_WORLD_MILITARY_SPENDING_USD_2024 = 2_718_000_000_000;
export const SIPRI_MILITARY_SPENDING_2024_SOURCE_URL =
  "https://www.sipri.org/sites/default/files/2025-04/2504_fs_milex_2024.pdf";

const SCALEABLE_FRAME_KEYS = [
  "delayDalysLostPerDayBase",
  "delayDalysLostPerDayHigh",
  "delayDalysLostPerDayLow",
  "delayEconomicValueUsdLostPerDayBase",
  "delayEconomicValueUsdLostPerDayHigh",
  "delayEconomicValueUsdLostPerDayLow",
  "estimatedCashCostUsdBase",
  "estimatedCashCostUsdHigh",
  "estimatedCashCostUsdLow",
  "expectedDalysAvertedBase",
  "expectedDalysAvertedHigh",
  "expectedDalysAvertedLow",
  "expectedEconomicValueUsdBase",
  "expectedEconomicValueUsdHigh",
  "expectedEconomicValueUsdLow",
] satisfies Array<keyof ImportedImpactFrameDraft>;

const SCALEABLE_METRIC_KEYS = new Set([
  "contribution_lives_saved_per_pct_point",
  "contribution_suffering_hours_per_pct_point",
  "delay_dalys_lost_per_day",
  "delay_economic_value_usd_lost_per_day",
  "expected_value_per_hour_dalys",
  "expected_value_per_hour_usd",
  "lives_saved_if_success",
  "suffering_hours_if_success",
  "treaty_cumulative_20yr_with_ratchet",
  "treaty_lives_saved_annual_global",
  "treaty_qalys_gained_annual_global",
]);

export interface TreatySignerSlot {
  contactEmail: string | null;
  contactLabel: string | null;
  contactUrl: string | null;
  countryCode: string;
  countryName: string;
  decisionMakerLabel: string;
  governmentName: string;
  governmentWebsite: string | null;
  militaryBudgetUsd: number;
  officialSourceUrl: string | null;
  roleTitle: string;
  sortOrder: number;
}

export interface TreatySupporterTaskDraft {
  assigneeAffiliationSnapshot: string | null;
  category: TaskCategory;
  claimPolicy: TaskClaimPolicy;
  contextJson: Record<string, unknown>;
  contactLabel: string | null;
  contactTemplate: string | null;
  contactUrl: string | null;
  description: string;
  difficulty: TaskDifficulty;
  dueAt: Date | null;
  estimatedEffortHours: number | null;
  impactStatement: string | null;
  interestTags: string[];
  roleTitle: string | null;
  skillTags: string[];
  sortOrder: number;
  status: TaskStatus;
  taskKey: string;
  title: string;
}

function formatCompactUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 0 : 1,
    notation: Math.abs(value) >= 1000 ? "compact" : "standard",
    style: "currency",
  }).format(value);
}

function round(value: number, digits = 4) {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

function scaleNumber(value: number | null, factor: number) {
  return value == null ? null : value * factor;
}

function uniqueArtifacts(artifacts: ImportedSourceArtifactDraft[]) {
  const deduped = new Map<string, ImportedSourceArtifactDraft>();
  for (const artifact of artifacts) {
    deduped.set(artifact.sourceKey, artifact);
  }
  return [...deduped.values()];
}

function buildSignerContactTemplate() {
  return [
    "Please complete {{taskTitle}}.",
    "This task is already {{delayLabel}}.",
    "Estimated delay cost so far: {{humanLives}} lives, {{sufferingHours}} suffering hours, and {{economicLoss}}.",
    "Public task page: {{taskUrl}}",
  ].join(" ");
}

function buildCountryInterestTags(slot: TreatySignerSlot) {
  return [
    "treaty",
    "disease-eradication",
    "peace-dividend",
    `country-${slot.countryCode.toLowerCase()}`,
  ];
}

function buildCountrySkillTags(slot: TreatySignerSlot) {
  return [
    "diplomacy",
    "public-pressure",
    "executive-action",
    `country-${slot.countryCode.toLowerCase()}`,
  ];
}

function buildTreatyAcceptanceCriteria(slot: TreatySignerSlot) {
  return [
    `A treaty instrument, executive order, or equivalent commitment is prepared for ${slot.decisionMakerLabel}.`,
    `${slot.decisionMakerLabel} publicly signs or commits to the 1% Treaty.`,
    `${slot.governmentName} publicly names the implementation authority for the 1% redirect.`,
    `A first implementation step is announced within 90 days of signature.`,
  ];
}

function buildTreatySignerSourceArtifacts(
  slot: TreatySignerSlot,
): ImportedSourceArtifactDraft[] {
  const artifacts: ImportedSourceArtifactDraft[] = [
    {
      artifactType: SourceArtifactType.EXTERNAL_SOURCE,
      contentHash: null,
      externalKey: `sipri-milex-2024:${slot.countryCode.toLowerCase()}`,
      payloadJson: {
        countryCode: slot.countryCode,
        countryName: slot.countryName,
        militaryBudgetUsd: slot.militaryBudgetUsd,
        snapshotYear: 2024,
        worldMilitarySpendingUsd: SIPRI_WORLD_MILITARY_SPENDING_USD_2024,
      },
      sourceKey: `external:sipri:military-expenditure-2024:${slot.countryCode.toLowerCase()}`,
      sourceRef: `sipri:military-expenditure-2024:${slot.countryCode.toLowerCase()}`,
      sourceSystem: SourceSystem.EXTERNAL,
      sourceUrl: SIPRI_MILITARY_SPENDING_2024_SOURCE_URL,
      title: `SIPRI 2024 military expenditure snapshot for ${slot.countryName}`,
      versionKey: "2024",
    },
  ];

  const officeSourceUrl =
    slot.officialSourceUrl ?? slot.governmentWebsite ?? slot.contactUrl ?? null;

  if (officeSourceUrl) {
    artifacts.push({
      artifactType: SourceArtifactType.EXTERNAL_SOURCE,
      contentHash: null,
      externalKey: `official-office:${slot.countryCode.toLowerCase()}`,
      payloadJson: {
        contactLabel: slot.contactLabel,
        contactUrl: slot.contactUrl,
        countryCode: slot.countryCode,
        decisionMakerLabel: slot.decisionMakerLabel,
        governmentName: slot.governmentName,
      },
      sourceKey: `external:official-office:${slot.countryCode.toLowerCase()}`,
      sourceRef: `official-office:${slot.countryCode.toLowerCase()}`,
      sourceSystem: SourceSystem.EXTERNAL,
      sourceUrl: officeSourceUrl,
      title: `${slot.decisionMakerLabel} official office page`,
      versionKey: "current",
    });
  }

  return artifacts;
}

function scaleImportedMetric(
  metric: ImportedImpactMetricDraft,
  factor: number,
): ImportedImpactMetricDraft {
  if (!SCALEABLE_METRIC_KEYS.has(metric.metricKey)) {
    return metric;
  }

  return {
    ...metric,
    baseValue: scaleNumber(metric.baseValue, factor),
    highValue: scaleNumber(metric.highValue, factor),
    lowValue: scaleNumber(metric.lowValue, factor),
    metadataJson: {
      ...(metric.metadataJson ?? {}),
      treatySignerScaledByMilitaryShare: true,
    },
  };
}

function scaleImpactFrame(
  frame: ImportedImpactFrameDraft,
  factor: number,
): ImportedImpactFrameDraft {
  const scaledFrame = { ...frame };

  for (const key of SCALEABLE_FRAME_KEYS) {
    scaledFrame[key] = scaleNumber(frame[key], factor) as ImportedImpactFrameDraft[typeof key];
  }

  scaledFrame.metrics = frame.metrics.map((metric) => scaleImportedMetric(metric, factor));
  return scaledFrame;
}

function upsertMetric(
  metrics: ImportedImpactMetricDraft[],
  nextMetric: ImportedImpactMetricDraft,
) {
  const existingIndex = metrics.findIndex((metric) => metric.metricKey === nextMetric.metricKey);
  if (existingIndex >= 0) {
    metrics.splice(existingIndex, 1, nextMetric);
    return;
  }

  metrics.push(nextMetric);
}

function buildSignerImpactMetrics(slot: TreatySignerSlot) {
  const militaryShareRatio = slot.militaryBudgetUsd / SIPRI_WORLD_MILITARY_SPENDING_USD_2024;
  const redirectAmountUsd = slot.militaryBudgetUsd * 0.01;

  return [
    {
      baseValue: slot.militaryBudgetUsd,
      displayGroup: "treaty-slot",
      highValue: null,
      lowValue: null,
      metadataJson: {
        displayName: "Military budget (2024 SIPRI)",
      },
      metricKey: "military_budget_usd",
      summaryStatsJson: null,
      unit: "USD",
      valueJson: null,
    },
    {
      baseValue: militaryShareRatio,
      displayGroup: "treaty-slot",
      highValue: null,
      lowValue: null,
      metadataJson: {
        displayName: "Share of global military spending",
      },
      metricKey: "military_budget_share_ratio",
      summaryStatsJson: null,
      unit: "ratio",
      valueJson: null,
    },
    {
      baseValue: militaryShareRatio * 100,
      displayGroup: "treaty-slot",
      highValue: null,
      lowValue: null,
      metadataJson: {
        displayName: "Share of global military spending",
      },
      metricKey: "military_budget_share_pct",
      summaryStatsJson: null,
      unit: "percent",
      valueJson: null,
    },
    {
      baseValue: redirectAmountUsd,
      displayGroup: "treaty-slot",
      highValue: null,
      lowValue: null,
      metadataJson: {
        displayName: "Annual 1% redirect amount",
      },
      metricKey: "annual_redirect_amount_usd",
      summaryStatsJson: null,
      unit: "USD/year",
      valueJson: null,
    },
  ] satisfies ImportedImpactMetricDraft[];
}

export function getTreatySignerTaskKey(slot: TreatySignerSlot) {
  return `${TREATY_SIGNER_TASK_KEY_PREFIX}:${slot.countryCode.toLowerCase()}`;
}

export function buildTreatySignerImportDraft(input: {
  baseDraft: PolicyModelRunImportDraft;
  slot: TreatySignerSlot;
}): PolicyModelRunImportDraft {
  const slot = input.slot;
  const factor = slot.militaryBudgetUsd / SIPRI_WORLD_MILITARY_SPENDING_USD_2024;
  const redirectAmountUsd = slot.militaryBudgetUsd * 0.01;
  const cloned = structuredClone(input.baseDraft);
  const taskKey = getTreatySignerTaskKey(slot);

  cloned.assigneeHint = {
    actorKey: null,
    claimPolicy: TaskClaimPolicy.ASSIGNED_ONLY,
    contactLabel: slot.contactLabel,
    contactTemplate: buildSignerContactTemplate(),
    contactUrl: slot.contactUrl,
    currentAffiliation: slot.governmentName,
    displayName: slot.decisionMakerLabel,
    isPublicFigure: true,
    organizationKey: null,
    organizationName: null,
    organizationType: null,
    role: "decision_maker",
    roleTitle: slot.roleTitle,
  };

  cloned.bundle.task.assigneeAffiliationSnapshot = slot.governmentName;
  cloned.bundle.task.assigneeOrganizationName = null;
  cloned.bundle.task.assigneeOrganizationSourceRef = null;
  cloned.bundle.task.assigneeOrganizationType = null;
  cloned.bundle.task.claimPolicy = TaskClaimPolicy.ASSIGNED_ONLY;
  cloned.bundle.task.contactLabel = slot.contactLabel;
  cloned.bundle.task.contactTemplate = buildSignerContactTemplate();
  cloned.bundle.task.contactUrl = slot.contactUrl;
  cloned.bundle.task.description = [
    `Secure ${slot.decisionMakerLabel}'s signature on the 1% Treaty.`,
    `If completed, ${slot.governmentName} redirects about ${formatCompactUsd(redirectAmountUsd)} per year into pragmatic clinical trials and disease-eradication work.`,
    `This slot represents about ${round(factor * 100, 1)}% of global military spending in the 2024 SIPRI snapshot.`,
  ].join(" ");
  cloned.bundle.task.difficulty = TaskDifficulty.EXPERT;
  cloned.bundle.task.dueAt = TREATY_DUE_AT;
  cloned.bundle.task.impactStatement = [
    `${formatCompactUsd(redirectAmountUsd)} per year redirected if completed.`,
    "Thirty seconds for the signer. Large global downside from delay.",
  ].join(" ");
  cloned.bundle.task.interestTags = buildCountryInterestTags(slot);
  cloned.bundle.task.roleTitle = slot.roleTitle;
  cloned.bundle.task.skillTags = buildCountrySkillTags(slot);
  cloned.bundle.task.status = TaskStatus.ACTIVE;
  cloned.bundle.task.taskKey = taskKey;
  cloned.bundle.task.title = "Sign the 1% Treaty";
  cloned.bundle.task.contextJson = {
    ...cloned.bundle.task.contextJson,
    acceptanceCriteria: buildTreatyAcceptanceCriteria(slot),
    treatySignerSlot: {
      annualRedirectAmountUsd: redirectAmountUsd,
      countryCode: slot.countryCode,
      countryName: slot.countryName,
      decisionMakerLabel: slot.decisionMakerLabel,
      governmentName: slot.governmentName,
      militaryBudgetSharePct: round(factor * 100, 2),
      militaryBudgetShareRatio: factor,
      militaryBudgetUsd: slot.militaryBudgetUsd,
      snapshotYear: 2024,
      worldMilitarySpendingUsd: SIPRI_WORLD_MILITARY_SPENDING_USD_2024,
    },
  };

  cloned.bundle.impactEstimate.assumptionsJson = {
    ...(cloned.bundle.impactEstimate.assumptionsJson ?? {}),
    annualRedirectAmountUsd: redirectAmountUsd,
    countryCode: slot.countryCode,
    countryName: slot.countryName,
    decisionMakerLabel: slot.decisionMakerLabel,
    governmentName: slot.governmentName,
    militaryBudgetShareRatio: factor,
    militaryBudgetUsd: slot.militaryBudgetUsd,
    treatySignerScalingMethod: "scaled-by-share-of-2024-global-military-spending",
  };
  cloned.bundle.impactEstimate.frames = cloned.bundle.impactEstimate.frames.map((frame) => {
    const scaledFrame = scaleImpactFrame(frame, factor);
    const addedMetrics = buildSignerImpactMetrics(slot);

    for (const metric of addedMetrics) {
      upsertMetric(scaledFrame.metrics, metric);
    }

    return scaledFrame;
  });
  cloned.bundle.sourceArtifacts = uniqueArtifacts([
    ...cloned.bundle.sourceArtifacts,
    ...buildTreatySignerSourceArtifacts(slot),
  ]);

  return cloned;
}

export function buildTreatySupporterTaskDrafts(
  slot: TreatySignerSlot,
): TreatySupporterTaskDraft[] {
  const signerTaskKey = getTreatySignerTaskKey(slot);
  const commonContext = {
    parentSignerTaskKey: signerTaskKey,
    treatySignerSlot: {
      countryCode: slot.countryCode,
      countryName: slot.countryName,
      decisionMakerLabel: slot.decisionMakerLabel,
      governmentName: slot.governmentName,
    },
  };

  return [
    {
      assigneeAffiliationSnapshot: slot.governmentName,
      category: TaskCategory.OUTREACH,
      claimPolicy: TaskClaimPolicy.OPEN_MANY,
      contactLabel: slot.contactLabel,
      contactTemplate: buildSignerContactTemplate(),
      contactUrl: slot.contactUrl,
      contextJson: {
        ...commonContext,
        acceptanceCriteria: [
          `Send one direct message to ${slot.decisionMakerLabel}'s office.`,
          "If the office responds, add or route the evidence for milestone review.",
        ],
      },
      description:
        `Send one direct, evidence-based message asking ${slot.decisionMakerLabel} to complete the treaty signer task, then log any reply or acknowledgment.`,
      difficulty: TaskDifficulty.BEGINNER,
      dueAt: null,
      estimatedEffortHours: 0.15,
      impactStatement: "Fast, repeatable pressure action that helps move milestone M2.",
      interestTags: buildCountryInterestTags(slot),
      roleTitle: slot.roleTitle,
      skillTags: ["outreach", "public-pressure", `country-${slot.countryCode.toLowerCase()}`],
      sortOrder: 0,
      status: TaskStatus.ACTIVE,
      taskKey: `${signerTaskKey}:support:contact-office`,
      title: `Contact ${slot.decisionMakerLabel}'s office about the 1% Treaty`,
    },
    {
      assigneeAffiliationSnapshot: slot.governmentName,
      category: TaskCategory.COMMUNICATION,
      claimPolicy: TaskClaimPolicy.OPEN_MANY,
      contactLabel: null,
      contactTemplate: null,
      contactUrl: null,
      contextJson: {
        ...commonContext,
        acceptanceCriteria: [
          `Publish or place at least one country-specific explainer that pressures ${slot.decisionMakerLabel}.`,
          "Link the explainer to the signer task page and core methodology.",
        ],
      },
      description:
        `Create or place one sharp country-specific explainer, thread, post, or article that makes the delay cost and signer ask legible to ${slot.countryName}.`,
      difficulty: TaskDifficulty.INTERMEDIATE,
      dueAt: null,
      estimatedEffortHours: 1,
      impactStatement: "Turns the signer task into something other people can understand and share.",
      interestTags: buildCountryInterestTags(slot),
      roleTitle: slot.roleTitle,
      skillTags: ["writing", "messaging", "social-media", `country-${slot.countryCode.toLowerCase()}`],
      sortOrder: 1,
      status: TaskStatus.ACTIVE,
      taskKey: `${signerTaskKey}:support:publish-explainer`,
      title: `Publish a country-specific explainer for ${slot.countryName}'s treaty signature`,
    },
    {
      assigneeAffiliationSnapshot: slot.governmentName,
      category: TaskCategory.ORGANIZING,
      claimPolicy: TaskClaimPolicy.OPEN_MANY,
      contactLabel: null,
      contactTemplate: null,
      contactUrl: null,
      contextJson: {
        ...commonContext,
        acceptanceCriteria: [
          `Secure at least one credible organization, expert, or coalition endorsement in ${slot.countryName}.`,
          "Attach the public evidence to the signer task or milestone review flow.",
        ],
      },
      description:
        `Recruit one credible organization, expert, or coalition partner willing to back ${slot.countryName}'s signature and make that support public.`,
      difficulty: TaskDifficulty.INTERMEDIATE,
      dueAt: null,
      estimatedEffortHours: 1.5,
      impactStatement: "Moves the signer task from isolated pressure into coalition pressure.",
      interestTags: buildCountryInterestTags(slot),
      roleTitle: slot.roleTitle,
      skillTags: ["coalition-building", "organizing", `country-${slot.countryCode.toLowerCase()}`],
      sortOrder: 2,
      status: TaskStatus.ACTIVE,
      taskKey: `${signerTaskKey}:support:secure-endorsement`,
      title: `Secure one credible endorsement for ${slot.countryName}'s treaty signature`,
    },
    {
      assigneeAffiliationSnapshot: slot.governmentName,
      category: TaskCategory.RESEARCH,
      claimPolicy: TaskClaimPolicy.OPEN_MANY,
      contactLabel: null,
      contactTemplate: null,
      contactUrl: null,
      contextJson: {
        ...commonContext,
        acceptanceCriteria: [
          `Find new public evidence about ${slot.decisionMakerLabel}'s treaty position, office response, or implementation path.`,
          "Link the best evidence for milestone review or current-activities updates.",
        ],
      },
      description:
        `Track public statements, office acknowledgments, legislative moves, and other verifiable evidence about ${slot.countryName}'s treaty progress.`,
      difficulty: TaskDifficulty.BEGINNER,
      dueAt: null,
      estimatedEffortHours: 0.5,
      impactStatement: "Feeds the milestone system with evidence instead of vibes.",
      interestTags: buildCountryInterestTags(slot),
      roleTitle: slot.roleTitle,
      skillTags: ["research", "verification", `country-${slot.countryCode.toLowerCase()}`],
      sortOrder: 3,
      status: TaskStatus.ACTIVE,
      taskKey: `${signerTaskKey}:support:track-evidence`,
      title: `Track and verify ${slot.countryName}'s treaty progress`,
    },
  ];
}

export const TOP_TREATY_SIGNER_SLOTS: TreatySignerSlot[] = [
  {
    contactEmail: null,
    contactLabel: "White House contact form",
    contactUrl: "https://www.whitehouse.gov/contact/",
    countryCode: "US",
    countryName: "United States",
    decisionMakerLabel: "President of the United States",
    governmentName: "United States Government",
    governmentWebsite: "https://www.whitehouse.gov/",
    militaryBudgetUsd: 997_000_000_000,
    officialSourceUrl: "https://www.whitehouse.gov/administration/",
    roleTitle: "President",
    sortOrder: 0,
  },
  {
    contactEmail: null,
    contactLabel: "State Council contact page",
    contactUrl: "https://english.www.gov.cn/contactus/",
    countryCode: "CN",
    countryName: "China",
    decisionMakerLabel: "President of the People's Republic of China",
    governmentName: "Government of the People's Republic of China",
    governmentWebsite: "https://english.www.gov.cn/",
    militaryBudgetUsd: 314_000_000_000,
    officialSourceUrl: "https://english.www.gov.cn/",
    roleTitle: "President",
    sortOrder: 1,
  },
  {
    contactEmail: null,
    contactLabel: "Kremlin contacts",
    contactUrl: "http://en.kremlin.ru/contacts",
    countryCode: "RU",
    countryName: "Russia",
    decisionMakerLabel: "President of Russia",
    governmentName: "Government of the Russian Federation",
    governmentWebsite: "http://government.ru/en/",
    militaryBudgetUsd: 149_000_000_000,
    officialSourceUrl: "http://en.kremlin.ru/",
    roleTitle: "President",
    sortOrder: 2,
  },
  {
    contactEmail: "internetpost@bundeskanzler.de",
    contactLabel: "Federal Government contact page",
    contactUrl: "https://www.bundesregierung.de/breg-en/service/contact/contact-the-federal-government-1957540",
    countryCode: "DE",
    countryName: "Germany",
    decisionMakerLabel: "Chancellor of Germany",
    governmentName: "Federal Government of Germany",
    governmentWebsite: "https://www.bundesregierung.de/breg-en",
    militaryBudgetUsd: 88_500_000_000,
    officialSourceUrl: "https://www.bundesregierung.de/breg-en/federal-government",
    roleTitle: "Chancellor",
    sortOrder: 3,
  },
  {
    contactEmail: null,
    contactLabel: "Write to the Prime Minister",
    contactUrl: "https://www.pmindia.gov.in/en/interact-with-honble-pm/",
    countryCode: "IN",
    countryName: "India",
    decisionMakerLabel: "Prime Minister of India",
    governmentName: "Government of India",
    governmentWebsite: "https://www.pmindia.gov.in/en/",
    militaryBudgetUsd: 86_100_000_000,
    officialSourceUrl: "https://www.pmindia.gov.in/en/",
    roleTitle: "Prime Minister",
    sortOrder: 4,
  },
  {
    contactEmail: null,
    contactLabel: "Email Number 10",
    contactUrl: "https://email.number10.gov.uk/",
    countryCode: "GB",
    countryName: "United Kingdom",
    decisionMakerLabel: "Prime Minister of the United Kingdom",
    governmentName: "Government of the United Kingdom",
    governmentWebsite: "https://www.gov.uk/government/organisations/prime-ministers-office-10-downing-street",
    militaryBudgetUsd: 81_800_000_000,
    officialSourceUrl: "https://www.gov.uk/government/people/the-prime-minister",
    roleTitle: "Prime Minister",
    sortOrder: 5,
  },
  {
    contactEmail: null,
    contactLabel: "Saudi government portal",
    contactUrl: "https://www.my.gov.sa/wps/portal/snp/main",
    countryCode: "SA",
    countryName: "Saudi Arabia",
    decisionMakerLabel: "Prime Minister of Saudi Arabia",
    governmentName: "Government of Saudi Arabia",
    governmentWebsite: "https://www.my.gov.sa/wps/portal/snp/main",
    militaryBudgetUsd: 80_300_000_000,
    officialSourceUrl: "https://www.my.gov.sa/wps/portal/snp/aboutksa/government",
    roleTitle: "Prime Minister",
    sortOrder: 6,
  },
  {
    contactEmail: null,
    contactLabel: "Contact the President of Ukraine",
    contactUrl: "https://www.president.gov.ua/en/office/contacts",
    countryCode: "UA",
    countryName: "Ukraine",
    decisionMakerLabel: "President of Ukraine",
    governmentName: "Government of Ukraine",
    governmentWebsite: "https://www.president.gov.ua/en",
    militaryBudgetUsd: 64_700_000_000,
    officialSourceUrl: "https://www.president.gov.ua/en",
    roleTitle: "President",
    sortOrder: 7,
  },
  {
    contactEmail: null,
    contactLabel: "Write to the President",
    contactUrl: "https://www.elysee.fr/ecrire-au-president-de-la-republique/",
    countryCode: "FR",
    countryName: "France",
    decisionMakerLabel: "President of France",
    governmentName: "Government of France",
    governmentWebsite: "https://www.elysee.fr/en/",
    militaryBudgetUsd: 64_700_000_000,
    officialSourceUrl: "https://www.elysee.fr/en/",
    roleTitle: "President",
    sortOrder: 8,
  },
  {
    contactEmail: null,
    contactLabel: "Prime Minister's Office contact page",
    contactUrl: "https://www.kantei.go.jp/foreign/forms/comment_ssl.html",
    countryCode: "JP",
    countryName: "Japan",
    decisionMakerLabel: "Prime Minister of Japan",
    governmentName: "Government of Japan",
    governmentWebsite: "https://www.kantei.go.jp/foreign/",
    militaryBudgetUsd: 55_300_000_000,
    officialSourceUrl: "https://www.kantei.go.jp/foreign/",
    roleTitle: "Prime Minister",
    sortOrder: 9,
  },
  {
    contactEmail: null,
    contactLabel: "Office of the President of Korea",
    contactUrl: "https://www.president.go.kr/",
    countryCode: "KR",
    countryName: "South Korea",
    decisionMakerLabel: "President of South Korea",
    governmentName: "Government of the Republic of Korea",
    governmentWebsite: "https://www.korea.net/",
    militaryBudgetUsd: 47_600_000_000,
    officialSourceUrl: "https://www.president.go.kr/",
    roleTitle: "President",
    sortOrder: 10,
  },
  {
    contactEmail: "pm_eng@pmo.gov.il",
    contactLabel: "Contact the Prime Minister",
    contactUrl: "https://www.gov.il/en/pages/contact_the_prime_minister",
    countryCode: "IL",
    countryName: "Israel",
    decisionMakerLabel: "Prime Minister of Israel",
    governmentName: "Government of Israel",
    governmentWebsite: "https://www.gov.il/en/departments/prime_ministers_office/govil-landing-page",
    militaryBudgetUsd: 46_500_000_000,
    officialSourceUrl: "https://www.gov.il/en/departments/prime_ministers_office/govil-landing-page",
    roleTitle: "Prime Minister",
    sortOrder: 11,
  },
  {
    contactEmail: "kontakt@kprm.gov.pl",
    contactLabel: "Contact the Prime Minister",
    contactUrl: "https://www.gov.pl/web/primeminister/contact",
    countryCode: "PL",
    countryName: "Poland",
    decisionMakerLabel: "Prime Minister of Poland",
    governmentName: "Government of Poland",
    governmentWebsite: "https://www.gov.pl/web/primeminister",
    militaryBudgetUsd: 38_000_000_000,
    officialSourceUrl: "https://www.gov.pl/web/primeminister",
    roleTitle: "Prime Minister",
    sortOrder: 12,
  },
  {
    contactEmail: "presidente@governo.it",
    contactLabel: "Contact the Government",
    contactUrl: "https://www.governo.it/en/contact-us",
    countryCode: "IT",
    countryName: "Italy",
    decisionMakerLabel: "Prime Minister of Italy",
    governmentName: "Government of Italy",
    governmentWebsite: "https://www.governo.it/en",
    militaryBudgetUsd: 38_000_000_000,
    officialSourceUrl: "https://www.governo.it/en/il-governo",
    roleTitle: "Prime Minister",
    sortOrder: 13,
  },
  {
    contactEmail: null,
    contactLabel: "Contact the Prime Minister",
    contactUrl: "https://www.pm.gov.au/contact-your-pm",
    countryCode: "AU",
    countryName: "Australia",
    decisionMakerLabel: "Prime Minister of Australia",
    governmentName: "Government of Australia",
    governmentWebsite: "https://www.pm.gov.au/",
    militaryBudgetUsd: 33_800_000_000,
    officialSourceUrl: "https://www.pm.gov.au/your-pm",
    roleTitle: "Prime Minister",
    sortOrder: 14,
  },
  {
    contactEmail: "pm@pm.gc.ca",
    contactLabel: "Contact the Prime Minister",
    contactUrl: "https://pm.gc.ca/en/connect/contact",
    countryCode: "CA",
    countryName: "Canada",
    decisionMakerLabel: "Prime Minister of Canada",
    governmentName: "Government of Canada",
    governmentWebsite: "https://pm.gc.ca/en",
    militaryBudgetUsd: 29_300_000_000,
    officialSourceUrl: "https://pm.gc.ca/en",
    roleTitle: "Prime Minister",
    sortOrder: 15,
  },
  {
    contactEmail: null,
    contactLabel: "Contact the Presidency",
    contactUrl: "https://www.tccb.gov.tr/en/contact/",
    countryCode: "TR",
    countryName: "Türkiye",
    decisionMakerLabel: "President of Türkiye",
    governmentName: "Government of Türkiye",
    governmentWebsite: "https://www.tccb.gov.tr/en/",
    militaryBudgetUsd: 25_000_000_000,
    officialSourceUrl: "https://www.tccb.gov.tr/en/president/",
    roleTitle: "President",
    sortOrder: 16,
  },
  {
    contactEmail: "presidente.gobierno@la-moncloa.es",
    contactLabel: "Contact Moncloa",
    contactUrl: "https://www.lamoncloa.gob.es/contacto/Paginas/index.aspx",
    countryCode: "ES",
    countryName: "Spain",
    decisionMakerLabel: "Prime Minister of Spain",
    governmentName: "Government of Spain",
    governmentWebsite: "https://www.lamoncloa.gob.es/lang/en/Paginas/index.aspx",
    militaryBudgetUsd: 24_600_000_000,
    officialSourceUrl: "https://www.lamoncloa.gob.es/lang/en/presidente/Paginas/index.aspx",
    roleTitle: "Prime Minister",
    sortOrder: 17,
  },
  {
    contactEmail: "ministerpresident@minaz.nl",
    contactLabel: "Contact the Dutch Government",
    contactUrl: "https://www.government.nl/contact",
    countryCode: "NL",
    countryName: "Netherlands",
    decisionMakerLabel: "Prime Minister of the Netherlands",
    governmentName: "Government of the Netherlands",
    governmentWebsite: "https://www.government.nl/",
    militaryBudgetUsd: 23_200_000_000,
    officialSourceUrl: "https://www.government.nl/government/members-of-cabinet",
    roleTitle: "Prime Minister",
    sortOrder: 18,
  },
  {
    contactEmail: null,
    contactLabel: "Presidency of Algeria",
    contactUrl: "https://www.el-mouradia.dz/en/",
    countryCode: "DZ",
    countryName: "Algeria",
    decisionMakerLabel: "President of Algeria",
    governmentName: "Government of Algeria",
    governmentWebsite: "https://www.el-mouradia.dz/en/",
    militaryBudgetUsd: 21_800_000_000,
    officialSourceUrl: "https://www.el-mouradia.dz/en/",
    roleTitle: "President",
    sortOrder: 19,
  },
];
