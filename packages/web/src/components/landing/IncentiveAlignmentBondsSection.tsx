"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerGrid } from "@/components/animations/StaggerGrid";
import { NavItemLink } from "@/components/navigation/NavItemLink";
import {
  incentiveAlignmentBondsPaperLink,
  prizeLink,
} from "@/lib/routes";

const properties = [
  {
    title: "No Altruism Required",
    description:
      "You buy bonds because the return profile is attractive. If the plan fails, you get ~4x your money back from a dominant assurance contract. If it succeeds, you get a share of the $14.9–52.1 trillion in per-capita income gains. Greed does the coordination.",
  },
  {
    title: "Secondary Market = Probability Signal",
    description:
      "Bond prices on the secondary market ARE the probability estimate. When traders bid up IABs, they're saying the plan is more likely to work. When they sell, they're saying it isn't. No polls. No pundits. Just money with skin in the game.",
  },
  {
    title: "Campaigns Self-Organise",
    description:
      "Smart contracts automatically route campaign funds to politicians with the highest Citizen Alignment Scores. No PACs. No fundraising dinners. The money flows to whoever actually represents you. Politicians who ignore citizens get defunded by code.",
  },
];

export function IncentiveAlignmentBondsSection() {
  return (
    <section className="bg-brutal-pink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            The Bond That Replaces Your Entire Political System
          </h2>
          <p className="mt-4 text-lg text-black/60 max-w-2xl mx-auto font-medium">
            Not a donation. A financial instrument. You buy Incentive Alignment Bonds
            because the expected return beats your index fund — and if it works, you
            accidentally fix civilisation. Weird how that works when you align incentives.
          </p>
        </ScrollReveal>

        {/* Two outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <ScrollReveal direction="left">
            <div className="p-8 border-4 border-black bg-brutal-yellow shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full">
              <div className="text-xs font-black px-2.5 py-1 bg-black text-white inline-block mb-4 uppercase">
                If the plan fails
              </div>
              <h3 className="text-2xl font-black text-black mb-3">
                ~4x Return
              </h3>
              <p className="text-sm text-black/70 leading-relaxed font-medium">
                Dominant assurance contract. If outcome thresholds aren&apos;t met,
                bondholders get their principal back plus a multiplier. You literally
                get paid for civilisation failing. Beats your hedge fund&apos;s 2-and-20
                and you didn&apos;t even have to wear a suit.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.15}>
            <div className="p-8 border-4 border-black bg-brutal-cyan shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full">
              <div className="text-xs font-black px-2.5 py-1 bg-black text-white inline-block mb-4 uppercase">
                If the plan succeeds
              </div>
              <h3 className="text-2xl font-black text-black mb-3">
                272%/yr Revenue Share
              </h3>
              <p className="text-sm text-black/70 leading-relaxed font-medium">
                Per-capita income gains of $14.9M–$52.1M across adopting jurisdictions.
                Bondholders get a share of the value they helped create. Your downside is
                &ldquo;only&rdquo; quadrupling your money. Your upside is a civilisational
                upgrade with revenue share. The break-even probability shift is 0.0067%.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Three properties */}
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {properties.map((prop) => (
            <div
              key={prop.title}
              className="p-6 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <h3 className="text-lg font-black text-black mb-3 uppercase">
                {prop.title}
              </h3>
              <p className="text-sm text-black/70 leading-relaxed font-medium">
                {prop.description}
              </p>
            </div>
          ))}
        </StaggerGrid>

        {/* Bridge to Prize */}
        <ScrollReveal delay={0.3}>
          <div className="p-8 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
            <p className="text-lg font-black text-black mb-2">
              The bonds ARE the prize pool. One instrument.
            </p>
            <p className="text-black/60 font-medium max-w-2xl mx-auto mb-6">
              IAB deposits fund the Earth Optimization Prize. When outcomes are met, the
              same Wishocratic allocation distributes funds to whoever produced the results.
              You don&apos;t donate to charity and then separately invest. It&apos;s the same money.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NavItemLink
                item={incentiveAlignmentBondsPaperLink}
                variant="custom"
                external
                className="inline-flex items-center text-sm font-black text-brutal-pink uppercase hover:text-black transition-colors"
              >
                Read the IAB paper &rarr;
              </NavItemLink>
              <NavItemLink
                item={prizeLink}
                variant="custom"
                className="inline-flex items-center text-sm font-black text-black/40 uppercase hover:text-black transition-colors"
              >
                View the Prize &rarr;
              </NavItemLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
