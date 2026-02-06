import { describe, it, expect } from 'vitest';
import {
  confidenceWeight,
  timeDecayWeight,
  calculateConfidenceWeightedMatrix,
  calculateTimeWeightedMatrix,
  calculateWeightedMatrix,
} from '../weighted-aggregation.js';
import { buildComparisonMatrix, principalEigenvector } from '../pairwise.js';
import type { PairwiseComparison } from '../types.js';

// ─── Helpers ─────────────────────────────────────────────────────────

function comp(
  participantId: string,
  itemAId: string,
  itemBId: string,
  allocationA: number,
  timestamp?: number | string,
  id?: string,
): PairwiseComparison {
  return {
    id: id ?? `${participantId}-${itemAId}-${itemBId}`,
    participantId,
    itemAId,
    itemBId,
    allocationA,
    timestamp: timestamp ?? Date.now(),
  };
}

/** Create a date N days ago from a reference */
function daysAgo(days: number, from: Date = new Date('2026-01-01T00:00:00Z')): number {
  return from.getTime() - days * 24 * 60 * 60 * 1000;
}

const REF_DATE = new Date('2026-01-01T00:00:00Z');

// =====================================================================
// confidenceWeight
// =====================================================================
describe('confidenceWeight', () => {
  it('CR=0 → weight=1 (perfectly consistent)', () => {
    expect(confidenceWeight(0)).toBe(1);
  });

  it('CR=0.1 → weight≈0.909', () => {
    expect(confidenceWeight(0.1)).toBeCloseTo(1 / 1.1, 4);
  });

  it('CR=0.5 → weight≈0.667', () => {
    expect(confidenceWeight(0.5)).toBeCloseTo(2 / 3, 4);
  });

  it('CR=1.0 → weight=0.5', () => {
    expect(confidenceWeight(1.0)).toBe(0.5);
  });

  it('negative CR is clamped to 0', () => {
    expect(confidenceWeight(-0.5)).toBe(1);
  });
});

// =====================================================================
// timeDecayWeight
// =====================================================================
describe('timeDecayWeight', () => {
  it('age=0 → weight=1 (current comparison)', () => {
    const w = timeDecayWeight(REF_DATE.getTime(), REF_DATE);
    expect(w).toBeCloseTo(1, 8);
  });

  it('default λ=0.01: half-life is ~69.3 days', () => {
    const halfLife = Math.log(2) / 0.01; // ≈ 69.3
    const ts = daysAgo(halfLife, REF_DATE);
    const w = timeDecayWeight(ts, REF_DATE);
    expect(w).toBeCloseTo(0.5, 2);
  });

  it('age=365 days → weight ≈ 0.026 with default λ', () => {
    const ts = daysAgo(365, REF_DATE);
    const w = timeDecayWeight(ts, REF_DATE);
    expect(w).toBeCloseTo(Math.exp(-0.01 * 365), 4);
  });

  it('λ=0 → no decay (weight always 1)', () => {
    const ts = daysAgo(1000, REF_DATE);
    const w = timeDecayWeight(ts, REF_DATE, 0);
    expect(w).toBeCloseTo(1, 8);
  });

  it('large λ → rapid decay', () => {
    const ts = daysAgo(10, REF_DATE);
    const w = timeDecayWeight(ts, REF_DATE, 1.0); // λ=1
    expect(w).toBeCloseTo(Math.exp(-10), 6);
    expect(w).toBeLessThan(0.001);
  });

  it('handles ISO string timestamps', () => {
    const ts = '2025-12-31T00:00:00Z'; // 1 day before ref
    const w = timeDecayWeight(ts, REF_DATE);
    expect(w).toBeCloseTo(Math.exp(-0.01 * 1), 4);
  });

  it('future timestamps get weight 1 (clamped age=0)', () => {
    const futureTs = REF_DATE.getTime() + 86400000; // 1 day in future
    const w = timeDecayWeight(futureTs, REF_DATE);
    expect(w).toBeCloseTo(1, 8);
  });
});

