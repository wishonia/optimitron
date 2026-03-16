"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const variantStyles = {
  pink: {
    bg: "bg-brutal-pink",
    text: "text-white",
    subtext: "text-white/70",
    stat: "border-white/30 text-white",
    statLabel: "text-white/50",
    btn: "bg-black text-white hover:bg-black/80",
    kicker: "text-white/60",
  },
  yellow: {
    bg: "bg-brutal-yellow",
    text: "text-black",
    subtext: "text-black/70",
    stat: "border-black/20 text-black",
    statLabel: "text-black/50",
    btn: "bg-black text-white hover:bg-black/80",
    kicker: "text-black/50",
  },
  cyan: {
    bg: "bg-brutal-cyan",
    text: "text-black",
    subtext: "text-black/70",
    stat: "border-black/20 text-black",
    statLabel: "text-black/50",
    btn: "bg-black text-white hover:bg-black/80",
    kicker: "text-black/50",
  },
  dark: {
    bg: "bg-black",
    text: "text-white",
    subtext: "text-white/70",
    stat: "border-white/20 text-white",
    statLabel: "text-white/50",
    btn: "bg-brutal-pink text-white hover:bg-brutal-pink/80",
    kicker: "text-white/50",
  },
} as const;

interface PrizeCTAProps {
  headline: string;
  body: string;
  variant?: keyof typeof variantStyles;
}

export function PrizeCTA({ headline, body, variant = "pink" }: PrizeCTAProps) {
  const s = variantStyles[variant];

  return (
    <ScrollReveal>
      <div
        className={`${s.bg} border-4 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
      >
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${s.kicker} mb-3`}>
          Earth Optimization Prize
        </p>
        <h3 className={`text-xl font-black uppercase ${s.text} mb-2`}>
          {headline}
        </h3>
        <p className={`text-sm font-medium ${s.subtext} mb-5 leading-relaxed`}>
          {body}
        </p>
        <div className="flex flex-wrap gap-4 mb-5">
          <div className={`border-2 ${s.stat} px-3 py-1.5`}>
            <div className={`text-[10px] font-black uppercase ${s.statLabel}`}>Plan fails</div>
            <div className="text-sm font-black">~4.2x back</div>
          </div>
          <div className={`border-2 ${s.stat} px-3 py-1.5`}>
            <div className={`text-[10px] font-black uppercase ${s.statLabel}`}>Plan succeeds</div>
            <div className="text-sm font-black">Higher GDP</div>
          </div>
          <div className={`border-2 ${s.stat} px-3 py-1.5`}>
            <div className={`text-[10px] font-black uppercase ${s.statLabel}`}>Downside</div>
            <div className="text-sm font-black">None</div>
          </div>
        </div>
        <Link
          href="/prize"
          className={`inline-flex items-center justify-center ${s.btn} border-2 border-black px-6 py-2.5 text-sm font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]`}
        >
          Join the Prize
        </Link>
      </div>
    </ScrollReveal>
  );
}
