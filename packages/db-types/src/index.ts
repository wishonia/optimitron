/**
 * @optomitron/db-types
 *
 * Prisma-aligned DTOs and mapping helpers for persistence boundaries.
 * This package depends on Prisma types and domain types, but domain
 * packages do NOT depend on this package (no circular dependency).
 */

import type {
  Prisma,
  Jurisdiction,
  Item,
  PairwiseComparison,
  PreferenceWeight,
} from '@optomitron/db';
import type {
  Jurisdiction as OpgJurisdiction,
  JurisdictionType as OpgJurisdictionType,
} from '@optomitron/opg';
import type {
  Item as WishocracyItem,
  PairwiseComparison as WishocracyComparison,
  PreferenceWeight as WishocracyWeight,
} from '@optomitron/wishocracy';

// ---------------------------------------------------------------------------
// Prisma type re-exports
// ---------------------------------------------------------------------------

export type { Prisma };
export type DbJurisdiction = Jurisdiction;
export type DbItem = Item;
export type DbPairwiseComparison = PairwiseComparison;
export type DbPreferenceWeight = PreferenceWeight;

// ---------------------------------------------------------------------------
// Mapping: Prisma → Domain
// ---------------------------------------------------------------------------

export function toOpgJurisdiction(db: DbJurisdiction): OpgJurisdiction {
  return {
    id: db.id,
    name: db.name,
    type: mapJurisdictionType(db.type),
    parentId: db.parentId ?? undefined,
    isoCode: db.code ?? undefined,
    population: db.population ?? undefined,
  };
}

export function toWishocracyItem(db: DbItem): WishocracyItem {
  return {
    id: db.id,
    name: db.name,
    description: db.description ?? undefined,
    category: db.category ?? undefined,
    currentAllocationUsd: db.currentAllocationUsd ?? undefined,
    currentAllocationPct: db.currentAllocationPct ?? undefined,
  };
}

export function toWishocracyComparison(
  db: DbPairwiseComparison,
): WishocracyComparison {
  return {
    id: db.id,
    participantId: db.participantId,
    itemAId: db.itemAId,
    itemBId: db.itemBId,
    allocationA: db.allocationA,
    timestamp: db.createdAt.toISOString(),
    responseTimeMs: db.responseTimeMs ?? undefined,
  };
}

export function toWishocracyWeight(db: DbPreferenceWeight): WishocracyWeight {
  return {
    itemId: db.itemId,
    weight: db.weight,
    rank: db.rank,
    ciLow: db.ciLow ?? undefined,
    ciHigh: db.ciHigh ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Mapping: Domain → Prisma input
// ---------------------------------------------------------------------------

export function toPrismaJurisdictionCreate(
  input: OpgJurisdiction,
): Prisma.JurisdictionCreateInput {
  return {
    name: input.name,
    type: mapJurisdictionTypeToDb(input.type),
    code: input.isoCode ?? undefined,
    population: input.population ?? undefined,
  };
}

export function toPrismaItemCreate(
  input: WishocracyItem,
  jurisdictionId: string,
): Prisma.ItemCreateInput {
  return {
    jurisdiction: { connect: { id: jurisdictionId } },
    name: input.name,
    description: input.description ?? undefined,
    category: input.category ?? undefined,
    currentAllocationUsd: input.currentAllocationUsd ?? undefined,
    currentAllocationPct: input.currentAllocationPct ?? undefined,
    active: true,
  };
}

export function toPrismaComparisonCreate(
  input: WishocracyComparison,
): Prisma.PairwiseComparisonCreateInput {
  return {
    participant: { connect: { id: input.participantId } },
    itemA: { connect: { id: input.itemAId } },
    itemB: { connect: { id: input.itemBId } },
    allocationA: input.allocationA,
    responseTimeMs: input.responseTimeMs ?? undefined,
  };
}

export function toPrismaPreferenceWeightCreate(
  input: WishocracyWeight,
  runId: string,
): Prisma.PreferenceWeightCreateInput {
  return {
    run: { connect: { id: runId } },
    item: { connect: { id: input.itemId } },
    weight: input.weight,
    rank: input.rank,
    ciLow: input.ciLow ?? undefined,
    ciHigh: input.ciHigh ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function mapJurisdictionType(dbType: DbJurisdiction['type']): OpgJurisdictionType {
  switch (dbType) {
    case 'CITY': return 'city';
    case 'COUNTY': return 'county';
    case 'STATE': return 'state';
    case 'COUNTRY': return 'country';
    default: return 'country';
  }
}

function mapJurisdictionTypeToDb(
  type: OpgJurisdictionType,
): DbJurisdiction['type'] {
  switch (type) {
    case 'city': return 'CITY';
    case 'county': return 'COUNTY';
    case 'state': return 'STATE';
    case 'country': return 'COUNTRY';
    default: return 'COUNTRY';
  }
}