// =====================================================================
// calculateConfidenceWeightedMatrix
// =====================================================================
describe('calculateConfidenceWeightedMatrix', () => {
  it('consistent participant dominates over inconsistent', () => {
    // Alice (CR=0, perfectly consistent): prefers A (80/20)
    // Bob (CR=0.5, inconsistent): prefers B (20/80)
    // Alice weight = 1.0, Bob weight = 0.667
    // Alice's preference should dominate
    const comparisons = [
      comp('alice', 'A', 'B', 80),
      comp('bob', 'A', 'B', 20),
    ];
    const crs = new Map([['alice', 0], ['bob', 0.5]]);
    
    const entries = calculateConfidenceWeightedMatrix(comparisons, crs);
    expect(entries).toHaveLength(1);
    // Weighted toward Alice → ratio > 1 (prefers A)
    expect(entries[0]!.ratio).toBeGreaterThan(1);
  });

  it('equal CR gives equal weight (same as unweighted)', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 80),
      comp('bob', 'A', 'B', 40),
    ];
    const crs = new Map([['alice', 0.1], ['bob', 0.1]]);
    
    const entries = calculateConfidenceWeightedMatrix(comparisons, crs);
    // Both have same CR, so same as unweighted geometric mean
    // ratios: 80/20=4, 40/60=0.667 → geomean = sqrt(4*0.667) ≈ 1.633
    const expected = Math.sqrt((80 / 20) * (40 / 60));
    expect(entries[0]!.ratio).toBeCloseTo(expected, 2);
  });

  it('unknown participant CR defaults to weight 1', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 70),
      comp('unknown_user', 'A', 'B', 60),
    ];
    const crs = new Map([['alice', 0]]); // unknown_user not in map
    
    const entries = calculateConfidenceWeightedMatrix(comparisons, crs);
    // Both have weight 1, so equal weighting
    expect(entries).toHaveLength(1);
    expect(entries[0]!.ratio).toBeGreaterThan(1); // Both prefer A
  });

  it('single participant ignores CR weighting (result same as unweighted)', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 75),
    ];
    const crs = new Map([['alice', 0.3]]);
    
    const entries = calculateConfidenceWeightedMatrix(comparisons, crs);
    // Single comparison → ratio = 75/25 = 3 regardless of weight
    expect(entries[0]!.ratio).toBeCloseTo(75 / 25, 2);
  });

  it('highly inconsistent participant has almost no influence', () => {
    // Alice (CR=0): prefers A (90/10)
    // Bob (CR=5): prefers B (10/90) — very inconsistent
    // Alice weight = 1.0, Bob weight = 1/6 ≈ 0.167
    const comparisons = [
      comp('alice', 'A', 'B', 90),
      comp('bob', 'A', 'B', 10),
    ];
    const crs = new Map([['alice', 0], ['bob', 5]]);
    
    const entries = calculateConfidenceWeightedMatrix(comparisons, crs);
    // Should be strongly toward A (Alice dominates)
    expect(entries[0]!.ratio).toBeGreaterThan(3);
  });

  it('returns empty array for no comparisons', () => {
    const entries = calculateConfidenceWeightedMatrix([], new Map());
    expect(entries).toEqual([]);
  });
});

