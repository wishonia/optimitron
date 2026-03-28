"use client";

import { useEffect, useState, useCallback } from "react";
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
 * Attempts live TTS first; falls back to MP3 narration if connection fails.
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

  // Track whether live TTS has failed so we can fall back to MP3
  const [liveTtsFailed, setLiveTtsFailed] = useState(false);

  const size = usePresenterSize();

  // Use MP3 fallback when live TTS is disabled OR when it has failed
  const useMp3 = !liveTtsEnabled || liveTtsFailed;
  useNarrationAudio(slideId, useMp3);

  const safeText = text ?? "";

  const handleConnectionChange = useCallback((connected: boolean) => {
    if (!connected && liveTtsEnabled) {
      // Live TTS connection failed — silently switch to MP3
      setLiveTtsFailed(true);
    }
  }, [liveTtsEnabled]);

  return (
    <div
      className={cn(
        "fixed z-[38] pointer-events-none",
        "transition-all duration-500 ease-out"
      )}
      style={{
        bottom: 0,
        right: 16,
      }}
    >
      <div className="pointer-events-auto">
        {liveTtsEnabled && !liveTtsFailed ? (
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
            onConnectionChange={handleConnectionChange}
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
