// ============================================================================
// Prisma Seed Script — Optomitron
// ============================================================================
// Seeds: Units, VariableCategories, GlobalVariables, Jurisdictions, Items
// Run: npx prisma db seed (or: npx tsx prisma/seed.ts)
// ============================================================================

import {
  PrismaClient,
  CombinationOperation,
  FillingType,
  Valence,
  MeasurementScale,
  JurisdictionType,
  type Prisma,
} from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helper: upsert by unique "name" (or "code" for jurisdictions)
// ---------------------------------------------------------------------------

async function upsertUnit(data: Prisma.UnitUncheckedCreateInput) {
  return prisma.unit.upsert({
    where: { name: data.name },
    update: data,
    create: data,
  });
}

async function upsertVariableCategory(data: Prisma.VariableCategoryUncheckedCreateInput) {
  return prisma.variableCategory.upsert({
    where: { name: data.name },
    update: data,
    create: data,
  });
}

async function upsertGlobalVariable(data: Prisma.GlobalVariableUncheckedCreateInput) {
  return prisma.globalVariable.upsert({
    where: { name: data.name },
    update: data,
    create: data,
  });
}

async function upsertJurisdiction(data: Prisma.JurisdictionUncheckedCreateInput) {
  return prisma.jurisdiction.upsert({
    where: { code: data.code! },
    update: data,
    create: data,
  });
}

// ============================================================================
// A) UNITS (~30)
// ============================================================================

