import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StepReveal } from "@/components/animations/StepReveal";
import { NavItemLink } from "@/components/navigation/NavItemLink";
import { fullManualPaperLink } from "@/lib/routes";

const steps = [
  {
    step: 1,
    title: "Sell IABs",
    description:
      "Investors buy Incentive Alignment Bonds because the return profile is attractive. Fail? ~4.2x return from stablecoin yield. Succeed? Vote-proportional revenue share — the more demand you prove via referrals, the bigger your cut. The money flowing in IS the prize pool. No fundraising galas required.",
    why: "Self-interest. People like money.",
  },
  {
    step: 2,
    title: "The Great Clicking",
    description:
      "Citizens do pairwise comparisons on their priorities. Ten comparisons, two minutes, and the eigenvector decomposition produces a stable budget allocation. Enough people click and you have a mandate no politician can ignore.",
    why: "It takes less time than complaining on social media.",
  },
  {
    step: 3,
    title: "Bribe the Bribers",
    description:
      "Smart contracts route campaign funds to politicians with the highest Citizen Alignment Scores. Vote with your constituents? Get funded. Ignore them? Get defunded. Automatically. By code.",
    why: "Politicians follow money. This redirects the money.",
  },
  {
    step: 4,
    title: "Purchase Democracy",
    description:
      "AI agents run ads and social media campaigns for high-alignment candidates. The bonds fund the campaigns. The data picks the candidates. The market sets the prices. No party apparatus needed.",
    why: "Cheaper than the current system and it actually works.",
  },
  {
    step: 5,
    title: "Enjoy Results",
    description:
      "Median healthy life years go up. Median real income goes up. Bondholders get paid. Prize pool distributes to implementers who produced outcomes. Everyone wins except the middlemen. Oh well.",
    why: "You like living longer and having more money. Presumably.",
  },
];

export function ImplementationPlanSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <ScrollReveal className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
          Five Steps. No Altruism Required.
        </h2>
        <p className="mt-4 text-lg text-black/60 max-w-2xl mx-auto font-medium">
          Every step is driven by self-interest. That&apos;s the point. Systems that
          require everyone to be nice don&apos;t scale. Systems that make selfishness
          productive do. Ask any economist. Or any alien who&apos;s been running a
          planet for four millennia.
        </p>
      </ScrollReveal>

      <StepReveal className="space-y-6" staggerDelay={0.15}>
        {steps.map((item) => (
          <div
            key={item.step}
            className="p-6 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-12 h-12 bg-brutal-pink border-2 border-black flex items-center justify-center text-lg font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-black mb-2 uppercase">
                  {item.title}
                </h3>
                <p className="text-sm text-black/70 leading-relaxed font-medium mb-2">
                  {item.description}
                </p>
                <p className="text-xs font-black text-brutal-pink uppercase">
                  Why it happens: {item.why}
                </p>
              </div>
            </div>
          </div>
        ))}
      </StepReveal>

      <ScrollReveal delay={0.5}>
        <div className="text-center mt-8">
          <NavItemLink
            item={fullManualPaperLink}
            variant="custom"
            external
            className="inline-flex items-center text-sm font-black text-brutal-pink uppercase hover:text-black transition-colors"
          >
            Read the full manual &rarr;
          </NavItemLink>
        </div>
      </ScrollReveal>
    </section>
  );
}
