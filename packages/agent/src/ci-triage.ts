export type CiFailureClassification =
  | "deterministic-code"
  | "flake"
  | "configuration"
  | "infrastructure"
  | "unknown";

export interface GitHubWorkflowRunSummary {
  event: string;
  headBranch: string;
  headSha: string;
  htmlUrl: string;
  id: number;
  name: string;
  runAttempt: number;
}

export interface GitHubWorkflowStepSummary {
  conclusion: string | null;
  name: string;
  number: number;
  status: string | null;
}

export interface GitHubWorkflowJobSummary {
  conclusion: string | null;
  htmlUrl: string;
  id: number;
  name: string;
  startedAt: string | null;
  steps: GitHubWorkflowStepSummary[];
}

export interface CiFailureTriageEntry {
  classification: CiFailureClassification;
  jobHtmlUrl: string;
  jobId: number;
  jobName: string;
  reproCommand: string | null;
  signature: string;
  snippet: string;
  stepName: string | null;
}

export interface CiTriageReport {
  autoRerunEligible: boolean;
  autoRerunReason: string;
  entries: CiFailureTriageEntry[];
  issueTitle: string;
  markdown: string;
  run: GitHubWorkflowRunSummary;
  summaryLine: string;
}

const SNIPPET_LINE_LIMIT = 28;
const SNIPPET_CHAR_LIMIT = 4000;

const CONFIGURATION_PATTERNS = [
  /missing github secret/i,
  /missing production environment secret/i,
  /missing git(hub)? variable/i,
  /no gemini api key/i,
  /nextauth_secret/i,
  /vercel_token/i,
  /permission denied/i,
  /resource not accessible by integration/i,
  /authentication failed/i,
  /forbidden/i,
  /could not resolve credentials/i,
];

const INFRASTRUCTURE_PATTERNS = [
  /econnreset/i,
  /etimedout/i,
  /socket hang up/i,
  /network.*timed out/i,
  /temporary failure/i,
  /service unavailable/i,
  /connection reset/i,
  /502 bad gateway/i,
  /503 service unavailable/i,
  /504 gateway timeout/i,
  /failed to connect/i,
  /the process '.*' failed with exit code 143/i,
];

const FLAKE_PATTERNS = [
  /test timeout/i,
  /timed out .* waiting/i,
  /playwright.*timeout/i,
  /browser.*disconnected/i,
  /retry this test/i,
  /context closed/i,
  /target page, context or browser has been closed/i,
];

function normalizeWhitespace(value: string) {
  return value.replace(/\r/g, "").trim();
}

