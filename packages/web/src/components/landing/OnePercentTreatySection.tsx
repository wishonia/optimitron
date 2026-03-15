"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CountUp } from "@/components/animations/CountUp";
import { NavItemLink } from "@/components/navigation/NavItemLink";
import { onePercentTreatyPaperLink } from "@/lib/routes";

const treatySteps = [
  {
    before: "$2.72T/yr",
    label: "Global Military Budget",
    after: "Take 1%",
    description: "Your species spends $2.72 trillion per year on the ability to destroy itself. We are asking for one percent of that. One. Percent.",
  },
  {
    before: "$41K/patient",
    label: "Trial Cost",
    after: "$929/patient",
    description: "Current clinical trials cost $41,000 per patient because you insist on running them in the most expensive way possible. Scale fixes that.",
  },
  {
    before: "1.9M/yr",
    label: "Trial Capacity",
    after: "23.4M/yr",
    description: "From 1.9 million patients per year to 23.4 million. Same willing participants. Just actually letting them participate.",
  },
  {
    before: "443 years",
    label: "Treatment Queue",
    after: "36 years",
    description: "The 443-year queue to test treatments for every known disease shrinks to 36 years. Still embarrassing, but survivable.",
  },
];

export function OnePercentTreatySection() {
  return (
    <section className="bg-brutal-cyan/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            The 1% Treaty
          </h2>
          <p className="mt-4 text-lg text-black/60 max-w-2xl mx-auto font-medium">
            Take one percent of what you spend on killing each other and spend it on
            not dying instead. This is not a radical proposal. It is basic arithmetic.
            I genuinely do not understand what is taking so long.
          </p>
        </ScrollReveal>

        <div className="space-y-4 mb-12">
          {treatySteps.map((step, i) => (
            <ScrollReveal key={step.label} delay={i * 0.1}>
              <div className="p-6 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-lg font-black text-black/30 line-through">
                      {step.before}
                    </span>
                    <span className="text-brutal-cyan font-black text-xl">&rarr;</span>
                    <span className="text-lg font-black text-brutal-cyan">
                      {step.after}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <span className="text-xs font-black px-2.5 py-1 bg-black text-white uppercase">
                      {step.label}
                    </span>
                    <p className="text-sm text-black/70 leading-relaxed font-medium mt-2">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div className="p-8 border-4 border-black bg-brutal-cyan shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="text-4xl sm:text-5xl font-black text-black mb-2">
              <CountUp value={10.7} suffix="B" className="text-black" /> Lives Saved
            </div>
            <p className="text-black/70 font-medium max-w-xl mx-auto">
              10.7 billion deaths prevented. ROI: essentially infinite. The only
              thing standing between you and this is the part where you actually do it.
            </p>
            <NavItemLink
              item={onePercentTreatyPaperLink}
              variant="custom"
              external
              className="mt-6 inline-flex items-center text-sm font-black text-black/60 uppercase hover:text-black transition-colors"
            >
              Read the paper &rarr;
            </NavItemLink>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
