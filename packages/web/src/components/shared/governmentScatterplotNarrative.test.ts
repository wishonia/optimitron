import { describe, expect, it } from "vitest";
import { describeGovernmentScatterRelationship } from "./governmentScatterplotNarrative";

describe("governmentScatterplotNarrative", () => {
  it("describes a negative relationship in plain English", () => {
    expect(
      describeGovernmentScatterRelationship({
        correlation: -0.58,
        hiddenOutliers: 0,
        pointCount: 18,
        xLabel: "Mil/Trials",
        yLabel: "HALE",
      }),
    ).toBe(
      "Across 18 comparable countries, countries with higher Mil/Trials generally have lower HALE. This is a moderate inverse relationship, clear enough to notice, even though it is far from a perfect rule (r=-0.58).",
    );
  });

  it("mentions excluded outliers when the filter is enabled", () => {
    expect(
      describeGovernmentScatterRelationship({
        correlation: 0.74,
        hiddenOutliers: 2,
        pointCount: 12,
        xLabel: "Military/cap PPP",
        yLabel: "GDP Per Capita",
      }),
    ).toBe(
      "Across 12 countries after excluding 2 outliers, countries with higher Military/cap PPP generally also have higher GDP Per Capita. This is a strong positive relationship, with a clear overall pattern in the dots (r=0.74).",
    );
  });

  it("treats modest correlations as a real but loose pattern", () => {
    expect(
      describeGovernmentScatterRelationship({
        correlation: -0.25,
        hiddenOutliers: 2,
        pointCount: 16,
        xLabel: "Mil/Trials",
        yLabel: "HALE",
      }),
    ).toBe(
      "Across 16 countries after excluding 2 outliers, countries with higher Mil/Trials generally have lower HALE. This is a modest inverse relationship, real, but still loose and noisy rather than tight (r=-0.25).",
    );
  });

  it("describes faint correlations cautiously", () => {
    expect(
      describeGovernmentScatterRelationship({
        correlation: 0.11,
        hiddenOutliers: 0,
        pointCount: 10,
        xLabel: "Debt % GDP",
        yLabel: "HALE",
      }),
    ).toBe(
      "Across 10 comparable countries, there is only a faint relationship between Debt % GDP and HALE. The dots hint that higher Debt % GDP comes with higher HALE, but the pattern is weak and noisy, so it should be read cautiously (r=0.11).",
    );
  });

  it("handles insufficient data", () => {
    expect(
      describeGovernmentScatterRelationship({
        correlation: null,
        hiddenOutliers: 0,
        pointCount: 1,
        xLabel: "Mil/Trials",
        yLabel: "HALE",
      }),
    ).toBe(
      "There are not enough comparable countries to describe the relationship between Mil/Trials and HALE yet.",
    );
  });
});
