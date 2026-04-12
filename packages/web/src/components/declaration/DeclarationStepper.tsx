"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { ChevronDown, Play, Pause, Image, ImageOff } from "lucide-react";
import { shareableSnippets } from "@optimitron/data/parameters";
import {
  WishoniaCharacter,
  preloadTier0,
} from "@optimitron/wishonia-widget";
import { DeclarationSignatureBox } from "@/components/declaration/DeclarationSignatureBox";

// Background images — cycle through war/atrocity photographs
const DECLARATION_IMAGES = [
  "0_rixHj5ph0bilU4VA.webp",
  "hiroshima-aftermath.jpg",
  "3782620400000578-0-image-a-16_1471952820321.jpg",
  "65c0fef9ef3488e746cfe61f6e9a99e3.jpg",
  "nagasaki-mushroom.jpg",
  "abdulfalluja2_000.jpg",
  "d15361ba023fa61fc3affcbae9a144deb3-17-mosul-civilian-casualties.rsocial.w1200.webp",
  "DmWguX9U0AAT1Tz.jpg",
  "nuclear-war.jpg",
  "download.jpeg",
  "gaza-scaled.jpg",
  "The_Terror_of_War_Viet_girl_edit.jpg",
  "image546863x.jpg",
  "iraq-1158612213-612x612.jpg",
  "iraq-1530125968-612x612.jpg",
  "nuclear-war-burns.jpg",
  "iraq-1530126129-612x612.jpg",
  "iraq-171480348-612x612.jpg",
  "iraq-1731665846-612x612.jpg",
  "OmranAylan.jpg",
  "iraq-1736938930-612x612.jpg",
  "iraq-495413681-612x612.jpg",
  "iraq-615309246-612x612.jpg",
  "vietnam.jpg",
  "iraq-635233421-612x612.jpg",
  "iraq-643124034-612x612.jpg",
  "iraq-657651138-612x612.jpg",
  "iraq-871166954-612x612.jpg",
  "iraq-91878540-2048x2048.jpg",
  "iraq-928670302-612x612.jpg",
  "iraq-929098884-612x612.jpg",
].map((f) => `/images/declaration/${f}`);

// Preload Wishonia sprites
const SPRITE_PATH = "/sprites/wishonia/";
const SPRITE_FORMAT = "png" as const;
if (typeof window !== "undefined") {
  void preloadTier0(SPRITE_PATH, SPRITE_FORMAT);
}

// ---------------------------------------------------------------------------
// Slide data (mirrors generate-declaration-narration.ts exactly)
// ---------------------------------------------------------------------------

function splitIntoSlides(markdown: string): string[] {
  return markdown
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const WHY_SLIDES = splitIntoSlides(
  shareableSnippets.whyOptimizationIsNecessary.markdown,
);
const DECLARATION_SLIDES = splitIntoSlides(
  shareableSnippets.declarationOfOptimization.markdown,
);
// Filter out the divider — it's not needed in a fade-based stepper
const ALL_SLIDES = [...WHY_SLIDES, ...DECLARATION_SLIDES];

const INTRO_TEXT =
  "Please quickly skim and sign the Declaration of Optimization.";

// Total slides: intro + content + signature
const TOTAL_SLIDES = 1 + ALL_SLIDES.length + 1;
const SIGNATURE_INDEX = TOTAL_SLIDES - 1;

/** Strip markdown to match what the generation script hashed */
function stripMarkdownForHash(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** SHA-256 first 16 hex chars — matches generation script */
async function hashText(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

// ---------------------------------------------------------------------------
// Audio helpers
// ---------------------------------------------------------------------------

interface DeclarationManifestEntry {
  file: string;
}
type DeclarationManifest = Record<string, DeclarationManifestEntry>;

let manifestCache: DeclarationManifest | null | undefined;

async function getDeclarationManifest(): Promise<DeclarationManifest | null> {
  if (manifestCache !== undefined) return manifestCache;
  try {
    const resp = await fetch("/audio/declaration/manifest.json", {
      cache: "no-store",
    });
    manifestCache = resp.ok
      ? ((await resp.json()) as DeclarationManifest)
      : null;
  } catch {
    manifestCache = null;
  }
  return manifestCache;
}

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioContext();
  }
  if (sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

function wireAnalyser(audio: HTMLAudioElement): AnalyserNode {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  const source = ctx.createMediaElementSource(audio);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);
  analyser.connect(ctx.destination);
  return analyser;
}

function loadAudio(url: string): Promise<HTMLAudioElement | null> {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.crossOrigin = "anonymous";
    audio.addEventListener("canplaythrough", () => resolve(audio), {
      once: true,
    });
    audio.addEventListener("error", () => resolve(null), { once: true });
  });
}

interface AudioResult {
  audio: HTMLAudioElement;
  analyser: AnalyserNode;
}

const audioCache = new Map<string, AudioResult>();

