/**
 * Validated environment variables for data fetchers.
 *
 * All API keys are optional — fetchers gracefully degrade when keys are
 * missing (return empty arrays, log warnings). This keeps CI and tests
 * working without secrets while scripts that need real data fail fast
 * with a clear Zod error if a key is malformed.
 *
 * Usage:  `import { dataEnv } from '../env';`
 *         `const key = dataEnv.FRED_API_KEY;  // string | undefined`
 */
import { z } from 'zod';

const schema = z.object({
  FRED_API_KEY: z.string().min(1).optional(),
  CONGRESS_API_KEY: z.string().min(1).optional(),
});

export type DataEnv = z.infer<typeof schema>;

/**
 * Proxy that validates + reads `process.env` on every property access.
 * No caching — tests that mutate `process.env` between assertions see
 * the current values.
 */
export const dataEnv: DataEnv = new Proxy({} as DataEnv, {
  get(_target, prop: string) {
    return schema.parse(process.env)[prop as keyof DataEnv];
  },
});
