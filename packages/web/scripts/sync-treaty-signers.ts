import "./load-env";
import { createHash } from "crypto";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { OrgType } from "@optimitron/db";
import { findOrCreateOrganization } from "../src/lib/organization.server";
import { prisma } from "../src/lib/prisma";
import { buildOnePercentTreatyPolicyModelRun } from "../src/lib/tasks/one-percent-treaty-policy-model";
import { upsertImportedTaskBundle } from "../src/lib/tasks/import-task-bundle.server";
import { syncTaskMilestones } from "../src/lib/tasks/milestones.server";
import { buildImportedTaskBundleFromPolicyModelRun } from "../src/lib/tasks/policy-model-run-to-imported-task-bundle";
import {
  buildTreatySignerImportDraft,
  buildTreatySupporterTaskDrafts,
  getTreatySignerTaskKey,
  TOP_TREATY_SIGNER_SLOTS,
  TREATY_DUE_AT,
} from "../src/lib/tasks/treaty-signer-network";
import {
  ensureTreatyParentTask,
  softDeleteMissingTreatySignerNetworkTasks,
  syncTreatySupporterTasks,
} from "../src/lib/tasks/treaty-program.server";
import { buildTreatySignerMilestones } from "../src/lib/tasks/treaty-milestones";

const DEFAULT_PARAMETERS_PATH = "E:/code/disease-eradication-plan/assets/json/parameters.json";

interface CliOptions {
  countryCodes: string[] | null;
  importDb: boolean;
  parametersPath: string;
  printJson: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const getValue = (prefix: string) =>
    argv.find((arg) => arg.startsWith(`${prefix}=`))?.slice(prefix.length + 1) ?? null;
  const countryCodeValue = getValue("--country-codes");

  return {
    countryCodes:
      countryCodeValue == null
        ? null
        : countryCodeValue
            .split(",")
            .map((value) => value.trim().toUpperCase())
            .filter(Boolean),
    importDb: argv.includes("--import-db"),
    parametersPath: getValue("--parameters") ?? DEFAULT_PARAMETERS_PATH,
    printJson: argv.includes("--print-json"),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const parametersPath = resolve(process.cwd(), options.parametersPath);
  const rawJson = await readFile(parametersPath, "utf8");
  const rawExport = JSON.parse(rawJson);
  const generatedAt = new Date().toISOString();
  const parameterSetHash = `sha256:${createHash("sha256").update(rawJson).digest("hex")}`;

  const baseRun = buildOnePercentTreatyPolicyModelRun(rawExport, {
    calculationVersion: "one-percent-treaty-compiler-v1",
    generatedAt,
    parameterSetHash,
  });
  const baseDraft = buildImportedTaskBundleFromPolicyModelRun(baseRun, {
    dueAt: TREATY_DUE_AT,
    impactStatement:
      "Thirty seconds for the signer. Civilizational downside if this stays overdue.",
    skillTags: ["diplomacy", "executive-action", "treaty-negotiation"],
  });

  const selectedSlots =
    options.countryCodes == null
      ? TOP_TREATY_SIGNER_SLOTS
      : TOP_TREATY_SIGNER_SLOTS.filter((slot) =>
          options.countryCodes?.includes(slot.countryCode),
        );

  if (selectedSlots.length === 0) {
    throw new Error("No treaty signer slots matched the requested filter.");
  }

  const drafts = selectedSlots.map((slot) => {
    const signerDraft = buildTreatySignerImportDraft({
      baseDraft,
      slot,
    });
    const supporterDrafts = buildTreatySupporterTaskDrafts(slot);

    return {
      signerDraft,
      slot,
      supporterDrafts,
    };
  });

  const summary = drafts.map(({ signerDraft, slot, supporterDrafts }) => {
    const frame = signerDraft.bundle.impactEstimate.frames[0];
    const annualRedirectMetric = frame?.metrics.find(
      (metric) => metric.metricKey === "annual_redirect_amount_usd",
    );

    return {
      annualRedirectAmountUsd: annualRedirectMetric?.baseValue ?? null,
      countryCode: slot.countryCode,
      countryName: slot.countryName,
      signerTaskKey: signerDraft.bundle.task.taskKey,
      supporterTaskCount: supporterDrafts.length,
      treatyTarget: slot.decisionMakerLabel,
    };
  });

  if (options.printJson || !options.importDb) {
    console.log(JSON.stringify(summary, null, 2));
  }

  if (!options.importDb) {
    console.log("skip db sync (pass --import-db to persist signer and supporter tasks)");
    return;
  }

  const parentTask = await ensureTreatyParentTask({
    jurisdictionId: null,
  });

  const liveTaskKeys: string[] = [];
  const persisted: Array<Record<string, unknown>> = [];

  for (const { signerDraft, slot, supporterDrafts } of drafts) {
    const organization = await findOrCreateOrganization({
      name: slot.governmentName,
      sourceRef: `organization:government:${slot.countryCode.toLowerCase()}`,
      sourceUrl: slot.officialSourceUrl ?? slot.contactUrl ?? slot.governmentWebsite,
      type: OrgType.GOVERNMENT,
      website: slot.governmentWebsite,
    });

    const result = await upsertImportedTaskBundle(signerDraft.bundle, {
      assigneeOrganizationId: organization.id,
      assigneePersonId: null,
      isPublic: true,
      jurisdictionId: null,
      parentTaskId: parentTask.id,
    });

    await prisma.task.update({
      where: {
        id: result.taskId,
      },
      data: {
        sortOrder: slot.sortOrder,
      },
    });

    await syncTaskMilestones(result.taskId, buildTreatySignerMilestones());
    await syncTreatySupporterTasks({
      assigneeOrganizationId: organization.id,
      parentTaskId: result.taskId,
      slot,
    });

    liveTaskKeys.push(
      getTreatySignerTaskKey(slot),
      ...supporterDrafts.map((draft) => draft.taskKey),
    );
    persisted.push({
      assigneeOrganizationId: organization.id,
      countryCode: slot.countryCode,
      signerTaskId: result.taskId,
      signerTaskKey: result.taskKey,
      supporterTaskKeys: supporterDrafts.map((draft) => draft.taskKey),
    });
  }

  if (options.countryCodes == null) {
    await softDeleteMissingTreatySignerNetworkTasks(liveTaskKeys);
  }

  console.log(
    JSON.stringify(
      {
        parentTaskId: parentTask.id,
        signerCount: persisted.length,
        synced: persisted,
      },
      null,
      2,
    ),
  );
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
