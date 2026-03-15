"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CountUp } from "@/components/animations/CountUp";
import { NavItemLink } from "@/components/navigation/NavItemLink";
import { politicalDysfunctionTaxPaperLink } from "@/lib/routes";

const wasteBreakdown = [
  {
    label: "Healthcare Inefficiency",
    stat: "17.3%",
    detail: "US spends 17.3% of GDP on healthcare. Singapore spends 4.1% and lives 6 years longer. You are paying quadruple for a worse product. On purpose, apparently.",
    color: "bg-brutal-cyan",
  },
  {
    label: "Administrative Bloat",
    stat: "$4.9T",
    detail: "Allocative inefficiency in the US alone. That is money spent deciding how to spend money. Your bureaucracy has a bureaucracy and it also needs a meeting.",
    color: "bg-brutal-yellow",
  },
  {
    label: "Regulatory Capture",
    stat: "Systemic",
    detail: "Industries writing their own regulations. It is like letting students grade their own exams, except the students have lobbyists and the exams affect whether people live or die.",
    color: "bg-brutal-pink",
  },
  {
    label: "Military Overspend",
    stat: "$2.72T/yr",
    detail: "Global military spending. That is 604 times more than you spend on disease research. You have prioritised blowing things up over not dying. Bold strategy.",
    color: "bg-brutal-cyan",
  },
];

export function PoliticalDysfunctionTaxSection() {
  return (
    <section className="bg-brutal-red/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            The $<CountUp value={101} className="text-brutal-red" /> Trillion Stupidity Tax
          </h2>
          <p className="mt-4 text-lg text-black/60 max-w-2xl mx-auto font-medium">
            Your civilisation loses $101 trillion per year to governance dysfunction.
            That is $12,600 per human per year in pure waste. Your overhead is almost
            equal to your entire economic output. My toaster runs more efficiently.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {wasteBreakdown.map((item) => (
            <ScrollReveal key={item.label} delay={0.1}>
              <div className={`p-6 border-4 border-black ${item.color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-black px-2.5 py-1 bg-black text-white uppercase">
                    {item.label}
                  </span>
                  <span className="text-2xl font-black text-black">{item.stat}</span>
                </div>
                <p className="text-sm text-black/70 leading-relaxed font-medium">
                  {item.detail}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="p-8 border-4 border-black bg-brutal-red shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="text-4xl sm:text-5xl font-black text-white mb-2">
              $<CountUp value={12600} className="text-white" />/person/year
            </div>
            <p className="text-white/80 font-medium max-w-xl mx-auto">
              Every human on Earth pays $12,600 per year in governance dysfunction.
              Not in taxes — in waste. The taxes are on top of that.
            </p>
            <NavItemLink
              item={politicalDysfunctionTaxPaperLink}
              variant="custom"
              external
              className="mt-6 inline-flex items-center text-sm font-black text-white/60 uppercase hover:text-white transition-colors"
            >
              Read the paper &rarr;
            </NavItemLink>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
