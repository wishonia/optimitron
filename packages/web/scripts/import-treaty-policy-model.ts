import "./load-env";
import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, resolve } from "path";
import { TaskCategory, TaskClaimPolicy, TaskDifficulty, TaskStatus } from "@optimitron/db";
import { buildOnePercentTreatyPolicyModelRun } from "../src/lib/tasks/one-percent-treaty-policy-model";
import { buildImportedTaskBundleFromPolicyModelRun } from "../src/lib/tasks/policy-model-run-to-imported-task-bundle";

const DEFAULT_PARAMETERS_PATH = "E:/code/disease-eradication-plan/assets/json/parameters.json";
const DEFAULT_OUTPUT_PATH = "tmp/one-percent-treaty-policy-model-run.json";
const TREATY_PARENT_TASK_KEY = "program:one-percent-treaty:ratify";

interface CliOptions {
  importDb: boolean;
  outputPath: string | null;
  parametersPath: string;
  printJson: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const getValue = (prefix: string) =>
    argv.find((arg) => arg.startsWith(`${prefix}=`))?.slice(prefix.length + 1) ?? null;

  return {
    importDb: argv.includes("--import-db"),
    outputPath: getValue("--output"),
    parametersPath: getValue("--parameters") ?? DEFAULT_PARAMETERS_PATH,
    printJson: argv.includes("--print-json"),
  };
}

async function resolveJurisdictionId(
  requestedJurisdictionId: string,
) {
  const { prisma } = await import("../src/lib/prisma");
  const record = await prisma.jurisdiction.findUnique({
    where: {
      id: requestedJurisdictionId,
    },
    select: {
      id: true,
    },
  });

  return record?.id ?? null;
}

async function ensureTreatyParentTask(input: {
  jurisdictionId: string | null;
}) {
  const { prisma } = await import("../src/lib/prisma");

  return prisma.task.upsert({
    where: {
      taskKey: TREATY_PARENT_TASK_KEY,
    },
    update: {
      category: TaskCategory.GOVERNANCE,
      claimPolicy: TaskClaimPolicy.ASSIGNED_ONLY,
      description:
        "Coordinate signature and ratification of the 1% Treaty across national leaders, then keep public pressure on every outstanding signer until the treaty is real.",
      difficulty: TaskDifficulty.EXPERT,
      interestTags: ["treaty", "disease-eradication", "peace-dividend"],
      isPublic: true,
      jurisdictionId: input.jurisdictionId,
      skillTags: ["organizing", "diplomacy", "public-pressure"],
      sortOrder: -100,
      status: TaskStatus.ACTIVE,
      title: "Ratify the 1% Treaty",
    },
    create: {
      category: TaskCategory.GOVERNANCE,
      claimPolicy: TaskClaimPolicy.ASSIGNED_ONLY,
      description:
        "Coordinate signature and ratification of the 1% Treaty across national leaders, then keep public pressure on every outstanding signer until the treaty is real.",
      difficulty: TaskDifficulty.EXPERT,
      interestTags: ["treaty", "disease-eradication", "peace-dividend"],
      isPublic: true,
      jurisdictionId: input.jurisdictionId,
      skillTags: ["organizing", "diplomacy", "public-pressure"],
      sortOrder: -100,
      status: TaskStatus.ACTIVE,
      taskKey: TREATY_PARENT_TASK_KEY,
      title: "Ratify the 1% Treaty",
    },
    select: {
      id: true,
      taskKey: true,
      title: true,
    },
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const parametersPath = resolve(process.cwd(), options.parametersPath);
  const rawJson = await readFile(parametersPath, "utf8");
  const rawExport = JSON.parse(rawJson);
  const generatedAt = new Date().toISOString();
  const parameterSetHash = `sha256:${createHash("sha256").update(rawJson).digest("hex")}`;
  const run = buildOnePercentTreatyPolicyModelRun(rawExport, {
    calculationVersion: "one-percent-treaty-compiler-v1",
    generatedAt,
    parameterSetHash,
  });
  const imported = buildImportedTaskBundleFromPolicyModelRun(run, {
    impactStatement:
      "Thirty seconds for the signer. Civilizational upside if completed.",
    skillTags: ["diplomacy", "executive-action", "treaty-negotiation"],
  });
  const outputPath = resolve(
    process.cwd(),
    options.outputPath ?? DEFAULT_OUTPUT_PATH,
  );

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(run, null, 2)}\n`, "utf8");
  console.log(`wrote policy model run -> ${outputPath}`);

  if (options.printJson) {
    console.log(JSON.stringify(run, null, 2));
  }

  if (!options.importDb) {
    console.log("skip db import (pass --import-db to persist task + impact data)");
    return;
  }

  const [{ upsertImportedTaskBundle }, { findOrCreatePerson }] = await Promise.all([
    import("../src/lib/tasks/import-task-bundle.server"),
    import("../src/lib/person.server"),
  ]);

  const assigneePerson =
    imported.assigneeHint == null
      ? null
      : await findOrCreatePerson({
          currentAffiliation: imported.assigneeHint.currentAffiliation,
          displayName: imported.assigneeHint.displayName,
          isPublicFigure: imported.assigneeHint.isPublicFigure,
          sourceRef: imported.assigneeHint.actorKey,
          sourceUrl:
            imported.bundle.sourceArtifacts.find((artifact) => artifact.sourceSystem === "MANUAL")
              ?.sourceUrl ?? null,
        });

  const jurisdictionId = await resolveJurisdictionId(run.policy.jurisdictionId);

  if (!jurisdictionId) {
    console.warn(
      `warning: jurisdiction ${run.policy.jurisdictionId} not found locally; importing task without jurisdiction link`,
    );
  }

  const parentTask = await ensureTreatyParentTask({
    jurisdictionId,
  });

  const result = await upsertImportedTaskBundle(imported.bundle, {
    assigneePersonId: assigneePerson?.id ?? null,
    isPublic: true,
    jurisdictionId,
  });
  const { prisma } = await import("../src/lib/prisma");
  await prisma.task.update({
    where: {
      id: result.taskId,
    },
    data: {
      parentTaskId: parentTask.id,
      sortOrder: 0,
    },
  });

  console.log(
    JSON.stringify(
      {
        assigneePersonId: assigneePerson?.id ?? null,
        estimateSetId: result.estimateSetId,
        parentTaskId: parentTask.id,
        taskId: result.taskId,
        taskKey: result.taskKey,
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
