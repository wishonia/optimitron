/**
 * Canonical US Wishocratic item catalog shared by dataset consumers and DB seeds.
 *
 * US Citizen Priority Items
 *
 * The 18 budget priority categories that citizens compare via RAPPA
 * (pairwise allocation). Each item includes:
 * - Structural data: spending, ROI, fiscal category mappings
 * - Voice: Wishonia's deadpan descriptions with source citations
 * - Mappings: which fiscal categories (from us-federal-budget.ts) this maps to
 *
 * These are more granular and opinionated than the 23 OMB fiscal categories.
 * A priority item may be a subset of a fiscal category (Nuclear Weapons ⊂ Military),
 * span multiple (Drug War → Justice + Homeland Security), or represent proposed
 * spending that doesn't exist yet (UBI).
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FiscalCategoryShare {
  /** ID matching BudgetCategory.id from us-federal-budget.ts (e.g., 'military', 'education') */
  fiscalCategoryId: string;
  /** Fraction of this priority item's budget from this fiscal category (0-1) */
  share: number;
}

export interface WishocraticItemRoiData {
  /** Source of the ROI claim */
  source: string;
  /** ROI ratio string (e.g., '45:1', 'Negative ROI', 'Low ROI') */
  ratio: string;
  /** Explanation of the ROI */
  description: string;
  /** URL to the source */
  sourceUrl: string;
}

export interface WishocraticItemSource {
  /** Human-readable source description */
  name: string;
  /** URL */
  url: string;
}

export interface WishocraticItemDefinition {
  /** Unique slug ID (e.g., 'nuclear_weapons') */
  readonly slug: string;
  /** Human-readable name */
  readonly name: string;
  /** Wishonia's voice description — deadpan, data-first, with specific numbers */
  readonly description: string;
  /** Emoji icon */
  readonly icon: string;
  /** Annual budget in billions USD (0 for proposed items) */
  readonly annualBudgetBillions: number;
  /** URL to the authoritative source for the annualBudgetBillions figure */
  readonly budgetSourceUrl: string | null;
  /** ROI data with source citation (null if no clear ROI framing) */
  readonly roiData: Readonly<WishocraticItemRoiData> | null;
  /** Evidence sources */
  readonly sources: readonly WishocraticItemSource[];
  /** Which fiscal categories this maps to (from us-federal-budget.ts) */
  readonly fiscalCategoryMappings: readonly FiscalCategoryShare[];
  /** Whether this is existing government spending or proposed */
  readonly type: 'existing' | 'proposed';
  /** Jurisdiction code */
  readonly jurisdictionCode: string;
}

export interface WishocraticCatalogRecord<TItemId extends string = string> {
  /** Stable item ID used in DB rows and UI state */
  readonly id: TItemId;
  /** Jurisdiction code matching the seeded Jurisdiction.code */
  readonly jurisdictionCode: string;
  /** Human-readable name */
  readonly name: string;
  /** Item description */
  readonly description: string;
  /** URL to supporting documentation or source data */
  readonly sourceUrl: string | null;
  /** Current actual budget allocation in USD */
  readonly currentAllocationUsd: number;
  /** Current actual budget allocation as a percentage of the total */
  readonly currentAllocationPct: number;
}

export const US_WISHOCRATIC_JURISDICTION = {
  code: 'US',
  name: 'United States',
  type: 'COUNTRY',
} as const;

// ─── Data ────────────────────────────────────────────────────────────────────

