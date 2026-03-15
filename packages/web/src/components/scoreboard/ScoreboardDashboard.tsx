"use client";

import type { AggregateScoreData } from "@/lib/aggregate-alignment.server";
import { CitizenPrioritiesChart } from "./CitizenPrioritiesChart";
import { ScoreboardTable } from "./ScoreboardTable";

interface ScoreboardDashboardProps {
  data: AggregateScoreData;
}

export function ScoreboardDashboard({ data }: ScoreboardDashboardProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-12 space-y-3">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brutal-pink">
          Public Scoreboard
        </p>
        <h1 className="text-4xl font-black uppercase tracking-tight text-black">
          How Your Representatives Actually Vote
        </h1>
        <p className="max-w-3xl text-base font-medium text-black/70">
          On my planet, officials who ignore citizen preferences get replaced in
          four minutes. Here, you re-elect them for decades and then wonder why
          nothing works. This scoreboard compares what citizens actually want
          against how politicians actually vote. The gap is&hellip; instructive.
        </p>
      </section>

      {/* Metadata cards */}
      <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-2 border-black bg-brutal-cyan p-4">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
            Jurisdiction
          </div>
          <div className="mt-2 text-2xl font-black text-black">
            {data.jurisdiction.name ?? data.jurisdiction.code}
          </div>
        </div>
        <div className="border-2 border-black bg-brutal-pink p-4">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
            Comparisons
          </div>
          <div className="mt-2 text-2xl font-black text-black">
            {data.aggregationRun.comparisonCount.toLocaleString()}
          </div>
        </div>
        <div className="border-2 border-black bg-brutal-yellow p-4">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
            Participants
          </div>
          <div className="mt-2 text-2xl font-black text-black">
            {data.aggregationRun.participantCount.toLocaleString()}
          </div>
        </div>
        <div className="border-2 border-black bg-white p-4">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-black/60">
            Consistency
          </div>
          <div className="mt-2 text-2xl font-black text-black">
            {data.aggregationRun.consistencyRatio != null
              ? `${(data.aggregationRun.consistencyRatio * 100).toFixed(1)}%`
              : "N/A"}
          </div>
        </div>
      </section>

      {/* Citizen Priorities */}
      <section className="mb-10 border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black uppercase text-black">
          What Citizens Actually Want
        </h2>
        <p className="mt-2 text-sm font-medium text-black/60">
          Aggregate preference weights derived from pairwise comparisons. Higher
          weight means citizens consistently chose this category over others.
        </p>
        <div className="mt-6">
          <CitizenPrioritiesChart priorities={data.citizenPriorities} />
        </div>
      </section>

      {/* Scoreboard Table */}
      <section className="mb-10 border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black uppercase text-black">
          Politician Rankings
        </h2>
        <p className="mt-2 text-sm font-medium text-black/60">
          Sorted by Citizen Alignment Score. This is how closely each
          politician&apos;s actual voting record matches aggregate citizen
          preferences. Not what they promise. What they do.
        </p>
        <div className="mt-6">
          <ScoreboardTable politicians={data.politicians} />
        </div>
      </section>

      {/* Footer note */}
      <section className="border-2 border-black bg-black/5 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-black/50">
          Last computed:{" "}
          {new Date(data.aggregationRun.computedAt).toLocaleString()} &middot;{" "}
          {data.aggregationRun.comparisonCount} pairwise comparisons from{" "}
          {data.aggregationRun.participantCount} participants
        </p>
        <p className="mt-2 text-xs font-medium text-black/40">
          Scores update when new citizen comparisons are aggregated. More
          participants means more representative weights. Politicians are scored
          against the aggregate, not any individual citizen&apos;s preferences.
        </p>
      </section>
    </div>
  );
}