function truncate(value: string, limit = SNIPPET_CHAR_LIMIT) {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit - 1).trimEnd()}…`;
}

export function getShortSha(sha: string) {
  return sha.slice(0, 7);
}

export function findFailedStep(job: GitHubWorkflowJobSummary) {
  return (
    job.steps.find((step) => step.conclusion === "failure") ??
    [...job.steps]
      .reverse()
      .find((step) => step.conclusion === "cancelled" || step.status === "completed") ??
    null
  );
}

function isInfrastructureStep(stepName: string | null) {
  return stepName !== null && /checkout|setup|install dependencies|cache|pull vercel/i.test(stepName);
}

export function inferReproCommand(jobName: string, stepName: string | null) {
  const step = stepName ?? "";

  if (/core-validate/i.test(jobName)) {
    if (/apply database migrations/i.test(step)) {
      return "pnpm db:deploy";
    }
    if (/build/i.test(step)) {
      return "pnpm --filter '!@optimitron/web' run build";
    }
    if (/typecheck/i.test(step)) {
      return "pnpm --filter '!@optimitron/web' run typecheck";
    }
    if (/lint/i.test(step)) {
      return "pnpm --filter '!@optimitron/web' run lint";
    }
    if (/test/i.test(step)) {
      return "pnpm --filter '!@optimitron/web' run test";
    }
  }

  if (/web-validate/i.test(jobName)) {
    if (/apply database migrations/i.test(step)) {
      return "pnpm db:deploy";
    }
    if (/typecheck web app/i.test(step)) {
      return "pnpm --filter @optimitron/web run typecheck";
    }
    if (/run web unit tests/i.test(step)) {
      return "pnpm --filter @optimitron/web run test";
    }
    if (/build web app/i.test(step)) {
      return "pnpm --filter @optimitron/web run build";
    }
    if (/run playwright web validation/i.test(step)) {
      return "pnpm --filter @optimitron/web run e2e";
    }
  }

  if (/deploy-production/i.test(jobName)) {
    if (/apply production database migrations/i.test(step)) {
      return "pnpm db:deploy";
    }
    if (/build vercel production artifact/i.test(step)) {
      return 'pnpm dlx vercel@$VERCEL_CLI_VERSION build --prod --token "$VERCEL_TOKEN"';
    }
    if (/deploy production artifact/i.test(step)) {
      return 'pnpm dlx vercel@$VERCEL_CLI_VERSION deploy --prebuilt --prod --token "$VERCEL_TOKEN" --yes';
    }
  }

  return null;
}

function looksLikeDeterministicCodeFailure(jobName: string, stepName: string | null) {
  const scope = `${jobName} ${stepName ?? ""}`;
  return /typecheck|lint|build|test|playwright|database migrations/i.test(scope);
}

export function classifyFailure(input: {
  jobName: string;
  snippet: string;
  stepName: string | null;
}): CiFailureClassification {
  const haystack = `${input.jobName}\n${input.stepName ?? ""}\n${input.snippet}`;

  if (CONFIGURATION_PATTERNS.some((pattern) => pattern.test(haystack))) {
    return "configuration";
  }

  if (isInfrastructureStep(input.stepName) && INFRASTRUCTURE_PATTERNS.some((pattern) => pattern.test(haystack))) {
    return "infrastructure";
  }

  if (FLAKE_PATTERNS.some((pattern) => pattern.test(haystack))) {
    return "flake";
  }

  if (INFRASTRUCTURE_PATTERNS.some((pattern) => pattern.test(haystack)) && !looksLikeDeterministicCodeFailure(input.jobName, input.stepName)) {
    return "infrastructure";
  }

  if (looksLikeDeterministicCodeFailure(input.jobName, input.stepName)) {
    return "deterministic-code";
  }

  return "unknown";
}

function findInterestingLineIndexes(lines: string[]) {
  const indexes = new Set<number>();
  const patterns = [
    /\berror\b/i,
    /\bfailed\b/i,
    /\bexception\b/i,
    /\bassert/i,
    /✖/,
    /\bpanic\b/i,
    /\btimeout\b/i,
  ];

  lines.forEach((line, index) => {
    if (patterns.some((pattern) => pattern.test(line))) {
      indexes.add(index);
    }
  });

  if (indexes.size === 0 && lines.length > 0) {
    indexes.add(lines.length - 1);
  }

  return [...indexes].sort((left, right) => left - right);
}

export function extractFailureSnippet(logText: string | null | undefined) {
  const normalized = normalizeWhitespace(logText ?? "");
  if (!normalized) {
    return "No job log snippet was available.";
  }

  const lines = normalized
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);
  const interestingIndexes = findInterestingLineIndexes(lines);
  const snippets: string[] = [];

  for (const index of interestingIndexes.slice(-2)) {
    const start = Math.max(0, index - 8);
    const end = Math.min(lines.length, index + 6);
    snippets.push(lines.slice(start, end).join("\n"));
  }

  const snippet = snippets.join("\n...\n");
  const limitedLines = snippet.split("\n").slice(-SNIPPET_LINE_LIMIT).join("\n");
  return truncate(limitedLines);
}

export function buildFailureSignature(input: {
  classification: CiFailureClassification;
  jobName: string;
  stepName: string | null;
  snippet: string;
}) {
  const firstSignal =
    input.snippet
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.length > 0 && /error|failed|timeout|exception|assert/i.test(line)) ??
    input.snippet.split("\n").map((line) => line.trim()).find((line) => line.length > 0) ??
    "no-snippet";

  return [
    input.classification,
    input.jobName,
    input.stepName ?? "unknown-step",
    firstSignal.replace(/\s+/g, " ").slice(0, 180),
  ].join(" :: ");
}

function formatClassificationLabel(classification: CiFailureClassification) {
  return classification.replace(/-/g, " ");
}

export function buildIssueTitle(run: GitHubWorkflowRunSummary) {
  return `CI triage: ${run.name} failed on ${run.headBranch} (${getShortSha(run.headSha)})`;
}

function getAutoRerunDecision(report: {
  entries: CiFailureTriageEntry[];
  run: GitHubWorkflowRunSummary;
}) {
  if (report.entries.length === 0) {
    return {
      eligible: false,
      reason: "No failed jobs were triaged.",
    };
  }

  if (report.run.runAttempt > 1) {
    return {
      eligible: false,
      reason: `Run attempt ${report.run.runAttempt} already consumed the automatic retry.`,
    };
  }

  if (
    report.entries.every(
      (entry) => entry.classification === "flake" || entry.classification === "infrastructure",
    )
  ) {
    return {
      eligible: true,
      reason: "All failed jobs look flaky or infrastructure-related, so one automatic retry is safe.",
    };
  }

  return {
    eligible: false,
    reason: "At least one failed job looks like a deterministic code or configuration issue.",
  };
}

export function buildTriageMarkdown(report: {
  autoRerunEligible: boolean;
  autoRerunReason: string;
  entries: CiFailureTriageEntry[];
  run: GitHubWorkflowRunSummary;
}) {
  const header = [
    `<!-- ci-triage:run:${report.run.id} -->`,
    `## CI Triage: ${report.run.name} failed`,
    "",
    `- Run: ${report.run.htmlUrl}`,
    `- Branch: \`${report.run.headBranch}\``,
    `- Commit: \`${getShortSha(report.run.headSha)}\``,
    `- Event: \`${report.run.event}\``,
    `- Attempt: ${report.run.runAttempt}`,
    `- Failed jobs: ${report.entries.length}`,
    `- Auto-rerun: ${report.autoRerunEligible ? "eligible" : "not eligible"} — ${report.autoRerunReason}`,
    "",
    "This is a machine-generated triage report. It does not patch code or merge changes.",
  ].join("\n");

  const body = report.entries
    .map((entry, index) => {
      return [
        "",
        `### ${index + 1}. ${entry.jobName}${entry.stepName ? ` -> ${entry.stepName}` : ""}`,
        `- Classification: \`${formatClassificationLabel(entry.classification)}\``,
        `- Job URL: ${entry.jobHtmlUrl}`,
        `- Repro: ${entry.reproCommand ? `\`${entry.reproCommand}\`` : "not inferred"}`,
        `- Signature: \`${entry.signature}\``,
        "",
        "```text",
        entry.snippet,
        "```",
      ].join("\n");
    })
    .join("\n");

  return `${header}\n${body}\n`;
}

