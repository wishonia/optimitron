"use client"

import dynamic from "next/dynamic"

const WishocracySection = dynamic(
  () => import("@/components/wishocracy/wishocracy-section"),
  { ssr: false }
)

export default function VotePage() {
  return (
    <main>
      {/* Politicians vs Wishocracy comparison */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black uppercase tracking-tight text-foreground mb-2 text-center sm:text-4xl">
          The Bottleneck Is Politicians
        </h2>
        <p className="text-muted-foreground font-bold text-center mb-10 max-w-2xl mx-auto">
          You have the data. You have the solutions. The only thing between you
          and functioning governance is 535 people whose primary skill is asking
          rich people for money.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="border-4 border-brutal-red bg-background p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black text-foreground mb-4 uppercase">
              What Politicians Actually Do
            </h3>
            <ul className="space-y-3 text-sm text-foreground font-bold">
              <li className="flex gap-2">
                <span className="text-brutal-red font-black shrink-0">&times;</span>
                <span>Spend <span className="font-black">70% of their time</span> fundraising, not governing</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-red font-black shrink-0">&times;</span>
                <span>Donor alignment: ~80%. Citizen alignment: ~30%</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-red font-black shrink-0">&times;</span>
                <span>Block evidence-based policy that threatens their coalition</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-red font-black shrink-0">&times;</span>
                <span>Represent the median <span className="font-black">donor</span>, not the median <span className="font-black">citizen</span></span>
              </li>
            </ul>
          </div>
          <div className="border-4 border-brutal-cyan bg-background p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black text-foreground mb-4 uppercase">
              What Wishocracy Does Instead
            </h3>
            <ul className="space-y-3 text-sm text-foreground font-bold">
              <li className="flex gap-2">
                <span className="text-brutal-cyan font-black shrink-0">&#10003;</span>
                <span>Citizens vote directly on priorities. No fundraising. No middleman</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-cyan font-black shrink-0">&#10003;</span>
                <span>Causal engine determines which policies actually work</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-cyan font-black shrink-0">&#10003;</span>
                <span>Alignment scores expose how much each official deviates from citizen preferences</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-cyan font-black shrink-0">&#10003;</span>
                <span>Optimises for <span className="font-black">outcomes</span>, not re-election</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <WishocracySection />
    </main>
  )
}
