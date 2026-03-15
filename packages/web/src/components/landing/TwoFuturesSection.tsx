import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { NavItemLink } from "@/components/navigation/NavItemLink";
import { prizeLink } from "@/lib/routes";

const pathA = [
  "Destructive economy: $101T/yr in governance dysfunction continues",
  "Antibiotic resistance goes terminal by 2050 — 10M deaths/yr",
  "102M more die waiting for treatments stuck in regulatory theatre",
  "Climate adaptation costs $2.8T/yr by 2030, mostly paid by the poorest",
  "AI optimises ad revenue while preventable disease kills 150,000/day",
];

const pathB = [
  "1% military redirect funds 47M clinical trial slots per year",
  "dFDA generates outcome labels at $929/patient instead of $41,000",
  "Cures flow in 36 years instead of 443 — 95% of conditions finally addressed",
  "Per-capita income gains of $14.9M–$52.1M across adopting jurisdictions",
  "GDP multiplier: every $1 in health spending returns $2–$4 in productivity",
];

export function TwoFuturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <ScrollReveal className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
          Two Futures. Same Species. Same Year.
        </h2>
        <p className="mt-4 text-lg text-black/60 max-w-2xl mx-auto font-medium">
          There isn&apos;t a technology problem. There isn&apos;t a knowledge problem.
          There&apos;s an allocation problem. These are the two paths, and you are
          currently on the left one. Not because you chose it. Because nobody chose
          otherwise.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <ScrollReveal direction="left">
          <div className="p-8 border-4 border-black bg-brutal-red/20 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full">
            <div className="text-xs font-black px-2.5 py-1 bg-brutal-red text-white inline-block mb-4 uppercase">
              Path A — Status Quo
            </div>
            <h3 className="text-xl font-black text-black mb-4">
              Do Nothing. Keep Arguing.
            </h3>
            <ul className="space-y-3">
              {pathA.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-black/70 font-medium">
                  <span className="text-brutal-red font-black shrink-0">&times;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.15}>
          <div className="p-8 border-4 border-black bg-brutal-cyan/20 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full">
            <div className="text-xs font-black px-2.5 py-1 bg-brutal-cyan text-black inline-block mb-4 uppercase">
              Path B — 1% Treaty
            </div>
            <h3 className="text-xl font-black text-black mb-4">
              Redirect 1%. Fix Everything.
            </h3>
            <ul className="space-y-3">
              {pathB.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-black/70 font-medium">
                  <span className="text-brutal-cyan font-black shrink-0">&check;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.3}>
        <div className="p-8 border-4 border-black bg-brutal-yellow shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
          <p className="text-xl font-black text-black mb-2">
            Doing nothing IS choosing Path A.
          </p>
          <p className="text-black/60 font-medium max-w-2xl mx-auto mb-6">
            On my planet, inaction was classified as a policy decision in year three.
            It has the same consequences as action. It just feels less responsible.
            It isn&apos;t.
          </p>
          <NavItemLink
            item={prizeLink}
            variant="custom"
            className="px-8 py-3.5 bg-black text-white font-black uppercase text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Choose Path B
          </NavItemLink>
        </div>
      </ScrollReveal>
    </section>
  );
}
