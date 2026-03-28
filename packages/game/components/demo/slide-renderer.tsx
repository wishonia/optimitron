"use client";

import { useDemoStore } from "@/lib/demo/store";
import { SLIDES } from "@/lib/demo/demo-config";

// Act I slides
import { SlideDeathCounter } from "./slides/act1/slide-death-counter";
import { SlideGovernmentsAreAI } from "./slides/act1/slide-governments-are-ai";
import { SlideMisalignedProof } from "./slides/act1/slide-misaligned-proof";
import { SlideGameTitle } from "./slides/act1/slide-game-title";
import { SlideRatio } from "./slides/act1/slide-ratio";
import { SlideCollapseClock } from "./slides/act1/slide-collapse-clock";
import { SlideFailedState } from "./slides/act1/slide-failed-state";
import { SlideAIHackers } from "./slides/act1/slide-ai-hackers";
import { SlidePaycheckTheft } from "./slides/act1/slide-paycheck-theft";
import { SlideGameOver } from "./slides/act1/slide-game-over";
import { SlideBodyCount } from "./slides/act1/slide-body-count";

// Turn
import { SlideWishoniaRestore } from "./slides/turn/slide-wishonia-restore";

// Act II slides - Part 1: The Solution
import { SlideOnePercent } from "./slides/act2/slide-one-percent";
import { SlideAcceleration } from "./slides/act2/slide-acceleration";
import { SlideRoiComparison } from "./slides/act2/slide-roi-comparison";
import { SlideVirtuousLoop } from "./slides/act2/slide-virtuous-loop";
import { SlideGDPTrajectory } from "./slides/act2/slide-gdp-trajectory";
import { SlideCompoundPunchline } from "./slides/act2/slide-compound-punchline";
import { SlideTheBug } from "./slides/act2/slide-the-bug";
import { SlideTheMismatch } from "./slides/act2/slide-the-mismatch";
import { SlideDysfunctionTax } from "./slides/act2/slide-dysfunction-tax";
import { SlideScoreboard } from "./slides/act2/slide-scoreboard";

// Act II slides - Part 2: The Game
import { SlideLevelAllocate } from "./slides/act2/slide-level-allocate";
import { SlideYourBudget } from "./slides/act2/slide-your-budget";
import { SlideLevelVote } from "./slides/act2/slide-level-vote";
import { SlideYoureIn } from "./slides/act2/slide-youre-in";
import { SlideAsymmetry } from "./slides/act2/slide-asymmetry";
import { SlideLevelShare } from "./slides/act2/slide-level-share";

// Act II slides - Part 3: The Money
import { SlidePrizePool } from "./slides/act2/slide-prize-pool";
import { SlidePrizeMechanism } from "./slides/act2/slide-prize-mechanism";
import { SlideVotePointValue } from "./slides/act2/slide-vote-point-value";
import { SlideCannotLose } from "./slides/act2/slide-cannot-lose";

// Act II slides - Part 4: Accountability
import { SlideLeaderboard } from "./slides/act2/slide-leaderboard";
import { SlideChangedMetric } from "./slides/act2/slide-changed-metric";
import { SlideUsReportCard } from "./slides/act2/slide-us-report-card";

// Act II slides - Part 5: The Armory
import { SlideFdaQueue } from "./slides/act2/slide-fda-queue";
import { SlideDfda } from "./slides/act2/slide-dfda";
import { SlideIabs } from "./slides/act2/slide-iabs";
import { SlideSuperpac } from "./slides/act2/slide-superpac";
import { SlideStoracha } from "./slides/act2/slide-storacha";
import { SlideHypercerts } from "./slides/act2/slide-hypercerts";
import { SlideWishToken } from "./slides/act2/slide-wish-token";
import { SlideReplaceWelfare } from "./slides/act2/slide-replace-welfare";
import { SlideReplaceFed } from "./slides/act2/slide-replace-fed";
import { SlidePolicyEngine } from "./slides/act2/slide-policy-engine";
import { SlideOptimizer } from "./slides/act2/slide-optimizer";
import { SlideBudgetOptimizer } from "./slides/act2/slide-budget-optimizer";
import { SlideIPencil } from "./slides/act2/slide-i-pencil";
import { SlideCuredDisease } from "./slides/act2/slide-cured-disease";
import { SlideTheSwitch } from "./slides/act2/slide-the-switch";

