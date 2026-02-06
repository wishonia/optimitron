const papers = [
  {
    title: "dFDA Specification",
    desc: "PIS, temporal alignment, Bradford Hill, effect sizes",
    pkg: "@optomitron/optimizer",
    href: "https://dfda-spec.warondisease.org",
  },
  {
    title: "Wishocracy",
    desc: "RAPPA, eigenvector weights, Citizen Alignment Scores",
    pkg: "@optomitron/wishocracy",
    href: "https://wishocracy.warondisease.org",
  },
  {
    title: "Optimal Policy Generator",
    desc: "Policy Impact Score, Causal Confidence Score, method weights",
    pkg: "@optomitron/opg",
    href: "https://opg.warondisease.org",
  },
  {
    title: "Optimal Budget Generator",
    desc: "Diminishing returns, Optimal Spending Level, Budget Impact Score",
    pkg: "@optomitron/obg",
    href: "https://obg.warondisease.org",
  },
  {
    title: "Incentive Alignment Bonds",
    desc: "IAB mechanism, smart contract campaign funding",
    pkg: "@optomitron/treasury",
    href: "https://iab.warondisease.org",
  },
  {
    title: "Optimocracy",
    desc: "Two-metric welfare function (shared by OPG + OBG)",
    pkg: "Shared",
    href: "https://optimocracy.warondisease.org",
  },
];

const packages = [
  { name: "@optomitron/optimizer", desc: "Domain-agnostic causal inference engine", status: "🟡 Alpha" },
  { name: "@optomitron/wishocracy", desc: "RAPPA preference aggregation", status: "🟡 Alpha" },
  { name: "@optomitron/opg", desc: "Optimal Policy Generator", status: "🟡 Alpha" },
  { name: "@optomitron/obg", desc: "Optimal Budget Generator", status: "🟡 Alpha" },
  { name: "@optomitron/data", desc: "Data fetchers & loaders (OECD, World Bank, etc.)", status: "🟡 Alpha" },
  { name: "@optomitron/web", desc: "This website", status: "🟢 Active" },
  { name: "@optomitron/extension", desc: "Chrome extension for personal health", status: "⚪ Planned" },
  { name: "@optomitron/chat-ui", desc: "Conversational chat UI", status: "⚪ Planned" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Mission */}
      <section className="mb-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
          What is Optomitron?
        </h1>
        <div className="prose prose-invert prose-slate max-w-none space-y-4">
          <p className="text-lg text-slate-300 leading-relaxed">
            <strong className="text-white">Optomitron optimizes everyone&apos;s health, wealth, and happiness</strong> — as well as
            that of humanity — using time series data and causal inference.
          </p>
          <p className="text-slate-400">
            We&apos;re building the operating system for evidence-based decision-making. Whether you&apos;re a person
            trying to figure out if magnesium helps you sleep, a city deciding where to spend its budget,
            or a business optimizing ad spend — the math is the same.
          </p>
          <p className="text-slate-400">
            Optomitron provides a universal causal inference engine that takes any two time series and answers:
            <em> Does changing X cause Y to change? By how much? What&apos;s the optimal value of X?</em>
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="mb-16">
        <h2 className="section-title">The Problem</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="text-3xl mb-3">🏛️</div>
            <h3 className="text-white font-bold mb-2">Governments fly blind</h3>
            <p className="text-sm text-slate-400">
              The US allocates a $6.75 trillion budget based on political negotiation, not evidence.
              Nobody knows the optimal amount to spend on education vs. healthcare vs. defense.
            </p>
          </div>
          <div className="card">
            <div className="text-3xl mb-3">🧑‍⚕️</div>
            <h3 className="text-white font-bold mb-2">Individuals fly blind</h3>
            <p className="text-sm text-slate-400">
              77% of Americans take dietary supplements but almost none know whether they actually work
              for them. Health decisions are based on anecdote, not data.
            </p>
          </div>
          <div className="card">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-white font-bold mb-2">Businesses guess</h3>
            <p className="text-sm text-slate-400">
              Marketing budgets, pricing strategies, and feature investments are set by intuition and
              A/B tests that measure correlation, not causation.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="section-title">Architecture</h2>
        <div className="card font-mono text-sm text-slate-400 overflow-x-auto">
          <pre>{`
 ┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
 │  COLLECT     │     │  INFER           │     │  RECOMMEND       │
 │              │     │                  │     │                  │
 │  Health data │────▶│  Temporal        │────▶│  Personal optimal│
 │  Preferences │     │  alignment       │     │  values & doses  │
 │  Outcomes    │     │  Bradford Hill   │     │  Policy rankings │
 │  Spending    │     │  Effect sizes    │     │  Budget levels   │
 │  Policies    │     │  PIS scoring     │     │  Alignment scores│
 └─────────────┘     └──────────────────┘     └──────────────────┘`}
          </pre>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { n: "1", t: "Collect", d: "Import time series data from any source" },
            { n: "2", t: "Align", d: "Pair predictors and outcomes with onset delays" },
            { n: "3", t: "Score", d: "Apply 9 Bradford Hill causation criteria" },
            { n: "4", t: "Optimize", d: "Find optimal predictor values with CIs" },
            { n: "5", t: "Recommend", d: "Generate actionable, graded recommendations" },
          ].map((s) => (
            <div key={s.n} className="card text-center py-4">
              <div className="text-primary-400 font-bold text-lg">{s.n}</div>
              <div className="text-white font-semibold text-sm">{s.t}</div>
              <div className="text-xs text-slate-500 mt-1">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Papers */}
      <section className="mb-16">
        <h2 className="section-title">📄 Papers</h2>
        <p className="text-sm text-slate-400 mb-6">
          Every algorithm in this codebase is defined in a published paper with exact formulas,
          worked examples, and parameter justifications.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {papers.map((p) => (
            <a
              key={p.href}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card group"
            >
              <h3 className="text-white font-bold group-hover:text-primary-400 transition-colors">
                {p.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{p.pkg}</p>
              <p className="text-sm text-slate-400 mt-2">{p.desc}</p>
              <span className="text-xs text-primary-400 mt-2 inline-block">Read paper →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="mb-16">
        <h2 className="section-title">📦 Packages</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-2 text-slate-400 font-medium">Package</th>
                <th className="text-left py-3 px-2 text-slate-400 font-medium">Description</th>
                <th className="text-center py-3 px-2 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.name} className="border-b border-slate-800">
                  <td className="py-2 px-2 font-mono text-xs text-primary-400">{p.name}</td>
                  <td className="py-2 px-2 text-slate-300">{p.desc}</td>
                  <td className="py-2 px-2 text-center text-xs">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Coming soon */}
      <section className="mb-16">
        <div className="card border-primary-500/30 text-center">
          <div className="text-4xl mb-4">🔮</div>
          <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
          <p className="text-slate-400 mb-4">
            Personal health optimization. Your data stays on your device. The causal engine runs
            locally in your browser. Discover which treatments, supplements, and habits actually
            improve <em>your</em> outcomes.
          </p>
          <a
            href="https://github.com/mikepsinn/optomitron"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            Star on GitHub
          </a>
        </div>
      </section>

      {/* GitHub */}
      <section className="text-center">
        <a
          href="https://github.com/mikepsinn/optomitron"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
        >
          github.com/mikepsinn/optomitron
        </a>
        <p className="text-xs text-slate-500 mt-2">
          MIT License © Mike P. Sinn
        </p>
      </section>
    </div>
  );
}
