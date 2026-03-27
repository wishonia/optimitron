// Re-exports sourced parameters from @optimitron/data and defines game-specific constants.
// Slide components import Parameter objects directly from "@optimitron/data/parameters".

// Re-export the Parameter type and formatting utilities so components can import from one place
export type { Parameter } from "@optimitron/data/parameters";
export { fmtParam, fmtRaw, formatParameter } from "@optimitron/data/parameters";

// Re-export every data parameter used by slide components (single import point)
export {
  CUMULATIVE_MILITARY_SPENDING_FED_ERA,
  CURRENT_TRAJECTORY_AVG_INCOME_YEAR_15,
  DFDA_QUEUE_CLEARANCE_YEARS,
  DFDA_TRIAL_CAPACITY_MULTIPLIER,
  DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_LIVES_SAVED,
  DISEASE_BURDEN_GDP_DRAG_PCT,
  ECONOMIC_MULTIPLIER_HEALTHCARE_INVESTMENT,
  ECONOMIC_MULTIPLIER_MILITARY_SPENDING,
  EFFICACY_LAG_YEARS,
  EXISTING_DRUGS_EFFICACY_LAG_DEATHS_TOTAL,
  GDP_BASELINE_GROWTH_RATE,
  GLOBAL_CYBERCRIME_CAGR,
  GLOBAL_CYBERCRIME_COST_ANNUAL_2025,
  GLOBAL_DESTRUCTIVE_ECONOMY_ANNUAL_2025,
  GLOBAL_DESTRUCTIVE_ECONOMY_PCT_GDP,
  GLOBAL_DISEASE_DEATHS_DAILY,
  GLOBAL_GDP_2025,
  GLOBAL_GOVERNMENT_CLINICAL_TRIALS_SPENDING_ANNUAL,
  GLOBAL_HALE_CURRENT,
  GLOBAL_HOUSEHOLD_WEALTH_USD,
  GLOBAL_MILITARY_SPENDING_ANNUAL_2024,
  GLOBAL_POPULATION_2024,
  MILITARY_TO_GOVERNMENT_CLINICAL_TRIALS_SPENDING_RATIO,
  MONEY_PRINTER_WAR_DEATHS,
  POLITICAL_DYSFUNCTION_GLOBAL_OPPORTUNITY_COST_TOTAL,
  POLITICAL_DYSFUNCTION_TAX_PER_PERSON_ANNUAL,
  STATUS_QUO_QUEUE_CLEARANCE_YEARS,
  TRADITIONAL_PHASE3_COST_PER_PATIENT,
  TREATY_ANNUAL_FUNDING,
  TREATY_PERSONAL_UPSIDE_BLEND,
  TREATY_PROJECTED_HALE_YEAR_15,
  TREATY_TRAJECTORY_AVG_INCOME_YEAR_20,
  TREATY_TRAJECTORY_CAGR_YEAR_20,
  TYPE_II_ERROR_COST_RATIO,
} from "@optimitron/data/parameters";

/**
 * Game-specific constants that have no matching parameter in @optimitron/data.
 * These are fictional (Moronia), game-economics, US-specific, or derived values.
 */
