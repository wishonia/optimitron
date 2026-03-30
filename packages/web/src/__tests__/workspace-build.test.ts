import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

interface WebPackageJson {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
}

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const webPackageJsonPath = path.resolve(testDirectory, "../../package.json");
const webPackageJson = JSON.parse(
  readFileSync(webPackageJsonPath, "utf-8"),
) as WebPackageJson;

describe("build:workspace-deps", () => {
  it("builds the Wishonia widget before Next.js resolves it", () => {
    expect(webPackageJson.dependencies?.["@optimitron/wishonia-widget"]).toBe(
      "workspace:^",
    );
    expect(webPackageJson.scripts?.["build:workspace-deps"]).toContain(
      "--filter @optimitron/wishonia-widget",
    );
  });
});
