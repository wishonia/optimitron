"use client";

import Link from "next/link";
import politiciansData from "@/data/politicians.json";

interface KeyVote {
  bill: string;
  vote: string;
  aligned: boolean;
}

interface Politician {
  id: string;
  name: string;
  party: string;
  state: string;
  chamber: string;
  alignmentScore: number;
  budgetAlignment: Record<string, number>;
  topAligned: string[];
  topMisaligned: string[];
  keyVotes: KeyVote[];
}

const politicians = politiciansData as Politician[];

const budgetCategoryLabels: Record<string, string> = {
  education: "Education",
  defense: "Defense",
  healthcare: "Healthcare",
  infrastructure: "Infrastructure",
  socialSecurity: "Social Security",
  environment: "Environment",
  interestOnDebt: "Interest on Debt",
};

function scoreColor(score: number): string {
  if (score >= 0.7) return "text-emerald-400";
  if (score >= 0.5) return "text-yellow-400";
  return "text-red-400";
}

function scoreBgColor(score: number): string {
  if (score >= 0.7) return "bg-emerald-500";
  if (score >= 0.5) return "bg-yellow-500";
  return "bg-red-500";
}

function scoreRingColor(score: number): string {
  if (score >= 0.7) return "border-emerald-500";
  if (score >= 0.5) return "border-yellow-500";
  return "border-red-500";
}

function partyColor(party: string): string {
  if (party === "D") return "bg-blue-600/20 text-blue-400 border-blue-500/30";
  if (party === "R") return "bg-red-600/20 text-red-400 border-red-500/30";
  return "bg-purple-600/20 text-purple-400 border-purple-500/30";
}

function partyLabel(party: string): string {
  if (party === "D") return "Democrat";
  if (party === "R") return "Republican";
  return "Independent";
}

function chamberLabel(chamber: string): string {
  return chamber === "senate" ? "Senate" : "House of Representatives";
}

function scoreLabel(score: number): string {
  if (score >= 0.8) return "Highly Aligned";
  if (score >= 0.7) return "Well Aligned";
  if (score >= 0.6) return "Moderately Aligned";
  if (score >= 0.5) return "Partially Aligned";
  if (score >= 0.4) return "Poorly Aligned";
  return "Misaligned";
}

