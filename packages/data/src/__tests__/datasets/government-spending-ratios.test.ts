import { describe, expect, it } from "vitest";
import {
  getGovernment,
  type GovernmentMetrics,
} from "../../datasets/government-report-cards";
import {
  getMilitaryToGovernmentClinicalTrialRatio,
  getMilitaryToGovernmentMedicalResearchRatio,
} from "../../datasets/government-spending-ratios";

function createGovernment(
  overrides: Partial<GovernmentMetrics>,
): GovernmentMetrics {
  return {
    ...getGovernment("US")!,
    ...overrides,
  };
}

describe("government spending ratios", () => {
  it("computes the military-to-government-clinical-trials ratio", () => {
    const us = getGovernment("US")!;

    expect(getMilitaryToGovernmentClinicalTrialRatio(us)).toBeCloseTo(
      886_000_000_000 / 810_000_000,
      4,
    );
  });

  it("computes the military-to-government-medical-research ratio", () => {
    const us = getGovernment("US")!;

    expect(getMilitaryToGovernmentMedicalResearchRatio(us)).toBeCloseTo(
      886_000_000_000 / 47_100_000_000,
      4,
    );
  });

  it("returns null when clinical trial spending is missing", () => {
    const gov = createGovernment({
      clinicalTrialSpending: null,
    });

    expect(getMilitaryToGovernmentClinicalTrialRatio(gov)).toBeNull();
  });

  it("returns null when medical research spending is not positive", () => {
    const gov = createGovernment({
      govMedicalResearchSpending: {
        value: 0,
        source: "Zero medical research spending",
      },
    });

    expect(getMilitaryToGovernmentMedicalResearchRatio(gov)).toBeNull();
  });
});
