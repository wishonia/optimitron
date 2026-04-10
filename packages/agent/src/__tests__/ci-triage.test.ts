import { describe, expect, it } from "vitest";
import {
  buildCiTriageReport,
  buildFailureSignature,
  buildIssueTitle,
  classifyFailure,
  extractFailureSnippet,
  inferReproCommand,
  type GitHubWorkflowRunSummary,
} from "../ci-triage.js";

const baseRun: GitHubWorkflowRunSummary = {
  event: "pull_request",
  headBranch: "feature/ci-doctor",
  headSha: "abcdef1234567890",
  htmlUrl: "https://github.com/example/repo/actions/runs/123",
  id: 123,
  name: "CI",
  runAttempt: 1,
};

describe("ci triage", () => {
  it("infers repro commands for known CI steps", () => {
    expect(inferReproCommand("web-validate", "Run Playwright web validation")).toBe(
      "pnpm --filter @optimitron/web run e2e",
    );
    expect(inferReproCommand("core-validate", "Lint")).toBe(
      "pnpm --filter '!@optimitron/web' run lint",
    );
  });

  it("classifies configuration and flaky failures distinctly", () => {
    expect(
      classifyFailure({
        jobName: "deploy-production",
        snippet: "Missing production environment secret DATABASE_URL",
        stepName: "Verify production database configuration",
      }),
    ).toBe("configuration");

    expect(
      classifyFailure({
        jobName: "web-validate",
        snippet: "Test timeout of 30000ms exceeded while waiting for locator",
        stepName: "Run Playwright web validation",
      }),
    ).toBe("flake");
  });

  it("extracts a compact error-oriented snippet from logs", () => {
    const snippet = extractFailureSnippet([
      "some setup noise",
      "more noise",
      "Error: Cannot find module '@/lib/foo'",
      "at build step",
      "next line",
    ].join("\n"));

    expect(snippet).toContain("Error: Cannot find module");
    expect(snippet.split("\n").length).toBeLessThanOrEqual(28);
  });

  it("builds a structured report with markdown and signatures", () => {
    const report = buildCiTriageReport({
      jobs: [
        {
          conclusion: "failure",
          htmlUrl: "https://github.com/example/repo/actions/runs/123/job/456",
          id: 456,
          logText: "Error: Cannot find module '@/lib/foo'",
          name: "web-validate",
          startedAt: "2026-04-10T00:00:00Z",
          steps: [
            {
              conclusion: "success",
              name: "Checkout",
              number: 1,
              status: "completed",
            },
            {
              conclusion: "failure",
              name: "Typecheck web app",
              number: 2,
              status: "completed",
            },
          ],
        },
      ],
      run: baseRun,
    });

    expect(report.issueTitle).toBe(buildIssueTitle(baseRun));
    expect(report.entries[0]?.classification).toBe("deterministic-code");
    expect(report.entries[0]?.signature).toBe(
      buildFailureSignature({
        classification: "deterministic-code",
        jobName: "web-validate",
        snippet: "Error: Cannot find module '@/lib/foo'",
        stepName: "Typecheck web app",
      }),
    );
    expect(report.markdown).toContain("<!-- ci-triage:run:123 -->");
    expect(report.autoRerunEligible).toBe(false);
    expect(report.markdown).toContain("Auto-rerun: not eligible");
    expect(report.markdown).toContain("pnpm --filter @optimitron/web run typecheck");
    expect(report.summaryLine).toContain("1 triaged job");
  });

  it("marks flake-only first attempts as auto-rerun eligible", () => {
    const report = buildCiTriageReport({
      jobs: [
        {
          conclusion: "failure",
          htmlUrl: "https://github.com/example/repo/actions/runs/123/job/789",
          id: 789,
          logText: "Test timeout of 30000ms exceeded while waiting for locator",
          name: "web-validate",
          startedAt: "2026-04-10T00:00:00Z",
          steps: [
            {
              conclusion: "failure",
              name: "Run Playwright web validation",
              number: 1,
              status: "completed",
            },
          ],
        },
      ],
      run: {
        ...baseRun,
        runAttempt: 1,
      },
    });

    expect(report.autoRerunEligible).toBe(true);
    expect(report.autoRerunReason).toContain("automatic retry is safe");
  });
});
