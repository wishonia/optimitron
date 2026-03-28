"use client";

import { SlideBase } from "../slide-base";
import { GlitchText } from "../../animations/glitch-text";
import { GAME_PARAMS } from "@/lib/demo/parameters";
import {
  CUMULATIVE_MILITARY_SPENDING_FED_ERA,
  MONEY_PRINTER_WAR_DEATHS,
} from "@optimitron/data/parameters";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/demo/formatters";

const militarySpent = CUMULATIVE_MILITARY_SPENDING_FED_ERA.value;
const warDeaths = MONEY_PRINTER_WAR_DEATHS.value;

const STEPS = [
  {
    number: "1",
    prefix: "PRINTED",
    value: formatCurrency(militarySpent),
    suffix: "OUT OF NOTHING",
    color: "text-amber-400",
    delay: 800,
  },
  {
    number: "2",
    prefix: "USED IT TO KILL",
    value: warDeaths.toLocaleString(),
    suffix: "OF YOU",
    color: "text-red-500",
    delay: 2200,
  },
  {
    number: "3",
    prefix: "YOUR PAY NOW BUYS",
    value: `${GAME_PARAMS.dollarPurchasingPowerLost}%`,
    suffix: "LESS BECAUSE THEY PRINTED IT",
    color: "text-red-400",
    delay: 3600,
  },
];

export function SlideMilitaryWaste170t() {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [showPunchline, setShowPunchline] = useState(false);

  useEffect(() => {
    STEPS.forEach((step, i) => {
      setTimeout(() => setVisibleSteps(i + 1), step.delay);
    });
    setTimeout(() => setShowPunchline(true), 5200);
  }, []);

  return (
    <SlideBase act={1} className="text-red-500">
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        {/* Alert bar */}
        <div className="bg-black border-2 border-red-500/40 rounded p-3 text-center animate-pulse">
          <GlitchText
            text="⚠️ ALERT ⚠️"
            className="font-pixel text-2xl md:text-4xl text-red-500"
            intensity="medium"
          />
        </div>

        {/* Header */}
        <div className="font-pixel text-2xl md:text-3xl text-zinc-200 text-center">
          YOUR GOVERNMENTS HAVE:
        </div>

        {/* Sequential steps — each on its own lines */}
        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`transition-all duration-700 ${
                i < visibleSteps
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="flex items-start gap-5">
                <div className={`font-pixel text-3xl md:text-5xl ${step.color} shrink-0`}>
                  {step.number}.
                </div>
                <div className="space-y-1">
                  <div className="font-pixel text-xl md:text-2xl text-zinc-400">
                    {step.prefix}
                  </div>
                  <div className={`font-pixel text-4xl md:text-6xl ${step.color}`}>
                    {step.value}
                  </div>
                  <div className="font-pixel text-xl md:text-2xl text-zinc-400">
                    {step.suffix}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Punchline */}
        <div
          className={`transition-all duration-1000 mt-2 ${
            showPunchline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="font-pixel text-2xl md:text-3xl text-zinc-200 text-center italic">
            You did not vote for any of this.
          </div>
        </div>
      </div>
    </SlideBase>
  );
}