async function getSlideAudio(text: string): Promise<AudioResult | null> {
  const plainText = stripMarkdownForHash(text);
  const hash = await hashText(plainText);

  if (audioCache.has(hash)) {
    const cached = audioCache.get(hash)!;
    cached.audio.currentTime = 0;
    return cached;
  }

  // Try pre-generated MP3 first (looked up by content hash)
  const manifest = await getDeclarationManifest();
  if (manifest?.[hash]) {
    const entry = manifest[hash];
    const audio = await loadAudio(`/audio/declaration/${entry.file}`);
    if (audio) {
      const analyser = wireAnalyser(audio);
      const result = { audio, analyser };
      audioCache.set(hash, result);
      return result;
    }
  }

  // Fallback: real-time Gemini TTS
  try {
    const resp = await fetch("/api/demo/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: plainText }),
    });
    if (!resp.ok) return null;
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const audio = await loadAudio(url);
    if (audio) {
      const analyser = wireAnalyser(audio);
      const result = { audio, analyser };
      audioCache.set(hash, result);
      return result;
    }
  } catch {
    // TTS unavailable — graceful degradation
  }

  return null;
}

// ---------------------------------------------------------------------------
// Markdown renderer for slides
// ---------------------------------------------------------------------------

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-center text-4xl font-black uppercase tracking-tight text-white [font-family:var(--v0-font-libre-baskerville)] sm:text-5xl md:text-6xl">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-center text-3xl font-black uppercase tracking-tight text-white [font-family:var(--v0-font-libre-baskerville)] sm:text-4xl">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-center text-2xl font-black uppercase tracking-tight text-white [font-family:var(--v0-font-libre-baskerville)] sm:text-3xl md:text-4xl">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-center text-xl leading-relaxed text-white drop-cap [font-family:var(--v0-font-libre-baskerville)] [overflow-wrap:break-word] sm:text-2xl">
      {children}
    </p>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    const target = href ?? "#";
    if (target.startsWith("http")) {
      return (
        <a
          href={target}
          target="_blank"
          rel="noreferrer"
          className="font-black text-white/70"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={target} className="font-black text-white/70">
        {children}
      </Link>
    );
  },
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-brutal-pink bg-white/10 px-4 py-3 text-sm font-bold text-white">
      {children}
    </blockquote>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc space-y-2 pl-6 text-left text-base font-bold text-white/80">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal space-y-2 pl-6 text-left text-base font-bold text-white/80">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
  hr: () => <hr className="border-t-4 border-white/30" />,
};

// ---------------------------------------------------------------------------
// Main stepper — fade in place, no scrolling
// ---------------------------------------------------------------------------

