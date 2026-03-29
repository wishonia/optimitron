import { describe, expect, it } from "vitest";
import {
  getGovernment,
  GOVERNMENTS,
} from "../../datasets/government-report-cards";
import {
  getGovernmentDeathLedgerEntries,
  getGovernmentDeathLedgerSummary,
} from "../../datasets/government-death-ledger";

describe("government report cards", () => {
  it("hydrates military death totals from the sourced ledger", () => {
    for (const government of GOVERNMENTS) {
      const summary = getGovernmentDeathLedgerSummary(government.code);
      if (!summary) {
        continue;
      }

      expect(government.deathLedgerEntries).toEqual(
        getGovernmentDeathLedgerEntries(government.code),
      );
      expect(government.militaryDeathsCaused.value).toBe(summary.totalDeaths);
      expect(government.militaryDeathsCaused.period).toBe(
        `${summary.startYear}–${summary.endYear}`,
      );
      expect(government.militaryDeathsCaused.source).toContain("ledger");
    }
  });

  it("captures the major revised regime totals from the Rummel-backed ledger", () => {
    expect(getGovernment("RU")?.militaryDeathsCaused.value).toBe(61_911_000);
    expect(getGovernment("CN")?.militaryDeathsCaused.value).toBe(80_202_000);
    expect(getGovernment("DE")?.militaryDeathsCaused.value).toBe(20_946_091);
    expect(getGovernment("JP")?.militaryDeathsCaused.value).toBe(5_964_000);
    expect(getGovernment("TR")?.militaryDeathsCaused.value).toBe(1_883_000);
    expect(getGovernment("PK")?.militaryDeathsCaused.value).toBe(1_503_000);
  });

  it("preserves documented minimum rows for the zero and low-count countries", () => {
    expect(getGovernment("SG")?.militaryDeathsCaused.value).toBe(0);
    expect(getGovernment("SG")?.deathLedgerEntries?.[0]?.sourceUrl).toContain(
      "mindef.gov.sg",
    );

    expect(getGovernment("KR")?.militaryDeathsCaused.value).toBe(9_000);
    expect(getGovernment("KR")?.deathLedgerEntries?.[0]?.sourceUrl).toContain(
      "tuoitre.vn",
    );
  });
});
