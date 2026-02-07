/**
 * US Federal Budget Categories (2000-2023)
 *
 * Sources:
 * - OMB Historical Tables (Table 3.2 - Outlays by Function and Subfunction)
 *   https://www.whitehouse.gov/omb/budget/historical-tables/
 * - BEA NIPA Tables (Government Consumption Expenditures)
 * - CBO (Congressional Budget Office) Historical Budget Data
 * - USAID (Foreign Aid Explorer)
 * - BJS (Bureau of Justice Statistics) for criminal justice expenditures
 *
 * Note: All figures are in BILLIONS of NOMINAL dollars (current year dollars).
 * Categories are constructed to match the Optimal Budget visualization needs.
 */

export interface USBudgetCategoryDataPoint {
  year: number;
  /**
   * Total government education spending (federal + state + local)
   * Source: BEA NIPA Table 3.16 / FRED 'GOV_EDUCATION_SPENDING'
   */
  educationSpendingBillions: number;
  /**
   * Total government health spending (Medicare, Medicaid, etc.)
   * Source: BEA NIPA / FRED 'GOV_HEALTH_SPENDING'
   */
  healthcareSpendingBillions: number;
  /**
   * Federal national defense spending
   * Source: OMB Table 3.2 (Function 050) / FRED 'FED_MILITARY_SPENDING'
   */
  militarySpendingBillions: number;
  /**
   * Social Security, Income Security, Unemployment
   * Source: OMB Table 3.2 (Functions 600 + 650 + others)
   */
  socialBenefitsSpendingBillions: number;
  /**
   * Transportation, Water, Broadband (Federal + State + Local Capital Outlays)
   * Source: CBO / OMB (Function 400 + others)
   */
  infrastructureSpendingBillions: number;
  /**
   * Federal Research & Development (Defense + Non-defense)
   * Source: AAAS / OMB R&D cross-cuts
   */
  rdSpendingBillions: number;
  /**
   * Police, Courts, Corrections (Federal + State + Local)
   * Source: BJS Justice Expenditure and Employment
   */
  criminalJusticeSpendingBillions: number;
  /**
   * Natural Resources and Environment
   * Source: OMB Table 3.2 (Function 300)
   */
  environmentalSpendingBillions: number;
  /**
   * International Affairs (Development + Humanitarian + Security Assistance)
   * Source: OMB Table 3.2 (Function 150) / USAID
   */
  foreignAidSpendingBillions: number;
  /**
   * Veterans Benefits and Services
   * Source: OMB Table 3.2 (Function 700)
   */
  veteransSpendingBillions: number;
  /**
   * Net Interest on the Public Debt
   * Source: OMB Table 3.2 (Function 900)
   */
  interestOnDebtBillions: number;
  /**
   * Agriculture (Farm Income Stabilization + Risk Management)
   * Source: OMB Table 3.2 (Function 350)
   */
  agricultureSubsidiesBillions: number;
}

/**
 * Historical US Budget Data by Category (2000-2023).
 * Values are in Billions of USD (Nominal).
 */
