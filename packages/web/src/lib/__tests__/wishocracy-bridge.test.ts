import { describe, expect, it } from "vitest";
import { buildEnrichedWishocraticItems } from "../wishocracy-bridge";

describe("wishocracy bridge", () => {
  it("uses canonical wishocratic item ids while preserving dataset slugs", () => {
    const enrichedItems = buildEnrichedWishocraticItems();

    expect(enrichedItems.MILITARY_OPERATIONS.id).toBe("MILITARY_OPERATIONS");
    expect(enrichedItems.MILITARY_OPERATIONS.slug).toBe("military");
    expect(enrichedItems.PRAGMATIC_CLINICAL_TRIALS.id).toBe("PRAGMATIC_CLINICAL_TRIALS");
    expect(enrichedItems.PRAGMATIC_CLINICAL_TRIALS.slug).toBe("pragmatic_clinical_trials");
  });
});
