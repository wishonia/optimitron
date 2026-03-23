/**
 * Budget categories for Wishocracy pairwise comparisons.
 *
 * Re-exports from @optimitron/data — the single source of truth for
 * priority items including Wishonia's voice, ROI data, and fiscal mappings.
 *
 * IMPORTANT: Import from the specific dataset file, NOT from the barrel
 * '@optimitron/data'. The barrel re-exports csv-loader and other modules
 * that use Node.js built-ins (node:fs, node:url), which crash in the browser.
 */

export {
  DEFAULT_WISHOCRATIC_ITEMS as WISHOCRATIC_ITEMS,
  DEFAULT_WISHOCRATIC_ITEMS_JURISDICTION_CODE as DEFAULT_WISHOCRACY_JURISDICTION_CODE,
  getDefaultWishocraticAllocations as getActualGovernmentAllocations,
} from '@optimitron/data/dist/wishocratic-items-registry.js';

export type {
  DefaultWishocraticItemId as WishocraticItemId,
} from '@optimitron/data/dist/wishocratic-items-registry.js';
