/**
 * OECD Direct Outcomes: Mapping spending categories to direct results
 *
 * Sources:
 * - OECD PISA (Education)
 * - UNODC / EMCDDA / CDC (Overdose)
 * - OECD Health Statistics (Preventable mortality)
 * - WIPO (Innovation/Patents)
 * - OECD (Poverty)
 * - UNODC (Crime/Homicide)
 * - World Bank (CO2)
 */

export interface OECDDirectOutcomeDataPoint {
  jurisdictionIso3: string;
  year: number;
  /** OECD PISA — reading+math+science average, every 3 years */
  pisaScoreAvg: number | null;
  /** Drug overdose deaths per 100k population */
  overdoseDeathsPer100k: number | null;
  /** Preventable (amenable) mortality per 100k */
  preventableDeathsPer100k: number | null;
  /** Patent applications per million people */
  patentsPerMillion: number | null;
  /** Poverty rate (50% median income threshold) */
  povertyRatePercent: number | null;
  /** Intentional homicide rate per 100k */
  crimeRatePer100k: number | null;
  /** CO2 emissions metric tons per capita */
  co2PerCapitaTons: number | null;
}

export const OECD_DIRECT_OUTCOMES: OECDDirectOutcomeDataPoint[] = [
  // USA
  { jurisdictionIso3: "USA", year: 2000, pisaScoreAvg: 493, overdoseDeathsPer100k: 6.2, preventableDeathsPer100k: 230, patentsPerMillion: 550, povertyRatePercent: 17.0, crimeRatePer100k: 5.5, co2PerCapitaTons: 20.4 },
  { jurisdictionIso3: "USA", year: 2003, pisaScoreAvg: 483, overdoseDeathsPer100k: 8.9, preventableDeathsPer100k: 220, patentsPerMillion: 600, povertyRatePercent: 17.5, crimeRatePer100k: 5.7, co2PerCapitaTons: 19.8 },
  { jurisdictionIso3: "USA", year: 2006, pisaScoreAvg: 489, overdoseDeathsPer100k: 11.5, preventableDeathsPer100k: 210, patentsPerMillion: 700, povertyRatePercent: 18.0, crimeRatePer100k: 5.8, co2PerCapitaTons: 19.1 },
  { jurisdictionIso3: "USA", year: 2009, pisaScoreAvg: 493, overdoseDeathsPer100k: 12.1, preventableDeathsPer100k: 200, patentsPerMillion: 750, povertyRatePercent: 17.3, crimeRatePer100k: 5.0, co2PerCapitaTons: 17.2 },
  { jurisdictionIso3: "USA", year: 2012, pisaScoreAvg: 492, overdoseDeathsPer100k: 13.2, preventableDeathsPer100k: 190, patentsPerMillion: 900, povertyRatePercent: 18.0, crimeRatePer100k: 4.7, co2PerCapitaTons: 16.3 },
  { jurisdictionIso3: "USA", year: 2015, pisaScoreAvg: 492, overdoseDeathsPer100k: 16.3, preventableDeathsPer100k: 185, patentsPerMillion: 950, povertyRatePercent: 16.8, crimeRatePer100k: 4.9, co2PerCapitaTons: 15.5 },
  { jurisdictionIso3: "USA", year: 2018, pisaScoreAvg: 495, overdoseDeathsPer100k: 20.6, preventableDeathsPer100k: 180, patentsPerMillion: 980, povertyRatePercent: 18.0, crimeRatePer100k: 5.0, co2PerCapitaTons: 14.8 },
  { jurisdictionIso3: "USA", year: 2022, pisaScoreAvg: 489, overdoseDeathsPer100k: 32.6, preventableDeathsPer100k: 190, patentsPerMillion: 1000, povertyRatePercent: 15.1, crimeRatePer100k: 6.3, co2PerCapitaTons: 13.5 },

  // GBR
  { jurisdictionIso3: "GBR", year: 2000, pisaScoreAvg: 523, overdoseDeathsPer100k: 3.5, preventableDeathsPer100k: 170, patentsPerMillion: 350, povertyRatePercent: 11.0, crimeRatePer100k: 1.5, co2PerCapitaTons: 9.5 },
  { jurisdictionIso3: "GBR", year: 2003, pisaScoreAvg: 500, overdoseDeathsPer100k: 3.8, preventableDeathsPer100k: 160, patentsPerMillion: 360, povertyRatePercent: 11.5, crimeRatePer100k: 1.6, co2PerCapitaTons: 9.3 },
  { jurisdictionIso3: "GBR", year: 2006, pisaScoreAvg: 496, overdoseDeathsPer100k: 4.0, preventableDeathsPer100k: 150, patentsPerMillion: 370, povertyRatePercent: 11.2, crimeRatePer100k: 1.4, co2PerCapitaTons: 9.0 },
  { jurisdictionIso3: "GBR", year: 2009, pisaScoreAvg: 494, overdoseDeathsPer100k: 4.5, preventableDeathsPer100k: 140, patentsPerMillion: 380, povertyRatePercent: 11.0, crimeRatePer100k: 1.2, co2PerCapitaTons: 7.8 },
  { jurisdictionIso3: "GBR", year: 2012, pisaScoreAvg: 498, overdoseDeathsPer100k: 5.0, preventableDeathsPer100k: 130, patentsPerMillion: 390, povertyRatePercent: 10.8, crimeRatePer100k: 1.0, co2PerCapitaTons: 7.2 },
  { jurisdictionIso3: "GBR", year: 2015, pisaScoreAvg: 500, overdoseDeathsPer100k: 6.5, preventableDeathsPer100k: 125, patentsPerMillion: 400, povertyRatePercent: 11.1, crimeRatePer100k: 0.9, co2PerCapitaTons: 6.2 },
  { jurisdictionIso3: "GBR", year: 2018, pisaScoreAvg: 503, overdoseDeathsPer100k: 7.5, preventableDeathsPer100k: 120, patentsPerMillion: 410, povertyRatePercent: 11.7, crimeRatePer100k: 1.2, co2PerCapitaTons: 5.5 },
  { jurisdictionIso3: "GBR", year: 2022, pisaScoreAvg: 498, overdoseDeathsPer100k: 7.9, preventableDeathsPer100k: 118, patentsPerMillion: 420, povertyRatePercent: 11.2, crimeRatePer100k: 1.1, co2PerCapitaTons: 4.8 },

  // FRA
  { jurisdictionIso3: "FRA", year: 2000, pisaScoreAvg: 510, overdoseDeathsPer100k: 0.5, preventableDeathsPer100k: 140, patentsPerMillion: 250, povertyRatePercent: 7.5, crimeRatePer100k: 1.0, co2PerCapitaTons: 6.5 },
  { jurisdictionIso3: "FRA", year: 2018, pisaScoreAvg: 494, overdoseDeathsPer100k: 1.2, preventableDeathsPer100k: 110, patentsPerMillion: 280, povertyRatePercent: 8.5, crimeRatePer100k: 1.2, co2PerCapitaTons: 4.5 },
  
  // DEU
  { jurisdictionIso3: "DEU", year: 2000, pisaScoreAvg: 484, overdoseDeathsPer100k: 2.0, preventableDeathsPer100k: 150, patentsPerMillion: 800, povertyRatePercent: 9.0, crimeRatePer100k: 1.1, co2PerCapitaTons: 10.5 },
  { jurisdictionIso3: "DEU", year: 2018, pisaScoreAvg: 500, overdoseDeathsPer100k: 1.8, preventableDeathsPer100k: 120, patentsPerMillion: 900, povertyRatePercent: 10.5, crimeRatePer100k: 0.9, co2PerCapitaTons: 8.5 },

  // JPN
  { jurisdictionIso3: "JPN", year: 2000, pisaScoreAvg: 520, overdoseDeathsPer100k: 0.1, preventableDeathsPer100k: 100, patentsPerMillion: 2500, povertyRatePercent: 15.0, crimeRatePer100k: 0.5, co2PerCapitaTons: 9.6 },
  { jurisdictionIso3: "JPN", year: 2018, pisaScoreAvg: 520, overdoseDeathsPer100k: 0.1, preventableDeathsPer100k: 80, patentsPerMillion: 2800, povertyRatePercent: 15.7, crimeRatePer100k: 0.2, co2PerCapitaTons: 8.5 },

  // CAN
  { jurisdictionIso3: "CAN", year: 2000, pisaScoreAvg: 529, overdoseDeathsPer100k: 3.0, preventableDeathsPer100k: 150, patentsPerMillion: 150, povertyRatePercent: 12.0, crimeRatePer100k: 1.8, co2PerCapitaTons: 17.5 },
  { jurisdictionIso3: "CAN", year: 2018, pisaScoreAvg: 512, overdoseDeathsPer100k: 12.0, preventableDeathsPer100k: 130, patentsPerMillion: 160, povertyRatePercent: 11.5, crimeRatePer100k: 1.8, co2PerCapitaTons: 15.5 },

  // AUS
  { jurisdictionIso3: "AUS", year: 2000, pisaScoreAvg: 520, overdoseDeathsPer100k: 5.0, preventableDeathsPer100k: 140, patentsPerMillion: 120, povertyRatePercent: 13.0, crimeRatePer100k: 1.9, co2PerCapitaTons: 18.0 },
  { jurisdictionIso3: "AUS", year: 2018, pisaScoreAvg: 499, overdoseDeathsPer100k: 6.5, preventableDeathsPer100k: 110, patentsPerMillion: 130, povertyRatePercent: 12.5, crimeRatePer100k: 0.9, co2PerCapitaTons: 15.5 },

  // NLD
  { jurisdictionIso3: "NLD", year: 2018, pisaScoreAvg: 495, overdoseDeathsPer100k: 1.3, preventableDeathsPer100k: 105, patentsPerMillion: 450, povertyRatePercent: 7.8, crimeRatePer100k: 0.6, co2PerCapitaTons: 9.0 },

  // SWE
  { jurisdictionIso3: "SWE", year: 2018, pisaScoreAvg: 502, overdoseDeathsPer100k: 8.0, preventableDeathsPer100k: 90, patentsPerMillion: 600, povertyRatePercent: 7.5, crimeRatePer100k: 1.1, co2PerCapitaTons: 3.5 },

  // NOR
  { jurisdictionIso3: "NOR", year: 2018, pisaScoreAvg: 499, overdoseDeathsPer100k: 5.5, preventableDeathsPer100k: 95, patentsPerMillion: 300, povertyRatePercent: 8.0, crimeRatePer100k: 0.5, co2PerCapitaTons: 7.5 },
  
  // DNK
  { jurisdictionIso3: "DNK", year: 2018, pisaScoreAvg: 501, overdoseDeathsPer100k: 4.5, preventableDeathsPer100k: 100, patentsPerMillion: 550, povertyRatePercent: 6.0, crimeRatePer100k: 0.8, co2PerCapitaTons: 5.5 },
  
  // FIN
  { jurisdictionIso3: "FIN", year: 2018, pisaScoreAvg: 516, overdoseDeathsPer100k: 4.0, preventableDeathsPer100k: 105, patentsPerMillion: 600, povertyRatePercent: 6.5, crimeRatePer100k: 1.6, co2PerCapitaTons: 8.0 },
  
  // KOR
  { jurisdictionIso3: "KOR", year: 2018, pisaScoreAvg: 519, overdoseDeathsPer100k: 0.05, preventableDeathsPer100k: 90, patentsPerMillion: 3000, povertyRatePercent: 16.0, crimeRatePer100k: 0.6, co2PerCapitaTons: 12.0 },
  
  // ISR
  { jurisdictionIso3: "ISR", year: 2018, pisaScoreAvg: 467, overdoseDeathsPer100k: 2.0, preventableDeathsPer100k: 95, patentsPerMillion: 500, povertyRatePercent: 17.0, crimeRatePer100k: 1.5, co2PerCapitaTons: 8.5 },
  
  // EST
  { jurisdictionIso3: "EST", year: 2018, pisaScoreAvg: 525, overdoseDeathsPer100k: 8.5, preventableDeathsPer100k: 160, patentsPerMillion: 200, povertyRatePercent: 15.0, crimeRatePer100k: 2.0, co2PerCapitaTons: 12.0 },

  // Fillers for missing years/countries with nulls to maintain structure if needed, 
  // but for now providing key data points that illustrate the trends.
  // The consumer of this data should handle sparse data gracefully.
];

// Note: This dataset is a representative sample. Full implementation would include
// all annual data points for all 23 countries where available.
