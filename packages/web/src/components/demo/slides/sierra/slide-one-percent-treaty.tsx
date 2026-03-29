"use client";

import { SierraSlideWrapper } from "./SierraSlideWrapper";
import { AnimatedCounter } from "../../animations/sierra/animated-counter";
import {
  GLOBAL_MILITARY_SPENDING_ANNUAL_2024,
  GLOBAL_GOVERNMENT_CLINICAL_TRIALS_SPENDING_ANNUAL,
  TREATY_ANNUAL_FUNDING,
  MILITARY_TO_GOVERNMENT_CLINICAL_TRIALS_SPENDING_RATIO,
} from "@optimitron/data/parameters";
import { formatCurrency } from "@/lib/demo/formatters";
import { useEffect, useState } from "react";

const militaryGlobal = GLOBAL_MILITARY_SPENDING_ANNUAL_2024.value;
const trialsGlobal = GLOBAL_GOVERNMENT_CLINICAL_TRIALS_SPENDING_ANNUAL.value;
const ratio = MILITARY_TO_GOVERNMENT_CLINICAL_TRIALS_SPENDING_RATIO.value;
const currentMilitaryPct = (ratio / (ratio + 1)) * 100; // ~99.83%
const currentTrialsPct = (1 / (ratio + 1)) * 100; // ~0.17%
const onePercentMilitary = TREATY_ANNUAL_FUNDING.value;

export function SlideOnePercentTreaty() {
  const [sliderValue, setSliderValue] = useState(0);
  const [showImpact, setShowImpact] = useState(false);
  const [fingerPhase, setFingerPhase] = useState<"waiting" | "dragging" | "done">("waiting");

  useEffect(() => {
    // Phase 1: finger appears, pauses, then drags
    const startDrag = setTimeout(() => {
      setFingerPhase("dragging");

      // Animate slider from 0 to 1%
      const interval = setInterval(() => {
        setSliderValue((prev) => {
          if (prev >= 1) {
            clearInterval(interval);
            setFingerPhase("done");
            setTimeout(() => setShowImpact(true), 500);
            return 1;
          }
          return prev + 0.02;
        });
      }, 40);

      return () => clearInterval(interval);
    }, 800);

    return () => clearTimeout(startDrag);
  }, []);

  const redirectedAmount = (sliderValue / 100) * militaryGlobal;

  return (
    <SierraSlideWrapper act={2} className="text-emerald-400">
      {/* Title */}
      <h1 className="font-pixel text-xl md:text-2xl text-emerald-400 text-center mb-8">
        THE 1% TREATY
      </h1>

      <div className="w-full max-w-[1700px] mx-auto space-y-8">
        {/* Before/After comparison */}
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          {/* Before */}
          <div className="text-center p-4 bg-muted border-2 border-brutal-red rounded">
            <div className="font-pixel text-xl text-red-400 mb-2">CURRENT</div>
            <div className="text-3xl mb-2">⚔️</div>
            <div className="font-pixel text-xl text-red-400">
              {formatCurrency(militaryGlobal)}
            </div>
            <div className="font-pixel text-2xl text-zinc-200 mt-1">
              {currentMilitaryPct.toFixed(1)}% to military
            </div>
          </div>

          {/* After */}
          <div className="text-center p-4 bg-muted border-2 border-brutal-cyan rounded">
            <div className="font-pixel text-xl text-emerald-400 mb-2">PROPOSED</div>
            <div className="flex justify-center gap-2 mb-2">
              <span className="text-2xl">⚔️</span>
              <span className="text-2xl">🧪</span>
            </div>
            <div className="font-pixel text-xl text-emerald-400">
              99% + 1%
            </div>
            <div className="font-pixel text-2xl text-zinc-200 mt-1">
              Tiny shift, massive impact
            </div>
          </div>
        </div>

        {/* Animated slider */}
        <div className="space-y-4">
          <div className="font-pixel text-2xl text-center text-zinc-200">
            REALLOCATION SLIDER
          </div>
          
          <div className="relative h-12 bg-zinc-900 border-2 border-primary rounded flex">
            {/* Military portion */}
            <div
              className="relative bg-brutal-red transition-all duration-100 flex items-center justify-center overflow-hidden rounded-l"
              style={{ width: `${100 - sliderValue}%` }}
            >
              <span className="font-pixel text-xl text-brutal-red-foreground whitespace-nowrap">
                Military: {(100 - sliderValue).toFixed(1)}%
              </span>
            </div>

            {/* Trials portion */}
            <div
              className="relative bg-brutal-cyan transition-all duration-100 flex items-center overflow-hidden rounded-r"
              style={{ width: `${Math.max(sliderValue, 0.5)}%` }}
            >
              {sliderValue > 0.3 && (
                <span className="font-pixel text-xl text-brutal-cyan-foreground whitespace-nowrap pl-2">
                  Trials: {sliderValue.toFixed(1)}%
                </span>
              )}
            </div>

            {/* Animated finger */}
            {fingerPhase !== "done" && (
              <div
                className="absolute -top-10 z-10 pointer-events-none transition-all duration-100"
                style={{
                  left: `${100 - sliderValue}%`,
                  transform: "translateX(-50%)",
                  opacity: fingerPhase === "waiting" ? 0.6 : 1,
                }}
              >
                <span className={`text-4xl ${fingerPhase === "waiting" ? "animate-bounce" : ""}`}>
                  👆
                </span>
              </div>
            )}
          </div>

          {/* Slider track visualization */}
          <div className="flex justify-between font-pixel text-2xl">
            <span className="text-brutal-red">{(100 - sliderValue).toFixed(1)}% Military</span>
            <span className="text-brutal-cyan">{sliderValue.toFixed(1)}% Clinical Trials</span>
          </div>
        </div>

        {/* Amount being redirected */}
        <div className="text-center">
          <div className="font-pixel text-2xl text-zinc-200 mb-2">
            FUNDS REDIRECTED TO CLINICAL TRIALS
          </div>
          <div className="font-pixel text-3xl md:text-5xl text-emerald-400">
            <AnimatedCounter
              end={onePercentMilitary}
              duration={2000}
              format="currency"
              decimals={1}
            />
          </div>
          <div className="font-pixel text-2xl text-zinc-200 mt-2">
            per year
          </div>
        </div>

        {/* Impact reveal */}
        {showImpact && (
          <div className="grid grid-cols-3 gap-4 animate-fade-in">
            <div className="text-center p-3 bg-muted border-2 border-brutal-cyan rounded">
              <div className="text-2xl mb-1">🧬</div>
              <div className="font-pixel text-2xl text-emerald-400">12.3x</div>
              <div className="font-pixel text-2xl text-zinc-200">Faster trials</div>
            </div>
            <div className="text-center p-3 bg-muted border-2 border-brutal-cyan rounded">
              <div className="text-2xl mb-1">💊</div>
              <div className="font-pixel text-2xl text-cyan-400">1000+</div>
              <div className="font-pixel text-2xl text-zinc-200">New treatments</div>
            </div>
            <div className="text-center p-3 bg-muted border-2 border-brutal-yellow rounded">
              <div className="text-2xl mb-1">🌍</div>
              <div className="font-pixel text-2xl text-amber-400">10.7B</div>
              <div className="font-pixel text-2xl text-zinc-200">Lives saved</div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </SierraSlideWrapper>
  );
}
export default SlideOnePercentTreaty;