// Act III slides
import { SlidePersonalUpside } from "./slides/act3/slide-personal-upside";
import { SlideLivesSaved } from "./slides/act3/slide-lives-saved";
import { SlideFinal } from "./slides/act3/slide-final";
import { SlideEasterEgg } from "./slides/act3/slide-easter-egg";

import { DataSlide } from "./slides/data-slide";

// Map slide IDs to components (IDs from demo-config.ts)
const slideComponents: Record<string, React.ComponentType> = {
  // Act I - The Horror
  "daily-death-toll": SlideDeathCounter,
  "misaligned-superintelligence": SlideGovernmentsAreAI,
  "military-waste-170t": SlideMisalignedProof,
  "government-body-count": SlideBodyCount,
  "inflation-wage-theft": SlidePaycheckTheft,
  "earth-optimization-game": SlideGameTitle,
  "military-health-ratio": SlideRatio,
  "economic-collapse-clock": SlideCollapseClock,
  "global-failed-state": SlideFailedState,
  "ai-hacker-spiral": SlideAIHackers,
  "game-over-moronia": SlideGameOver,

  // The Turn
  "restore-from-wishonia": SlideWishoniaRestore,

  // Act II - Part 1: The Solution
  "one-percent-treaty": SlideOnePercent,
  "trial-acceleration-12x": SlideAcceleration,
  "healthcare-vs-military-roi": SlideRoiComparison,
  "economic-virtuous-loop": SlideVirtuousLoop,
  "gdp-20-year-forecast": SlideGDPTrajectory,
  "compound-growth-scenarios": SlideCompoundPunchline,
  "pluralistic-ignorance-bug": SlideTheBug,
  "public-vs-lobbyist-90to1": SlideTheMismatch,
  "dysfunction-tax-101t": SlideDysfunctionTax,
  "win-conditions-hale-income": SlideScoreboard,

  // Act II - Part 2: The Game
  "pairwise-budget-allocation": SlideLevelAllocate,
  "eigenvector-budget-result": SlideYourBudget,
  "one-percent-referendum-vote": SlideLevelVote,
  "viral-doubling-to-4b": SlideYoureIn,
  "vote-value-asymmetry": SlideAsymmetry,
  "recruit-network-effect": SlideLevelShare,

  // Act II - Part 3: The Money
  "prize-pool-vs-index-fund": SlidePrizePool,
  "dominant-assurance-contract": SlidePrizeMechanism,
  "vote-point-dollar-value": SlideVotePointValue,
  "three-scenarios-all-win": SlideCannotLose,

  // Act II - Part 4: Accountability
  "government-track-record": SlideChangedMetric,
  "congress-military-trials-ratio": SlideUsReportCard,
  "hale-leaderboard-by-country": SlideLeaderboard,

  // Act II - Part 5: The Armory
  "fda-approval-delay-8yr": SlideFdaQueue,
  "decentralized-fda": SlideDfda,
  "incentive-alignment-bonds": SlideIabs,
  "smart-contract-superpac": SlideSuperpac,
  "ipfs-immutable-storage": SlideStoracha,
  "impact-certificates": SlideHypercerts,
  "decentralized-irs": SlideWishToken,
  "decentralized-welfare": SlideReplaceWelfare,
  "decentralized-federal-reserve": SlideReplaceFed,
  "optimal-policy-generator": SlidePolicyEngine,
  "drug-policy-natural-experiment": SlideOptimizer,
  "optimal-budget-generator": SlideBudgetOptimizer,
  "pencil-supply-chain": SlideIPencil,
  "disease-cure-supply-chain": SlideCuredDisease,
  "alignment-switch": SlideTheSwitch,

  // Act III - The Endgame
  "personal-income-3-timelines": SlidePersonalUpside,
  "ten-billion-lives-saved": SlideLivesSaved,
  "final-call-to-action": SlideFinal,
  "post-credits-aliens": SlideEasterEgg,
};

export function SlideRenderer() {
  const currentSlide = useDemoStore((s) => s.currentSlide);
  const slideConfig = SLIDES[currentSlide];

  if (!slideConfig) return null;

  const Component = slideComponents[slideConfig.id] || DataSlide;

  return <Component />;
}
