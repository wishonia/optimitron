import { describe, it, expect } from 'vitest';
import {
  PolicyDomainSchema,
  OecdSpendingCategorySchema,
  PolicyDomainToOecdSpendingCategoryMapSchema,
  POLICY_DOMAIN_TO_OECD_SPENDING,
  getOecdSpendingCategories,
  type PolicyDomain,
  type OecdSpendingCategory,
} from '../src/policy-mapping.js';

// ─── PolicyDomainSchema ────────────────────────────────────────────────────

describe('PolicyDomainSchema', () => {
  const validDomains: PolicyDomain[] = [
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
  ];

  it('accepts all policy domains', () => {
    for (const domain of validDomains) {
      expect(PolicyDomainSchema.safeParse(domain).success).toBe(true);
    }
  });

  it('rejects invalid policy domains', () => {
    expect(PolicyDomainSchema.safeParse('health').success).toBe(false);
    expect(PolicyDomainSchema.safeParse('').success).toBe(false);
    expect(PolicyDomainSchema.safeParse(123).success).toBe(false);
  });

  it('has 16 policy domains', () => {
    expect(validDomains).toHaveLength(16);
  });
});

// ─── OecdSpendingCategorySchema ────────────────────────────────────────────

describe('OecdSpendingCategorySchema', () => {
  const validCategories: OecdSpendingCategory[] = [
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
  ];

  it('accepts all OECD spending categories', () => {
    for (const category of validCategories) {
      expect(OecdSpendingCategorySchema.safeParse(category).success).toBe(true);
    }
  });

  it('rejects invalid OECD spending categories', () => {
    expect(OecdSpendingCategorySchema.safeParse('healthcare').success).toBe(false);
    expect(OecdSpendingCategorySchema.safeParse('').success).toBe(false);
  });

  it('has 10 OECD spending categories', () => {
    expect(validCategories).toHaveLength(10);
  });
});

// ─── Mapping Schema ────────────────────────────────────────────────────────

describe('PolicyDomainToOecdSpendingCategoryMapSchema', () => {
  it('validates the default mapping', () => {
    const result = PolicyDomainToOecdSpendingCategoryMapSchema.safeParse(
      POLICY_DOMAIN_TO_OECD_SPENDING
    );
    expect(result.success).toBe(true);
  });
});

// ─── Lookup ────────────────────────────────────────────────────────────────

describe('getOecdSpendingCategories', () => {
  it('returns mapped categories for a domain', () => {
    expect(getOecdSpendingCategories('healthcare')).toEqual(['health']);
    expect(getOecdSpendingCategories('defense')).toEqual(['defense']);
  });

  it('returns a new array (no shared reference)', () => {
    const categories = getOecdSpendingCategories('education');
    expect(categories).toEqual(['education']);
    expect(categories).not.toBe(POLICY_DOMAIN_TO_OECD_SPENDING.education);
  });

  it('supports multi-category mappings', () => {
    expect(getOecdSpendingCategories('research_development')).toEqual(
      expect.arrayContaining(['economic_affairs', 'education'])
    );
  });
});
