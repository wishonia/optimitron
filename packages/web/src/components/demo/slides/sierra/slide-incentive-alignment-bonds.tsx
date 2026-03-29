"use client";

import { SierraSlideWrapper } from "./SierraSlideWrapper";

export function SlideIncentiveAlignmentBonds() {
  return (
    <SierraSlideWrapper act={2} className="text-blue-400">
      <div className="flex flex-col items-center justify-center gap-5 max-w-[1700px] mx-auto">
        {/* Flow diagram */}
        <div className="w-full space-y-3">
          {/* INPUT */}
          <div className="bg-blue-500/15 border-2 border-blue-500/40 rounded-lg p-4 text-center">
            <div className="font-pixel text-2xl md:text-3xl text-blue-400 mb-1">💰 INCENTIVE ALIGNMENT BONDS</div>
            <div className="font-pixel text-2xl md:text-3xl text-blue-400">$1 BILLION</div>
            <div className="font-terminal text-2xl text-zinc-200 mt-1">
              📜 Fund the 1% Treaty campaign
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="font-pixel text-2xl text-blue-400">⬇️</div>
          </div>

          {/* TREATY PASSES */}
          <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-lg p-3 text-center">
            <div className="font-pixel text-2xl md:text-3xl text-emerald-400">
              🕊️ TREATY PASSES
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="font-pixel text-2xl text-blue-400">⬇️</div>
          </div>

          {/* OUTPUT - three allocations */}
          <div className="p-4">
            <div className="font-pixel text-2xl md:text-3xl text-blue-400 mb-3 text-center">
              💸 $27 BILLION / YEAR
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-3 text-center">
                <div className="font-pixel text-2xl md:text-3xl text-emerald-400">🧬 80% PRAGMATIC CLINICAL TRIALS</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 text-center">
                <div className="font-pixel text-2xl md:text-3xl text-yellow-400">🤑 10% BOND HOLDERS</div>
                <div className="font-pixel text-2xl md:text-3xl text-yellow-300">270% / YR FOREVER</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3 text-center">
                <div className="font-pixel text-2xl md:text-3xl text-purple-400">🏛️ 10% SUPERPACS FOR ALIGNED POLITICIANS</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </SierraSlideWrapper>
  );
}
export default SlideIncentiveAlignmentBonds;
