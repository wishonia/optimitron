import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  GOVERNMENTS,
  getGovernment,
  getAgencyPerformance,
  getAgencyPerformanceByCountry,
  getHistoricalTrend,
} from "@optimitron/data";
import type { AgencyGrade } from "@optimitron/data";
import { GameCTA } from "@/components/ui/game-cta";
import { BrutalCard } from "@/components/ui/brutal-card";
import { ArcadeTag } from "@/components/ui/arcade-tag";
import { ROUTES } from "@/lib/routes";
import { AgencyGradeChart } from "@/components/shared/AgencyGradeChart";
import { HistoricalTrendChart } from "@/components/shared/HistoricalTrendChart";
import { SupplementaryStatCards } from "@/components/shared/SupplementaryStatCards";
import { DrugDisasterTable } from "@/components/shared/DrugDisasterTable";
import { LieComparisonCard } from "@/components/shared/LieComparisonCard";
import { IronicLawCallout } from "@/components/shared/IronicLawCallout";
import { CoupTable } from "@/components/shared/CoupTable";
import { LobbyingCard } from "@/components/shared/LobbyingCard";
import { StatCard } from "@/components/ui/stat-card";
import { getAgencyById } from "@/lib/deprecated-agencies-data";

// Supplementary datasets
import {
  FDA_APPROVED_DRUG_DISASTERS,
  FDA_DRUG_DISASTER_SUMMARY,
} from "@optimitron/data";
import { PHARMA_PATENT_STATS } from "@optimitron/data";
import { IRONIC_LAWS } from "@optimitron/data";
import { GOVERNMENT_LIES } from "@optimitron/data";
import { LOBBYING_BY_INDUSTRY } from "@optimitron/data";
import { REVOLVING_DOOR_STATS } from "@optimitron/data";
import { CIA_COUPS } from "@optimitron/data";
import {
  HEALTHCARE_WASTE_CATEGORIES,
  DRUG_PRICE_COMPARISONS,
} from "@optimitron/data";
import { INSURER_DENIAL_RATES, DENIAL_SYSTEM_STATS } from "@optimitron/data";
import { PREVENTABLE_DEATH_CATEGORIES } from "@optimitron/data";
import {
  CORPORATE_TAX_RATE_EFFECTIVE,
  ZERO_TAX_COMPANIES_2020,
} from "@optimitron/data";
import { IMMIGRATION_KEY_STATISTICS } from "@optimitron/data";
import { CONGRESSIONAL_TRADING_STATS } from "@optimitron/data";

// ---------------------------------------------------------------------------
// Wishonia replacement mapping
// ---------------------------------------------------------------------------

const wishoniaReplacements: Record<string, { href: string; label: string }> = {
  dea: { href: "/agencies/dih", label: "dIH — Health & Research" },
  nih: { href: "/agencies/dih", label: "dIH — Health & Research" },
  fda: { href: "/agencies/dih", label: "dIH — Health & Research" },
  doed: { href: "/agencies/domb", label: "dOMB — Budget Optimization" },
  dod: { href: "/agencies/ddod", label: "dDoD — Defense" },
  hhs: { href: "/agencies/dih", label: "dIH — Health & Research" },
  ice: { href: "/agencies/dcensus", label: "dCensus — World ID" },
  bop: { href: "/agencies/dcbo", label: "dCBO — Policy Scoring" },
  epa: { href: "/agencies/dcbo", label: "dCBO — Policy Scoring" },
  fbi: { href: "/agencies/dgao", label: "dGAO — Transparency & Audit" },
  cyber: { href: "/agencies/dgao", label: "dGAO — Transparency & Audit" },
};

/** Maps AgencyPerformance IDs to DeprecatedAgency IDs for institutional stats */
const deprecatedAgencyMapping: Record<string, string> = {
  nih: "dih",
  fda: "dih",
  hhs: "dih",
  dod: "ddod",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const gradeColors: Record<AgencyGrade, string> = {
  A: "bg-brutal-cyan text-foreground",
  B: "bg-brutal-cyan text-foreground",
  C: "bg-brutal-yellow text-foreground",
  D: "bg-brutal-yellow text-foreground",
  F: "bg-brutal-red text-brutal-red-foreground",
};

function formatCompact(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function trendDescription(series: { year: number; value: number }[]): {
  direction: string;
  changePercent: string;
  startValue: number;
  endValue: number;
  startYear: number;
  endYear: number;
} {
  if (series.length < 2) {
    return {
      direction: "Insufficient data",
      changePercent: "0",
      startValue: 0,
      endValue: 0,
      startYear: 0,
      endYear: 0,
    };
  }
  const first = series[0]!;
  const last = series[series.length - 1]!;
  const change = ((last.value - first.value) / first.value) * 100;
  const direction = change > 5 ? "Up" : change < -5 ? "Down" : "Flat";
  return {
    direction,
    changePercent: `${change > 0 ? "+" : ""}${change.toFixed(0)}%`,
    startValue: first.value,
    endValue: last.value,
    startYear: first.year,
    endYear: last.year,
  };
}

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ code: string; agencyId: string }>;
}

