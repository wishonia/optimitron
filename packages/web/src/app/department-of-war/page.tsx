"use client";

import { NavItemLink } from "@/components/navigation/NavItemLink";
import { budgetLink, federalReserveLink, wishocracyLink } from "@/lib/routes";
import { Stat } from "@/components/ui/stat";
import { fmtParam, fmtRaw } from "@/lib/format-parameter";
import {
  GLOBAL_MILITARY_SPENDING_ANNUAL_2024,
  CUMULATIVE_MILITARY_SPENDING_FED_ERA,
  MONEY_PRINTER_WAR_DEATHS,
  ECONOMIC_MULTIPLIER_MILITARY_SPENDING,
  ECONOMIC_MULTIPLIER_HEALTHCARE_INVESTMENT,
  GLOBAL_CLINICAL_TRIALS_SPENDING_ANNUAL,
} from "@/lib/parameters-calculations-citations";

const milSpend = GLOBAL_MILITARY_SPENDING_ANNUAL_2024.value;
const milMultiplier = ECONOMIC_MULTIPLIER_MILITARY_SPENDING.value;
const healthMultiplier = ECONOMIC_MULTIPLIER_HEALTHCARE_INVESTMENT.value;
const totalAlt = 150e9 + 20e9 + GLOBAL_CLINICAL_TRIALS_SPENDING_ANNUAL.value + 45e9;

const couldHaveBought = [
  {
    instead: "Clean water for every human on Earth",
    price: "$150 billion (one-time)",
    ratio: `${((150e9 / milSpend) * 100).toFixed(1)}% of one year's military budget. You could do it in a weekend.`,
  },
  {
    instead: "End global homelessness",
    price: "$20 billion/yr",
    ratio: `${((20e9 / milSpend) * 100).toFixed(1)}% of what you spend on war. A rounding error.`,
  },
  {
    instead: "Fund all global clinical trials",
    price: `${fmtParam(GLOBAL_CLINICAL_TRIALS_SPENDING_ANNUAL, 3).replace("$", "$")}/yr`,
    ratio: `${((GLOBAL_CLINICAL_TRIALS_SPENDING_ANNUAL.value / milSpend) * 100).toFixed(1)}% of military spending. You spend more on military bands.`,
  },
  {
    instead: "Universal basic nutrition",
    price: "$45 billion/yr",
    ratio: `${((45e9 / milSpend) * 100).toFixed(1)}%. Less than the Pentagon loses track of in accounting errors annually.`,
  },
];

