"use client";

import { useEffect, useRef } from "react";
import { useDemoStore } from "@/lib/demo/store";

/** Cached manifest — fetched once, concurrent callers wait on the same promise */
let manifestPromise: Promise<Record<string, { hash: string; file: string }> | null> | null = null;

function getManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch("/audio/narration/manifest.json")
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);
  }
  return manifestPromise;
}

/**
 * Hook to play narration audio for the current slide (MP3 fallback).
 * Plays audio on slide change and signals narration end for auto-advance.
 */
export function useNarrationAudio(slideId?: string, enabled = true) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isMuted, voiceVolume, masterVolume } = useDemoStore();

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : masterVolume * voiceVolume;
    }
  }, [isMuted, voiceVolume, masterVolume]);

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
      if (cancelled) return;
      if (!manifest || !manifest[slideId]) {
        console.warn(`[narration] No audio for slide "${slideId}"`);
        return;
      }

      const url = `/audio/narration/${manifest[slideId].file}`;
      console.log(`[narration] Playing ${url}`);
      const audio = new Audio(url);
      audio.volume = isMuted ? 0 : masterVolume * voiceVolume;
      audioRef.current = audio;

      audio.addEventListener("ended", () => {
        useDemoStore.getState().setNarrationEnded(true);
      });

      audio.play().catch((err) => {
        console.warn(`[narration] Autoplay blocked:`, err.message);
      });
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
