import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  // Load .env from the monorepo root (two levels up from packages/examples/)
  envDir: resolve(__dirname, '../..'),
  test: {
    globals: false,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