export function buildCiTriageReport(input: {
  jobs: Array<GitHubWorkflowJobSummary & { logText?: string | null }>;
  run: GitHubWorkflowRunSummary;
}): CiTriageReport {
  const entries = input.jobs
    .filter((job) => job.conclusion === "failure")
    .map((job) => {
      const failedStep = findFailedStep(job);
      const snippet = extractFailureSnippet(job.logText);
      const classification = classifyFailure({
        jobName: job.name,
        snippet,
        stepName: failedStep?.name ?? null,
      });

      return {
        classification,
        jobHtmlUrl: job.htmlUrl,
        jobId: job.id,
        jobName: job.name,
        reproCommand: inferReproCommand(job.name, failedStep?.name ?? null),
        signature: buildFailureSignature({
          classification,
          jobName: job.name,
          snippet,
          stepName: failedStep?.name ?? null,
        }),
        snippet,
        stepName: failedStep?.name ?? null,
      } satisfies CiFailureTriageEntry;
    });

  const issueTitle = buildIssueTitle(input.run);
  const autoRerunDecision = getAutoRerunDecision({
    entries,
    run: input.run,
  });
  const markdown = buildTriageMarkdown({
    autoRerunEligible: autoRerunDecision.eligible,
    autoRerunReason: autoRerunDecision.reason,
    entries,
    run: input.run,
  });
  const summaryLine =
    entries.length === 0
      ? `${input.run.name} had no failed jobs to triage.`
      : `${input.run.name} failed with ${entries.length} triaged job${entries.length === 1 ? "" : "s"}.`;

  return {
    autoRerunEligible: autoRerunDecision.eligible,
    autoRerunReason: autoRerunDecision.reason,
    entries,
    issueTitle,
    markdown,
    run: input.run,
    summaryLine,
  };
}
