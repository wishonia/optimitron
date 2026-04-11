import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

const currentDir = dirname(fileURLToPath(import.meta.url));

loadEnv({ path: resolve(currentDir, "../../.env") });
loadEnv({ path: resolve(currentDir, ".env"), override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations need a direct (non-pooled) connection for advisory locks.
    // Fall back to DATABASE_URL for generate and other non-migrate commands.
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "",
  },
});
