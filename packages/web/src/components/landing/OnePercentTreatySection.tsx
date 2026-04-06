"use client";

import { SectionContainer } from "@/components/ui/section-container";
import { Container } from "@/components/ui/container";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SpendingBar } from "@/components/ui/spending-bar";
import { GameCTA } from "@/components/ui/game-cta";
import { NavItemLink } from "@/components/navigation/NavItemLink";
import { onePercentTreatyPaperLink } from "@/lib/routes";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import {
  fmtParam,
  TRADITIONAL_PHASE3_COST_PER_PATIENT,
  DFDA_PRAGMATIC_TRIAL_COST_PER_PATIENT,
  CURRENT_TRIAL_SLOTS_AVAILABLE,
  DFDA_PATIENTS_FUNDABLE_ANNUALLY,
  STATUS_QUO_QUEUE_CLEARANCE_YEARS,
  DFDA_QUEUE_CLEARANCE_YEARS,
  DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_LIVES_SAVED,
} from "@optimitron/data/parameters";

const stats = [
  {
    label: "Trial Cost",
    before: fmtParam(TRADITIONAL_PHASE3_COST_PER_PATIENT),
    after: fmtParam(DFDA_PRAGMATIC_TRIAL_COST_PER_PATIENT),
    /** Bar shows how much the "after" value is relative to "before" — lower = better */
    barValue: DFDA_PRAGMATIC_TRIAL_COST_PER_PATIENT.value,
    barMax: TRADITIONAL_PHASE3_COST_PER_PATIENT.value,
    color: "cyan" as const,
    improvement: "44× cheaper",
  },
  {
    label: "Capacity",
    before: `${fmtParam({ ...CURRENT_TRIAL_SLOTS_AVAILABLE, value: CURRENT_TRIAL_SLOTS_AVAILABLE.value / 1e6, unit: "" })}M/yr`,
    after: `${fmtParam({ ...DFDA_PATIENTS_FUNDABLE_ANNUALLY, value: DFDA_PATIENTS_FUNDABLE_ANNUALLY.value / 1e6, unit: "" })}M/yr`,
    barValue: DFDA_PATIENTS_FUNDABLE_ANNUALLY.value,
    barMax: DFDA_PATIENTS_FUNDABLE_ANNUALLY.value,
    color: "green" as const,
    improvement: "12× more",
  },
  {
    label: "Queue",
    before: fmtParam(STATUS_QUO_QUEUE_CLEARANCE_YEARS),
    after: fmtParam(DFDA_QUEUE_CLEARANCE_YEARS),
    barValue: DFDA_QUEUE_CLEARANCE_YEARS.value,
    barMax: STATUS_QUO_QUEUE_CLEARANCE_YEARS.value,
    color: "cyan" as const,
    improvement: "12× faster",
  },
];

const livesSaved = (DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_LIVES_SAVED.value / 1e9).toFixed(1);

export function OnePercentTreatySection() {
  return (
    <SectionContainer bgColor="cyan" borderPosition="both" padding="lg">
      <Container className="max-w-3xl">
        <ScrollReveal>
          <BrutalCard bgColor="yellow" shadowSize={12} padding="lg">
            {/* Item badge */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-black px-2.5 py-1 bg-foreground text-background uppercase">
                ITEM
              </span>
              <span className="text-sm font-black px-2.5 py-1 bg-brutal-cyan text-brutal-cyan-foreground uppercase">
                POWER-UP
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase mb-1">
              1% Treaty
            </h2>
            <p className="text-lg font-bold mb-8">
              One percent. That&apos;s it.
            </p>

            {/* Stat bars */}
            <div className="space-y-5">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm font-black uppercase">
                      {stat.label}
                    </span>
                    <span className="text-sm font-black text-foreground">
                      {stat.improvement}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black line-through opacity-50 shrink-0 w-16 text-right">
                      {stat.before}
                    </span>
                    <div className="flex-grow">
                      <SpendingBar
                        value={stat.barValue}
                        max={stat.barMax}
                        color={stat.color}
                        height="md"
                      />
                    </div>
                    <span className="text-sm font-black shrink-0 w-20">
                      {stat.after}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Lives saved */}
            <div className="mt-8 pt-6 border-t-4 border-primary">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-black uppercase">
                  Lives Saved
                </span>
                <span className="text-3xl sm:text-4xl font-black">
                  {livesSaved}B
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <GameCTA href="#vote" variant="primary" size="lg">
                Vote for This
              </GameCTA>
              <NavItemLink
                item={onePercentTreatyPaperLink}
                variant="custom"
                external
                className="inline-flex items-center text-sm font-black uppercase hover:underline transition-colors"
              >
                😴 Read the Impact Analysis &rarr;
              </NavItemLink>
            </div>
          </BrutalCard>
        </ScrollReveal>
      </Container>
    </SectionContainer>
  );
}
