import type { WishocraticCatalogRecord } from './datasets/us-wishocratic-items';
import {
  DEFAULT_JURISDICTION,
  DEFAULT_JURISDICTION_CODE,
  getAvailableJurisdictions,
  getJurisdiction,
} from './jurisdictions';

export const WISHOCRATIC_ITEMS_BY_JURISDICTION = {
  [DEFAULT_JURISDICTION_CODE]: {
    code: DEFAULT_JURISDICTION.code,
    name: DEFAULT_JURISDICTION.name,
    type: DEFAULT_JURISDICTION.type,
    wishocraticItems: DEFAULT_JURISDICTION.wishocraticItems,
    getWishocraticAllocations: DEFAULT_JURISDICTION.getWishocraticAllocations,
    getWishocraticCatalogRecords: DEFAULT_JURISDICTION.getWishocraticCatalogRecords,
  },
} as const;

export type WishocraticItemsJurisdictionCode =
  keyof typeof WISHOCRATIC_ITEMS_BY_JURISDICTION;
export type WishocraticItemsRegistryEntry =
  (typeof WISHOCRATIC_ITEMS_BY_JURISDICTION)[WishocraticItemsJurisdictionCode];

export const DEFAULT_WISHOCRATIC_JURISDICTION = {
  code: DEFAULT_JURISDICTION.code,
  name: DEFAULT_JURISDICTION.name,
  type: DEFAULT_JURISDICTION.type,
} as const;

export const DEFAULT_WISHOCRATIC_ITEMS_JURISDICTION_CODE =
  DEFAULT_WISHOCRATIC_JURISDICTION.code;

export const DEFAULT_WISHOCRATIC_ITEMS =
  WISHOCRATIC_ITEMS_BY_JURISDICTION[DEFAULT_WISHOCRATIC_ITEMS_JURISDICTION_CODE].wishocraticItems;

export type DefaultWishocraticItemId = keyof typeof DEFAULT_WISHOCRATIC_ITEMS;
export type DefaultWishocraticCatalogRecord =
  WishocraticCatalogRecord<DefaultWishocraticItemId>;

export function getDefaultWishocraticAllocations(): Record<DefaultWishocraticItemId, number> {
  return WISHOCRATIC_ITEMS_BY_JURISDICTION[
    DEFAULT_WISHOCRATIC_ITEMS_JURISDICTION_CODE
  ].getWishocraticAllocations();
}

export function getDefaultWishocraticCatalogRecord(
  itemId: DefaultWishocraticItemId,
): DefaultWishocraticCatalogRecord {
  return getDefaultWishocraticCatalogRecords()[itemId];
}

export function getDefaultWishocraticCatalogRecords(): Record<
  DefaultWishocraticItemId,
  DefaultWishocraticCatalogRecord
> {
  return WISHOCRATIC_ITEMS_BY_JURISDICTION[
    DEFAULT_WISHOCRATIC_ITEMS_JURISDICTION_CODE
  ].getWishocraticCatalogRecords() as Record<
    DefaultWishocraticItemId,
    DefaultWishocraticCatalogRecord
  >;
}

export function getWishocraticItemsRegistryEntry(
  code: string,
): WishocraticItemsRegistryEntry | undefined {
  const jurisdiction = getJurisdiction(code);
  if (!jurisdiction) {
    return undefined;
  }

  return {
    code: jurisdiction.code,
    name: jurisdiction.name,
    type: jurisdiction.type,
    wishocraticItems: jurisdiction.wishocraticItems,
    getWishocraticAllocations: jurisdiction.getWishocraticAllocations,
    getWishocraticCatalogRecords: jurisdiction.getWishocraticCatalogRecords,
  } as WishocraticItemsRegistryEntry;
}

export function getAvailableWishocraticItemsJurisdictions(): WishocraticItemsJurisdictionCode[] {
  return getAvailableJurisdictions();
}
