"use client";

import { formatWish, useTreasuryData } from "@/hooks/useTreasuryData";

export function TreasuryAllocationViz() {
  const { treasuryBalance, citizenCount, taxRateBps, isDemo } =
    useTreasuryData();

  const citizenCountNum = Number(citizenCount);
  const perCitizen = citizenCountNum > 0 ? treasuryBalance / citizenCount : 0n;
  const taxPct = (Number(taxRateBps) / 100).toFixed(1);

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-6">
        How It Works
      </h2>

      <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {/* Flow diagram */}
        <div className="flex flex-col md:flex-row items-stretch gap-0 mb-6">
          <div className="flex-1 border-4 border-black bg-brutal-yellow p-4 text-center">
            <div className="text-xs font-black uppercase text-black/50 mb-1">
              Step 1
            </div>
            <div className="text-sm font-black text-black">
              Every $WISH Transfer
            </div>
            <div className="text-xs text-black/60 mt-1">
              {taxPct}% transaction tax
            </div>
          </div>
          <div className="flex items-center justify-center px-2 py-1 md:py-0">
            <span className="text-2xl font-black rotate-90 md:rotate-0">
              →
            </span>
          </div>
          <div className="flex-1 border-4 border-black bg-brutal-cyan p-4 text-center">
            <div className="text-xs font-black uppercase text-black/50 mb-1">
              Step 2
            </div>
            <div className="text-sm font-black text-black">
              UBI Treasury
            </div>
            <div className="text-xs text-black/60 mt-1">
              {formatWish(treasuryBalance)} $WISH
            </div>
          </div>
          <div className="flex items-center justify-center px-2 py-1 md:py-0">
            <span className="text-2xl font-black rotate-90 md:rotate-0">
              →
            </span>
          </div>
          <div className="flex-1 border-4 border-black bg-brutal-pink p-4 text-center">
            <div className="text-xs font-black uppercase text-black/50 mb-1 text-white/70">
              Step 3
            </div>
            <div className="text-sm font-black text-white">
              Equal Split to Citizens
            </div>
            <div className="text-xs text-white/60 mt-1">
              {citizenCountNum > 0
                ? `${formatWish(perCitizen)} each`
                : "Register to receive"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UBI explanation */}
          <div className="border-2 border-black bg-brutal-cyan/10 p-5">
            <h3 className="font-black uppercase text-black text-sm mb-3">
              100% Universal Basic Income
            </h3>
            <p className="text-xs text-black/60 font-medium leading-relaxed">
              Every $WISH in the treasury goes to citizens. Equal shares.
              No means testing. No applications. No bureaucracy. Just proof
              you&apos;re a real person via World ID, and your share is
              calculated automatically.
            </p>
          </div>

          {/* Politician funding note */}
          <div className="border-2 border-black bg-brutal-pink/10 p-5">
            <h3 className="font-black uppercase text-black text-sm mb-3">
              Politician Funding? That&apos;s IABs.
            </h3>
            <p className="text-xs text-black/60 font-medium leading-relaxed">
              Aligned politicians are funded through the Incentive Alignment
              Bond mechanism — 10% of treaty revenue flows to the political
              incentive layer. Funding is gated on outcomes, not transactions.
              No outcomes? No funding. Simple.
            </p>
          </div>
        </div>

        {isDemo && (
          <p className="text-[10px] font-bold text-black/40 mt-4 text-center">
            Illustrative data — contracts not yet deployed
          </p>
        )}
      </div>
    </section>
  );
}
