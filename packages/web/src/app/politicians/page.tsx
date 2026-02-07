"use client";

import { useState, useMemo } from "react";
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

type SortKey = "alignmentScore" | "name" | "state";

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
  return chamber === "senate" ? "Senate" : "House";
}

const budgetCategoryLabels: Record<string, string> = {
  education: "Education",
  defense: "Defense",
  healthcare: "Healthcare",
  infrastructure: "Infrastructure",
  socialSecurity: "Social Security",
  environment: "Environment",
  interestOnDebt: "Interest on Debt",
};

export default function PoliticiansPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [partyFilter, setPartyFilter] = useState("all");
  const [chamberFilter, setChamberFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("alignmentScore");
  const [sortAsc, setSortAsc] = useState(false);

  const states = useMemo(
    () => ["all", ...Array.from(new Set(politicians.map((p) => p.state))).sort()],
    []
  );

  const filtered = useMemo(() => {
    let list = politicians;
    if (partyFilter !== "all") list = list.filter((p) => p.party === partyFilter);
    if (chamberFilter !== "all") list = list.filter((p) => p.chamber === chamberFilter);
    if (stateFilter !== "all") list = list.filter((p) => p.state === stateFilter);

    return [...list].sort((a, b) => {
      let cmp: number;
      if (sortBy === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortBy === "state") {
        cmp = a.state.localeCompare(b.state);
      } else {
        cmp = b.alignmentScore - a.alignmentScore;
      }
      return sortAsc ? -cmp : cmp;
    });
  }, [partyFilter, chamberFilter, stateFilter, sortBy, sortAsc]);

  const avgScore =
    filtered.length > 0
      ? filtered.reduce((s, p) => s + p.alignmentScore, 0) / filtered.length
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black mb-2">
          🏛️ Politician Alignment Scores
        </h1>
        <p className="text-black/60 font-medium">
          How well do politicians represent average citizen preferences? Scores compare voting
          records to aggregated citizen budget priorities from the{" "}
          <Link href="/vote" className="text-pink-500 hover:underline decoration-2 underline-offset-4 font-bold">
            Wishocracy voting system
          </Link>
          .
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <SummaryCard label="Politicians Tracked" value={String(politicians.length)} />
        <SummaryCard
          label="Average Alignment"
          value={`${(avgScore * 100).toFixed(0)}%`}
          color={scoreColor(avgScore)}
        />
        <SummaryCard
          label="Most Aligned"
          value={[...politicians].sort((a, b) => b.alignmentScore - a.alignmentScore)[0]?.name ?? "—"}
        />
        <SummaryCard
          label="Least Aligned"
          value={[...politicians].sort((a, b) => a.alignmentScore - b.alignmentScore)[0]?.name ?? "—"}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label className="text-xs text-black/50 block mb-1 font-bold uppercase">Party</label>
          <select
            value={partyFilter}
            onChange={(e) => setPartyFilter(e.target.value)}
            className="bg-white border-2 border-black px-3 py-2 text-sm text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <option value="all">All Parties</option>
            <option value="D">Democrat</option>
            <option value="R">Republican</option>
            <option value="I">Independent</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-black/50 block mb-1 font-bold uppercase">Chamber</label>
          <select
            value={chamberFilter}
            onChange={(e) => setChamberFilter(e.target.value)}
            className="bg-white border-2 border-black px-3 py-2 text-sm text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <option value="all">Both Chambers</option>
            <option value="senate">Senate</option>
            <option value="house">House</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-black/50 block mb-1 font-bold uppercase">State</label>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-white border-2 border-black px-3 py-2 text-sm text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All States" : s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-black/50 block mb-1 font-bold uppercase">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="bg-white border-2 border-black px-3 py-2 text-sm text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <option value="alignmentScore">Alignment Score</option>
            <option value="name">Name</option>
            <option value="state">State</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-black/50 block mb-1 font-bold uppercase">Order</label>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="bg-white border-2 border-black px-3 py-2 text-sm text-black font-bold hover:bg-cyan-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {sortAsc ? "↑ Ascending" : "↓ Descending"}
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-black/50 mb-4 font-bold">
        Showing {filtered.length} of {politicians.length} politicians
      </p>

      {/* Politician list */}
      <div className="space-y-3">
        {filtered.map((pol, i) => (
          <div key={pol.id} className="card">
            <button
              onClick={() => setExpanded(expanded === pol.id ? null : pol.id)}
              className="w-full text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Rank */}
                <span className="flex-shrink-0 w-8 h-8 bg-black flex items-center justify-center text-sm font-black text-black">
                  {i + 1}
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Link
                      href={`/politicians/${pol.id}`}
                      className="text-black font-black hover:text-pink-500 transition-colors"
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      {pol.name}
                    </Link>
                    <span className={`text-xs font-bold px-2 py-0.5 border ${partyColor(pol.party)}`}>
                      {partyLabel(pol.party)}
                    </span>
                    <span className="text-xs text-black/50 px-2 py-0.5 bg-gray-100 border border-black font-bold">
                      {chamberLabel(pol.chamber)}
                    </span>
                    <span className="text-xs text-black/50 font-bold">{pol.state}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {pol.topAligned.slice(0, 3).map((area) => (
                      <span
                        key={area}
                        className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 border border-emerald-800 font-bold"
                      >
                        ✓ {area}
                      </span>
                    ))}
                    {pol.topMisaligned.slice(0, 2).map((area) => (
                      <span
                        key={area}
                        className="text-[10px] bg-red-200 text-red-800 px-1.5 py-0.5 border border-red-800 font-bold"
                      >
                        ✗ {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center">
                    <div className={`text-2xl font-black ${scoreColor(pol.alignmentScore)}`}>
                      {(pol.alignmentScore * 100).toFixed(0)}%
                    </div>
                    <div className="text-[10px] text-black/50 font-bold uppercase">Alignment</div>
                  </div>
                  {/* Score bar */}
                  <div className="w-24 hidden sm:block">
                    <div className="h-3 bg-gray-100 border border-black overflow-hidden">
                      <div
                        className={`h-full ${scoreBgColor(pol.alignmentScore)}`}
                        style={{ width: `${pol.alignmentScore * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-black/50 text-lg font-black">
                    {expanded === pol.id ? "▲" : "▼"}
                  </span>
                </div>
              </div>
            </button>

            {/* Expanded detail */}
            {expanded === pol.id && (
              <div className="mt-4 pt-4 border-t-2 border-black space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Budget Alignment */}
                  <div>
                    <h4 className="text-xs text-black/50 uppercase tracking-wider mb-3 font-black">
                      Budget Category Alignment
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(pol.budgetAlignment).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-xs text-black/60 w-28 truncate font-bold">
                            {budgetCategoryLabels[key] ?? key}
                          </span>
                          <div className="flex-1 h-3 bg-gray-100 border border-black overflow-hidden">
                            <div
                              className={`h-full ${scoreBgColor(val)}`}
                              style={{ width: `${val * 100}%` }}
                            />
                          </div>
                          <span className={`text-xs w-10 text-right font-black ${scoreColor(val)}`}>
                            {(val * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Votes */}
                  <div>
                    <h4 className="text-xs text-black/50 uppercase tracking-wider mb-3 font-black">
                      Key Votes
                    </h4>
                    <div className="space-y-2">
                      {pol.keyVotes.map((vote) => (
                        <div
                          key={vote.bill}
                          className={`flex items-start gap-2 p-2 border-2 ${
                            vote.aligned
                              ? "bg-emerald-50 border-emerald-800"
                              : "bg-red-50 border-red-800"
                          }`}
                        >
                          <span className="flex-shrink-0 mt-0.5">
                            {vote.aligned ? "✅" : "❌"}
                          </span>
                          <div>
                            <p className="text-sm text-black/70 font-medium">{vote.bill}</p>
                            <p className="text-xs text-black/50 font-bold">
                              Voted <span className="text-black">{vote.vote}</span>
                              {" · "}
                              {vote.aligned ? (
                                <span className="text-emerald-600">Aligned with citizens</span>
                              ) : (
                                <span className="text-red-600">Misaligned with citizens</span>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Link to detail page */}
                <div className="pt-2">
                  <Link
                    href={`/politicians/${pol.id}`}
                    className="inline-flex items-center text-sm font-black text-pink-500 hover:text-pink-700 uppercase transition-colors"
                  >
                    View full profile →
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-black/60 font-medium">No politicians match the selected filters.</p>
        </div>
      )}

      <p className="text-xs text-black/40 mt-8 font-bold">
        Alignment scores compare politician voting records to aggregated citizen preferences.
        Scores are illustrative; production scores use the{" "}
        <a
          href="https://wishocracy.warondisease.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-500 hover:underline decoration-2 underline-offset-4"
        >
          Wishocracy algorithm
        </a>
        .
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color = "text-black",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="card text-center">
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-xs text-black/50 mt-1 font-bold uppercase">{label}</div>
    </div>
  );
}
