import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { NavItemLink } from "@/components/navigation/NavItemLink";
import {
  earthOptimizationPrizePaperLink,
  prizeLink,
} from "@/lib/routes";

const prizeFeatures = [
  {
    title: "Outcome-Based",
    description: "Not a grant. Grants fund promises. This funds results. You get paid when measurable suffering decreases. Novel concept for your species.",
  },
  {
    title: "Open to Anyone",
    description: "Researchers. Activists. Policy makers. Engineers. The person who figures out how to end malaria in their spare time. We do not care about your credentials. We care about your numbers.",
  },
  {
    title: "Escrow Until Impact",
    description: "Money sits in transparent escrow until independently verified outcomes are achieved. No spending it on conferences about spending it on conferences.",
  },
  {
    title: "Tied to the Plan",
    description: "The prize rewards whoever contributes most to actually ending war and disease. Not writing about ending them. Not holding summits about ending them. Ending them.",
  },
];

export function EarthOptimizationPrizeSection() {
  return (
    <section className="bg-brutal-yellow/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            The Earth Optimization Prize
          </h2>
          <p className="mt-4 text-lg text-black/60 max-w-2xl mx-auto font-medium">
            A standing reward for whoever deserves the most credit for realising the
            plan to end war and disease. Not for writing a paper about it. Not for
            giving a TED talk about it. For actually doing it. Your species has a lot
            of prizes for describing problems. This one is for solving them.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {prizeFeatures.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1}>
              <div className="p-6 border-4 border-black bg-brutal-yellow shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full">
                <h3 className="text-lg font-black text-black mb-3 uppercase">
                  {feature.title}
                </h3>
                <p className="text-sm text-black/70 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="p-8 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
            <p className="text-black/70 font-medium max-w-2xl mx-auto mb-6">
              On my planet, the person who eliminated disease got a small statue and
              a week off. You lot give Nobel Prizes for describing the problem and then
              do nothing about it for forty years. Let us try paying for outcomes instead.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NavItemLink
                item={prizeLink}
                variant="custom"
                className="px-8 py-3.5 bg-brutal-yellow text-black font-black uppercase text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                View the Prize
              </NavItemLink>
              <NavItemLink
                item={earthOptimizationPrizePaperLink}
                variant="custom"
                external
                className="inline-flex items-center text-sm font-black text-black/40 uppercase hover:text-black transition-colors"
              >
                Read the paper &rarr;
              </NavItemLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
