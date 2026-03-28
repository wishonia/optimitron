"use client";

import { useEffect, useRef } from "react";
import { useDemoStore } from "@/lib/demo/store";

/** Cached manifest — fetched once */
let manifestCache: Record<string, { hash: string; file: string }> | null = null;
let manifestLoading = false;

async function getManifest() {
  if (manifestCache) return manifestCache;
  if (manifestLoading) return null;
  manifestLoading = true;
  try {
    const res = await fetch("/audio/narration/manifest.json");
    if (res.ok) {
      manifestCache = await res.json();
    }
  } catch {
    // No manifest = no audio files generated yet
  }
  manifestLoading = false;
  return manifestCache;
}

/**
 * Hook to play narration audio for the current slide (MP3 fallback)
 */
export function useNarrationAudio(slideId?: string, enabled = true) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isMuted, voiceVolume, masterVolume, isPlaying } = useDemoStore();

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : masterVolume * voiceVolume;
    }
  }, [isMuted, voiceVolume, masterVolume]);

  // Pause/resume with play state
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Load and play audio when slide changes
  useEffect(() => {
    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    if (!slideId || !enabled) return;

    let cancelled = false;

    (async () => {
      const manifest = await getManifest();
      if (cancelled || !manifest || !manifest[slideId]) return;

      const audio = new Audio(`/audio/narration/${manifest[slideId].file}`);
      audio.volume = isMuted ? 0 : masterVolume * voiceVolume;
      audioRef.current = audio;

      // Signal auto-advance when narration finishes
      audio.addEventListener("ended", () => {
        useDemoStore.getState().setNarrationEnded(true);
      });

      // Auto-play (may be blocked by browser policy until user interaction)
      audio.play().catch(() => {});
    })();

    return () => {
      cancelled = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [slideId, enabled]); // eslint-disable-line react-hooks/exhaustive-deps
}
