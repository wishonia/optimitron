import "../../../../data/src/generated/country-panel";
import { getCountryPanelLatest } from "@optimitron/data";
import { describe, expect, it } from "vitest";
import { TOP_TREATY_SIGNER_SLOTS } from "./treaty-signer-network";
import { buildFullTreatySignerSlots } from "./treaty-signer-roster";

describe("buildFullTreatySignerSlots", () => {
  it("expands the treaty roster to the modeled full signer set", () => {
    const slots = buildFullTreatySignerSlots(getCountryPanelLatest(), TOP_TREATY_SIGNER_SLOTS);

    expect(slots).toHaveLength(195);
    expect(slots.some((slot) => slot.countryCode === "VAT")).toBe(true);
    expect(slots.some((slot) => slot.countryCode === "TWN")).toBe(true);
    expect(slots.some((slot) => slot.countryCode === "XKX")).toBe(true);
  });

  it("preserves curated overrides for top signers", () => {
    const slots = buildFullTreatySignerSlots(getCountryPanelLatest(), TOP_TREATY_SIGNER_SLOTS);
    const unitedStates = slots.find((slot) => slot.countryName === "United States");

    expect(unitedStates?.countryCode).toBe("US");
    expect(unitedStates?.contactUrl).toBe("https://www.whitehouse.gov/contact/");
    expect(unitedStates?.decisionMakerLabel).toBe("President of the United States");
  });
});
