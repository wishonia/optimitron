import "./load-env";

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  reviewEarthQueueAndBuildSystemImprovements,
  type TaskTreeNode,
} from "@optimitron/agent";
import {
  OrgType,
  SourceArtifactType,
  SourceSystem,
  TaskCategory,
  TaskClaimPolicy,
  TaskDifficulty,
  TaskImpactEstimateKind,
  TaskImpactFrameKey,
  TaskImpactPublicationStatus,
  TaskStatus,
} from "@optimitron/db";
import type { ImportedTaskBundle } from "../src/lib/tasks/opg-obg-adapters";
import { upsertImportedTaskBundle } from "../src/lib/tasks/import-task-bundle.server";
import * as tasks from "../src/lib/tasks.server";
import { syncTreatySigners } from "./sync-treaty-signers";

interface ParsedArgs {
  outPath: string | null;
}

function parseArgs(argv: string[]): ParsedArgs {
  let outPath: string | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--out") {
      outPath = argv[index + 1] ?? null;
      index += 1;
    }
  }

  return { outPath };
}

function toSourceKey(value: string) {
  return value.replace(/[^a-z0-9:-]+/gi, "-").toLowerCase();
}

function inferCategory(node: TaskTreeNode) {
  const taskKey = node.taskKey ?? "";
  const title = node.title.toLowerCase();

  if (taskKey.includes("growth") || title.includes("website") || title.includes("conversion")) {
    return TaskCategory.COMMUNICATION;
  }

  if (taskKey.includes("contact-discovery") || title.includes("contact-discovery")) {
    return TaskCategory.RESEARCH;
  }

  return TaskCategory.TECHNICAL;
}

function inferDifficulty(node: TaskTreeNode) {
  const effort = node.estimatedEffortHours ?? 0;
  if (effort >= 4) {
    return TaskDifficulty.ADVANCED;
  }
  if (effort >= 2) {
    return TaskDifficulty.INTERMEDIATE;
  }
  return TaskDifficulty.BEGINNER;
}

function inferTags(node: TaskTreeNode) {
  const title = node.title.toLowerCase();
  const taskKey = node.taskKey ?? "";

  if (taskKey.includes("expand-treaty-signer-roster")) {
    return {
      interestTags: ["treaty", "queue-quality", "system-improvement"],
      skillTags: ["typescript", "data-pipeline", "task-generation", "policy-analysis"],
    };
  }

  if (taskKey.includes("growth") || title.includes("website") || title.includes("conversion")) {
    return {
      interestTags: ["growth", "conversion", "distribution"],
      skillTags: ["copywriting", "growth", "web-ui", "conversion-rate-optimization"],
    };
  }

  if (taskKey.includes("contact-discovery")) {
    return {
      interestTags: ["outreach", "coalition-building", "journalism"],
      skillTags: ["research", "contact-discovery", "journalism", "organizing"],
    };
  }

  return {
    interestTags: ["optimize-earth", "system-improvement", "task-ranking"],
    skillTags: ["typescript", "systems-design", "task-ranking", "queue-governance"],
  };
}

