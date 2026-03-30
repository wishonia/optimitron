import { describe, expect, it } from "vitest";
import {
  DEMO_REFERENCE_YEAR,
  buildDrugPolicyEmojiPositions,
  buildTerminalMatrixColumns,
  deterministicUnit,
  getCollapseYearsLeft,
} from "@/lib/demo/deterministic";

describe("demo deterministic helpers", () => {
  it("returns a stable unit interval value for a given seed", () => {
    expect(deterministicUnit(42)).toBe(deterministicUnit(42));
    expect(deterministicUnit(42)).toBeGreaterThanOrEqual(0);
    expect(deterministicUnit(42)).toBeLessThan(1);
  });

  it("builds stable terminal columns without runtime randomness", () => {
    expect(buildTerminalMatrixColumns(2, 3)).toEqual([
      {
        durationSeconds: 4.82,
        delaySeconds: 1.01,
        glyphs: ["ヌ", "ス", "ヘ"],
        leftPct: 0,
      },
      {
        durationSeconds: 6.01,
        delaySeconds: 1.7,
        glyphs: ["レ", "ュ", "ロ"],
        leftPct: 50,
      },
    ]);
  });

  it("builds stable emoji positions within the viewport bounds", () => {
    expect(buildDrugPolicyEmojiPositions(3)).toEqual([
      { delayMs: 0, xPct: 57.76, yPct: 27.98 },
      { delayMs: 120, xPct: 11.65, yPct: 55.89 },
      { delayMs: 240, xPct: 41.96, yPct: 48.45 },
    ]);
  });

  it("computes collapse years from the demo reference year", () => {
    expect(getCollapseYearsLeft(2040)).toBe(2040 - DEMO_REFERENCE_YEAR);
    expect(getCollapseYearsLeft(2040, 2030)).toBe(10);
  });
});
