"use client";

import { useEffect, useState } from "react";
import { useDemoStore } from "@/lib/demo/store";
import { useNarrationAudio } from "@/hooks/use-narration-audio";
import { cn } from "@/lib/utils";
import { WishoniaNarrator } from "@optimitron/wishonia-widget/narration";

interface WishoniaPresenterProps {
  text: string;
  slideId?: string;
  expression?: string;
  bodyPose?: string;
}

function usePresenterSize() {
  const [size, setSize] = useState(220);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 480) setSize(100);
      else if (w < 768) setSize(140);
      else if (w < 1024) setSize(180);
      else setSize(220);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

/**
 * Picture-in-picture Wishonia character in the lower-right corner.
 * Owns audio playback (live TTS or MP3 fallback).
 */
export function WishoniaPresenter({
  text,
  slideId,
  expression,
  bodyPose,
}: WishoniaPresenterProps) {
  const {
    isRecordingMode,
    isMuted,
    masterVolume,
    voiceVolume,
    liveTtsEnabled,
  } = useDemoStore();

  const size = usePresenterSize();

  // MP3 fallback: only active when live TTS is disabled
  useNarrationAudio(slideId, !liveTtsEnabled);

  const safeText = text ?? "";

  // In recording mode, narrator box is hidden so character sits lower
  const bottomOffset = isRecordingMode ? 32 : 120;

  return (
    <div
      className={cn(
        "fixed z-[38] pointer-events-none",
        "transition-all duration-500 ease-out"
      )}
      style={{
        bottom: bottomOffset,
        right: 16,
      }}
    >
      <div className="pointer-events-auto">
        {liveTtsEnabled ? (
          <WishoniaNarrator
            tokenEndpoint="/api/gemini-live-token"
            text={safeText}
            expression={
              expression as Parameters<typeof WishoniaNarrator>[0]["expression"]
            }
            bodyPose={
              bodyPose as Parameters<typeof WishoniaNarrator>[0]["bodyPose"]
            }
            size={size}
            position="custom"
            style={{ position: "relative" }}
            volume={masterVolume * voiceVolume}
            muted={isMuted}
            onNarrationEnd={() => {
              useDemoStore.getState().setNarrationEnded(true);
            }}
          />
        ) : (
          <WishoniaNarrator
            tokenEndpoint=""
            text=""
            expression={
              expression as Parameters<typeof WishoniaNarrator>[0]["expression"]
            }
            bodyPose={
              bodyPose as Parameters<typeof WishoniaNarrator>[0]["bodyPose"]
            }
            size={size}
            position="custom"
            style={{ position: "relative" }}
            muted
          />
        )}
      </div>
    </div>
  );
}
