import type { CountryPanelRow } from "@optimitron/data";
import {
  TOP_TREATY_SIGNER_SLOTS,
  type TreatySignerSlot,
} from "./treaty-signer-network";

type TreatySignerRosterRow = Pick<
  CountryPanelRow,
  | "gdpPerCapitaPpp"
  | "jurisdictionIso3"
  | "jurisdictionName"
  | "militarySpendingPctGdp"
  | "militarySpendingPerCapitaPpp"
  | "population"
>;

export const COUNTRY_PANEL_AGGREGATE_ISO3 = new Set([
  "AFE",
  "AFW",
  "ARB",
  "CEB",
  "CSS",
  "EAP",
  "EAR",
  "EAS",
  "ECA",
  "ECS",
  "EMU",
  "EUU",
  "FCS",
  "HPC",
  "IBD",
  "IBT",
  "IDA",
  "IDB",
  "IDX",
  "LAC",
  "LCN",
  "LDC",
  "LMY",
  "LTE",
  "MAE",
  "MEA",
  "MIC",
  "MNA",
  "NAC",
  "OED",
  "OSS",
  "PRE",
  "PSS",
  "PST",
  "SAS",
  "SSA",
  "SSF",
  "SST",
  "TEA",
  "TEC",
  "TLA",
  "TMN",
  "TSA",
  "TSS",
  "WLD",
]);

export const NON_SOVEREIGN_TREATY_SIGNER_ISO3 = new Set([
  "ABW",
  "AIA",
  "BMU",
  "CYM",
  "GRL",
  "HKG",
  "MAC",
  "MSR",
  "PRI",
  "SXM",
  "TCA",
  "UVK",
  "VIR",
]);

const COUNTRY_NAME_ALIASES: Record<string, string> = {
  "bahamas the": "bahamas",
  "czech republic": "czechia",
  "egypt arab rep": "egypt",
  "gambia the": "gambia",
  "iran islamic rep": "iran",
  "iran islamic republic": "iran",
  "korea rep": "south korea",
  "kyrgyz republic": "kyrgyzstan",
  "lao pdr": "laos",
  "micronesia fed sts": "micronesia",
  "russian federation": "russia",
  "slovak republic": "slovakia",
  turkey: "turkiye",
  "united states of america": "united states",
  "venezuela rb": "venezuela",
  "yemen rep": "yemen",
};

const COUNTRY_DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  BHS: "Bahamas",
  CZE: "Czechia",
  EGY: "Egypt",
  FSM: "Micronesia",
  GMB: "Gambia",
  IRN: "Iran",
  KGZ: "Kyrgyzstan",
  KOR: "South Korea",
  LAO: "Laos",
  RUS: "Russia",
  SVK: "Slovakia",
  SYR: "Syria",
  TUR: "Türkiye",
  USA: "United States",
  VAT: "Holy See (Vatican City)",
  VEN: "Venezuela",
  YEM: "Yemen",
};

const EXTRA_SOVEREIGN_SIGNER_ROWS: TreatySignerRosterRow[] = [
  {
    gdpPerCapitaPpp: null,
    jurisdictionIso3: "VAT",
    jurisdictionName: "Holy See (Vatican City)",
    militarySpendingPctGdp: null,
    militarySpendingPerCapitaPpp: null,
    population: 882,
  },
];

function normalizeCountryName(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return COUNTRY_NAME_ALIASES[normalized] ?? normalized;
}

function displayCountryName(row: TreatySignerRosterRow) {
  return COUNTRY_DISPLAY_NAME_OVERRIDES[row.jurisdictionIso3] ?? row.jurisdictionName.trim();
}

export function isSovereignTreatySignerRow(row: TreatySignerRosterRow) {
  if (
    COUNTRY_PANEL_AGGREGATE_ISO3.has(row.jurisdictionIso3) ||
    NON_SOVEREIGN_TREATY_SIGNER_ISO3.has(row.jurisdictionIso3)
  ) {
    return false;
  }

  if (row.jurisdictionName.trim() === row.jurisdictionIso3) {
    return false;
  }

  return true;
}

export function estimateTreatySignerMilitaryBudgetUsd(row: TreatySignerRosterRow) {
  const perCapita = row.militarySpendingPerCapitaPpp;
  const population = row.population;
  if (perCapita != null && population != null && perCapita > 0 && population > 0) {
    return Math.max(perCapita * population, 1);
  }

  const gdpPerCapita = row.gdpPerCapitaPpp;
  const militaryPct = row.militarySpendingPctGdp;
  if (
    gdpPerCapita != null &&
    population != null &&
    militaryPct != null &&
    gdpPerCapita > 0 &&
    population > 0 &&
    militaryPct > 0
  ) {
    return Math.max((militaryPct / 100) * gdpPerCapita * population, 1);
  }

  if (gdpPerCapita != null && population != null && gdpPerCapita > 0 && population > 0) {
    return Math.max(gdpPerCapita * population * 0.005, 1);
  }

  return 1;
}

function buildGenericTreatySignerSlot(row: TreatySignerRosterRow): TreatySignerSlot {
  const countryName = displayCountryName(row);
  const iso3 = row.jurisdictionIso3.toUpperCase();

  return {
    contactEmail: null,
    contactLabel: null,
    contactUrl: null,
    countryCode: iso3,
    countryName,
    decisionMakerLabel: `Head of government of ${countryName}`,
    governmentName: `Government of ${countryName}`,
    governmentWebsite: null,
    militaryBudgetUsd: estimateTreatySignerMilitaryBudgetUsd(row),
    officialSourceUrl: null,
    roleTitle: "Head of Government",
    sortOrder: 0,
  };
}

export function buildFullTreatySignerSlots(
  rows: TreatySignerRosterRow[],
  overrides: TreatySignerSlot[] = TOP_TREATY_SIGNER_SLOTS,
) {
  const dedupedRows = [...rows, ...EXTRA_SOVEREIGN_SIGNER_ROWS].filter(isSovereignTreatySignerRow);
  const overrideNameKeys = new Set(overrides.map((slot) => normalizeCountryName(slot.countryName)));
  const generated = dedupedRows
    .filter((row) => !overrideNameKeys.has(normalizeCountryName(displayCountryName(row))))
    .map((row) => buildGenericTreatySignerSlot(row));

  return [...overrides, ...generated]
    .sort((left, right) => right.militaryBudgetUsd - left.militaryBudgetUsd)
    .map((slot, index) => ({
      ...slot,
      sortOrder: index,
    }));
}
