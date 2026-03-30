"use client";

import { SierraSlideWrapper } from "./SierraSlideWrapper";
import { GlitchText } from "../../animations/sierra/glitch-text";
import { useEffect, useState } from "react";
import { buildTerminalMatrixColumns } from "@/lib/demo/deterministic";

const terminalLines = [
  { text: "> ANALYZING GOVERNMENT PRIORITIES...", delay: 0 },
  { text: "> GOAL: MAXIMIZE CONSTITUENT WELFARE", delay: 500 },
  { text: "> SCANNING BUDGET ALLOCATIONS...", delay: 1200 },
  { text: "", delay: 1800 },
  { text: "  MILITARY:        $2,720,000,000,000", delay: 2000 },
  { text: "  CLINICAL TRIALS: $4,500,000,000", delay: 2400 },
  { text: "", delay: 2800 },
  { text: "> ERROR: OBJECTIVE MISMATCH DETECTED", delay: 3000, error: true },
  { text: "> WELFARE ≠ ACTUAL ALLOCATION", delay: 3500, error: true },
  { text: "", delay: 4000 },
  { text: "> DIAGNOSIS: MISALIGNED SUPERINTELLIGENCE", delay: 4200, warning: true },
];

const MATRIX_COLUMNS = buildTerminalMatrixColumns(20, 30);

export function SlideAITerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    terminalLines.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(index + 1);
      }, line.delay);
    });

    // Blink cursor
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <SierraSlideWrapper act={1} className="text-green-500">
      {/* Matrix-style falling code background */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        {MATRIX_COLUMNS.map((column, i) => (
          <div
            key={i}
            className="absolute text-green-400 font-mono text-xs animate-fall"
            style={{
              left: `${column.leftPct}%`,
              animationDuration: `${column.durationSeconds}s`,
              animationDelay: `${column.delaySeconds}s`,
            }}
          >
            {column.glyphs.map((glyph, j) => (
              <div key={j}>{glyph}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Terminal window */}
      <div className="w-full max-w-[1700px] mx-auto">
        {/* Terminal header */}
        <div className="bg-zinc-800 border-b border-zinc-700 px-4 py-2 flex items-center gap-2 rounded-t-lg">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 font-terminal text-xs text-zinc-200">
            government_optimizer.exe
          </span>
        </div>

        {/* Terminal body */}
        <div className="bg-black/90 border border-zinc-800 rounded-b-lg p-4 md:p-6 min-h-[300px] md:min-h-[400px]">
          <div className="font-terminal text-xl md:text-2xl space-y-1">
            {terminalLines.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className={
                  line.error
                    ? "text-red-500"
                    : line.warning
                    ? "text-yellow-500"
                    : "text-green-400"
                }
              >
                {line.warning ? (
                  <GlitchText text={line.text} intensity="high" />
                ) : (
                  line.text
                )}
              </div>
            ))}
            
            {/* Cursor */}
            <span className={`text-green-400 ${showCursor ? "opacity-100" : "opacity-0"}`}>
              _
            </span>
          </div>
        </div>
      </div>

      {/* Glitchy overlay text */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <GlitchText
          text="GOVERNMENTS ARE MISALIGNED AI"
          className="font-pixel text-xl md:text-2xl text-red-500"
          intensity="medium"
        />
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </SierraSlideWrapper>
  );
}
export default SlideAITerminal;
