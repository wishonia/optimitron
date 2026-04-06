"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import {
  DEATHS_PER_SECOND,
  DEATHS_PER_DAY,
  DYSFUNCTION_TAX_PER_SECOND,
  DYSFUNCTION_TAX_PER_YEAR,
  DESTRUCTIVE_PER_SECOND,
  DESTRUCTIVE_BASE_T,
} from "@/lib/collapse-projections";

function formatDollars(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${Math.floor(n).toLocaleString()}`;
}

interface CounterConfig {
  rate: number;
  format: (n: number) => string;
  color: string;
  emoji: string;
  label: string;
  staticFallback: string;
}

const counters: CounterConfig[] = [
  {
    rate: DEATHS_PER_SECOND,
    format: (n) => Math.floor(n).toLocaleString(),
    color: "text-brutal-red",
    emoji: "💀",
    label: "Died from treatable diseases",
    staticFallback: `~${DEATHS_PER_DAY.toLocaleString()} deaths/day`,
  },
  {
    rate: DYSFUNCTION_TAX_PER_SECOND,
    format: formatDollars,
    color: "text-brutal-pink",
    emoji: "🔥",
    label: "Burned by misaligned governments",
    staticFallback: `$${Math.round(DYSFUNCTION_TAX_PER_YEAR / 1e12)}T/yr governance waste`,
  },
  {
    rate: DESTRUCTIVE_PER_SECOND,
    format: formatDollars,
    color: "text-brutal-cyan",
    emoji: "💣",
    label: "Spent on destruction instead of cures",
    staticFallback: `$${DESTRUCTIVE_BASE_T.toFixed(1)}T/yr military + cybercrime`,
  },
];

export function LiveDeathTicker({ className = "" }: { className?: string }) {
  const refs = [
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
  ];
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const accumulated = [0, 0, 0];
    const interval = setInterval(() => {
      for (let i = 0; i < counters.length; i++) {
        accumulated[i] += counters[i]!.rate * 0.05;
        const el = refs[i]!.current;
        if (el) {
          el.textContent = counters[i]!.format(accumulated[i]!);
        }
      }
    }, 50);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 text-center ${className}`}>
        {counters.map((c) => (
          <div key={c.label}>
            <span className="text-3xl mr-2">{c.emoji}</span>
            <span className={`text-lg font-bold ${c.color}`}>{c.staticFallback}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 text-center ${className}`}>
      {counters.map((c, i) => (
        <div key={c.label}>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl sm:text-5xl">{c.emoji}</span>
            <span
              className={`text-3xl sm:text-4xl font-black ${c.color}`}
              style={{ fontVariantNumeric: "tabular-nums" }}
              ref={refs[i]}
            >
              {c.format(0)}
            </span>
          </div>
          <p className="mt-2 max-w-xs mx-auto text-sm sm:text-base font-bold uppercase tracking-wider opacity-80">
            {c.label}
          </p>
        </div>
      ))}
    </div>
  );
}
