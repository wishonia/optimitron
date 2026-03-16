import type { Metadata } from "next";
import { VoterPrizeTreasuryDeposit } from "@/components/prize/VoterPrizeTreasuryDeposit";
import { NavItemLink } from "@/components/navigation/NavItemLink";
import { fullManualPaperLink } from "@/lib/routes";
import {
  POLITICAL_DYSFUNCTION_TAX_PER_PERSON_ANNUAL,
  POLITICAL_DYSFUNCTION_GLOBAL_OPPORTUNITY_COST_TOTAL,
} from "@/lib/parameters-calculations-citations";
import Link from "next/link";

const dysfunctionTaxFormatted = `$${Math.round(POLITICAL_DYSFUNCTION_TAX_PER_PERSON_ANNUAL.value).toLocaleString()}`;
const globalWasteFormatted = `$${Math.round(POLITICAL_DYSFUNCTION_GLOBAL_OPPORTUNITY_COST_TOTAL.value / 1e12)}T`;

export const metadata: Metadata = {
  title: "Earth Optimization Prize | Optomitron",
  description:
    "Contribute to the Earth Optimization Prize. Your contribution incentivizes vote recruiters to get humanity to vote on the 1% Treaty. If the plan succeeds, the prize is distributed to recruiters. If not, you get your money back plus interest.",
};

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-16">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-brutal-pink">
            Earth Optimization Prize
          </p>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            Contribute to the Prize. Recruit the Voters. Fix Earth.
          </h1>
          <p className="text-lg text-black/80 leading-relaxed font-medium">
            Your contribution incentivizes vote recruiters to get humanity to
            vote on the{" "}
            <Link href="/referendum" className="text-brutal-pink underline font-black hover:text-black">
              1% Treaty
            </Link>
            {" "}— the first step in the Earth Optimization Plan. Recruiters
            share referral links. Every verified vote they bring in earns them
            a larger share of the prize.
          </p>
          <div className="border-4 border-black bg-brutal-yellow p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-sm font-black text-black leading-relaxed">
              If the plan is adopted — redirecting resources from the most
              destructive purposes to the most productive — humanity would
              achieve <span className="text-brutal-pink">13.5x greater
              median lifetime income</span> and a{" "}
              <span className="text-brutal-pink">1%+ improvement in
              median healthy life years</span> within 15 years.
            </p>
          </div>
          <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-sm font-medium text-black/70 leading-relaxed">
              <span className="font-black text-black">Why this matters:</span>{" "}
              Misaligned governance costs every person on Earth{" "}
              <span className="font-black text-brutal-pink">{dysfunctionTaxFormatted}/year</span>{" "}
              in lost health and income — {globalWasteFormatted}/year globally.
              This is <span className="font-black">Phase 1</span> of the{" "}
              <NavItemLink
                item={fullManualPaperLink}
                variant="custom"
                external
                className="font-black text-brutal-pink underline hover:text-black"
              >
                Earth Optimization Plan
              </NavItemLink>
              : prove that humanity wants better governance by getting
              everyone to vote on it.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-4 border-black bg-green-50 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-black uppercase text-black mb-1">
                If the plan succeeds
              </div>
              <p className="text-sm font-medium text-black/80">
                The prize is distributed to vote recruiters in proportion to
                the number of verified votes they brought in with their
                referral link.
              </p>
            </div>
            <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-black uppercase text-black mb-1">
                If it doesn&apos;t
              </div>
              <p className="text-sm font-medium text-black/80">
                You receive your full contribution back plus interest earned
                in Aave. You literally cannot lose money.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href="#contribute"
            className="inline-flex items-center justify-center border-4 border-black bg-brutal-pink px-8 py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Contribute to the Prize
          </a>
          <Link
            href="/referendum"
            className="inline-flex items-center justify-center border-4 border-black bg-white px-8 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Vote &amp; Recruit to Earn
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-6">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-4 border-black bg-brutal-yellow p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-3xl mb-3">1</div>
            <h3 className="font-black uppercase text-black mb-2">
              You Contribute to the Prize
            </h3>
            <p className="text-sm font-medium text-black/70 leading-relaxed">
              Deposit USDC. Your contribution goes into Aave V3 to earn
              interest while it waits. You get PRIZE shares as your receipt.
            </p>
          </div>
          <div className="border-4 border-black bg-brutal-cyan p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-3xl mb-3">2</div>
            <h3 className="font-black uppercase text-black mb-2">
              Recruiters Get Humanity to Vote
            </h3>
            <p className="text-sm font-medium text-black/70 leading-relaxed">
              Your prize incentivizes recruiters to share referral links and
              get people to vote on the 1% Treaty. Each verified vote (World
              ID) earns them 1 VOTE token.
            </p>
          </div>
          <div className="border-4 border-black bg-brutal-pink p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-3xl text-white mb-3">3</div>
            <h3 className="font-black uppercase text-white mb-2">
              Outcomes Determine the Payout
            </h3>
            <p className="text-sm font-medium text-white/70 leading-relaxed">
              If median health and income improve within 15 years, VOTE
              holders split the prize proportionally to votes recruited.
              If not, contributors get their money back + interest.
            </p>
          </div>
        </div>
        <div className="border-4 border-black bg-white p-6 mt-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm text-black/70 font-medium leading-relaxed">
            It&apos;s a dominant assurance contract. Contributors can&apos;t
            lose — worst case is free interest. Recruiters are incentivized
            to solve the coordination problem: proving that everyone already
            wants better governance. The smart contract handles the rest.
          </p>
        </div>
      </section>

      {/* Contribute Section */}
      <section id="contribute" className="mb-16">
        <div className="border-4 border-black bg-brutal-pink p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase text-white mb-4">
            Contribute to the Earth Optimization Prize
          </h2>
          <p className="text-sm font-medium text-white/70 mb-6 max-w-2xl">
            Your USDC earns interest in Aave while incentivizing recruiters
            to get humanity to vote. Plan succeeds? Prize goes to recruiters.
            Plan fails? You get your money back plus interest.
          </p>
          <VoterPrizeTreasuryDeposit />
        </div>
      </section>

      {/* Contract Details */}
      <section className="mb-16">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-6">
          Contract Architecture
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              label: "VoteToken",
              value: "VOTE (ERC-20)",
              detail:
                "1:1 mint per verified referendum vote. Sybil-resistant via World ID nullifier hash.",
            },
            {
              label: "Earth Optimization Prize",
              value: "PRIZE (ERC-20 Vault)",
              detail:
                "USDC contributions → Aave V3 yield. Success: VOTE holders claim prize. Failure: contributors get refund + interest.",
            },
            {
              label: "Health Metric",
              value: "Median Healthy Life Years",
              detail:
                "Threshold: 100 bps (1% improvement). Verified by oracle.",
            },
            {
              label: "Income Metric",
              value: "Median Real After-Tax Income",
              detail:
                "Threshold: 50 bps (0.5% improvement). Verified by oracle.",
            },
            {
              label: "Network",
              value: "Base Sepolia (Testnet)",
              detail: "Base L2 for low gas fees. Mainnet deployment after testnet validation.",
            },
            {
              label: "Yield Source",
              value: "Aave V3 (USDC)",
              detail:
                "All contributed USDC earns Aave supply APY while in escrow.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="text-xs font-black uppercase tracking-[0.2em] text-black/50">
                {item.label}
              </div>
              <div className="mt-1 text-sm font-black text-black">
                {item.value}
              </div>
              <div className="mt-2 text-xs font-medium text-black/60">
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card bg-brutal-pink border-black text-center">
        <h2 className="text-2xl font-black text-white mb-3 uppercase">
          The Coordination Problem Has a Price Tag
        </h2>
        <p className="text-white/80 mb-6 font-medium max-w-2xl mx-auto leading-relaxed">
          Everyone wants better health outcomes and higher incomes. Nobody
          knows everyone else wants it too. Your contribution puts a bounty
          on solving that coordination problem. Recruiters do the work.
          Smart contracts pay them if it works. You get your money back if
          it doesn&apos;t.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="#contribute"
            className="inline-flex items-center justify-center gap-2 bg-black px-6 py-3 text-sm font-black text-white uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Contribute to the Prize
          </a>
          <Link
            href="/referendum"
            className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3 text-sm font-black text-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Vote &amp; Recruit
          </Link>
          <NavItemLink
            item={fullManualPaperLink}
            variant="custom"
            external
            className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3 text-sm font-black text-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Read the Full Plan
          </NavItemLink>
        </div>
      </section>
    </div>
  );
}
