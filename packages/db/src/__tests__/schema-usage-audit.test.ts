import { beforeAll, describe, expect, it } from "vitest";
import {
  generateSchemaUsageAudit,
  renderSchemaUsageAuditMarkdown,
  type SchemaUsageAuditReport,
} from "../schema-usage-audit";

describe("schema usage audit", () => {
  let report: SchemaUsageAuditReport;

  beforeAll(async () => {
    report = await generateSchemaUsageAudit();
  }, 30_000);

  it("classifies vote models as live runtime surface", () => {
    const citizenBillVote = report.models.find((model) => model.name === "CitizenBillVote");
    const referendumVote = report.models.find((model) => model.name === "ReferendumVote");

    expect(citizenBillVote).toBeDefined();
    expect(referendumVote).toBeDefined();
    expect(citizenBillVote?.classification).toBe("runtime-live");
    expect(referendumVote?.classification).toBe("runtime-live");
    expect(citizenBillVote?.directPrismaFiles).toBeGreaterThan(0);
    expect(referendumVote?.buckets["api-routes"].files).toBeGreaterThan(0);
  });

  it("flags missing first-class bill model only as a recommendation", () => {
    const citizenBill = report.missingModelCandidates.find((candidate) => candidate.name === "CitizenBill");

    expect(citizenBill).toBeDefined();
    expect(citizenBill?.classification).toBe("missing-first-class-model-candidate");
    expect(citizenBill?.evidenceFiles).toBeGreaterThanOrEqual(8);
  });

  it("detects notification naming ambiguity", () => {
    expect(
      report.namingConcerns.some(
        (concern) =>
          concern.models.includes("UserPreference") &&
          concern.models.includes("NotificationPreference"),
      ),
    ).toBe(true);
  });

  it("does not mark the task foundation as suspicious", () => {
    const task = report.models.find((model) => model.name === "Task");
    const taskImpactEstimateSet = report.models.find((model) => model.name === "TaskImpactEstimateSet");

    expect(task).toBeDefined();
    expect(taskImpactEstimateSet).toBeDefined();
    expect(task?.classification).not.toBe("suspicious");
    expect(taskImpactEstimateSet?.classification).not.toBe("suspicious");
  });

  it("ignores self-generated snapshot artifacts", () => {
    const snapshotReference = "packages/db/src/__tests__/__snapshots__/schema-usage-audit.test.ts.snap";
    const hasSnapshotReference = report.models.some((model) =>
      model.keyFiles.some((file) => file.path === snapshotReference),
    );

    expect(hasSnapshotReference).toBe(false);
  });

  it("renders deterministic markdown", () => {
    expect(renderSchemaUsageAuditMarkdown(report)).toMatchSnapshot();
  });
});