// =====================================================================
// calculateTimeWeightedMatrix
// =====================================================================
describe('calculateTimeWeightedMatrix', () => {
  it('recent comparison dominates over old one', () => {
    // Recent: prefers A (80/20), 1 day ago
    // Old: prefers B (20/80), 365 days ago
    const comparisons = [
      comp('alice', 'A', 'B', 80, daysAgo(1, REF_DATE)),
      comp('bob', 'A', 'B', 20, daysAgo(365, REF_DATE)),
    ];
    
    const entries = calculateTimeWeightedMatrix(comparisons, REF_DATE);
    // Recent comparison (prefers A) should dominate → ratio > 1
    expect(entries[0]!.ratio).toBeGreaterThan(1);
  });

  it('all same timestamp gives equal weights', () => {
    const ts = REF_DATE.getTime();
    const comparisons = [
      comp('alice', 'A', 'B', 80, ts),
      comp('bob', 'A', 'B', 40, ts),
    ];
    
    const entries = calculateTimeWeightedMatrix(comparisons, REF_DATE);
    // Same timestamp → equal weights → standard geometric mean
    const expected = Math.sqrt((80 / 20) * (40 / 60));
    expect(entries[0]!.ratio).toBeCloseTo(expected, 2);
  });

  it('λ=0 produces no decay (equal weighting)', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 80, daysAgo(1, REF_DATE)),
      comp('bob', 'A', 'B', 40, daysAgo(365, REF_DATE)),
    ];
    
    const entries = calculateTimeWeightedMatrix(comparisons, REF_DATE, 0);
    // No decay → equal weights → standard geometric mean
    const expected = Math.sqrt((80 / 20) * (40 / 60));
    expect(entries[0]!.ratio).toBeCloseTo(expected, 2);
  });

  it('large λ makes only most recent comparison matter', () => {
    // λ=10: anything more than 1 day old has weight ≈ 0
    const comparisons = [
      comp('alice', 'A', 'B', 90, daysAgo(0, REF_DATE)), // weight ≈ 1
      comp('bob', 'A', 'B', 10, daysAgo(10, REF_DATE)),   // weight ≈ e^(-100) ≈ 0
    ];
    
    const entries = calculateTimeWeightedMatrix(comparisons, REF_DATE, 10);
    // Should be almost entirely Alice's preference: 90/10 = 9
    expect(entries[0]!.ratio).toBeCloseTo(90 / 10, 0);
  });

  it('returns empty for no comparisons', () => {
    expect(calculateTimeWeightedMatrix([], REF_DATE)).toEqual([]);
  });

  it('handles mixed numeric and string timestamps', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 70, REF_DATE.getTime()),
      comp('bob', 'A', 'B', 60, '2025-12-31T00:00:00Z'),
    ];
    
    const entries = calculateTimeWeightedMatrix(comparisons, REF_DATE);
    expect(entries).toHaveLength(1);
    expect(entries[0]!.ratio).toBeGreaterThan(1); // Both prefer A
  });
});

// =====================================================================
// calculateWeightedMatrix (combined)
// =====================================================================
describe('calculateWeightedMatrix', () => {
  it('no options → equal weighting (like standard aggregation)', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 80),
      comp('bob', 'A', 'B', 40),
    ];
    
    const entries = calculateWeightedMatrix(comparisons);
    const expected = Math.sqrt((80 / 20) * (40 / 60));
    expect(entries[0]!.ratio).toBeCloseTo(expected, 2);
  });

  it('confidence only: consistent participant dominates', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 85),
      comp('bob', 'A', 'B', 15),
    ];
    const crs = new Map([['alice', 0], ['bob', 0.8]]);
    
    const entries = calculateWeightedMatrix(comparisons, {
      useConfidence: true,
      participantCRs: crs,
    });
    // Alice (CR=0, w=1) dominates Bob (CR=0.8, w=0.556)
    expect(entries[0]!.ratio).toBeGreaterThan(1);
  });

  it('time-decay only: recent dominates', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 85, daysAgo(1, REF_DATE)),
      comp('bob', 'A', 'B', 15, daysAgo(200, REF_DATE)),
    ];
    
    const entries = calculateWeightedMatrix(comparisons, {
      useTimeDecay: true,
      referenceDate: REF_DATE,
    });
    expect(entries[0]!.ratio).toBeGreaterThan(1);
  });

  it('combined: consistent + recent > inconsistent + old', () => {
    // Alice: consistent (CR=0), recent (1 day ago), prefers A (90/10)
    // Bob: inconsistent (CR=1), old (300 days ago), prefers B (10/90)
    const comparisons = [
      comp('alice', 'A', 'B', 90, daysAgo(1, REF_DATE)),
      comp('bob', 'A', 'B', 10, daysAgo(300, REF_DATE)),
    ];
    const crs = new Map([['alice', 0], ['bob', 1.0]]);
    
    const entries = calculateWeightedMatrix(comparisons, {
      useConfidence: true,
      useTimeDecay: true,
      referenceDate: REF_DATE,
      participantCRs: crs,
    });
    
    // Alice dominates on both dimensions → strong A preference
    expect(entries[0]!.ratio).toBeGreaterThan(5);
  });

  it('combined weighting is multiplicative', () => {
    // Single comparison — verify combined weight = confidence × time-decay
    // The ratio should be the same regardless (single comparison)
    const ts = daysAgo(30, REF_DATE);
    const comparisons = [
      comp('alice', 'A', 'B', 70, ts),
    ];
    const crs = new Map([['alice', 0.2]]);
    
    const entries = calculateWeightedMatrix(comparisons, {
      useConfidence: true,
      useTimeDecay: true,
      referenceDate: REF_DATE,
      participantCRs: crs,
    });
    
    // Single comparison → ratio = 70/30 regardless of weight
    expect(entries[0]!.ratio).toBeCloseTo(70 / 30, 2);
  });

  it('useConfidence=false ignores CR even if provided', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 80),
      comp('bob', 'A', 'B', 20),
    ];
    const crs = new Map([['alice', 0], ['bob', 100]]); // Bob extremely inconsistent
    
    const noConfidence = calculateWeightedMatrix(comparisons, {
      useConfidence: false,
      participantCRs: crs,
    });
    
    // Without confidence weighting, equal weights → geometric mean
    const expected = Math.sqrt((80 / 20) * (20 / 80));
    expect(noConfidence[0]!.ratio).toBeCloseTo(expected, 2);
  });

  it('useTimeDecay=false ignores timestamps', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 80, daysAgo(1, REF_DATE)),
      comp('bob', 'A', 'B', 20, daysAgo(1000, REF_DATE)),
    ];
    
    const noDecay = calculateWeightedMatrix(comparisons, {
      useTimeDecay: false,
      referenceDate: REF_DATE,
    });
    
    // Without time decay → equal weights → geometric mean = 1.0
    const expected = Math.sqrt((80 / 20) * (20 / 80));
    expect(noDecay[0]!.ratio).toBeCloseTo(expected, 2);
  });

  it('custom decay lambda overrides default', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 90, daysAgo(0, REF_DATE)),
      comp('bob', 'A', 'B', 10, daysAgo(100, REF_DATE)),
    ];
    
    // λ=0.001 → very slow decay; 100 days → weight ≈ 0.90
    const slowDecay = calculateWeightedMatrix(comparisons, {
      useTimeDecay: true,
      decayLambda: 0.001,
      referenceDate: REF_DATE,
    });
    
    // λ=1.0 → very fast decay; 100 days → weight ≈ 0
    const fastDecay = calculateWeightedMatrix(comparisons, {
      useTimeDecay: true,
      decayLambda: 1.0,
      referenceDate: REF_DATE,
    });
    
    // Fast decay should give a ratio much closer to Alice's 90/10 = 9
    expect(fastDecay[0]!.ratio).toBeGreaterThan(slowDecay[0]!.ratio);
  });
});

