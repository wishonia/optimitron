import Link from "next/link";

const architectureLayers = [
  {
    layer: 1,
    emoji: "🔒",
    name: "Digital Twin Safe",
    description:
      "All personal data stays on your device. The causal engine runs locally in pure TypeScript — no server, no surveillance, no data leaving your control.",
    color: "bg-emerald-200",
  },
  {
    layer: 2,
    emoji: "🪪",
    name: "Decentralized Identity",
    description:
      "Proof-of-personhood via zero-knowledge proofs. One person, one vote — verified humanity without revealing identity.",
    color: "bg-cyan-200",
  },
  {
    layer: 3,
    emoji: "⛓️",
    name: "Anonymous On-Chain",
    description:
      "Anonymized effect sizes and preference weights stored on a public chain. No single entity owns the data — it belongs to the commons.",
    color: "bg-purple-200",
  },
  {
    layer: 4,
    emoji: "📊",
    name: "Aggregation Server",
    description:
      "Meta-analysis across all submissions produces population-level insights: treatment rankings, policy scores, and politician alignment.",
    color: "bg-yellow-200",
  },
  {
    layer: 5,
    emoji: "💸",
    name: "Incentive Layer",
    description:
      "Data contribution tokens and Incentive Alignment Bonds automatically fund campaigns for politicians who represent citizen preferences.",
    color: "bg-pink-200",
  },
];

const useCases = [
  {
    icon: "🏥",
    title: "For Individuals",
    description:
      "Import from Apple Health, Fitbit, Oura — discover which supplements, habits, and treatments actually work for YOU. Get optimal dosages, not just averages.",
    cta: "Import Your Data",
    href: "/import",
  },
  {
    icon: "🏛️",
    title: "For Governments",
    description:
      "Any jurisdiction can deploy Optomitron as a governance OS. Collect citizen preferences, optimize budgets, score policies, and hold politicians accountable.",
    cta: "View Dashboard",
    href: "/dashboard",
  },
  {
    icon: "📈",
    title: "For Businesses",
    description:
      "The same causal engine works for ad spend, pricing, feature decisions — any two time series. Domain-agnostic by design.",
    cta: "Learn More",
    href: "https://github.com/mikepsinn/optomitron",
  },
];

const stats = [
  { value: "10", label: "Packages" },
  { value: "780+", label: "Tests" },
  { value: "5", label: "Research Papers" },
  { value: "60+", label: "Datasets" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm font-bold text-black mb-8">
              <span className="w-2 h-2 bg-black animate-pulse" />
              Open source · MIT Licensed
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-tight text-black">
              Optomitron
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-black max-w-4xl mx-auto leading-relaxed">
              Optimizes everyone&apos;s health, wealth, and happiness — as well as that of humanity — using{" "}
              <span className="bg-yellow-300 px-1 font-bold">time series data</span> and{" "}
              <span className="bg-pink-300 px-1 font-bold">causal inference</span>.
            </p>
            <p className="mt-4 text-lg text-black/60 max-w-3xl mx-auto font-medium">
              The operating system for evidence-based decision-making. Whether you&apos;re a person
              tracking supplements, a government allocating budgets, or a business optimizing spend —
              the math is the same.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 bg-pink-500 text-white font-black uppercase text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                View Dashboard
              </Link>
              <Link
                href="/import"
                className="px-8 py-3.5 bg-white text-black font-black uppercase text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-cyan-300 transition-all"
              >
                Import Your Data
              </Link>
              <Link
                href="/preferences"
                className="px-8 py-3.5 bg-white text-black font-black uppercase text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-yellow-300 transition-all"
              >
                Express Preferences
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-3xl font-black text-pink-500">
                  {stat.value}
                </div>
                <div className="text-sm text-black/60 font-bold mt-1 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Five-Layer Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">Five-Layer Architecture</h2>
          <p className="mt-4 text-lg text-black/60 max-w-2xl mx-auto font-medium">
            A decentralized system that turns raw data into optimal decisions while keeping
            your personal data private and the public knowledge open.
          </p>
        </div>
        <div className="space-y-4">
          {architectureLayers.map((layer) => (
            <div
              key={layer.layer}
              className={`p-6 sm:p-8 border-2 border-black ${layer.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-black px-2.5 py-1 bg-black text-white">
                    Layer {layer.layer}
                  </span>
                  <span className="text-3xl">{layer.emoji}</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-black">{layer.name}</h3>
                  <p className="text-black/70 mt-1 leading-relaxed font-medium">
                    {layer.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">One Engine, Every Domain</h2>
          <p className="mt-4 text-lg text-black/60 max-w-2xl mx-auto font-medium">
            Feed any two time series and Optomitron answers: Does changing X cause Y to change?
            By how much? What&apos;s the optimal value of X?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="p-8 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col"
            >
              <div className="text-4xl mb-4">{useCase.icon}</div>
              <h3 className="text-xl font-black text-black mb-3">{useCase.title}</h3>
              <p className="text-black/60 text-sm leading-relaxed flex-grow font-medium">
                {useCase.description}
              </p>
              <Link
                href={useCase.href}
                className="mt-6 inline-flex items-center text-sm font-black text-pink-500 hover:text-pink-700 uppercase transition-colors"
              >
                {useCase.cta} &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="p-8 sm:p-12 bg-cyan-100 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-12 uppercase tracking-tight text-black">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { step: 1, icon: "📥", title: "Collect", desc: "Import time series data from wearables, government stats, or business metrics" },
              { step: 2, icon: "🔗", title: "Align", desc: "Pair predictor and outcome measurements using configurable onset delays" },
              { step: 3, icon: "🔬", title: "Score", desc: "Apply Bradford Hill criteria via saturation functions for Predictor Impact Score" },
              { step: 4, icon: "🎯", title: "Optimize", desc: "Find optimal predictor values with confidence intervals" },
              { step: 5, icon: "💡", title: "Recommend", desc: "Generate actionable recommendations: dosage, policy, budget, candidate" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-pink-500 border-2 border-black flex items-center justify-center mx-auto mb-4 text-lg font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {item.step}
                </div>
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-black text-black mb-1 uppercase">{item.title}</h3>
                <p className="text-xs text-black/60 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center p-12 bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black mb-4 uppercase tracking-tight text-black">
            The $6.75 Trillion Question
          </h2>
          <p className="text-black/70 max-w-2xl mx-auto mb-4 leading-relaxed font-medium">
            The US federal government allocates its budget based on political negotiation, not evidence.
            Nobody knows the optimal amount to spend on education vs. healthcare vs. defense.
          </p>
          <p className="text-black/70 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
            Optomitron changes that. Any jurisdiction — city, county, state, or country — can deploy
            evidence-based governance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/preferences"
              className="px-8 py-3 bg-black text-white font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Express Your Preferences
            </Link>
            <a
              href="https://github.com/mikepsinn/optomitron"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-black font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              View Source on GitHub &rarr;
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
