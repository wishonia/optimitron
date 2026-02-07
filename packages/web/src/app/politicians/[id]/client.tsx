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
  if (score >= 0.7) return "text-emerald-600";
  if (score >= 0.5) return "text-yellow-600";
  return "text-red-600";
}

function scoreBgColor(score: number): string {
  if (score >= 0.7) return "bg-emerald-500";
  if (score >= 0.5) return "bg-yellow-500";
  return "bg-red-500";
}

function scoreRingColor(score: number): string {
  if (score >= 0.7) return "border-emerald-600";
  if (score >= 0.5) return "border-yellow-600";
  return "border-red-600";
}

function partyColor(party: string): string {
  if (party === "D") return "bg-blue-200 text-blue-800 border-blue-800";
  if (party === "R") return "bg-red-200 text-red-800 border-red-800";
  return "bg-purple-200 text-purple-800 border-purple-800";
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
        <h1 className="text-3xl font-black text-black mb-4 uppercase">Politician Not Found</h1>
        <p className="text-black/60 mb-8 font-medium">
          No politician found with ID &ldquo;{id}&rdquo;.
        </p>
        <Link href="/politicians" className="text-pink-500 hover:text-pink-700 font-black uppercase">
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
      <Link href="/politicians" className="text-sm text-black/50 hover:text-pink-500 transition-colors mb-6 inline-block font-bold uppercase">
        ← All Politicians
      </Link>

      {/* Hero */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className={`w-32 h-32 border-4 ${scoreRingColor(pol.alignmentScore)} flex flex-col items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
              <span className={`text-4xl font-black ${scoreColor(pol.alignmentScore)}`}>
                {(pol.alignmentScore * 100).toFixed(0)}
              </span>
              <span className="text-[10px] text-black/50 uppercase tracking-wider font-bold">/ 100</span>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-black text-black mb-2 uppercase">{pol.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`text-sm font-bold px-3 py-1 border ${partyColor(pol.party)}`}>
                {partyLabel(pol.party)}
              </span>
              <span className="text-sm text-black/60 font-bold">{chamberLabel(pol.chamber)} · {pol.state}</span>
              <span className="text-sm text-black/50 font-bold">Rank #{rank} of {politicians.length}</span>
            </div>
            <p className={`text-lg font-black ${scoreColor(pol.alignmentScore)}`}>{scoreLabel(pol.alignmentScore)}</p>
            <p className="text-sm text-black/60 mt-1 font-medium">
              This score measures how well {pol.name}&apos;s voting record aligns with average citizen budget preferences as determined by Wishocracy.
            </p>
          </div>
          <div className="flex md:flex-col gap-4 flex-shrink-0">
            <div className="text-center card !p-4">
              <div className="text-xl font-black text-black">{alignedVotes}/{totalVotes}</div>
              <div className="text-[10px] text-black/50 font-bold uppercase">Aligned Votes</div>
            </div>
            <div className="text-center card !p-4">
              <div className="text-xl font-black text-black">{pol.topAligned.length}</div>
              <div className="text-[10px] text-black/50 font-bold uppercase">Areas Aligned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Alignment */}
      <div className="card mb-8">
        <h2 className="text-lg font-black text-black mb-1 uppercase">📊 Budget Alignment by Category</h2>
        <p className="text-xs text-black/50 mb-4 font-bold">How closely this politician&apos;s votes align with citizen preferences</p>
        <div className="space-y-3">
          {budgetEntries.map(([key, val]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-black/70 font-bold">{budgetCategoryLabels[key] ?? key}</span>
                <span className={`text-sm font-black ${scoreColor(val)}`}>{(val * 100).toFixed(0)}%</span>
              </div>
              <div className="h-4 bg-gray-100 border border-black overflow-hidden">
                <div className={`h-full transition-all ${scoreBgColor(val)}`} style={{ width: `${(val / maxBudgetVal) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aligned / Misaligned */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h2 className="text-lg font-black text-black mb-3 uppercase">✅ Most Aligned Areas</h2>
          <div className="space-y-2">
            {pol.topAligned.map((area, i) => (
              <div key={area} className="flex items-center gap-3 p-3 bg-emerald-50 border-2 border-emerald-800">
                <span className="w-6 h-6 bg-emerald-500 flex items-center justify-center text-xs font-black text-white border border-black">{i + 1}</span>
                <span className="text-sm text-emerald-800 font-bold">{area}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-black text-black mb-3 uppercase">❌ Most Misaligned Areas</h2>
          <div className="space-y-2">
            {pol.topMisaligned.map((area, i) => (
              <div key={area} className="flex items-center gap-3 p-3 bg-red-50 border-2 border-red-800">
                <span className="w-6 h-6 bg-red-500 flex items-center justify-center text-xs font-black text-white border border-black">{i + 1}</span>
                <span className="text-sm text-red-800 font-bold">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Voting Record */}
      <div className="card mb-8">
        <h2 className="text-lg font-black text-black mb-1 uppercase">🗳️ Key Voting Record</h2>
        <div className="space-y-3">
          {pol.keyVotes.map((vote) => (
            <div key={vote.bill} className={`flex items-start gap-4 p-4 border-2 ${vote.aligned ? "bg-emerald-50 border-emerald-800" : "bg-red-50 border-red-800"}`}>
              <span className="text-2xl flex-shrink-0">{vote.aligned ? "✅" : "❌"}</span>
              <div className="flex-1">
                <h3 className="text-black font-bold">{vote.bill}</h3>
                <p className="text-sm text-black/60 mt-1 font-medium">
                  Voted <span className={`font-black ${vote.vote === "Yea" ? "text-emerald-600" : "text-red-600"}`}>{vote.vote}</span>
                </p>
              </div>
              <span className={`text-xs font-black px-3 py-1 flex-shrink-0 border-2 ${vote.aligned ? "bg-emerald-200 text-emerald-800 border-emerald-800" : "bg-red-200 text-red-800 border-red-800"}`}>
                {vote.aligned ? "Aligned" : "Misaligned"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div className="card border-black/30">
        <h3 className="text-sm font-black text-black mb-2 uppercase">📐 Methodology</h3>
        <p className="text-xs text-black/50 leading-relaxed font-medium">
          Alignment scores compare aggregated citizen preferences (via{" "}
          <Link href="/vote" className="text-pink-500 hover:underline decoration-2 underline-offset-4 font-bold">Wishocracy voting</Link>
          ) against voting records on budget legislation. See the{" "}
          <a href="https://wishocracy.warondisease.org" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline decoration-2 underline-offset-4 font-bold">
            Wishocracy paper
          </a>.
        </p>
      </div>
    </div>
  );
}
