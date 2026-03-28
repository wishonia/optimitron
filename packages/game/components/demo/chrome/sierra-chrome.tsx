"use client";

import { useDemoStore } from "@/lib/demo/store";
import { cn } from "@/lib/utils";
import { SierraHUD } from "./sierra-hud";
import { NarratorBox } from "./narrator-box";
import { VerbBar, type VerbType } from "./verb-bar";
import { Inventory, InventoryCompact } from "./inventory";
import { SlideCTA } from "./slide-cta";
import { WishoniaPresenter } from "./wishonia-presenter";

interface SierraChromeProps {
  narrationText: string;
  slideId?: string;
  onNarrationComplete?: () => void;
  onVerbSelect?: (verb: VerbType) => void;
  activeVerb?: VerbType;
  showVerbBar?: boolean;
  expression?: string;
  bodyPose?: string;
  children: React.ReactNode;
}

/**
 * Sierra Chrome - Complete UI wrapper for the demo
 * Includes: HUD (top), Scene (center), Narrator (bottom), Verb Bar, Inventory
 */
export function SierraChrome({
  narrationText,
  slideId,
  onNarrationComplete,
  onVerbSelect,
  activeVerb,
  showVerbBar = true,
  expression,
  bodyPose,
  children,
}: SierraChromeProps) {
  const { palette, isRecordingMode } = useDemoStore();

  return (
    <div className={cn(
      "relative w-full h-screen overflow-hidden",
      "crt-container crt-scanlines",
      `palette-${palette}`,
      "bg-[var(--sierra-bg)]"
    )}>
      {/* Top HUD - Score, Death Ticker, Quest Meters */}
      {!isRecordingMode && <SierraHUD />}

      {/* Main Scene Area */}
      <main className={cn(
        "absolute inset-0",
        !isRecordingMode && "pt-16 md:pt-20", // Space for HUD
        !isRecordingMode && "pb-32 md:pb-40", // Space for narrator + verb bar
        "flex items-center justify-center",
        "overflow-hidden"
      )}>
        <div className={cn(
          "relative w-full h-full mx-auto",
          !isRecordingMode && "max-w-[1600px] px-4"
        )}>
          {children}
          {/* CTA button — shifted left to clear Wishonia presenter */}
          {!isRecordingMode && (
            <div className="absolute bottom-2 left-4 md:left-auto md:right-[280px] z-20">
              <SlideCTA />
            </div>
          )}
        </div>
      </main>

      {/* Wishonia presenter — PiP character in lower-right corner */}
      <WishoniaPresenter
        text={narrationText}
        slideId={slideId}
        expression={expression}
        bodyPose={bodyPose}
      />

      {/* Bottom Section - Narrator text, Verb Bar, Inventory */}
      {!isRecordingMode && (
        <div className={cn(
          "fixed bottom-0 left-0 right-0 z-30",
          `palette-${palette}`
        )}>
          {/* Narrator Box (text only — character is in WishoniaPresenter) */}
          <NarratorBox
            text={narrationText}
            onComplete={onNarrationComplete}
          />

          {/* Verb Bar + Inventory */}
          {showVerbBar && (
            <div className={cn(
              "flex items-center justify-between",
              "px-2 pb-2 md:px-4 md:pb-4"
            )}>
              <VerbBar
                onVerbSelect={onVerbSelect}
                activeVerb={activeVerb}
              />

              {/* Desktop Inventory */}
              <div className="hidden md:block">
                <Inventory />
              </div>

              {/* Mobile Inventory */}
              <div className="md:hidden">
                <InventoryCompact />
              </div>
            </div>
          )}
        </div>
      )}

      {/* CRT Glow Effect */}
      <div className={cn(
        "absolute inset-0 pointer-events-none",
        "crt-glow"
      )} />
    </div>
  );
}

export default SierraChrome;