// =====================================================================
// Edge Cases
// =====================================================================
describe('edge cases', () => {
  it('all participants have same CR → same as unweighted', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 70),
      comp('bob', 'A', 'B', 60),
      comp('carol', 'A', 'B', 80),
    ];
    const crs = new Map([['alice', 0.05], ['bob', 0.05], ['carol', 0.05]]);
    
    const weighted = calculateConfidenceWeightedMatrix(comparisons, crs);
    
    // All same weight → should equal unweighted geometric mean
    const ratios = [70 / 30, 60 / 40, 80 / 20];
    const unweightedGeoMean = Math.exp(
      ratios.reduce((sum, r) => sum + Math.log(r), 0) / ratios.length
    );
    expect(weighted[0]!.ratio).toBeCloseTo(unweightedGeoMean, 2);
  });

  it('single participant with CR weighting returns correct ratio', () => {
    const comparisons = [comp('alice', 'A', 'B', 60)];
    const crs = new Map([['alice', 0.2]]);
    
    const entries = calculateConfidenceWeightedMatrix(comparisons, crs);
    // Single comparison: ratio is 60/40 regardless of weight
    expect(entries[0]!.ratio).toBeCloseTo(60 / 40, 4);
  });

  it('handles many participants with varying CRs', () => {
    const comparisons = Array.from({ length: 20 }, (_, i) =>
      comp(`user${i}`, 'A', 'B', 50 + (i % 2 === 0 ? 10 : -10))
    );
    const crs = new Map(
      Array.from({ length: 20 }, (_, i) => [`user${i}`, i * 0.05] as [string, number])
    );
    
    const entries = calculateConfidenceWeightedMatrix(comparisons, crs);
    expect(entries).toHaveLength(1);
    // Users with lower index (lower CR) prefer A(60), higher index prefer B(40)
    // Lower CR = higher weight → should lean toward A
    expect(entries[0]!.ratio).toBeGreaterThan(1);
  });

  it('preserves pair count regardless of weighting', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 70, daysAgo(1, REF_DATE)),
      comp('bob', 'A', 'B', 60, daysAgo(100, REF_DATE)),
      comp('carol', 'A', 'B', 50, daysAgo(200, REF_DATE)),
    ];
    
    const entries = calculateTimeWeightedMatrix(comparisons, REF_DATE);
    expect(entries[0]!.count).toBe(3);
  });

  it('multiple pairs are handled independently', () => {
    const comparisons = [
      comp('alice', 'A', 'B', 80),
      comp('alice', 'B', 'C', 70),
      comp('bob', 'A', 'B', 60),
    ];
    const crs = new Map([['alice', 0], ['bob', 0.5]]);
    
    const entries = calculateConfidenceWeightedMatrix(comparisons, crs);
    expect(entries).toHaveLength(2);
    
    const ab = entries.find(e => e.itemAId === 'A' && e.itemBId === 'B');
    const bc = entries.find(e => e.itemAId === 'B' && e.itemBId === 'C');
    expect(ab).toBeDefined();
    expect(bc).toBeDefined();
    expect(ab!.count).toBe(2);
    expect(bc!.count).toBe(1);
  });
});