export const GAME_PARAMS = {
  // Derived death stats
  september11Equivalent: 59, // 150K / ~2,977 per 9/11

  // US-specific wage/income (not in global data params)
  currentMedianIncome: 77_500,
  wageKeptPaceIncome: 528_000, // If wages kept pace with productivity
  projectedGDPperCapita: 149_000, // Treaty target
  statusQuoLifetimeIncome: 1_340_000,
  wishoniaLifetimeIncome: 54_300_000,
  dollarPurchasingPowerLost: 97, // % since 1913

  // Growth rates without direct parameter matches
  productiveRate: 3, // % per year
  yearsToCollapse: 15, // When stealing > producing
  collapseYear: 2040,
  wishoniaRate: 25.4, // % per year Wishonia trajectory

  // Trial durations (approximations)
  currentTrialDuration: 10, // years per treatment
  acceleratedTrialDuration: 0.81, // years per treatment (12.3x faster)

  // Game economics (prize pool, voting)
  costPerVote: 0.06,
  valuePerVotePoint: 194_000,
  prizePoolMultiple: 10,
  prizePoolROI: 17, // % per year
  prizePoolFallbackMultiple: 11, // 11x back if targets missed
  minimumDeposit: 100,
  prizePoolTotal: 774_000_000_000_000,
  exchangeRatio: 245_000_000, // 245 million to one

  // Fictional / game-specific
  moroniaCorrelation: 94.7,
  secretSupportPercent: 78,
  defenceWealth: 5_000_000_000_000,
  terrorismChance: "1 in 30 million",
  diseaseChance: "100%",
  militaryPercent: 99.83,
  trialsPercent: 0.17,
} as const;

// Score progression throughout the demo
export const SCORE_PROGRESSION = {
  "act1-all": 0,
  moronia: 0, // GAME OVER
  wishonia: 0, // RESTORE
  "the-fix": 100_000,
  acceleration: 1_000_000,
  scoreboard: 5_000_000,
  allocate: 10_000_000,
  vote: 100_000_000,
  asymmetry: 200_000_000,
  "get-friends": 500_000_000,
  "prize-investment": 650_000_000,
  "prize-mechanism": 800_000_000,
  "vote-point-value": 1_000_000_000,
  "cannot-lose": 1_500_000_000,
  leaderboard: 3_000_000_000,
  "changed-metric": 4_000_000_000,
  "personal-upside": 6_000_000_000,
  close: 8_000_000_000,
} as const;

// Inventory items collected throughout the demo
export const INVENTORY_ITEMS = [
  {
    slot: 1,
    acquiredAt: "the-fix",
    icon: "scroll",
    emoji: "\u{1F4DC}",
    name: "1% TREATY",
    tooltip: "Redirect 1% of military spending to clinical trials.",
  },
  {
    slot: 2,
    acquiredAt: "allocate",
    icon: "ballot",
    emoji: "\u{1F5F3}",
    name: "ALLOCATION",
    tooltip: "Your preferred budget split.",
  },
  {
    slot: 3,
    acquiredAt: "vote",
    icon: "fist",
    emoji: "\u270A",
    name: "VOTE",
    tooltip: "Yes on the 1% Treaty.",
  },
  {
    slot: 4,
    acquiredAt: "get-friends",
    icon: "chain",
    emoji: "\u{1F517}",
    name: "REFERRAL LINK",
    tooltip: "Share with 2 friends. They share with 2 more.",
  },
  {
    slot: 5,
    acquiredAt: "prize-mechanism",
    icon: "gold-coin",
    emoji: "\u{1FA99}",
    name: "PRIZE DEPOSIT",
    tooltip:
      "$100 deposited. Earning 17%/yr. Grows 11\u00D7 even if targets missed.",
  },
  {
    slot: 6,
    acquiredAt: "vote-point-value",
    icon: "silver-pair",
    emoji: "\u{1F948}",
    name: "VOTE POINTS \u00D72",
    tooltip: "$194K each if targets are hit. Earned by getting friends to play.",
  },
  {
    slot: 7,
    acquiredAt: "personal-upside",
    icon: "deed",
    emoji: "\u{1F4CB}",
    name: "$15.7M CLAIM",
    tooltip: "Your lifetime income gain if the Treaty passes.",
  },
  {
    slot: 8,
    acquiredAt: "leaderboard",
    icon: "magnifier",
    emoji: "\u{1F50D}",
    name: "ALIGNMENT SCORE",
    tooltip: "See how your leaders rank vs your preferences.",
  },
] as const;

export type InventoryItem = (typeof INVENTORY_ITEMS)[number];
export type ScoreKey = keyof typeof SCORE_PROGRESSION;
