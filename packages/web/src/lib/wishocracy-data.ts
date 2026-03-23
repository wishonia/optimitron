/**
 * Budget categories for Wishocracy pairwise comparisons.
 *
 * Re-exports from @optimitron/data — the single source of truth for
 * priority items including Wishonia's voice, ROI data, and fiscal mappings.
 */

export {
  US_PRIORITY_ITEMS as BUDGET_CATEGORIES,
  getUSPriorityAllocations as getActualGovernmentAllocations,
} from '@optimitron/data';

export type { USPriorityItemId as BudgetCategoryId } from '@optimitron/data';
