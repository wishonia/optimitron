export interface GovernmentDeathLedgerSource {
  label: string;
  url: string;
}

export type GovernmentDeathEstimateMethod =
  | 'documented-minimum'
  | 'legacy-composite'
  | 'rummel-midpoint';

export interface GovernmentDeathLedgerEntry {
  id: string;
  governmentCode: string;
  label: string;
  startYear: number;
  endYear: number;
  deaths: number;
  method: GovernmentDeathEstimateMethod;
  notes: string;
  sourceLabel: string;
  sourceUrl?: string;
  sourceLinks: GovernmentDeathLedgerSource[];
}

export interface GovernmentDeathLedgerSummary {
  totalDeaths: number;
  startYear: number;
  endYear: number;
  source: string;
  url?: string;
}

const RUMMEL_NOTE_URL = 'https://www.hawaii.edu/powerkills/NOTE1.HTM';
const RUMMEL_TABLES_URL = 'https://www.hawaii.edu/powerkills/NOTE5.HTM';
const END_OF_HISTORY_URL =
  'https://theendofhistory.net/genocides-and-mass-murders-since-1900/';
const GENOCIDES_LIST_URL =
  'https://en.wikipedia.org/wiki/List_of_genocides';
const USSR_CHAPTER_URL = 'https://www.hawaii.edu/powerkills/USSR.CHAP.1.HTM';
const CHINA_CHAPTER_URL = 'https://www.hawaii.edu/powerkills/CHINA.CHAP1.HTM';
const NAZI_CHAPTER_URL = 'https://www.hawaii.edu/powerkills/NOTE3.HTM';
const JAPAN_CHAPTER_URL = 'https://www.hawaii.edu/powerkills/SOD.CHAP3.HTM';
const LESSER_MURDERERS_URL = 'https://www.hawaii.edu/powerkills/SOD.CHAP15.HTM';