function buildImportedTaskBundleFromNode(node: TaskTreeNode): ImportedTaskBundle {
  const estimatedEffortHours = Math.max(node.estimatedEffortHours ?? 1, 0.1);
  const expectedValuePerHourUsd = node.impact?.expectedValuePerHourUsd ?? null;
  const expectedEconomicValueUsdBase =
    expectedValuePerHourUsd == null ? null : expectedValuePerHourUsd * estimatedEffortHours;
  const tags = inferTags(node);
  const taskKey = node.taskKey ?? `system:bootstrap:${toSourceKey(node.id)}`;
  const primarySourceUrl = node.sourceUrls?.[0] ?? null;
  const hasChildren = (node.children?.length ?? 0) > 0;

  return {
    impactEstimate: {
      assumptionsJson: {
        bootstrapSource: "optimize-earth-bootstrap",
        taskTreeNodeId: node.id,
      },
      calculationVersion: "optimize-earth-bootstrap-v1",
      counterfactualKey: "current-queue",
      estimateKind: TaskImpactEstimateKind.FORECAST,
      frames: [
        {
          adoptionRampYears: 0,
          annualDiscountRate: 0.03,
          benefitDurationYears: 20,
          customFrameLabel: null,
          delayDalysLostPerDayBase: node.impact?.delayDalysLostPerDay ?? null,
          delayDalysLostPerDayHigh: null,
          delayDalysLostPerDayLow: null,
          delayEconomicValueUsdLostPerDayBase:
            node.impact?.delayEconomicValueUsdLostPerDay ?? null,
          delayEconomicValueUsdLostPerDayHigh: null,
          delayEconomicValueUsdLostPerDayLow: null,
          estimatedCashCostUsdBase: null,
          estimatedCashCostUsdHigh: null,
          estimatedCashCostUsdLow: null,
          estimatedEffortHoursBase: estimatedEffortHours,
          estimatedEffortHoursHigh: null,
          estimatedEffortHoursLow: null,
          evaluationHorizonYears: 20,
          expectedDalysAvertedBase: null,
          expectedDalysAvertedHigh: null,
          expectedDalysAvertedLow: null,
          expectedEconomicValueUsdBase,
          expectedEconomicValueUsdHigh: null,
          expectedEconomicValueUsdLow: null,
          frameKey: TaskImpactFrameKey.TWENTY_YEAR,
          frameSlug: "twenty-year",
          medianHealthyLifeYearsEffectBase: null,
          medianHealthyLifeYearsEffectHigh: null,
          medianHealthyLifeYearsEffectLow: null,
          medianIncomeGrowthEffectPpPerYearBase: null,
          medianIncomeGrowthEffectPpPerYearHigh: null,
          medianIncomeGrowthEffectPpPerYearLow: null,
          metrics: [
            {
              baseValue: node.impact?.delayEconomicValueUsdLostPerDay ?? null,
              displayGroup: "optimize-earth",
              highValue: null,
              lowValue: null,
              metadataJson: {
                displayName: "Delay cost per day",
              },
              metricKey: "delay_economic_value_usd_lost_per_day",
              summaryStatsJson: null,
              unit: "USD/day",
              valueJson: null,
            },
            {
              baseValue: expectedValuePerHourUsd,
              displayGroup: "optimize-earth",
              highValue: null,
              lowValue: null,
              metadataJson: {
                displayName: "Expected value per hour",
              },
              metricKey: "expected_value_per_hour_usd",
              summaryStatsJson: null,
              unit: "USD/hour",
              valueJson: null,
            },
          ],
          successProbabilityBase: 0.6,
          successProbabilityHigh: null,
          successProbabilityLow: null,
          summaryStatsJson: null,
          timeToImpactStartDays: 0,
        },
      ],
      methodologyKey: "optimize-earth-bootstrap",
      parameterSetHash: "sha256:optimize-earth-bootstrap-v1",
      publicationStatus: TaskImpactPublicationStatus.REVIEWED,
      sourceSystem: SourceSystem.MANUAL,
    },
    sourceArtifacts: [
      {
        artifactType: SourceArtifactType.MANUAL_SECTION,
        contentHash: null,
        externalKey: null,
        payloadJson: {
          taskTreeNodeId: node.id,
          taskTreeTaskKey: taskKey,
        },
        sourceKey: `manual:optimize-earth-bootstrap:${toSourceKey(taskKey)}`,
        sourceRef: taskKey,
        sourceSystem: SourceSystem.MANUAL,
        sourceUrl: primarySourceUrl,
        title: `Optimize Earth bootstrap: ${node.title}`,
        versionKey: "v1",
      },
      ...(node.sourceUrls ?? []).map((sourceUrl, index) => ({
        artifactType: SourceArtifactType.EXTERNAL_SOURCE,
        contentHash: null,
        externalKey: null,
        payloadJson: {
          taskTreeNodeId: node.id,
        },
        sourceKey: `external:optimize-earth-bootstrap:${toSourceKey(taskKey)}:${index}`,
        sourceRef: sourceUrl,
        sourceSystem: SourceSystem.EXTERNAL,
        sourceUrl,
        title: `${node.title} source ${index + 1}`,
        versionKey: "current",
      })),
    ],
    task: {
      assigneeAffiliationSnapshot: "Optimize Earth System",
      assigneeOrganizationName: "Optimitron",
      assigneeOrganizationSourceRef: "organization:optimitron",
      assigneeOrganizationType: OrgType.COMPANY,
      category: inferCategory(node),
      claimPolicy: hasChildren ? TaskClaimPolicy.ASSIGNED_ONLY : TaskClaimPolicy.OPEN_MANY,
      contextJson: {
        optimizeEarthBootstrap: true,
        sourceUrls: node.sourceUrls ?? [],
        taskTreeNodeId: node.id,
      },
      contactLabel: null,
      contactTemplate: null,
      contactUrl: node.contactUrl ?? null,
      description:
        node.description ??
        "Repair the Optimize Earth queue so getNextTask surfaces the real frontier.",
      difficulty: inferDifficulty(node),
      dueAt: null,
      estimatedEffortHours,
      impactStatement: node.description ?? node.title,
      interestTags: tags.interestTags,
      roleTitle: node.roleTitle ?? "System Operator",
      skillTags: tags.skillTags,
      status: TaskStatus.ACTIVE,
      taskKey,
      title: node.title,
    },
  };
}

