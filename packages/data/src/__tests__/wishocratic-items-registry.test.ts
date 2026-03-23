import { describe, expect, it } from "vitest";
import {
  DEFAULT_WISHOCRATIC_ITEMS,
  DEFAULT_WISHOCRATIC_ITEMS_JURISDICTION_CODE,
  getAvailableWishocraticItemsJurisdictions,
  getDefaultWishocraticAllocations,
  getWishocraticItemsRegistryEntry,
} from "../wishocratic-items-registry";

describe("wishocratic items registry", () => {
  it("exposes the default jurisdiction catalog", () => {
    expect(DEFAULT_WISHOCRATIC_ITEMS_JURISDICTION_CODE).toBe("USA");
    expect(DEFAULT_WISHOCRATIC_ITEMS.MILITARY_OPERATIONS.slug).toBe("military");
  });

  it("returns allocation data for the registered default jurisdiction", () => {
    const registryEntry = getWishocraticItemsRegistryEntry("USA");
    const allocations = getDefaultWishocraticAllocations();

    expect(getAvailableWishocraticItemsJurisdictions()).toEqual(["USA"]);
    expect(registryEntry?.wishocraticItems.PRAGMATIC_CLINICAL_TRIALS.name).toBe(
      "Pragmatic Clinical Trials",
    );
    expect(allocations.MILITARY_OPERATIONS).toBeGreaterThan(
      allocations.PRAGMATIC_CLINICAL_TRIALS,
    );
  });
});