export const GOVERNMENT_DEATH_LEDGER: GovernmentDeathLedgerEntry[] = [
  {
    id: 'us-postwar-wars',
    governmentCode: 'US',
    label: 'US-led wars and interventions',
    startYear: 1945,
    endYear: 2025,
    deaths: 4_500_000,
    method: 'legacy-composite',
    notes: 'Existing Optimitron grouped estimate covering Korea, Vietnam, Iraq, Afghanistan, drone wars, and proxy wars.',
    sourceLabel: 'Watson Institute Costs of War, Brown University',
    sourceUrl: 'https://watson.brown.edu/costsofwar/',
    sourceLinks: [{ label: 'Costs of War', url: 'https://watson.brown.edu/costsofwar/' }],
  },
  {
    id: 'ru-soviet-democide',
    governmentCode: 'RU',
    label: 'Soviet communist democide',
    startYear: 1917,
    endYear: 1987,
    deaths: 61_911_000,
    method: 'rummel-midpoint',
    notes: 'Rummel Soviet total through 1987; includes the civil-war and NEP periods and excludes battle deaths.',
    sourceLabel: 'R.J. Rummel Soviet democide chapter',
    sourceUrl: USSR_CHAPTER_URL,
    sourceLinks: [
      { label: 'USSR chapter', url: USSR_CHAPTER_URL },
      { label: 'Rummel source tables', url: RUMMEL_NOTE_URL },
    ],
  },
  {
    id: 'cn-communist-revolutionary-army',
    governmentCode: 'CN',
    label: 'Chinese communist revolutionary army killings',
    startYear: 1923,
    endYear: 1949,
    deaths: 3_500_000,
    method: 'rummel-midpoint',
    notes: 'Pre-1949 communist army democide reported by Rummel; excludes battle deaths.',
    sourceLabel: 'R.J. Rummel China chapter',
    sourceUrl: CHINA_CHAPTER_URL,
    sourceLinks: [
      { label: 'China chapter', url: CHINA_CHAPTER_URL },
      { label: 'Statistics of Democide', url: RUMMEL_TABLES_URL },
    ],
  },
  {
    id: 'cn-prc-democide',
    governmentCode: 'CN',
    label: 'People’s Republic of China democide',
    startYear: 1949,
    endYear: 1987,
    deaths: 76_702_000,
    method: 'rummel-midpoint',
    notes: 'Rummel revised PRC total, including the later famine revision noted on his statistics pages.',
    sourceLabel: 'R.J. Rummel China / Statistics of Democide pages',
    sourceUrl: RUMMEL_TABLES_URL,
    sourceLinks: [
      { label: 'Statistics of Democide', url: RUMMEL_TABLES_URL },
      { label: 'China chapter', url: CHINA_CHAPTER_URL },
    ],
  },
  {
    id: 'gb-postwar-conflicts',
    governmentCode: 'GB',
    label: 'Postwar colonial and expeditionary killings',
    startYear: 1945,
    endYear: 2025,
    deaths: 500_000,
    method: 'legacy-composite',
    notes: 'Existing Optimitron grouped estimate spanning Malaya, Kenya, Iraq, Afghanistan, Libya, and related post-imperial conflicts.',
    sourceLabel: 'Legacy grouped estimate cross-checked against mass-killing chronologies',
    sourceUrl: END_OF_HISTORY_URL,
    sourceLinks: [{ label: 'Chronology of mass murders since 1900', url: END_OF_HISTORY_URL }],
  },
  {
    id: 'il-state-violence',
    governmentCode: 'IL',
    label: 'Israeli state violence and wars',
    startYear: 1948,
    endYear: 2025,
    deaths: 200_000,
    method: 'legacy-composite',
    notes: 'Existing Optimitron grouped estimate spanning Gaza, Lebanon, the occupied territories, and related wars.',
    sourceLabel: 'Legacy grouped estimate anchored to standard genocide/casualty references',
    sourceUrl: GENOCIDES_LIST_URL,
    sourceLinks: [
      { label: 'Wikipedia list of genocides', url: GENOCIDES_LIST_URL },
      { label: 'OCHA occupied Palestinian territory casualty data', url: 'https://www.ochaopt.org/data/casualties' },
    ],
  },
  {
    id: 'sa-yemen-war',
    governmentCode: 'SA',
    label: 'Saudi-led war in Yemen',
    startYear: 2015,
    endYear: 2025,
    deaths: 377_000,
    method: 'legacy-composite',
    notes: 'Existing Optimitron grouped estimate for direct and blockade-linked deaths in Yemen.',
    sourceLabel: 'UN/ACLED/Yemen Data Project grouped estimate',
    sourceUrl: 'https://yemendataproject.org/',
    sourceLinks: [
      { label: 'Yemen Data Project', url: 'https://yemendataproject.org/' },
      { label: 'Wikipedia list of genocides', url: GENOCIDES_LIST_URL },
    ],
  },
  {
    id: 'sg-overseas-operations',
    governmentCode: 'SG',
    label: 'Singapore overseas operations',
    startYear: 1965,
    endYear: 2025,
    deaths: 0,
    method: 'documented-minimum',
    notes: 'Official overseas-operations record reviewed; no documented attributable death toll encoded in this dataset.',
    sourceLabel: 'Singapore MINDEF overseas operations overview',
    sourceUrl: 'https://www.mindef.gov.sg/defence-matters/exercises-operations/overseas-operations/',
    sourceLinks: [{ label: 'MINDEF overseas operations', url: 'https://www.mindef.gov.sg/defence-matters/exercises-operations/overseas-operations/' }],
  },
  {
    id: 'fr-postwar-colonial-wars',
    governmentCode: 'FR',
    label: 'Postwar colonial and expeditionary killings',
    startYear: 1945,
    endYear: 2025,
    deaths: 1_500_000,
    method: 'legacy-composite',
    notes: 'Existing Optimitron grouped estimate spanning Indochina, Algeria, Madagascar, and other postwar operations.',
    sourceLabel: 'Legacy grouped estimate cross-checked against mass-killing chronologies',
    sourceUrl: END_OF_HISTORY_URL,
    sourceLinks: [{ label: 'Chronology of mass murders since 1900', url: END_OF_HISTORY_URL }],
  },
  {
    id: 'tr-young-turks',
    governmentCode: 'TR',
    label: 'Young Turks mass murder campaign',
    startYear: 1913,
    endYear: 1918,
    deaths: 1_883_000,
    method: 'rummel-midpoint',
    notes: 'Rummel chapter-title total for Turkey; the underlying statistics pages show a wider 1900–1923 range, so this ledger uses the cleaner chapter total.',
    sourceLabel: 'R.J. Rummel Death by Government Turkey total',
    sourceUrl: RUMMEL_NOTE_URL,
    sourceLinks: [
      { label: 'Death by Government contents', url: RUMMEL_NOTE_URL },
      { label: 'Lesser murderers chapter', url: LESSER_MURDERERS_URL },
    ],
  },
  {
    id: 'in-state-violence',
    governmentCode: 'IN',
    label: 'State killings and counterinsurgency abuses',
    startYear: 1947,
    endYear: 2025,
    deaths: 100_000,
    method: 'legacy-composite',
    notes: 'Existing Optimitron grouped estimate spanning Kashmir, Punjab, and communal state violence.',
    sourceLabel: 'Legacy grouped estimate cross-checked against mass-killing chronologies',
    sourceUrl: END_OF_HISTORY_URL,
    sourceLinks: [{ label: 'Chronology of mass murders since 1900', url: END_OF_HISTORY_URL }],
  },
  {
    id: 'pk-bangladesh-genocide',
    governmentCode: 'PK',
    label: 'Bangladesh genocide',
    startYear: 1970,
    endYear: 1971,
    deaths: 1_503_000,
    method: 'rummel-midpoint',
    notes: 'Rummel East Pakistan/Bangladesh estimate for the 267-day military assault; excludes battle deaths.',
    sourceLabel: 'R.J. Rummel Death by Government Pakistan total',
    sourceUrl: RUMMEL_NOTE_URL,
    sourceLinks: [
      { label: 'Death by Government contents', url: RUMMEL_NOTE_URL },
      { label: 'Wikipedia genocide list', url: GENOCIDES_LIST_URL },
    ],
  },
  {
    id: 'et-haile-selassie',
    governmentCode: 'ET',
    label: 'Haile Selassie monarchy democide',
    startYear: 1941,
    endYear: 1974,
    deaths: 148_000,
    method: 'rummel-midpoint',
    notes: 'Rummel midpoint estimate for the Ethiopian monarchy.',
    sourceLabel: 'R.J. Rummel lesser murderers chapter',
    sourceUrl: LESSER_MURDERERS_URL,
    sourceLinks: [
      { label: 'Lesser murderers chapter', url: LESSER_MURDERERS_URL },
      { label: 'Statistics of Democide', url: RUMMEL_TABLES_URL },
    ],
  },
  {
    id: 'et-communist-regime',
    governmentCode: 'ET',
    label: 'Derg communist regime democide',
    startYear: 1974,
    endYear: 1987,
    deaths: 725_000,
    method: 'rummel-midpoint',
    notes: 'Rummel midpoint estimate for the Ethiopian communist regime.',
    sourceLabel: 'R.J. Rummel lesser murderers chapter',
    sourceUrl: LESSER_MURDERERS_URL,
    sourceLinks: [
      { label: 'Lesser murderers chapter', url: LESSER_MURDERERS_URL },
      { label: 'Statistics of Democide', url: RUMMEL_TABLES_URL },
    ],
  },
  {
    id: 'ir-postwar-conflicts',
    governmentCode: 'IR',
    label: 'State violence and proxy-war killings',
    startYear: 1979,
    endYear: 2025,
    deaths: 500_000,
    method: 'legacy-composite',
    notes: 'Existing Optimitron grouped estimate spanning the Islamic Republic period.',
    sourceLabel: 'Legacy grouped estimate cross-checked against mass-killing chronologies',
    sourceUrl: END_OF_HISTORY_URL,
    sourceLinks: [{ label: 'Chronology of mass murders since 1900', url: END_OF_HISTORY_URL }],
  },
  {
    id: 'jp-imperial-japan',
    governmentCode: 'JP',
    label: 'Imperial Japan war crimes and occupation murders',
    startYear: 1936,
    endYear: 1945,
    deaths: 5_964_000,
    method: 'rummel-midpoint',
    notes: 'Rummel midpoint estimate for Imperial Japan; excludes battle deaths.',
    sourceLabel: 'R.J. Rummel Japanese democide chapter',
    sourceUrl: JAPAN_CHAPTER_URL,
    sourceLinks: [
      { label: 'Japanese democide chapter', url: JAPAN_CHAPTER_URL },
      { label: 'Statistics of Democide', url: RUMMEL_TABLES_URL },
    ],
  },
  {
    id: 'de-nazi-germany',
    governmentCode: 'DE',
    label: 'Nazi Germany murders',
    startYear: 1933,
    endYear: 1945,
    deaths: 20_946_000,
    method: 'rummel-midpoint',
    notes: 'Rummel midpoint estimate for Nazi Germany; excludes WWII battle deaths.',
    sourceLabel: 'R.J. Rummel Nazi genocide and mass murder chapter',
    sourceUrl: NAZI_CHAPTER_URL,
    sourceLinks: [
      { label: 'Nazi genocide chapter', url: NAZI_CHAPTER_URL },
      { label: 'Death by Government contents', url: RUMMEL_NOTE_URL },
    ],
  },
  {
    id: 'de-kunduz',
    governmentCode: 'DE',
    label: 'Kunduz airstrike',
    startYear: 2009,
    endYear: 2009,
    deaths: 91,
    method: 'documented-minimum',
    notes: 'Documented minimum from the German-ordered Kunduz airstrike in Afghanistan.',
    sourceLabel: 'DW reporting on the German military estimate',
    sourceUrl: 'https://www.dw.com/en/demanding-justice-three-years-on/a-16684294',
    sourceLinks: [{ label: 'DW on the Kunduz death toll', url: 'https://www.dw.com/en/demanding-justice-three-years-on/a-16684294' }],
  },
  {
    id: 'au-modern-operations',
    governmentCode: 'AU',
    label: 'Modern Australian overseas operations',
    startYear: 1945,
    endYear: 2025,
    deaths: 3_000,
    method: 'legacy-composite',
    notes: 'Existing Optimitron grouped estimate spanning Afghanistan, Iraq, and other postwar operations.',
    sourceLabel: 'Australian War Memorial and conflict-database grouped estimate',
    sourceUrl: 'https://www.awm.gov.au/',
    sourceLinks: [{ label: 'Australian War Memorial', url: 'https://www.awm.gov.au/' }],
  },
  {
    id: 'ca-modern-operations',
    governmentCode: 'CA',
    label: 'Modern Canadian overseas operations',
    startYear: 1945,
    endYear: 2025,
    deaths: 500,
    method: 'legacy-composite',
    notes: 'Existing Optimitron grouped estimate spanning Afghanistan and other postwar operations.',
    sourceLabel: 'Veterans Affairs Canada and conflict-database grouped estimate',
    sourceUrl: 'https://www.veterans.gc.ca/en',
    sourceLinks: [{ label: 'Veterans Affairs Canada', url: 'https://www.veterans.gc.ca/en' }],
  },
  {
    id: 'kr-vietnam-massacres',
    governmentCode: 'KR',
    label: 'Vietnam massacres by South Korean forces',
    startYear: 1964,
    endYear: 1973,
    deaths: 9_000,
    method: 'documented-minimum',
    notes: 'Documented minimum for massacres by South Korean troops in Vietnam.',
    sourceLabel: 'Tuoi Tre citing Ku Su Jeong on 80 massacres',
    sourceUrl: 'https://news.tuoitre.vn/vietnamese-survivors-of-skorean-massacre-p1-lifelong-pains-10323344.htm',
    sourceLinks: [{ label: 'Tuoi Tre on South Korean massacres in Vietnam', url: 'https://news.tuoitre.vn/vietnamese-survivors-of-skorean-massacre-p1-lifelong-pains-10323344.htm' }],
  },
];

export function getGovernmentDeathLedgerEntries(
  governmentCode: string,
): GovernmentDeathLedgerEntry[] {
  return GOVERNMENT_DEATH_LEDGER.filter(
    (entry) => entry.governmentCode === governmentCode,
  ).sort((a, b) => b.deaths - a.deaths);
}

export function getGovernmentDeathLedgerSummary(
  governmentCode: string,
): GovernmentDeathLedgerSummary | null {
  const entries = getGovernmentDeathLedgerEntries(governmentCode);
  if (entries.length === 0) {
    return null;
  }

  const startYear = Math.min(...entries.map((entry) => entry.startYear));
  const endYear = Math.max(...entries.map((entry) => entry.endYear));
  const totalDeaths = entries.reduce((sum, entry) => sum + entry.deaths, 0);
  const url = entries[0]?.sourceUrl;

  return {
    totalDeaths,
    startYear,
    endYear,
    source: `Summed from ${entries.length} sourced government death ledger entr${entries.length === 1 ? 'y' : 'ies'}`,
    url,
  };
}
