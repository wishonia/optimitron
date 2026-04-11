import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

export type LegislationStatus = "draft" | "reviewed";

interface LegislationFrontmatter {
  title?: string;
  summary?: string;
  status?: string;
  category_id?: string;
  category_name?: string;
  model_country?: string;
  overspend_ratio?: string;
  us_rank?: string;
  potential_savings?: string;
  source_artifact?: string;
  generated_by?: string;
  generated_at?: string;
}

export interface LegislationEntry {
  slug: string;
  title: string;
  summary: string;
  updatedAt: string;
  status: LegislationStatus;
  categoryId?: string;
  categoryName?: string;
  modelCountry?: string;
  overspendRatio?: string;
  usRank?: string;
  potentialSavings?: string;
  generatedBy?: string;
  generatedAt?: string;
  sourceArtifact?: string;
  relativePath: string;
  editUrl: string;
  historyUrl: string;
}

interface ParsedLegislationFile {
  frontmatter: LegislationFrontmatter;
  body: string;
}

interface BuildEntryOptions {
  includeMarkdown?: boolean;
}

const currentCwd = process.cwd();
const WEB_ROOT = existsSync(join(currentCwd, "src", "app"))
  ? currentCwd
  : join(currentCwd, "packages", "web");
const REPO_ROOT = existsSync(join(currentCwd, "packages"))
  ? currentCwd
  : join(WEB_ROOT, "..", "..");
const REPO_PACKAGE_JSON = join(REPO_ROOT, "package.json");
const CONTENT_RELATIVE_DIR = "content/legislation";
const LEGISLATION_DIR = join(REPO_ROOT, CONTENT_RELATIVE_DIR);
const DEFAULT_REPOSITORY_URL = "https://github.com/mikepsinn/optimitron";

function getLegislationMarkdownFiles() {
  if (!existsSync(LEGISLATION_DIR)) {
    throw new Error(
      `Missing required legislation content directory: ${CONTENT_RELATIVE_DIR}. Run the content validation/build pipeline or restore the committed drafts.`,
    );
  }

  const entries = readdirSync(LEGISLATION_DIR).filter((entry) => extname(entry) === ".md");
  if (entries.length === 0) {
    throw new Error(
      `Legislation content directory is empty: ${CONTENT_RELATIVE_DIR}. Expected at least one markdown draft.`,
    );
  }

  return entries;
}

function parseFrontmatter(markdown: string): ParsedLegislationFile {
  if (!markdown.startsWith("---\n")) {
    return {
      frontmatter: {},
      body: markdown,
    };
  }

  const closing = markdown.indexOf("\n---\n", 4);
  if (closing === -1) {
    return {
      frontmatter: {},
      body: markdown,
    };
  }

  const rawFrontmatter = markdown.slice(4, closing);
  const body = markdown.slice(closing + 5);
  const frontmatter: LegislationFrontmatter = {};

  for (const line of rawFrontmatter.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^([a-z0-9_]+):\s*(.*)$/i);
    if (!match) continue;

    const [, key, rawValue] = match;
    const value = rawValue.replace(/^["']|["']$/g, "").trim();
    frontmatter[key as keyof LegislationFrontmatter] = value;
  }

  return {
    frontmatter,
    body,
  };
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(markdown: string, slug: string): string {
  const heading = markdown
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("#"));

  if (!heading) {
    return slug.replace(/-/g, " ");
  }

  return heading.replace(/^#+\s*/, "").trim();
}

function extractSummary(markdown: string): string {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const summaryLine = lines.find(
    (line) =>
      !line.startsWith("#") &&
      !line.startsWith("[") &&
      !line.startsWith("|") &&
      !line.startsWith("```"),
  );

  return summaryLine
    ? stripMarkdown(summaryLine)
    : "Evidence-based draft legislation generated from the Optimitron analysis pipeline.";
}

function getRepositoryBaseUrl(): string {
  try {
    const pkg = JSON.parse(readFileSync(REPO_PACKAGE_JSON, "utf-8")) as {
      repository?: { url?: string } | string;
    };

    const repositoryUrl =
      typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;

    if (!repositoryUrl) {
      return DEFAULT_REPOSITORY_URL;
    }

    return repositoryUrl.replace(/\.git$/, "");
  } catch {
    return DEFAULT_REPOSITORY_URL;
  }
}

function buildGitHubUrl(kind: "edit" | "commits", relativePath: string): string {
  return `${getRepositoryBaseUrl()}/${kind}/main/${relativePath}`;
}

function buildEntry(
  slug: string,
  fullPath: string,
  options?: BuildEntryOptions,
): LegislationEntry & { markdown?: string } {
  const rawMarkdown = readFileSync(fullPath, "utf-8");
  const parsed = parseFrontmatter(rawMarkdown);
  const relativePath = `${CONTENT_RELATIVE_DIR}/${slug}.md`;
  const title = parsed.frontmatter.title ?? extractTitle(parsed.body, slug);

  return {
    slug,
    title,
    summary: parsed.frontmatter.summary ?? extractSummary(parsed.body),
    updatedAt: statSync(fullPath).mtime.toISOString(),
    status: parsed.frontmatter.status === "reviewed" ? "reviewed" : "draft",
    categoryId: parsed.frontmatter.category_id,
    categoryName: parsed.frontmatter.category_name,
    modelCountry: parsed.frontmatter.model_country,
    overspendRatio: parsed.frontmatter.overspend_ratio,
    usRank: parsed.frontmatter.us_rank,
    potentialSavings: parsed.frontmatter.potential_savings,
    generatedBy: parsed.frontmatter.generated_by,
    generatedAt: parsed.frontmatter.generated_at,
    sourceArtifact: parsed.frontmatter.source_artifact,
    relativePath,
    editUrl: buildGitHubUrl("edit", relativePath),
    historyUrl: buildGitHubUrl("commits", relativePath),
    ...(options?.includeMarkdown ? { markdown: parsed.body } : {}),
  };
}

export function getLegislationEntries(): LegislationEntry[] {
  return getLegislationMarkdownFiles()
    .map((entry) => {
      const slug = entry.replace(/\.md$/, "");
      return buildEntry(slug, join(LEGISLATION_DIR, entry));
    })
    .sort((left, right) => left.title.localeCompare(right.title));
}

export function getLegislationBySlug(slug: string): (LegislationEntry & { markdown: string }) | null {
  const fullPath = join(LEGISLATION_DIR, `${slug}.md`);

  if (!existsSync(fullPath)) {
    return null;
  }

  return buildEntry(slug, fullPath, { includeMarkdown: true }) as LegislationEntry & {
    markdown: string;
  };
}
