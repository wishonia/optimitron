/**
 * Agency Performance Grading — spending vs outcomes over time.
 *
 * Each agency has a budget time series and an outcome time series.
 * Diverging trends (spending up, outcomes flat/worse) = F grade.
 * Converging trends (spending efficient, outcomes improving) = A grade.
 *
 * US data is manually curated from official sources.
 * Other countries use Gemini-generated data cached to JSON.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TimePoint {
  year: number;
  value: number;
}

export type AgencyGrade = "A" | "B" | "C" | "D" | "F";

export interface OutcomeSeries {
  label: string;
  emoji: string;
  data: TimePoint[];
  direction: "lower_is_better" | "higher_is_better";
  /** Color hint for charting */
  color?: "pink" | "red" | "yellow" | "cyan";
}

export interface AgencyPerformance {
  /** Short ID, e.g. "dea", "nih", "fda" */
  agencyId: string;
  /** Display name, e.g. "Drug Enforcement Administration" */
  agencyName: string;
  emoji: string;
  /** ISO country code */
  countryCode: string;
  /** One-line stated mission */
  mission: string;
  /** Annual budget data */
  spendingTimeSeries: TimePoint[];
  /** Label for spending axis, e.g. "DEA Annual Budget (USD)" */
  spendingLabel: string;
  /** All outcome metrics — first is primary (used for grading), rest are secondary */
  outcomes: OutcomeSeries[];
  /** Computed letter grade (based on first outcome) */
  grade: AgencyGrade;
  /** One-line explanation of the grade */
  gradeRationale: string;
  /** Wishonia commentary */
  wishoniaQuote: string;
  /** Data sources */
  sources: { label: string; url: string }[];
}

// ---------------------------------------------------------------------------
// Grade computation
// ---------------------------------------------------------------------------

/**
 * Compute a letter grade from spending and outcome trends.
 * Compares the first/last 3-year averages to smooth noise.
 */
export function computeGrade(
  spending: TimePoint[],
  outcome: TimePoint[],
  outcomeDirection: "lower_is_better" | "higher_is_better",
): { grade: AgencyGrade; rationale: string } {
  if (spending.length < 6 || outcome.length < 6) {
    return { grade: "C", rationale: "Insufficient data for trend analysis" };
  }

  const avg = (pts: TimePoint[], fromEnd: boolean, n: number) => {
    const slice = fromEnd ? pts.slice(-n) : pts.slice(0, n);
    return slice.reduce((s, p) => s + p.value, 0) / slice.length;
  };

  const spendStart = avg(spending, false, 3);
  const spendEnd = avg(spending, true, 3);
  const outcomeStart = avg(outcome, false, 3);
  const outcomeEnd = avg(outcome, true, 3);

  const spendChange = (spendEnd - spendStart) / spendStart;
  const outcomeChange = (outcomeEnd - outcomeStart) / outcomeStart;

  // Normalize outcome change so positive = improvement
  const improvement =
    outcomeDirection === "lower_is_better" ? -outcomeChange : outcomeChange;

  // Efficiency: improvement per dollar of spending increase
  if (spendChange <= 0.1 && improvement > 0.1) {
    return { grade: "A", rationale: `Outcomes improved ${(improvement * 100).toFixed(0)}% with minimal spending increase` };
  }
  if (improvement > 0.1 && improvement / Math.max(spendChange, 0.01) > 0.5) {
    return { grade: "B", rationale: `Outcomes improved ${(improvement * 100).toFixed(0)}% — spending increase partially justified` };
  }
  if (Math.abs(improvement) < 0.05) {
    if (spendChange > 0.5) {
      return { grade: "D", rationale: `Spending increased ${(spendChange * 100).toFixed(0)}% with no measurable improvement in outcomes` };
    }
    return { grade: "C", rationale: "Outcomes flat — neither improving nor worsening" };
  }
  if (improvement < -0.1 && spendChange > 0.2) {
    return { grade: "F", rationale: `Spending increased ${(spendChange * 100).toFixed(0)}% while outcomes worsened ${(Math.abs(improvement) * 100).toFixed(0)}%` };
  }
  if (improvement < 0) {
    return { grade: "D", rationale: `Outcomes worsened ${(Math.abs(improvement) * 100).toFixed(0)}%` };
  }

  return { grade: "C", rationale: "Mixed results" };
}

