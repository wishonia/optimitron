import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerGrid } from "@/components/animations/StaggerGrid";
import { CountUp } from "@/components/animations/CountUp";
import { NavItemLink } from "@/components/navigation/NavItemLink";
import { dfdaSpecPaperLink } from "@/lib/routes";

const stats = [
  { label: "Cost per Patient", from: "$41,000", to: "$929", color: "text-brutal-cyan" },
  { label: "Capacity", from: "1.9M/yr", to: "23.4M/yr", color: "text-brutal-pink" },
  { label: "Conditions Untreated", value: "95%", color: "text-brutal-red" },
  { label: "Approval Queue", from: "443 years", to: "36 years", color: "text-brutal-yellow" },
];

const stages = [
  {
    stage: "Stage 1",
    title: "Signal Detection",
    method: "Real-World Evidence",
    cost: "~$1/patient",
    description:
      "Use data people are already generating — prescriptions, wearables, lab results — to detect which interventions actually correlate with outcomes. No recruitment. No placebo groups. Just pattern recognition on the data that already exists.",
    color: "bg-brutal-cyan",
  },
  {
    stage: "Stage 2",
    title: "Pragmatic Trials",
    method: "Confirmatory RCTs",
    cost: "~$929/patient",
    description:
      "Once signals are detected, run pragmatic trials embedded in routine care. Same doctors, same clinics, real patients. Not the $41,000-per-patient theatrical productions your FDA currently requires. Just rigorous evidence at human scale.",
    color: "bg-brutal-pink",
  },
];

export function DecentralizedFDASection() {
  return (
    <section className="bg-brutal-cyan/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Your Decentralized FDA
          </h2>
          <p className="mt-4 text-lg text-black/60 max-w-2xl mx-auto font-medium">
            Your FDA makes treatments wait 8.2 years AFTER they&apos;ve already been
            proven safe. Just sitting there. Being safe. While people die waiting.
            This is the medical infrastructure that all those bonds fund.
          </p>
        </ScrollReveal>

        {/* Stats strip */}
        <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12" staggerDelay={0.08}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-5 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center"
            >
              <div className="text-xs font-black uppercase text-black/50 mb-2">
                {stat.label}
              </div>
              {"value" in stat ? (
                <div className={`text-2xl font-black ${stat.color}`}>
                  <CountUp value={95} suffix="%" className={stat.color} />
                </div>
              ) : (
                <div>
                  <span className="text-sm font-bold text-black/40 line-through">
                    {stat.from}
                  </span>
                  <span className="text-black/40 mx-1">&rarr;</span>
                  <span className={`text-xl font-black ${stat.color}`}>
                    {stat.to}
                  </span>
                </div>
              )}
            </div>
          ))}
        </StaggerGrid>

        {/* Two-stage pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {stages.map((item, i) => (
            <ScrollReveal key={item.stage} delay={i * 0.15}>
              <div className={`p-6 border-4 border-black ${item.color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-black px-2.5 py-1 bg-black text-white uppercase">
                    {item.stage}
                  </span>
                  <span className="text-xs font-black px-2.5 py-1 bg-white border-2 border-black">
                    {item.cost}
                  </span>
                </div>
                <h3 className="text-xl font-black text-black mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-black/50 mb-3 uppercase">
                  {item.method}
                </p>
                <p className="text-sm text-black/70 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Outcome Labels callout */}
        <ScrollReveal delay={0.3}>
          <div className="p-6 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
            <p className="text-lg font-black text-black mb-2">
              Consumer Reports, but for not dying.
            </p>
            <p className="text-black/60 font-medium max-w-2xl mx-auto mb-4">
              Every treatment gets an Outcome Label — effectiveness, side effects,
              optimal dosage — generated from millions of real patients, not 200
              undergraduates in a lab. Updated continuously, not once every 17 years.
            </p>
            <NavItemLink
              item={dfdaSpecPaperLink}
              variant="custom"
              external
              className="inline-flex items-center text-sm font-black text-brutal-cyan uppercase hover:text-black transition-colors"
            >
              Read the dFDA spec &rarr;
            </NavItemLink>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
