"use client";

import type { DemoSegment } from "@/lib/demo-script";
import { SierraSlideWrapper } from "./SierraSlideWrapper";

interface LegacyNarrationSlideProps {
  segment?: DemoSegment;
}

type SierraWrapperAct = 1 | 2 | 3 | "turn";

const ACT_LABELS: Record<NonNullable<DemoSegment["act"]>, string> = {
  I: "ACT I // DIAGNOSE",
  turn: "THE TURN",
  "II-solution": "ACT II // SOLUTION",
  "II-game": "ACT II // GAME",
  "II-money": "ACT II // FUND",
  "II-accountability": "ACT II // ACCOUNTABILITY",
  "II-armory": "ACT II // ARMORY",
  "II-climax": "ACT II // CLIMAX",
  III: "ACT III // CLOSE",
};

function getWrapperAct(segment: DemoSegment): SierraWrapperAct {
  if (segment.act === "I") return 1;
  if (segment.act === "turn") return "turn";
  if (segment.act === "III") return 3;
  if (segment.act) return 2;
  if (segment.tags.includes("cta")) return 3;
  if (segment.tags.includes("hook") || segment.tags.includes("problem")) return 1;
  return 2;
}

function getTheme(bgColor?: DemoSegment["bgColor"]) {
  switch (bgColor) {
    case "foreground":
      return {
        title: "text-amber-400",
        border: "border-amber-400/40",
        kicker: "text-amber-300",
        chip: "border-amber-400/40 bg-amber-400/10 text-amber-200",
      };
    case "pink":
      return {
        title: "text-pink-400",
        border: "border-pink-400/40",
        kicker: "text-pink-300",
        chip: "border-pink-400/40 bg-pink-400/10 text-pink-200",
      };
    case "cyan":
      return {
        title: "text-cyan-400",
        border: "border-cyan-400/40",
        kicker: "text-cyan-300",
        chip: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
      };
    case "yellow":
      return {
        title: "text-yellow-300",
        border: "border-yellow-300/40",
        kicker: "text-yellow-200",
        chip: "border-yellow-300/40 bg-yellow-300/10 text-yellow-100",
      };
    default:
      return {
        title: "text-zinc-100",
        border: "border-zinc-500/40",
        kicker: "text-zinc-300",
        chip: "border-zinc-500/40 bg-zinc-500/10 text-zinc-100",
      };
  }
}

function formatScore(scoreAdd?: number): string | null {
  if (!scoreAdd) return null;
  return `+${scoreAdd.toLocaleString()} score`;
}

export default function LegacyNarrationSlide({
  segment,
}: LegacyNarrationSlideProps) {
  if (!segment) {
    return (
      <SierraSlideWrapper act={2}>
        <div className="px-8 text-center">
          <div className="font-pixel text-2xl text-zinc-100">
            Scene Not Available
          </div>
        </div>
      </SierraSlideWrapper>
    );
  }

  const wrapperAct = getWrapperAct(segment);
  const theme = getTheme(segment.bgColor);
  const actLabel = segment.act ? ACT_LABELS[segment.act] : "NARRATED SEQUENCE";
  const scoreLabel = formatScore(segment.scoreAdd);

  return (
    <SierraSlideWrapper act={wrapperAct} className="overflow-hidden">
      <div className="w-full max-w-[1600px] px-6 py-8 md:px-10 md:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div
            className={`font-pixel text-xs uppercase tracking-[0.35em] ${theme.kicker}`}
          >
            {actLabel}
          </div>
          <div className="font-terminal text-xl text-zinc-500">
            {segment.title.toUpperCase()}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <section
            className={`bg-black/45 px-5 py-5 md:px-8 md:py-7 ${theme.border} border-2`}
          >
            <h1
              className={`font-pixel text-2xl leading-relaxed md:text-4xl lg:text-5xl ${theme.title}`}
            >
              {segment.title}
            </h1>
            <div className="mt-6 h-px bg-zinc-700" />
            <p className="mt-6 font-terminal text-2xl leading-relaxed text-zinc-200 md:text-3xl">
              {segment.narration}
            </p>
          </section>

          <aside className="space-y-4">
            <section
              className={`bg-black/40 px-4 py-4 ${theme.border} border-2`}
            >
              <div className="font-pixel text-xs uppercase tracking-[0.3em] text-zinc-500">
                Signal Tags
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {segment.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`border px-2 py-1 font-pixel text-[10px] uppercase tracking-[0.2em] ${theme.chip}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {(scoreLabel || segment.inventoryAdd) && (
              <section
                className={`bg-black/40 px-4 py-4 ${theme.border} border-2`}
              >
                <div className="font-pixel text-xs uppercase tracking-[0.3em] text-zinc-500">
                  Unlocks
                </div>
                <div className="mt-3 space-y-3">
                  {scoreLabel && (
                    <div className="font-terminal text-2xl text-zinc-200">
                      {scoreLabel}
                    </div>
                  )}
                  {segment.inventoryAdd && (
                    <div className="font-terminal text-2xl text-zinc-200">
                      {segment.inventoryAdd.icon} {segment.inventoryAdd.name}
                    </div>
                  )}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </SierraSlideWrapper>
  );
}
