
import { fetchWHOHealthyLifeExpectancy } from '../packages/data/src/fetchers/who.js';
// Hardcode TOP_COUNTRIES to avoid importing from pipelines (which might have other deps)
const TOP_COUNTRIES = [
  'USA', 'GBR', 'CAN', 'AUS', 'DEU', 'FRA', 'JPN', 'KOR', 'SGP', 'NZL',
  'NOR', 'SWE', 'DNK', 'FIN', 'NLD', 'BEL', 'AUT', 'CHE', 'IRL', 'ISR',
  'ITA', 'ESP', 'PRT', 'GRC', 'CZE', 'POL', 'HUN', 'SVK', 'SVN', 'EST',
  'LTU', 'LVA', 'CHL', 'MEX', 'COL', 'BRA', 'ARG', 'ZAF', 'TUR', 'IND',
  'CHN', 'IDN', 'THA', 'MYS', 'PHL', 'VNM', 'RUS', 'UKR', 'EGY', 'NGA',
];

async function main() {
  console.error('Fetching HALE data for top countries...');
  const data = await fetchWHOHealthyLifeExpectancy({
    jurisdictions: TOP_COUNTRIES,
    period: { startYear: 2000, endYear: 2023 }
  });

  console.error('Fetched', data.length, 'records.');

  // Group by country and year
  const map: Record<string, number> = {};
  for (const d of data) {
    map[`${d.jurisdictionIso3}-${d.year}`] = d.value;
  }

  // Output as JSON to stdout
  console.log(JSON.stringify(map, null, 2));
}

main().catch(console.error);
