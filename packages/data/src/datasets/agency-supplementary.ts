/**
 * Agency Supplementary Section Registry
 *
 * Maps each agencyId → supplementary sections with typed data.
 * The web app renders these with a single generic component,
 * keeping agency-specific content out of page files.
 */

import { FDA_APPROVED_DRUG_DISASTERS, FDA_DRUG_DISASTER_SUMMARY } from "./us-fda-approved-drug-deaths.js";
import { PHARMA_PATENT_STATS, DRUG_MANUFACTURING_VS_RETAIL } from "./us-pharma-patents.js";
import { IRONIC_LAWS, type IronicLaw } from "./us-ironic-laws.js";
import { GOVERNMENT_LIES, type GovernmentLie } from "./us-government-lies.js";
import { LOBBYING_BY_INDUSTRY, type LobbyingIndustry } from "./us-lobbying.js";
import { REVOLVING_DOOR_STATS, type RevolvingDoorStat } from "./us-revolving-door.js";
import { CIA_COUPS } from "./us-cia-coups.js";
import { HEALTHCARE_WASTE_CATEGORIES } from "./us-healthcare-waste.js";
import { INSURER_DENIAL_RATES, DENIAL_SYSTEM_STATS } from "./us-insurance-denials.js";
import { PREVENTABLE_DEATH_CATEGORIES } from "./us-preventable-deaths.js";
import { CORPORATE_TAX_RATE_EFFECTIVE, ZERO_TAX_COMPANIES_2020 } from "./us-corporate-tax.js";
import { IMMIGRATION_KEY_STATISTICS } from "./us-immigration-impact.js";
import type { FDAApprovedDrugDisaster } from "./us-fda-approved-drug-deaths.js";
import type { CIACoup } from "./us-cia-coups.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatCardItem {
  name: string;
  emoji: string;
  value: string;
  description: string;
  comparison?: string;
  source?: string;
  sourceUrl?: string;
}

export type SupplementarySectionType =
  | "stat-cards"
  | "drug-disasters"
  | "lie"
  | "ironic-law"
  | "coups"
  | "lobbying"
  | "revolving-door";

