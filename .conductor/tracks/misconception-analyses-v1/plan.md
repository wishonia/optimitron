# Plan: Policy Misconception Analyses (v1)

## Phase 1: Datasets ✅ COMPLETE
- [x] Drug war spending → overdose deaths (`us-drug-war.ts`)
- [x] Drug war spending → violent crime / homicide (`us-drug-war.ts`)
- [x] Immigration enforcement → income (`us-immigration-tariffs.ts`)
- [x] Tariffs → income / inflation (`us-immigration-tariffs.ts`)
- [x] Minimum wage → unemployment → income (`us-minimum-wage.ts`)
- [x] Laffer curve: tax rates → revenue → GDP → income (`us-laffer-curve.ts`)
- [x] US vs OECD healthcare spending → outcomes (`us-healthcare-spending.ts`)
- [x] Police spending → crime rates (`us-police-spending.ts`)
- [x] Incarceration rate → crime rates (`us-incarceration.ts`)
- [x] Gun ownership / NICS checks → homicide (`us-gun-data.ts`)

## Phase 2: Analyses Run
- [x] Drug war → overdose analysis (commit `886e061`)
- [x] Drug war → crime analysis (commit `ada32d2`)
- [x] Immigration enforcement → income analysis (commit `bbd06e1`)
- [x] Tariff → income / inflation analysis (commit `bbd06e1`)
- [x] Laffer curve analysis (Telegram msg 1272)
- [x] Minimum wage analysis (Telegram msg 1270)
- [x] Healthcare spending analysis (Telegram msg 1271)
- [ ] Police spending → crime analysis
- [ ] Incarceration → crime analysis
- [ ] Gun ownership → homicide analysis

## Phase 3: Tier 2 Datasets + Analyses
- [ ] Death penalty → homicide rate
- [ ] Foreign aid → conflict / migration
- [ ] Abstinence education → teen pregnancy (state-level)
- [ ] Welfare spending → labor force participation (expand existing)
- [ ] Regulation burden → GDP growth (World Bank Ease of Doing Business)

## Phase 4: Website Integration
- [ ] Create `/misconceptions` page with ranked findings
- [ ] Interactive "myth vs reality" cards with data viz
- [ ] Link each finding to full methodology / data sources
- [ ] Generate `misconceptions.json` data file for web app

## Phase 5: Reports
- [ ] Generate "Life Years Gained per $1M" ranking across all categories
- [ ] Consolidated markdown report: "15 Things Everyone Believes That Data Contradicts"
- [ ] Executive summary for grant applications