export function generateStaticParams() {
  const result: { code: string; agencyId: string }[] = [];
  for (const gov of GOVERNMENTS) {
    const agencies = getAgencyPerformanceByCountry(gov.code);
    for (const agency of agencies) {
      result.push({ code: gov.code, agencyId: agency.agencyId });
    }
  }
  return result;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code, agencyId } = await params;
  const agency = getAgencyPerformance(agencyId, code.toUpperCase());
  if (!agency) return { title: "Agency Not Found" };
  const gov = getGovernment(code.toUpperCase());
  return {
    title: `${agency.emoji} ${agency.agencyName} — Grade ${agency.grade} | ${gov?.name ?? code} | Optimitron`,
    description: `${agency.agencyName} report card: ${agency.gradeRationale}`,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AgencyDetailPage({ params }: PageProps) {
  const { code, agencyId } = await params;
  const upperCode = code.toUpperCase();
  const gov = getGovernment(upperCode);
  if (!gov) notFound();

  const agency = getAgencyPerformance(agencyId, upperCode);
  if (!agency) notFound();

  const spendTrend = trendDescription(agency.spendingTimeSeries);
  const outcomeSeries = agency.outcomes[0];
  const outcomeTrend = outcomeSeries
    ? trendDescription(outcomeSeries.data)
    : null;

  const replacement = wishoniaReplacements[agency.agencyId];
  const deprecatedId = deprecatedAgencyMapping[agency.agencyId];
  const institutionalData = deprecatedId ? getAgencyById(deprecatedId) : undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href={`/governments/${gov.code}/agencies`}
        className="text-sm font-black uppercase text-muted-foreground hover:text-brutal-pink transition-colors"
      >
        &larr; {gov.name} Agencies
      </Link>

      {/* Hero */}
      <section className="mt-4 mb-12">
        <ArcadeTag>Agency Report Card</ArcadeTag>
        <div className="flex items-start gap-4">
          <span className="text-5xl sm:text-6xl">{agency.emoji}</span>
          <div className="flex-grow">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground">
              {agency.agencyName}
            </h1>
            <p className="text-lg font-bold text-muted-foreground mt-1">
              {agency.mission}
            </p>
          </div>
          <div
            className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border-4 border-primary ${gradeColors[agency.grade]} font-black text-4xl sm:text-5xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
          >
            {agency.grade}
          </div>
        </div>
      </section>

      {/* Chart — with all outcomes and annotations */}
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
          Spending vs. Outcomes
        </h2>
        <AgencyGradeChart agency={agency} showAllOutcomes />
      </section>

      {/* Institutional stats — "why it's broken" data from deprecated agency analysis */}
      {institutionalData && (
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-2">
            What This Costs You
          </h2>
          <p className="text-base font-bold text-muted-foreground italic mb-4">
            &ldquo;{institutionalData.tagline}&rdquo;
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {institutionalData.stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
          <BrutalCard bgColor="foreground" shadowSize={8} padding="md">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs font-black uppercase text-muted-foreground">
                  Annual Savings If Deprecated
                </div>
                <div className="text-3xl sm:text-4xl font-black text-brutal-pink mt-1">
                  {institutionalData.annualSavings}
                </div>
              </div>
              <div className="text-sm font-bold text-muted-foreground text-right max-w-[200px]">
                {institutionalData.savingsComparison}
              </div>
            </div>
          </BrutalCard>
        </section>
      )}

      {/* Historical Before/After (if data exists) */}
      {(() => {
        const historicalTrend = getHistoricalTrend(agency.agencyId);
        if (!historicalTrend) return null;
        return (
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-2">
              Before vs. After: Did It Change the Trend?
            </h2>
            <p className="text-base font-bold text-muted-foreground mb-4">
              {historicalTrend.question}
            </p>
            <HistoricalTrendChart trend={historicalTrend} />
            <p className="text-base font-bold text-muted-foreground mt-4">
              {historicalTrend.finding}
            </p>
          </section>
        );
      })()}

      {/* Stats */}
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
          Trend Analysis
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Spending trend */}
          <BrutalCard bgColor="cyan" shadowSize={8} padding="md">
            <div className="text-xs font-black uppercase text-muted-foreground mb-1">
              Spending Trend ({spendTrend.startYear}–{spendTrend.endYear})
            </div>
            <div className="text-3xl font-black text-foreground">
              {spendTrend.direction} {spendTrend.changePercent}
            </div>
            <div className="text-sm font-bold text-muted-foreground mt-2">
              {formatCompact(spendTrend.startValue)} → {formatCompact(spendTrend.endValue)}
            </div>
          </BrutalCard>

          {/* Outcome trend */}
          {outcomeTrend && outcomeSeries && (
            <BrutalCard bgColor="pink" shadowSize={8} padding="md">
              <div className="text-xs font-black uppercase text-brutal-pink-foreground mb-1">
                {outcomeSeries.label} ({outcomeTrend.startYear}–{outcomeTrend.endYear})
              </div>
              <div className="text-3xl font-black text-brutal-pink-foreground">
                {outcomeTrend.direction} {outcomeTrend.changePercent}
              </div>
              <div className="text-sm font-bold text-brutal-pink-foreground mt-2">
                {outcomeSeries.direction === "lower_is_better"
                  ? "Lower is better"
                  : "Higher is better"}
              </div>
            </BrutalCard>
          )}
        </div>
      </section>

      {/* Wishonia quote */}
      <section className="mb-12">
        <BrutalCard bgColor="yellow" shadowSize={8} padding="lg">
          <div className="text-xs font-black uppercase text-muted-foreground mb-2">
            Wishonia Says
          </div>
          <blockquote className="text-lg sm:text-xl font-bold text-foreground leading-relaxed italic">
            &ldquo;{agency.wishoniaQuote}&rdquo;
          </blockquote>
        </BrutalCard>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/*  Supplementary Data — per-agency sections                     */}
      {/* ══════════════════════════════════════════════════════════════ */}

      {/* FDA: Drug disasters + patent abuse + PDUFA + pharma lobbying */}
      {agency.agencyId === "fda" && (
        <>
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
              FDA-Approved Drug Disasters
            </h2>
            <p className="text-base font-bold text-muted-foreground mb-4">
              These drugs PASSED the 8.2-year efficacy review. The process kills more people through delay than it saves through rejection.
            </p>
            <DrugDisasterTable disasters={FDA_APPROVED_DRUG_DISASTERS} />
          </section>
          <SupplementaryStatCards
            title="Patent Abuse"
            subtitle="Why drugs stay expensive forever"
            items={PHARMA_PATENT_STATS.map((s) => ({
              name: s.metric,
              emoji: "💊",
              value: s.value,
              description: s.description,
              source: s.source,
              sourceUrl: s.sourceUrl,
            }))}
          />
          {(() => {
            const pdufa = IRONIC_LAWS.find((l) => l.id === "pdufa");
            return pdufa ? <IronicLawCallout law={pdufa} /> : null;
          })()}
          {(() => {
            const pharma = LOBBYING_BY_INDUSTRY.find((l) => l.industry.includes("Pharma"));
            return pharma ? (
              <section className="mb-12">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
                  Who Buys the Dysfunction
                </h2>
                <LobbyingCard industry={pharma} />
              </section>
            ) : null;
          })()}
          {(() => {
            const revDoor = REVOLVING_DOOR_STATS.find((s) => s.metric.includes("FDA"));
            return revDoor ? (
              <section className="mb-12">
                <BrutalCard bgColor="red" shadowSize={8} padding="lg">
                  <div className="text-xs font-black uppercase text-brutal-red-foreground mb-2">
                    The Revolving Door
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-brutal-red-foreground mb-2">
                    {revDoor.value}
                  </div>
                  <p className="text-base font-bold text-brutal-red-foreground">
                    {revDoor.description}
                  </p>
                </BrutalCard>
              </section>
            ) : null;
          })()}
        </>
      )}

      {/* HHS: Healthcare waste + insurance denials + preventable deaths + ACA */}
      {agency.agencyId === "hhs" && (
        <>
          <SupplementaryStatCards
            title="Healthcare Waste"
            subtitle="Where your $4.5 trillion per year actually goes"
            items={HEALTHCARE_WASTE_CATEGORIES.map((c) => ({
              name: c.name,
              emoji: c.emoji,
              value: `$${(c.annualCost / 1e9).toFixed(0)}B/yr`,
              description: c.description,
              comparison: c.comparison,
              source: c.source,
              sourceUrl: c.sourceUrl,
            }))}
            columns={2}
          />
          <SupplementaryStatCards
            title="Preventable Deaths"
            subtitle="People who didn't have to die"
            items={PREVENTABLE_DEATH_CATEGORIES.map((c) => ({
              name: c.name,
              emoji: c.emoji,
              value: `${c.annualDeaths.toLocaleString()}/yr`,
              description: c.description,
              comparison: c.comparison,
              source: c.source,
              sourceUrl: c.sourceUrl,
            }))}
            columns={2}
          />
          {(() => {
            const aca = IRONIC_LAWS.find((l) => l.id === "aca");
            return aca ? <IronicLawCallout law={aca} /> : null;
          })()}
        </>
      )}

      {/* DEA: Drug war ironic law */}
      {agency.agencyId === "dea" && (
        <>
          {(() => {
            const drugFree = IRONIC_LAWS.find((l) => l.id === "drug-free-america");
            return drugFree ? <IronicLawCallout law={drugFree} /> : null;
          })()}
        </>
      )}

      {/* DoD: Ironic law + CIA coups + war lies + defense lobbying + revolving door */}
      {agency.agencyId === "dod" && (
        <>
          {(() => {
            const dod = IRONIC_LAWS.find((l) => l.id === "dept-of-defense");
            return dod ? <IronicLawCallout law={dod} /> : null;
          })()}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
              CIA-Backed Regime Changes
            </h2>
            <p className="text-base font-bold text-muted-foreground mb-4">
              Democracies overthrown for corporate interests. Every entry is declassified or publicly acknowledged.
            </p>
            <CoupTable coups={CIA_COUPS} />
          </section>
          {(() => {
            const pentagonPapers = GOVERNMENT_LIES.find((l) => l.id === "pentagon-papers");
            return pentagonPapers ? (
              <section className="mb-12">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
                  Documented Lies
                </h2>
                <LieComparisonCard lie={pentagonPapers} />
              </section>
            ) : null;
          })()}
          {(() => {
            const torture = GOVERNMENT_LIES.find((l) => l.id === "torture-program");
            return torture ? <LieComparisonCard lie={torture} /> : null;
          })()}
          {(() => {
            const defense = LOBBYING_BY_INDUSTRY.find((l) => l.industry.includes("Defense"));
            return defense ? (
              <section className="mb-12">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
                  Defense Lobbying
                </h2>
                <LobbyingCard industry={defense} />
              </section>
            ) : null;
          })()}
          {(() => {
            const pentagon = REVOLVING_DOOR_STATS.find((s) => s.metric.includes("Pentagon"));
            return pentagon ? (
              <section className="mb-12">
                <BrutalCard bgColor="red" shadowSize={8} padding="lg">
                  <div className="text-xs font-black uppercase text-brutal-red-foreground mb-2">
                    The Revolving Door
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-brutal-red-foreground mb-2">
                    {pentagon.value}
                  </div>
                  <p className="text-base font-bold text-brutal-red-foreground">
                    {pentagon.description}
                  </p>
                </BrutalCard>
              </section>
            ) : null;
          })()}
        </>
      )}

      {/* State Dept: CIA coups */}
      {agency.agencyId === "state" && (
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
            CIA-Backed Regime Changes
          </h2>
          <CoupTable coups={CIA_COUPS} />
        </section>
      )}

      {/* IRS: Corporate tax avoidance */}
      {agency.agencyId === "irs" && (
        <>
          <SupplementaryStatCards
            title="Corporate Tax Avoidance"
            subtitle="They extract from the system without paying into it"
            items={ZERO_TAX_COMPANIES_2020.map((c) => ({
              name: c.company,
              emoji: "🏢",
              value: `$${(c.profit2020 / 1e9).toFixed(1)}B profit`,
              description: `Federal tax paid: $${c.taxPaid2020}. Effective rate: ${c.effectiveRate}%.`,
              comparison: "Paid zero federal income tax on billions in profit",
            }))}
          />
          {(() => {
            const finance = LOBBYING_BY_INDUSTRY.find((l) => l.industry.includes("Finance"));
            return finance ? (
              <section className="mb-12">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
                  Finance Industry Lobbying
                </h2>
                <LobbyingCard industry={finance} />
              </section>
            ) : null;
          })()}
        </>
      )}

      {/* ICE: Immigration economic impact */}
      {agency.agencyId === "ice" && (
        <SupplementaryStatCards
          title="Immigration Economic Impact"
          subtitle="The people you're spending $29B/yr to keep out"
          items={IMMIGRATION_KEY_STATISTICS.map((s) => ({
            name: s.headline,
            emoji: "🌍",
            value: s.value,
            description: s.headline,
            source: s.source,
            sourceUrl: s.sourceUrl,
          }))}
          columns={2}
        />
      )}

      {/* EPA: Environmental cover-ups */}
      {agency.agencyId === "epa" && (
        <>
          {(() => {
            const lead = GOVERNMENT_LIES.find((l) => l.id === "leaded-gasoline");
            return lead ? (
              <section className="mb-12">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
                  Environmental Cover-ups
                </h2>
                <LieComparisonCard lie={lead} />
              </section>
            ) : null;
          })()}
          {(() => {
            const flint = GOVERNMENT_LIES.find((l) => l.id === "flint-water");
            return flint ? <LieComparisonCard lie={flint} /> : null;
          })()}
        </>
      )}

      {/* FBI: Domestic surveillance + COINTELPRO */}
      {agency.agencyId === "fbi" && (
        <>
          {(() => {
            const cointelpro = GOVERNMENT_LIES.find((l) => l.id === "cointelpro");
            return cointelpro ? (
              <section className="mb-12">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
                  Documented Abuses
                </h2>
                <LieComparisonCard lie={cointelpro} />
              </section>
            ) : null;
          })()}
          {(() => {
            const nsa = GOVERNMENT_LIES.find((l) => l.id === "nsa-surveillance");
            return nsa ? <LieComparisonCard lie={nsa} /> : null;
          })()}
          {(() => {
            const patriot = IRONIC_LAWS.find((l) => l.id === "patriot-act");
            return patriot ? <IronicLawCallout law={patriot} /> : null;
          })()}
        </>
      )}

      {/* BOP: Mass incarceration ironic laws */}
      {agency.agencyId === "bop" && (
        <>
          {(() => {
            const fair = IRONIC_LAWS.find((l) => l.id === "fair-sentencing");
            return fair ? <IronicLawCallout law={fair} /> : null;
          })()}
          {(() => {
            const bapcpa = IRONIC_LAWS.find((l) => l.id === "bapcpa");
            return bapcpa ? <IronicLawCallout law={bapcpa} /> : null;
          })()}
        </>
      )}

      {/* DoEd: NCLB ironic law */}
      {agency.agencyId === "doed" && (
        <>
          {(() => {
            const nclb = IRONIC_LAWS.find((l) => l.id === "nclb");
            return nclb ? <IronicLawCallout law={nclb} /> : null;
          })()}
        </>
      )}

      {/* Sources */}
      {agency.sources.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
            Sources
          </h2>
          <ul className="space-y-2">
            {agency.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-brutal-pink hover:text-foreground transition-colors border-b-2 border-brutal-pink"
                >
                  {source.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CTA — See the replacement */}
      {replacement && (
        <section className="border-4 border-primary bg-brutal-cyan p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-3 text-2xl font-black uppercase text-foreground">
            See the Replacement
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg font-bold text-foreground">
            On a well-run planet, this agency would have been deprecated
            centuries ago. Here is what replaces it.
          </p>
          <GameCTA href={replacement.href} variant="primary" size="lg">
            {replacement.label}
          </GameCTA>
        </section>
      )}

      {/* Fallback CTA if no replacement mapping */}
      {!replacement && (
        <section className="border-4 border-primary bg-brutal-cyan p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-3 text-2xl font-black uppercase text-foreground">
            See All Wishonia Agencies
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg font-bold text-foreground">
            On a well-run planet, every agency is graded in real time and replaced
            when it fails. Here is the full roster.
          </p>
          <GameCTA href={ROUTES.agencies} variant="primary" size="lg">
            Wishonia&apos;s Agencies
          </GameCTA>
        </section>
      )}
    </div>
  );
}
