import { AGENCIES, type WishoniaAgency } from "./wishonia-agencies";

export type WishoniaSavingsDisposition =
  | "optimization_dividend"
  | "implementation_then_dividend"
  | "public_goods_exception";

export type WishoniaLegislativeAgencyRole = "primary" | "supporting";

export interface WishoniaLegislativeAgencyRef {
  agencyId: keyof typeof AGENCIES;
  role: WishoniaLegislativeAgencyRole;
  relevance: string;
}

export interface WishoniaLegislativePackage {
  id: string;
  title: string;
  shortDescription: string;
  targetBudgetCategories: string[];
  citizenBenefit: string;
  defaultSavingsDisposition: WishoniaSavingsDisposition;
  scopeGuardrails: string[];
  draftingDirectives: string[];
  agencyRefs: WishoniaLegislativeAgencyRef[];
}

export interface ResolvedWishoniaLegislativePackage
  extends WishoniaLegislativePackage {
  agencies: Array<
    WishoniaLegislativeAgencyRef & {
      agency: WishoniaAgency;
    }
  >;
}

const LEGISLATIVE_PACKAGES = {
  automated_treasury: {
    id: "automated_treasury",
    title: "Automated Treasury Act",
    shortDescription:
      "Unifies currency, tax collection, citizen registry, and the social dividend into one auditable fiscal stack.",
    targetBudgetCategories: ["social_security", "income_security"],
    citizenBenefit:
      "One simple fiscal system, lower overhead, and a visible Optimization Dividend instead of hidden inflation and bureaucratic churn.",
    defaultSavingsDisposition: "optimization_dividend",
    scopeGuardrails: [
      "Keep the bill centered on money, tax collection, citizen registry, and the social dividend.",
      "Do not sprawl into unrelated healthcare, education, or defense provisions.",
    ],
    draftingDirectives: [
      "Use plain statutory mechanisms like fixed rules, automatic collection, simple eligibility, and public dashboards.",
      "Treat the Optimization Dividend as the default use of verified net savings.",
    ],
    agencyRefs: [
      {
        agencyId: "dtreasury",
        role: "primary",
        relevance:
          "Provides the integrated fiscal architecture: currency, tax, treasury, and citizen dividend in one stack.",
      },
      {
        agencyId: "dfed",
        role: "supporting",
        relevance:
          "Supplies the fixed-supply, productivity-anchored monetary rule set that removes discretionary inflation politics.",
      },
      {
        agencyId: "dirs",
        role: "supporting",
        relevance:
          "Supplies the automatic low-overhead tax mechanism and the anti-loophole simplification logic.",
      },
      {
        agencyId: "dssa",
        role: "supporting",
        relevance:
          "Supplies the universal dividend / safety-net distribution logic without means-testing bureaucracy.",
      },
      {
        agencyId: "dcensus",
        role: "supporting",
        relevance:
          "Supplies the real-time citizen registry and person-counting function for eligibility and apportionment.",
      },
    ],
  },
  democratic_governance: {
    id: "democratic_governance",
    title: "Open Congress and Public Allocation Act",
    shortDescription:
      "Turns budgeting, scoring, auditing, and campaign alignment into a transparent citizen-facing governance stack.",
    targetBudgetCategories: [],
    citizenBenefit:
      "Citizens can see how money moves, how bills are scored, and whether elected officials are aligned with public preferences.",
    defaultSavingsDisposition: "optimization_dividend",
    scopeGuardrails: [
      "Keep the bill centered on democratic process, scoring, budgeting, auditing, and campaign alignment.",
      "Do not use this package as a back door to rewrite every substantive policy area at once.",
    ],
    draftingDirectives: [
      "Prefer simple rules, public ledgers, automatic scoring, and measurable alignment over procedural complexity.",
      "Translate public-choice theory into auditability, transparency, and hard limits on discretion.",
    ],
    agencyRefs: [
      {
        agencyId: "dcongress",
        role: "primary",
        relevance:
          "Supplies the citizen-preference aggregation logic for public budget and legislative priorities.",
      },
      {
        agencyId: "dfec",
        role: "supporting",
        relevance:
          "Supplies the campaign-alignment and anti-dark-money framing for political incentive reform.",
      },
      {
        agencyId: "dcbo",
        role: "supporting",
        relevance:
          "Supplies millisecond bill scoring, evidence grades, and measurable policy evaluation.",
      },
      {
        agencyId: "domb",
        role: "supporting",
        relevance:
          "Supplies the citizen-weighted budget allocation logic and diminishing-returns framing.",
      },
      {
        agencyId: "dgao",
        role: "supporting",
        relevance:
          "Supplies the real-time audit and immutable public ledger logic.",
      },
    ],
  },
  health_evidence_access: {
    id: "health_evidence_access",
    title: "Health Evidence and Access Act",
    shortDescription:
      "Makes healthcare reform about evidence generation, access, transparent pricing, and low-overhead delivery rather than bureaucratic gatekeeping.",
    targetBudgetCategories: [
      "health_discretionary",
      "health_non_medicare_medicaid",
      "medicare",
      "medicaid",
    ],
    citizenBenefit:
      "Faster access to proven-safe treatments, lower healthcare waste, and any verified net savings returned to households through the Optimization Dividend.",
    defaultSavingsDisposition: "implementation_then_dividend",
    scopeGuardrails: [
      "Keep the bill centered on healthcare financing, access, evidence generation, and regulation.",
      "Do not let the bill become a general science, military, or omnibus welfare manifesto.",
      "If savings are discussed, make them a short downstream result of health reform rather than the main subject.",
    ],
    draftingDirectives: [
      "Use dFDA and dIH as institutional inspiration, but translate them into understandable statutory mechanisms instead of lore.",
      "Prefer short, citizen-readable provisions over theory-heavy essays.",
      "Default to Optimization Dividend after implementation and transition costs unless a narrow public-goods exception is essential.",
    ],
    agencyRefs: [
      {
        agencyId: "dfda",
        role: "primary",
        relevance:
          "Supplies the pragmatic-trials, outcome-label, and time-to-access reform logic.",
      },
      {
        agencyId: "dih",
        role: "primary",
        relevance:
          "Supplies the patient-centered research allocation and validation-first funding logic.",
      },
      {
        agencyId: "dgao",
        role: "supporting",
        relevance:
          "Supplies the audit, transparency, and anti-corruption enforcement layer.",
      },
      {
        agencyId: "dtreasury",
        role: "supporting",
        relevance:
          "Supplies the standardized Optimization Dividend savings-disposition pattern.",
      },
    ],
  },
  education_choice_dividend: {
    id: "education_choice_dividend",
    title: "Education Efficiency and Family Dividend Act",
    shortDescription:
      "Keeps education bills focused on school quality, family choice, lean administration, and visible household benefits.",
    targetBudgetCategories: ["education"],
    citizenBenefit:
      "Better schools, simpler funding, less bureaucracy, and verified net savings returned to families through the Optimization Dividend.",
    defaultSavingsDisposition: "optimization_dividend",
    scopeGuardrails: [
      "Keep the bill centered on schools, teachers, families, and student outcomes.",
      "Do not redirect the bill into healthcare research or unrelated macro reallocation programs.",
      "If savings are mentioned, treat them as a short downstream result of education reform.",
    ],
    draftingDirectives: [
      "Use citizen-facing mechanisms like simple funding formulas, school autonomy, transparent outcomes, and portable family benefits.",
      "Use governance-stack agencies as support context, not as excuses to change the subject of the bill.",
    ],
    agencyRefs: [
      {
        agencyId: "dedu",
        role: "primary",
        relevance:
          "Supplies the student-weighted funding, provider competition, and mastery-growth logic for category-faithful education reform.",
      },
      {
        agencyId: "domb",
        role: "supporting",
        relevance:
          "Supplies the diminishing-returns and budget-efficiency framing for school spending.",
      },
      {
        agencyId: "dcbo",
        role: "supporting",
        relevance:
          "Supplies measurable outcome scoring and short evaluation loops for reforms.",
      },
      {
        agencyId: "dgao",
        role: "supporting",
        relevance:
          "Supplies auditability, open contracting, and anti-capture safeguards for school spending.",
      },
      {
        agencyId: "dtreasury",
        role: "supporting",
        relevance:
          "Supplies the standardized Optimization Dividend pattern for verified net savings.",
      },
    ],
  },
  civic_security_mobility: {
    id: "civic_security_mobility",
    title: "Orderly Mobility and Civil Security Act",
    shortDescription:
      "Replaces homeland-security theatre with lawful mobility, targeted cyber resilience, and evidence-driven public safety.",
    targetBudgetCategories: ["homeland_security"],
    citizenBenefit:
      "Less border chaos, less cartel rent extraction, fewer avoidable cyber losses, and a security system that solves real problems instead of staging them.",
    defaultSavingsDisposition: "implementation_then_dividend",
    scopeGuardrails: [
      "Keep the bill centered on lawful entry, border processing, public safety, and cyber resilience.",
      "Do not let a homeland-security bill drift into foreign war, omnibus welfare, or generalized macro reallocation rhetoric.",
    ],
    draftingDirectives: [
      "Prefer simple mechanisms like fast legal pathways, sponsor bonds, breach bonds, secure defaults, and open evidence chains.",
      "Translate public-choice theory into anti-rent, anti-cartel, and anti-backlog design rather than punitive theatre.",
    ],
    agencyRefs: [
      {
        agencyId: "dmove",
        role: "primary",
        relevance:
          "Supplies the fast lawful-entry, sponsor-bond, and anti-cartel mobility architecture.",
      },
      {
        agencyId: "dcyber",
        role: "supporting",
        relevance:
          "Supplies the secure-defaults, breach-bond, and bug-bounty design for actual homeland cyber resilience.",
      },
      {
        agencyId: "dinvest",
        role: "supporting",
        relevance:
          "Supplies forensic case handling and anti-political-discretion logic for real public safety.",
      },
      {
        agencyId: "dgao",
        role: "supporting",
        relevance:
          "Supplies the auditability and anti-slush-fund enforcement layer.",
      },
    ],
  },
  justice_restoration: {
    id: "justice_restoration",
    title: "Justice Restoration and Public Safety Act",
    shortDescription:
      "Keeps justice bills focused on solving serious crime, reducing recidivism, and repairing harm instead of warehousing failure.",
    targetBudgetCategories: ["justice"],
    citizenBenefit:
      "More solved violent crime, less wasteful incarceration, and fewer people trapped in repeat-offense systems that do not make anyone safer.",
    defaultSavingsDisposition: "optimization_dividend",
    scopeGuardrails: [
      "Keep the bill centered on public safety, investigation quality, sentencing, confinement, and restoration.",
      "Do not turn justice reform into a generic surveillance expansion or a non-stop detention manifesto.",
    ],
    draftingDirectives: [
      "Prefer restitution, recidivism reduction, forensic quality, and narrow secure containment over slogans about toughness.",
      "Use plain statutory mechanisms like evidence standards, milestone-based restoration, independent labs, and victim-first restitution flows.",
    ],
    agencyRefs: [
      {
        agencyId: "drest",
        role: "primary",
        relevance:
          "Supplies the restorative-justice, victim-restitution, and narrow-containment framework.",
      },
      {
        agencyId: "dinvest",
        role: "supporting",
        relevance:
          "Supplies the forensic and clearance-rate architecture for serious crime investigation.",
      },
      {
        agencyId: "dcyber",
        role: "supporting",
        relevance:
          "Supplies secure-digital-evidence and cybercrime handling mechanisms where relevant.",
      },
      {
        agencyId: "dgao",
        role: "supporting",
        relevance:
          "Supplies tamper-evident auditability and anti-corruption controls.",
      },
    ],
  },
  housing_abundance: {
    id: "housing_abundance",
    title: "Housing Abundance and Land Rent Act",
    shortDescription:
      "Keeps housing bills focused on legalizing supply, reducing rent extraction, and making homelessness rare rather than permanent.",
    targetBudgetCategories: ["housing"],
    citizenBenefit:
      "Lower rents, more homes where people actually need them, and less money trapped in scarcity politics.",
    defaultSavingsDisposition: "optimization_dividend",
    scopeGuardrails: [
      "Keep the bill centered on housing supply, land rents, permitting, homelessness, and affordability.",
      "Do not let the bill drift into unrelated infrastructure or healthcare reallocation agendas.",
    ],
    draftingDirectives: [
      "Prefer by-right rules, simple safety codes, land-rent treatment, and transparent homelessness metrics.",
      "Use the Optimization Dividend only as a short downstream clause after transition and implementation costs are covered.",
    ],
    agencyRefs: [
      {
        agencyId: "dhome",
        role: "primary",
        relevance:
          "Supplies the by-right building, land-rent, and abundance-first logic for housing reform.",
      },
      {
        agencyId: "dgao",
        role: "supporting",
        relevance:
          "Supplies open-ledger contracting and anti-capture controls for housing funds.",
      },
      {
        agencyId: "dtreasury",
        role: "supporting",
        relevance:
          "Supplies the standardized household-dividend handling for verified net savings.",
      },
    ],
  },
  environmental_commons: {
    id: "environmental_commons",
    title: "Environmental Commons and Pollution Pricing Act",
    shortDescription:
      "Makes environmental policy legible, sensor-driven, and hard to capture by replacing waiver politics with measured public-goods rules.",
    targetBudgetCategories: ["environment", "interior", "energy"],
    citizenBenefit:
      "Cleaner air and water, faster cleanup, and public capture of environmental rents instead of quiet waivers for incumbents.",
    defaultSavingsDisposition: "public_goods_exception",
    scopeGuardrails: [
      "Keep the bill centered on pollution measurement, cleanup, pricing, and environmental public goods.",
      "Do not let it become a generic industrial policy omnibus.",
    ],
    draftingDirectives: [
      "Preserve the real public-goods role of environmental protection while deleting permit theatre and waiver markets.",
      "Prefer meters, caps, automatic charges, and clear public dividends over sprawling case-by-case discretion.",
    ],
    agencyRefs: [
      {
        agencyId: "depa",
        role: "primary",
        relevance:
          "Supplies sensor-based measurement, pollution pricing, and citizen-dividend treatment of environmental rents.",
      },
      {
        agencyId: "dgao",
        role: "supporting",
        relevance:
          "Supplies immutable measurement and anti-waiver auditability.",
      },
      {
        agencyId: "domb",
        role: "supporting",
        relevance:
          "Supplies diminishing-returns and allocation-discipline framing for environmental spending.",
      },
    ],
  },
  resilient_food_system: {
    id: "resilient_food_system",
    title: "Food Resilience and Farm Entry Act",
    shortDescription:
      "Refocuses agriculture bills on nutrition, resilience, and farm entry instead of incumbent subsidy capture.",
    targetBudgetCategories: ["agriculture"],
    citizenBenefit:
      "Cheaper healthy food, more resilient supply, and less public money captured by the largest subsidy recipients.",
    defaultSavingsDisposition: "optimization_dividend",
    scopeGuardrails: [
      "Keep the bill centered on food affordability, resilience, farm support design, and anti-monoculture incentives.",
      "Do not let the bill turn into a generic rural pork package.",
    ],
    draftingDirectives: [
      "Prefer open auctions, outcome contracts, nutrition supply, soil health, and small-farm entry over inherited entitlements.",
      "State clearly how the reform reduces capture by dominant subsidy recipients.",
    ],
    agencyRefs: [
      {
        agencyId: "dagri",
        role: "primary",
        relevance:
          "Supplies the resilience-auction and nutrition-first architecture for agricultural reform.",
      },
      {
        agencyId: "depa",
        role: "supporting",
        relevance:
          "Supplies environmental-resilience context for soil, water, and runoff externalities.",
      },
      {
        agencyId: "dgao",
        role: "supporting",
        relevance:
          "Supplies auditability and anti-capture enforcement for agricultural support contracts.",
      },
    ],
  },
  worker_safety: {
    id: "worker_safety",
    title: "Worker Safety and Risk Pricing Act",
    shortDescription:
      "Keeps labor-safety bills focused on preventing injuries with fast feedback and aligned incentives instead of slow compliance theatre.",
    targetBudgetCategories: ["labor"],
    citizenBenefit:
      "Fewer workplace deaths, faster hazard correction, and less money spent on binders that do not keep anyone alive.",
    defaultSavingsDisposition: "optimization_dividend",
    scopeGuardrails: [
      "Keep the bill centered on workplace safety, insurance, hazard reporting, and serious-injury prevention.",
      "Do not let labor-safety reform drift into unrelated wage or macroeconomic debates.",
    ],
    draftingDirectives: [
      "Prefer sensor reporting, premium signals, automatic shutdowns for extreme hazards, and plain-language worker protections.",
      "Translate public-choice concerns into fewer waivers, fewer inspection bottlenecks, and less discretionary rent-seeking.",
    ],
    agencyRefs: [
      {
        agencyId: "dsafety",
        role: "primary",
        relevance:
          "Supplies the sensor-based hazard detection and real-time risk-pricing architecture.",
      },
      {
        agencyId: "dgao",
        role: "supporting",
        relevance:
          "Supplies auditability and anti-falsification controls for reported safety performance.",
      },
    ],
  },
  peace_transition: {
    id: "peace_transition",
    title: "Peace and Defense Transition Act",
    shortDescription:
      "Frames military reform around procurement discipline, de-escalation, transition assistance, and a visible peace dividend.",
    targetBudgetCategories: ["military", "defense"],
    citizenBenefit:
      "A less wasteful defense posture, lower corruption risk, and a direct share of verified peace dividends returned to citizens.",
    defaultSavingsDisposition: "optimization_dividend",
    scopeGuardrails: [
      "Keep the bill centered on defense posture, procurement, alliances, de-escalation, and transition assistance.",
      "Do not make biomedical research or unrelated domestic programs the main subject of a military bill.",
      "Treat any savings disposition as secondary to the core defense reform.",
    ],
    draftingDirectives: [
      "Use Department of Peace ideas as inspiration, but express them through concrete procurement, base, alliance, veteran, and transition rules.",
      "Translate public-choice thinking into hard audit, clawback, and transition mechanisms rather than rhetorical manifesto language.",
    ],
    agencyRefs: [
      {
        agencyId: "ddod",
        role: "primary",
        relevance:
          "Supplies the peace-first framing, de-escalation logic, and negative-sum critique of militarized allocation.",
      },
      {
        agencyId: "dgao",
        role: "supporting",
        relevance:
          "Supplies real-time auditability and anti-slush-fund controls for defense spending.",
      },
      {
        agencyId: "domb",
        role: "supporting",
        relevance:
          "Supplies citizen-facing budget tradeoff framing and diminishing-returns logic.",
      },
      {
        agencyId: "dtreasury",
        role: "supporting",
        relevance:
          "Supplies the standardized peace-dividend / Optimization Dividend distribution pattern.",
      },
    ],
  },
  science_acceleration: {
    id: "science_acceleration",
    title: "Science Allocation and Research Acceleration Act",
    shortDescription:
      "Keeps science bills focused on research allocation, validation throughput, and translational results instead of generic spending manifestos.",
    targetBudgetCategories: ["science_nasa", "science", "nasa"],
    citizenBenefit:
      "More useful breakthroughs per tax dollar, faster translation into real treatments and technologies, and verified net savings returned to citizens when they materialize.",
    defaultSavingsDisposition: "implementation_then_dividend",
    scopeGuardrails: [
      "Keep the bill centered on science funding, research allocation, validation, and translational throughput.",
      "Do not let the bill become a generic healthcare financing bill or a catch-all reallocation manifesto.",
      "Use savings disposition only as a short secondary clause.",
    ],
    draftingDirectives: [
      "Use dIH, dFDA, dcbo, and dgao as inspiration for funding-by-outcome, open protocols, and validation-first science.",
      "Prefer understandable mechanisms like prizes, open protocols, milestone payments, and trial funding caps over abstract theory jargon.",
    ],
    agencyRefs: [
      {
        agencyId: "dih",
        role: "primary",
        relevance:
          "Supplies validation-first research allocation and patient-centered trial throughput logic.",
      },
      {
        agencyId: "dfda",
        role: "supporting",
        relevance:
          "Supplies pragmatic-trial and evidence-label mechanisms for translational science.",
      },
      {
        agencyId: "dcbo",
        role: "supporting",
        relevance:
          "Supplies measurable evidence grades, scoring loops, and outcome-based evaluation.",
      },
      {
        agencyId: "dgao",
        role: "supporting",
        relevance:
          "Supplies open-ledger accountability and anti-capture enforcement.",
      },
      {
        agencyId: "domb",
        role: "supporting",
        relevance:
          "Supplies diminishing-returns and cross-category budget discipline framing.",
      },
    ],
  },
} satisfies Record<string, WishoniaLegislativePackage>;

export const WISHONIA_LEGISLATIVE_PACKAGES: WishoniaLegislativePackage[] =
  Object.values(LEGISLATIVE_PACKAGES);

export function getWishoniaLegislativePackage(
  id: string,
): WishoniaLegislativePackage | undefined {
  return (
    LEGISLATIVE_PACKAGES as Record<string, WishoniaLegislativePackage>
  )[id];
}

export function getWishoniaLegislativePackageForCategory(
  categoryId: string,
): WishoniaLegislativePackage | undefined {
  return WISHONIA_LEGISLATIVE_PACKAGES.find((pkg) =>
    pkg.targetBudgetCategories.includes(categoryId),
  );
}

export function resolveWishoniaLegislativePackage(
  pkgOrId: WishoniaLegislativePackage | string,
): ResolvedWishoniaLegislativePackage | undefined {
  const pkg =
    typeof pkgOrId === "string"
      ? getWishoniaLegislativePackage(pkgOrId)
      : pkgOrId;

  if (!pkg) {
    return undefined;
  }

  const agencies = pkg.agencyRefs.map((ref) => ({
    ...ref,
    agency: AGENCIES[ref.agencyId],
  }));

  return {
    ...pkg,
    agencies,
  };
}
