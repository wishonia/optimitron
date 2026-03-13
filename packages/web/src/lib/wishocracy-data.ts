export const BUDGET_CATEGORIES = {
  // HIGH-ROI INVESTMENTS
  PRAGMATIC_CLINICAL_TRIALS: {
    id: 'pragmatic_clinical_trials',
    name: 'Pragmatic Clinical Trials',
    description: 'Real-world clinical trials comparing treatment effectiveness',
    icon: '🔬',
    annualBudget: 1, // $1B (should be much higher)
    roiData: {
      source: 'Copenhagen Consensus',
      ratio: '45:1',
      description: 'Medical research returns $45 for every $1 invested in health interventions',
      sourceUrl: 'https://copenhagenconsensus.com/copenhagen-consensus-iii/outcome',
    },
  },
  ADDICTION_TREATMENT: {
    id: 'addiction_treatment',
    name: 'Addiction Treatment Programs',
    description: 'Evidence-based drug treatment, harm reduction, recovery support',
    icon: '🏥',
    annualBudget: 10, // $10B (needs $35B)
    roiData: {
      source: 'NIDA Research',
      ratio: '7:1',
      description: 'Every $1 spent on treatment saves $7 in healthcare and criminal justice costs',
      sourceUrl: 'https://nida.nih.gov/publications/principles-drug-addiction-treatment-research-based-guide-third-edition/frequently-asked-questions/drug-addiction-treatment-worth-its-cost',
    },
  },
  EARLY_CHILDHOOD_EDUCATION: {
    id: 'early_childhood_ed',
    name: 'Early Childhood Education',
    description: 'Pre-K, Head Start, childcare subsidies for low-income families',
    icon: '👶',
    annualBudget: 10, // $10B
    roiData: {
      source: 'Heckman Equation',
      ratio: '13:1',
      description: 'High-quality early childhood programs return $13 per dollar through better outcomes',
      sourceUrl: 'https://heckmanequation.org/resource/13-roi-toolbox/',
    },
  },
  // NUTRITION_PROGRAMS: {
  //   id: 'nutrition_programs',
  //   name: 'Nutrition Programs (SNAP/WIC)',
  //   description: 'Food assistance, school meals, WIC for mothers and children',
  //   icon: '🥗',
  //   annualBudget: 100, // $100B
  //   roiData: {
  //     source: 'Copenhagen Consensus',
  //     ratio: '18:1',
  //     description: 'Nutrition interventions, especially for children, show extremely high returns',
  //     sourceUrl: 'https://copenhagenconsensus.com/publication/global-problems-health-nutrition',
  //   },
  // },
  // PREVENTIVE_HEALTHCARE: {
  //   id: 'preventive_healthcare',
  //   name: 'Preventive Healthcare',
  //   description: 'Vaccines, screenings, wellness programs, disease prevention',
  //   icon: '💉',
  //   annualBudget: 20, // $20B
  //   roiData: {
  //     source: 'Trust for America\'s Health',
  //     ratio: '10:1',
  //     description: 'Preventive health programs save $10 in treatment costs for every $1 spent',
  //     sourceUrl: 'https://www.tfah.org/report-details/prevention-for-a-healthier-america/',
  //   },
  // },
  // CLEAN_ENERGY_RND: {
  //   id: 'clean_energy_rnd',
  //   name: 'Clean Energy R&D',
  //   description: 'Solar, wind, battery tech, grid modernization research',
  //   icon: '⚡',
  //   annualBudget: 5, // $5B
  //   roiData: {
  //     source: 'IEA Analysis',
  //     ratio: '10:1',
  //     description: 'Clean energy R&D accelerates decarbonization and creates high-wage jobs',
  //     sourceUrl: 'https://www.iea.org/reports/world-energy-investment-2023',
  //   },
  // },
  // MENTAL_HEALTH_SERVICES: {
  //   id: 'mental_health',
  //   name: 'Mental Health Services',
  //   description: 'Community mental health centers, crisis intervention, counseling',
  //   icon: '🧠',
  //   annualBudget: 15, // $15B
  //   roiData: {
  //     source: 'WHO Analysis',
  //     ratio: '4:1',
  //     description: 'Mental health treatment returns $4 in improved health and productivity per $1 spent',
  //     sourceUrl: 'https://www.who.int/news/item/13-04-2016-investing-in-treatment-for-depression-and-anxiety-leads-to-fourfold-return',
  //   },
  // },
  // INFRASTRUCTURE_REPAIR: {
  //   id: 'infrastructure_repair',
  //   name: 'Infrastructure Repair',
  //   description: 'Fix crumbling roads, bridges, water systems, public transit',
  //   icon: '🚧',
  //   annualBudget: 40, // $40B
  //   roiData: {
  //     source: 'CBO Economic Analysis',
  //     ratio: '3:1',
  //     description: 'Infrastructure investments generate economic activity and productivity gains',
  //     sourceUrl: 'https://www.cbo.gov/publication/57486',
  //   },
  // },

  // WASTEFUL/LOW-ROI SPENDING
  DRUG_WAR_ENFORCEMENT: {
    id: 'drug_war',
    name: 'Drug War Enforcement',
    description: 'Federal drug enforcement, DEA operations, prosecution and corrections',
    icon: '🚔',
    annualBudget: 50, // $50B+
    roiData: {
      source: 'Cato Institute',
      ratio: 'Negative ROI',
      description: 'Drug war spending increases addiction rates and incarceration without reducing drug use',
      sourceUrl: 'https://www.cato.org/policy-analysis/four-decades-counting-continued-failure-war-drugs',
    },
  },
  ICE_IMMIGRATION_ENFORCEMENT: {
    id: 'ice',
    name: 'Mass Immigrant Detention Camps',
    description: 'Warehouse mega-detention centers, mass deportation operations, 73K+ detained',
    icon: '🚨',
    annualBudget: 14, // $14B (up from $9B; $45B committed through 2029)
    roiData: {
      source: 'Economic Analysis',
      ratio: 'Negative ROI',
      description: '$45B committed through 2029 for eight mega-centers holding 10K each; 75% increase in detainees; reduces GDP and tax revenue while separating families',
      sourceUrl: 'https://www.americanprogress.org/article/the-costs-of-mass-deportation/',
    },
  },
  FARM_SUBSIDIES_AGRIBUSINESS: {
    id: 'farm_subsidies',
    name: 'Agribusiness Subsidies',
    description: 'Commodity support payments, crop insurance programs, agricultural subsidies',
    icon: '🌽',
    annualBudget: 20, // $20B
    roiData: {
      source: 'EWG Analysis',
      ratio: 'Low ROI',
      description: '75% of subsidies go to top 10% of farms; promotes monoculture and environmental damage',
      sourceUrl: 'https://www.ewg.org/research/farm-subsidies',
    },
  },
  FOSSIL_FUEL_SUBSIDIES: {
    id: 'fossil_fuel_subsidies',
    name: 'Fossil Fuel Subsidies',
    description: 'Federal tax breaks, production credits, and subsidies for oil and gas industry',
    icon: '🛢️',
    annualBudget: 20, // $20B
    roiData: {
      source: 'IMF Analysis',
      ratio: 'Negative ROI',
      description: 'Subsidizes climate change while renewable energy has become cheaper',
      sourceUrl: 'https://www.imf.org/en/Topics/climate-change/energy-subsidies',
    },
  },
  NUCLEAR_WEAPONS_MODERNIZATION: {
    id: 'nuclear_weapons',
    name: 'Nuclear Weapons Development',
    description: 'New warheads, ICBMs, submarines for nuclear arsenal',
    icon: '☢️',
    annualBudget: 60, // $60B
    roiData: {
      source: 'Arms Control Association',
      ratio: 'Low ROI',
      description: 'Modernizing 4,000+ warheads when 200 provide deterrence; risks new arms race',
      sourceUrl: 'https://www.armscontrol.org/factsheets/USNuclearModernization',
    },
  },
  PRISON_CONSTRUCTION: {
    id: 'prisons',
    name: 'Prison Construction & Operations',
    description: 'Corrections facilities construction and operational costs',
    icon: '🏢',
    annualBudget: 80, // $80B total corrections
    roiData: {
      source: 'Vera Institute',
      ratio: 'Negative ROI',
      description: 'Mass incarceration costs exceed education spending; recidivism remains 70%+',
      sourceUrl: 'https://www.vera.org/publications/price-of-prisons-2023-update',
    },
  },

  // TRADITIONAL/NECESSARY (for comparison)
  MILITARY_OPERATIONS: {
    id: 'military',
    name: 'Weapons Systems & Pentagon R&D',
    description: 'Weapons procurement, defense R&D, military base operations (excludes active wars)',
    icon: '🛡️',
    annualBudget: 425, // $425B (active wars split into separate categories)
    roiData: null,
  },

  // ACTIVE WARS & CONFLICTS
  BOMBING_IRAN: {
    id: 'bombing_iran',
    name: 'Bombing Iran',
    description: 'Operation Epic Fury: airstrikes, cruise missiles, naval operations against Iran ($1-2B/day)',
    icon: '💣',
    annualBudget: 365, // ~$1B/day
    roiData: {
      source: 'Watson Institute / Pentagon Estimates',
      ratio: 'Negative ROI',
      description: 'Iraq/Afghanistan cost $8T+ and destabilized the region; Iran war burned $5.6B in munitions in first 2 days',
      sourceUrl: 'https://watson.brown.edu/costsofwar/',
    },
  },
  ISRAEL_GAZA_MILITARY_AID: {
    id: 'israel_gaza_aid',
    name: "Military Aid for Israel's War in Gaza",
    description: 'Weapons, munitions, and military aid funding Israel\'s operations in Gaza; $21.7B since Oct 2023',
    icon: '🇮🇱',
    annualBudget: 4, // $3.3B base + supplementals
    roiData: {
      source: 'Quincy Institute / Congressional Research Service',
      ratio: 'Negative ROI',
      description: '65,000+ Palestinian civilians killed; characterized as genocide by UN experts; damages US standing globally',
      sourceUrl: 'https://quincyinst.org/research/u-s-military-aid-and-arms-transfers-to-israel-october-2023-september-2025/',
    },
  },
  YEMEN_HOUTHI_STRIKES: {
    id: 'yemen_houthi',
    name: 'Yemen & Houthi Military Strikes',
    description: 'Operation Rough Rider: naval and air strikes against Houthi forces in Yemen and the Red Sea',
    icon: '🚢',
    annualBudget: 5, // Estimated naval/air ops cost
    roiData: {
      source: 'Congressional Research Service',
      ratio: 'Low ROI',
      description: 'Houthi attacks on shipping persist despite strikes; each Tomahawk costs $2M+ vs $2K drones',
      sourceUrl: 'https://www.congress.gov/crs-product/RL33222',
    },
  },

  // CORPORATE & SURVEILLANCE
  CORPORATE_WELFARE: {
    id: 'corporate_welfare',
    name: 'Corporate Welfare & Bailouts',
    description: 'Direct subsidies, tax breaks, and bailouts for profitable corporations (Boeing $15.6B, auto $39B)',
    icon: '🏦',
    annualBudget: 100,
    roiData: {
      source: 'Cato Institute',
      ratio: 'Low ROI',
      description: 'Subsidies flow to politically connected firms, not most productive uses; distorts markets',
      sourceUrl: 'https://www.cato.org/policy-analysis/corporate-welfare-federal-budget-0',
    },
  },
  AI_MASS_SURVEILLANCE: {
    id: 'ai_surveillance',
    name: 'AI Mass Surveillance Programs',
    description: 'Government AI for domestic surveillance, social media monitoring, and tracking federal workers',
    icon: '👁️',
    annualBudget: 5,
    roiData: {
      source: 'Brennan Center for Justice',
      ratio: 'Negative ROI',
      description: 'Chills free speech; Pentagon labeled Anthropic a national security risk for refusing to allow mass surveillance',
      sourceUrl: 'https://www.brennancenter.org/',
    },
  },
  // K12_EDUCATION: {
  //   id: 'k12_education',
  //   name: 'K-12 Education',
  //   description: 'Federal funding for schools, Title I, special education',
  //   icon: '📚',
  //   annualBudget: 80, // $80B federal (states pay most)
  //   roiData: {
  //     source: 'Copenhagen Consensus',
  //     ratio: '30:1',
  //     description: 'Education interventions boost school attendance and long-term earnings',
  //     sourceUrl: 'https://copenhagenconsensus.com/publication/education-second-opinion',
  //   },
  // },
} as const

export type BudgetCategoryId = keyof typeof BUDGET_CATEGORIES

/**
 * Calculate actual government allocation percentages from annual budgets
 * Returns percentages that sum to 100%
 */
export function getActualGovernmentAllocations(): Record<BudgetCategoryId, number> {
  const total = Object.values(BUDGET_CATEGORIES).reduce((sum, cat) => sum + cat.annualBudget, 0)

  const allocations: Record<string, number> = {}
  Object.entries(BUDGET_CATEGORIES).forEach(([id, cat]) => {
    allocations[id] = Number(((cat.annualBudget / total) * 100).toFixed(1))
  })

  return allocations as Record<BudgetCategoryId, number>
}
