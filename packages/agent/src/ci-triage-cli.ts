import { mkdir, writeFile } from "fs/promises";
import { dirname, resolve } from "path";
import {
  buildCiTriageReport,
  type GitHubWorkflowJobSummary,
  type GitHubWorkflowRunSummary,
} from "./ci-triage.js";

interface CliOptions {
  jsonOutPath: string | null;
  markdownOutPath: string | null;
  repo: string;
  runId: number;
}

interface GitHubRunResponse {
  event: string;
  head_branch: string;
  head_sha: string;
  html_url: string;
  id: number;
  name: string;
  run_attempt: number;
}

interface GitHubJobsResponse {
  jobs: Array<{
    conclusion: string | null;
    html_url: string;
    id: number;
    name: string;
    started_at: string | null;
    steps: Array<{
      conclusion: string | null;
      name: string;
      number: number;
      status: string | null;
    }>;
  }>;
}

function parseArgs(argv: string[]): CliOptions {
  const getValue = (flag: string) => {
    const prefix = `${flag}=`;
    return argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) ?? null;
  };

  const runIdValue = getValue("--run-id") ?? process.env["WORKFLOW_RUN_ID"] ?? null;
  const repo = getValue("--repo") ?? process.env["GITHUB_REPOSITORY"] ?? null;

  if (!runIdValue || Number.isNaN(Number(runIdValue))) {
    throw new Error("Missing --run-id=<number> or WORKFLOW_RUN_ID.");
  }

  if (!repo) {
    throw new Error("Missing --repo=<owner/repo> or GITHUB_REPOSITORY.");
  }

  return {
    jsonOutPath: getValue("--json-out"),
    markdownOutPath: getValue("--markdown-out"),
    repo,
    runId: Number(runIdValue),
  };
}

function requireGitHubToken() {
  const token = process.env["GITHUB_TOKEN"] ?? process.env["GH_TOKEN"] ?? null;
  if (!token) {
    throw new Error("Missing GITHUB_TOKEN or GH_TOKEN.");
  }

  return token;
}

async function githubJson<T>(input: {
  repo: string;
  token: string;
  path: string;
}) {
  const response = await fetch(`https://api.github.com${input.path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${input.token}`,
      "User-Agent": "optimitron-ci-triage",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${input.path} failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function githubText(input: {
  repo: string;
  token: string;
  path: string;
}) {
  const response = await fetch(`https://api.github.com${input.path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${input.token}`,
      "User-Agent": "optimitron-ci-triage",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!/text|json|plain/i.test(contentType)) {
    return null;
  }

  return response.text();
}

function mapRun(response: GitHubRunResponse): GitHubWorkflowRunSummary {
  return {
    event: response.event,
    headBranch: response.head_branch,
    headSha: response.head_sha,
    htmlUrl: response.html_url,
    id: response.id,
    name: response.name,
    runAttempt: response.run_attempt,
  };
}

function mapJobs(response: GitHubJobsResponse): GitHubWorkflowJobSummary[] {
  return response.jobs.map((job) => ({
    conclusion: job.conclusion,
    htmlUrl: job.html_url,
    id: job.id,
    name: job.name,
    startedAt: job.started_at,
    steps: job.steps.map((step) => ({
      conclusion: step.conclusion,
      name: step.name,
      number: step.number,
      status: step.status,
    })),
  }));
}

async function writeOptionalFile(pathValue: string | null, contents: string) {
  if (!pathValue) {
    return;
  }

  const resolvedPath = resolve(process.cwd(), pathValue);
  await mkdir(dirname(resolvedPath), { recursive: true });
  await writeFile(resolvedPath, contents, "utf8");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const token = requireGitHubToken();
  const runResponse = await githubJson<GitHubRunResponse>({
    path: `/repos/${options.repo}/actions/runs/${options.runId}`,
    repo: options.repo,
    token,
  });
  const jobsResponse = await githubJson<GitHubJobsResponse>({
    path: `/repos/${options.repo}/actions/runs/${options.runId}/jobs?per_page=100`,
    repo: options.repo,
    token,
  });
  const jobs = mapJobs(jobsResponse);

  const jobsWithLogs = await Promise.all(
    jobs.map(async (job) => ({
      ...job,
      logText:
        job.conclusion === "failure"
          ? await githubText({
              path: `/repos/${options.repo}/actions/jobs/${job.id}/logs`,
              repo: options.repo,
              token,
            })
          : null,
    })),
  );

  const report = buildCiTriageReport({
    jobs: jobsWithLogs,
    run: mapRun(runResponse),
  });

  await writeOptionalFile(options.jsonOutPath, `${JSON.stringify(report, null, 2)}\n`);
  await writeOptionalFile(options.markdownOutPath, report.markdown);

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
