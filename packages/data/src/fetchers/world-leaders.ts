/**
 * Fetch current heads of state/government from Wikidata SPARQL.
 *
 * Returns leader name + Wikimedia Commons image URL for each country (ISO 3166-1 alpha-2).
 * Used to populate Person records for treaty signer tasks.
 */

export interface WorldLeader {
  countryCode: string;
  countryName: string;
  leaderName: string;
  leaderImageUrl: string | null;
  roleTitle: string;
  wikidataId: string;
}

const WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql";

/**
 * SPARQL query to get current heads of state and government with their images.
 * Prefers head of government (P6) over head of state (P35) since the HoG is
 * usually the decision-maker for treaty ratification.
 */
const SPARQL_QUERY = `
SELECT DISTINCT ?country ?countryLabel ?countryCode ?leader ?leaderLabel ?roleLabel ?image WHERE {
  {
    ?country p:P6 ?stmt .
    ?stmt ps:P6 ?leader .
    FILTER NOT EXISTS { ?stmt pq:P582 ?endDate }
    BIND("Head of Government" AS ?role)
  } UNION {
    ?country p:P35 ?stmt .
    ?stmt ps:P35 ?leader .
    FILTER NOT EXISTS { ?stmt pq:P582 ?endDate }
    BIND("Head of State" AS ?role)
  }
  ?country wdt:P31 wd:Q3624078 .
  ?country wdt:P297 ?countryCode .
  OPTIONAL { ?leader wdt:P18 ?image }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
}
ORDER BY ?countryCode
`;

export async function fetchWorldLeaders(): Promise<WorldLeader[]> {
  const url = new URL(WIKIDATA_SPARQL_URL);
  url.searchParams.set("query", SPARQL_QUERY);
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": "Optimitron/1.0 (https://optimitron.com; contact@optimitron.com)",
    },
  });

  if (!response.ok) {
    throw new Error(`Wikidata SPARQL query failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as {
    results: {
      bindings: Array<{
        country: { value: string };
        countryCode: { value: string };
        countryLabel: { value: string };
        image?: { value: string };
        leader: { value: string };
        leaderLabel: { value: string };
        roleLabel: { value: string };
      }>;
    };
  };

  // Deduplicate: prefer head of government over head of state for each country
  const byCountry = new Map<string, WorldLeader>();

  for (const binding of data.results.bindings) {
    const countryCode = binding.countryCode.value.toUpperCase();
    const role = binding.roleLabel.value;
    const existing = byCountry.get(countryCode);

    // Prefer Head of Government over Head of State
    if (existing && role === "Head of State") continue;

    const wikidataId = binding.leader.value.split("/").pop() ?? "";

    byCountry.set(countryCode, {
      countryCode,
      countryName: binding.countryLabel.value,
      leaderImageUrl: binding.image?.value ?? null,
      leaderName: binding.leaderLabel.value,
      roleTitle: role,
      wikidataId,
    });
  }

  return [...byCountry.values()].sort((a, b) => a.countryCode.localeCompare(b.countryCode));
}
