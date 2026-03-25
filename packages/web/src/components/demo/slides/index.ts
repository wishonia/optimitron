/**
 * Slide component registry.
 *
 * Maps componentId strings (from demo-script.ts segments) to React components.
 * Each slide is in its own file for clean separation.
 */

import type { ComponentType } from "react";

import TerminalSlide from "./TerminalSlide";
import GameTitleSlide from "./GameTitleSlide";
import DeathCountSlide from "./DeathCountSlide";
import MilitaryPieSlide from "./MilitaryPieSlide";
import CollapseClockSlide from "./CollapseClockSlide";
import MoroniaSlide from "./MoroniaSlide";
import WishoniaSlide from "./WishoniaSlide";
import OnePercentShiftSlide from "./OnePercentShiftSlide";
import TrialAccelerationSlide from "./TrialAccelerationSlide";
import PluralisiticIgnoranceSlide from "./PluralisiticIgnoranceSlide";
import LevelAllocateSlide from "./LevelAllocateSlide";
import LevelVoteSlide from "./LevelVoteSlide";
import LevelRecruitSlide from "./LevelRecruitSlide";
import PrizeSlide from "./PrizeSlide";
import LeaderboardSlide from "./LeaderboardSlide";
import ScoreboardSlide from "./ScoreboardSlide";
import ArchitectureStatsSlide from "./ArchitectureStatsSlide";
import CloseSlide from "./CloseSlide";
import PlaceholderSlide from "./PlaceholderSlide";

// ---------------------------------------------------------------------------
// Registry: componentId → Component
// ---------------------------------------------------------------------------

const slideRegistry: Record<string, ComponentType> = {
  // Hooks & Act I
  hook: DeathCountSlide,
  "death-count": DeathCountSlide,
  terminal: TerminalSlide,
  "game-title": GameTitleSlide,
  "military-pie": MilitaryPieSlide,
  "collapse-clock": CollapseClockSlide,
  moronia: MoroniaSlide,
  "wishonia-slide": WishoniaSlide,

  // Act II — Solution
  "one-percent-shift": OnePercentShiftSlide,
  "trial-acceleration": TrialAccelerationSlide,
  "pluralistic-ignorance": PluralisiticIgnoranceSlide,

  // Act II — The Game
  "level-allocate": LevelAllocateSlide,
  "level-vote": LevelVoteSlide,
  "level-recruit": LevelRecruitSlide,
  "level-share": LevelRecruitSlide, // alias for renamed slide

  // Act II — The Money
  "prize-worked-example": PrizeSlide,
  "how-to-win": PrizeSlide,

  // Act II — Accountability
  "government-leaderboard": LeaderboardSlide,
  scoreboard: ScoreboardSlide,

  // Act II — Features / Armory
  "architecture-stats": ArchitectureStatsSlide,

  // Act III
  close: CloseSlide,

  // Placeholders for slides not yet built
  "the-question": PlaceholderSlide,
  "how-to-play": PlaceholderSlide,
  "why-play": PlaceholderSlide,
  wishocracy: PlaceholderSlide,
  alignment: PlaceholderSlide,
  tools: PlaceholderSlide,

  // New slides (Phase 4 — will be replaced with real components)
  "failed-state": PlaceholderSlide,
  "ai-spiral": PlaceholderSlide,
  "paycheck-theft": PlaceholderSlide,
  "gdp-trajectory": PlaceholderSlide,
  "dysfunction-tax": PlaceholderSlide,
  "quest-objectives": PlaceholderSlide,
  asymmetry: PlaceholderSlide,
  "prize-investment": PlaceholderSlide,
  "prize-mechanism": PlaceholderSlide,
  "vote-point-value": PlaceholderSlide,
  "prize-free-option": PlaceholderSlide,
  "metric-changed": PlaceholderSlide,
  dfda: PlaceholderSlide,
  iab: PlaceholderSlide,
  superpac: PlaceholderSlide,
  optimizer: PlaceholderSlide,
  storacha: PlaceholderSlide,
  hypercerts: PlaceholderSlide,
  "wish-token": PlaceholderSlide,
  "i-pencil": PlaceholderSlide,
  "lives-saved": PlaceholderSlide,
  "easter-egg": PlaceholderSlide,
  "personal-upside": PlaceholderSlide,
  "per-pct-point": PlaceholderSlide,
  "viral-doubling": PlaceholderSlide,
  "historical-waste": PlaceholderSlide,
  "cost-effectiveness": PlaceholderSlide,
  "trial-cost": PlaceholderSlide,
};

// ---------------------------------------------------------------------------
// Lookup
// ---------------------------------------------------------------------------

export function getSlideComponent(componentId: string): ComponentType {
  return slideRegistry[componentId] ?? PlaceholderSlide;
}

export { PlaceholderSlide };
