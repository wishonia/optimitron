"use client";

import { ScanLines } from "@/components/animations/GlitchText";
import { CollapseCountdownTimer } from "@/components/animations/CollapseCountdownTimer";
import { GdpTrajectoryChart } from "@/components/animations/GdpTrajectoryChart";

/** 5. Collapse clock slide — doom countdown fills viewport */
export default function CollapseClockSlide() {
  return (
    <div className="relative flex flex-col items-stretch justify-center h-full overflow-hidden">
      <ScanLines />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-4xl [&_*]:!text-4xl [&_*]:sm:!text-5xl [&_*]:md:!text-6xl">
          <CollapseCountdownTimer />
        </div>
      </div>
      <div className="flex-1 w-full px-2">
        <GdpTrajectoryChart />
      </div>
    </div>
  );
}