async function syncSystemTaskNode(
  node: TaskTreeNode,
  parentTaskId: string | null,
  promotableRefs: Set<string>,
  results: Array<{ taskId: string; taskKey: string; title: string }>,
) {
  if (!promotableRefs.has(node.id)) {
    return;
  }

  const bundle = buildImportedTaskBundleFromNode(node);
  const result = await upsertImportedTaskBundle(bundle, {
    isPublic: node.isPublic !== false,
    parentTaskId,
  });

  results.push({
    taskId: result.taskId,
    taskKey: result.taskKey,
    title: bundle.task.title,
  });

  for (const child of node.children ?? []) {
    await syncSystemTaskNode(child, result.taskId, promotableRefs, results);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  await syncTreatySigners({
    countryCodes: null,
    importDb: true,
    parametersPath: "E:/code/disease-eradication-plan/assets/json/parameters.json",
    printJson: false,
    roster: "full",
  });

  const liveTasks = await tasks.listTasks({
    limit: 5000,
    status: TaskStatus.ACTIVE,
    visibility: "public",
  });
  const review = reviewEarthQueueAndBuildSystemImprovements(liveTasks);
  const promotableRefs = new Set(
    review.proposal.review.decisions
      .filter((decision) => decision.promotable)
      .map((decision) => decision.proposalRef),
  );

  const importedSystemTasks: Array<{ taskId: string; taskKey: string; title: string }> = [];
  for (const root of review.roots) {
    await syncSystemTaskNode(root, null, promotableRefs, importedSystemTasks);
  }

  const refreshedTasks = await tasks.listTasks({
    limit: 5000,
    status: TaskStatus.ACTIVE,
    visibility: "public",
  });

  const summary = {
    activePublicTaskCount: refreshedTasks.length,
    promotableSystemTaskCount: promotableRefs.size,
    queueAuditIssues: review.audit.issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      severity: issue.severity,
    })),
    syncedSystemTasks: importedSystemTasks,
    treatySignerCount: refreshedTasks.filter((task) =>
      (task.taskKey ?? "").startsWith("program:one-percent-treaty:signer:"),
    ).length,
  };

  if (args.outPath) {
    const outputPath = resolve(process.cwd(), args.outPath);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
    console.log(`Wrote optimize-earth bootstrap summary to ${outputPath}`);
    return;
  }

  console.log(JSON.stringify(summary, null, 2));
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
