import { describe, expect, it } from "vitest";
import { buildEnrichedPriorityItems } from "../wishocracy-bridge";

describe("wishocracy bridge", () => {
  it("uses canonical budget category ids while preserving dataset slugs", () => {
    const enrichedItems = buildEnrichedPriorityItems();

    expect(enrichedItems.MILITARY_OPERATIONS.id).toBe("MILITARY_OPERATIONS");
    expect(enrichedItems.MILITARY_OPERATIONS.slug).toBe("military");
    expect(enrichedItems.PRAGMATIC_CLINICAL_TRIALS.id).toBe("PRAGMATIC_CLINICAL_TRIALS");
    expect(enrichedItems.PRAGMATIC_CLINICAL_TRIALS.slug).toBe("pragmatic_clinical_trials");
  });
});
