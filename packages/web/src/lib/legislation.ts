import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { cache } from "react";

export interface LegislationEntry {
  slug: string;
  title: string;
  summary: string;
  updatedAt: string;
}

const LEGISLATION_DIR = join(process.cwd(), "src", "data", "legislation");

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

export const getLegislationEntries = cache((): LegislationEntry[] => {
  return readdirSync(LEGISLATION_DIR)
    .filter((entry) => extname(entry) === ".md")
    .map((entry) => {
      const slug = entry.replace(/\.md$/, "");
      const fullPath = join(LEGISLATION_DIR, entry);
      const markdown = readFileSync(fullPath, "utf-8");

      return {
        slug,
        title: extractTitle(markdown, slug),
        summary: extractSummary(markdown),
        updatedAt: statSync(fullPath).mtime.toISOString(),
      };
    })
    .sort((left, right) => left.title.localeCompare(right.title));
});

export const getLegislationBySlug = cache((slug: string): LegislationEntry & { markdown: string } | null => {
  const fullPath = join(LEGISLATION_DIR, `${slug}.md`);

  try {
    const markdown = readFileSync(fullPath, "utf-8");
    return {
      slug,
      title: extractTitle(markdown, slug),
      summary: extractSummary(markdown),
      updatedAt: statSync(fullPath).mtime.toISOString(),
      markdown,
    };
  } catch {
    return null;
  }
});
