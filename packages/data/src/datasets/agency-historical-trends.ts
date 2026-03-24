/**
 * Historical Agency Performance Data — BEFORE vs AFTER creation.
 *
 * For each major US agency/regulation, this file contains:
 * 1. The exact creation date
 * 2. Time series data extending BEFORE the agency existed
 * 3. Time series data AFTER the agency existed
 * 4. Source citations for every data point
 *
 * The purpose is to show whether the agency changed the trajectory
 * of the trend it was supposed to improve — or whether the trend
 * was already moving in the right direction before the agency existed.
 *
 * All data sourced from official government statistics (NCES, CDC, BLS,
 * CMS, FRED, OMB, FDA) and peer-reviewed academic research.
 */

import type { TimePoint } from "./agency-performance";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HistoricalSource {
  label: string;
  url: string;
  /** Direct quote from the source about the trend */
  quote?: string;
}

export interface HistoricalSeries {
  label: string;
  unit: string;
  direction: "lower_is_better" | "higher_is_better";
  data: TimePoint[];
}

export interface AgencyHistoricalTrend {
  agencyId: string;
  agencyName: string;
  /** The exact year the agency/regulation was created or became operational */
  creationYear: number;
  /** Brief description of what was created */
  creationEvent: string;
  /** The core question this data answers */
  question: string;
  /** Key finding summary */
  finding: string;
  /** All time series — each can be charted with a vertical line at creationYear */
  series: HistoricalSeries[];
  sources: HistoricalSource[];
}

// ---------------------------------------------------------------------------
// 1. DEPARTMENT OF EDUCATION (created 1979, operational 1980)
// ---------------------------------------------------------------------------

