import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@optimitron/data': path.resolve(__dirname, '../data/src/index.ts'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
