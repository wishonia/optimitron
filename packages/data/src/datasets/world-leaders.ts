/**
 * World Leaders Dataset
 *
 * Current heads of state/government sourced from Wikidata.
 * Includes leader name, photo URL, country code, and role.
 *
 * Refresh with: pnpm --filter @optimitron/data data:refresh:leaders
 */

export type { WorldLeaderRow } from "../generated/world-leaders";
export { WORLD_LEADERS } from "../generated/world-leaders";

import type { WorldLeaderRow } from "../generated/world-leaders";
import { WORLD_LEADERS } from "../generated/world-leaders";

const byCode = new Map<string, WorldLeaderRow>(
  WORLD_LEADERS.map((l) => [l.countryCode, l]),
);

export function getLeader(countryCode: string): WorldLeaderRow | undefined {
  return byCode.get(countryCode.toUpperCase());
}

export function getLeaderImageUrl(countryCode: string): string | null {
  return byCode.get(countryCode.toUpperCase())?.leaderImageUrl ?? null;
}
