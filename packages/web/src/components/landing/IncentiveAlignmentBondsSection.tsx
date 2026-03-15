"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { NavItemLink } from "@/components/navigation/NavItemLink";
import {
  incentiveAlignmentBondsPaperLink,
  wishocracyPaperLink,
} from "@/lib/routes";

const pipelineSteps = [
  {
    step: "01",
    title: "Citizens Donate",
    description: "Money goes into a transparent crypto treasury. No PAC. No dark money. Every transaction is on-chain and auditable by anyone with a browser.",
    color: "bg-brutal-pink",
  },
  {
    step: "02",
    title: "Alignment Scores Update",
    description: "Every politician gets a Citizen Alignment Score based on how well their actual votes match what citizens actually want. Not what they promised. What they did.",
    color: "bg-brutal-cyan",
  },
  {
    step: "03",
    title: "Smart Contracts Distribute",
    description: "Code allocates campaign funds automatically. High alignment score? More funding. Low alignment score? Less funding. No middleman. No negotiation. Just math.",
    color: "bg-brutal-yellow",
  },
  {
    step: "04",
    title: "Incentives Flip",
    description: "Politicians who vote with their constituents get funded. Those who do not, do not. It is bribery, technically. Except the bribe is to do your job. Which should not require a bribe, but here we are.",
    color: "bg-brutal-pink",
  },
];

export function IncentiveAlignmentBondsSection() {
  return (
    <section className="bg-brutal-pink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Legally Bribing Politicians Into Doing the Right Thing
          </h2>
          <p className="mt-4 text-lg text-black/60 max-w-2xl mx-auto font-medium">
            Your politicians are already being bribed. By industries. To do the wrong
            thing. We are just proposing you outbid them. With smart contracts. So the
            money goes to whoever actually represents you. Revolutionary concept, I know.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {pipelineSteps.map((item, i) => (
            <ScrollReveal key={item.step} delay={i * 0.1}>
              <div className={`p-6 border-4 border-black ${item.color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full`}>
                <div className="text-xs font-black px-2.5 py-1 bg-black text-white inline-block mb-4 uppercase">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-black text-black mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-black/70 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="p-8 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
            <p className="text-black/70 font-medium max-w-2xl mx-auto mb-6">
              On my planet, public officials who ignore citizen preferences get
              reassigned to waste processing within four minutes. You lot re-elect
              yours. Incentive Alignment Bonds are the compromise.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NavItemLink
                item={incentiveAlignmentBondsPaperLink}
                variant="custom"
                external
                className="inline-flex items-center text-sm font-black text-brutal-pink uppercase hover:text-black transition-colors"
              >
                Read the paper &rarr;
              </NavItemLink>
              <NavItemLink
                item={wishocracyPaperLink}
                variant="custom"
                external
                className="inline-flex items-center text-sm font-black text-black/40 uppercase hover:text-black transition-colors"
              >
                How alignment scores work &rarr;
              </NavItemLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
