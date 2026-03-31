import { describe, expect, it } from "vitest";
import {
  applyEnvEntries,
  formatDbCliOutput,
  parseDbCliArgs,
  parseEnvFile,
  resolveDatabaseUrl,
} from "../db-cli";

describe("parseEnvFile", () => {
  it("reads key value pairs and ignores comments", () => {
    const entries = parseEnvFile(`
# comment
DATABASE_URL="postgres://root"
NEXTAUTH_SECRET=test-secret
`);

    expect(entries).toEqual({
      DATABASE_URL: "postgres://root",
      NEXTAUTH_SECRET: "test-secret",
    });
  });
});

describe("applyEnvEntries", () => {
  it("preserves existing values when override is false", () => {
    const target = {
      DATABASE_URL: "postgres://shell",
    };

    applyEnvEntries(target, { DATABASE_URL: "postgres://root" }, false);

    expect(target.DATABASE_URL).toBe("postgres://shell");
  });

  it("replaces existing values when override is true", () => {
    const target = {
      DATABASE_URL: "postgres://root",
    };

    applyEnvEntries(target, { DATABASE_URL: "postgres://package" }, true);

    expect(target.DATABASE_URL).toBe("postgres://package");
  });
});

describe("resolveDatabaseUrl", () => {
  it("matches Prisma config precedence", () => {
    const databaseUrl = resolveDatabaseUrl(
      { DATABASE_URL: "postgres://shell" },
      { DATABASE_URL: "postgres://root" },
      { DATABASE_URL: "postgres://package" },
    );

    expect(databaseUrl).toBe("postgres://package");
  });

  it("throws when DATABASE_URL is unavailable", () => {
    expect(() => resolveDatabaseUrl({}, {}, {})).toThrow("DATABASE_URL is not set");
  });
});

describe("parseDbCliArgs", () => {
  it("parses query mode with inline sql", () => {
    expect(parseDbCliArgs(["query", "select", "1"])).toEqual({
      mode: "query",
      sqlArg: "select 1",
    });
  });

  it("rejects unknown commands", () => {
    expect(() => parseDbCliArgs(["status"])).toThrow("Usage: pnpm db:cli");
  });
});

describe("formatDbCliOutput", () => {
  it("serializes bigint values as strings", () => {
    expect(formatDbCliOutput([{ count: BigInt(2) }])).toBe(
      '[\n  {\n    "count": "2"\n  }\n]',
    );
  });
});
