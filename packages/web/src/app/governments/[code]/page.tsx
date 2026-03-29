import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  GOVERNMENTS,
  getGovernment,
  getGovernmentsByHALE,
  getAgencyPerformanceByCountry,
  ALL_HISTORICAL_TRENDS,
} from "@optimitron/data";
import { GameCTA } from "@/components/ui/game-cta";
import { BrutalCard } from "@/components/ui/brutal-card";
import { ParameterValue } from "@/components/shared/ParameterValue";
import { HumanityScoreboard } from "@/components/shared/HumanityScoreboard";
import { AgencyGradeChart } from "@/components/shared/AgencyGradeChart";
import { HistoricalTrendChart } from "@/components/shared/HistoricalTrendChart";
import {
  GLOBAL_HALE_CURRENT,
  TREATY_PROJECTED_HALE_YEAR_15,
} from "@optimitron/data/parameters";
import { getGovernmentDetailSections } from "@/lib/government-detail-stats";

interface PageProps {
  params: Promise<{ code: string }>;
}

export function generateStaticParams() {
  return GOVERNMENTS.map((g) => ({ code: g.code }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const gov = getGovernment(code.toUpperCase());
  if (!gov) return { title: "Country Not Found" };
  return {
    title: `${gov.name} Government Scorecard | The Earth Optimization Game`,
    description: `${gov.name}'s performance on the two metrics that matter: healthy life years and income. Plus military spending, health outcomes, and body count.`,
  };
}

function formatUSD(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  source?: string;
  url?: string;
}

function StatCard({ label, value, subtitle, source, url }: StatCardProps) {
  return (
    <BrutalCard bgColor="background" shadowSize={4} padding="md">
      <div className="text-xs font-black uppercase text-muted-foreground mb-1">
        {label}
      </div>
      <div className="text-2xl sm:text-3xl font-black text-foreground">
        {value}
      </div>
      {subtitle && (
        <div className="text-sm font-bold text-muted-foreground mt-1">
          {subtitle}
        </div>
      )}
      {source && (
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-brutal-pink hover:text-foreground transition-colors mt-2 block"
          >
            {source} ↗
          </a>
        ) : (
          <div className="text-[10px] font-bold text-muted-foreground mt-2">
            {source}
          </div>
        )
      )}
    </BrutalCard>
  );
}

export default async function GovernmentDetailPage({ params }: PageProps) {
  const { code } = await params;
  const gov = getGovernment(code.toUpperCase());
  if (!gov) notFound();

  const haleRanked = getGovernmentsByHALE();
  const haleRank = haleRanked.findIndex((g) => g.code === gov.code) + 1;
  const detailSections = getGovernmentDetailSections(gov);

  const haleGap = gov.hale
    ? TREATY_PROJECTED_HALE_YEAR_15.value - gov.hale.value
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-12">
        <Link
          href="/governments"
          className="text-sm font-black uppercase text-muted-foreground hover:text-brutal-pink transition-colors"
        >
          &larr; All Governments
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-6xl">{gov.flag}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground">
              {gov.name}
            </h1>
            <p className="text-lg font-bold text-muted-foreground">
              #{haleRank} of {haleRanked.length} by healthy life years
            </p>
          </div>
        </div>
      </section>

      {/* Game Metrics — the two numbers that matter */}
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
          Game Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <BrutalCard bgColor="background" shadowSize={8} padding="lg">
            <div className="text-xs font-black uppercase text-muted-foreground mb-2">
              Healthy Life Years (HALE)
            </div>
            <div className="text-5xl sm:text-6xl font-black text-foreground mb-2">
              {gov.hale?.value.toFixed(1) ?? "—"}
            </div>
            <div className="text-lg font-bold text-foreground">
              Global average: <ParameterValue param={GLOBAL_HALE_CURRENT} /> &middot; Treaty target: <ParameterValue param={TREATY_PROJECTED_HALE_YEAR_15} />
            </div>
            {haleGap !== null && haleGap > 0 && (
              <div className="text-base font-bold text-muted-foreground mt-1">
                Needs +{haleGap.toFixed(1)} years to hit treaty target
              </div>
            )}
          </BrutalCard>

          <BrutalCard bgColor="background" shadowSize={8} padding="lg">
            <div className="text-xs font-black uppercase text-muted-foreground mb-2">
              GDP Per Capita
            </div>
            <div className="text-5xl sm:text-6xl font-black text-foreground mb-2">
              {formatUSD(gov.gdpPerCapita.value)}
            </div>
            {gov.medianIncome && (
              <div className="text-lg font-bold text-foreground">
                Median income: {formatUSD(gov.medianIncome.value)}
              </div>
            )}
            <div className="text-base font-bold text-muted-foreground mt-1">
              {gov.gdpPerCapita.source}
            </div>
          </BrutalCard>
        </div>

        {/* Humanity's Scoreboard for context */}
        <HumanityScoreboard />
      </section>

      {/* Spending Profile */}
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
          Spending Profile
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {detailSections.spendingProfile.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              subtitle={stat.subtitle}
              source={stat.source}
              url={stat.url}
            />
          ))}
        </div>
      </section>

      {/* Body Count */}
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
          Body Count
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {detailSections.bodyCount.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              subtitle={stat.subtitle}
              source={stat.source}
              url={stat.url}
            />
          ))}
        </div>
        {gov.countriesBombed && gov.countriesBombed.value > 0 && (
          <div className="mt-4 border-4 border-primary bg-background p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase text-muted-foreground mb-1">
              Countries Bombed
            </p>
            <p className="text-sm font-bold text-foreground">
              {gov.countriesBombed.list}
            </p>
          </div>
        )}
        {gov.deathLedgerEntries && gov.deathLedgerEntries.length > 0 && (
          <div className="mt-6 border-4 border-primary bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="border-b-4 border-primary px-4 py-3">
              <h3 className="text-sm font-black uppercase text-foreground">
                Death Ledger
              </h3>
              <p className="mt-1 text-sm font-bold text-muted-foreground">
                Sourced regime and conflict entries summed into the body-count total.
              </p>
            </div>
            <div className="divide-y-2 divide-primary">
              {gov.deathLedgerEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1fr)_10rem_9rem]"
                >
                  <div>
                    <div className="text-base font-black text-foreground">
                      {entry.label}
                    </div>
                    <div className="mt-1 text-sm font-bold text-muted-foreground">
                      {entry.notes}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {entry.sourceLinks.map((source) => (
                        <a
                          key={source.url}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-black text-brutal-pink hover:text-foreground transition-colors"
                        >
                          {source.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-xs font-black uppercase text-muted-foreground">
                      Period
                    </div>
                    <div className="text-sm font-black text-foreground">
                      {entry.startYear}–{entry.endYear}
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-xs font-black uppercase text-muted-foreground">
                      Deaths
                    </div>
                    <div className="text-lg font-black text-foreground">
                      {entry.deaths.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-black uppercase text-muted-foreground">
                      {entry.method}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Justice & Domestic */}
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
          Justice &amp; Domestic
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {detailSections.justiceAndDomestic.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              subtitle={stat.subtitle}
              source={stat.source}
              url={stat.url}
            />
          ))}
        </div>
      </section>

      {/* Agency Performance Grades */}
      {(() => {
        const agencies = getAgencyPerformanceByCountry(gov.code);
        if (agencies.length === 0) return null;
        return (
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-2">
              Agency Report Cards
            </h2>
            <p className="text-base font-bold text-muted-foreground mb-6">
              Spending over time vs. outcomes over time. If the lines diverge —
              spending up, outcomes flat or worse — the agency is failing its
              mission. Letter grade is computed from trend analysis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agencies.map((agency) => (
                <AgencyGradeChart key={agency.agencyId} agency={agency} />
              ))}
            </div>
          </section>
        );
      })()}

      {/* Historical Trends — Before vs After Agency Creation */}
      {gov.code === "US" && ALL_HISTORICAL_TRENDS.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-2">
            Before vs After: Did the Agency Change the Trend?
          </h2>
          <p className="text-base font-bold text-muted-foreground mb-6">
            The red dashed line shows when each agency was created. If the trend
            was already improving before the agency existed and didn&apos;t
            accelerate after — the agency didn&apos;t help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALL_HISTORICAL_TRENDS.map((trend) => (
              <HistoricalTrendChart
                key={trend.agencyId}
                trend={trend}
                seriesIndices={[0]}
              />
            ))}
          </div>
        </section>
      )}

      {/* Politician Alignment */}
      <section className="mb-12">
        <div className="border-4 border-primary bg-background p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-3 text-2xl font-black uppercase text-foreground">
            {gov.name} Politician Alignment
          </h2>
          <p className="mb-6 text-lg font-bold text-foreground">
            How do {gov.name}&apos;s politicians actually vote compared to what
            citizens want? The scoreboard makes the gap impossible to ignore.
          </p>
          <GameCTA
            href={`/governments/${gov.code}/politicians`}
            variant="secondary"
            size="lg"
          >
            See Politician Scores
          </GameCTA>
        </div>
      </section>

      {/* CTA */}
      <section className="border-4 border-primary bg-background p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-3 text-2xl font-black uppercase text-foreground">
          Fix {gov.name}&apos;s Score
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-lg font-bold text-foreground">
          These numbers change when enough people demand it. Vote on the 1%
          Treaty, share with friends, and make {gov.name}&apos;s dysfunction
          impossible to ignore.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <GameCTA href="/#vote" variant="primary" size="lg">
            Play Now
          </GameCTA>
          <GameCTA href="/governments" variant="secondary" size="lg">
            All Governments
          </GameCTA>
        </div>
      </section>
    </div>
  );
}
