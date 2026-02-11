/**
 * Citizen Alignment Scoring
 * 
 * Compares aggregated citizen preference weights to politician voting records
 * to produce Citizen Alignment Scores.
 * 
 * @see https://wishocracy.warondisease.org — Wishocracy paper (Citizen Alignment Score)
 * @see https://optimocracy.warondisease.org — Optimocracy paper (welfare function)
 * 
 * @see Wishocracy paper: "Citizen Alignment Scores" section
 */

import type { PreferenceWeight, AlignmentScore, PreferenceGap } from './types.js';

/**
 * Calculate Citizen Alignment Score for a politician
 * 
 * Compares how a politician's votes align with citizen preferences.
 * Score = weighted average of min(preferred, voted) / max(preferred, voted) per category
 */
export function calculateAlignmentScore(
  citizenPreferences: PreferenceWeight[],
  politicianVotes: Map<string, number>, // itemId → allocation % they voted for
  politicianId: string
): AlignmentScore {
  let totalWeightedAlignment = 0;
  let totalWeight = 0;
  let votesCompared = 0;
  const categoryScores: Record<string, number> = {};

  for (const pref of citizenPreferences) {
    const votedPct = politicianVotes.get(pref.itemId);

    if (votedPct === undefined) continue;

    votesCompared++;

    // Per-category alignment: min/max ratio, naturally bounded [0, 1].
    //   - Perfect match → 1.0
    //   - Citizens want 5%, politician votes 10% → 5/10 = 0.50
    //   - Citizens want 80%, politician votes 20% → 20/80 = 0.25
    // Symmetric: over-allocating and under-allocating by the same ratio penalize equally.
    const preferredPct = pref.weight * 100;
    const maxVal = Math.max(preferredPct, votedPct);
    const minVal = Math.min(preferredPct, votedPct);
    const itemAlignment = maxVal > 0 ? minVal / maxVal : 1; // both 0 → agree
    const weight = pref.weight;

    totalWeightedAlignment += itemAlignment * weight;
    totalWeight += weight;

    categoryScores[pref.itemId] = itemAlignment * 100;
  }

  // If no votes were compared, alignment is unknown — return 0
  if (votesCompared === 0) {
    return { politicianId, score: 0, votesCompared: 0, categoryScores };
  }

  // Weighted average of per-category alignment ratios
  const score = totalWeight > 0
    ? (totalWeightedAlignment / totalWeight) * 100
    : 0;
  
  return {
    politicianId,
    score,
    votesCompared,
    categoryScores,
  };
}

/**
 * Calculate preference gaps between citizen preferences and actual allocation
 */
export function calculatePreferenceGaps(
  citizenPreferences: PreferenceWeight[],
  items: Array<{ id: string; name: string; currentAllocationPct?: number; currentAllocationUsd?: number }>,
  totalBudgetUsd?: number
): PreferenceGap[] {
  const gaps: PreferenceGap[] = [];
  
  for (const pref of citizenPreferences) {
    const item = items.find(i => i.id === pref.itemId);
    if (!item) continue;
    
    const preferredPct = pref.weight * 100;
    const actualPct = item.currentAllocationPct ?? 0;
    const gapPct = preferredPct - actualPct;
    
    gaps.push({
      itemId: pref.itemId,
      itemName: item.name,
      preferredPct,
      actualPct,
      gapPct,
      gapUsd: totalBudgetUsd ? (gapPct / 100) * totalBudgetUsd : undefined,
    });
  }
  
  return gaps.sort((a, b) => Math.abs(b.gapPct) - Math.abs(a.gapPct)); // Largest gaps first
}

/**
 * Rank politicians by alignment score
 */
export function rankPoliticians(scores: AlignmentScore[]): AlignmentScore[] {
  return [...scores].sort((a, b) => b.score - a.score);
}
