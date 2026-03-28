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
