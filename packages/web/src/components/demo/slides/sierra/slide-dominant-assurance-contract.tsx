"use client";

import { SierraSlideWrapper } from "./SierraSlideWrapper";
import { useEffect, useState } from "react";
import {
  PRIZE_POOL_SIZE,
  VOTE_TOKEN_VALUE,
  PRIZE_POOL_HORIZON_MULTIPLE,
  GLOBAL_INVESTABLE_ASSETS,
  PRIZE_POOL_PARTICIPATION_RATE,
} from "@optimitron/data/parameters";

const depositT = Math.round((GLOBAL_INVESTABLE_ASSETS.value * PRIZE_POOL_PARTICIPATION_RATE.value) / 1e12 * 10) / 10;
const poolT = Math.round(PRIZE_POOL_SIZE.value / 1e12);
const multiple = Math.round(PRIZE_POOL_HORIZON_MULTIPLE.value);
const voteValue = `$${Math.round(VOTE_TOKEN_VALUE.value).toLocaleString()}`;

export function SlideDominantAssuranceContract() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
      setTimeout(() => setPhase(5), 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <SierraSlideWrapper act={2} className="text-emerald-400">
      <div className="flex flex-col items-center justify-center gap-6 max-w-[1200px] mx-auto">
        <h1
          className="font-pixel text-2xl md:text-4xl text-emerald-400 text-center transition-opacity duration-500"
          style={{ opacity: phase >= 1 ? 1 : 0 }}
        >
          THE EARTH OPTIMIZATION PRIZE FUND
        </h1>

        {/* Flow: deposits → growth → value per vote */}
        <div
          className="flex items-center justify-center gap-4 md:gap-6 transition-opacity duration-500"
          style={{ opacity: phase >= 2 ? 1 : 0 }}
        >
          <div className="text-center">
            <div className="font-pixel text-3xl md:text-5xl text-cyan-400">${depositT}T</div>
            <div className="font-terminal text-lg md:text-xl text-zinc-400">1% of global savings</div>
          </div>
          <div className="font-pixel text-2xl text-zinc-500">→</div>
          <div className="text-center">
            <div className="font-pixel text-3xl md:text-5xl text-emerald-400">${poolT}T</div>
            <div className="font-terminal text-lg md:text-xl text-zinc-400">17%/yr across VC sector</div>
          </div>
          <div className="font-pixel text-2xl text-zinc-500">→</div>
          <div className="text-center">
            <div className="font-pixel text-3xl md:text-5xl text-amber-400">{voteValue}</div>
            <div className="font-terminal text-lg md:text-xl text-zinc-400">per vote</div>
          </div>
        </div>

        {/* Two outcomes */}
        <div
          className="grid grid-cols-2 gap-6 w-full transition-opacity duration-500"
          style={{ opacity: phase >= 3 ? 1 : 0 }}
        >
          <div className="bg-emerald-500/10 border-2 border-emerald-500/40 rounded-lg p-5 text-center space-y-2">
            <div className="text-4xl">🌍</div>
            <div className="font-pixel text-xl md:text-2xl text-emerald-400">TARGETS HIT</div>
            <div className="font-terminal text-lg md:text-xl text-zinc-300">
              Pool splits by votes recruited
            </div>
          </div>
          <div className="bg-cyan-500/10 border-2 border-cyan-500/40 rounded-lg p-5 text-center space-y-2">
            <div className="text-4xl">📈</div>
            <div className="font-pixel text-xl md:text-2xl text-cyan-400">TARGETS MISSED</div>
            <div className="font-terminal text-lg md:text-xl text-zinc-300">
              Money back + {multiple}× returns
            </div>
          </div>
        </div>

        <div
          className="font-pixel text-xl md:text-2xl text-emerald-300 text-center transition-opacity duration-500"
          style={{ opacity: phase >= 4 ? 1 : 0 }}
        >
          Both paths pay.
        </div>
      </div>
    </SierraSlideWrapper>
  );
}
export default SlideDominantAssuranceContract;
