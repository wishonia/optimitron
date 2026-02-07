import { z } from 'zod';

/**
 * Policy domain → OECD spending category mapping.
 *
 * OECD categories are based on the COFOG top-level functions.
 */

export const PolicyDomainSchema = z.enum([
  'healthcare',
  'education',
  'defense',
  'public_safety',
  'environment',
  'housing',
  'infrastructure',
  'social_welfare',
  'economy',
  'culture',
  'research_development',
  'agriculture',
  'energy',
  'transport',
  'labor_employment',
  'general_government',
]);

export type PolicyDomain = z.infer<typeof PolicyDomainSchema>;

export const OecdSpendingCategorySchema = z.enum([
  'general_public_services',
  'defense',
  'public_order_safety',
  'economic_affairs',
  'environmental_protection',
  'housing_community_amenities',
  'health',
  'recreation_culture_religion',
  'education',
  'social_protection',
]);

export type OecdSpendingCategory = z.infer<typeof OecdSpendingCategorySchema>;

export const PolicyDomainToOecdSpendingCategoryMapSchema = z.object({
  healthcare: z.array(OecdSpendingCategorySchema).nonempty(),
  education: z.array(OecdSpendingCategorySchema).nonempty(),
  defense: z.array(OecdSpendingCategorySchema).nonempty(),
  public_safety: z.array(OecdSpendingCategorySchema).nonempty(),
  environment: z.array(OecdSpendingCategorySchema).nonempty(),
  housing: z.array(OecdSpendingCategorySchema).nonempty(),
  infrastructure: z.array(OecdSpendingCategorySchema).nonempty(),
  social_welfare: z.array(OecdSpendingCategorySchema).nonempty(),
  economy: z.array(OecdSpendingCategorySchema).nonempty(),
  culture: z.array(OecdSpendingCategorySchema).nonempty(),
  research_development: z.array(OecdSpendingCategorySchema).nonempty(),
  agriculture: z.array(OecdSpendingCategorySchema).nonempty(),
  energy: z.array(OecdSpendingCategorySchema).nonempty(),
  transport: z.array(OecdSpendingCategorySchema).nonempty(),
  labor_employment: z.array(OecdSpendingCategorySchema).nonempty(),
  general_government: z.array(OecdSpendingCategorySchema).nonempty(),
});

export type PolicyDomainToOecdSpendingCategoryMap = z.infer<
  typeof PolicyDomainToOecdSpendingCategoryMapSchema
>;

export const POLICY_DOMAIN_TO_OECD_SPENDING: PolicyDomainToOecdSpendingCategoryMap = {
  healthcare: ['health'],
  education: ['education'],
  defense: ['defense'],
  public_safety: ['public_order_safety'],
  environment: ['environmental_protection'],
  housing: ['housing_community_amenities'],
  infrastructure: ['economic_affairs'],
  social_welfare: ['social_protection'],
  economy: ['economic_affairs'],
  culture: ['recreation_culture_religion'],
  research_development: ['economic_affairs', 'education'],
  agriculture: ['economic_affairs'],
  energy: ['economic_affairs'],
  transport: ['economic_affairs'],
  labor_employment: ['economic_affairs', 'social_protection'],
  general_government: ['general_public_services'],
};

/**
 * Lookup OECD spending categories for a given policy domain.
 */
export function getOecdSpendingCategories(
  domain: PolicyDomain,
  mapping: PolicyDomainToOecdSpendingCategoryMap = POLICY_DOMAIN_TO_OECD_SPENDING
): OecdSpendingCategory[] {
  return [...mapping[domain]];
}