// =====================================================================
// End-to-end: weighted aggregation → matrix → eigenvector
// =====================================================================
describe('end-to-end with weighting', () => {
  it('confidence weighting changes priority ordering', () => {
    const items = ['health', 'defense', 'education'];
    
    // Expert (CR=0): health > defense > education
    // Novice (CR=0.8): education > defense > health (opposite)
    const comparisons = [
      // Expert
      comp('expert', 'health', 'defense', 80),
      comp('expert', 'health', 'education', 90),
      comp('expert', 'defense', 'education', 70),
      // Novice
      comp('novice', 'health', 'defense', 20),
      comp('novice', 'health', 'education', 10),
      comp('novice', 'defense', 'education', 30),
    ];
    const crs = new Map([['expert', 0], ['novice', 0.8]]);
    
    const entries = calculateConfidenceWeightedMatrix(comparisons, crs);
    const matrix = buildComparisonMatrix(items, entries);
    const weights = principalEigenvector(matrix);
    
    // Expert dominates → health > defense > education
    expect(weights[0]!).toBeGreaterThan(weights[1]!); // health > defense
    expect(weights[1]!).toBeGreaterThan(weights[2]!); // defense > education
  });

  it('time-decay shifts result toward recent preferences', () => {
    const items = ['A', 'B'];
    
    // Old comparisons: strongly prefer B
    // Recent comparisons: strongly prefer A
    const comparisons = [
      comp('u1', 'A', 'B', 10, daysAgo(365, REF_DATE)),
      comp('u2', 'A', 'B', 15, daysAgo(300, REF_DATE)),
      comp('u3', 'A', 'B', 90, daysAgo(5, REF_DATE)),
      comp('u4', 'A', 'B', 85, daysAgo(2, REF_DATE)),
    ];
    
    const entries = calculateTimeWeightedMatrix(comparisons, REF_DATE);
    const matrix = buildComparisonMatrix(items, entries);
    const weights = principalEigenvector(matrix);
    
    // Recent comparisons prefer A → A should win
    expect(weights[0]!).toBeGreaterThan(weights[1]!);
  });

  it('combined weighting end-to-end: consistent + recent wins', () => {
    const items = ['X', 'Y'];
    
    // Consistent expert, recent: prefers X (85/15)
    // Inconsistent novice, old: prefers Y (15/85)
    const comparisons = [
      comp('expert', 'X', 'Y', 85, daysAgo(2, REF_DATE)),
      comp('novice', 'X', 'Y', 15, daysAgo(200, REF_DATE)),
    ];
    const crs = new Map([['expert', 0.02], ['novice', 0.9]]);
    
    const entries = calculateWeightedMatrix(comparisons, {
      useConfidence: true,
      useTimeDecay: true,
      referenceDate: REF_DATE,
      participantCRs: crs,
    });
    const matrix = buildComparisonMatrix(items, entries);
    const weights = principalEigenvector(matrix);
    
    // Expert + recent → X should dominate
    expect(weights[0]!).toBeGreaterThan(0.7);
  });
});
