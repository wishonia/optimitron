export interface NarrationManifestEntry {
  hash: string;
  file: string;
  generatedAt: string;
}

export type NarrationManifest = Record<string, NarrationManifestEntry>;

/**
 * Maps segment IDs to the canonical manifest key used for generated narration.
 * These keys track slide/component identifiers from older exports.
 */
export const segmentToSlideId: Record<string, string> = {
  // pl-* segments that have unique manifest keys (no script-* collision)
  "pl-170t": "military-waste-170t",
  "pl-game": "one-percent-referendum-vote",
  "pl-prize": "dominant-assurance-contract",
  "pl-fund": "three-scenarios-all-win",
  "pl-budget": "eigenvector-budget-result",
  "pl-armory": "armory",
  "pl-dirs": "decentralized-irs",
  "pl-dwelfare": "decentralized-welfare",
  "pl-dfed": "decentralized-federal-reserve",
  "pl-targets": "win-conditions-hale-income",
  "pl-ignorance": "pluralistic-ignorance-bug",
  "pl-170t-cost": "170t-opportunity-cost",
  "pl-opg": "optimal-policy-generator",
  "pl-obg": "optimal-budget-generator",
  "pl-cta": "post-credits-aliens",
  // script-* segments
  "script-1a-misaligned": "misaligned-superintelligence",
  "script-1b-objective": "earth-optimization-game",
  "script-2a-deaths": "daily-death-toll",
  "script-2b-ratio": "military-health-ratio",
  "script-3a-moronia": "game-over-moronia",
  "script-3b-wishonia": "restore-from-wishonia",
  "script-4a-fix": "one-percent-treaty",
  "script-4b-acceleration": "trial-acceleration-12x",
  "script-armory-dfda": "decentralized-fda",
  "script-armory-iab": "incentive-alignment-bonds",
  "script-armory-superpac": "smart-contract-superpac",
  "script-armory-storacha": "ipfs-immutable-storage",
  "script-armory-hypercerts": "impact-certificates",
  "script-10b-lives": "ten-billion-lives-saved",
  "script-11-close": "final-call-to-action",
};

export function getCanonicalNarrationManifestKey(segmentId: string): string {
  return segmentToSlideId[segmentId] ?? segmentId;
}

export function getNarrationManifestLookupKeys(segmentId: string): string[] {
  const canonicalKey = getCanonicalNarrationManifestKey(segmentId);

  return [...new Set([
    canonicalKey,
    canonicalKey !== segmentId ? `protocol-labs--${canonicalKey}` : null,
    segmentId,
  ].filter((key): key is string => Boolean(key)))];
}

export function getLegacyNarrationManifestKeys(manifest: NarrationManifest): string[] {
  return Object.keys(segmentToSlideId).filter((segmentId) => {
    const canonicalKey = getCanonicalNarrationManifestKey(segmentId);
    return canonicalKey !== segmentId && manifest[segmentId] !== undefined;
  });
}