export interface SupplementarySection {
  id: string;
  type: SupplementarySectionType;
  title: string;
  subtitle?: string;
  data:
    | StatCardItem[]
    | FDAApprovedDrugDisaster[]
    | GovernmentLie
    | IronicLaw
    | CIACoup[]
    | LobbyingIndustry
    | RevolvingDoorStat;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findLie(id: string): GovernmentLie | undefined {
  return GOVERNMENT_LIES.find((l) => l.id === id);
}

function findLaw(id: string): IronicLaw | undefined {
  return IRONIC_LAWS.find((l) => l.id === id);
}

function findLobby(keyword: string): LobbyingIndustry | undefined {
  return LOBBYING_BY_INDUSTRY.find((l) =>
    l.industry.toLowerCase().includes(keyword.toLowerCase()),
  );
}

function findRevolvingDoor(keyword: string): RevolvingDoorStat | undefined {
  return REVOLVING_DOOR_STATS.find((s) =>
    s.metric.toLowerCase().includes(keyword.toLowerCase()),
  );
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

function buildSections(agencyId: string): SupplementarySection[] {
  const sections: SupplementarySection[] = [];

  switch (agencyId) {
    case "fda": {
      sections.push({
        id: "fda-drug-disasters",
        type: "drug-disasters",
        title: "FDA-Approved Drug Disasters",
        subtitle:
          "These drugs PASSED the 8.2-year efficacy review. The process kills more through delay than it saves through rejection.",
        data: FDA_APPROVED_DRUG_DISASTERS,
      });
      sections.push({
        id: "fda-patent-abuse",
        type: "stat-cards",
        title: "Patent Abuse",
        subtitle: "Why drugs stay expensive forever",
        data: PHARMA_PATENT_STATS.map((s) => ({
          name: s.metric,
          emoji: "💊",
          value: s.value,
          description: s.description,
          source: s.source,
          sourceUrl: s.sourceUrl,
        })),
      });
      const pdufa = findLaw("pdufa");
      if (pdufa) sections.push({ id: "fda-pdufa", type: "ironic-law", title: "The Law", data: pdufa });
      const pharma = findLobby("pharma");
      if (pharma) sections.push({ id: "fda-lobbying", type: "lobbying", title: "Who Buys the Dysfunction", data: pharma });
      const revDoor = findRevolvingDoor("FDA");
      if (revDoor) sections.push({ id: "fda-revolving-door", type: "revolving-door", title: "The Revolving Door", data: revDoor });
      sections.push({
        id: "fda-drug-pricing",
        type: "stat-cards",
        title: "Manufacturing Cost vs Retail Price",
        subtitle: "What drugs cost to make vs what Americans pay",
        data: DRUG_MANUFACTURING_VS_RETAIL.map((d) => ({
          name: d.drug,
          emoji: "💰",
          value: `$${d.usRetailPrice.toLocaleString()}`,
          description: `Manufacturing cost: $${d.manufacturingCost}. Markup: ${d.markup}x.`,
          comparison: `${d.condition}`,
          source: d.source,
        })),
      });
      break;
    }

    case "hhs": {
      sections.push({
        id: "hhs-waste",
        type: "stat-cards",
        title: "Healthcare Waste",
        subtitle: "Where your $4.5 trillion per year actually goes",
        data: HEALTHCARE_WASTE_CATEGORIES.map((c) => ({
          name: c.name,
          emoji: c.emoji,
          value: `$${(c.annualCost / 1e9).toFixed(0)}B/yr`,
          description: c.description,
          comparison: c.comparison,
          source: c.source,
          sourceUrl: c.sourceUrl,
        })),
      });
      sections.push({
        id: "hhs-preventable-deaths",
        type: "stat-cards",
        title: "Preventable Deaths",
        subtitle: "People who didn't have to die",
        data: PREVENTABLE_DEATH_CATEGORIES.map((c) => ({
          name: c.name,
          emoji: c.emoji,
          value: `${c.annualDeaths.toLocaleString()}/yr`,
          description: c.description,
          comparison: c.comparison,
          source: c.source,
          sourceUrl: c.sourceUrl,
        })),
      });
      sections.push({
        id: "hhs-insurance-denials",
        type: "stat-cards",
        title: "Insurance Claim Denials",
        subtitle: "The system is designed to deny care",
        data: INSURER_DENIAL_RATES.map((d) => ({
          name: d.insurer,
          emoji: "🚫",
          value: `${d.denialRate}% denied`,
          description: `${d.claimsDenied.toLocaleString()} claims denied out of ${d.claimsProcessed.toLocaleString()} processed.`,
          source: d.source,
          sourceUrl: d.sourceUrl,
        })),
      });
      const aca = findLaw("aca");
      if (aca) sections.push({ id: "hhs-aca", type: "ironic-law", title: "The Law", data: aca });
      break;
    }

    case "dea": {
      const drugFree = findLaw("drug-free-america");
      if (drugFree) sections.push({ id: "dea-ironic-law", type: "ironic-law", title: "The Law", data: drugFree });
      break;
    }

    case "dod": {
      const dodLaw = findLaw("dept-of-defense");
      if (dodLaw) sections.push({ id: "dod-ironic-law", type: "ironic-law", title: "The Rebrand", data: dodLaw });
      sections.push({
        id: "dod-coups",
        type: "coups",
        title: "CIA-Backed Regime Changes",
        subtitle: "Democracies overthrown for corporate interests. Every entry is declassified or publicly acknowledged.",
        data: CIA_COUPS,
      });
      const pentagonPapers = findLie("pentagon-papers");
      if (pentagonPapers) sections.push({ id: "dod-pentagon-papers", type: "lie", title: "Documented Lies", data: pentagonPapers });
      const torture = findLie("torture-program");
      if (torture) sections.push({ id: "dod-torture", type: "lie", title: "", data: torture });
      const defense = findLobby("defense");
      if (defense) sections.push({ id: "dod-lobbying", type: "lobbying", title: "Defense Lobbying", data: defense });
      const pentagon = findRevolvingDoor("Pentagon");
      if (pentagon) sections.push({ id: "dod-revolving-door", type: "revolving-door", title: "The Revolving Door", data: pentagon });
      break;
    }

    case "state": {
      sections.push({
        id: "state-coups",
        type: "coups",
        title: "CIA-Backed Regime Changes",
        subtitle: "Democracies overthrown for corporate interests.",
        data: CIA_COUPS,
      });
      const iranContra = findLie("iran-contra");
      if (iranContra) sections.push({ id: "state-iran-contra", type: "lie", title: "Iran-Contra", data: iranContra });
      break;
    }

    case "irs": {
      sections.push({
        id: "irs-zero-tax",
        type: "stat-cards",
        title: "Corporate Tax Avoidance",
        subtitle: "They extract from the system without paying into it",
        data: ZERO_TAX_COMPANIES_2020.map((c) => ({
          name: c.company,
          emoji: "🏢",
          value: `$${(c.profit2020 / 1e9).toFixed(1)}B profit`,
          description: `Federal tax paid: $${c.taxPaid2020}. Effective rate: ${c.effectiveRate}%.`,
          comparison: "Paid zero federal income tax on billions in profit",
        })),
      });
      const finance = findLobby("finance");
      if (finance) sections.push({ id: "irs-lobbying", type: "lobbying", title: "Finance Industry Lobbying", data: finance });
      break;
    }

    case "ice": {
      sections.push({
        id: "ice-immigration-impact",
        type: "stat-cards",
        title: "Immigration Economic Impact",
        subtitle: "The people you're spending $29B/yr to keep out",
        data: IMMIGRATION_KEY_STATISTICS.map((s) => ({
          name: s.headline,
          emoji: "🌍",
          value: s.value,
          description: s.headline,
          source: s.source,
          sourceUrl: s.sourceUrl,
        })),
      });
      break;
    }

    case "epa": {
      const lead = findLie("leaded-gasoline");
      if (lead) sections.push({ id: "epa-lead", type: "lie", title: "Environmental Cover-ups", data: lead });
      const flint = findLie("flint-water");
      if (flint) sections.push({ id: "epa-flint", type: "lie", title: "", data: flint });
      break;
    }

    case "fbi": {
      const cointelpro = findLie("cointelpro");
      if (cointelpro) sections.push({ id: "fbi-cointelpro", type: "lie", title: "Documented Abuses", data: cointelpro });
      const nsa = findLie("nsa-surveillance");
      if (nsa) sections.push({ id: "fbi-nsa", type: "lie", title: "", data: nsa });
      const patriot = findLaw("patriot-act");
      if (patriot) sections.push({ id: "fbi-patriot", type: "ironic-law", title: "The Law", data: patriot });
      break;
    }

    case "bop": {
      const fair = findLaw("fair-sentencing");
      if (fair) sections.push({ id: "bop-fair-sentencing", type: "ironic-law", title: "The Law", data: fair });
      break;
    }

    case "doed": {
      const nclb = findLaw("nclb");
      if (nclb) sections.push({ id: "doed-nclb", type: "ironic-law", title: "The Law", data: nclb });
      break;
    }
  }

  return sections;
}

/** Get all supplementary sections for an agency */
export function getAgencySupplementarySections(
  agencyId: string,
): SupplementarySection[] {
  return buildSections(agencyId);
}
