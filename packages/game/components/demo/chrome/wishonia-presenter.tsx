"use client";

import { useEffect, useState, useRef } from "react";
import { useDemoStore } from "@/lib/demo/store";
import { useNarrationAudio } from "@/hooks/use-narration-audio";
import { cn } from "@/lib/utils";
import {
  WishoniaCharacter,
  useWishoniaAnimator,
} from "@optimitron/wishonia-widget";
import type { Expression } from "@optimitron/wishonia-widget";

interface WishoniaPresenterProps {
  text: string;
  slideId?: string;
  expression?: string;
  bodyPose?: string;
}

function usePresenterSize() {
  const [size, setSize] = useState(110);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 480) setSize(50);
      else if (w < 768) setSize(70);
      else if (w < 1024) setSize(90);
      else setSize(110);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

/**
 * Probes the Gemini Live token endpoint once.
 * Returns true if live TTS is available, false otherwise.
 */
function useLiveTtsProbe() {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/gemini-live-token")
      .then((res) => {
        if (!cancelled) setAvailable(res.ok);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return available;
}

/**
 * Picture-in-picture Wishonia character in the lower-right corner.
 * Probes live TTS availability on mount; falls back to MP3 + text-driven lip-sync.
 */
export function WishoniaPresenter({
  text,
  slideId,
  expression,
  bodyPose,
}: WishoniaPresenterProps) {
  const { liveTtsEnabled } = useDemoStore();

  // Probe once — null = pending, true = available, false = unavailable
  const liveTtsAvailable = useLiveTtsProbe();
  const useLiveTts = liveTtsEnabled && liveTtsAvailable === true;

  const size = usePresenterSize();

  // MP3 fallback: active when live TTS is disabled or probe failed
  useNarrationAudio(slideId, !useLiveTts);

  const safeText = text ?? "";

  return (
    <div
      className={cn(
        "fixed z-[38] pointer-events-none",
        "transition-all duration-500 ease-out"
      )}
      style={{ bottom: -16, right: 16 }}
    >
      <div className="pointer-events-auto">
        {useLiveTts ? (
          <LiveTtsPresenter
            text={safeText}
            expression={expression}
            bodyPose={bodyPose}
            size={size}
          />
        ) : (
          <StaticPresenter
            text={safeText}
            expression={expression}
            bodyPose={bodyPose}
            size={size}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Live TTS mode — uses WishoniaNarrator with Gemini Live streaming.
 * Only rendered after probe confirms the token endpoint works.
 */
function LiveTtsPresenter({
  text,
  expression,
  bodyPose,
  size,
}: {
  text: string;
  expression?: string;
  bodyPose?: string;
  size: number;
}) {
  // Lazy-import WishoniaNarrator to avoid loading Gemini Live code in fallback mode
  const [Narrator, setNarrator] = useState<typeof import("@optimitron/wishonia-widget/narration").WishoniaNarrator | null>(null);
  const { isMuted, masterVolume, voiceVolume } = useDemoStore();

  useEffect(() => {
    import("@optimitron/wishonia-widget/narration").then((mod) => {
      setNarrator(() => mod.WishoniaNarrator);
    });
  }, []);

  if (!Narrator) return null;

  return (
    <Narrator
      tokenEndpoint="/api/gemini-live-token"
      text={text}
      expression={expression as Parameters<typeof Narrator>[0]["expression"]}
      bodyPose={bodyPose as Parameters<typeof Narrator>[0]["bodyPose"]}
      size={size}
      position="custom"
      style={{ position: "relative" }}
      volume={masterVolume * voiceVolume}
      muted={isMuted}
      onNarrationEnd={() => {
        useDemoStore.getState().setNarrationEnded(true);
      }}
    />
  );
}

/**
 * Static mode — WishoniaCharacter with text-driven lip-sync + MP3 audio.
 * No Gemini Live connection, no token fetch.
 */
function StaticPresenter({
  text,
  expression,
  bodyPose,
  size,
}: {
  text: string;
  expression?: string;
  bodyPose?: string;
  size: number;
}) {
  const { speakText, stopSpeaking } = useWishoniaAnimator({
    expression: expression as Expression,
    bodyPose: bodyPose ?? "idle",
  });

  const prevTextRef = useRef("");

  // Trigger text-driven lip-sync when narration text changes
  useEffect(() => {
    if (text && text !== prevTextRef.current) {
      prevTextRef.current = text;
      stopSpeaking();
      speakText(text, expression as Expression);
    }
  }, [text, expression, speakText, stopSpeaking]);

  return (
    <WishoniaCharacter
      size={size}
      expression={expression as Expression}
      bodyPose={bodyPose}
    />
  );
}
