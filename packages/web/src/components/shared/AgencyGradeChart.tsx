"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { AgencyPerformance, AgencyGrade } from "@optimitron/data";

const gradeColors: Record<AgencyGrade, string> = {
  A: "bg-brutal-cyan text-foreground",
  B: "bg-brutal-cyan text-foreground",
  C: "bg-brutal-yellow text-foreground",
  D: "bg-brutal-yellow text-foreground",
  F: "bg-brutal-red text-brutal-red-foreground",
};

const gradeBorderColors: Record<AgencyGrade, string> = {
  A: "border-brutal-cyan",
  B: "border-brutal-cyan",
  C: "border-brutal-yellow",
  D: "border-brutal-yellow",
  F: "border-brutal-red",
};

function formatCompact(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
  return value.toLocaleString();
}

interface AgencyGradeChartProps {
  agency: AgencyPerformance;
  compact?: boolean;
}

export function AgencyGradeChart({ agency, compact = false }: AgencyGradeChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  const { spendingTimeSeries: spend, outcomeTimeSeries: outcome } = agency;
  if (spend.length < 2 || outcome.length < 2) return null;

  // SVG dimensions
  const W = 320;
  const H = compact ? 160 : 200;
  const PAD = { top: 20, right: 50, bottom: 30, left: 55 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  // Combine year ranges
  const allYears = [...spend.map((p) => p.year), ...outcome.map((p) => p.year)];
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);

  const xScale = (year: number) =>
    PAD.left + ((year - minYear) / (maxYear - minYear)) * plotW;

  // Spending scale (left axis)
  const spendMin = Math.min(...spend.map((p) => p.value));
  const spendMax = Math.max(...spend.map((p) => p.value));
  const spendScale = (v: number) =>
    PAD.top + plotH - ((v - spendMin * 0.8) / (spendMax * 1.1 - spendMin * 0.8)) * plotH;

  // Outcome scale (right axis)
  const outcomeMin = Math.min(...outcome.map((p) => p.value));
  const outcomeMax = Math.max(...outcome.map((p) => p.value));
  const outcomeScale = (v: number) =>
    PAD.top + plotH - ((v - outcomeMin * 0.8) / (outcomeMax * 1.1 - outcomeMin * 0.8)) * plotH;

  const spendPath = spend
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.year)} ${spendScale(p.value)}`)
    .join(" ");

  const outcomePath = outcome
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.year)} ${outcomeScale(p.value)}`)
    .join(" ");

  return (
    <div
      ref={ref}
      className={`border-4 border-primary ${gradeBorderColors[agency.grade]} bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-grow min-w-0">
          <h4 className="text-sm font-black uppercase text-foreground truncate">
            {agency.agencyName}
          </h4>
          {!compact && (
            <p className="text-xs font-bold text-muted-foreground truncate">
              {agency.mission}
            </p>
          )}
        </div>
        <div
          className={`shrink-0 ml-2 w-10 h-10 flex items-center justify-center border-4 border-primary ${gradeColors[agency.grade]} font-black text-xl`}
        >
          {agency.grade}
        </div>
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${agency.agencyName}: Grade ${agency.grade}`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line
            key={pct}
            x1={PAD.left}
            y1={PAD.top + plotH * (1 - pct)}
            x2={PAD.left + plotW}
            y2={PAD.top + plotH * (1 - pct)}
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeDasharray="4 4"
          />
        ))}

        {/* Spending line (blue-ish / muted) */}
        <motion.path
          d={spendPath}
          fill="none"
          stroke="var(--brutal-cyan)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? {} : { pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        />

        {/* Outcome line (red / pink) */}
        <motion.path
          d={outcomePath}
          fill="none"
          stroke="var(--brutal-pink)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? {} : { pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Year labels */}
        <text x={xScale(minYear)} y={H - 5} textAnchor="start" className="fill-muted-foreground text-[9px] font-bold">
          {minYear}
        </text>
        <text x={xScale(maxYear)} y={H - 5} textAnchor="end" className="fill-muted-foreground text-[9px] font-bold">
          {maxYear}
        </text>

        {/* Left axis label (spending) */}
        <text x={5} y={PAD.top + 4} textAnchor="start" className="fill-brutal-cyan text-[8px] font-black">
          {formatCompact(spendMax)}
        </text>

        {/* Right axis label (outcome) */}
        <text x={W - 5} y={PAD.top + 4} textAnchor="end" className="fill-brutal-pink text-[8px] font-black">
          {formatCompact(outcomeMax)}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-1">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-brutal-cyan" />
          <span className="text-[9px] font-bold text-muted-foreground">Spending</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-brutal-pink" />
          <span className="text-[9px] font-bold text-muted-foreground">Outcome</span>
        </div>
      </div>

      {/* Rationale */}
      {!compact && (
        <p className="text-xs font-bold text-muted-foreground mt-2 leading-relaxed">
          {agency.gradeRationale}
        </p>
      )}
    </div>
  );
}
