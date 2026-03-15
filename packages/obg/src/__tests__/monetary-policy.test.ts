import { describe, it, expect } from 'vitest';
import {
  analyzeOptimalMonetaryPolicy,
  type MonetaryPolicyInput,
} from '../monetary-policy.js';
import type { AnnualTimeSeries } from '../country-analysis.js';

// ─── Test data helpers ────────────────────────────────────────────────

function makeSeries(
  id: string,
  name: string,
  varId: string,
  varName: string,
  unit: string,
  data: [number, number][],
): AnnualTimeSeries {
  const annualValues = new Map<number, number>();
  for (const [year, value] of data) {
    annualValues.set(year, value);
  }
  return { jurisdictionId: id, jurisdictionName: name, variableId: varId, variableName: varName, unit, annualValues };
}

// ─── Synthetic countries ──────────────────────────────────────────────

// Country A (low-rate era): low rates correlate with higher income
const countryA_rate = makeSeries('AAA', 'Alphaland', 'rate', 'Real Interest Rate', '%', [
  [2000, 5.0], [2001, 4.5], [2002, 4.0], [2003, 3.5], [2004, 3.0],
  [2005, 2.5], [2006, 2.0], [2007, 1.5], [2008, 1.0], [2009, 0.5],
  [2010, 0.5], [2011, 1.0], [2012, 1.5], [2013, 2.0], [2014, 2.5],
]);
const countryA_income = makeSeries('AAA', 'Alphaland', 'income', 'GNI per Capita (PPP)', 'international $', [
  [2000, 30000], [2001, 31000], [2002, 32000], [2003, 33000], [2004, 34500],
  [2005, 36000], [2006, 37500], [2007, 39000], [2008, 40000], [2009, 40500],
  [2010, 41000], [2011, 41500], [2012, 41000], [2013, 40500], [2014, 40000],
]);
const countryA_le = makeSeries('AAA', 'Alphaland', 'le', 'Life Expectancy', 'years', [
  [2000, 76.0], [2001, 76.3], [2002, 76.6], [2003, 76.9], [2004, 77.2],
  [2005, 77.5], [2006, 77.8], [2007, 78.1], [2008, 78.4], [2009, 78.5],
  [2010, 78.6], [2011, 78.7], [2012, 78.6], [2013, 78.5], [2014, 78.4],
]);

// Country B: moderate rates, moderate outcomes
const countryB_rate = makeSeries('BBB', 'Betaland', 'rate', 'Real Interest Rate', '%', [
  [2000, 3.0], [2001, 3.0], [2002, 3.0], [2003, 3.0], [2004, 3.0],
  [2005, 3.5], [2006, 4.0], [2007, 4.5], [2008, 5.0], [2009, 4.5],
  [2010, 4.0], [2011, 3.5], [2012, 3.0], [2013, 2.5], [2014, 2.0],
]);
const countryB_income = makeSeries('BBB', 'Betaland', 'income', 'GNI per Capita (PPP)', 'international $', [
  [2000, 25000], [2001, 25500], [2002, 26000], [2003, 26500], [2004, 27000],
  [2005, 27000], [2006, 26500], [2007, 26000], [2008, 25500], [2009, 26000],
  [2010, 26500], [2011, 27000], [2012, 27500], [2013, 28000], [2014, 28500],
]);
const countryB_le = makeSeries('BBB', 'Betaland', 'le', 'Life Expectancy', 'years', [
  [2000, 74.0], [2001, 74.2], [2002, 74.4], [2003, 74.6], [2004, 74.8],
  [2005, 74.8], [2006, 74.7], [2007, 74.6], [2008, 74.5], [2009, 74.6],
  [2010, 74.7], [2011, 74.8], [2012, 74.9], [2013, 75.0], [2014, 75.1],
]);

// Country C: insufficient data (should be skipped)
const countryC_rate = makeSeries('CCC', 'Gammaland', 'rate', 'Real Interest Rate', '%', [
  [2010, 2.0], [2011, 2.5],
]);
const countryC_income = makeSeries('CCC', 'Gammaland', 'income', 'GNI per Capita (PPP)', 'international $', [
  [2010, 15000], [2011, 15500],
]);

// ─── Tests ───────────────────────────────────────────────────────────

