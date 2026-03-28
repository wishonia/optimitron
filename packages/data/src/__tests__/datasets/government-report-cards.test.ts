import { describe, expect, it } from "vitest";
import {
  GOVERNMENTS,
  getGovernment,
} from "../../datasets/government-report-cards";

describe("government report cards", () => {
  it("does not leave zero military death counts unsourced", () => {
    const zeroBodyCountGovernments = GOVERNMENTS.filter(
      (government) => government.militaryDeathsCaused.value === 0,
    );

    expect(zeroBodyCountGovernments.length).toBeGreaterThan(0);

    for (const government of zeroBodyCountGovernments) {
      expect(government.militaryDeathsCaused.url).toBeTruthy();
      expect(government.militaryDeathsCaused.source.length).toBeGreaterThan(20);
    }
  });

  it("captures the documented postwar body counts for Germany and South Korea", () => {
    expect(getGovernment("DE")?.militaryDeathsCaused.value).toBe(91);
    expect(getGovernment("DE")?.militaryDeathsCaused.url).toContain("dw.com");

    expect(getGovernment("KR")?.militaryDeathsCaused.value).toBe(9_000);
    expect(getGovernment("KR")?.militaryDeathsCaused.url).toContain("tuoitre.vn");
    expect(getGovernment("KR")?.civilianDeathsCaused?.value).toBe(9_000);
    expect(getGovernment("KR")?.countriesBombed?.list).toBe("Vietnam");
  });
});