export function PoliticianDetailClient({ id }: { id: string }) {
  const pol = politicians.find((p) => p.id === id);

  if (!pol) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Politician Not Found</h1>
        <p className="text-slate-400 mb-8">
          No politician found with ID &ldquo;{id}&rdquo;.
        </p>
        <Link href="/politicians" className="text-primary-400 hover:text-primary-300 font-medium">
          ← Back to all politicians
        </Link>
      </div>
    );
  }

  const budgetEntries = Object.entries(pol.budgetAlignment).sort(([, a], [, b]) => b - a);
  const maxBudgetVal = Math.max(...budgetEntries.map(([, v]) => v));
  const alignedVotes = pol.keyVotes.filter((v) => v.aligned).length;
  const totalVotes = pol.keyVotes.length;

  const sorted = [...politicians].sort((a, b) => b.alignmentScore - a.alignmentScore);
  const rank = sorted.findIndex((p) => p.id === pol.id) + 1;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/politicians" className="text-sm text-slate-500 hover:text-primary-400 transition-colors mb-6 inline-block">
        ← All Politicians
      </Link>

      {/* Hero */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className={`w-32 h-32 rounded-full border-4 ${scoreRingColor(pol.alignmentScore)} flex flex-col items-center justify-center bg-slate-800/50`}>
              <span className={`text-4xl font-black ${scoreColor(pol.alignmentScore)}`}>
                {(pol.alignmentScore * 100).toFixed(0)}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">/ 100</span>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{pol.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`text-sm font-medium px-3 py-1 rounded-full border ${partyColor(pol.party)}`}>
                {partyLabel(pol.party)}
              </span>
              <span className="text-sm text-slate-400">{chamberLabel(pol.chamber)} · {pol.state}</span>
              <span className="text-sm text-slate-500">Rank #{rank} of {politicians.length}</span>
            </div>
            <p className={`text-lg font-semibold ${scoreColor(pol.alignmentScore)}`}>{scoreLabel(pol.alignmentScore)}</p>
            <p className="text-sm text-slate-400 mt-1">
              This score measures how well {pol.name}&apos;s voting record aligns with average citizen budget preferences as determined by Wishocracy.
            </p>
          </div>
          <div className="flex md:flex-col gap-4 flex-shrink-0">
            <div className="text-center card !p-4">
              <div className="text-xl font-bold text-white">{alignedVotes}/{totalVotes}</div>
              <div className="text-[10px] text-slate-500">Aligned Votes</div>
            </div>
            <div className="text-center card !p-4">
              <div className="text-xl font-bold text-white">{pol.topAligned.length}</div>
              <div className="text-[10px] text-slate-500">Areas Aligned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Alignment */}
      <div className="card mb-8">
        <h2 className="text-lg font-bold text-white mb-1">📊 Budget Alignment by Category</h2>
        <p className="text-xs text-slate-500 mb-4">How closely this politician&apos;s votes align with citizen preferences</p>
        <div className="space-y-3">
          {budgetEntries.map(([key, val]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-300">{budgetCategoryLabels[key] ?? key}</span>
                <span className={`text-sm font-bold ${scoreColor(val)}`}>{(val * 100).toFixed(0)}%</span>
              </div>
              <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${scoreBgColor(val)}`} style={{ width: `${(val / maxBudgetVal) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aligned / Misaligned */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-3">✅ Most Aligned Areas</h2>
          <div className="space-y-2">
            {pol.topAligned.map((area, i) => (
              <div key={area} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-600/10 border border-emerald-600/20">
                <span className="w-6 h-6 rounded-full bg-emerald-600/20 flex items-center justify-center text-xs font-bold text-emerald-400">{i + 1}</span>
                <span className="text-sm text-emerald-300 font-medium">{area}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-3">❌ Most Misaligned Areas</h2>
          <div className="space-y-2">
            {pol.topMisaligned.map((area, i) => (
              <div key={area} className="flex items-center gap-3 p-3 rounded-lg bg-red-600/10 border border-red-600/20">
                <span className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center text-xs font-bold text-red-400">{i + 1}</span>
                <span className="text-sm text-red-300 font-medium">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Voting Record */}
      <div className="card mb-8">
        <h2 className="text-lg font-bold text-white mb-1">🗳️ Key Voting Record</h2>
        <div className="space-y-3">
          {pol.keyVotes.map((vote) => (
            <div key={vote.bill} className={`flex items-start gap-4 p-4 rounded-xl border ${vote.aligned ? "bg-emerald-600/5 border-emerald-600/20" : "bg-red-600/5 border-red-600/20"}`}>
              <span className="text-2xl flex-shrink-0">{vote.aligned ? "✅" : "❌"}</span>
              <div className="flex-1">
                <h3 className="text-white font-medium">{vote.bill}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Voted <span className={`font-semibold ${vote.vote === "Yea" ? "text-emerald-400" : "text-red-400"}`}>{vote.vote}</span>
                </p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ${vote.aligned ? "bg-emerald-600/20 text-emerald-400" : "bg-red-600/20 text-red-400"}`}>
                {vote.aligned ? "Aligned" : "Misaligned"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div className="card border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">📐 Methodology</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Alignment scores compare aggregated citizen preferences (via{" "}
          <Link href="/vote" className="text-primary-400 hover:underline">Wishocracy voting</Link>
          ) against voting records on budget legislation. See the{" "}
          <a href="https://wishocracy.warondisease.org" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">
            Wishocracy paper
          </a>.
        </p>
      </div>
    </div>
  );
}
