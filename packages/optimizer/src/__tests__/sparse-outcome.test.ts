import { describe, expect, it } from 'vitest';
import { assessSparseOutcomeSupport, type ResponseCurveBin } from '../response-curve.js';

function makeBin(
  binIndex: number,
  outcomeMean: number,
  count: number,
): ResponseCurveBin {
  return {
    binIndex,
    lowerBound: binIndex * 100,
    upperBound: (binIndex + 1) * 100,
    isUpperInclusive: binIndex === 9,
    count,
    predictorMean: binIndex * 100 + 50,
    predictorMedian: binIndex * 100 + 50,
    outcomeMean,
    outcomeStd: 1,
    outcomeSem: 0.1,
  };
}

describe('assessSparseOutcomeSupport', () => {
  it('passes when all bins have events', () => {
    const bins: ResponseCurveBin[] = Array.from({ length: 10 }, (_, i) =>
      makeBin(i, 5.0 + i, 30),
    );
    const result = assessSparseOutcomeSupport(bins);
    expect(result.meetsMinimumEventThreshold).toBe(true);
    expect(result.binsWithEvents).toBe(10);
    expect(result.binsWithoutEvents).toBe(0);
    expect(result.warnings).toHaveLength(0);
    expect(result.recommendedAggregationWindowMultiplier).toBe(1);
  });

  it('fails when most bins are zero', () => {
    const bins: ResponseCurveBin[] = [
      makeBin(0, 0, 30),
      makeBin(1, 0, 30),
      makeBin(2, 0, 30),
      makeBin(3, 0, 30),
      makeBin(4, 0, 30),
      makeBin(5, 0, 30),
      makeBin(6, 0, 30),
      makeBin(7, 0, 30),
      makeBin(8, 2.0, 30),
      makeBin(9, 1.0, 30),
    ];
    const result = assessSparseOutcomeSupport(bins);
    expect(result.meetsMinimumEventThreshold).toBe(false);
    expect(result.binsWithEvents).toBe(2);
    expect(result.binsWithoutEvents).toBe(8);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.recommendedAggregationWindowMultiplier).toBeGreaterThan(1);
  });

  it('handles edge case where all bins have zero events', () => {
    const bins: ResponseCurveBin[] = Array.from({ length: 5 }, (_, i) =>
      makeBin(i, 0, 25),
    );
    const result = assessSparseOutcomeSupport(bins);
    expect(result.meetsMinimumEventThreshold).toBe(false);
    expect(result.totalEvents).toBe(0);
    expect(result.binsWithEvents).toBe(0);
    expect(result.binsWithoutEvents).toBe(5);
    expect(result.recommendedAggregationWindowMultiplier).toBe(5);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain('entirely absent');
  });

  it('handles empty bins array', () => {
    const result = assessSparseOutcomeSupport([]);
    expect(result.meetsMinimumEventThreshold).toBe(false);
    expect(result.totalEvents).toBe(0);
    expect(result.medianEventsPerBin).toBe(0);
  });

  it('respects custom thresholds', () => {
    const bins: ResponseCurveBin[] = Array.from({ length: 6 }, (_, i) =>
      makeBin(i, i < 4 ? 1.0 : 0, 3),
    );
    // With low thresholds, should pass
    const result = assessSparseOutcomeSupport(bins, {
      minimumEventCountPerBin: 1,
      minimumBinsWithEvents: 3,
    });
    expect(result.meetsMinimumEventThreshold).toBe(true);
    expect(result.binsWithEvents).toBe(4);
  });
});
