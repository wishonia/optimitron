/**
 * Client-side TTS helper for the demo player.
 *
 * Tries pre-generated audio first, falls back to real-time Gemini TTS API.
 * Gracefully degrades to subtitle-only if both fail.
 */

const audioCache = new Map<string, HTMLAudioElement>();

/** Try to load pre-generated audio from /demo-audio/[slideId].wav */
async function tryPreGenerated(slideId: string): Promise<HTMLAudioElement | null> {
  const url = `/demo-audio/${slideId}.wav`;
  try {
    const resp = await fetch(url, { method: "HEAD" });
    if (resp.ok) {
      const audio = new Audio(url);
      await new Promise<void>((resolve, reject) => {
        audio.addEventListener("canplaythrough", () => resolve(), { once: true });
        audio.addEventListener("error", () => reject(new Error("load failed")), { once: true });
      });
      return audio;
    }
  } catch {
    // Pre-generated file doesn't exist
  }
  return null;
}

/** Generate audio in real-time via the Gemini TTS API route */
async function generateRealTime(text: string): Promise<HTMLAudioElement | null> {
  try {
    const resp = await fetch("/api/demo/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!resp.ok) return null;

    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    await new Promise<void>((resolve, reject) => {
      audio.addEventListener("canplaythrough", () => resolve(), { once: true });
      audio.addEventListener("error", () => reject(new Error("load failed")), { once: true });
    });
    return audio;
  } catch {
    return null;
  }
}

/**
 * Get audio for a demo slide. Returns null if TTS is unavailable.
 * Results are cached for the session.
 */
export async function getDemoAudio(
  slideId: string,
  narrationText: string,
): Promise<HTMLAudioElement | null> {
  if (audioCache.has(slideId)) {
    const cached = audioCache.get(slideId)!;
    cached.currentTime = 0;
    return cached;
  }

  // Try pre-generated first, then real-time
  const audio =
    (await tryPreGenerated(slideId)) ??
    (await generateRealTime(narrationText));

  if (audio) {
    audioCache.set(slideId, audio);
  }
  return audio;
}