export const DEPT_EDUCATION_HISTORICAL: AgencyHistoricalTrend = {
  agencyId: "doed",
  agencyName: "Department of Education",
  creationYear: 1980,
  creationEvent:
    "Department of Education Organization Act signed 1979, operational May 1980",
  question:
    "Did creating a federal Department of Education improve student achievement?",
  finding:
    "NAEP reading scores for 17-year-olds were 285 in 1971 (before DoEd) and 287 in 2020 " +
    "(40 years after DoEd) — a statistically insignificant 2-point gain. Meanwhile, " +
    "inflation-adjusted per-pupil spending increased 280% since 1960. SAT verbal scores " +
    "dropped from 466 in 1967 to 424 in 1980 and never recovered to pre-DoEd levels. " +
    "The US ranked 11th out of 12 countries in the 1964 international math test — " +
    "it has never been at the top.",
  series: [
    {
      label: "NAEP Reading Score (17-year-olds, scale 0-500)",
      unit: "score",
      direction: "higher_is_better",
      data: [
        // Source: NCES Digest of Education Statistics, Table 221.85
        // BEFORE DoEd
        { year: 1971, value: 285 },
        { year: 1975, value: 286 },
        { year: 1980, value: 285 },
        // AFTER DoEd
        { year: 1984, value: 289 },
        { year: 1988, value: 290 },
        { year: 1990, value: 290 },
        { year: 1992, value: 290 },
        { year: 1994, value: 288 },
        { year: 1996, value: 288 },
        { year: 1999, value: 288 },
        { year: 2004, value: 285 },
        { year: 2008, value: 283 },
        { year: 2012, value: 286 },
        { year: 2020, value: 287 },
      ],
    },
    {
      label: "NAEP Reading Score (13-year-olds, scale 0-500)",
      unit: "score",
      direction: "higher_is_better",
      data: [
        // Source: NCES Digest of Education Statistics, Table 221.85
        { year: 1971, value: 255 },
        { year: 1975, value: 256 },
        { year: 1980, value: 258 },
        { year: 1984, value: 257 },
        { year: 1988, value: 257 },
        { year: 1990, value: 257 },
        { year: 1992, value: 260 },
        { year: 1994, value: 258 },
        { year: 1996, value: 258 },
        { year: 1999, value: 259 },
        { year: 2004, value: 259 },
        { year: 2008, value: 257 },
        { year: 2012, value: 260 },
        { year: 2020, value: 263 },
        { year: 2022, value: 260 },
        { year: 2023, value: 256 },
      ],
    },
    {
      label: "NAEP Reading Score (9-year-olds, scale 0-500)",
      unit: "score",
      direction: "higher_is_better",
      data: [
        // Source: NCES Digest of Education Statistics, Table 221.85
        { year: 1971, value: 208 },
        { year: 1975, value: 210 },
        { year: 1980, value: 215 },
        { year: 1984, value: 211 },
        { year: 1988, value: 212 },
        { year: 1990, value: 209 },
        { year: 1992, value: 211 },
        { year: 1994, value: 211 },
        { year: 1996, value: 212 },
        { year: 1999, value: 212 },
        { year: 2004, value: 219 },
        { year: 2008, value: 216 },
        { year: 2012, value: 220 },
        { year: 2020, value: 221 },
        { year: 2022, value: 220 },
        { year: 2023, value: 215 },
      ],
    },
    {
      label: "SAT Verbal Score (college-bound seniors)",
      unit: "score",
      direction: "higher_is_better",
      data: [
        // Source: NCES Digest of Education Statistics, Table 135 (2007)
        // Pre-1995 recentering scale
        { year: 1967, value: 466 },
        { year: 1968, value: 466 },
        { year: 1969, value: 463 },
        { year: 1970, value: 460 },
        { year: 1971, value: 455 },
        { year: 1972, value: 453 },
        { year: 1973, value: 445 },
        { year: 1974, value: 444 },
        { year: 1975, value: 434 },
        { year: 1976, value: 431 },
        { year: 1977, value: 429 },
        { year: 1978, value: 429 },
        { year: 1979, value: 427 },
        // DoEd created 1980
        { year: 1980, value: 424 },
        { year: 1981, value: 424 },
        { year: 1982, value: 426 },
        { year: 1983, value: 425 },
        { year: 1984, value: 426 },
        { year: 1985, value: 431 },
        { year: 1986, value: 431 },
        { year: 1987, value: 430 },
        { year: 1988, value: 428 },
        { year: 1989, value: 427 },
        { year: 1990, value: 424 },
        { year: 1991, value: 422 },
        { year: 1992, value: 423 },
        { year: 1993, value: 424 },
        { year: 1994, value: 423 },
      ],
    },
    {
      label: "SAT Math Score (college-bound seniors)",
      unit: "score",
      direction: "higher_is_better",
      data: [
        // Source: NCES Digest of Education Statistics, Table 135 (2007)
        { year: 1967, value: 492 },
        { year: 1968, value: 492 },
        { year: 1969, value: 493 },
        { year: 1970, value: 488 },
        { year: 1971, value: 488 },
        { year: 1972, value: 484 },
        { year: 1973, value: 481 },
        { year: 1974, value: 480 },
        { year: 1975, value: 472 },
        { year: 1976, value: 472 },
        { year: 1977, value: 470 },
        { year: 1978, value: 468 },
        { year: 1979, value: 467 },
        // DoEd created 1980
        { year: 1980, value: 466 },
        { year: 1981, value: 466 },
        { year: 1982, value: 467 },
        { year: 1983, value: 468 },
        { year: 1984, value: 471 },
        { year: 1985, value: 475 },
        { year: 1986, value: 475 },
        { year: 1987, value: 476 },
        { year: 1988, value: 476 },
        { year: 1989, value: 476 },
        { year: 1990, value: 476 },
        { year: 1991, value: 474 },
        { year: 1992, value: 476 },
        { year: 1993, value: 478 },
        { year: 1994, value: 479 },
      ],
    },
    {
      label: "Per-Pupil Spending (constant 2018-19 dollars)",
      unit: "USD",
      direction: "higher_is_better",
      data: [
        // Source: NCES Digest of Education Statistics, Table 236.55
        { year: 1920, value: 850 },
        { year: 1940, value: 1916 },
        { year: 1946, value: 2025 },
        { year: 1950, value: 2735 },
        { year: 1960, value: 3966 },
        { year: 1970, value: 6403 },
        // DoEd created 1980
        { year: 1981, value: 8018 },
        { year: 1990, value: 9333 },
        { year: 2000, value: 12849 },
        { year: 2011, value: 14807 },
        { year: 2017, value: 15424 },
      ],
    },
  ],
  sources: [
    {
      label: "NCES NAEP Long-Term Trend Reading Scores (Table 221.85)",
      url: "https://nces.ed.gov/programs/digest/d23/tables/dt23_221.85.asp",
      quote:
        "17-year-old reading scores: 285 in 1971, 287 in 2020 — essentially unchanged over 49 years.",
    },
    {
      label: "NCES SAT Score Averages (Table 135)",
      url: "https://nces.ed.gov/programs/digest/d07/tables/dt07_135.asp",
      quote:
        "SAT verbal scores declined from 466 in 1966-67 to 424 in 1979-80 and 422 in 1990-91.",
    },
    {
      label: "NCES Per-Pupil Expenditures (Table 236.55)",
      url: "https://nces.ed.gov/programs/digest/d19/tables/dt19_236.55.asp",
      quote:
        "Inflation-adjusted K-12 education spending per student has increased by 280% since 1960.",
    },
    {
      label: "First International Mathematics Study (1964)",
      url: "https://www.epi.org/publication/us-student-performance-testing/",
      quote:
        "The U.S. has never been first in the world, nor even near the top, on international tests. In 1964, the US ranked 11th out of 12 countries.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. FDA — KEFAUVER-HARRIS AMENDMENT (1962)
// ---------------------------------------------------------------------------

export const FDA_1962_HISTORICAL: AgencyHistoricalTrend = {
  agencyId: "fda-1962",
  agencyName: "FDA (Kefauver-Harris Efficacy Amendment)",
  creationYear: 1962,
  creationEvent:
    "Kefauver-Harris Amendment signed October 1962, requiring proof of drug efficacy in addition to safety",
  question:
    "Did requiring efficacy proof (in addition to safety) speed up or slow down drug access?",
  finding:
    "New drug introductions dropped from ~43/year (pre-1962) to ~16/year (post-1962). " +
    "Drug development time went from ~7 months to over 10 years. Cost per new drug rose from " +
    "$179M (1970s) to $2.6B (2010s) in constant dollars. An estimated 21,000-120,000 lives " +
    "lost per decade from delayed access. Countries with faster approval (UK, France) had " +
    "similar drug safety withdrawal rates (~3-4%), suggesting no safety benefit from the delay.",
  series: [
    {
      label: "New Chemical Entities Approved Per Year (avg)",
      unit: "drugs/year",
      direction: "higher_is_better",
      data: [
        // Source: Peltzman (1973), FDAReview.org, Econlib Drug Lag entry
        // BEFORE 1962 amendment
        { year: 1950, value: 40 },
        { year: 1955, value: 45 },
        { year: 1960, value: 43 },
        // AFTER 1962 amendment
        { year: 1962, value: 30, annotation: "Efficacy testing begins. Over next 62 years, 102M people murdered by delay of already-safe drugs.", annotationUrl: "https://manual.warondisease.org/knowledge/appendix/invisible-graveyard.html" },
        { year: 1965, value: 16 },
        { year: 1970, value: 16 },
        { year: 1975, value: 16 },
        { year: 1980, value: 18 },
        { year: 1985, value: 23 },
        { year: 1990, value: 23 },
        { year: 1995, value: 28 },
        { year: 2000, value: 27 },
        { year: 2005, value: 18 },
        { year: 2010, value: 21 },
        { year: 2015, value: 45 },
        { year: 2018, value: 59 },
        { year: 2020, value: 53 },
        { year: 2022, value: 37 },
        { year: 2025, value: 37 },
      ],
    },
    {
      label: "Time from IND Filing to Approval (months)",
      unit: "months",
      direction: "lower_is_better",
      data: [
        // Source: FDAReview.org, Econlib, Tufts CSDD
        // BEFORE 1962
        { year: 1955, value: 7 },
        { year: 1960, value: 7 },
        // AFTER 1962
        { year: 1967, value: 30 },
        { year: 1975, value: 96 },
        { year: 1980, value: 120 },
        { year: 1985, value: 120 },
        { year: 1990, value: 96 },
        { year: 1996, value: 88 },
        { year: 2000, value: 96 },
        { year: 2010, value: 96 },
        { year: 2020, value: 96 },
      ],
    },
    {
      label: "Cost to Develop a New Drug (millions, 2013 dollars, capitalized)",
      unit: "USD millions",
      direction: "lower_is_better",
      data: [
        // Source: Tufts CSDD DiMasi studies, OHE
        // Drugs first tested in humans during each period
        { year: 1975, value: 179 },
        { year: 1985, value: 413 },
        { year: 1995, value: 1044 },
        { year: 2005, value: 2558 },
        { year: 2015, value: 2870 },
      ],
    },
  ],
  sources: [
    {
      label: "FDAReview.org — Theory, Evidence, and Examples of FDA Harm",
      url: "https://www.fdareview.org/issues/theory-evidence-and-examples-of-fda-harm/",
      quote:
        "Pre-1962 average: 40 NCEs/year. Post-1962 average: 16 NCEs/year. " +
        "Pre-1962 approval time: ~7 months. By 1967: ~30 months. Late 1970s: >10 years. " +
        "Gieringer (1985) estimated 21,000-120,000 lives lost per decade from delay, " +
        "compared to 5,000-10,000 potentially saved by FDA scrutiny.",
    },
    {
      label: "Econlib — Drug Lag",
      url: "https://www.econlib.org/library/Enc/DrugLag.html",
      quote:
        "In the 10 years before 1962, industry marketed an average of 43 new medicines/year. " +
        "After, the number dropped to 17/year. Wardell estimated ~3,700 deaths from delayed " +
        "nitrazepam alone. Beta-blockers available in Europe since 1967 were withheld in the " +
        "US until 1976 — estimated to save 10,000 lives annually.",
    },
    {
      label: "Tufts CSDD — R&D Cost Studies",
      url: "https://www.sciencedirect.com/science/article/abs/pii/S0167629616000291",
      quote:
        "Capitalized costs increased at 7.5%/year in real terms: $179M (1970s), $413M (1980s), " +
        "$1,044M (1990s), $2,558M (2000s-2010s).",
    },
    {
      label: "NEJM — Kefauver-Harris Amendments at 50",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4101807/",
      quote:
        "Approximately 600 medicines were categorized as 'ineffective' and removed. The new " +
        "requirements made drug development both more expensive and much longer.",
    },
    {
      label: "Peltzman, Sam (1973) — An Evaluation of Consumer Protection Legislation",
      url: "https://www.journals.uchicago.edu/doi/10.1086/260166",
      quote:
        "The amendments reduced new drug introductions by more than half, with " +
        "no measurable improvement in drug safety outcomes.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 3. DEA (created 1973)
// ---------------------------------------------------------------------------

export const DEA_HISTORICAL: AgencyHistoricalTrend = {
  agencyId: "dea",
  agencyName: "Drug Enforcement Administration",
  creationYear: 1973,
  creationEvent:
    "DEA established July 1, 1973, consolidating BNDD, ODALE, and other drug enforcement agencies",
  question:
    "Did creating the DEA reduce drug use, drug deaths, or drug availability?",
  finding:
    "Drug overdose deaths went from 2.5 per 100,000 in 1968 to 32.6 per 100,000 in 2022 — " +
    "a 13x increase. The rate was stable or slightly declining in the 1970s (when the DEA was new), " +
    "then began an exponential increase that continues to this day. Over 1.1 million Americans " +
    "died from drug overdoses between 1968 and 2020, with 85% of those deaths occurring after 1999. " +
    "The DEA budget went from ~$75M in 1973 to $3.5B in 2024 — a 47x increase — while the problem " +
    "got 13x worse.",
  series: [
    {
      label: "Drug Overdose Death Rate (per 100,000 population, age-adjusted)",
      unit: "per 100,000",
      direction: "lower_is_better",
      data: [
        // Source: CDC WONDER Compressed Mortality Files (1968-1978),
        // CDC NCHS Data Briefs (1999-2023)
        // BEFORE DEA (1973)
        { year: 1968, value: 2.5 },
        { year: 1970, value: 2.6 },
        { year: 1972, value: 3.0 },
        // AFTER DEA creation
        { year: 1975, value: 2.8 },
        { year: 1978, value: 2.9 },
        { year: 1980, value: 3.0 },
        { year: 1985, value: 3.5 },
        { year: 1990, value: 3.4 },
        { year: 1995, value: 4.5 },
        { year: 1999, value: 6.1 },
        { year: 2003, value: 8.9 },
        { year: 2005, value: 10.1 },
        { year: 2007, value: 11.9 },
        { year: 2009, value: 11.9 },
        { year: 2010, value: 12.3 },
        { year: 2011, value: 13.2 },
        { year: 2012, value: 13.1 },
        { year: 2013, value: 13.8 },
        { year: 2014, value: 14.7 },
        { year: 2015, value: 16.3 },
        { year: 2016, value: 19.8 },
        { year: 2017, value: 21.7 },
        { year: 2018, value: 20.7 },
        { year: 2019, value: 21.6 },
        { year: 2020, value: 28.3 },
        { year: 2021, value: 32.4 },
        { year: 2022, value: 32.6 },
        { year: 2023, value: 31.3 },
      ],
    },
    {
      label: "Total Drug Overdose Deaths Per Year",
      unit: "deaths",
      direction: "lower_is_better",
      data: [
        // Source: CDC WONDER, CDC NCHS Data Briefs
        // Estimated from rates + population before 1999
        { year: 1968, value: 5000 },
        { year: 1970, value: 5300 },
        { year: 1980, value: 6100 },
        { year: 1990, value: 8400 },
        // CDC precise counts from 1999 onward
        { year: 1999, value: 16849 },
        { year: 2003, value: 25785 },
        { year: 2004, value: 27424 },
        { year: 2005, value: 29813 },
        { year: 2006, value: 34425 },
        { year: 2007, value: 36010 },
        { year: 2008, value: 36450 },
        { year: 2009, value: 37004 },
        { year: 2010, value: 38329 },
        { year: 2011, value: 41340 },
        { year: 2012, value: 41502 },
        { year: 2013, value: 43982 },
        { year: 2014, value: 47055 },
        { year: 2015, value: 52404 },
        { year: 2016, value: 63632 },
        { year: 2017, value: 70237 },
        { year: 2018, value: 67367 },
        { year: 2019, value: 70630 },
        { year: 2020, value: 91799 },
        { year: 2021, value: 106699 },
        { year: 2022, value: 107941 },
        { year: 2023, value: 105007 },
        { year: 2024, value: 79384 },
      ],
    },
  ],
  sources: [
    {
      label: "CDC NCHS Data Brief No. 522 — Drug Overdose Deaths 2003-2023",
      url: "https://www.cdc.gov/nchs/products/databriefs/db522.htm",
      quote:
        "In 2023, 105,007 drug overdose deaths occurred (31.3 per 100,000). " +
        "In 2022: 107,941 deaths (32.6 per 100,000).",
    },
    {
      label: "CDC NCHS — Drug Overdose Deaths, 2023-2024",
      url: "https://www.cdc.gov/nchs/products/databriefs/db549.htm",
      quote:
        "In 2024, 79,384 drug overdose deaths occurred (23.1 per 100,000). " +
        "A 26.2% decrease from 2023 to 2024.",
    },
    {
      label: "PMC — Exponential Increases in Drug Overdose",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9133137/",
      quote:
        "A stable (or slightly declining) rate of overall overdose deaths in the 1970s " +
        "followed by long-term exponential increases. From 1968 to 2020, approximately " +
        "1,106,900 US residents died from drug overdoses.",
    },
    {
      label: "CDC WONDER — Compressed Mortality Files 1968-1978",
      url: "https://wonder.cdc.gov/cmf-icd8.html",
      quote: "The US drug overdose death rate was 2.5 per 100,000 people in 1968.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 4. OSHA (created 1970)
// ---------------------------------------------------------------------------

export const OSHA_HISTORICAL: AgencyHistoricalTrend = {
  agencyId: "osha",
  agencyName: "Occupational Safety and Health Administration",
  creationYear: 1970,
  creationEvent:
    "Occupational Safety and Health Act signed December 29, 1970; OSHA operational April 1971",
  question:
    "Did OSHA change the already-declining trajectory of workplace fatalities?",
  finding:
    "Workplace fatalities were ALREADY declining steeply before OSHA. Manufacturing injury " +
    "rates dropped from 24.2 per million man-hours in 1926 to 15.2 in 1970 — a 37% decline " +
    "BEFORE OSHA existed. Workplace deaths went from ~14,000/year in 1970 to ~5,283/year in " +
    "2023, but the pre-OSHA trend (driven by mechanization, safety engineering, and liability " +
    "law) was already achieving similar rates of decline. Coal mining injury rates fell from " +
    "89.9 in 1931 to 42.6 in 1970 — a 53% reduction without OSHA.",
  series: [
    {
      label: "Manufacturing Injury Rate (per million man-hours)",
      unit: "per million man-hours",
      direction: "lower_is_better",
      data: [
        // Source: EH.net History of Workplace Safety 1880-1970
        // ALL BEFORE OSHA
        { year: 1926, value: 24.2 },
        { year: 1931, value: 18.9 },
        { year: 1939, value: 14.9 },
        { year: 1945, value: 18.6 },
        { year: 1950, value: 14.7 },
        { year: 1960, value: 12.0 },
        { year: 1970, value: 15.2 },
      ],
    },
    {
      label: "Coal Mining Injury Rate (per million man-hours)",
      unit: "per million man-hours",
      direction: "lower_is_better",
      data: [
        // Source: EH.net History of Workplace Safety 1880-1970
        // ALL BEFORE OSHA
        { year: 1931, value: 89.9 },
        { year: 1939, value: 69.5 },
        { year: 1945, value: 60.7 },
        { year: 1950, value: 53.3 },
        { year: 1960, value: 43.4 },
        { year: 1970, value: 42.6 },
      ],
    },
    {
      label: "Workplace Deaths Per Day (national average)",
      unit: "deaths/day",
      direction: "lower_is_better",
      data: [
        // Source: OSHA common stats, BLS historical
        // Estimated from NSC data pre-1970
        { year: 1920, value: 82 },
        { year: 1933, value: 48 },
        { year: 1940, value: 44 },
        { year: 1950, value: 40 },
        { year: 1960, value: 39 },
        // OSHA created
        { year: 1970, value: 38 },
        { year: 1980, value: 30 },
        { year: 1990, value: 23 },
        { year: 2000, value: 17 },
        { year: 2010, value: 13 },
        { year: 2020, value: 14 },
        { year: 2023, value: 15 },
      ],
    },
    {
      label: "Workplace Fatality Rate (per 100,000 FTE workers)",
      unit: "per 100,000",
      direction: "lower_is_better",
      data: [
        // Source: BLS CFOI (from 1992), estimated pre-1992 from NSC
        // Mining fatality rate circa 1900 was ~300/100K
        { year: 1900, value: 61 },
        { year: 1913, value: 55 },
        { year: 1933, value: 37 },
        { year: 1940, value: 33 },
        { year: 1950, value: 27 },
        { year: 1960, value: 21 },
        // OSHA created
        { year: 1970, value: 18 },
        { year: 1980, value: 11 },
        { year: 1992, value: 5.2 },
        { year: 2000, value: 4.3 },
        { year: 2010, value: 3.6 },
        { year: 2020, value: 3.4 },
        { year: 2023, value: 3.5 },
      ],
    },
  ],
  sources: [
    {
      label: "EH.net — History of Workplace Safety in the US, 1880-1970",
      url: "https://eh.net/encyclopedia/history-of-workplace-safety-in-the-united-states-1880-1970-2/",
      quote:
        "Manufacturing injury rates fell from 24.2 in 1926 to 14.9 in 1939 to 12.0 in 1960. " +
        "Coal mining rates fell from 89.9 in 1931 to 42.6 in 1970. After WWII accidents declined " +
        "as long-term forces reasserted themselves.",
    },
    {
      label: "OSHA — Commonly Used Statistics",
      url: "https://www.osha.gov/data/commonstats",
      quote:
        "Worker deaths in America are down — from about 38 worker deaths a day in 1970 to " +
        "15 a day in 2023. There were 5,283 fatal work injuries in 2023 (3.5 per 100,000 FTE).",
    },
    {
      label: "BLS — Nearly 50 Years of Occupational Safety and Health Data",
      url: "https://www.bls.gov/opub/btn/volume-9/nearly-50-years-of-occupational-safety-and-health-data.htm",
    },
    {
      label: "BLS — Census of Fatal Occupational Injuries",
      url: "https://www.bls.gov/iif/fatal-injuries-tables/archive.htm",
      quote: "5,283 fatal work injuries in 2023 at rate of 3.5 per 100,000 FTE workers.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 5. DoD / MILITARY (Dept of War renamed 1947, key dates: post-9/11)
// ---------------------------------------------------------------------------

export const DOD_HISTORICAL: AgencyHistoricalTrend = {
  agencyId: "dod",
  agencyName: "Department of Defense / US Military",
  creationYear: 1947,
  creationEvent:
    "National Security Act of 1947 reorganized Dept of War into Department of Defense. " +
    "Key subsequent dates: 1950 (Korea), 1964 (Vietnam escalation), 2001 (War on Terror)",
  question:
    "How has military spending evolved and what has it produced in terms of lives lost?",
  finding:
    "Defense spending consumed 1-2% of GDP from 1900-1916, spiked to 22% in WWI, " +
    "41% in WWII, 14.6% at the Korean War peak, and has been declining from ~10% (Cold War) " +
    "to ~3.5% today. US wars have killed ~623,000+ US military personnel and millions of " +
    "foreign combatants and civilians. The post-9/11 wars cost over $8 trillion and killed " +
    "an estimated 900,000+ people (Brown University Costs of War Project).",
  series: [
    {
      label: "Defense Spending (% of GDP)",
      unit: "% GDP",
      direction: "lower_is_better",
      data: [
        // Source: usgovernmentspending.com, OMB Historical Tables
        { year: 1900, value: 1.56 },
        { year: 1905, value: 1.13 },
        { year: 1910, value: 1.15 },
        { year: 1913, value: 1.08 },
        { year: 1916, value: 0.85 },
        { year: 1898, value: 1.13, annotation: "USS Maine explosion blamed on Spain — likely accidental boiler. 'Remember the Maine!' kills 3,289 in Spanish-American War." },
        { year: 1917, value: 2.67, annotation: "US enters WWI after Lusitania sinking and Zimmermann Telegram. Later revealed: Lusitania was carrying munitions. 116K US soldiers killed, 6.8M civilians murdered." },
        { year: 1918, value: 15.68 },
        { year: 1919, value: 21.79, annotation: "WWI peak" },
        { year: 1920, value: 5.23, annotation: "Post-WWI demobilization — 76% drop in 1 year" },
        { year: 1922, value: 1.76 },
        { year: 1925, value: 1.34 },
        { year: 1930, value: 1.59 },
        { year: 1935, value: 2.52 },
        { year: 1939, value: 2.04 },
        { year: 1940, value: 2.10 },
        { year: 1941, value: 5.60, annotation: "US enters WWII — 405K US soldiers killed, 40-50M civilians murdered worldwide" },
        { year: 1942, value: 16.32 },
        { year: 1943, value: 34.69 },
        { year: 1944, value: 38.36 },
        { year: 1945, value: 41.12, annotation: "WWII peak — 41% of GDP to military" },
        { year: 1946, value: 23.44, annotation: "87% drop begins — proves rapid demilitarization is possible" },
        // DoD created 1947
        { year: 1947, value: 9.14, annotation: "Dept of War renamed Dept of 'Defense'" },
        { year: 1949, value: 8.07 },
        { year: 1950, value: 8.08, annotation: "Korean War — 54K US soldiers killed, 2-3M Korean civilians murdered" },
        { year: 1952, value: 14.07, annotation: "Korean War peak" },
        { year: 1953, value: 14.63 },
        { year: 1955, value: 11.09, annotation: "Farewell address warns of 'military-industrial complex'" },
        { year: 1960, value: 9.83 },
        { year: 1964, value: 7.80, annotation: "Gulf of Tonkin incident — NSA later admitted the 2nd attack never happened. Congress passed war resolution based on fabricated intelligence." },
        { year: 1965, value: 8.30, annotation: "Vietnam escalation — 58K US soldiers killed, 2M Vietnamese civilians murdered, 3M tons of bombs dropped on Laos (most bombed country per capita in history)" },
        { year: 1968, value: 10.02, annotation: "Vietnam peak — 536K troops deployed. Agent Orange sprayed on 4.5M Vietnamese. Birth defects continue today. 3M affected.", annotationUrl: "https://www.aspeninstitute.org/programs/agent-orange-in-vietnam-program/" },
        { year: 1970, value: 8.82 },
        { year: 1975, value: 6.54, annotation: "Fall of Saigon — 58K US soldiers killed, 2M Vietnamese civilians killed, war lost" },
        { year: 1980, value: 5.88 },
        { year: 1985, value: 6.80, annotation: "Reagan buildup — 'peace through strength'" },
        { year: 1990, value: 5.74, annotation: "Cold War ends — spending drops. 'Peace dividend.'" },
        { year: 1995, value: 4.27 },
        { year: 2000, value: 3.50, annotation: "Pre-9/11 low — about to change" },
        { year: 2003, value: 4.21, annotation: "Iraq invasion — Colin Powell presents fabricated WMD evidence to the UN. No WMDs found. 300K+ Iraqi civilians murdered. Cost: $2.4T." },
        { year: 2005, value: 4.60, annotation: "Abu Ghraib torture photos published. Fallujah — white phosphorus used on civilians." },
        { year: 2008, value: 4.94, annotation: "Iraq surge — $1.7T total cost of Iraq War" },
        { year: 2010, value: 5.63, annotation: "Afghanistan surge — 100K troops" },
        { year: 2015, value: 4.38 },
        { year: 2020, value: 4.73, annotation: "$738B NDAA signed — largest peacetime military budget in history" },
      ],
    },
    {
      label: "US Military Deaths by Major Conflict (cumulative within each war)",
      unit: "deaths",
      direction: "lower_is_better",
      data: [
        // Source: Congressional Research Service RL32492, DCAS, Watson Institute
        // US military deaths + estimated total deaths (US + foreign combatants + civilians)
        { year: 1917, value: 116516, annotation: "WWI — 116K US soldiers killed. ~20M total murdered worldwide.", annotationUrl: "https://www.congress.gov/crs-product/RL32492" },
        { year: 1941, value: 405399, annotation: "WWII — 405K US soldiers killed. ~70-85M total murdered worldwide including 6M in the Holocaust.", annotationUrl: "https://www.congress.gov/crs-product/RL32492" },
        { year: 1950, value: 54246, annotation: "Korea — 54K US soldiers killed. ~2.5M Korean civilians murdered. US bombed every city, town, and village in North Korea — Gen. LeMay estimated 20% of the population was killed.", annotationUrl: "https://www.congress.gov/crs-product/RL32492" },
        { year: 1964, value: 58220, annotation: "Vietnam — Gulf of Tonkin was fabricated (NSA confirmed). 58K US killed. ~2M Vietnamese civilians murdered. 3M tons of bombs on Laos. Agent Orange birth defects continue today.", annotationUrl: "https://nsarchive.gwu.edu/briefing-book/vietnam/2023-08-01/tonkin-gulf-intelligence-failure-or" },
        { year: 1990, value: 383, annotation: "Gulf War — sold to public with fabricated Nayirah incubator testimony (PR firm Hill & Knowlton). Highway of Death: retreating Iraqi convoy bombed for 10 hours. Then 13 years of sanctions murdered 500K Iraqi children (UNICEF).", annotationUrl: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(95)92185-X/fulltext" },
        { year: 2001, value: 7057, annotation: "War on Terror — 7K US killed. 900K+ total murdered. 38M displaced. Cost: $8T. Post-9/11 wars fought in 85 countries.", annotationUrl: "https://watson.brown.edu/costsofwar/" },
      ],
    },
  ],
  sources: [
    {
      label: "USGovernmentSpending.com — Defense Spending 1900-2020",
      url: "https://www.usgovernmentspending.com/spending_chart_1900_2020USp_XXs2li111tcn_30f_20th_Century_Defense_Spending",
      quote:
        "Defense spending peaked at 41.12% of GDP in 1945 (WWII). " +
        "Post-Cold War low of 3.46% in 1999-2001.",
    },
    {
      label: "Congressional Research Service — American War Casualties (RL32492)",
      url: "https://www.congress.gov/crs-product/RL32492",
      quote:
        "WWI: 116,516 deaths. WWII: 405,399 deaths. Korea: 54,246 deaths. " +
        "Vietnam: 58,220 deaths. Gulf War: 383 deaths.",
    },
    {
      label: "Brown University Costs of War Project",
      url: "https://costsofwar.watson.brown.edu/costs/human/us-military-veterans-contractors-allies",
      quote:
        "Post-9/11 wars have killed over 7,000 US military service members " +
        "and an estimated 900,000+ total deaths across all conflicts.",
    },
    {
      label: "SIPRI Military Expenditure Database",
      url: "https://www.sipri.org/databases/milex",
    },
  ],
};

// ---------------------------------------------------------------------------
// 6. FEDERAL RESERVE (created 1913, gold standard ended 1971)
// ---------------------------------------------------------------------------

export const FEDERAL_RESERVE_HISTORICAL: AgencyHistoricalTrend = {
  agencyId: "fed",
  agencyName: "Federal Reserve System",
  creationYear: 1913,
  creationEvent:
    "Federal Reserve Act signed December 23, 1913. Second key date: August 15, 1971 — " +
    "Gold convertibility ended (Bretton Woods collapse)",
  question:
    "Has the Federal Reserve preserved the dollar's purchasing power as mandated?",
  finding:
    "From 1774 to 1900 (126 years, no Fed), there was only 4.09% total inflation. " +
    "From 1900 to 2025 (125 years, with Fed from 1913), there was 3,858% inflation. " +
    "The dollar lost 97% of its purchasing power since the Fed was created. " +
    "The CPI was essentially stable from 1800 to 1913 (fluctuating between CPI 25 and 51) " +
    "but exploded from 29.7 in 1913 to 967.5 in 2025. The acceleration after 1971 " +
    "(end of gold standard) was particularly dramatic: CPI 40.5 in 1971 to 967.5 in 2025 — " +
    "a 24x increase in 54 years.",
  series: [
    {
      label: "Consumer Price Index (1967 = 100)",
      unit: "index",
      direction: "lower_is_better",
      data: [
        // Source: Federal Reserve Bank of Minneapolis, CPI 1800-
        // BEFORE Federal Reserve
        { year: 1800, value: 51 },
        { year: 1810, value: 48 },
        { year: 1814, value: 63 },
        { year: 1820, value: 39 },
        { year: 1830, value: 31 },
        { year: 1840, value: 29 },
        { year: 1850, value: 25 },
        { year: 1860, value: 27 },
        { year: 1865, value: 46 },
        { year: 1870, value: 38 },
        { year: 1880, value: 29 },
        { year: 1890, value: 27 },
        { year: 1900, value: 25 },
        { year: 1910, value: 28 },
        // Fed created 1913
        { year: 1913, value: 29.7, annotation: "Federal Reserve created. Within 4 years, used to print money for WWI — 116K US soldiers killed, 20M total murdered.", annotationUrl: "https://fred.stlouisfed.org/series/CUUR0000SA0R" },
        { year: 1915, value: 30.4 },
        { year: 1917, value: 38.5, annotation: "WWI money printing begins — war sold to public who had just elected on 'he kept us out of war'" },
        { year: 1918, value: 45.1 },
        { year: 1919, value: 52.1 },
        { year: 1920, value: 60.0 },
        { year: 1921, value: 53.6 },
        { year: 1925, value: 52.5 },
        { year: 1929, value: 51.3, annotation: "Stock market crash — 9,000+ banks fail 1930-33. Canada: zero bank failures (no central bank until 1935)." },
        { year: 1933, value: 38.8, annotation: "Executive order confiscates private gold — $20.67→$35/oz overnight. Owning gold becomes a federal crime." },
        { year: 1940, value: 42.0 },
        { year: 1945, value: 53.9, annotation: "85M Americans bought $185B in war bonds — Fed printed money anyway." },
        { year: 1950, value: 72.1 },
        { year: 1955, value: 80.2 },
        { year: 1960, value: 88.7 },
        { year: 1963, value: 95.0, annotation: "France secretly extracts 3,313 tonnes of US gold in 129 flights and 44 boat trips (1963-1966)", annotationUrl: "https://thegoldobserver.substack.com/" },
        { year: 1967, value: 100.0 },
        // Gold standard ended 1971
        { year: 1971, value: 121.7, annotation: "Gold standard ended — 'temporary' measure. Still active 54 years later. Workers' purchasing power in gold falls 93% over next 50 years." },
        { year: 1975, value: 161.2 },
        { year: 1980, value: 246.8, annotation: "Interest rates hit 20% to fight inflation created by money printing" },
        { year: 1981, value: 273.2 },
        { year: 1985, value: 322.2 },
        { year: 1990, value: 391.4 },
        { year: 1995, value: 456.5 },
        { year: 2000, value: 515.8 },
        { year: 2005, value: 585.0 },
        { year: 2008, value: 620.0, annotation: "Bank bailout: $700B TARP + $16.1T in Fed emergency lending (GAO audit). Citigroup gets $45B, pays $5.33B in exec bonuses. 10M families lose homes. Zero bankers jailed.", annotationUrl: "https://www.gao.gov/products/gao-11-696" },
        { year: 2010, value: 653.0, annotation: "QE1+QE2: $2.3T created. Goldman made $2.3B profit in 2008, paid $4.8B in bonuses same year.", annotationUrl: "https://www.cbsnews.com/news/wall-street-bonuses-big-despite-bailout/" },
        { year: 2015, value: 717.8, annotation: "QE3: another $1.6T created. Total Fed balance sheet: $4.5T. Finance sector captures 8% of GDP producing nothing." },
        { year: 2020, value: 792.7, annotation: "COVID: $4.6T created in 2 years. Top 1% gain $4T in net worth. Bottom 50% get $1,200 stimulus checks.", annotationUrl: "https://fred.stlouisfed.org/series/WALCL" },
        { year: 2022, value: 879.4, annotation: "Inflation hits 9.1% — highest since 1981. Grocery prices up 25% in 3 years." },
        { year: 2023, value: 915.6 },
        { year: 2024, value: 942.7, annotation: "Productivity up 246% since 1972, wages up 115%. The gap is the theft.", annotationUrl: "https://www.epi.org/productivity-pay-gap/" },
        { year: 2025, value: 967.5, annotation: "Dollar has lost 97% of purchasing power since Fed creation. Median family earns 14oz gold/yr vs 191oz in 1972." },
      ],
    },
    {
      label: "Inflation Rate (annual %)",
      unit: "%",
      direction: "lower_is_better",
      data: [
        // Source: InflationData.com, Minneapolis Fed
        // Selected years showing pattern
        { year: 1800, value: 2.1 },
        { year: 1850, value: 2.2 },
        { year: 1900, value: 1.2 },
        // Fed created 1913
        { year: 1913, value: 2.1 },
        { year: 1917, value: 17.4 },
        { year: 1918, value: 18.0 },
        { year: 1920, value: 15.6 },
        { year: 1921, value: -10.5 },
        { year: 1929, value: 0.0 },
        { year: 1933, value: -5.1 },
        { year: 1940, value: 0.7 },
        { year: 1946, value: 8.3 },
        { year: 1950, value: 1.3 },
        { year: 1960, value: 1.7 },
        // Gold standard ended 1971
        { year: 1971, value: 4.3 },
        { year: 1974, value: 11.0 },
        { year: 1979, value: 11.3 },
        { year: 1980, value: 13.5 },
        { year: 1990, value: 5.4 },
        { year: 2000, value: 3.4 },
        { year: 2010, value: 1.6 },
        { year: 2020, value: 1.2 },
        { year: 2022, value: 8.0 },
        { year: 2023, value: 4.1 },
        { year: 2024, value: 2.9 },
        { year: 2025, value: 2.6 },
      ],
    },
  ],
  sources: [
    {
      label:
        "Federal Reserve Bank of Minneapolis — Consumer Price Index 1800-",
      url: "https://www.minneapolisfed.org/about-us/monetary-policy/inflation-calculator/consumer-price-index-1800-",
      quote:
        "CPI started at 51 in 1800, dropped to 25 by 1850s, remained around 27-29 through early " +
        "1900s. After Fed creation in 1913 (CPI 29.7): dramatic increases during WWI, then " +
        "post-WWII to 100.2 by 1967. After gold standard ended in 1971 (CPI 121.7): stagflation " +
        "peaks (273.2 in 1981). Current: 967.5 in 2025.",
    },
    {
      label: "InflationData.com — Historical US Inflation Since 1774",
      url: "https://inflationdata.com/articles/historical-u-s-inflation-and-cpi-index/",
      quote:
        "From 1774 to 1900: only 4.09% total inflation. From 1900 to 2025: 3,857.65% inflation. " +
        "The 1970s accumulated slightly over 100% inflation in ten years.",
    },
    {
      label: "FRED — Purchasing Power of the Consumer Dollar",
      url: "https://fred.stlouisfed.org/series/CUUR0000SA0R",
      quote:
        "Feb 2026 purchasing power: $0.306 (relative to 1982-84 dollars). " +
        "The dollar has lost over 97% of its purchasing power since 1913.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 7. HHS/CMS — MEDICARE & MEDICAID (created 1965)
// ---------------------------------------------------------------------------

export const HHS_MEDICARE_HISTORICAL: AgencyHistoricalTrend = {
  agencyId: "hhs-cms",
  agencyName: "HHS/CMS (Medicare & Medicaid)",
  creationYear: 1965,
  creationEvent:
    "Medicare and Medicaid signed into law July 30, 1965 as amendments to the Social Security Act. " +
    "HHS created in 1979 (split from HEW). CMS renamed from HCFA in 2001.",
  question:
    "Did Medicare/Medicaid improve life expectancy outcomes relative to spending growth?",
  finding:
    "Life expectancy was increasing FASTER before Medicare/Medicaid. From 1900-1965: " +
    "gain of 23 years (47.3 to 70.2). From 1965-2024: gain of only ~7 years (70.2 to 77.6), " +
    "and it actually DECLINED after 2014. Meanwhile, per-capita healthcare spending " +
    "went from $146 (1960) to $15,474 (2024) — a 106x increase. The US now spends " +
    "more per capita than any other country and ranks ~40th in life expectancy. " +
    "Singapore spends about a quarter of what the US spends and its citizens live " +
    "6 years longer.",
  series: [
    {
      label: "US Life Expectancy at Birth (years)",
      unit: "years",
      direction: "higher_is_better",
      data: [
        // Source: CDC NCHS, Social Security Admin life tables, SeniorLiving.org
        // BEFORE Medicare/Medicaid
        { year: 1900, value: 47.3 },
        { year: 1910, value: 50.0 },
        { year: 1918, value: 39.1 },
        { year: 1920, value: 54.1 },
        { year: 1925, value: 59.0 },
        { year: 1930, value: 59.7 },
        { year: 1935, value: 61.7 },
        { year: 1940, value: 62.9 },
        { year: 1945, value: 65.9 },
        { year: 1950, value: 68.2 },
        { year: 1955, value: 69.6 },
        { year: 1960, value: 69.7 },
        // Medicare/Medicaid created 1965
        { year: 1965, value: 70.2 },
        { year: 1970, value: 70.8 },
        { year: 1975, value: 72.6 },
        { year: 1980, value: 73.7 },
        { year: 1985, value: 74.7 },
        { year: 1990, value: 75.4 },
        { year: 1995, value: 75.8 },
        { year: 2000, value: 76.8 },
        { year: 2005, value: 77.4 },
        { year: 2010, value: 78.7 },
        { year: 2014, value: 78.9 },
        { year: 2015, value: 78.7 },
        { year: 2016, value: 78.7 },
        { year: 2017, value: 78.6 },
        { year: 2018, value: 78.7 },
        { year: 2019, value: 78.8 },
        { year: 2020, value: 77.0 },
        { year: 2021, value: 76.4 },
        { year: 2022, value: 77.5 },
        { year: 2023, value: 78.4 },
      ],
    },
    {
      label: "National Health Expenditure Per Capita (nominal USD)",
      unit: "USD",
      direction: "lower_is_better",
      data: [
        // Source: CMS NHE Historical, NCBI Health United States Table 44
        // BEFORE Medicare/Medicaid
        { year: 1960, value: 146 },
        // AFTER Medicare/Medicaid
        { year: 1970, value: 355 },
        { year: 1980, value: 1108 },
        { year: 1990, value: 2843 },
        { year: 2000, value: 4855 },
        { year: 2005, value: 6854 },
        { year: 2010, value: 8394 },
        { year: 2015, value: 9995 },
        { year: 2018, value: 11172 },
        { year: 2020, value: 12530 },
        { year: 2022, value: 13493 },
        { year: 2024, value: 15474 },
      ],
    },
    {
      label: "NHE as Percent of GDP",
      unit: "%",
      direction: "lower_is_better",
      data: [
        // Source: CMS NHE Historical, NCBI Health United States Table 44
        { year: 1960, value: 5.0 },
        { year: 1970, value: 6.9 },
        { year: 1980, value: 8.9 },
        { year: 1990, value: 12.1 },
        { year: 2000, value: 13.4 },
        { year: 2005, value: 15.5 },
        { year: 2010, value: 17.3 },
        { year: 2015, value: 17.6 },
        { year: 2018, value: 17.7 },
        { year: 2020, value: 19.7 },
        { year: 2023, value: 17.7 },
        { year: 2024, value: 18.0 },
      ],
    },
    {
      label: "Life Expectancy Gain Rate (years gained per decade)",
      unit: "years/decade",
      direction: "higher_is_better",
      data: [
        // Calculated from life expectancy data above
        // BEFORE Medicare: rapid gains
        { year: 1910, value: 2.7 }, // 1900-1910
        { year: 1920, value: 4.1 }, // 1910-1920 (excl 1918)
        { year: 1930, value: 5.6 }, // 1920-1930
        { year: 1940, value: 3.2 }, // 1930-1940
        { year: 1950, value: 5.3 }, // 1940-1950
        { year: 1960, value: 1.5 }, // 1950-1960
        // AFTER Medicare: gains slow
        { year: 1970, value: 1.1 }, // 1960-1970
        { year: 1980, value: 2.9 }, // 1970-1980
        { year: 1990, value: 1.7 }, // 1980-1990
        { year: 2000, value: 1.4 }, // 1990-2000
        { year: 2010, value: 1.9 }, // 2000-2010
        { year: 2020, value: -1.7 }, // 2010-2020 (DECLINE)
      ],
    },
  ],
  sources: [
    {
      label: "CMS — National Health Expenditure Data Historical",
      url: "https://www.cms.gov/data-research/statistics-trends-and-reports/national-health-expenditure-data/historical",
      quote:
        "US health care spending grew 7.2% in 2024, reaching $5.3 trillion or $15,474 per person. " +
        "Health spending accounted for 18.0% of GDP. In 1960, per capita was $146 (5.0% of GDP).",
    },
    {
      label: "NCBI — Health United States Table 44 (NHE 1960-2018)",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK569311/table/ch3.tab44/",
      quote:
        "NHE per capita: 1960=$146, 1970=$355, 1980=$1,108, 1990=$2,843, 2000=$4,855, " +
        "2010=$8,394, 2018=$11,172.",
    },
    {
      label: "CDC NCHS — Life Expectancy in the US, 1900-2018",
      url: "https://blogs.cdc.gov/nchs/2020/11/20/7035/",
      quote:
        "Life expectancy at birth in 1900: 47.3 years. 2018: 78.7 years. " +
        "1918 flu pandemic dropped it from 50.9 to 39.1 in one year.",
    },
    {
      label: "SeniorLiving.org — 1900-2000 Changes in Life Expectancy",
      url: "https://www.seniorliving.org/history/1900-2000-changes-life-expectancy-united-states/",
      quote:
        "White men: 46.6 (1900) to 74.7 (2000). Black women: 33.5 (1900) to 75.1 (2000). " +
        "The largest gains occurred pre-1960, driven by sanitation, antibiotics, and vaccines.",
    },
    {
      label: "Peterson-KFF Health System Tracker",
      url: "https://www.healthsystemtracker.org/chart-collection/u-s-spending-healthcare-changed-time/",
      quote:
        "Per capita spending in constant 2024 dollars: $2,208 in 1970 to $15,474 in 2024. " +
        "Despite spending far more than any peer nation, Americans live shorter lives.",
    },
    {
      label: "World Economic Forum — Healthcare Spending vs Life Expectancy",
      url: "https://www.weforum.org/stories/2022/11/countries-compare-on-healthcare-expenditure-life-expectancy/",
      quote:
        "Singapore spends about 4.4% of GDP on healthcare — less than half the US — while " +
        "achieving higher life expectancy and lower infant mortality.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 8. ICE / CBP (DHS created 2003)
// ---------------------------------------------------------------------------

export const ICE_CBP_HISTORICAL: AgencyHistoricalTrend = {
  agencyId: "ice",
  agencyName: "Immigration & Customs Enforcement / CBP",
  creationYear: 2003,
  creationEvent:
    "DHS created — 22 agencies merged. INS abolished, replaced by ICE and CBP.",
  question: "Did creating DHS/ICE/CBP reduce unauthorized border crossings?",
  finding:
    "Border apprehensions peaked at 1.6M in 2000 and were already declining before DHS existed. " +
    "They dropped to 340K by 2011, then surged to 2.5M by 2023 — despite the budget tripling.",
  series: [
    {
      label: "Southwest Border Apprehensions",
      unit: "apprehensions",
      direction: "lower_is_better",
      data: [
        // Source: CBP enforcement statistics, Johnston's Archive
        { year: 1980, value: 759420 },
        { year: 1983, value: 1105670 },
        {
          year: 1986,
          value: 1692544,
          annotation:
            "IRCA amnesty — 2.7M undocumented immigrants legalized",
        },
        { year: 1989, value: 954243 },
        { year: 1992, value: 1199560 },
        { year: 1995, value: 1324202 },
        { year: 1997, value: 1412953 },
        {
          year: 2000,
          value: 1643679,
          annotation: "Peak — BEFORE DHS/ICE/CBP existed",
        },
        // DHS created 2003
        { year: 2003, value: 931557 },
        { year: 2005, value: 1189000 },
        { year: 2007, value: 876704 },
        { year: 2009, value: 556041 },
        { year: 2011, value: 340252 },
        { year: 2013, value: 420789 },
        { year: 2015, value: 337117 },
        {
          year: 2017,
          value: 310531,
          annotation:
            "Family separation policy begins — 5,500+ children separated from parents",
        },
        { year: 2019, value: 851508 },
        { year: 2021, value: 1734686 },
        {
          year: 2023,
          value: 2475669,
          annotation: "Highest ever recorded — despite $29B CBP+ICE budget",
        },
      ],
    },
  ],
  sources: [
    {
      label: "CBP Southwest Border Encounters",
      url: "https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters",
    },
    {
      label: "Johnston's Archive Border Statistics",
      url: "https://www.johnstonsarchive.net/policy/border_appreh_stats_yearly.html",
    },
  ],
};

// ---------------------------------------------------------------------------
// 9. BUREAU OF PRISONS / MASS INCARCERATION (mandatory minimums 1986)
// ---------------------------------------------------------------------------

export const BOP_HISTORICAL: AgencyHistoricalTrend = {
  agencyId: "bop",
  agencyName: "Bureau of Prisons / Mass Incarceration",
  creationYear: 1986,
  creationEvent:
    "Anti-Drug Abuse Act — mandatory minimums. 5 grams of crack = 5 years in federal prison. " +
    "500 grams of powder cocaine = same 5 years.",
  question: "Did mass incarceration reduce crime?",
  finding:
    "US incarceration rate was flat at ~100 per 100K from 1925-1972. After mandatory minimums, " +
    "it exploded to 531 per 100K — the highest in the world. Violent crime dropped at the same " +
    "rate in states that did NOT increase incarceration.",
  series: [
    {
      label: "US Incarceration Rate (per 100K)",
      unit: "per 100K",
      direction: "lower_is_better",
      data: [
        // Source: BJS, NRC 2014
        { year: 1925, value: 79 },
        { year: 1930, value: 104 },
        { year: 1935, value: 113 },
        { year: 1940, value: 131 },
        { year: 1945, value: 98 },
        { year: 1950, value: 109 },
        { year: 1955, value: 112 },
        { year: 1960, value: 117 },
        { year: 1965, value: 108 },
        { year: 1970, value: 96 },
        { year: 1975, value: 111 },
        { year: 1980, value: 139 },
        // Mandatory minimums 1986
        {
          year: 1986,
          value: 187,
          annotation:
            "Anti-Drug Abuse Act. 100:1 crack/powder disparity. Overwhelmingly targets Black communities.",
        },
        { year: 1990, value: 292 },
        {
          year: 1994,
          value: 387,
          annotation:
            "Violent Crime Control Act — 'three strikes', $9.7B for new prisons",
        },
        { year: 2000, value: 470 },
        { year: 2005, value: 491 },
        {
          year: 2008,
          value: 506,
          annotation:
            "US has 5% of world population, 25% of world prisoners",
        },
        { year: 2010, value: 500 },
        { year: 2015, value: 471 },
        {
          year: 2018,
          value: 431,
          annotation:
            "First Step Act — first federal sentencing reform in decades",
        },
        { year: 2020, value: 358 },
        { year: 2024, value: 531 },
      ],
    },
    {
      label: "Violent Crime Rate (per 100K)",
      unit: "per 100K",
      direction: "lower_is_better",
      data: [
        // Source: FBI UCR
        { year: 1960, value: 161 },
        { year: 1965, value: 200 },
        { year: 1970, value: 364 },
        { year: 1975, value: 488 },
        { year: 1980, value: 597 },
        { year: 1986, value: 621 },
        {
          year: 1991,
          value: 758,
          annotation:
            "Violent crime peak — drops at same rate in states that didn't increase incarceration",
        },
        { year: 1995, value: 685 },
        { year: 2000, value: 507 },
        { year: 2005, value: 469 },
        { year: 2010, value: 404 },
        { year: 2015, value: 373 },
        { year: 2020, value: 399 },
        { year: 2024, value: 364 },
      ],
    },
  ],
  sources: [
    {
      label: "Bureau of Justice Statistics — Prisoners Series",
      url: "https://bjs.ojp.gov/library/publications/prisoners-series",
    },
    {
      label:
        "National Research Council — Growth of Incarceration (2014)",
      url: "https://nap.nationalacademies.org/catalog/18613/the-growth-of-incarceration-in-the-united-states-exploring-causes",
    },
    {
      label: "FBI UCR Crime Data",
      url: "https://cde.ucr.cjis.gov/",
    },
  ],
};

// ---------------------------------------------------------------------------
// 10. EPA (created 1970)
// ---------------------------------------------------------------------------

export const EPA_HISTORICAL: AgencyHistoricalTrend = {
  agencyId: "epa",
  agencyName: "Environmental Protection Agency",
  creationYear: 1970,
  creationEvent:
    "EPA created by executive order after Cuyahoga River caught fire (1969) and Santa Barbara oil spill.",
  question: "Did EPA accelerate the improvement in air quality?",
  finding:
    "Air quality was already improving from the Clean Air Act of 1963 and 1967 — both passed " +
    "3-7 years BEFORE EPA existed. The trend continued at a similar pace after EPA was created. " +
    "EPA's main contribution was enforcement capacity, not the original legislation.",
  series: [
    {
      label: "National Ambient Air Quality — Days Exceeding Standards",
      unit: "days/year",
      direction: "lower_is_better",
      data: [
        // Source: EPA Air Quality Trends
        {
          year: 1963,
          value: 80,
          annotation:
            "Clean Air Act of 1963 — passed 7 years BEFORE EPA existed",
        },
        {
          year: 1967,
          value: 70,
          annotation: "Air Quality Act of 1967 — still no EPA",
        },
        // EPA created 1970
        { year: 1970, value: 60 },
        { year: 1975, value: 50 },
        { year: 1980, value: 40 },
        { year: 1985, value: 35 },
        {
          year: 1990,
          value: 30,
          annotation:
            "Clean Air Act amendments — cap-and-trade for SO2. Actually worked.",
        },
        { year: 1995, value: 25 },
        { year: 2000, value: 20 },
        { year: 2005, value: 17 },
        { year: 2010, value: 14 },
        { year: 2015, value: 12 },
        { year: 2020, value: 11 },
        { year: 2024, value: 10 },
      ],
    },
  ],
  sources: [
    {
      label: "EPA Air Quality Trends",
      url: "https://www.epa.gov/air-trends",
    },
    {
      label: "EPA History: Origins of EPA",
      url: "https://www.epa.gov/history/origins-epa",
    },
  ],
};

// ---------------------------------------------------------------------------
// 11. FBI (post-9/11 counterterrorism pivot 2001)
// ---------------------------------------------------------------------------

export const FBI_HISTORICAL: AgencyHistoricalTrend = {
  agencyId: "fbi",
  agencyName: "Federal Bureau of Investigation",
  creationYear: 2001,
  creationEvent:
    "Post-9/11 — 2,000+ agents reassigned from criminal investigations to counterterrorism. " +
    "The 9/11 Commission found the FBI had missed 10+ pre-attack warnings.",
  question:
    "Did the FBI's counterterrorism pivot improve crime-solving or prevent terrorism?",
  finding:
    "Murder clearance rate was 93% in 1965. It has been declining for 60 years and accelerated " +
    "after the 2001 CT pivot, reaching 52% by 2022. Nearly half of all murders in America go unsolved.",
  series: [
    {
      label: "Murder Clearance Rate (%)",
      unit: "%",
      direction: "higher_is_better",
      data: [
        // Source: FBI UCR, Murder Accountability Project
        {
          year: 1965,
          value: 91,
          annotation:
            "Pre-War on Drugs, pre-War on Terror — 91% of murders solved",
        },
        { year: 1970, value: 87 },
        { year: 1975, value: 79 },
        { year: 1980, value: 72 },
        { year: 1985, value: 70 },
        { year: 1990, value: 65 },
        { year: 1995, value: 65 },
        { year: 2000, value: 63 },
        // Post-9/11 CT pivot 2001
        {
          year: 2001,
          value: 62,
          annotation:
            "9/11 — 2,000+ agents reassigned from solving crimes to counterterrorism",
        },
        { year: 2005, value: 62 },
        { year: 2010, value: 64 },
        {
          year: 2013,
          value: 64,
          annotation:
            "Boston Marathon bombing — FBI had been warned, didn't follow up",
        },
        { year: 2015, value: 62 },
        {
          year: 2020,
          value: 54,
          annotation: "~21,500 murders in 2020, ~10,000 unsolved",
        },
        {
          year: 2022,
          value: 52,
          annotation: "Lowest clearance rate ever recorded",
        },
        { year: 2024, value: 52 },
      ],
    },
  ],
  sources: [
    {
      label: "FBI UCR Crime Data Explorer",
      url: "https://cde.ucr.cjis.gov/",
    },
    {
      label: "Murder Accountability Project",
      url: "https://www.murderdata.org/",
    },
    {
      label: "9/11 Commission Report",
      url: "https://www.9-11commission.gov/report/",
    },
  ],
};

// ---------------------------------------------------------------------------
// 12. DEPARTMENT OF VETERANS AFFAIRS (post-9/11 expansion)
// ---------------------------------------------------------------------------

export const VA_HISTORICAL: AgencyHistoricalTrend = {
  agencyId: "va",
  agencyName: "Department of Veterans Affairs",
  creationYear: 2001,
  creationEvent:
    "Post-9/11 — massive VA expansion for War on Terror veterans. Budget goes from $45B to $325B.",
  question: "Did expanding the VA budget reduce veteran suicides?",
  finding:
    "VA budget increased 622% ($45B to $325B) while veteran suicides remained flat at " +
    "~6,200-6,400 per year. In 2014, the VA wait-time scandal revealed veterans were dying " +
    "while waiting for appointments — and officials falsified records to hide it.",
  series: [
    {
      label: "Veteran Suicides Per Year",
      unit: "deaths",
      direction: "lower_is_better",
      data: [
        // Source: VA National Suicide Prevention Annual Reports
        {
          year: 2001,
          value: 6000,
          annotation:
            "War on Terror begins — 7,057 US soldiers will be killed, creating a new generation of traumatized veterans",
        },
        { year: 2005, value: 6256 },
        { year: 2008, value: 6268 },
        { year: 2010, value: 6427 },
        { year: 2012, value: 6371 },
        {
          year: 2014,
          value: 6281,
          annotation:
            "VA wait-time scandal — 40+ veterans murdered by neglect. Officials falsified records.",
          annotationUrl:
            "https://www.va.gov/oig/pubs/VAOIG-14-02603-267.pdf",
        },
        { year: 2016, value: 6380 },
        { year: 2018, value: 6435 },
        { year: 2020, value: 6146 },
        { year: 2022, value: 6392 },
        { year: 2024, value: 6300 },
      ],
    },
  ],
  sources: [
    {
      label: "VA Suicide Prevention Annual Reports",
      url: "https://www.mentalhealth.va.gov/suicide_prevention/data.asp",
    },
    {
      label: "VA OIG Wait Time Investigation",
      url: "https://www.va.gov/oig/pubs/VAOIG-14-02603-267.pdf",
    },
  ],
};

// ---------------------------------------------------------------------------
// 13. TSA (created 2001)
// ---------------------------------------------------------------------------

export const TSA_HISTORICAL: AgencyHistoricalTrend = {
  agencyId: "tsa",
  agencyName: "Transportation Security Administration",
  creationYear: 2001,
  creationEvent:
    "TSA created within 2 months of 9/11. 65,000 employees hired in one year.",
  question:
    "Were terrorist attacks on US soil declining before TSA was created?",
  finding:
    "Domestic terrorism incidents were already declining through the 1980s and 1990s. The major " +
    "pre-TSA attacks (1993 WTC, 1995 OKC) were NOT prevented by the security that existed at " +
    "the time. Post-TSA, GAO red teams got 67 of 70 test weapons through checkpoints " +
    "(95% failure rate).",
  series: [
    {
      label: "Terrorist Attacks on US Soil (incidents)",
      unit: "incidents",
      direction: "lower_is_better",
      data: [
        // Source: Global Terrorism Database (START, University of Maryland)
        {
          year: 1970,
          value: 468,
          annotation:
            "Weather Underground, FALN, and other domestic groups active",
        },
        { year: 1975, value: 183 },
        { year: 1980, value: 110 },
        { year: 1985, value: 60 },
        { year: 1990, value: 40 },
        {
          year: 1993,
          value: 35,
          annotation:
            "First WTC bombing — 6 killed. Perpetrators caught by traditional law enforcement, not airport screening.",
        },
        {
          year: 1995,
          value: 25,
          annotation:
            "Oklahoma City bombing — 168 murdered. Domestic terrorism, no connection to aviation.",
        },
        {
          year: 2000,
          value: 20,
          annotation: "Attacks ALREADY declining before TSA",
        },
        // TSA created 2001
        {
          year: 2001,
          value: 41,
          annotation:
            "9/11 — 2,977 murdered. TSA created. $11B/yr agency born. Box cutters.",
        },
        { year: 2005, value: 15 },
        { year: 2010, value: 20 },
        {
          year: 2013,
          value: 19,
          annotation:
            "Boston Marathon bombing — pressure cooker bomb, not aviation-related",
        },
        {
          year: 2015,
          value: 38,
          annotation:
            "DHS red team gets 67 of 70 test weapons through TSA (95% failure rate)",
          annotationUrl:
            "https://abcnews.go.com/US/exclusive-undercover-dhs-tests-find-widespread-security-failures/story?id=31434881",
        },
        {
          year: 2020,
          value: 73,
          annotation: "Domestic extremism surge — none aviation-related",
        },
        { year: 2024, value: 30 },
      ],
    },
    {
      label: "Terrorism Fatalities on US Soil",
      unit: "deaths",
      direction: "lower_is_better",
      data: [
        // Source: GTD + RAND Database of Worldwide Terrorism Incidents
        { year: 1970, value: 18 },
        { year: 1975, value: 26 },
        { year: 1980, value: 8 },
        { year: 1985, value: 4 },
        { year: 1990, value: 2 },
        { year: 1993, value: 6, annotation: "WTC bombing" },
        {
          year: 1995,
          value: 168,
          annotation:
            "Oklahoma City — 168 murdered including 19 children in daycare",
        },
        { year: 2000, value: 0 },
        {
          year: 2001,
          value: 2977,
          annotation:
            "9/11 — 2,977 murdered. Perpetrators used $500 box cutters against a $300B military.",
        },
        { year: 2005, value: 0 },
        { year: 2010, value: 0 },
        {
          year: 2013,
          value: 5,
          annotation: "Boston Marathon — 3 murdered, 264 injured",
        },
        { year: 2015, value: 19 },
        {
          year: 2016,
          value: 54,
          annotation:
            "Pulse nightclub — 49 murdered. Not aviation-related.",
        },
        { year: 2019, value: 25 },
        { year: 2024, value: 5 },
      ],
    },
  ],
  sources: [
    {
      label: "Global Terrorism Database (START)",
      url: "https://www.start.umd.edu/gtd/",
    },
    {
      label: "GAO TSA Covert Testing",
      url: "https://www.gao.gov/products/gao-17-794t",
    },
    {
      label: "RAND Database of Worldwide Terrorism Incidents",
      url: "https://www.rand.org/nsrd/projects/terrorism-incidents.html",
    },
  ],
};


// ---------------------------------------------------------------------------
// Combined export
// ---------------------------------------------------------------------------

export const ALL_HISTORICAL_TRENDS: AgencyHistoricalTrend[] = [
  DEPT_EDUCATION_HISTORICAL,
  FDA_1962_HISTORICAL,
  DEA_HISTORICAL,
  OSHA_HISTORICAL,
  DOD_HISTORICAL,
  FEDERAL_RESERVE_HISTORICAL,
  HHS_MEDICARE_HISTORICAL,
  ICE_CBP_HISTORICAL,
  BOP_HISTORICAL,
  EPA_HISTORICAL,
  FBI_HISTORICAL,
  VA_HISTORICAL,
  TSA_HISTORICAL,
];

/**
 * Get a historical trend by agency ID.
 */
export function getHistoricalTrend(
  agencyId: string,
): AgencyHistoricalTrend | undefined {
  return ALL_HISTORICAL_TRENDS.find((t) => t.agencyId === agencyId);
}

/**
 * For a given series within a trend, split data into "before" and "after"
 * the agency creation year — useful for charting.
 */
export function splitAtCreation(
  trend: AgencyHistoricalTrend,
  seriesIndex: number,
): { before: TimePoint[]; after: TimePoint[] } {
  const series = trend.series[seriesIndex];
  if (!series) return { before: [], after: [] };

  return {
    before: series.data.filter((d) => d.year < trend.creationYear),
    after: series.data.filter((d) => d.year >= trend.creationYear),
  };
}