export function DeclarationStepper() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Background images (off by default)
  const [showImages, setShowImages] = useState(false);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const playingIndexRef = useRef<number>(-1);

  const stopAudio = useCallback(() => {
    const audio = currentAudioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.onended = null;
    }
    currentAudioRef.current = null;
    playingIndexRef.current = -1;
    setIsPlaying(false);
    setAnalyserNode(null);
  }, []);

  /** Navigate to a slide with fade transition */
  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= TOTAL_SLIDES || index === currentIndex) return;
      // Fade out
      setVisible(false);
      // After fade out, swap content and fade in
      setTimeout(() => {
        setCurrentIndex(index);
        setVisible(true);
      }, 600);
    },
    [currentIndex],
  );

  const goNext = useCallback(() => {
    if (currentIndex < TOTAL_SLIDES - 1) {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, goToSlide]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, goToSlide]);

  /** Get the text for a slide index */
  const getSlideText = useCallback((slideIndex: number): string | null => {
    if (slideIndex === 0) return INTRO_TEXT;
    const contentIndex = slideIndex - 1;
    if (contentIndex < ALL_SLIDES.length) return ALL_SLIDES[contentIndex]!;
    return null; // signature slide
  }, []);

  /** Preload audio for a slide */
  const preloadSlideAudio = useCallback(
    (slideIndex: number) => {
      const text = getSlideText(slideIndex);
      if (text) void getSlideAudio(text);
    },
    [getSlideText],
  );

  const playRequestId = useRef(0);

  const playSlide = useCallback(
    async (slideIndex: number) => {
      stopAudio();

      // Each call gets a unique ID — stale async results are ignored
      const requestId = ++playRequestId.current;

      const text = getSlideText(slideIndex);
      if (!text) return;

      // Preload next
      preloadSlideAudio(slideIndex + 1);

      const result = await getSlideAudio(text);
      // Stale request — a newer playSlide call happened while we were loading
      if (requestId !== playRequestId.current) return;

      if (!result) {
        // TTS unavailable — auto-advance after reading time
        setIsPlaying(true);
        playingIndexRef.current = slideIndex;
        const wordCount = text.split(/\s+/).length;
        const readTime = Math.max(3000, wordCount * 250);
        setTimeout(() => {
          if (playingIndexRef.current !== slideIndex) return;
          if (slideIndex < TOTAL_SLIDES - 1) {
            goToSlide(slideIndex + 1);
            setTimeout(
              () => void playSlide(slideIndex + 1),
              700,
            );
          } else {
            stopAudio();
          }
        }, readTime);
        return;
      }

      currentAudioRef.current = result.audio;
      playingIndexRef.current = slideIndex;
      setAnalyserNode(result.analyser);
      setIsPlaying(true);

      result.audio.onended = () => {
        if (playingIndexRef.current !== slideIndex) return;
        if (slideIndex < TOTAL_SLIDES - 1) {
          goToSlide(slideIndex + 1);
          // Start next audio after fade transition
          setTimeout(() => void playSlide(slideIndex + 1), 700);
        } else {
          stopAudio();
        }
      };

      try {
        await result.audio.play();
      } catch {
        stopAudio();
      }
    },
    [stopAudio, goToSlide, getSlideText, preloadSlideAudio],
  );

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      const audio = currentAudioRef.current;
      if (audio) {
        audio.pause();
        audio.onended = null;
      }
      playingIndexRef.current = -1;
      setIsPlaying(false);
      setAnalyserNode(null);
    } else {
      void playSlide(currentIndex);
    }
  }, [isPlaying, currentIndex, playSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Don't hijack keys when user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Scroll/wheel to advance slides (debounced so one gesture = one slide)
  const scrollCooldown = useRef(false);
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollCooldown.current) return;
      scrollCooldown.current = true;
      if (e.deltaY > 0) {
        goNext();
      } else if (e.deltaY < 0) {
        goPrev();
      }
      setTimeout(() => {
        scrollCooldown.current = false;
      }, 800);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [goNext, goPrev]);

  // Touch swipe to advance slides
  const touchStartY = useRef(0);
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? 0;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const diff = touchStartY.current - endY;
      if (Math.abs(diff) < 50) return; // too small
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goNext, goPrev]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  // Background image
  const bgImageIndex = currentIndex % DECLARATION_IMAGES.length;

  // Render current slide content
  const renderSlideContent = () => {
    if (currentIndex === 0) {
      return (
        <p className="text-center text-2xl leading-relaxed text-white [font-family:var(--v0-font-libre-baskerville)] sm:text-3xl">
          {INTRO_TEXT}
        </p>
      );
    }

    if (currentIndex === SIGNATURE_INDEX) {
      return <DeclarationSignatureBox />;
    }

    const contentIndex = currentIndex - 1;
    const slide = ALL_SLIDES[contentIndex];
    if (!slide) return null;

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {slide}
      </ReactMarkdown>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      {/* Background image (when enabled) */}
      {showImages && (
        <>
          <div className="absolute inset-0">
            <img
              key={bgImageIndex}
              src={DECLARATION_IMAGES[bgImageIndex]}
              alt=""
              className="h-full w-full object-cover"
              style={{ animation: "ken-burns 12s ease-in-out forwards" }}
              draggable={false}
            />
          </div>
          <div className="absolute inset-0 bg-black/70" />
        </>
      )}

      {/* Skip to sign — top right, hidden on signature slide */}
      {currentIndex !== SIGNATURE_INDEX && (
        <button
          onClick={() => goToSlide(SIGNATURE_INDEX)}
          className="absolute right-4 top-4 z-30 cursor-pointer text-xs font-bold text-white/30 transition-colors hover:text-white/70"
        >
          Skip to sign
        </button>
      )}

      {/* Centered slide content — fades in place */}
      <div className="relative flex flex-1 items-center justify-center px-6 sm:px-8">
        <div
          className="w-full max-w-2xl"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease-in-out",
          }}
        >
          {renderSlideContent()}
        </div>
      </div>

      {/* Wishonia character — bottom right, clickable to play/pause */}
      <button
        onClick={togglePlayback}
        className="absolute bottom-0 right-0 z-20 cursor-pointer"
        aria-label={isPlaying ? "Pause narration" : "Play narration"}
      >
        <div className="sm:hidden">
          <WishoniaCharacter
            size={110}
            spritePath={SPRITE_PATH}
            spriteFormat={SPRITE_FORMAT}
            analyserNode={analyserNode}
          />
        </div>
        <div className="hidden sm:block">
          <WishoniaCharacter
            size={140}
            spritePath={SPRITE_PATH}
            spriteFormat={SPRITE_FORMAT}
            analyserNode={analyserNode}
          />
        </div>
        <div className="absolute bottom-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/30 bg-black/50">
          {isPlaying ? (
            <Pause className="h-3 w-3 text-white" />
          ) : (
            <Play className="ml-0.5 h-3 w-3 text-white" />
          )}
        </div>
      </button>

      {/* Image toggle — bottom left */}
      <button
        onClick={() => setShowImages((v) => !v)}
        className="absolute bottom-4 left-4 z-30 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-white/40 transition-colors hover:bg-white/20 hover:text-white/70"
        aria-label={showImages ? "Hide background images" : "Show background images"}
      >
        {showImages ? (
          <ImageOff className="h-3 w-3" />
        ) : (
          <Image className="h-3 w-3" />
        )}
      </button>

      {/* Down arrow to advance */}
      {currentIndex < TOTAL_SLIDES - 1 && (
        <button
          onClick={goNext}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce cursor-pointer text-white/60 transition-opacity hover:text-white"
          aria-label="Next paragraph"
        >
          <ChevronDown className="h-10 w-10" />
        </button>
      )}
    </div>
  );
}
