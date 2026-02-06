import Link from "next/link";

const architectureLayers = [
  {
    layer: 1,
    emoji: "🔒",
    name: "Digital Twin Safe",
    description:
      "All personal data stays on your device. The causal engine runs locally in pure TypeScript — no server, no surveillance, no data leaving your control.",
    color: "from-emerald-500/20 to-emerald-600/5",
    borderColor: "border-emerald-500/30",
  },
  {
    layer: 2,
    emoji: "🪪",
    name: "Decentralized Identity",
    description:
      "Proof-of-personhood via zero-knowledge proofs. One person, one vote — verified humanity without revealing identity.",
    color: "from-blue-500/20 to-blue-600/5",
    borderColor: "border-blue-500/30",
  },
  {
    layer: 3,
    emoji: "⛓️",
    name: "Anonymous On-Chain",
    description:
      "Anonymized effect sizes and preference weights stored on a public chain. No single entity owns the data — it belongs to the commons.",
    color: "from-purple-500/20 to-purple-600/5",
    borderColor: "border-purple-500/30",
  },
  {
    layer: 4,
    emoji: "📊",
    name: "Aggregation Server",
    description:
      "Meta-analysis across all submissions produces population-level insights: treatment rankings, policy scores, and politician alignment.",
    color: "from-amber-500/20 to-amber-600/5",
    borderColor: "border-amber-500/30",
  },
  {
    layer: 5,
    emoji: "💸",
    name: "Incentive Layer",
    description:
      "Data contribution tokens and Incentive Alignment Bonds automatically fund campaigns for politicians who represent citizen preferences.",
    color: "from-pink-500/20 to-pink-600/5",
    borderColor: "border-pink-500/30",
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-sm text-primary-400 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Open source · MIT Licensed
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Optomitron
              </span>
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Optimizes everyone&apos;s health, wealth, and happiness — as well as that of humanity — using{" "}
              <span className="text-white font-medium">time series data</span> and{" "}
              <span className="text-white font-medium">causal inference</span>.
            </p>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              The operating system for evidence-based decision-making. Whether you&apos;re a person
              tracking supplements, a government allocating budgets, or a business optimizing spend —
              the math is the same.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors text-lg shadow-lg shadow-primary-600/25"
              >
                View Dashboard
              </Link>
              <Link
                href="/import"
                className="px-8 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
              >
                Import Your Data
              </Link>
              <Link
                href="/preferences"
                className="px-8 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
              >
                Express Preferences
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Five-Layer Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">Five-Layer Architecture</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            A decentralized system that turns raw data into optimal decisions while keeping
            your personal data private and the public knowledge open.
          </p>
        </div>
        <div className="space-y-4">
          {architectureLayers.map((layer) => (
            <div
              key={layer.layer}
              className={`p-6 sm:p-8 rounded-2xl border ${layer.borderColor} bg-gradient-to-r ${layer.color} transition-all hover:scale-[1.01]`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
                    Layer {layer.layer}
                  </span>
                  <span className="text-3xl">{layer.emoji}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{layer.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
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
          <h2 className="text-3xl sm:text-4xl font-bold">One Engine, Every Domain</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Feed any two time series and Optomitron answers: Does changing X cause Y to change?
            By how much? What&apos;s the optimal value of X?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary-500/50 transition-all hover:shadow-lg hover:shadow-primary-500/5 flex flex-col"
            >
              <div className="text-4xl mb-4">{useCase.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow">
                {useCase.description}
              </p>
              <Link
                href={useCase.href}
                className="mt-6 inline-flex items-center text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors"
              >
                {useCase.cta} &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-gray-100 dark:from-gray-900 to-gray-50 dark:to-gray-950 border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { step: 1, icon: "📥", title: "Collect", desc: "Import time series data from wearables, government stats, or business metrics" },
              { step: 2, icon: "🔗", title: "Align", desc: "Pair predictor and outcome measurements using configurable onset delays" },
              { step: 3, icon: "🔬", title: "Score", desc: "Apply Bradford Hill criteria via saturation functions for Predictor Impact Score" },
              { step: 4, icon: "🎯", title: "Optimize", desc: "Find optimal predictor values with confidence intervals" },
              { step: 5, icon: "💡", title: "Recommend", desc: "Generate actionable recommendations: dosage, policy, budget, candidate" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-4 text-lg font-bold text-primary-500">
                  {item.step}
                </div>
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center p-12 rounded-3xl bg-gradient-to-r from-primary-600/10 via-purple-600/10 to-pink-600/10 border border-primary-500/20">
          <h2 className="text-3xl font-bold mb-4">
            The \.75 Trillion Question
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4 leading-relaxed">
            The US federal government allocates its budget based on political negotiation, not evidence.
            Nobody knows the optimal amount to spend on education vs. healthcare vs. defense.
          </p>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Optomitron changes that. Any jurisdiction — city, county, state, or country — can deploy
            evidence-based governance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/preferences"
              className="px-8 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
            >
              Express Your Preferences
            </Link>
            <a
              href="https://github.com/mikepsinn/optomitron"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              View Source on GitHub &rarr;
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