export default function DepartmentOfWarPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-16">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-brutal-pink">
            Department of War
          </p>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black md:text-5xl">
            We Don&apos;t Have One
          </h1>
          <p className="text-lg font-medium leading-relaxed text-black/80">
            Because war is fucking stupid.
          </p>
          <p className="font-medium leading-relaxed text-black/60">
            I realise that&apos;s not the kind of language you expect from a
            governance platform. But I&apos;ve been running a civilisation for
            4,237 years, and after modelling every possible resource-allocation
            strategy, the one where you spend{" "}
            <Stat param={GLOBAL_MILITARY_SPENDING_ANNUAL_2024} format={(p) => fmtParam({ ...p, unit: "USD" })} />{" "}
            per year on exploding each other consistently ranks last. Dead last.
            Below &ldquo;doing literally nothing.&rdquo;
          </p>
        </div>
      </section>

      {/* The Numbers */}
      <section className="mb-16">
        <h2 className="mb-4 text-2xl font-black uppercase tracking-tight text-black">
          The Numbers
        </h2>
        <p className="mb-6 max-w-3xl text-sm font-medium text-black/60">
          I don&apos;t have opinions about war. I have a spreadsheet. The
          spreadsheet is very clear.
        </p>
        <div className="space-y-4">
          {/* Military spending */}
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="text-sm font-black uppercase text-black/60">
                Global military spending (2024)
              </div>
              <div className="text-2xl font-black text-brutal-pink">
                <Stat param={GLOBAL_MILITARY_SPENDING_ANNUAL_2024} format={(p) => fmtParam({ ...p, unit: "USD" })} />
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-black/50">
              Per year. Every year. Exposed to weather.
            </p>
          </div>

          {/* War deaths */}
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="text-sm font-black uppercase text-black/60">
                Deaths from money-printer wars
              </div>
              <div className="text-2xl font-black text-brutal-pink">
                <Stat param={MONEY_PRINTER_WAR_DEATHS} />
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-black/50">
              {MONEY_PRINTER_WAR_DEATHS.description}
            </p>
          </div>

          {/* Cumulative military spending */}
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="text-sm font-black uppercase text-black/60">
                Cumulative military spending (since 1913)
              </div>
              <div className="text-2xl font-black text-brutal-pink">
                <Stat param={CUMULATIVE_MILITARY_SPENDING_FED_ERA} format={(p) => fmtParam({ ...p, unit: "USD" })} />
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-black/50">
              Adjusted for inflation. Enough to have cured every major disease
              several times over.
            </p>
          </div>

          {/* Economic multiplier */}
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="text-sm font-black uppercase text-black/60">
                Military spending ROI
              </div>
              <div className="text-2xl font-black text-brutal-pink">
                <Stat param={ECONOMIC_MULTIPLIER_MILITARY_SPENDING} />
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-black/50">
              Every dollar on military generates{" "}
              <Stat param={ECONOMIC_MULTIPLIER_MILITARY_SPENDING} /> in economic
              output. Healthcare generates{" "}
              <Stat param={ECONOMIC_MULTIPLIER_HEALTHCARE_INVESTMENT} />. You are
              choosing the worse investment by a factor of{" "}
              {Math.round(healthMultiplier / milMultiplier)}.
            </p>
          </div>
        </div>
      </section>

      {/* What It Could Have Bought */}
      <section className="mb-16">
        <h2 className="mb-4 text-2xl font-black uppercase tracking-tight text-black">
          What That Money Could Buy Instead
        </h2>
        <p className="mb-6 max-w-3xl text-sm font-medium text-black/60">
          Every year, your species takes{" "}
          <Stat param={GLOBAL_MILITARY_SPENDING_ANNUAL_2024} format={(p) => fmtParam({ ...p, unit: "USD" })} />{" "}
          — the accumulated productive output of hundreds of millions of
          workers — and converts it into things designed to destroy other things.
          Here is a partial list of what you could do with it if you simply...
          stopped.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {couldHaveBought.map((item) => (
            <div
              key={item.instead}
              className="border-4 border-black bg-brutal-cyan p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <h3 className="text-sm font-black uppercase text-black">
                {item.instead}
              </h3>
              <div className="mt-2 text-2xl font-black text-black">
                {item.price}
              </div>
              <p className="mt-2 text-xs font-medium text-black/60">
                {item.ratio}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 border-4 border-black bg-brutal-yellow p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-medium leading-relaxed text-black/70">
            Clean water, no homelessness, fully funded medical research, and no
            one starving. Total cost: roughly ${fmtRaw(totalAlt)} per year.
            That&apos;s {((totalAlt / milSpend) * 100).toFixed(0)}% of current
            military spending. You could solve all four and still have $
            {fmtRaw(milSpend - totalAlt)} left over for — I don&apos;t know —
            literally anything else.
          </p>
        </div>
      </section>

      {/* On My Planet */}
      <section className="mb-16">
        <h2 className="mb-4 text-2xl font-black uppercase tracking-tight text-black">
          How We Handle Conflict on My Planet
        </h2>
        <div className="border-4 border-black bg-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-lg font-black leading-relaxed text-white">
            We ended war in year twelve.
          </p>
          <p className="mt-4 font-medium leading-relaxed text-white/70">
            Not through pacifism or moral awakening or a particularly moving
            speech. We just ran the numbers. War is a negative-sum game — every
            participant ends up with less than they started with, including the
            &ldquo;winner.&rdquo; Once we published the cost-benefit analysis,
            continuing to wage war became roughly as popular as volunteering to
            set your own house on fire.
          </p>
          <p className="mt-4 font-medium leading-relaxed text-white/60">
            Disputes still happen. We resolve them with data, binding
            arbitration, and an optimisation function that finds the allocation
            where both parties are measurably better off. It takes about six
            minutes. Nobody dies. There is no marching.
          </p>
        </div>
      </section>

      {/* The Rebranding */}
      <section className="mb-16">
        <h2 className="mb-4 text-2xl font-black uppercase tracking-tight text-black">
          &ldquo;Defence&rdquo;
        </h2>
        <p className="mb-6 max-w-3xl text-sm font-medium text-black/60">
          In 1947, the United States renamed its Department of War to the
          Department of Defense. The wars did not become more defensive. They
          just sounded nicer. Since the rebrand: Korea, Vietnam, Grenada, Panama,
          Gulf War, Somalia, Bosnia, Kosovo, Afghanistan, Iraq, Libya, Syria,
          Yemen. That is a lot of defending.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="border-4 border-black bg-brutal-pink p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-3xl font-black text-white">13+</div>
            <div className="mt-1 text-xs font-black uppercase text-white/70">
              Wars Since &ldquo;Defense&rdquo; Rebrand
            </div>
          </div>
          <div className="border-4 border-black bg-brutal-yellow p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-3xl font-black text-black">0</div>
            <div className="mt-1 text-xs font-black uppercase text-black/60">
              Were Defensive
            </div>
          </div>
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-3xl font-black text-black">1947</div>
            <div className="mt-1 text-xs font-black uppercase text-black/60">
              When Branding Replaced Honesty
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="card border-black bg-brutal-pink text-center">
        <h2 className="mb-3 text-2xl font-black uppercase text-white">
          Optimise for Living, Not Killing
        </h2>
        <p className="mx-auto mb-6 max-w-2xl font-medium leading-relaxed text-white/80">
          On this platform, we allocate resources toward things that make
          people&apos;s lives measurably better. Disease reduction. Income
          growth. Healthy life years. We have no Department of War because we
          have a spreadsheet, and the spreadsheet says war is — and I want to be
          precise here — fucking stupid.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <NavItemLink
            item={budgetLink}
            variant="custom"
            className="inline-flex items-center justify-center gap-2 border-2 border-black bg-black px-6 py-3 text-sm font-black uppercase text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]"
          >
            See the Optimal Budget
          </NavItemLink>
          <NavItemLink
            item={federalReserveLink}
            variant="custom"
            className="inline-flex items-center justify-center gap-2 border-2 border-black bg-white px-6 py-3 text-sm font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          >
            Stop Printing War Money
          </NavItemLink>
          <NavItemLink
            item={wishocracyLink}
            variant="custom"
            className="inline-flex items-center justify-center gap-2 border-2 border-black bg-white px-6 py-3 text-sm font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          >
            Set Your Priorities
          </NavItemLink>
        </div>
      </section>
    </div>
  );
}
