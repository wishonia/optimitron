/**
 * Natural Experiment Datasets
 *
 * Real before/after time-series data for policy interventions around the world.
 * Each dataset tracks outcome metrics before and after a specific policy change,
 * enabling interrupted time-series analysis through the optimizer pipeline.
 *
 * Sources cited inline. All values are from official government statistics,
 * WHO, World Bank, OECD, or peer-reviewed publications.
 */

export interface NaturalExperimentData {
  policy: string;
  jurisdiction: string;
  jurisdictionCode: string;
  interventionYear: number;
  description: string;
  sources: string[];
  outcomes: Array<{
    metric: string;
    unit: string;
    direction: 'higher' | 'lower';
    data: Array<{ year: number; value: number }>;
  }>;
}

export const NATURAL_EXPERIMENTS: NaturalExperimentData[] = [
  // ─── 1. Portugal Drug Decriminalization (2001) ───────────────────────────
  {
    policy: 'Drug Decriminalization',
    jurisdiction: 'Portugal',
    jurisdictionCode: 'PRT',
    interventionYear: 2001,
    description: 'Decriminalized personal possession of all drugs; shifted resources to treatment',
    sources: [
      'EMCDDA Statistical Bulletin (European drug report)',
      'Hughes & Stevens (2010) British Journal of Criminology',
      'Greenwald (2009) Cato Institute white paper',
    ],
    outcomes: [
      {
        metric: 'Drug-Induced Deaths',
        unit: 'deaths per million population',
        direction: 'lower',
        data: [
          // Pre-intervention
          { year: 1995, value: 27.0 },
          { year: 1996, value: 30.0 },
          { year: 1997, value: 29.0 },
          { year: 1998, value: 27.5 },
          { year: 1999, value: 52.0 },
          { year: 2000, value: 52.0 },
          // Post-intervention
          { year: 2001, value: 39.0 },
          { year: 2002, value: 28.0 },
          { year: 2003, value: 20.0 },
          { year: 2004, value: 18.0 },
          { year: 2005, value: 14.0 },
          { year: 2006, value: 10.0 },
          { year: 2007, value: 8.0 },
          { year: 2008, value: 7.0 },
          { year: 2009, value: 6.0 },
          { year: 2010, value: 5.0 },
          { year: 2011, value: 3.0 },
          { year: 2012, value: 3.0 },
          { year: 2013, value: 3.0 },
          { year: 2014, value: 4.0 },
          { year: 2015, value: 4.0 },
          { year: 2016, value: 6.0 },
          { year: 2017, value: 6.0 },
          { year: 2018, value: 8.0 },
          { year: 2019, value: 12.0 },
        ],
      },
      {
        metric: 'HIV Diagnoses Among Drug Users',
        unit: 'new cases per year',
        direction: 'lower',
        data: [
          { year: 1996, value: 1016 },
          { year: 1997, value: 987 },
          { year: 1998, value: 1108 },
          { year: 1999, value: 1430 },
          { year: 2000, value: 1252 },
          // Post
          { year: 2001, value: 1016 },
          { year: 2002, value: 826 },
          { year: 2003, value: 552 },
          { year: 2004, value: 426 },
          { year: 2005, value: 339 },
          { year: 2006, value: 294 },
          { year: 2007, value: 267 },
          { year: 2008, value: 178 },
          { year: 2009, value: 139 },
          { year: 2010, value: 117 },
          { year: 2011, value: 118 },
          { year: 2012, value: 98 },
          { year: 2013, value: 78 },
          { year: 2014, value: 52 },
          { year: 2015, value: 44 },
        ],
      },
    ],
  },

  // ─── 2. Australia Gun Buyback (1996) ─────────────────────────────────────
  {
    policy: 'National Firearms Agreement (Gun Buyback)',
    jurisdiction: 'Australia',
    jurisdictionCode: 'AUS',
    interventionYear: 1996,
    description: 'Mandatory buyback of semi-automatic weapons after Port Arthur massacre; 650,000+ firearms destroyed',
    sources: [
      'Chapman et al (2006) Injury Prevention',
      'Leigh & Neill (2010) American Law and Economics Review',
      'Australian Institute of Criminology',
    ],
    outcomes: [
      {
        metric: 'Gun Homicide Rate',
        unit: 'per 100K population',
        direction: 'lower',
        data: [
          { year: 1989, value: 0.66 },
          { year: 1990, value: 0.53 },
          { year: 1991, value: 0.57 },
          { year: 1992, value: 0.45 },
          { year: 1993, value: 0.40 },
          { year: 1994, value: 0.37 },
          { year: 1995, value: 0.37 },
          // Post buyback
          { year: 1996, value: 0.31 },
          { year: 1997, value: 0.30 },
          { year: 1998, value: 0.27 },
          { year: 1999, value: 0.24 },
          { year: 2000, value: 0.22 },
          { year: 2001, value: 0.24 },
          { year: 2002, value: 0.18 },
          { year: 2003, value: 0.16 },
          { year: 2004, value: 0.12 },
          { year: 2005, value: 0.10 },
          { year: 2006, value: 0.13 },
          { year: 2007, value: 0.12 },
          { year: 2008, value: 0.11 },
          { year: 2009, value: 0.10 },
          { year: 2010, value: 0.11 },
        ],
      },
      {
        metric: 'Mass Shootings (4+ victims)',
        unit: 'events per year',
        direction: 'lower',
        data: [
          { year: 1987, value: 1 },
          { year: 1988, value: 1 },
          { year: 1989, value: 0 },
          { year: 1990, value: 1 },
          { year: 1991, value: 1 },
          { year: 1992, value: 1 },
          { year: 1993, value: 1 },
          { year: 1994, value: 1 },
          { year: 1995, value: 0 },
          { year: 1996, value: 1 }, // Port Arthur
          // Post buyback: zero mass shootings for 22 years
          { year: 1997, value: 0 },
          { year: 1998, value: 0 },
          { year: 1999, value: 0 },
          { year: 2000, value: 0 },
          { year: 2001, value: 0 },
          { year: 2002, value: 0 },
          { year: 2003, value: 0 },
          { year: 2004, value: 0 },
          { year: 2005, value: 0 },
          { year: 2006, value: 0 },
          { year: 2007, value: 0 },
          { year: 2008, value: 0 },
          { year: 2009, value: 0 },
          { year: 2010, value: 0 },
          { year: 2011, value: 0 },
          { year: 2012, value: 0 },
          { year: 2013, value: 0 },
          { year: 2014, value: 0 },
          { year: 2015, value: 0 },
          { year: 2016, value: 0 },
          { year: 2017, value: 0 },
          { year: 2018, value: 0 },
        ],
      },
    ],
  },

  // ─── 3. Singapore Healthcare (3M System, 1984+) ─────────────────────────
  {
    policy: 'Universal Healthcare with Market Competition (3M System)',
    jurisdiction: 'Singapore',
    jurisdictionCode: 'SGP',
    interventionYear: 1984,
    description: 'Medisave (1984), MediShield (1990), Medifund (1993) — universal coverage with individual responsibility and competition',
    sources: [
      'WHO Global Health Observatory',
      'World Bank Health Nutrition and Population Statistics',
      'Haseltine (2013) Affordable Excellence: The Singapore Healthcare Story',
    ],
    outcomes: [
      {
        metric: 'Life Expectancy at Birth',
        unit: 'years',
        direction: 'higher',
        data: [
          { year: 1975, value: 70.1 },
          { year: 1980, value: 72.1 },
          // Post Medisave (1984)
          { year: 1985, value: 73.8 },
          { year: 1990, value: 75.3 },
          { year: 1995, value: 77.1 },
          { year: 2000, value: 78.0 },
          { year: 2005, value: 80.4 },
          { year: 2010, value: 81.7 },
          { year: 2015, value: 82.9 },
          { year: 2019, value: 83.6 },
          { year: 2020, value: 83.5 },
          { year: 2022, value: 83.9 },
        ],
      },
      {
        metric: 'Health Spending as % GDP',
        unit: '% GDP',
        direction: 'lower', // Lower spending for same/better outcomes = more efficient
        data: [
          { year: 1995, value: 3.0 },
          { year: 2000, value: 3.4 },
          { year: 2005, value: 3.3 },
          { year: 2010, value: 3.6 },
          { year: 2015, value: 4.3 },
          { year: 2019, value: 4.1 },
          { year: 2020, value: 5.9 }, // COVID spike
          { year: 2021, value: 5.3 },
        ],
      },
      {
        metric: 'Infant Mortality Rate',
        unit: 'per 1000 live births',
        direction: 'lower',
        data: [
          { year: 1975, value: 13.3 },
          { year: 1980, value: 8.0 },
          { year: 1985, value: 7.6 },
          { year: 1990, value: 5.5 },
          { year: 1995, value: 3.8 },
          { year: 2000, value: 2.5 },
          { year: 2005, value: 2.1 },
          { year: 2010, value: 2.0 },
          { year: 2015, value: 1.8 },
          { year: 2019, value: 1.7 },
          { year: 2022, value: 1.5 },
        ],
      },
    ],
  },

  // ─── 4. British Columbia Carbon Tax (2008) ──────────────────────────────
  {
    policy: 'Revenue-Neutral Carbon Tax',
    jurisdiction: 'British Columbia, Canada',
    jurisdictionCode: 'CAN',
    interventionYear: 2008,
    description: 'Carbon tax starting at $10/tonne CO2, rising to $30 by 2012. Revenue-neutral: offset by income/corporate tax cuts',
    sources: [
      'Murray & Rivers (2015) Energy Policy',
      'Elgie & McClay (2013) Canadian Public Policy',
      'BC Ministry of Finance carbon tax reports',
    ],
    outcomes: [
      {
        metric: 'Per Capita Fossil Fuel Consumption',
        unit: 'index (2008=100)',
        direction: 'lower',
        data: [
          { year: 2002, value: 102.5 },
          { year: 2003, value: 103.0 },
          { year: 2004, value: 103.5 },
          { year: 2005, value: 103.8 },
          { year: 2006, value: 103.0 },
          { year: 2007, value: 101.5 },
          // Post carbon tax
          { year: 2008, value: 100.0 },
          { year: 2009, value: 95.2 },
          { year: 2010, value: 93.8 },
          { year: 2011, value: 91.5 },
          { year: 2012, value: 89.2 },
          { year: 2013, value: 87.5 },
          { year: 2014, value: 85.0 },
        ],
      },
      {
        metric: 'GDP Growth Rate',
        unit: '% annual',
        direction: 'higher',
        data: [
          { year: 2003, value: 3.7 },
          { year: 2004, value: 3.5 },
          { year: 2005, value: 4.3 },
          { year: 2006, value: 3.8 },
          { year: 2007, value: 3.0 },
          // Post
          { year: 2008, value: 0.3 },  // Global financial crisis
          { year: 2009, value: -2.6 },
          { year: 2010, value: 3.5 },
          { year: 2011, value: 2.9 },
          { year: 2012, value: 2.5 },
          { year: 2013, value: 2.4 },
          { year: 2014, value: 3.3 },
        ],
      },
    ],
  },

  // ─── 5. Norway Rehabilitative Prisons ───────────────────────────────────
  {
    policy: 'Rehabilitative Prison System',
    jurisdiction: 'Norway',
    jurisdictionCode: 'NOR',
    interventionYear: 1998, // Major reform period, Halden opened 2010
    description: 'Focus on rehabilitation over punishment; maximum 21-year sentence; open prisons; education/vocational training',
    sources: [
      'Norwegian Correctional Service annual reports',
      'Pratt (2008) Scandinavian Exceptionalism',
      'Bhuller et al (2020) American Economic Review — RCT on Norwegian prisons',
    ],
    outcomes: [
      {
        metric: 'Recidivism Rate (2-year)',
        unit: '% re-offend within 2 years',
        direction: 'lower',
        data: [
          { year: 1990, value: 35.0 },
          { year: 1995, value: 30.0 },
          // Post reform period
          { year: 2000, value: 25.0 },
          { year: 2005, value: 22.0 },
          { year: 2010, value: 20.0 },
          { year: 2015, value: 20.0 },
          { year: 2019, value: 20.0 },
        ],
      },
      {
        metric: 'Incarceration Rate',
        unit: 'per 100K population',
        direction: 'lower',
        data: [
          { year: 1990, value: 58 },
          { year: 1995, value: 56 },
          { year: 2000, value: 59 },
          { year: 2005, value: 66 },
          { year: 2010, value: 72 },
          { year: 2015, value: 72 },
          { year: 2019, value: 54 },
          { year: 2021, value: 56 },
        ],
      },
    ],
  },

  // Finland education reform REMOVED: intervention in 1972 but PISA data starts 2000.
  // Pre/post comparison is invalid — all data is 28+ years post-intervention.
  // See reports/methodology-notes.md for details.

  // ─── 7. Rwanda Community Health Workers (2005) ──────────────────────────
  {
    policy: 'Community Health Worker (CHW) Program',
    jurisdiction: 'Rwanda',
    jurisdictionCode: 'RWA',
    interventionYear: 2005,
    description: 'National CHW program: 45,000 elected village health workers providing basic care, referrals, and health education',
    sources: [
      'WHO Rwanda Country Profile',
      'Binagwaho et al (2014) BMJ Global Health',
      'World Bank DataBank',
    ],
    outcomes: [
      {
        metric: 'Under-5 Mortality Rate',
        unit: 'per 1000 live births',
        direction: 'lower',
        data: [
          { year: 2000, value: 196 },
          { year: 2002, value: 171 },
          { year: 2004, value: 142 },
          // Post CHW program
          { year: 2005, value: 128 },
          { year: 2006, value: 115 },
          { year: 2007, value: 103 },
          { year: 2008, value: 91 },
          { year: 2009, value: 80 },
          { year: 2010, value: 72 },
          { year: 2012, value: 58 },
          { year: 2014, value: 48 },
          { year: 2016, value: 42 },
          { year: 2018, value: 38 },
          { year: 2020, value: 35 },
        ],
      },
      {
        metric: 'Life Expectancy at Birth',
        unit: 'years',
        direction: 'higher',
        data: [
          { year: 2000, value: 48.0 },
          { year: 2002, value: 50.0 },
          { year: 2004, value: 53.0 },
          // Post
          { year: 2005, value: 55.0 },
          { year: 2006, value: 57.0 },
          { year: 2008, value: 60.0 },
          { year: 2010, value: 63.0 },
          { year: 2012, value: 65.0 },
          { year: 2014, value: 66.0 },
          { year: 2016, value: 67.0 },
          { year: 2018, value: 68.0 },
          { year: 2020, value: 69.0 },
        ],
      },
    ],
  },

  // ─── 8. Switzerland Supervised Injection Sites (1986) ───────────────────
  {
    policy: 'Supervised Drug Injection Facilities',
    jurisdiction: 'Switzerland',
    jurisdictionCode: 'CHE',
    interventionYear: 1986,
    description: 'Opened supervised injection rooms; heroin-assisted treatment (HAT) from 1994; 4-pillar drug policy',
    sources: [
      'Swiss Federal Office of Public Health',
      'EMCDDA Harm Reduction reports',
      'Nordt & Stohler (2006) Lancet',
    ],
    outcomes: [
      {
        metric: 'Drug Overdose Deaths',
        unit: 'deaths per year',
        direction: 'lower',
        data: [
          { year: 1985, value: 170 },
          // Post first injection site
          { year: 1987, value: 200 },
          { year: 1989, value: 280 },
          { year: 1991, value: 340 },
          { year: 1992, value: 419 }, // Peak
          // Post HAT program (1994)
          { year: 1994, value: 371 },
          { year: 1996, value: 252 },
          { year: 1998, value: 209 },
          { year: 2000, value: 196 },
          { year: 2002, value: 173 },
          { year: 2004, value: 180 },
          { year: 2006, value: 170 },
          { year: 2008, value: 142 },
          { year: 2010, value: 120 },
          { year: 2012, value: 121 },
          { year: 2014, value: 118 },
          { year: 2016, value: 151 },
          { year: 2018, value: 147 },
        ],
      },
      {
        metric: 'New HIV Infections Among Drug Users',
        unit: 'new cases per year',
        direction: 'lower',
        data: [
          { year: 1985, value: 1650 },
          { year: 1987, value: 1200 },
          { year: 1990, value: 1050 },
          { year: 1992, value: 800 },
          { year: 1994, value: 500 },
          { year: 1996, value: 350 },
          { year: 1998, value: 230 },
          { year: 2000, value: 200 },
          { year: 2002, value: 160 },
          { year: 2005, value: 120 },
          { year: 2008, value: 80 },
          { year: 2010, value: 55 },
          { year: 2015, value: 30 },
        ],
      },
    ],
  },

  // ─── 9. Costa Rica Universal Healthcare (1941+, EBAIS 1995) ─────────────
  {
    policy: 'Universal Healthcare (CCSS + EBAIS primary care)',
    jurisdiction: 'Costa Rica',
    jurisdictionCode: 'CRI',
    interventionYear: 1995, // EBAIS primary care expansion
    description: 'Universal coverage via CCSS since 1941; EBAIS community health teams from 1995 extended primary care nationwide',
    sources: [
      'WHO Global Health Observatory',
      'PAHO Country Profile — Costa Rica',
      'Pesec et al (2017) Health Affairs',
    ],
    outcomes: [
      {
        metric: 'Life Expectancy at Birth',
        unit: 'years',
        direction: 'higher',
        data: [
          { year: 1985, value: 74.0 },
          { year: 1990, value: 75.7 },
          // Post EBAIS
          { year: 1995, value: 76.2 },
          { year: 2000, value: 77.6 },
          { year: 2005, value: 78.6 },
          { year: 2010, value: 79.3 },
          { year: 2015, value: 79.6 },
          { year: 2019, value: 80.3 },
          { year: 2021, value: 77.0 }, // COVID
        ],
      },
      {
        metric: 'Health Spending as % GDP',
        unit: '% GDP',
        direction: 'lower',
        data: [
          { year: 1995, value: 6.8 },
          { year: 2000, value: 6.5 },
          { year: 2005, value: 7.0 },
          { year: 2010, value: 7.8 },
          { year: 2015, value: 7.6 },
          { year: 2019, value: 7.3 },
        ],
      },
    ],
  },

  // ─── 10. Uruguay Cannabis Legalization (2013) ───────────────────────────
  {
    policy: 'Cannabis Legalization and Regulation',
    jurisdiction: 'Uruguay',
    jurisdictionCode: 'URY',
    interventionYear: 2013,
    description: 'First country to fully legalize cannabis production, sale, and consumption under state regulation',
    sources: [
      'Junta Nacional de Drogas (Uruguay)',
      'Laqueur et al (2020) International Journal of Drug Policy',
      'Global Drug Policy Observatory',
    ],
    outcomes: [
      {
        metric: 'Cannabis Use Prevalence (15-65 age)',
        unit: '% of population',
        direction: 'lower', // Legalization aims to regulate, not increase use
        data: [
          { year: 2006, value: 5.3 },
          { year: 2009, value: 6.0 },
          { year: 2011, value: 8.3 },
          // Post legalization
          { year: 2014, value: 9.3 },
          { year: 2016, value: 9.3 },
          { year: 2018, value: 10.5 },
        ],
      },
      {
        metric: 'Drug-Related Arrests',
        unit: 'arrests per year',
        direction: 'lower',
        data: [
          { year: 2010, value: 7500 },
          { year: 2011, value: 8200 },
          { year: 2012, value: 8800 },
          // Post
          { year: 2013, value: 7200 },
          { year: 2014, value: 5600 },
          { year: 2015, value: 4800 },
          { year: 2016, value: 4200 },
          { year: 2017, value: 3800 },
        ],
      },
    ],
  },

  // ─── 11. South Korea Broadband Policy (1990s-2000s) ─────────────────────
  {
    policy: 'National Broadband Infrastructure Investment',
    jurisdiction: 'South Korea',
    jurisdictionCode: 'KOR',
    interventionYear: 1999,
    description: 'Cyber Korea 21 plan (1999): massive fiber investment, competition policy, digital literacy programs',
    sources: [
      'ITU World Telecommunication Indicators',
      'OECD Communications Outlook',
      'World Bank DataBank',
    ],
    outcomes: [
      {
        metric: 'Internet Penetration',
        unit: '% of population',
        direction: 'higher',
        data: [
          { year: 1995, value: 1.6 },
          { year: 1997, value: 6.8 },
          // Post Cyber Korea 21
          { year: 1999, value: 23.6 },
          { year: 2000, value: 44.7 },
          { year: 2001, value: 56.6 },
          { year: 2002, value: 59.4 },
          { year: 2004, value: 72.7 },
          { year: 2006, value: 78.1 },
          { year: 2008, value: 81.0 },
          { year: 2010, value: 83.7 },
          { year: 2015, value: 89.6 },
          { year: 2020, value: 96.5 },
        ],
      },
      {
        metric: 'GDP per Capita (PPP)',
        unit: 'USD',
        direction: 'higher',
        data: [
          { year: 1995, value: 13000 },
          { year: 1997, value: 14200 },
          { year: 1999, value: 14800 },
          { year: 2001, value: 17600 },
          { year: 2003, value: 19200 },
          { year: 2005, value: 22600 },
          { year: 2008, value: 27100 },
          { year: 2010, value: 29800 },
          { year: 2015, value: 37900 },
          { year: 2020, value: 42300 },
        ],
      },
    ],
  },

  // ─── 12. Denmark Cycling Infrastructure ─────────────────────────────────
  {
    policy: 'Urban Cycling Infrastructure Investment',
    jurisdiction: 'Denmark (Copenhagen)',
    jurisdictionCode: 'DNK',
    interventionYear: 2000, // Major expansion period
    description: 'Systematic investment in separated cycle tracks, bike bridges, green waves for cyclists',
    sources: [
      'City of Copenhagen Bicycle Account (biennial)',
      'Pucher & Buehler (2008) Transport Reviews',
      'Copenhagenize Index',
    ],
    outcomes: [
      {
        metric: 'Cycling Mode Share (Copenhagen)',
        unit: '% of commutes by bike',
        direction: 'higher',
        data: [
          { year: 1995, value: 30 },
          { year: 1998, value: 32 },
          // Post major investment
          { year: 2000, value: 34 },
          { year: 2002, value: 32 },
          { year: 2004, value: 36 },
          { year: 2006, value: 37 },
          { year: 2008, value: 37 },
          { year: 2010, value: 35 },
          { year: 2012, value: 36 },
          { year: 2014, value: 41 },
          { year: 2016, value: 41 },
          { year: 2018, value: 49 },
        ],
      },
      {
        metric: 'Cyclist Fatalities (Copenhagen)',
        unit: 'deaths per year',
        direction: 'lower',
        data: [
          { year: 1995, value: 15 },
          { year: 1998, value: 12 },
          { year: 2000, value: 11 },
          { year: 2002, value: 9 },
          { year: 2005, value: 6 },
          { year: 2008, value: 5 },
          { year: 2010, value: 5 },
          { year: 2012, value: 4 },
          { year: 2014, value: 2 },
          { year: 2016, value: 3 },
          { year: 2018, value: 1 },
        ],
      },
    ],
  },
];
