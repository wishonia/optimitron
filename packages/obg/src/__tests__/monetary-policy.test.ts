import { describe, it, expect } from 'vitest';
import {
  analyzeOptimalSupplyExpansion,
  type SupplyExpansionInput,
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

// Country A: moderate money growth → good outcomes (sweet spot ~5% expansion)
const countryA_growth = makeSeries('AAA', 'Alphaland', 'growth', 'Broad Money Growth', '%', [
  [2000, 8.0], [2001, 7.0], [2002, 6.0], [2003, 5.0], [2004, 4.5],
  [2005, 4.0], [2006, 5.0], [2007, 6.0], [2008, 10.0], [2009, 12.0],
  [2010, 8.0], [2011, 6.0], [2012, 5.0], [2013, 4.5], [2014, 4.0],
]);
const countryA_income = makeSeries('AAA', 'Alphaland', 'income', 'GNI per Capita (PPP)', 'international $', [
  [2000, 30000], [2001, 31000], [2002, 32500], [2003, 34000], [2004, 35000],
  [2005, 36000], [2006, 37000], [2007, 37500], [2008, 36000], [2009, 35000],
  [2010, 36000], [2011, 37000], [2012, 38000], [2013, 39000], [2014, 40000],
]);
const countryA_le = makeSeries('AAA', 'Alphaland', 'le', 'Life Expectancy', 'years', [
  [2000, 76.0], [2001, 76.3], [2002, 76.6], [2003, 77.0], [2004, 77.3],
  [2005, 77.6], [2006, 77.9], [2007, 78.0], [2008, 77.8], [2009, 77.5],
  [2010, 77.8], [2011, 78.1], [2012, 78.4], [2013, 78.7], [2014, 79.0],
]);

// Country B: different expansion pattern
const countryB_growth = makeSeries('BBB', 'Betaland', 'growth', 'Broad Money Growth', '%', [
  [2000, 3.0], [2001, 3.5], [2002, 4.0], [2003, 4.5], [2004, 5.0],
  [2005, 5.5], [2006, 6.0], [2007, 7.0], [2008, 15.0], [2009, 10.0],
  [2010, 7.0], [2011, 5.0], [2012, 4.0], [2013, 3.5], [2014, 3.0],
]);
const countryB_income = makeSeries('BBB', 'Betaland', 'income', 'GNI per Capita (PPP)', 'international $', [
  [2000, 25000], [2001, 25500], [2002, 26000], [2003, 27000], [2004, 28000],
  [2005, 28500], [2006, 29000], [2007, 29000], [2008, 27000], [2009, 27500],
  [2010, 28000], [2011, 29000], [2012, 30000], [2013, 30500], [2014, 31000],
]);
const countryB_le = makeSeries('BBB', 'Betaland', 'le', 'Life Expectancy', 'years', [
  [2000, 74.0], [2001, 74.2], [2002, 74.5], [2003, 74.8], [2004, 75.1],
  [2005, 75.3], [2006, 75.5], [2007, 75.4], [2008, 75.0], [2009, 75.1],
  [2010, 75.3], [2011, 75.5], [2012, 75.8], [2013, 76.0], [2014, 76.2],
]);

// Country C: insufficient data
const countryC_growth = makeSeries('CCC', 'Gammaland', 'growth', 'Broad Money Growth', '%', [
  [2010, 5.0], [2011, 6.0],
]);
const countryC_income = makeSeries('CCC', 'Gammaland', 'income', 'GNI per Capita (PPP)', 'international $', [
  [2010, 15000], [2011, 15500],
]);

// ─── Tests ───────────────────────────────────────────────────────────

describe('analyzeOptimalSupplyExpansion', () => {
  it('returns an optimal expansion rate with multiple outcomes', () => {
    const input: SupplyExpansionInput = {
      expansionRateSeries: [countryA_growth, countryB_growth],
      outcomeSeries: {
        gniPerCapitaPpp: [countryA_income, countryB_income],
        lifeExpectancy: [countryA_le, countryB_le],
      },
      currentExpansionPct: 6.0,
    };

    const result = analyzeOptimalSupplyExpansion(input);

    expect(result.currentExpansionPct).toBe(6.0);
    expect(typeof result.optimalExpansionPct).toBe('number');
    expect(typeof result.optimalExpansionBps).toBe('number');
    expect(result.optimalExpansionBps).toBe(Math.round(Math.max(0, result.optimalExpansionPct) * 100));
    expect(result.outcomeAnalyses.length).toBe(2);
    expect(result.analyzedAt).toBeDefined();
    expect(result.caveat).toContain('Cantillon');
    expect(['expand', 'contract', 'maintain']).toContain(result.direction);
  });

  it('outputs basis points for MonetaryPolicyOracle contract', () => {
    const input: SupplyExpansionInput = {
      expansionRateSeries: [countryA_growth],
      outcomeSeries: {
        gniPerCapitaPpp: [countryA_income],
      },
      currentExpansionPct: 5.0,
    };

    const result = analyzeOptimalSupplyExpansion(input);

    // Basis points should be integer, non-negative
    expect(Number.isInteger(result.optimalExpansionBps)).toBe(true);
    expect(result.optimalExpansionBps).toBeGreaterThanOrEqual(0);
  });

  it('computes gap between current and optimal expansion rate', () => {
    const input: SupplyExpansionInput = {
      expansionRateSeries: [countryA_growth, countryB_growth],
      outcomeSeries: {
        gniPerCapitaPpp: [countryA_income, countryB_income],
      },
      currentExpansionPct: 3.0,
    };

    const result = analyzeOptimalSupplyExpansion(input);

    expect(result.gapPct).toBeCloseTo(result.optimalExpansionPct - 3.0, 5);
  });

  it('skips countries with insufficient data', () => {
    const input: SupplyExpansionInput = {
      expansionRateSeries: [countryA_growth, countryC_growth],
      outcomeSeries: {
        gniPerCapitaPpp: [countryA_income, countryC_income],
      },
      currentExpansionPct: 5.0,
    };

    const result = analyzeOptimalSupplyExpansion(input);

    expect(result.outcomeAnalyses.length).toBe(1);
    expect(result.outcomeAnalyses[0]!.jurisdictionCount).toBe(1);
  });

  it('returns maintain when gap is small', () => {
    const input: SupplyExpansionInput = {
      expansionRateSeries: [countryA_growth],
      outcomeSeries: {
        gniPerCapitaPpp: [countryA_income],
      },
      currentExpansionPct: 0,
    };

    const result = analyzeOptimalSupplyExpansion(input);

    // Set current to optimal so gap ≈ 0
    const adjusted = analyzeOptimalSupplyExpansion({
      ...input,
      currentExpansionPct: result.optimalExpansionPct,
    });

    expect(adjusted.direction).toBe('maintain');
    expect(Math.abs(adjusted.gapPct)).toBeLessThan(0.51);
  });

  it('handles empty outcome series gracefully', () => {
    const input: SupplyExpansionInput = {
      expansionRateSeries: [countryA_growth],
      outcomeSeries: {},
      currentExpansionPct: 5.0,
    };

    const result = analyzeOptimalSupplyExpansion(input);

    expect(result.outcomeAnalyses.length).toBe(0);
    expect(result.optimalExpansionPct).toBe(5.0);
    expect(result.direction).toBe('maintain');
    expect(result.evidenceGrade).toBe('F');
  });

  it('includes Cantillon caveat in results', () => {
    const input: SupplyExpansionInput = {
      expansionRateSeries: [countryA_growth],
      outcomeSeries: {
        lifeExpectancy: [countryA_le],
      },
      currentExpansionPct: 5.0,
    };

    const result = analyzeOptimalSupplyExpansion(input);

    expect(result.caveat).toContain('UBI');
    expect(result.caveat).toContain('banks');
    expect(result.caveat).toContain('ceiling');
  });

  it('accepts config overrides for temporal parameters', () => {
    const input: SupplyExpansionInput = {
      expansionRateSeries: [countryA_growth, countryB_growth],
      outcomeSeries: {
        lifeExpectancy: [countryA_le, countryB_le],
      },
      currentExpansionPct: 4.0,
      config: {
        onsetDelayDays: 365,
        durationOfActionDays: 1095,
      },
    };

    const result = analyzeOptimalSupplyExpansion(input);

    expect(result.outcomeAnalyses.length).toBe(1);
    const analysis = result.outcomeAnalyses[0]!.countryAnalysis;
    expect(analysis.config.onsetDelayDays).toBe(365);
    expect(analysis.config.durationOfActionDays).toBe(1095);
  });
});