export const US_WISHOCRATIC_ITEMS = {
  // ─── CITIZEN-DIRECTED UBI ────────────────────────────────────────────
  UNIVERSAL_BASIC_INCOME: {
    slug: 'universal_basic_income',
    name: 'Universal Basic Income',
    description: 'Direct cash to every verified citizen. No conditions, no bureaucracy, no means-testing committees staffed by people who have never missed a meal deciding whether you deserve to eat. GiveDirectly RCTs show unconditional transfers increase earnings by 38%, reduce food insecurity by 42%, and cost 90 cents per dollar delivered. Your current welfare system costs $2.30 per dollar delivered. You are paying $1.30 extra per dollar just for the privilege of humiliating people.',
    icon: '💰',
    annualBudgetBillions: 0,
    budgetSourceUrl: null,
    roiData: {
      source: 'GiveDirectly RCTs',
      ratio: '1:1',
      description: 'Unconditional cash transfers increase earnings 38%, reduce food insecurity 42%; 90¢ per $1 delivered vs $2.30 for traditional welfare',
      sourceUrl: 'https://www.givedirectly.org/research-on-cash-transfers/',
    },
    sources: [
      { name: 'GiveDirectly — Research on cash transfers', url: 'https://www.givedirectly.org/research-on-cash-transfers/' },
      { name: 'NBER — General equilibrium effects of cash transfers', url: 'https://www.nber.org/papers/w26600' },
    ],
    fiscalCategoryMappings: [],
    type: 'proposed' as const,
    jurisdictionCode: 'US',
  },

  // ─── HIGH-ROI INVESTMENTS ────────────────────────────────────────────
  PRAGMATIC_CLINICAL_TRIALS: {
    slug: 'pragmatic_clinical_trials',
    name: 'Pragmatic Clinical Trials',
    description: 'Your species spends $4.7 trillion a year on healthcare but allocates roughly $1 billion to figuring out which treatments actually work. That is like buying 4.7 million cars and spending $1 on a mechanic. Pragmatic trials test drugs in real patients, in real hospitals, and produce answers in months instead of decades.',
    icon: '🔬',
    annualBudgetBillions: 2,
    budgetSourceUrl: 'https://www.nih.gov/about-nih/what-we-do/budget',
    roiData: {
      source: 'Copenhagen Consensus',
      ratio: '45:1',
      description: 'Medical research returns $45 for every $1 invested in health interventions',
      sourceUrl: 'https://copenhagenconsensus.com/copenhagen-consensus-iii/outcome',
    },
    sources: [
      { name: 'Copenhagen Consensus III — ROI of health research', url: 'https://copenhagenconsensus.com/copenhagen-consensus-iii/outcome' },
      { name: 'CMS National Health Expenditure Data — $4.7T total', url: 'https://www.cms.gov/data-research/statistics-trends-and-reports/national-health-expenditure-data' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'health_discretionary', share: 1.0 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },
  ADDICTION_TREATMENT: {
    slug: 'addiction_treatment',
    name: 'Addiction Treatment Programs',
    description: 'Every dollar spent on evidence-based treatment saves seven in healthcare and criminal justice costs. Instead, you spend most of the money arresting people for being ill and then acting surprised when they relapse in prison. Harm reduction, medication-assisted treatment, and recovery support actually work. Weird how that keeps not mattering.',
    icon: '🏥',
    annualBudgetBillions: 13,
    budgetSourceUrl: 'https://www.samhsa.gov/about-us/budget',
    roiData: {
      source: 'NIDA Research',
      ratio: '7:1',
      description: 'Every $1 spent on treatment saves $7 in healthcare and criminal justice costs',
      sourceUrl: 'https://nida.nih.gov/publications/principles-drug-addiction-treatment-research-based-guide-third-edition/frequently-asked-questions/drug-addiction-treatment-worth-its-cost',
    },
    sources: [
      { name: 'NIDA — Treatment is cost-effective (7:1 ROI)', url: 'https://nida.nih.gov/publications/principles-drug-addiction-treatment-research-based-guide-third-edition/frequently-asked-questions/drug-addiction-treatment-worth-its-cost' },
      { name: 'SAMHSA — 2023 National Survey on Drug Use and Health', url: 'https://www.samhsa.gov/data/data-we-collect/nsduh-national-survey-drug-use-and-health/national-releases/2023' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'health_discretionary', share: 1.0 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },
  EARLY_CHILDHOOD_EDUCATION: {
    slug: 'early_childhood_ed',
    name: 'Early Childhood Education',
    description: 'The Heckman Equation shows $13 returned for every $1 invested in quality early childhood programs. Pre-K, Head Start, and childcare subsidies produce measurable gains in earnings, health, and reduced crime for decades. On my planet we consider failing to invest in children a form of economic self-harm. Here you call it "fiscal responsibility."',
    icon: '👶',
    annualBudgetBillions: 13,
    budgetSourceUrl: 'https://www.acf.hhs.gov/ohs/about/head-start',
    roiData: {
      source: 'Heckman Equation',
      ratio: '13:1',
      description: 'High-quality early childhood programs return $13 per dollar through better outcomes',
      sourceUrl: 'https://heckmanequation.org/resource/13-roi-toolbox/',
    },
    sources: [
      { name: 'Heckman Equation — 13:1 ROI Toolbox', url: 'https://heckmanequation.org/resource/13-roi-toolbox/' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'education', share: 1.0 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },
  CYBERSECURITY: {
    slug: 'cybersecurity',
    name: 'Cybersecurity & Infrastructure Protection',
    description: 'You spend $886 billion a year on defence but less than 0.4% of that protecting the power grids, water systems, and hospitals that your entire civilisation depends on. Ransomware gangs are shutting down hospitals and pipelines while the military buys another aircraft carrier. It is like fitting seventeen deadbolts on the front door and leaving every window wide open.',
    icon: '🔐',
    annualBudgetBillions: 3,
    budgetSourceUrl: 'https://www.cisa.gov/about',
    roiData: {
      source: 'CISA / GAO Reports',
      ratio: '20:1',
      description: 'Cybersecurity investment prevents cascading infrastructure failures costing orders of magnitude more',
      sourceUrl: 'https://www.cisa.gov/topics/cybersecurity-best-practices',
    },
    sources: [
      { name: 'CISA — Cybersecurity Best Practices', url: 'https://www.cisa.gov/topics/cybersecurity-best-practices' },
      { name: 'GAO — Critical Infrastructure Protection', url: 'https://www.gao.gov/products/gao-23-106441' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'homeland_security', share: 0.7 },
      { fiscalCategoryId: 'military', share: 0.3 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },

  // ─── WASTEFUL/LOW-ROI SPENDING ──────────────────────────────────────
  DRUG_WAR_ENFORCEMENT: {
    slug: 'drug_war',
    name: 'Drug War Enforcement',
    description: 'Fifty-plus years. Over one trillion dollars. Overdose deaths went from 6,100 per year in 1980 to 110,000 in 2023 — an 18x increase. Drug use rates are essentially unchanged. The number of people imprisoned for drug offences rose from 24,000 to 300,000. Meanwhile Portugal decriminalised everything in 2001 and drug deaths dropped 80%, HIV among users fell 95%. Pew Research found zero statistical relationship between drug imprisonment rates and drug use. You are funding the longest-running policy failure in recorded history.',
    icon: '🚔',
    annualBudgetBillions: 35,
    budgetSourceUrl: 'https://www.whitehouse.gov/ondcp/budget/',
    roiData: {
      source: 'Cato Institute',
      ratio: 'Negative ROI',
      description: 'Drug war spending increases addiction rates and incarceration without reducing drug use',
      sourceUrl: 'https://www.cato.org/policy-analysis/four-decades-counting-continued-failure-war-drugs',
    },
    sources: [
      { name: 'CDC Data Brief No. 491 — Overdose deaths 6,100 (1980) to 110,000 (2023)', url: 'https://www.cdc.gov/nchs/products/databriefs/db491.htm' },
      { name: 'NIDA — Overdose death rate trends', url: 'https://nida.nih.gov/research-topics/trends-statistics/overdose-death-rates' },
      { name: 'CNBC — Over $1 trillion spent on drug war', url: 'https://www.cnbc.com/2021/06/17/the-us-has-spent-over-a-trillion-dollars-fighting-war-on-drugs.html' },
      { name: 'Prison Policy Initiative — 300,000 imprisoned for drug offences', url: 'https://www.prisonpolicy.org/graphs/pie2025_drugs.html' },
      { name: 'Pew Research — More imprisonment does not reduce state drug problems', url: 'https://www.pewtrusts.org/en/research-and-analysis/issue-briefs/2018/03/more-imprisonment-does-not-reduce-state-drug-problems' },
      { name: 'Transform — Portugal drug decriminalisation results', url: 'https://transformdrugs.org/blog/drug-decriminalisation-in-portugal-setting-the-record-straight' },
      { name: 'Cato Institute — Four decades of failure', url: 'https://www.cato.org/policy-analysis/four-decades-counting-continued-failure-war-drugs' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'justice', share: 0.6 },
      { fiscalCategoryId: 'homeland_security', share: 0.2 },
      { fiscalCategoryId: 'other_mandatory', share: 0.2 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },
  ICE_IMMIGRATION_ENFORCEMENT: {
    slug: 'ice',
    name: 'Mass Immigrant Detention Camps',
    description: 'It costs $150-$200 per day to detain one person — $55,000-$73,000 per year. Alternatives to detention cost $4.50/day with 90%+ court appearance rates. Immigrants are 60% less likely to be incarcerated than US-born citizens. Cato Institute found immigrants created a cumulative fiscal surplus of $14.5 trillion from 1994-2023 — every single year they paid more in taxes than they received. Undocumented immigrants alone pay $96.7 billion in taxes annually while being barred from collecting benefits. The CBO projects immigration reduces federal deficits by $0.9 trillion over 2024-2034. You are spending premium prices to remove people who subsidise your government.',
    icon: '🚨',
    annualBudgetBillions: 10,
    budgetSourceUrl: 'https://www.dhs.gov/sites/default/files/2024-03/2024_0311_cfo_fy2025bib.pdf',
    roiData: {
      source: 'Cato Institute / CBO',
      ratio: 'Negative ROI',
      description: 'Immigrants created $14.5T fiscal surplus (1994-2023); deportation reduces GDP and tax revenue',
      sourceUrl: 'https://www.cato.org/white-paper/immigrants-recent-effects-government-budgets-1994-2023',
    },
    sources: [
      { name: 'Cato Institute — Immigrants reduced deficits by $14.5 trillion (1994-2023)', url: 'https://www.cato.org/white-paper/immigrants-recent-effects-government-budgets-1994-2023' },
      { name: 'CBO — Immigration surge reduces deficits by $0.9 trillion (2024-2034)', url: 'https://www.cbo.gov/publication/60569' },
      { name: 'ITEP — Undocumented immigrants paid $96.7B in taxes (2022)', url: 'https://itep.org/undocumented-immigrants-taxes-2024/' },
      { name: 'PNAS — Undocumented immigrants half as likely to be arrested for violent crime', url: 'https://www.pnas.org/doi/10.1073/pnas.2014704117' },
      { name: 'National Immigration Forum — Detention costs $152-$165/day vs $4.50/day alternatives', url: 'https://forumtogether.org/article/immigration-detention-costs-in-a-time-of-mass-deportation/' },
      { name: 'American Immigration Council — ICE/CBP budget tripled since 2003', url: 'https://www.americanimmigrationcouncil.org/fact-sheet/the-cost-of-immigration-enforcement-and-border-security/' },
      { name: 'Penn Wharton — Mass deportation GDP impact analysis', url: 'https://budgetmodel.wharton.upenn.edu/issues/2025/7/28/mass-deportation-of-unauthorized-immigrants-fiscal-and-economic-effects' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'homeland_security', share: 0.8 },
      { fiscalCategoryId: 'justice', share: 0.2 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },
  FARM_SUBSIDIES_AGRIBUSINESS: {
    slug: 'farm_subsidies',
    name: 'Agribusiness Subsidies',
    description: 'Seventy-five percent of farm subsidies go to the top 10% of farms, which are mostly enormous corporations that do not need the help. The programme promotes monoculture, damages the environment, and crowds out the small farms your politicians claim to be protecting. It is corporate welfare wearing a straw hat.',
    icon: '🌽',
    annualBudgetBillions: 22,
    budgetSourceUrl: 'https://www.cbo.gov/topics/agriculture',
    roiData: {
      source: 'EWG Analysis',
      ratio: 'Low ROI',
      description: '75% of subsidies go to top 10% of farms; promotes monoculture and environmental damage',
      sourceUrl: 'https://www.ewg.org/research/farm-subsidies',
    },
    sources: [
      { name: 'EWG — Farm subsidy distribution analysis', url: 'https://www.ewg.org/research/farm-subsidies' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'agriculture', share: 1.0 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },
  FOSSIL_FUEL_SUBSIDIES: {
    slug: 'fossil_fuel_subsidies',
    name: 'Fossil Fuel Subsidies',
    description: 'You are paying $34.8 billion a year in direct subsidies to companies that posted $150 billion in combined profits in 2022. Solar is now 41% cheaper than the cheapest fossil fuel. Wind is 53% cheaper. 91% of new renewable projects undercut fossil fuels on cost. Climate damages already cost the US $240 billion per year — $7 in damage for every $1 in subsidy. You are paying companies to make the planet uninhabitable when the cheaper alternative is already sitting right there.',
    icon: '🛢️',
    annualBudgetBillions: 11,
    budgetSourceUrl: 'https://home.treasury.gov/policy-issues/tax-policy/tax-expenditures',
    roiData: {
      source: 'IMF Analysis',
      ratio: 'Negative ROI',
      description: 'Subsidizes climate change while renewable energy has become cheaper',
      sourceUrl: 'https://www.imf.org/en/Topics/climate-change/energy-subsidies',
    },
    sources: [
      { name: 'Oil Change International — $34.8B/yr in direct US subsidies', url: 'https://oilchange.org/news/us-fossil-fuel-subsidies/' },
      { name: 'IMF — $7.4 trillion in global fossil fuel subsidies (2024)', url: 'https://www.imf.org/en/Topics/climate-change/energy-subsidies' },
      { name: 'IRENA — 91% of new renewables cheaper than fossil fuels', url: 'https://www.irena.org/News/pressreleases/2025/Jul/91-Percent-of-New-Renewable-Projects-Now-Cheaper-Than-Fossil-Fuels-Alternatives' },
      { name: 'CBS News — Oil companies $150B+ in record 2022 profits', url: 'https://www.cbsnews.com/news/oil-companies-record-profits-2022-exxon-chevron/' },
      { name: 'National Geographic — $240B/yr in climate damages to US economy', url: 'https://www.nationalgeographic.com/science/article/climate-change-costs-us-economy-billions-report' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'energy', share: 0.6 },
      { fiscalCategoryId: 'treasury', share: 0.4 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },
  NUCLEAR_WEAPONS_MODERNIZATION: {
    slug: 'nuclear_weapons',
    name: 'Nuclear Weapons Development',
    description: 'You have 3,700 stockpiled warheads. Defence analysts agree 200-311 provide full deterrence. The UK deters with 200. The 30-year modernisation plan costs $1.7 trillion. The Sentinel ICBM programme is 81% over budget at $141 billion. Research shows just 100 detonations would trigger nuclear winter and kill 5 billion people from famine. You are spending $60 billion a year to go from "can end civilisation 10 times" to "can end it 11 times."',
    icon: '☢️',
    annualBudgetBillions: 61,
    budgetSourceUrl: 'https://www.cbo.gov/publication/59054',
    roiData: {
      source: 'Arms Control Association',
      ratio: 'Low ROI',
      description: 'Modernizing 4,000+ warheads when 200 provide deterrence; risks new arms race',
      sourceUrl: 'https://www.armscontrol.org/factsheets/USNuclearModernization',
    },
    sources: [
      { name: 'FAS — US nuclear weapons stockpile 2025 (3,700 warheads)', url: 'https://fas.org/wp-content/uploads/2025/01/United-States-nuclear-weapons-2025.pdf' },
      { name: 'Arms Control Association — Sentinel ICBM 81% over budget at $141B', url: 'https://www.armscontrol.org/act/2024-03/news/sentinel-icbm-exceeds-projected-cost-37-percent' },
      { name: 'Arms Control Association — $1.7T 30-year modernisation plan', url: 'https://www.armscontrol.org/factsheets/us-modernization-2024-update' },
      { name: 'Nature Food — 100 detonations trigger nuclear winter, 5B deaths from famine', url: 'https://www.livescience.com/nuclear-war-could-kill-5-billion-from-famine' },
      { name: 'SIPRI — Minimum deterrence at 200-311 warheads', url: 'https://www.sipri.org/sites/default/files/2022-06/sipriinsight2206_minimal_nuclear_deterrence_1.pdf' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'military', share: 0.7 },
      { fiscalCategoryId: 'energy', share: 0.3 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },
  PRISON_CONSTRUCTION: {
    slug: 'prisons',
    name: 'Prison Construction & Operations',
    description: 'The US went from 360,000 inmates in the 1970s to 2.3 million at peak — a 540% increase. Total corrections spending: $115 billion per year. Average cost per federal inmate: $47,162. Recidivism rate: 77% rearrested within 5 years. Since 2000, increased incarceration accounts for nearly zero percent of the crime drop. Norway invested in education and rehab, cut recidivism from 60% to 20%. The Netherlands closed 27 prisons because they ran out of prisoners. You are running the world\'s most expensive failure factory.',
    icon: '🏢',
    annualBudgetBillions: 95,
    budgetSourceUrl: 'https://bjs.ojp.gov/topics/corrections',
    roiData: {
      source: 'Vera Institute',
      ratio: 'Negative ROI',
      description: 'Mass incarceration costs exceed education spending; recidivism remains 70%+',
      sourceUrl: 'https://www.vera.org/publications/price-of-prisons-2023-update',
    },
    sources: [
      { name: 'Sentencing Project — Mass incarceration trends (360K to 2.3M)', url: 'https://www.sentencingproject.org/reports/mass-incarceration-trends/' },
      { name: 'Prison Policy Initiative — $115B/yr total corrections spending', url: 'https://www.prisonpolicy.org/reports/money2026.html' },
      { name: 'Federal Register — $47,162/yr average federal incarceration cost', url: 'https://www.federalregister.gov/documents/2025/12/15/2025-22777/annual-determination-of-average-cost-of-incarceration-fee-coif' },
      { name: 'BJS — 77% rearrested within 5 years', url: 'https://bjs.ojp.gov/topics/recidivism-and-reentry' },
      { name: 'Brennan Center — Incarceration has near-zero effect on crime since 2000', url: 'https://www.brennancenter.org/our-work/analysis-opinion/between-2007-and-2017-34-states-reduced-crime-and-incarceration-tandem' },
      { name: 'Vera Institute — The Prison Paradox', url: 'https://www.vera.org/publications/for-the-record-prison-paradox-incarceration-not-safer' },
      { name: 'US News — Netherlands closed 27 prisons for lack of prisoners', url: 'https://www.usnews.com/news/best-countries/articles/2019-05-13/the-netherlands-is-closing-its-prisons' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'justice', share: 1.0 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },

  // ─── TRADITIONAL/NECESSARY (for comparison) ─────────────────────────
  MILITARY_OPERATIONS: {
    slug: 'military',
    name: 'Weapons Systems & Pentagon R&D',
    description: 'The largest military budget on the planet by a factor of three. Since 2001 alone, $8 trillion spent on the War on Terror. Result: global terrorist attacks went from 1,800 per year to 16,900 (a 9x increase). Countries with active jihadist groups tripled from 12 to 40+. After 20 years and $2.3 trillion in Afghanistan, the Taliban retook the country in 11 days. Whether this makes you safer or just makes defence contractors richer is a question your political system is structurally incapable of asking.',
    icon: '🛡️',
    annualBudgetBillions: 311,
    budgetSourceUrl: 'https://comptroller.defense.gov/Budget-Materials/',
    roiData: null,
    sources: [
      { name: 'Watson Institute — $8 trillion total cost of post-9/11 wars', url: 'https://watson.brown.edu/costsofwar/figures/2023/BudgetaryCosts' },
      { name: 'Global Terrorism Database — Attacks rose from 1,800/yr to 16,900/yr', url: 'https://www.start.umd.edu/gtd/' },
      { name: 'CSIS — Jihadist groups tripled from ~12 to 40+ countries', url: 'https://www.csis.org/analysis/evolution-salafi-jihadist-threat' },
      { name: 'SIGAR — Taliban retook Afghanistan in 11 days after 20 years', url: 'https://www.sigar.mil/pdf/lessonslearned/SIGAR-21-46-LL.pdf' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'military', share: 1.0 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },

  // ─── ACTIVE WARS & CONFLICTS ─────────────────────────────────────────
  BOMBING_IRAN: {
    slug: 'bombing_iran',
    name: 'Bombing Iran',
    description: 'Operation Midnight Hammer hit three nuclear sites in June 2025 ($2 billion). Then Operation Epic Fury launched a full-scale war on February 28, 2026 — $11.3 billion in the first six days, $16.5 billion by day 12, roughly $1 billion per day ongoing. Your previous adventures in Iraq and Afghanistan cost $8 trillion, killed 400,000-900,000 civilians, displaced 38 million people, and created ISIS — which did not exist before the 2003 invasion. The Taliban retook Afghanistan in 11 days after 20 years and $2.3 trillion. But I am sure this time will be different.',
    icon: '💣',
    annualBudgetBillions: 37,
    budgetSourceUrl: 'https://www.csis.org/analysis/iran-war-cost-estimate-update-113-billion-day-6-165-billion-day-12',
    roiData: {
      source: 'CSIS / Pentagon briefing to Senate Appropriations',
      ratio: 'Negative ROI',
      description: '$11.3B in first 6 days, ~$1B/day ongoing; Iraq/Afghanistan cost $8T+ and destabilized the region',
      sourceUrl: 'https://www.csis.org/analysis/37-billion-estimated-cost-epic-furys-first-100-hours',
    },
    sources: [
      { name: 'CSIS — $3.7B estimated cost of Epic Fury first 100 hours', url: 'https://www.csis.org/analysis/37-billion-estimated-cost-epic-furys-first-100-hours' },
      { name: 'CSIS — $11.3B at day 6, $16.5B at day 12', url: 'https://www.csis.org/analysis/iran-war-cost-estimate-update-113-billion-day-6-165-billion-day-12' },
      { name: 'The Hill — Pentagon confirms $11.3B in first 6 days', url: 'https://thehill.com/homenews/5780153-operation-epic-fury-cost/' },
      { name: 'Fortune — Penn Wharton estimates total economic cost up to $210B', url: 'https://fortune.com/2026/03/02/how-much-trump-iran-war-operation-epic-fury-cost-taxpayers/' },
      { name: 'Watson Institute — $8T cost of post-9/11 wars', url: 'https://watson.brown.edu/costsofwar/figures/2023/BudgetaryCosts' },
      { name: 'Watson Institute — 38 million people displaced', url: 'https://watson.brown.edu/costsofwar/costs/human/refugees' },
      { name: 'Stanford CISAC — ISIS did not exist before 2003 invasion', url: 'https://cisac.fsi.stanford.edu/mappingmilitants' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'military', share: 1.0 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },
  ISRAEL_GAZA_MILITARY_AID: {
    slug: 'israel_gaza_aid',
    name: "Military Aid for Israel's War in Gaza",
    description: 'Twenty-one point seven billion dollars in weapons and munitions since October 2023, funding operations that UN experts have characterised as genocide, with over 65,000 Palestinian civilians killed. The diplomatic cost to the US is incalculable. On my planet, paying for someone else\'s war crimes is also considered a war crime. Here you call it "strategic alliance."',
    icon: '🇮🇱',
    annualBudgetBillions: 15,
    budgetSourceUrl: 'https://crsreports.congress.gov/product/pdf/RL/RL33222',
    roiData: {
      source: 'Quincy Institute / Congressional Research Service',
      ratio: 'Negative ROI',
      description: '65,000+ Palestinian civilians killed; characterized as genocide by UN experts; damages US standing globally',
      sourceUrl: 'https://quincyinst.org/research/u-s-military-aid-and-arms-transfers-to-israel-october-2023-september-2025/',
    },
    sources: [
      { name: 'Quincy Institute — $21.7B in US military aid to Israel since Oct 2023', url: 'https://quincyinst.org/research/u-s-military-aid-and-arms-transfers-to-israel-october-2023-september-2025/' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'foreign_aid', share: 0.5 },
      { fiscalCategoryId: 'military', share: 0.5 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },
  YEMEN_HOUTHI_STRIKES: {
    slug: 'yemen_houthi',
    name: 'Yemen & Houthi Military Strikes',
    description: 'Operation Rough Rider fires $2 million Tomahawk missiles at groups using $2,000 drones. The Houthi attacks on shipping persist despite the strikes, which means you are spending $2 million to not solve a $2,000 problem. This is the military equivalent of hiring a Michelin-star chef to burn toast.',
    icon: '🚢',
    annualBudgetBillions: 4,
    budgetSourceUrl: 'https://www.csis.org/analysis/',
    roiData: {
      source: 'Congressional Research Service',
      ratio: 'Low ROI',
      description: 'Houthi attacks on shipping persist despite strikes; each Tomahawk costs $2M+ vs $2K drones',
      sourceUrl: 'https://www.congress.gov/crs-product/RL33222',
    },
    sources: [
      { name: 'CRS — Yemen/Houthi military operations', url: 'https://www.congress.gov/crs-product/RL33222' },
      { name: 'UNDP — 377,000 deaths in Yemen war', url: 'https://www.undp.org/publications/assessing-impact-war-yemen' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'military', share: 1.0 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },

  // ─── CORPORATE & SURVEILLANCE ────────────────────────────────────────
  CORPORATE_WELFARE: {
    slug: 'corporate_welfare',
    name: 'Corporate Welfare & Bailouts',
    description: '$188 billion a year in federal corporate tax expenditures alone. Boeing: $16 billion in subsidies. Foxconn promised Wisconsin 13,000 jobs for $4.5 billion in incentives and delivered 1,454. Studies show 75-98% of subsidised projects would have happened without the incentive. Michigan\'s job subsidy programmes delivered 9% of promised jobs. These are the richest entities in human history receiving public money because they have better lobbyists than you have representatives.',
    icon: '🏦',
    annualBudgetBillions: 175,
    budgetSourceUrl: 'https://www.jct.gov/publications/2024/jcx-1-24/',
    roiData: {
      source: 'Cato Institute',
      ratio: 'Low ROI',
      description: 'Subsidies flow to politically connected firms, not most productive uses; distorts markets',
      sourceUrl: 'https://www.cato.org/policy-analysis/corporate-welfare-federal-budget-0',
    },
    sources: [
      { name: 'PGPF — $188B/yr in federal corporate tax expenditures', url: 'https://www.pgpf.org/article/7-key-charts-on-tax-breaks/' },
      { name: 'Good Jobs First — Subsidy Tracker (Boeing $16B, GM $3.5B)', url: 'https://subsidytracker.goodjobsfirst.org/parent-totals' },
      { name: 'Bloomberg — Foxconn delivered 1,454 of 13,000 promised jobs', url: 'https://www.bloomberg.com/news/features/2019-02-06/inside-wisconsin-s-disastrous-4-5-billion-deal-with-foxconn' },
      { name: 'Springer — 75-98% of subsidised projects happen without the incentive', url: 'https://link.springer.com/article/10.1007/s11142-023-09804-6' },
      { name: 'Cato Institute — Corporate welfare in the federal budget', url: 'https://www.cato.org/policy-analysis/corporate-welfare-federal-budget-0' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'commerce', share: 0.3 },
      { fiscalCategoryId: 'treasury', share: 0.3 },
      { fiscalCategoryId: 'agriculture', share: 0.2 },
      { fiscalCategoryId: 'energy', share: 0.2 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },
  AI_MASS_SURVEILLANCE: {
    slug: 'ai_surveillance',
    name: 'AI Mass Surveillance Programs',
    description: 'Your government is spending billions on AI to track its own citizens. The NSA\'s bulk collection programme was reviewed by the Privacy and Civil Liberties Oversight Board, which found "not a single instance" where it made a concrete difference in a counterterrorism investigation. Facial recognition misidentifies Black faces at 10-100x the rate of white faces. The marginal cost per real terrorist detected via bulk surveillance exceeds $14 billion. You are building a panopticon that does not work and disproportionately harms minorities.',
    icon: '👁️',
    annualBudgetBillions: 5,
    budgetSourceUrl: 'https://www.dni.gov/index.php/what-we-do/ic-budget',
    roiData: {
      source: 'Brennan Center for Justice',
      ratio: 'Negative ROI',
      description: 'Chills free speech; Pentagon labeled Anthropic a national security risk for refusing to allow mass surveillance',
      sourceUrl: 'https://www.brennancenter.org/',
    },
    sources: [
      { name: 'NBC News — White House panel: NSA programme stopped no terror attacks', url: 'https://www.nbcnews.com/news/world/nsa-program-stopped-no-terror-attacks-says-white-house-panel-flna2d11783588' },
      { name: 'NIST — Facial recognition 10-100x more false positives for Black faces', url: 'https://www.nist.gov/news-events/news/2019/12/nist-study-evaluates-effects-race-age-sex-face-recognition-software' },
      { name: 'IEEE — Marginal cost per terrorist detected exceeds $14 billion', url: 'https://ieeexplore.ieee.org/document/8443344/' },
      { name: 'New America — NSA bulk surveillance minimal contribution to investigations', url: 'https://www.newamerica.org/oti/policy-papers/surveillance-costs-the-nsas-impact-on-the-economy-internet-freedom-cybersecurity/' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'homeland_security', share: 0.5 },
      { fiscalCategoryId: 'military', share: 0.3 },
      { fiscalCategoryId: 'justice', share: 0.2 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },
  POLICING_VIOLENT_CRIME: {
    slug: 'policing_violent_crime',
    name: 'Solving Actual Violent Crime',
    description: 'Your police solve roughly 50% of murders, 30% of arsons, and a staggering 14% of burglaries. Nearly half of all killers simply get away with it. Meanwhile your law enforcement budget is heavily allocated to drug offences and immigration enforcement rather than, you know, solving the crimes that already happened. The clearance rate for rape kits is somehow even more depressing. Perhaps try catching actual criminals before expanding into new hobbies.',
    icon: '🔍',
    annualBudgetBillions: 9,
    budgetSourceUrl: 'https://www.justice.gov/jmd/page/file/1614846/download',
    roiData: {
      source: 'FBI Uniform Crime Report / Bureau of Justice Statistics',
      ratio: 'Variable',
      description: 'Homicide clearance ~50%, arson ~30%, burglary ~14%; forensic backlogs and underfunded crime labs reduce solve rates',
      sourceUrl: 'https://bjs.ojp.gov/topics/crime',
    },
    sources: [
      { name: 'BJS — Crime and justice data', url: 'https://bjs.ojp.gov/topics/crime' },
      { name: 'FBI — Uniform Crime Reporting clearance rates', url: 'https://ucr.fbi.gov/' },
    ],
    fiscalCategoryMappings: [
      { fiscalCategoryId: 'justice', share: 1.0 },
    ],
    type: 'existing' as const,
    jurisdictionCode: 'US',
  },
} as const;

export type USWishocraticItemId = keyof typeof US_WISHOCRATIC_ITEMS;

/**
 * Get all priority items as an array (useful for iteration)
 */
export function getUSWishocraticItemsList(): WishocraticItemDefinition[] {
  return Object.values(US_WISHOCRATIC_ITEMS);
}

/**
 * Calculate actual government allocation percentages from annual budgets.
 * Returns percentages that sum to 100%.
 */
export function getUSWishocraticAllocations(): Record<USWishocraticItemId, number> {
  const total = Object.values(US_WISHOCRATIC_ITEMS).reduce(
    (sum, item) => sum + item.annualBudgetBillions,
    0,
  );

  const allocations: Record<string, number> = {};
  for (const [id, item] of Object.entries(US_WISHOCRATIC_ITEMS)) {
    allocations[id] = Number(((item.annualBudgetBillions / total) * 100).toFixed(1));
  }

  return allocations as Record<USWishocraticItemId, number>;
}

export function getUSWishocraticSourceUrl(item: WishocraticItemDefinition): string | null {
  return item.roiData?.sourceUrl ?? item.sources[0]?.url ?? null;
}

export function buildUSWishocraticCatalogRecord(
  itemId: USWishocraticItemId,
): WishocraticCatalogRecord<USWishocraticItemId> {
  const item = US_WISHOCRATIC_ITEMS[itemId];
  const allocations = getUSWishocraticAllocations();

  return {
    id: itemId,
    jurisdictionCode: US_WISHOCRATIC_JURISDICTION.code,
    name: item.name,
    description: item.description,
    sourceUrl: getUSWishocraticSourceUrl(item),
    currentAllocationUsd: item.annualBudgetBillions * 1_000_000_000,
    currentAllocationPct: allocations[itemId],
  };
}

export function getUSWishocraticCatalogRecords(): Record<
  USWishocraticItemId,
  WishocraticCatalogRecord<USWishocraticItemId>
> {
  const allocations = getUSWishocraticAllocations();
  const records: Partial<
    Record<USWishocraticItemId, WishocraticCatalogRecord<USWishocraticItemId>>
  > = {};

  for (const [itemId, item] of Object.entries(US_WISHOCRATIC_ITEMS)) {
    const typedItemId = itemId as USWishocraticItemId;
    records[typedItemId] = {
      id: typedItemId,
      jurisdictionCode: US_WISHOCRATIC_JURISDICTION.code,
      name: item.name,
      description: item.description,
      sourceUrl: getUSWishocraticSourceUrl(item),
      currentAllocationUsd: item.annualBudgetBillions * 1_000_000_000,
      currentAllocationPct: allocations[typedItemId],
    };
  }

  return records as Record<
    USWishocraticItemId,
    WishocraticCatalogRecord<USWishocraticItemId>
  >;
}

