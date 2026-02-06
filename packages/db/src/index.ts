/**
 * @optomitron/db
 *
 * Database client, Prisma types, and Zod validators for Optomitron
 */

export { PrismaClient } from '@prisma/client';
export type * from '@prisma/client';

// Zod validators for all models and enums
export * from './zod/index.js';
