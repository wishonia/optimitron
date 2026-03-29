import type { GovernmentMetrics } from "./government-report-cards";

function toPositiveFinite(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value;
}

export function getMilitaryToGovernmentClinicalTrialRatio(
  gov: GovernmentMetrics,
): number | null {
  const clinicalTrialSpending = toPositiveFinite(gov.clinicalTrialSpending?.value);
  if (clinicalTrialSpending === null) {
    return null;
  }
  return gov.militarySpendingAnnual.value / clinicalTrialSpending;
}

export function getMilitaryToGovernmentMedicalResearchRatio(
  gov: GovernmentMetrics,
): number | null {
  const govMedicalResearchSpending = toPositiveFinite(
    gov.govMedicalResearchSpending?.value,
  );
  if (govMedicalResearchSpending === null) {
    return null;
  }
  return gov.militarySpendingAnnual.value / govMedicalResearchSpending;
}

export function getMilitarySpendingPerCapitaPPP(
  gov: GovernmentMetrics,
): number | null {
  const gdpPerCapita = toPositiveFinite(gov.gdpPerCapita.value);
  const militaryPctGDP = toPositiveFinite(gov.militaryPctGDP.value);

  if (gdpPerCapita === null || militaryPctGDP === null) {
    return null;
  }

  return (militaryPctGDP / 100) * gdpPerCapita;
}

export function getAnnualDollarFlowPerCapitaPPP(
  gov: GovernmentMetrics,
  annualDollars: number | null | undefined,
): number | null {
  const normalizedAnnualDollars = toPositiveFinite(annualDollars);
  const militarySpendingAnnual = toPositiveFinite(gov.militarySpendingAnnual.value);
  const militarySpendingPerCapitaPPP = getMilitarySpendingPerCapitaPPP(gov);

  if (
    normalizedAnnualDollars === null ||
    militarySpendingAnnual === null ||
    militarySpendingPerCapitaPPP === null
  ) {
    return null;
  }

  return (
    (normalizedAnnualDollars / militarySpendingAnnual) *
    militarySpendingPerCapitaPPP
  );
}

export function getGovernmentMedicalResearchSpendingPerCapitaPPP(
  gov: GovernmentMetrics,
): number | null {
  return getAnnualDollarFlowPerCapitaPPP(
    gov,
    gov.govMedicalResearchSpending?.value,
  );
}

export function getGovernmentClinicalTrialSpendingPerCapitaPPP(
  gov: GovernmentMetrics,
): number | null {
  return getAnnualDollarFlowPerCapitaPPP(gov, gov.clinicalTrialSpending?.value);
}

export function getArmsExportsPerCapitaPPP(
  gov: GovernmentMetrics,
): number | null {
  return getAnnualDollarFlowPerCapitaPPP(gov, gov.armsExportsAnnual.value);
}
