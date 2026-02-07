/**
 * US Climate/Clean Energy Spending vs Emissions & GDP
 *
 * Sources:
 * - Renewable investment: IEA World Energy Investment, BloombergNEF
 * - Renewable share: EIA Electric Power Monthly (Table 1.1)
 * - CO2 emissions: EIA (energy-related CO2), EPA GHG Inventory
 * - GDP growth: BEA NIPA
 * - Clean energy jobs: DOE US Energy & Employment Report (USEER)
 * - Fossil fuel subsidies: IMF estimates, EIA
 */

export interface USClimateSpendingDataPoint {
  year: number;
  /** US clean energy investment, billions USD (nominal) */
  renewableEnergyInvestmentBillions: number;
  /** Renewable energy as % of total electricity generation */
  renewableSharePercent: number;
  /** Energy-related CO2 emissions, million metric tons */
  co2EmissionsMillionTons: number;
  /** Real GDP growth rate, % */
  realGdpGrowthRate: number;
  /** Clean energy employment, thousands (DOE USEER — available ~2016+) */
  cleanEnergyJobsThousands: number | null;
  /** Fossil fuel subsidies, billions USD (IMF estimates — sporadic) */
  fossilFuelSubsidiesBillions: number | null;
}

export const US_CLIMATE_SPENDING_DATA: USClimateSpendingDataPoint[] = [
  { year: 2000, renewableEnergyInvestmentBillions: 4.3, renewableSharePercent: 8.8, co2EmissionsMillionTons: 5861, realGdpGrowthRate: 4.1, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2001, renewableEnergyInvestmentBillions: 4.8, renewableSharePercent: 8.4, co2EmissionsMillionTons: 5752, realGdpGrowthRate: 1.0, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2002, renewableEnergyInvestmentBillions: 4.5, renewableSharePercent: 8.7, co2EmissionsMillionTons: 5796, realGdpGrowthRate: 1.7, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2003, renewableEnergyInvestmentBillions: 5.1, renewableSharePercent: 9.1, co2EmissionsMillionTons: 5852, realGdpGrowthRate: 2.9, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2004, renewableEnergyInvestmentBillions: 6.2, renewableSharePercent: 8.8, co2EmissionsMillionTons: 5921, realGdpGrowthRate: 3.8, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2005, renewableEnergyInvestmentBillions: 11.4, renewableSharePercent: 8.7, co2EmissionsMillionTons: 5945, realGdpGrowthRate: 3.5, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2006, renewableEnergyInvestmentBillions: 16.3, renewableSharePercent: 8.5, co2EmissionsMillionTons: 5876, realGdpGrowthRate: 2.9, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2007, renewableEnergyInvestmentBillions: 25.4, renewableSharePercent: 8.4, co2EmissionsMillionTons: 5913, realGdpGrowthRate: 1.9, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2008, renewableEnergyInvestmentBillions: 33.6, renewableSharePercent: 9.2, co2EmissionsMillionTons: 5770, realGdpGrowthRate: -0.1, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2009, renewableEnergyInvestmentBillions: 21.6, renewableSharePercent: 10.0, co2EmissionsMillionTons: 5356, realGdpGrowthRate: -2.5, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2010, renewableEnergyInvestmentBillions: 33.6, renewableSharePercent: 10.4, co2EmissionsMillionTons: 5580, realGdpGrowthRate: 2.6, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2011, renewableEnergyInvestmentBillions: 42.5, renewableSharePercent: 12.2, co2EmissionsMillionTons: 5454, realGdpGrowthRate: 1.6, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2012, renewableEnergyInvestmentBillions: 38.1, renewableSharePercent: 11.9, co2EmissionsMillionTons: 5230, realGdpGrowthRate: 2.2, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2013, renewableEnergyInvestmentBillions: 35.2, renewableSharePercent: 12.9, co2EmissionsMillionTons: 5356, realGdpGrowthRate: 1.8, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2014, renewableEnergyInvestmentBillions: 38.3, renewableSharePercent: 13.2, co2EmissionsMillionTons: 5404, realGdpGrowthRate: 2.5, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2015, renewableEnergyInvestmentBillions: 44.1, renewableSharePercent: 13.4, co2EmissionsMillionTons: 5263, realGdpGrowthRate: 3.1, cleanEnergyJobsThousands: null, fossilFuelSubsidiesBillions: null },
  { year: 2016, renewableEnergyInvestmentBillions: 46.4, renewableSharePercent: 14.7, co2EmissionsMillionTons: 5170, realGdpGrowthRate: 1.8, cleanEnergyJobsThousands: 3384, fossilFuelSubsidiesBillions: 649 },
  { year: 2017, renewableEnergyInvestmentBillions: 46.5, renewableSharePercent: 17.0, co2EmissionsMillionTons: 5131, realGdpGrowthRate: 2.4, cleanEnergyJobsThousands: 3373, fossilFuelSubsidiesBillions: 634 },
  { year: 2018, renewableEnergyInvestmentBillions: 46.2, renewableSharePercent: 17.0, co2EmissionsMillionTons: 5269, realGdpGrowthRate: 3.0, cleanEnergyJobsThousands: 3437, fossilFuelSubsidiesBillions: 649 },
  { year: 2019, renewableEnergyInvestmentBillions: 49.3, renewableSharePercent: 17.5, co2EmissionsMillionTons: 5107, realGdpGrowthRate: 2.3, cleanEnergyJobsThousands: 3364, fossilFuelSubsidiesBillions: 662 },
  { year: 2020, renewableEnergyInvestmentBillions: 49.0, renewableSharePercent: 19.8, co2EmissionsMillionTons: 4571, realGdpGrowthRate: -2.8, cleanEnergyJobsThousands: 3013, fossilFuelSubsidiesBillions: 662 },
  { year: 2021, renewableEnergyInvestmentBillions: 55.9, renewableSharePercent: 20.1, co2EmissionsMillionTons: 4872, realGdpGrowthRate: 5.9, cleanEnergyJobsThousands: 3207, fossilFuelSubsidiesBillions: 757 },
  { year: 2022, renewableEnergyInvestmentBillions: 64.0, renewableSharePercent: 21.5, co2EmissionsMillionTons: 4825, realGdpGrowthRate: 1.9, cleanEnergyJobsThousands: 3425, fossilFuelSubsidiesBillions: 760 },
  { year: 2023, renewableEnergyInvestmentBillions: 78.0, renewableSharePercent: 22.7, co2EmissionsMillionTons: 4676, realGdpGrowthRate: 2.5, cleanEnergyJobsThousands: 3520, fossilFuelSubsidiesBillions: 757 },
];
