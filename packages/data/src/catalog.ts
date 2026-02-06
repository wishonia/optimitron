/**
 * Catalog of datasets available in mikepsinn/economic-data
 *
 * Each entry describes a CSV file in the `data/` folder of the repo.
 * Only Gapminder-format CSVs (countries × years) are included;
 * xlsx files and non-standard CSVs are excluded.
 */

export interface CatalogEntry {
  /** Filename in the data/ folder (e.g. "data_health_life_expectancy_years.csv") */
  filename: string;
  /** Human-readable label */
  label: string;
  /** Broad category */
  category: 'health' | 'income' | 'energy' | 'political' | 'population' | 'culture' | 'spending' | 'other';
  /** Unit of measurement (if known) */
  unit?: string;
  /** Short description */
  description?: string;
}

/**
 * All Gapminder-format CSV datasets in the economic-data repo.
 */
export const ECONOMIC_DATA_CATALOG: readonly CatalogEntry[] = [
  // ── Health ──────────────────────────────────────────────────────────
  {
    filename: 'data_health_life_expectancy_years.csv',
    label: 'Life Expectancy',
    category: 'health',
    unit: 'years',
    description: 'Life expectancy at birth',
  },
  {
    filename: 'data_health_alcohol_consumption_per_adult_15plus_litres.csv',
    label: 'Alcohol Consumption',
    category: 'health',
    unit: 'litres per adult',
    description: 'Alcohol consumption per adult (15+)',
  },
  {
    filename: 'data_health_annual_hiv_deaths_number_all_ages.csv',
    label: 'Annual HIV Deaths',
    category: 'health',
    unit: 'deaths',
    description: 'Annual number of HIV deaths, all ages',
  },
  {
    filename: 'data_health_blood_pressure_sbp_men_mmhg.csv',
    label: 'Blood Pressure (Men)',
    category: 'health',
    unit: 'mmHg',
    description: 'Systolic blood pressure, men',
  },
  {
    filename: 'data_health_body_mass_index_bmi_women_kgperm2.csv',
    label: 'BMI (Women)',
    category: 'health',
    unit: 'kg/m²',
    description: 'Body mass index, women',
  },
  {
    filename: 'data_health_cholesterol_fat_in_blood_men_mmolperl.csv',
    label: 'Cholesterol (Men)',
    category: 'health',
    unit: 'mmol/L',
    description: 'Cholesterol in blood, men',
  },
  {
    filename: 'data_health_cholesterol_fat_in_blood_women_mmolperl.csv',
    label: 'Cholesterol (Women)',
    category: 'health',
    unit: 'mmol/L',
    description: 'Cholesterol in blood, women',
  },
  {
    filename: 'data_health_smoking_adults_percent_of_population_over_age_15.csv',
    label: 'Smoking Prevalence',
    category: 'health',
    unit: '% of population (15+)',
    description: 'Percentage of adults who smoke',
  },
  {
    filename: 'data_health_sugar_per_person_g_per_day.csv',
    label: 'Sugar Consumption',
    category: 'health',
    unit: 'g/day',
    description: 'Sugar consumption per person per day',
  },
  {
    filename: 'data_health_suicide_total_deaths.csv',
    label: 'Suicide Deaths',
    category: 'health',
    unit: 'deaths',
    description: 'Total suicide deaths',
  },

  // ── Income / Economic ──────────────────────────────────────────────
  {
    filename: 'data_income_income_per_person_gdppercapita_ppp_inflation_adjusted.csv',
    label: 'Income Per Person (GDP/capita PPP)',
    category: 'income',
    unit: 'international $',
    description: 'GDP per capita, PPP, inflation-adjusted',
  },
  {
    filename: 'data_income_poverty_percent_below_190_a_day.csv',
    label: 'Poverty (<$1.90/day)',
    category: 'income',
    unit: '% of population',
    description: 'Population below $1.90/day poverty line',
  },
  {
    filename: 'data_income_poverty_percent_below_320_a_day.csv',
    label: 'Poverty (<$3.20/day)',
    category: 'income',
    unit: '% of population',
    description: 'Population below $3.20/day poverty line',
  },
  {
    filename: 'data_income_poverty_percent_below_550_a_day.csv',
    label: 'Poverty (<$5.50/day)',
    category: 'income',
    unit: '% of population',
    description: 'Population below $5.50/day poverty line',
  },
  {
    filename: 'data_income_total_gdp_ppp.csv',
    label: 'Total GDP (PPP)',
    category: 'income',
    unit: 'international $',
    description: 'Total GDP, purchasing power parity',
  },
  {
    filename: 'data_income_total_gdp_yearly_growth.csv',
    label: 'GDP Yearly Growth',
    category: 'income',
    unit: '% annual growth',
    description: 'Annual GDP growth rate',
  },
  {
    filename: 'Adjusted net national income per capita.csv',
    label: 'Adjusted Net National Income Per Capita',
    category: 'income',
    unit: 'current US$',
  },

  // ── Energy ─────────────────────────────────────────────────────────
  {
    filename: 'data_energy_co2_emissions_tonnes_per_person.csv',
    label: 'CO₂ Emissions Per Person',
    category: 'energy',
    unit: 'tonnes/person',
  },
  {
    filename: 'data_energy_coal_consumption_per_person.csv',
    label: 'Coal Consumption Per Person',
    category: 'energy',
    unit: 'tonnes/person',
  },
  {
    filename: 'data_energy_electricity_use_per_person.csv',
    label: 'Electricity Use Per Person',
    category: 'energy',
    unit: 'kWh/person',
  },
  {
    filename: 'data_energy_energy_production_per_person.csv',
    label: 'Energy Production Per Person',
    category: 'energy',
    unit: 'tonnes oil equivalent/person',
  },
  {
    filename: 'data_energy_energy_use_per_person.csv',
    label: 'Energy Use Per Person',
    category: 'energy',
    unit: 'kg oil equivalent/person',
  },
  {
    filename: 'data_energy_hydro_power_generation_per_person.csv',
    label: 'Hydro Power Generation Per Person',
    category: 'energy',
    unit: 'kWh/person',
  },
  {
    filename: 'data_energy_natural_gas_production_per_person.csv',
    label: 'Natural Gas Production Per Person',
    category: 'energy',
    unit: 'tonnes oil equivalent/person',
  },
  {
    filename: 'data_energy_nuclear_power_generation_per_person.csv',
    label: 'Nuclear Power Generation Per Person',
    category: 'energy',
    unit: 'kWh/person',
  },
  {
    filename: 'data_energy_oil_consumption_per_cap.csv',
    label: 'Oil Consumption Per Capita',
    category: 'energy',
    unit: 'tonnes/person',
  },
  {
    filename: 'data_energy_oil_production_per_person.csv',
    label: 'Oil Production Per Person',
    category: 'energy',
    unit: 'tonnes/person',
  },

  // ── Political / Governance ─────────────────────────────────────────
  {
    filename: 'data_political_all.csv',
    label: 'Political Indicators (All)',
    category: 'political',
  },
  {
    filename: 'data_political_civlibx_eiu.csv',
    label: 'Civil Liberties Index (EIU)',
    category: 'political',
    unit: 'index (0-10)',
  },
  {
    filename: 'data_political_corruption_perception_index_cpi.csv',
    label: 'Corruption Perception Index',
    category: 'political',
    unit: 'index (0-100)',
  },
  {
    filename: 'data_political_demox_eiu.csv',
    label: 'Democracy Index (EIU)',
    category: 'political',
    unit: 'index (0-10)',
  },
  {
    filename: 'data_political_gini.csv',
    label: 'Gini Index',
    category: 'political',
    unit: 'index (0-100)',
  },
  {
    filename: 'data_political_polpartix_eiu.csv',
    label: 'Political Participation Index (EIU)',
    category: 'political',
    unit: 'index (0-10)',
  },
  {
    filename: 'data_political_polrights_fh.csv',
    label: 'Political Rights (Freedom House)',
    category: 'political',
    unit: 'index (1-7)',
  },

  // ── Population ─────────────────────────────────────────────────────
  {
    filename: 'data_population_population_growth_annual_percent.csv',
    label: 'Population Growth',
    category: 'population',
    unit: '% annual',
  },
  {
    filename: 'data_population_population_total.csv',
    label: 'Total Population',
    category: 'population',
    unit: 'people',
  },

  // ── Culture ────────────────────────────────────────────────────────
  {
    filename: 'data_culture_murder_total_deaths.csv',
    label: 'Murder Total Deaths',
    category: 'culture',
    unit: 'deaths',
  },

  // ── Spending / Government ──────────────────────────────────────────
  {
    filename: 'government-spending-vs-gdp-per-capita.csv',
    label: 'Government Spending vs GDP Per Capita',
    category: 'spending',
  },
  {
    filename: 'government-procurement-share-gdp.csv',
    label: 'Government Procurement Share of GDP',
    category: 'spending',
    unit: '% of GDP',
  },
  {
    filename: 'health-expenditure-government-expenditure.csv',
    label: 'Health Expenditure (Government)',
    category: 'spending',
  },
  {
    filename: 'historical-gov-spending-gdp.csv',
    label: 'Historical Government Spending (% GDP)',
    category: 'spending',
    unit: '% of GDP',
  },
  {
    filename: 'military-spending-2022.csv',
    label: 'Military Spending (2022)',
    category: 'spending',
  },
  {
    filename: 'oecd-expenditures-on-government-outsourcing-gdp.csv',
    label: 'OECD Government Outsourcing Expenditure',
    category: 'spending',
    unit: '% of GDP',
  },
  {
    filename: 'public-health-expenditure-share-gdp.csv',
    label: 'Public Health Expenditure (% GDP)',
    category: 'spending',
    unit: '% of GDP',
  },
  {
    filename: 'reduction-in-income-inequality.csv',
    label: 'Reduction in Income Inequality',
    category: 'spending',
  },
  {
    filename: 'share-of-education-in-government-expenditure.csv',
    label: 'Education Share of Government Expenditure',
    category: 'spending',
    unit: '% of gov expenditure',
  },
  {
    filename: 'share-of-employee-compensation-in-public-spending.csv',
    label: 'Employee Compensation in Public Spending',
    category: 'spending',
    unit: '% of public spending',
  },
  {
    filename: 'share-social-protection-in-government-exp-oecd-2013.csv',
    label: 'Social Protection Share (OECD 2013)',
    category: 'spending',
    unit: '% of gov expenditure',
  },
  {
    filename: 'social-expenditure-as-percentage-of-gdp.csv',
    label: 'Social Expenditure (% GDP)',
    category: 'spending',
    unit: '% of GDP',
  },
  {
    filename: 'social-spending-oecd-longrun.csv',
    label: 'Social Spending (OECD Long Run)',
    category: 'spending',
    unit: '% of GDP',
  },
  {
    filename: 'total-gov-expenditure-gdp-wdi.csv',
    label: 'Total Government Expenditure (% GDP, WDI)',
    category: 'spending',
    unit: '% of GDP',
  },
  {
    filename: 'total-gov-expenditure-percapita-oecd.csv',
    label: 'Total Government Expenditure Per Capita (OECD)',
    category: 'spending',
    unit: 'USD/person',
  },
  {
    filename: 'various-measures-of-social-expenditure-as-share-of-gdp.csv',
    label: 'Social Expenditure Measures (% GDP)',
    category: 'spending',
    unit: '% of GDP',
  },

  // ── Other ──────────────────────────────────────────────────────────
  {
    filename: 'countries_population_income_corrected_v2.csv',
    label: 'Countries Population & Income (Corrected v2)',
    category: 'other',
  },
  {
    filename: 'global-data-by-country_combined_country_data.csv',
    label: 'Global Data by Country (Combined)',
    category: 'other',
  },
  {
    filename: 'global-data-by-country_country_regions.csv',
    label: 'Country Regions Mapping',
    category: 'other',
  },
  {
    filename: 'country_regions.csv',
    label: 'Country Regions',
    category: 'other',
  },
  {
    filename: 'immigration-by-country-2023.csv',
    label: 'Immigration by Country (2023)',
    category: 'other',
  },
  {
    filename: 'merged-country-data.csv',
    label: 'Merged Country Data',
    category: 'other',
  },
  {
    filename: 'us_dollar_value.csv',
    label: 'US Dollar Value',
    category: 'other',
  },
] as const;

/**
 * Get catalog entries filtered by category.
 */
export function getCatalogByCategory(
  category: CatalogEntry['category'],
): CatalogEntry[] {
  return ECONOMIC_DATA_CATALOG.filter(e => e.category === category);
}

/**
 * Look up a catalog entry by filename.
 */
export function getCatalogEntry(filename: string): CatalogEntry | undefined {
  return ECONOMIC_DATA_CATALOG.find(e => e.filename === filename);
}

/**
 * Get all Gapminder-style CSV filenames (data_* prefix — most reliable format).
 */
export function getGapminderFilenames(): string[] {
  return ECONOMIC_DATA_CATALOG
    .filter(e => e.filename.startsWith('data_'))
    .map(e => e.filename);
}