export const US_BUDGET_CATEGORIES: USBudgetCategoryDataPoint[] = [
  {
    year: 2000,
    educationSpendingBillions: 539.1,
    healthcareSpendingBillions: 558.0,
    militarySpendingBillions: 294.4,
    socialBenefitsSpendingBillions: 615.0,
    infrastructureSpendingBillions: 198.0,
    rdSpendingBillions: 80.1,
    criminalJusticeSpendingBillions: 155.0,
    environmentalSpendingBillions: 25.0,
    foreignAidSpendingBillions: 17.0,
    veteransSpendingBillions: 47.1,
    interestOnDebtBillions: 223.0,
    agricultureSubsidiesBillions: 36.5,
  },
  {
    year: 2001,
    educationSpendingBillions: 585.0,
    healthcareSpendingBillions: 610.0,
    militarySpendingBillions: 305.5,
    socialBenefitsSpendingBillions: 660.0,
    infrastructureSpendingBillions: 210.0,
    rdSpendingBillions: 88.0,
    criminalJusticeSpendingBillions: 167.0,
    environmentalSpendingBillions: 26.3,
    foreignAidSpendingBillions: 18.0,
    veteransSpendingBillions: 45.1,
    interestOnDebtBillions: 206.2,
    agricultureSubsidiesBillions: 26.9,
  },
  {
    year: 2002,
    educationSpendingBillions: 620.0,
    healthcareSpendingBillions: 680.0,
    militarySpendingBillions: 348.6,
    socialBenefitsSpendingBillions: 715.0,
    infrastructureSpendingBillions: 225.0,
    rdSpendingBillions: 98.0,
    criminalJusticeSpendingBillions: 178.0,
    environmentalSpendingBillions: 28.5,
    foreignAidSpendingBillions: 22.0,
    veteransSpendingBillions: 51.0,
    interestOnDebtBillions: 170.9,
    agricultureSubsidiesBillions: 22.0,
  },
  {
    year: 2003,
    educationSpendingBillions: 655.0,
    healthcareSpendingBillions: 740.0,
    militarySpendingBillions: 404.9,
    socialBenefitsSpendingBillions: 750.0,
    infrastructureSpendingBillions: 235.0,
    rdSpendingBillions: 110.0,
    criminalJusticeSpendingBillions: 185.0,
    environmentalSpendingBillions: 29.8,
    foreignAidSpendingBillions: 28.0,
    veteransSpendingBillions: 57.0,
    interestOnDebtBillions: 153.1,
    agricultureSubsidiesBillions: 23.4,
  },
  {
    year: 2004,
    educationSpendingBillions: 690.0,
    healthcareSpendingBillions: 795.0,
    militarySpendingBillions: 455.9,
    socialBenefitsSpendingBillions: 785.0,
    infrastructureSpendingBillions: 245.0,
    rdSpendingBillions: 120.0,
    criminalJusticeSpendingBillions: 195.0,
    environmentalSpendingBillions: 30.7,
    foreignAidSpendingBillions: 32.0,
    veteransSpendingBillions: 60.0,
    interestOnDebtBillions: 160.2,
    agricultureSubsidiesBillions: 15.5,
  },
  {
    year: 2005,
    educationSpendingBillions: 725.0,
    healthcareSpendingBillions: 850.0,
    militarySpendingBillions: 495.3,
    socialBenefitsSpendingBillions: 825.0,
    infrastructureSpendingBillions: 258.0,
    rdSpendingBillions: 128.0,
    criminalJusticeSpendingBillions: 205.0,
    environmentalSpendingBillions: 33.0,
    foreignAidSpendingBillions: 35.0,
    veteransSpendingBillions: 70.0,
    interestOnDebtBillions: 184.0,
    agricultureSubsidiesBillions: 24.0,
  },
  {
    year: 2006,
    educationSpendingBillions: 770.0,
    healthcareSpendingBillions: 920.0,
    militarySpendingBillions: 521.8,
    socialBenefitsSpendingBillions: 875.0,
    infrastructureSpendingBillions: 270.0,
    rdSpendingBillions: 132.0,
    criminalJusticeSpendingBillions: 215.0,
    environmentalSpendingBillions: 34.5,
    foreignAidSpendingBillions: 33.0,
    veteransSpendingBillions: 72.0,
    interestOnDebtBillions: 226.6,
    agricultureSubsidiesBillions: 20.2,
  },
  {
    year: 2007,
    educationSpendingBillions: 820.0,
    healthcareSpendingBillions: 980.0,
    militarySpendingBillions: 551.3,
    socialBenefitsSpendingBillions: 920.0,
    infrastructureSpendingBillions: 290.0,
    rdSpendingBillions: 136.0,
    criminalJusticeSpendingBillions: 228.0,
    environmentalSpendingBillions: 35.2,
    foreignAidSpendingBillions: 36.0,
    veteransSpendingBillions: 75.0,
    interestOnDebtBillions: 237.1,
    agricultureSubsidiesBillions: 16.0,
  },
  {
    year: 2008,
    educationSpendingBillions: 870.0,
    healthcareSpendingBillions: 1050.0,
    militarySpendingBillions: 616.1,
    socialBenefitsSpendingBillions: 1050.0, // Start of recession impact
    infrastructureSpendingBillions: 310.0,
    rdSpendingBillions: 142.0,
    criminalJusticeSpendingBillions: 240.0,
    environmentalSpendingBillions: 36.5,
    foreignAidSpendingBillions: 39.0,
    veteransSpendingBillions: 85.0,
    interestOnDebtBillions: 252.8,
    agricultureSubsidiesBillions: 18.5,
  },
  {
    year: 2009,
    educationSpendingBillions: 910.0,
    healthcareSpendingBillions: 1150.0,
    militarySpendingBillions: 661.0,
    socialBenefitsSpendingBillions: 1250.0, // ARRA stimulus peak
    infrastructureSpendingBillions: 350.0, // Stimulus
    rdSpendingBillions: 155.0,
    criminalJusticeSpendingBillions: 245.0,
    environmentalSpendingBillions: 42.0,
    foreignAidSpendingBillions: 45.0,
    veteransSpendingBillions: 95.0,
    interestOnDebtBillions: 186.9, // Rates dropped
    agricultureSubsidiesBillions: 20.0,
  },
  {
    year: 2010,
    educationSpendingBillions: 940.0,
    healthcareSpendingBillions: 1200.0,
    militarySpendingBillions: 693.5,
    socialBenefitsSpendingBillions: 1300.0,
    infrastructureSpendingBillions: 340.0,
    rdSpendingBillions: 150.0,
    criminalJusticeSpendingBillions: 250.0,
    environmentalSpendingBillions: 44.0,
    foreignAidSpendingBillions: 48.0,
    veteransSpendingBillions: 108.0,
    interestOnDebtBillions: 196.2,
    agricultureSubsidiesBillions: 19.5,
  },
  {
    year: 2011,
    educationSpendingBillions: 950.0,
    healthcareSpendingBillions: 1250.0,
    militarySpendingBillions: 711.3,
    socialBenefitsSpendingBillions: 1320.0,
    infrastructureSpendingBillions: 330.0,
    rdSpendingBillions: 145.0,
    criminalJusticeSpendingBillions: 255.0,
    environmentalSpendingBillions: 43.0,
    foreignAidSpendingBillions: 48.0,
    veteransSpendingBillions: 118.0,
    interestOnDebtBillions: 230.0,
    agricultureSubsidiesBillions: 17.0,
  },
  {
    year: 2012,
    educationSpendingBillions: 960.0,
    healthcareSpendingBillions: 1300.0,
    militarySpendingBillions: 689.6,
    socialBenefitsSpendingBillions: 1350.0,
    infrastructureSpendingBillions: 325.0,
    rdSpendingBillions: 140.0,
    criminalJusticeSpendingBillions: 260.0,
    environmentalSpendingBillions: 41.0,
    foreignAidSpendingBillions: 47.0,
    veteransSpendingBillions: 124.0,
    interestOnDebtBillions: 220.9,
    agricultureSubsidiesBillions: 16.5,
  },
  {
    year: 2013,
    educationSpendingBillions: 980.0,
    healthcareSpendingBillions: 1350.0,
    militarySpendingBillions: 640.2, // Sequestration
    socialBenefitsSpendingBillions: 1380.0,
    infrastructureSpendingBillions: 320.0,
    rdSpendingBillions: 135.0,
    criminalJusticeSpendingBillions: 265.0,
    environmentalSpendingBillions: 39.0,
    foreignAidSpendingBillions: 42.0,
    veteransSpendingBillions: 138.0,
    interestOnDebtBillions: 220.9,
    agricultureSubsidiesBillions: 21.0,
  },
  {
    year: 2014,
    educationSpendingBillions: 1010.0,
    healthcareSpendingBillions: 1450.0, // ACA expansion kicks in
    militarySpendingBillions: 603.5,
    socialBenefitsSpendingBillions: 1420.0,
    infrastructureSpendingBillions: 330.0,
    rdSpendingBillions: 138.0,
    criminalJusticeSpendingBillions: 270.0,
    environmentalSpendingBillions: 40.0,
    foreignAidSpendingBillions: 43.0,
    veteransSpendingBillions: 149.0,
    interestOnDebtBillions: 229.0,
    agricultureSubsidiesBillions: 18.0,
  },
  {
    year: 2015,
    educationSpendingBillions: 1050.0,
    healthcareSpendingBillions: 1550.0,
    militarySpendingBillions: 596.1,
    socialBenefitsSpendingBillions: 1480.0,
    infrastructureSpendingBillions: 340.0,
    rdSpendingBillions: 142.0,
    criminalJusticeSpendingBillions: 275.0,
    environmentalSpendingBillions: 41.0,
    foreignAidSpendingBillions: 45.0,
    veteransSpendingBillions: 159.0,
    interestOnDebtBillions: 223.2,
    agricultureSubsidiesBillions: 17.5,
  },
  {
    year: 2016,
    educationSpendingBillions: 1090.0,
    healthcareSpendingBillions: 1650.0,
    militarySpendingBillions: 600.1,
    socialBenefitsSpendingBillions: 1520.0,
    infrastructureSpendingBillions: 350.0,
    rdSpendingBillions: 148.0,
    criminalJusticeSpendingBillions: 285.0,
    environmentalSpendingBillions: 42.0,
    foreignAidSpendingBillions: 48.0,
    veteransSpendingBillions: 174.0,
    interestOnDebtBillions: 240.0,
    agricultureSubsidiesBillions: 25.0,
  },
  {
    year: 2017,
    educationSpendingBillions: 1130.0,
    healthcareSpendingBillions: 1750.0,
    militarySpendingBillions: 620.0,
    socialBenefitsSpendingBillions: 1580.0,
    infrastructureSpendingBillions: 360.0,
    rdSpendingBillions: 155.0,
    criminalJusticeSpendingBillions: 295.0,
    environmentalSpendingBillions: 43.0,
    foreignAidSpendingBillions: 47.0,
    veteransSpendingBillions: 177.0,
    interestOnDebtBillions: 262.6,
    agricultureSubsidiesBillions: 22.0,
  },
  {
    year: 2018,
    educationSpendingBillions: 1180.0,
    healthcareSpendingBillions: 1850.0,
    militarySpendingBillions: 665.0,
    socialBenefitsSpendingBillions: 1650.0,
    infrastructureSpendingBillions: 375.0,
    rdSpendingBillions: 162.0,
    criminalJusticeSpendingBillions: 305.0,
    environmentalSpendingBillions: 44.0,
    foreignAidSpendingBillions: 46.0,
    veteransSpendingBillions: 189.0,
    interestOnDebtBillions: 325.0,
    agricultureSubsidiesBillions: 28.0, // Trade war subsidies
  },
  {
    year: 2019,
    educationSpendingBillions: 1220.0,
    healthcareSpendingBillions: 1950.0,
    militarySpendingBillions: 715.0,
    socialBenefitsSpendingBillions: 1750.0,
    infrastructureSpendingBillions: 390.0,
    rdSpendingBillions: 170.0,
    criminalJusticeSpendingBillions: 315.0,
    environmentalSpendingBillions: 45.0,
    foreignAidSpendingBillions: 45.0,
    veteransSpendingBillions: 201.0,
    interestOnDebtBillions: 375.2,
    agricultureSubsidiesBillions: 42.0, // Peak trade aid
  },
  {
    year: 2020,
    educationSpendingBillions: 1250.0,
    healthcareSpendingBillions: 2200.0, // COVID
    militarySpendingBillions: 755.0,
    socialBenefitsSpendingBillions: 3200.0, // CARES Act, Unemployment
    infrastructureSpendingBillions: 420.0,
    rdSpendingBillions: 180.0, // Vaccine dev
    criminalJusticeSpendingBillions: 320.0,
    environmentalSpendingBillions: 46.0,
    foreignAidSpendingBillions: 48.0,
    veteransSpendingBillions: 218.0,
    interestOnDebtBillions: 345.5, // Rates dropped again
    agricultureSubsidiesBillions: 45.0,
  },
  {
    year: 2021,
    educationSpendingBillions: 1300.0, // ARP schools
    healthcareSpendingBillions: 2400.0,
    militarySpendingBillions: 780.0,
    socialBenefitsSpendingBillions: 2900.0, // Stimulus checks continued
    infrastructureSpendingBillions: 450.0,
    rdSpendingBillions: 190.0,
    criminalJusticeSpendingBillions: 330.0,
    environmentalSpendingBillions: 50.0,
    foreignAidSpendingBillions: 52.0,
    veteransSpendingBillions: 235.0,
    interestOnDebtBillions: 352.3,
    agricultureSubsidiesBillions: 28.0,
  },
  {
    year: 2022,
    educationSpendingBillions: 1350.0,
    healthcareSpendingBillions: 2500.0,
    militarySpendingBillions: 810.0,
    socialBenefitsSpendingBillions: 2100.0, // Spending normalizing
    infrastructureSpendingBillions: 480.0, // IIJA starting
    rdSpendingBillions: 200.0,
    criminalJusticeSpendingBillions: 345.0,
    environmentalSpendingBillions: 55.0,
    foreignAidSpendingBillions: 65.0, // Ukraine aid starts
    veteransSpendingBillions: 270.0, // PACT Act
    interestOnDebtBillions: 475.1, // Rates rising
    agricultureSubsidiesBillions: 25.0,
  },
  {
    year: 2023,
    educationSpendingBillions: 1400.0,
    healthcareSpendingBillions: 2600.0,
    militarySpendingBillions: 840.0,
    socialBenefitsSpendingBillions: 2200.0,
    infrastructureSpendingBillions: 520.0,
    rdSpendingBillions: 210.0,
    criminalJusticeSpendingBillions: 360.0,
    environmentalSpendingBillions: 60.0,
    foreignAidSpendingBillions: 70.0, // Ukraine aid
    veteransSpendingBillions: 300.0,
    interestOnDebtBillions: 659.0, // Major spike due to rates
    agricultureSubsidiesBillions: 24.0,
  },
];