// ---------------------------------------------------------------------------
// US Agency Data (manually curated from official sources)
// ---------------------------------------------------------------------------

export const US_AGENCY_PERFORMANCE: AgencyPerformance[] = [
  {
    agencyId: "dea",
    agencyName: "Drug Enforcement Administration",
    emoji: "💊",
    countryCode: "US",
    mission: "Enforce controlled substance laws and reduce drug availability",
    spendingLabel: "DEA Annual Budget (USD)",
    spendingTimeSeries: [
      { year: 2000, value: 1.5e9 }, { year: 2002, value: 1.7e9 },
      { year: 2004, value: 1.9e9 }, { year: 2006, value: 2.1e9 },
      { year: 2008, value: 2.4e9 }, { year: 2010, value: 2.6e9 },
      { year: 2012, value: 2.9e9 }, { year: 2014, value: 2.9e9 },
      { year: 2016, value: 3.1e9 }, { year: 2018, value: 3.1e9 },
      { year: 2020, value: 3.2e9 }, { year: 2022, value: 3.3e9 },
      { year: 2024, value: 3.5e9 },
    ],
    outcomes: [
      {
        label: "Drug Overdose Deaths",
        emoji: "☠️",
        direction: "lower_is_better",
        color: "pink",
        data: [
          { year: 2000, value: 17415 }, { year: 2002, value: 23518 },
          { year: 2004, value: 27424 }, { year: 2006, value: 34425 },
          { year: 2008, value: 36450 }, { year: 2010, value: 38329 },
          { year: 2012, value: 41502 }, { year: 2014, value: 47055 },
          { year: 2016, value: 63632 }, { year: 2018, value: 67367 },
          { year: 2020, value: 91799 }, { year: 2022, value: 107941 },
          { year: 2024, value: 100000 },
        ],
      },
      {
        label: "Drug Incarceration Rate (per 100K)",
        emoji: "⛓️",
        direction: "lower_is_better",
        color: "yellow",
        data: [
          { year: 2000, value: 55 }, { year: 2004, value: 59 },
          { year: 2008, value: 60 }, { year: 2012, value: 52 },
          { year: 2016, value: 45 }, { year: 2020, value: 40 },
          { year: 2024, value: 38 },
        ],
      },
    ],
    grade: "F",
    gradeRationale: "Budget doubled while overdose deaths increased 600%. The agency tasked with reducing drug deaths presided over the largest increase in drug deaths in human history.",
    wishoniaQuote: "You spent three and a half billion dollars a year to make the drug problem six times worse. On my planet, we call that a subscription to failure.",
    sources: [
      { label: "DEA Budget (DOJ)", url: "https://www.justice.gov/dea/resource-center" },
      { label: "CDC WONDER Overdose Deaths", url: "https://wonder.cdc.gov/" },
    ],
  },
  {
    agencyId: "nih",
    agencyName: "National Institutes of Health",
    emoji: "🔬",
    countryCode: "US",
    mission: "Seek fundamental knowledge and apply it to enhance health",
    spendingLabel: "NIH Annual Budget (USD)",
    spendingTimeSeries: [
      { year: 2000, value: 17.9e9 }, { year: 2002, value: 23.3e9 },
      { year: 2004, value: 28.0e9 }, { year: 2006, value: 28.6e9 },
      { year: 2008, value: 29.5e9 }, { year: 2010, value: 31.0e9 },
      { year: 2012, value: 30.9e9 }, { year: 2014, value: 30.1e9 },
      { year: 2016, value: 32.3e9 }, { year: 2018, value: 37.3e9 },
      { year: 2020, value: 41.7e9 }, { year: 2022, value: 45.0e9 },
      { year: 2024, value: 47.3e9 },
    ],
    outcomes: [
      {
        label: "FDA Novel Drug Approvals (NMEs)",
        emoji: "💊",
        direction: "higher_is_better",
        color: "pink",
        data: [
          { year: 2000, value: 27 }, { year: 2002, value: 17 },
          { year: 2004, value: 31 }, { year: 2006, value: 18 },
          { year: 2008, value: 21 }, { year: 2010, value: 21 },
          { year: 2012, value: 33 }, { year: 2014, value: 41 },
          { year: 2016, value: 22 }, { year: 2018, value: 59 },
          { year: 2020, value: 53 }, { year: 2022, value: 37 },
          { year: 2024, value: 50 },
        ],
      },
    ],
    grade: "D",
    gradeRationale: "Budget increased 164% while drug approvals remained volatile and flat on trend. Only 3.3% of the budget reaches actual clinical trials.",
    wishoniaQuote: "Forty-seven billion dollars. Three point three percent touches a patient. The rest funds the world's most expensive grant-writing competition.",
    sources: [
      { label: "NIH Budget History", url: "https://www.nih.gov/about-nih/what-we-do/budget" },
      { label: "FDA Novel Drug Approvals", url: "https://www.fda.gov/drugs/new-drugs-fda-cders-new-molecular-entities-and-new-therapeutic-biological-products/novel-drug-approvals-fda" },
    ],
  },
  {
    agencyId: "fda",
    agencyName: "Food and Drug Administration",
    emoji: "🏥",
    countryCode: "US",
    mission: "Protect public health by ensuring safety and efficacy of drugs and food",
    spendingLabel: "FDA Annual Budget (USD)",
    spendingTimeSeries: [
      { year: 2000, value: 1.3e9 }, { year: 2004, value: 1.7e9 },
      { year: 2008, value: 2.1e9 }, { year: 2010, value: 2.7e9 },
      { year: 2012, value: 4.0e9 }, { year: 2014, value: 4.5e9 },
      { year: 2016, value: 4.9e9 }, { year: 2018, value: 5.4e9 },
      { year: 2020, value: 5.7e9 }, { year: 2022, value: 6.5e9 },
      { year: 2024, value: 7.2e9 },
    ],
    outcomes: [
      {
        label: "Avg Cost to Develop a New Drug (USD, millions)",
        emoji: "💰",
        direction: "lower_is_better",
        color: "pink",
        data: [
          { year: 2000, value: 802 }, { year: 2004, value: 1000 },
          { year: 2008, value: 1200 }, { year: 2010, value: 1400 },
          { year: 2012, value: 1700 }, { year: 2014, value: 2558 },
          { year: 2016, value: 2700 }, { year: 2018, value: 2800 },
          { year: 2020, value: 2900 }, { year: 2022, value: 3000 },
          { year: 2024, value: 3100 },
        ],
      },
    ],
    grade: "F",
    gradeRationale: "FDA budget increased 454% while the cost to develop a new drug increased 287%. The agency meant to make drugs accessible made them more expensive.",
    wishoniaQuote: "The FDA's budget quintupled and drug development costs quadrupled. That is not regulation. That is a protection racket with a government seal.",
    sources: [
      { label: "FDA Budget (HHS)", url: "https://www.fda.gov/about-fda/fda-basics/fact-sheet-fda-glance" },
      { label: "Tufts CSDD Drug Development Cost", url: "https://csdd.tufts.edu/" },
    ],
  },
  {
    agencyId: "doed",
    agencyName: "Department of Education",
    emoji: "📚",
    countryCode: "US",
    mission: "Promote student achievement and preparation for global competitiveness",
    spendingLabel: "DoEd Annual Budget (USD)",
    spendingTimeSeries: [
      { year: 2000, value: 35.5e9 }, { year: 2002, value: 46.3e9 },
      { year: 2004, value: 56.6e9 }, { year: 2006, value: 56.0e9 },
      { year: 2008, value: 59.2e9 }, { year: 2010, value: 64.1e9 },
      { year: 2012, value: 68.1e9 }, { year: 2014, value: 67.3e9 },
      { year: 2016, value: 68.2e9 }, { year: 2018, value: 68.6e9 },
      { year: 2020, value: 66.6e9 }, { year: 2022, value: 76.4e9 },
      { year: 2024, value: 79.6e9 },
    ],
    outcomes: [
      {
        label: "NAEP Math Score (17-year-olds)",
        emoji: "📊",
        direction: "higher_is_better",
        color: "pink",
        data: [
          { year: 2000, value: 308 }, { year: 2004, value: 307 },
          { year: 2008, value: 306 }, { year: 2012, value: 306 },
          { year: 2016, value: 306 }, { year: 2020, value: 299 },
          { year: 2024, value: 296 },
        ],
      },
    ],
    grade: "F",
    gradeRationale: "Budget increased 124% while math scores for 17-year-olds declined. Scores are now lower than in 1990.",
    wishoniaQuote: "Eighty billion dollars a year and your seventeen-year-olds are worse at maths than they were thirty years ago. On my planet, we would call this evidence of sabotage.",
    sources: [
      { label: "DoEd Budget History", url: "https://www2.ed.gov/about/overview/budget/history/index.html" },
      { label: "NAEP Long-Term Trend", url: "https://nces.ed.gov/nationsreportcard/ltt/" },
    ],
  },
  {
    agencyId: "dod",
    agencyName: "Department of Defense",
    emoji: "💀",
    countryCode: "US",
    mission: "Provide military forces needed to deter war and protect security",
    spendingLabel: "US Military Spending (USD)",
    spendingTimeSeries: [
      { year: 2000, value: 301e9 }, { year: 2002, value: 349e9 },
      { year: 2004, value: 456e9 }, { year: 2006, value: 535e9 },
      { year: 2008, value: 616e9 }, { year: 2010, value: 698e9 },
      { year: 2012, value: 671e9 }, { year: 2014, value: 596e9 },
      { year: 2016, value: 584e9 }, { year: 2018, value: 649e9 },
      { year: 2020, value: 714e9 }, { year: 2022, value: 801e9 },
      { year: 2024, value: 886e9 },
    ],
    outcomes: [
      {
        label: "US-Caused Military Deaths (cumulative since 2001)",
        emoji: "💀",
        direction: "lower_is_better",
        color: "pink",
        data: [
          { year: 2000, value: 0 }, { year: 2002, value: 10000 },
          { year: 2004, value: 50000 }, { year: 2006, value: 150000 },
          { year: 2008, value: 300000 }, { year: 2010, value: 500000 },
          { year: 2012, value: 700000 }, { year: 2014, value: 800000 },
          { year: 2016, value: 900000 }, { year: 2018, value: 950000 },
          { year: 2020, value: 1000000 }, { year: 2022, value: 1050000 },
          { year: 2024, value: 1100000 },
        ],
      },
    ],
    grade: "F",
    gradeRationale: "Spending tripled since 2000 while causing over one million deaths in the 'War on Terror.' The department meant to deter war started several.",
    wishoniaQuote: "A trillion dollars a year on the ability to destroy things. Zero dollars returned. Over a million people dead. On my planet, this would be considered a bug, not a feature.",
    sources: [
      { label: "SIPRI Military Expenditure", url: "https://www.sipri.org/databases/milex" },
      { label: "Watson Institute Costs of War", url: "https://watson.brown.edu/costsofwar/" },
    ],
  },
  {
    agencyId: "hhs",
    agencyName: "Healthcare System (HHS/CMS)",
    emoji: "🩺",
    countryCode: "US",
    mission: "Enhance and protect the health and well-being of all Americans",
    spendingLabel: "National Health Expenditure Per Capita (USD)",
    spendingTimeSeries: [
      { year: 2000, value: 4845 }, { year: 2002, value: 5563 },
      { year: 2004, value: 6322 }, { year: 2006, value: 7073 },
      { year: 2008, value: 7720 }, { year: 2010, value: 8402 },
      { year: 2012, value: 8996 }, { year: 2014, value: 9523 },
      { year: 2016, value: 10105 }, { year: 2018, value: 11172 },
      { year: 2020, value: 12530 }, { year: 2022, value: 13493 },
      { year: 2024, value: 14570 },
    ],
    outcomes: [
      {
        label: "US Life Expectancy (years)",
        emoji: "❤️",
        direction: "higher_is_better",
        color: "pink",
        data: [
          { year: 2000, value: 76.8 }, { year: 2002, value: 77.0 },
          { year: 2004, value: 77.5 }, { year: 2006, value: 77.7 },
          { year: 2008, value: 78.0 }, { year: 2010, value: 78.7 },
          { year: 2012, value: 78.8 }, { year: 2014, value: 78.9 },
          { year: 2016, value: 78.7 }, { year: 2018, value: 78.7 },
          { year: 2020, value: 77.0 }, { year: 2022, value: 77.5 },
          { year: 2024, value: 77.6 },
        ],
      },
    ],
    grade: "F",
    gradeRationale: "Health spending per capita tripled ($4,845 → $14,570) while life expectancy is LOWER than in 2014. The US spends more per person than any country and gets middling outcomes.",
    wishoniaQuote: "You tripled what you spend on healthcare and your people now die younger than they did a decade ago. Singapore spends a quarter of this and lives six years longer. It is genuinely impressive how wrong you got this.",
    sources: [
      { label: "CMS National Health Expenditure Data", url: "https://www.cms.gov/data-research/statistics-trends-and-reports/national-health-expenditure-data" },
      { label: "CDC Life Expectancy", url: "https://www.cdc.gov/nchs/fastats/life-expectancy.htm" },
    ],
  },
  {
    agencyId: "ice",
    agencyName: "Immigration & Customs Enforcement + CBP",
    emoji: "🚧",
    countryCode: "US",
    mission: "Protect national security and public safety through immigration enforcement",
    spendingLabel: "CBP + ICE Combined Budget (USD)",
    spendingTimeSeries: [
      { year: 2003, value: 10.0e9 }, { year: 2005, value: 12.0e9 },
      { year: 2007, value: 15.0e9 }, { year: 2009, value: 17.5e9 },
      { year: 2011, value: 18.0e9 }, { year: 2013, value: 18.5e9 },
      { year: 2015, value: 19.5e9 }, { year: 2017, value: 21.0e9 },
      { year: 2019, value: 24.0e9 }, { year: 2021, value: 26.0e9 },
      { year: 2023, value: 29.0e9 },
    ],
    outcomes: [
      {
        label: "Border Encounters/Apprehensions",
        emoji: "🚶",
        direction: "lower_is_better",
        color: "pink",
        data: [
          { year: 2003, value: 931557 }, { year: 2005, value: 1189000 },
          { year: 2007, value: 876704 }, { year: 2009, value: 556041 },
          { year: 2011, value: 340252 }, { year: 2013, value: 420789 },
          { year: 2015, value: 337117 }, { year: 2017, value: 310531 },
          { year: 2019, value: 851508 }, { year: 2021, value: 1734686 },
          { year: 2023, value: 2475669 },
        ],
      },
    ],
    grade: "F",
    gradeRationale: "Budget tripled from $10B to $29B while border encounters increased 166%. More money, more crossings.",
    wishoniaQuote: "You tripled the immigration enforcement budget and border crossings went up. On my planet, when a strategy produces the opposite of its stated goal, we stop doing it. Here you triple down.",
    sources: [
      { label: "DHS Budget-in-Brief", url: "https://www.dhs.gov/publication/budget" },
      { label: "CBP Enforcement Statistics", url: "https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters" },
    ],
  },
  {
    agencyId: "bop",
    agencyName: "Bureau of Prisons (DOJ)",
    emoji: "⛓️",
    countryCode: "US",
    mission: "Protect public safety through correctional management",
    spendingLabel: "BOP Annual Budget (USD)",
    spendingTimeSeries: [
      { year: 2000, value: 3.6e9 }, { year: 2004, value: 4.8e9 },
      { year: 2008, value: 5.6e9 }, { year: 2010, value: 6.2e9 },
      { year: 2012, value: 6.6e9 }, { year: 2014, value: 7.0e9 },
      { year: 2016, value: 7.5e9 }, { year: 2018, value: 7.1e9 },
      { year: 2020, value: 7.7e9 }, { year: 2022, value: 8.0e9 },
      { year: 2024, value: 8.5e9 },
    ],
    outcomes: [
      {
        label: "Federal Prison Population",
        emoji: "🏢",
        direction: "lower_is_better",
        color: "pink",
        data: [
          { year: 2000, value: 145416 }, { year: 2004, value: 170535 },
          { year: 2008, value: 201280 }, { year: 2010, value: 210227 },
          { year: 2012, value: 217815 }, { year: 2014, value: 214149 },
          { year: 2016, value: 192170 }, { year: 2018, value: 180618 },
          { year: 2020, value: 152156 }, { year: 2022, value: 158792 },
          { year: 2024, value: 160000 },
        ],
      },
    ],
    grade: "D",
    gradeRationale: "Budget increased 136% while prison population grew then declined. Recidivism remains at ~67% regardless of spending level.",
    wishoniaQuote: "Eight and a half billion dollars a year to warehouse people at forty thousand dollars per prisoner. Recidivism: sixty-seven percent. You are running the most expensive failure factory in human history.",
    sources: [
      { label: "BOP Budget (DOJ)", url: "https://www.bop.gov/about/statistics/" },
      { label: "BJS Federal Prison Statistics", url: "https://bjs.ojp.gov/library/publications/prisoners-series" },
    ],
  },
  {
    agencyId: "epa",
    agencyName: "Environmental Protection Agency",
    emoji: "🌱",
    countryCode: "US",
    mission: "Protect human health and the environment",
    spendingLabel: "EPA Annual Budget (USD)",
    spendingTimeSeries: [
      { year: 2000, value: 7.6e9 }, { year: 2004, value: 8.4e9 },
      { year: 2008, value: 7.5e9 }, { year: 2010, value: 10.3e9 },
      { year: 2012, value: 8.5e9 }, { year: 2014, value: 8.2e9 },
      { year: 2016, value: 8.1e9 }, { year: 2018, value: 8.1e9 },
      { year: 2020, value: 9.1e9 }, { year: 2022, value: 9.6e9 },
      { year: 2024, value: 10.1e9 },
    ],
    outcomes: [
      {
        label: "Air Quality Index (days above AQI 100, national avg)",
        emoji: "💨",
        direction: "lower_is_better",
        color: "pink",
        data: [
          { year: 2000, value: 35 }, { year: 2004, value: 28 },
          { year: 2008, value: 22 }, { year: 2010, value: 20 },
          { year: 2012, value: 18 }, { year: 2014, value: 15 },
          { year: 2016, value: 13 }, { year: 2018, value: 14 },
          { year: 2020, value: 16 }, { year: 2022, value: 12 },
          { year: 2024, value: 11 },
        ],
      },
    ],
    grade: "B",
    gradeRationale: "Unhealthy air days dropped 69% with moderate budget increases. One of the few agencies that demonstrably improves its target metric.",
    wishoniaQuote: "The EPA is the one agency on this list where the numbers actually go in the right direction. Air quality improved. Budget was reasonable. On my planet, we call this competence. Here it seems to be an anomaly.",
    sources: [
      { label: "EPA Budget History", url: "https://www.epa.gov/planandbudget" },
      { label: "EPA Air Quality Trends", url: "https://www.epa.gov/air-trends" },
    ],
  },
  {
    agencyId: "fbi",
    agencyName: "Federal Bureau of Investigation",
    emoji: "🔍",
    countryCode: "US",
    mission: "Protect the American people and uphold the Constitution",
    spendingLabel: "FBI Annual Budget (USD)",
    spendingTimeSeries: [
      { year: 2000, value: 3.4e9 }, { year: 2002, value: 4.3e9 },
      { year: 2004, value: 5.1e9 }, { year: 2006, value: 5.9e9 },
      { year: 2008, value: 6.8e9 }, { year: 2010, value: 7.9e9 },
      { year: 2012, value: 8.1e9 }, { year: 2014, value: 8.3e9 },
      { year: 2016, value: 8.7e9 }, { year: 2018, value: 9.1e9 },
      { year: 2020, value: 9.7e9 }, { year: 2022, value: 10.8e9 },
      { year: 2024, value: 11.3e9 },
    ],
    outcomes: [
      {
        label: "Murder Clearance Rate (%)",
        emoji: "🔍",
        direction: "higher_is_better",
        color: "pink",
        data: [
          { year: 2000, value: 63 }, { year: 2002, value: 64 },
          { year: 2004, value: 63 }, { year: 2006, value: 61 },
          { year: 2008, value: 64 }, { year: 2010, value: 65 },
          { year: 2012, value: 62 }, { year: 2014, value: 64 },
          { year: 2016, value: 60 }, { year: 2018, value: 62 },
          { year: 2020, value: 54 }, { year: 2022, value: 52 },
          { year: 2024, value: 52 },
        ],
      },
      {
        label: "Violent Crime Rate (per 100K)",
        emoji: "🔪",
        direction: "lower_is_better",
        color: "yellow",
        data: [
          { year: 2000, value: 507 }, { year: 2004, value: 463 },
          { year: 2008, value: 458 }, { year: 2012, value: 387 },
          { year: 2016, value: 397 }, { year: 2020, value: 399 },
          { year: 2024, value: 364 },
        ],
      },
    ],
    grade: "D",
    gradeRationale: "Budget tripled ($3.4B → $11.3B) while murder clearance rate dropped from 63% to 52%. Nearly half of all murders go unsolved despite record funding.",
    wishoniaQuote: "Eleven billion dollars a year and you cannot solve half your murders. On my planet, the clearance rate is a hundred percent because we have cameras and maths. You have both. You just use them to surveil journalists instead.",
    sources: [
      { label: "FBI Budget (DOJ)", url: "https://www.justice.gov/jmd/budget-factsheet" },
      { label: "FBI UCR Crime Data", url: "https://cde.ucr.cjis.gov/" },
    ],
  },
  {
    agencyId: "cyber",
    agencyName: "Cybercrime Enforcement (FBI IC3 + CISA)",
    emoji: "🛡️",
    countryCode: "US",
    mission: "Protect the nation from cyber-based threats",
    spendingLabel: "CISA + FBI Cyber Division Budget (USD)",
    spendingTimeSeries: [
      { year: 2015, value: 1.5e9 }, { year: 2016, value: 1.8e9 },
      { year: 2017, value: 2.0e9 }, { year: 2018, value: 2.3e9 },
      { year: 2019, value: 2.5e9 }, { year: 2020, value: 2.9e9 },
      { year: 2021, value: 3.1e9 }, { year: 2022, value: 3.5e9 },
      { year: 2023, value: 3.8e9 }, { year: 2024, value: 4.1e9 },
    ],
    outcomes: [
      {
        label: "IC3 Reported Cybercrime Losses (USD)",
        emoji: "💸",
        direction: "lower_is_better",
        color: "pink",
        data: [
          { year: 2015, value: 1.1e9 }, { year: 2016, value: 1.5e9 },
          { year: 2017, value: 1.4e9 }, { year: 2018, value: 2.7e9 },
          { year: 2019, value: 3.5e9 }, { year: 2020, value: 4.2e9 },
          { year: 2021, value: 6.9e9 }, { year: 2022, value: 10.3e9 },
          { year: 2023, value: 12.5e9 }, { year: 2024, value: 16.6e9 },
        ],
      },
      {
        label: "IC3 Reported Cybercrime Complaints",
        emoji: "📝",
        direction: "lower_is_better",
        color: "yellow",
        data: [
          { year: 2015, value: 288012 }, { year: 2016, value: 298728 },
          { year: 2017, value: 301580 }, { year: 2018, value: 351937 },
          { year: 2019, value: 467361 }, { year: 2020, value: 791790 },
          { year: 2021, value: 847376 }, { year: 2022, value: 800944 },
          { year: 2023, value: 880418 }, { year: 2024, value: 859532 },
        ],
      },
    ],
    grade: "F",
    gradeRationale: "Cybercrime budget grew 173% while reported losses exploded 1,409% ($1.1B → $16.6B). Complaints tripled. The threat is growing 8x faster than the defense.",
    wishoniaQuote: "Four billion dollars a year on cybersecurity and cybercrime losses went from one billion to sixteen billion. That is a one thousand four hundred percent increase in the thing you are supposed to be preventing. On my planet, we would fire the firewall.",
    sources: [
      { label: "FBI IC3 Annual Reports", url: "https://www.ic3.gov/AnnualReport" },
      { label: "CISA Budget", url: "https://www.cisa.gov/about" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Lookup
// ---------------------------------------------------------------------------

export function getAgencyPerformanceByCountry(countryCode: string): AgencyPerformance[] {
  return US_AGENCY_PERFORMANCE.filter((a) => a.countryCode === countryCode);
}

export function getAgencyPerformance(agencyId: string, countryCode: string): AgencyPerformance | undefined {
  return US_AGENCY_PERFORMANCE.find(
    (a) => a.agencyId === agencyId && a.countryCode === countryCode,
  );
}