describe('analyzeOptimalMonetaryPolicy', () => {
  it('returns an optimal rate with multiple outcomes', () => {
    const input: MonetaryPolicyInput = {
      interestRateSeries: [countryA_rate, countryB_rate],
      outcomeSeries: {
        gniPerCapitaPpp: [countryA_income, countryB_income],
        lifeExpectancy: [countryA_le, countryB_le],
      },
      currentRatePct: 5.25,
    };

    const result = analyzeOptimalMonetaryPolicy(input);

    expect(result.currentRatePct).toBe(5.25);
    expect(typeof result.optimalRatePct).toBe('number');
    expect(result.outcomeAnalyses.length).toBe(2);
    expect(result.analyzedAt).toBeDefined();
    expect(['raise', 'lower', 'maintain']).toContain(result.direction);
    expect(['A', 'B', 'C', 'D', 'F']).toContain(result.evidenceGrade);
  });

  it('computes gap between current and optimal rate', () => {
    const input: MonetaryPolicyInput = {
      interestRateSeries: [countryA_rate, countryB_rate],
      outcomeSeries: {
        gniPerCapitaPpp: [countryA_income, countryB_income],
      },
      currentRatePct: 3.0,
    };

    const result = analyzeOptimalMonetaryPolicy(input);

    expect(result.gapPct).toBeCloseTo(result.optimalRatePct - 3.0, 5);
  });

  it('skips countries with insufficient data', () => {
    const input: MonetaryPolicyInput = {
      interestRateSeries: [countryA_rate, countryC_rate],
      outcomeSeries: {
        gniPerCapitaPpp: [countryA_income, countryC_income],
      },
      currentRatePct: 5.0,
    };

    const result = analyzeOptimalMonetaryPolicy(input);

    // Only country A has enough data
    expect(result.outcomeAnalyses.length).toBe(1);
    expect(result.outcomeAnalyses[0]!.jurisdictionCount).toBe(1);
  });

  it('returns maintain when gap is small', () => {
    const input: MonetaryPolicyInput = {
      interestRateSeries: [countryA_rate],
      outcomeSeries: {
        gniPerCapitaPpp: [countryA_income],
      },
      currentRatePct: 0, // will be overridden — just testing with something close
    };

    const result = analyzeOptimalMonetaryPolicy(input);

    // Set current to optimal so gap ≈ 0
    const adjusted = analyzeOptimalMonetaryPolicy({
      ...input,
      currentRatePct: result.optimalRatePct,
    });

    expect(adjusted.direction).toBe('maintain');
    expect(Math.abs(adjusted.gapPct)).toBeLessThan(0.26);
  });

  it('handles empty outcome series gracefully', () => {
    const input: MonetaryPolicyInput = {
      interestRateSeries: [countryA_rate],
      outcomeSeries: {},
      currentRatePct: 5.0,
    };

    const result = analyzeOptimalMonetaryPolicy(input);

    expect(result.outcomeAnalyses.length).toBe(0);
    expect(result.optimalRatePct).toBe(5.0); // falls back to current
    expect(result.direction).toBe('maintain');
    expect(result.evidenceGrade).toBe('F');
  });

  it('accepts config overrides for temporal parameters', () => {
    const input: MonetaryPolicyInput = {
      interestRateSeries: [countryA_rate, countryB_rate],
      outcomeSeries: {
        lifeExpectancy: [countryA_le, countryB_le],
      },
      currentRatePct: 4.0,
      config: {
        onsetDelayDays: 730,        // 2 years
        durationOfActionDays: 1825,  // 5 years
      },
    };

    const result = analyzeOptimalMonetaryPolicy(input);

    expect(result.outcomeAnalyses.length).toBe(1);
    const analysis = result.outcomeAnalyses[0]!.countryAnalysis;
    expect(analysis.config.onsetDelayDays).toBe(730);
    expect(analysis.config.durationOfActionDays).toBe(1825);
  });

  it('provides per-outcome breakdown with jurisdiction counts', () => {
    const input: MonetaryPolicyInput = {
      interestRateSeries: [countryA_rate, countryB_rate],
      outcomeSeries: {
        gniPerCapitaPpp: [countryA_income, countryB_income],
        lifeExpectancy: [countryA_le, countryB_le],
      },
      currentRatePct: 3.0,
    };

    const result = analyzeOptimalMonetaryPolicy(input);

    for (const oa of result.outcomeAnalyses) {
      expect(oa.outcomeName).toBeDefined();
      expect(oa.jurisdictionCount).toBeGreaterThanOrEqual(1);
      expect(typeof oa.optimalRatePct).toBe('number');
      expect(typeof oa.meanCorrelation).toBe('number');
      expect(typeof oa.meanEffectSize).toBe('number');
    }
  });
});
