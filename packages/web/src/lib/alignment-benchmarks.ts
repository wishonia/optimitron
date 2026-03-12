import type { BudgetCategoryId } from "@/lib/wishocracy-data";

export type AlignmentBenchmarkSourceType = "simulated";

export interface AlignmentBenchmarkProfile {
  politicianId: string;
  name: string;
  party: string;
  title: string;
  district?: string;
  chamber?: string;
  summary: string;
  sourceType: AlignmentBenchmarkSourceType;
  allocations: Record<BudgetCategoryId, number>;
}

export const ALIGNMENT_BENCHMARK_SOURCE_NOTE =
  "Prototype benchmark profiles are simulated from the Optomitron examples package. Live roll-call ingestion is not wired into this report yet.";

export const ALIGNMENT_BENCHMARKS: AlignmentBenchmarkProfile[] = [
  {
    politicianId: "ada-clarke",
    name: "Sen. Ada Clarke",
    party: "Progressive Party",
    title: "Senator",
    chamber: "senate",
    summary:
      "Evidence-first budget posture with strong emphasis on treatment, prevention, and early education.",
    sourceType: "simulated",
    allocations: {
      PRAGMATIC_CLINICAL_TRIALS: 18,
      ADDICTION_TREATMENT: 16,
      EARLY_CHILDHOOD_EDUCATION: 16,
      DRUG_WAR_ENFORCEMENT: 4,
      ICE_IMMIGRATION_ENFORCEMENT: 4,
      FARM_SUBSIDIES_AGRIBUSINESS: 7,
      FOSSIL_FUEL_SUBSIDIES: 4,
      NUCLEAR_WEAPONS_MODERNIZATION: 5,
      PRISON_CONSTRUCTION: 8,
      MILITARY_OPERATIONS: 18,
    },
  },
  {
    politicianId: "marcus-stone",
    name: "Sen. Marcus Stone",
    party: "Patriot Party",
    title: "Senator",
    chamber: "senate",
    summary:
      "Security-and-enforcement posture centered on military, immigration, and carceral spending.",
    sourceType: "simulated",
    allocations: {
      PRAGMATIC_CLINICAL_TRIALS: 5,
      ADDICTION_TREATMENT: 4,
      EARLY_CHILDHOOD_EDUCATION: 6,
      DRUG_WAR_ENFORCEMENT: 16,
      ICE_IMMIGRATION_ENFORCEMENT: 14,
      FARM_SUBSIDIES_AGRIBUSINESS: 10,
      FOSSIL_FUEL_SUBSIDIES: 8,
      NUCLEAR_WEAPONS_MODERNIZATION: 12,
      PRISON_CONSTRUCTION: 10,
      MILITARY_OPERATIONS: 15,
    },
  },
  {
    politicianId: "diana-reeves",
    name: "Rep. Diana Reeves",
    party: "Centrist Alliance",
    title: "Representative",
    chamber: "house",
    summary:
      "Balanced portfolio that stays close to status-quo tradeoffs while trimming the sharpest extremes.",
    sourceType: "simulated",
    allocations: {
      PRAGMATIC_CLINICAL_TRIALS: 11,
      ADDICTION_TREATMENT: 10,
      EARLY_CHILDHOOD_EDUCATION: 10,
      DRUG_WAR_ENFORCEMENT: 10,
      ICE_IMMIGRATION_ENFORCEMENT: 8,
      FARM_SUBSIDIES_AGRIBUSINESS: 9,
      FOSSIL_FUEL_SUBSIDIES: 8,
      NUCLEAR_WEAPONS_MODERNIZATION: 9,
      PRISON_CONSTRUCTION: 10,
      MILITARY_OPERATIONS: 15,
    },
  },
  {
    politicianId: "james-wu",
    name: "Rep. James Wu",
    party: "Innovation Party",
    title: "Representative",
    chamber: "house",
    summary:
      "Research-heavy approach that shifts funding toward trials and education while keeping defense lean.",
    sourceType: "simulated",
    allocations: {
      PRAGMATIC_CLINICAL_TRIALS: 22,
      ADDICTION_TREATMENT: 11,
      EARLY_CHILDHOOD_EDUCATION: 12,
      DRUG_WAR_ENFORCEMENT: 5,
      ICE_IMMIGRATION_ENFORCEMENT: 5,
      FARM_SUBSIDIES_AGRIBUSINESS: 8,
      FOSSIL_FUEL_SUBSIDIES: 5,
      NUCLEAR_WEAPONS_MODERNIZATION: 6,
      PRISON_CONSTRUCTION: 8,
      MILITARY_OPERATIONS: 18,
    },
  },
  {
    politicianId: "sarah-mitchell",
    name: "Gov. Sarah Mitchell",
    party: "People First",
    title: "Governor",
    summary:
      "Center-left social investment posture that funds treatment and education without zeroing out legacy programs.",
    sourceType: "simulated",
    allocations: {
      PRAGMATIC_CLINICAL_TRIALS: 14,
      ADDICTION_TREATMENT: 15,
      EARLY_CHILDHOOD_EDUCATION: 13,
      DRUG_WAR_ENFORCEMENT: 7,
      ICE_IMMIGRATION_ENFORCEMENT: 7,
      FARM_SUBSIDIES_AGRIBUSINESS: 8,
      FOSSIL_FUEL_SUBSIDIES: 5,
      NUCLEAR_WEAPONS_MODERNIZATION: 6,
      PRISON_CONSTRUCTION: 10,
      MILITARY_OPERATIONS: 15,
    },
  },
  {
    politicianId: "robert-hayes",
    name: "Sen. Robert Hayes",
    party: "Fiscal Conservative",
    title: "Senator",
    chamber: "senate",
    summary:
      "Low-service, enforcement-oriented budget posture with heavier support for subsidies and border control.",
    sourceType: "simulated",
    allocations: {
      PRAGMATIC_CLINICAL_TRIALS: 4,
      ADDICTION_TREATMENT: 4,
      EARLY_CHILDHOOD_EDUCATION: 5,
      DRUG_WAR_ENFORCEMENT: 12,
      ICE_IMMIGRATION_ENFORCEMENT: 14,
      FARM_SUBSIDIES_AGRIBUSINESS: 16,
      FOSSIL_FUEL_SUBSIDIES: 14,
      NUCLEAR_WEAPONS_MODERNIZATION: 12,
      PRISON_CONSTRUCTION: 9,
      MILITARY_OPERATIONS: 10,
    },
  },
];