async function seedUnits() {
  console.log("🔧 Seeding units...");

  const units: Prisma.UnitUncheckedCreateInput[] = [
    // Weight
    { name: "Milligrams", abbreviatedName: "mg", unitCategoryId: "Weight", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Grams", abbreviatedName: "g", unitCategoryId: "Weight", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Kilograms", abbreviatedName: "kg", unitCategoryId: "Weight", scale: MeasurementScale.RATIO, fillingType: FillingType.NONE, manualTracking: true },
    { name: "Ounces", abbreviatedName: "oz", unitCategoryId: "Weight", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Pounds", abbreviatedName: "lb", unitCategoryId: "Weight", scale: MeasurementScale.RATIO, fillingType: FillingType.NONE, manualTracking: true },

    // Volume
    { name: "Milliliters", abbreviatedName: "mL", unitCategoryId: "Volume", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Liters", abbreviatedName: "L", unitCategoryId: "Volume", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Fluid Ounces", abbreviatedName: "fl oz", unitCategoryId: "Volume", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Cups", abbreviatedName: "cups", unitCategoryId: "Volume", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },

    // Count
    { name: "Count", abbreviatedName: "count", unitCategoryId: "Count", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Servings", abbreviatedName: "servings", unitCategoryId: "Count", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Doses", abbreviatedName: "doses", unitCategoryId: "Count", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Tablets", abbreviatedName: "tablets", unitCategoryId: "Count", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Capsules", abbreviatedName: "capsules", unitCategoryId: "Count", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },

    // Rating
    { name: "1 to 5 Rating", abbreviatedName: "1-5", unitCategoryId: "Rating", scale: MeasurementScale.ORDINAL, fillingType: FillingType.NONE, manualTracking: true, minimumValue: 1, maximumValue: 5 },
    { name: "1 to 10 Rating", abbreviatedName: "1-10", unitCategoryId: "Rating", scale: MeasurementScale.ORDINAL, fillingType: FillingType.NONE, manualTracking: true, minimumValue: 1, maximumValue: 10 },
    { name: "Percent", abbreviatedName: "%", unitCategoryId: "Rating", scale: MeasurementScale.RATIO, fillingType: FillingType.NONE, manualTracking: true, minimumValue: 0, maximumValue: 100 },

    // Currency
    { name: "US Dollars", abbreviatedName: "USD", unitCategoryId: "Currency", scale: MeasurementScale.RATIO, fillingType: FillingType.NONE, manualTracking: true },
    { name: "Euros", abbreviatedName: "EUR", unitCategoryId: "Currency", scale: MeasurementScale.RATIO, fillingType: FillingType.NONE, manualTracking: true },
    { name: "British Pounds", abbreviatedName: "GBP", unitCategoryId: "Currency", scale: MeasurementScale.RATIO, fillingType: FillingType.NONE, manualTracking: true },

    // Duration
    { name: "Seconds", abbreviatedName: "s", unitCategoryId: "Duration", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Minutes", abbreviatedName: "min", unitCategoryId: "Duration", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Hours", abbreviatedName: "h", unitCategoryId: "Duration", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },

    // Other
    { name: "International Units", abbreviatedName: "IU", unitCategoryId: "Count", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Micrograms", abbreviatedName: "mcg", unitCategoryId: "Weight", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Calories", abbreviatedName: "kcal", unitCategoryId: "Energy", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Steps", abbreviatedName: "steps", unitCategoryId: "Count", scale: MeasurementScale.RATIO, fillingType: FillingType.ZERO, manualTracking: true },
    { name: "Beats Per Minute", abbreviatedName: "bpm", unitCategoryId: "Frequency", scale: MeasurementScale.RATIO, fillingType: FillingType.NONE, manualTracking: false },
    { name: "Yes/No", abbreviatedName: "yes/no", unitCategoryId: "Rating", scale: MeasurementScale.NOMINAL, fillingType: FillingType.ZERO, manualTracking: true, minimumValue: 0, maximumValue: 1 },
    { name: "Millimeters of Mercury", abbreviatedName: "mmHg", unitCategoryId: "Pressure", scale: MeasurementScale.RATIO, fillingType: FillingType.NONE, manualTracking: true },
    { name: "Degrees Fahrenheit", abbreviatedName: "°F", unitCategoryId: "Temperature", scale: MeasurementScale.INTERVAL, fillingType: FillingType.NONE, manualTracking: true },
  ];

  const created: Record<string, string> = {};
  for (const u of units) {
    const row = await upsertUnit(u);
    created[u.abbreviatedName] = row.id;
  }
  console.log(`  ✅ ${Object.keys(created).length} units`);
  return created;
}

// ============================================================================
// B) VARIABLE CATEGORIES (~15)
// ============================================================================

async function seedVariableCategories(unitMap: Record<string, string>) {
  console.log("📂 Seeding variable categories...");

  const categories = [
    { name: "Treatment",    description: "Medications, supplements, and other treatments",  combinationOperation: CombinationOperation.SUM,  onsetDelay: 1800,   durationOfAction: 86400,  predictorOnly: true,  outcome: false, defaultUnitAbbr: "mg" },
    { name: "Supplement",   description: "Dietary supplements and vitamins",                combinationOperation: CombinationOperation.SUM,  onsetDelay: 1800,   durationOfAction: 86400,  predictorOnly: true,  outcome: false, defaultUnitAbbr: "mg" },
    { name: "Food",         description: "Foods and dietary intake",                        combinationOperation: CombinationOperation.SUM,  onsetDelay: 1800,   durationOfAction: 86400,  predictorOnly: true,  outcome: false, defaultUnitAbbr: "servings" },
    { name: "Drink",        description: "Beverages and fluid intake",                      combinationOperation: CombinationOperation.SUM,  onsetDelay: 1800,   durationOfAction: 86400,  predictorOnly: true,  outcome: false, defaultUnitAbbr: "servings" },
    { name: "Activity",     description: "General activities and behaviors",                combinationOperation: CombinationOperation.SUM,  onsetDelay: 0,      durationOfAction: 86400,  predictorOnly: true,  outcome: false, defaultUnitAbbr: "min" },
    { name: "Exercise",     description: "Physical exercise and workouts",                  combinationOperation: CombinationOperation.SUM,  onsetDelay: 0,      durationOfAction: 86400,  predictorOnly: true,  outcome: false, defaultUnitAbbr: "min" },
    { name: "Sleep",        description: "Sleep duration and quality",                      combinationOperation: CombinationOperation.SUM,  onsetDelay: 0,      durationOfAction: 86400,  predictorOnly: false, outcome: true,  defaultUnitAbbr: "h" },
    { name: "Symptom",      description: "Physical and mental symptoms",                    combinationOperation: CombinationOperation.MEAN, onsetDelay: 0,      durationOfAction: 86400,  predictorOnly: false, outcome: true,  defaultUnitAbbr: "1-5" },
    { name: "Emotion",      description: "Emotional states and mood",                       combinationOperation: CombinationOperation.MEAN, onsetDelay: 0,      durationOfAction: 86400,  predictorOnly: false, outcome: true,  defaultUnitAbbr: "1-5" },
    { name: "Vital Sign",   description: "Physiological measurements",                     combinationOperation: CombinationOperation.MEAN, onsetDelay: 0,      durationOfAction: 86400,  predictorOnly: false, outcome: true,  defaultUnitAbbr: "count" },
    { name: "Lab Result",   description: "Laboratory test results",                         combinationOperation: CombinationOperation.MEAN, onsetDelay: 0,      durationOfAction: 604800, predictorOnly: false, outcome: true,  defaultUnitAbbr: "count" },
    { name: "Environment",  description: "Environmental factors (weather, air quality)",     combinationOperation: CombinationOperation.MEAN, onsetDelay: 0,      durationOfAction: 86400,  predictorOnly: true,  outcome: false, defaultUnitAbbr: "count" },
    { name: "Economic",     description: "Economic indicators and financial metrics",        combinationOperation: CombinationOperation.MEAN, onsetDelay: 0,      durationOfAction: 2592000,predictorOnly: false, outcome: true,  defaultUnitAbbr: "USD" },
    { name: "Policy",       description: "Government policies and regulations",              combinationOperation: CombinationOperation.MEAN, onsetDelay: 2592000,durationOfAction: 31536000,predictorOnly: true, outcome: false, defaultUnitAbbr: "count" },
    { name: "Goal",         description: "Personal goals and targets",                       combinationOperation: CombinationOperation.MEAN, onsetDelay: 0,      durationOfAction: 86400,  predictorOnly: false, outcome: true,  defaultUnitAbbr: "%" },
  ];

  const created: Record<string, string> = {};
  for (const c of categories) {
    const { defaultUnitAbbr, ...rest } = c;
    const row = await upsertVariableCategory({
      ...rest,
      defaultUnitId: unitMap[defaultUnitAbbr] || undefined,
    });
    created[c.name] = row.id;
  }
  console.log(`  ✅ ${Object.keys(created).length} variable categories`);
  return created;
}

// ============================================================================
// C) GLOBAL VARIABLES (~50)
// ============================================================================

async function seedGlobalVariables(
  unitMap: Record<string, string>,
  catMap: Record<string, string>,
) {
  console.log("🌐 Seeding global variables...");

  // Helper to shorten definitions
  type VarDef = {
    name: string;
    description?: string;
    category: string;
    unit: string;
    combinationOperation?: CombinationOperation;
    onsetDelay?: number;
    durationOfAction?: number;
    predictorOnly?: boolean;
    outcome?: boolean;
    valence?: Valence;
    minimumAllowedValue?: number;
    maximumAllowedValue?: number;
    synonyms?: string;
  };

  const variables: VarDef[] = [
    // ---- Treatments ----
    { name: "Vitamin D",        category: "Supplement", unit: "IU",      combinationOperation: CombinationOperation.SUM,  onsetDelay: 1800,  durationOfAction: 86400,  predictorOnly: true, outcome: false, valence: Valence.POSITIVE, synonyms: "cholecalciferol,D3" },
    { name: "Omega-3",          category: "Supplement", unit: "mg",      combinationOperation: CombinationOperation.SUM,  onsetDelay: 1800,  durationOfAction: 86400,  predictorOnly: true, outcome: false, valence: Valence.POSITIVE, synonyms: "fish oil,EPA,DHA" },
    { name: "Magnesium",        category: "Supplement", unit: "mg",      combinationOperation: CombinationOperation.SUM,  onsetDelay: 1800,  durationOfAction: 86400,  predictorOnly: true, outcome: false, valence: Valence.POSITIVE },
    { name: "Melatonin",        category: "Supplement", unit: "mg",      combinationOperation: CombinationOperation.SUM,  onsetDelay: 1800,  durationOfAction: 28800,  predictorOnly: true, outcome: false, valence: Valence.POSITIVE },
    { name: "Caffeine",         category: "Treatment",  unit: "mg",      combinationOperation: CombinationOperation.SUM,  onsetDelay: 900,   durationOfAction: 21600,  predictorOnly: true, outcome: false, valence: Valence.NEUTRAL,  synonyms: "coffee,tea,energy drink" },
    { name: "Ibuprofen",        category: "Treatment",  unit: "mg",      combinationOperation: CombinationOperation.SUM,  onsetDelay: 1800,  durationOfAction: 21600,  predictorOnly: true, outcome: false, valence: Valence.POSITIVE, synonyms: "Advil,Motrin" },
    { name: "Aspirin",          category: "Treatment",  unit: "mg",      combinationOperation: CombinationOperation.SUM,  onsetDelay: 1800,  durationOfAction: 14400,  predictorOnly: true, outcome: false, valence: Valence.POSITIVE },
    { name: "Acetaminophen",    category: "Treatment",  unit: "mg",      combinationOperation: CombinationOperation.SUM,  onsetDelay: 1800,  durationOfAction: 21600,  predictorOnly: true, outcome: false, valence: Valence.POSITIVE, synonyms: "Tylenol,paracetamol" },

    // ---- Symptoms ----
    { name: "Headache Severity",   category: "Symptom", unit: "1-5",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEGATIVE },
    { name: "Fatigue",             category: "Symptom", unit: "1-5",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEGATIVE },
    { name: "Anxiety",             category: "Symptom", unit: "1-5",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEGATIVE },
    { name: "Depression Severity", category: "Symptom", unit: "1-5",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEGATIVE },
    { name: "Pain",                category: "Symptom", unit: "1-5",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEGATIVE },
    { name: "Nausea",              category: "Symptom", unit: "1-5",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEGATIVE },
    { name: "Insomnia Severity",   category: "Symptom", unit: "1-5",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEGATIVE },
    { name: "Brain Fog",           category: "Symptom", unit: "1-5",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEGATIVE },

    // ---- Emotions ----
    { name: "Overall Mood",     category: "Emotion", unit: "1-5",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.POSITIVE },
    { name: "Energy Level",     category: "Emotion", unit: "1-5",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.POSITIVE },
    { name: "Motivation",       category: "Emotion", unit: "1-5",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.POSITIVE },
    { name: "Stress Level",     category: "Emotion", unit: "1-5",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEGATIVE },
    { name: "Happiness",        category: "Emotion", unit: "1-5",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.POSITIVE },

    // ---- Vital Signs ----
    { name: "Heart Rate",         category: "Vital Sign", unit: "bpm",  combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEUTRAL, minimumAllowedValue: 30, maximumAllowedValue: 220 },
    { name: "Blood Pressure Systolic",  category: "Vital Sign", unit: "mmHg", combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEGATIVE, minimumAllowedValue: 60, maximumAllowedValue: 300, synonyms: "systolic,SBP" },
    { name: "Blood Pressure Diastolic", category: "Vital Sign", unit: "mmHg", combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEGATIVE, minimumAllowedValue: 30, maximumAllowedValue: 200, synonyms: "diastolic,DBP" },
    { name: "Body Weight",        category: "Vital Sign", unit: "lb",   combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEUTRAL, minimumAllowedValue: 1, maximumAllowedValue: 1000 },
    { name: "Body Temperature",   category: "Vital Sign", unit: "°F",   combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.NEUTRAL, minimumAllowedValue: 90, maximumAllowedValue: 115 },
    { name: "Sleep Duration",     category: "Sleep",      unit: "h",    combinationOperation: CombinationOperation.SUM,  predictorOnly: false, outcome: true, valence: Valence.POSITIVE, minimumAllowedValue: 0, maximumAllowedValue: 24 },
    { name: "Daily Step Count",   category: "Vital Sign", unit: "steps",combinationOperation: CombinationOperation.SUM,  predictorOnly: false, outcome: true, valence: Valence.POSITIVE, minimumAllowedValue: 0, maximumAllowedValue: 100000 },
    { name: "Blood Oxygen Saturation", category: "Vital Sign", unit: "%", combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.POSITIVE, minimumAllowedValue: 50, maximumAllowedValue: 100, synonyms: "SpO2,O2 sat" },

    // ---- Foods / Drinks ----
    { name: "Coffee",             category: "Drink", unit: "servings",  combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.NEUTRAL },
    { name: "Alcohol",            category: "Drink", unit: "servings",  combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.NEGATIVE, synonyms: "beer,wine,spirits,drinks" },
    { name: "Sugar Intake",       category: "Food",  unit: "g",         combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.NEGATIVE },
    { name: "Processed Food",     category: "Food",  unit: "servings",  combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.NEGATIVE },
    { name: "Vegetable Intake",   category: "Food",  unit: "servings",  combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.POSITIVE },
    { name: "Water Intake",       category: "Drink", unit: "mL",        combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.POSITIVE },
    { name: "Caloric Intake",     category: "Food",  unit: "kcal",      combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.NEUTRAL },
    { name: "Protein Intake",     category: "Food",  unit: "g",         combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.POSITIVE },
    { name: "Fiber Intake",       category: "Food",  unit: "g",         combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.POSITIVE },

    // ---- Activities ----
    { name: "Exercise Duration",  category: "Exercise", unit: "min",  combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.POSITIVE },
    { name: "Meditation",         category: "Activity", unit: "min",  combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.POSITIVE },
    { name: "Screen Time",        category: "Activity", unit: "h",    combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.NEGATIVE },
    { name: "Time Outdoors",      category: "Activity", unit: "min",  combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.POSITIVE },
    { name: "Social Interaction", category: "Activity", unit: "min",  combinationOperation: CombinationOperation.SUM, predictorOnly: true, outcome: false, valence: Valence.POSITIVE },

    // ---- Environment ----
    { name: "Outdoor Temperature",category: "Environment", unit: "°F",   combinationOperation: CombinationOperation.MEAN, predictorOnly: true, outcome: false, valence: Valence.NEUTRAL },
    { name: "Air Quality Index",  category: "Environment", unit: "count",combinationOperation: CombinationOperation.MEAN, predictorOnly: true, outcome: false, valence: Valence.NEGATIVE, minimumAllowedValue: 0, maximumAllowedValue: 500, synonyms: "AQI" },

    // ---- Economic ----
    { name: "Daily Spending",     category: "Economic", unit: "USD", combinationOperation: CombinationOperation.SUM,  predictorOnly: true, outcome: false, valence: Valence.NEUTRAL },
    { name: "Income",             category: "Economic", unit: "USD", combinationOperation: CombinationOperation.SUM,  predictorOnly: false, outcome: true, valence: Valence.POSITIVE },

    // ---- Goals ----
    { name: "Goal Progress",      category: "Goal", unit: "%",   combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.POSITIVE, minimumAllowedValue: 0, maximumAllowedValue: 100 },
    { name: "Productivity Rating",category: "Goal", unit: "1-10",combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.POSITIVE },
    { name: "Life Satisfaction",   category: "Goal", unit: "1-10",combinationOperation: CombinationOperation.MEAN, predictorOnly: false, outcome: true, valence: Valence.POSITIVE },
  ];

  let count = 0;
  for (const v of variables) {
    const categoryId = catMap[v.category];
    const unitId = unitMap[v.unit];
    if (!categoryId) {
      console.warn(`  ⚠️  Unknown category "${v.category}" for variable "${v.name}" — skipping`);
      continue;
    }
    if (!unitId) {
      console.warn(`  ⚠️  Unknown unit "${v.unit}" for variable "${v.name}" — skipping`);
      continue;
    }
    await upsertGlobalVariable({
      name: v.name,
      description: v.description,
      variableCategoryId: categoryId,
      defaultUnitId: unitId,
      combinationOperation: v.combinationOperation,
      onsetDelay: v.onsetDelay,
      durationOfAction: v.durationOfAction,
      predictorOnly: v.predictorOnly,
      outcome: v.outcome,
      valence: v.valence,
      minimumAllowedValue: v.minimumAllowedValue,
      maximumAllowedValue: v.maximumAllowedValue,
      synonyms: v.synonyms,
    });
    count++;
  }
  console.log(`  ✅ ${count} global variables`);
}

// ============================================================================
// D) JURISDICTIONS — US Federal + 50 States
// ============================================================================

async function seedJurisdictions() {
  console.log("🏛️  Seeding jurisdictions...");

  // Federal
  const us = await upsertJurisdiction({
    name: "United States",
    type: JurisdictionType.COUNTRY,
    code: "US",
    currency: "USD",
    population: 335_000_000,
  });

  // 50 states: [name, FIPS code, approx 2024 population]
  const states: [string, string, number][] = [
    ["Alabama",        "US-AL", 5_108_000],
    ["Alaska",         "US-AK",   733_000],
    ["Arizona",        "US-AZ", 7_431_000],
    ["Arkansas",       "US-AR", 3_067_000],
    ["California",     "US-CA", 38_965_000],
    ["Colorado",       "US-CO", 5_912_000],
    ["Connecticut",    "US-CT", 3_617_000],
    ["Delaware",       "US-DE", 1_018_000],
    ["Florida",        "US-FL", 22_611_000],
    ["Georgia",        "US-GA", 11_029_000],
    ["Hawaii",         "US-HI", 1_435_000],
    ["Idaho",          "US-ID", 2_001_000],
    ["Illinois",       "US-IL", 12_550_000],
    ["Indiana",        "US-IN", 6_862_000],
    ["Iowa",           "US-IA", 3_207_000],
    ["Kansas",         "US-KS", 2_940_000],
    ["Kentucky",       "US-KY", 4_526_000],
    ["Louisiana",      "US-LA", 4_573_000],
    ["Maine",          "US-ME", 1_395_000],
    ["Maryland",       "US-MD", 6_180_000],
    ["Massachusetts",  "US-MA", 7_001_000],
    ["Michigan",       "US-MI", 10_037_000],
    ["Minnesota",      "US-MN", 5_737_000],
    ["Mississippi",    "US-MS", 2_939_000],
    ["Missouri",       "US-MO", 6_196_000],
    ["Montana",        "US-MT", 1_133_000],
    ["Nebraska",       "US-NE", 1_978_000],
    ["Nevada",         "US-NV", 3_194_000],
    ["New Hampshire",  "US-NH", 1_402_000],
    ["New Jersey",     "US-NJ", 9_290_000],
    ["New Mexico",     "US-NM", 2_114_000],
    ["New York",       "US-NY", 19_572_000],
    ["North Carolina", "US-NC", 10_835_000],
    ["North Dakota",   "US-ND",   783_000],
    ["Ohio",           "US-OH", 11_785_000],
    ["Oklahoma",       "US-OK", 4_053_000],
    ["Oregon",         "US-OR", 4_233_000],
    ["Pennsylvania",   "US-PA", 12_962_000],
    ["Rhode Island",   "US-RI", 1_095_000],
    ["South Carolina", "US-SC", 5_373_000],
    ["South Dakota",   "US-SD",   919_000],
    ["Tennessee",      "US-TN", 7_126_000],
    ["Texas",          "US-TX", 30_503_000],
    ["Utah",           "US-UT", 3_418_000],
    ["Vermont",        "US-VT",   647_000],
    ["Virginia",       "US-VA", 8_643_000],
    ["Washington",     "US-WA", 7_812_000],
    ["West Virginia",  "US-WV", 1_770_000],
    ["Wisconsin",      "US-WI", 5_893_000],
    ["Wyoming",        "US-WY",   584_000],
  ];

  for (const [name, code, population] of states) {
    await upsertJurisdiction({
      name,
      type: JurisdictionType.STATE,
      code,
      parentId: us.id,
      currency: "USD",
      population,
    });
  }

  console.log(`  ✅ 1 country + ${states.length} states`);
  return us.id;
}

// ============================================================================
// E) ITEMS — Federal Budget Categories (FY2025 approximate)
// ============================================================================

async function seedBudgetItems(usJurisdictionId: string) {
  console.log("💰 Seeding federal budget items...");

  // FY2025 estimated total spending: ~$6.75 trillion
  const totalBudgetUsd = 6_750_000_000_000;

  // Source: CBO FY2025 projections, OMB Historical Tables, USASpending.gov
  // Percentages are approximate shares of total federal spending
  const budgetItems: {
    name: string;
    description: string;
    category: string;
    pct: number;
  }[] = [
    { name: "Social Security",                description: "Old-Age, Survivors, and Disability Insurance (OASDI)",                                  category: "Mandatory",    pct: 21.0 },
    { name: "Medicare",                       description: "Health insurance for seniors and disabled (Parts A, B, D)",                              category: "Mandatory",    pct: 13.0 },
    { name: "National Defense",               description: "Department of Defense and nuclear weapons activities",                                   category: "Discretionary",pct: 13.0 },
    { name: "Net Interest",                   description: "Interest payments on the national debt",                                                category: "Mandatory",    pct: 13.0 },
    { name: "Medicaid",                       description: "Health coverage for low-income individuals and families",                                category: "Mandatory",    pct: 9.0  },
    { name: "Income Security",                description: "SNAP, SSI, EITC, unemployment, housing assistance, child nutrition",                    category: "Mandatory",    pct: 6.0  },
    { name: "Health (Other)",                 description: "NIH, CDC, FDA, SAMHSA, Indian Health Service, other health programs",                   category: "Discretionary",pct: 3.0  },
    { name: "Veterans Benefits & Services",   description: "VA healthcare, disability compensation, pensions, education benefits",                   category: "Discretionary",pct: 3.5  },
    { name: "Education",                      description: "K-12 grants, Pell grants, student loans, special education",                            category: "Discretionary",pct: 2.5  },
    { name: "Transportation",                 description: "Federal highways, FAA, Amtrak, transit grants",                                         category: "Discretionary",pct: 1.5  },
    { name: "International Affairs",          description: "State Department, USAID, foreign aid, embassies",                                       category: "Discretionary",pct: 1.0  },
    { name: "Science, Space & Technology",    description: "NASA, NSF, DOE Office of Science, NOAA",                                               category: "Discretionary",pct: 1.0  },
    { name: "Administration of Justice",      description: "FBI, DEA, federal courts, Bureau of Prisons, ATF",                                     category: "Discretionary",pct: 1.0  },
    { name: "Natural Resources & Environment",description: "EPA, national parks, Forest Service, water infrastructure, clean energy",               category: "Discretionary",pct: 0.8  },
    { name: "Agriculture",                    description: "Farm subsidies, crop insurance, conservation, rural development",                       category: "Mandatory",    pct: 0.7  },
    { name: "Community & Regional Development",description: "FEMA disaster relief, HUD community grants, EDA",                                     category: "Discretionary",pct: 0.7  },
    { name: "General Government",             description: "White House, Congress, IRS, GSA, OPM, government-wide operations",                     category: "Discretionary",pct: 0.5  },
    { name: "Energy",                         description: "DOE energy programs, Strategic Petroleum Reserve, power marketing",                     category: "Discretionary",pct: 0.3  },
    { name: "Commerce & Housing Credit",      description: "SBA, Census Bureau, FHA/mortgage programs, FDIC",                                      category: "Mandatory",    pct: 0.3  },
    { name: "Other Federal Programs",         description: "Undistributed offsetting receipts, other mandatory and discretionary programs",          category: "Other",        pct: 8.2  },
  ];

  for (const item of budgetItems) {
    const usdAmount = Math.round((item.pct / 100) * totalBudgetUsd);
    await prisma.item.upsert({
      where: {
        id: `budget-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      },
      update: {
        name: item.name,
        description: item.description,
        category: item.category,
        currentAllocationPct: item.pct,
        currentAllocationUsd: usdAmount,
        active: true,
        jurisdictionId: usJurisdictionId,
      },
      create: {
        id: `budget-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: item.name,
        description: item.description,
        category: item.category,
        currentAllocationPct: item.pct,
        currentAllocationUsd: usdAmount,
        active: true,
        jurisdictionId: usJurisdictionId,
      },
    });
  }

  console.log(`  ✅ ${budgetItems.length} federal budget items`);
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log("🌱 Starting Optomitron seed...\n");

  const unitMap = await seedUnits();
  const catMap = await seedVariableCategories(unitMap);
  await seedGlobalVariables(unitMap, catMap);
  const usId = await seedJurisdictions();
  await seedBudgetItems(usId);

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
