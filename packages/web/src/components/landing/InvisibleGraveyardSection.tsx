"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CountUp } from "@/components/animations/CountUp";
import { NavItemLink } from "@/components/navigation/NavItemLink";
import { invisibleGraveyardPaperLink, dfdaSpecPaperLink } from "@/lib/routes";

const graveyardStats = [
  {
    value: 95,
    suffix: "%",
    label: "Diseases Untreated",
    detail: "95% of known diseases have zero approved treatments. Not because cures are impossible. Because nobody ran the trial.",
  },
  {
    value: 8.2,
    suffix: " years",
    label: "Post-Safety Delay",
    detail: "The FDA makes treatments wait 8.2 years AFTER they have been proven safe. Just sitting there. Being safe. While people die.",
  },
  {
    value: 102,
    suffix: "M deaths",
    label: "Historical Efficacy Lag",
    detail: "102 million people have died waiting for treatments that were already proven safe but had not yet cleared the efficacy queue.",
  },
  {
    value: 0.06,
    suffix: "%",
    label: "Trial Capacity Used",
    detail: "1.9 million trial slots per year. 1.08 billion willing participants. You are using 0.06% of available capacity. On my planet this would be a crime.",
  },
];

export function InvisibleGraveyardSection() {
  return (
    <section className="bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            The Invisible Graveyard
          </h2>
          <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto font-medium">
            150,000 people die every day from treatable diseases. Not untreatable.
            Treatable. You just have not gotten around to testing the treatments yet.
            At your current pace, clearing the backlog takes 443 years.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {graveyardStats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <div className="p-6 border-4 border-brutal-yellow bg-brutal-yellow/10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-3xl sm:text-4xl font-black text-brutal-yellow mb-2">
                  <CountUp value={stat.value} suffix={stat.suffix} className="text-brutal-yellow" />
                </div>
                <h3 className="text-sm font-black text-white uppercase mb-2">
                  {stat.label}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed font-medium">
                  {stat.detail}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="p-8 border-4 border-brutal-yellow bg-brutal-yellow shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="text-3xl sm:text-4xl font-black text-black mb-2">
              $<CountUp value={1.19} className="text-black" /> Quadrillion
            </div>
            <p className="text-black/70 font-medium max-w-xl mx-auto mb-1">
              Economic value of lives lost to regulatory delay. At 15 new treatments
              per year, your 443-year queue means most of these diseases will outlive
              your civilisation. Which, given your other numbers, might not be very long.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <NavItemLink
                item={invisibleGraveyardPaperLink}
                variant="custom"
                external
                className="inline-flex items-center text-sm font-black text-black/60 uppercase hover:text-black transition-colors"
              >
                Read the paper &rarr;
              </NavItemLink>
              <NavItemLink
                item={dfdaSpecPaperLink}
                variant="custom"
                external
                className="inline-flex items-center text-sm font-black text-black/60 uppercase hover:text-black transition-colors"
              >
                See the solution (dFDA) &rarr;
              </NavItemLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
