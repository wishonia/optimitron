"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type DemoSegment,
  getPlaylistSegments,
  PLAYLISTS,
  DEFAULT_PLAYLIST_ID,
} from "@/lib/demo-script";
import { getDemoAudio } from "@/lib/demo-tts";
import { DemoControls } from "./DemoControls";

// Lazy-loaded slide components
import { HumanityScoreboard } from "@/components/shared/HumanityScoreboard";
import { GovernmentLeaderboard } from "@/components/shared/GovernmentLeaderboard";
import { HowToPlaySection } from "@/components/landing/HowToPlaySection";
import { WhyPlaySection } from "@/components/landing/WhyPlaySection";
import { GameCTA } from "@/components/ui/game-cta";
import { CountUp } from "@/components/animations/CountUp";
import { CTA, TAGLINES } from "@/lib/messaging";

const bgColorMap: Record<string, string> = {
  background: "bg-background",
  foreground: "bg-foreground text-background",
  pink: "bg-brutal-pink",
  cyan: "bg-brutal-cyan",
  yellow: "bg-brutal-yellow",
};

/** Hook slide — custom component with mortality counter + spending ratio */
function HookSlide() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
      <div className="text-6xl sm:text-7xl md:text-8xl font-black text-brutal-red mb-4">
        <CountUp value={150000} duration={2} />
      </div>
      <p className="text-2xl sm:text-3xl font-black text-background uppercase mb-8">
        Deaths Per Day From Treatable Diseases
      </p>
      <div className="text-5xl sm:text-6xl md:text-7xl font-black text-brutal-yellow mb-4">
        604 : 1
      </div>
      <p className="text-xl sm:text-2xl font-bold text-muted-foreground">
        Military spending to clinical trial spending. That&apos;s not a policy
        disagreement. That&apos;s a configuration error.
      </p>
    </div>
  );
}

/** Close slide — CTA */
function CloseSlide() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-brutal-pink-foreground uppercase mb-6">
        Play Now
      </h2>
      <p className="text-xl sm:text-2xl font-bold text-background max-w-2xl mb-8">
        {TAGLINES.gameObjective}
      </p>
      <p className="text-lg sm:text-xl font-black text-background uppercase mb-8">
        Free. 30 seconds. No catch.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <GameCTA href="/#vote" variant="primary" size="lg">
          {CTA.playNow}
        </GameCTA>
        <GameCTA href="/prize" variant="secondary" size="lg">
          {CTA.seeTheMath}
        </GameCTA>
      </div>
    </div>
  );
}

/** Scoreboard slide */
function ScoreboardSlide() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8">
      <h2 className="text-3xl sm:text-4xl font-black uppercase text-foreground mb-8 text-center">
        The Two Numbers That Matter
      </h2>
      <div className="w-full max-w-4xl">
        <HumanityScoreboard />
      </div>
    </div>
  );
}

/** Government leaderboard slide */
function LeaderboardSlide() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8">
      <h2 className="text-3xl sm:text-4xl font-black uppercase text-foreground mb-8 text-center">
        Where Does Your Country Rank?
      </h2>
      <div className="w-full max-w-5xl">
        <GovernmentLeaderboard limit={8} compact />
      </div>
    </div>
  );
}

/** Placeholder for components that need server data or are too heavy to embed */
function PlaceholderSlide({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
      <h2 className="text-4xl sm:text-5xl font-black uppercase text-foreground mb-4">
        {title}
      </h2>
      <p className="text-xl sm:text-2xl font-bold text-muted-foreground max-w-2xl">
        {description}
      </p>
      <p className="text-lg font-black text-brutal-pink uppercase mt-6">
        Visit the live page to interact &rarr;
      </p>
    </div>
  );
}

function getSlideComponent(componentId: string) {
  switch (componentId) {
    case "hook":
      return <HookSlide />;
    case "scoreboard":
      return <ScoreboardSlide />;
    case "government-leaderboard":
      return <LeaderboardSlide />;
    case "the-question":
      return (
        <PlaceholderSlide
          title="The Question"
          description="Should all nations allocate just 1% of military spending to clinical trials? Slide the bar and vote."
        />
      );
    case "how-to-win":
      return (
        <PlaceholderSlide
          title="How to Win"
          description="Win: VOTE holders get $194K+ per point. Lose: depositors get 11x back. Every player wins."
        />
      );
    case "how-to-play":
      return (
        <PlaceholderSlide
          title="How to Play"
          description="Vote & Allocate. Get Your Link. Share With Friends. Deposit. Four steps. The only losing move is not playing."
        />
      );
    case "why-play":
      return (
        <PlaceholderSlide
          title="What Happens If Nobody Plays"
          description="2037: parasitic economy hits 35% of GDP. Every civilisation that hit this threshold collapsed. You are currently on this trajectory."
        />
      );
    case "wishocracy":
      return (
        <PlaceholderSlide
          title="Build Your Budget"
          description="Pick between two things. Eigenvector decomposition produces stable preference weights from 10 comparisons. Democracy in four minutes."
        />
      );
    case "alignment":
      return (
        <PlaceholderSlide
          title="Who Agrees With You?"
          description="Compare your priorities against real politician voting records. Each official gets a Citizen Alignment Score."
        />
      );
    case "tools":
      return (
        <PlaceholderSlide
          title="The Armory"
          description="18 tools. Policy generators. Budget optimizers. Causal inference engines. All free. All open source."
        />
      );
    case "close":
      return <CloseSlide />;
    default:
      return null;
  }
}

interface DemoPlayerProps {
  playlistId?: string;
}

export function DemoPlayer({ playlistId = DEFAULT_PLAYLIST_ID }: DemoPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const slides = getPlaylistSegments(playlistId);
  const slide = slides[currentIndex]!;

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }, []);

  const playSlideAudio = useCallback(
    async (index: number) => {
      const s = slides[index]!;
      setSubtitle(s.narration);

      if (isMuted) return;

      setIsLoadingAudio(true);
      try {
        const audio = await getDemoAudio(s.id, s.narration);
        if (audio) {
          audioRef.current = audio;
          audio.onended = () => {
            if (isPlaying && index < slides.length - 1) {
              setCurrentIndex(index + 1);
            } else {
              setIsPlaying(false);
            }
          };
          await audio.play();
        } else {
          // No audio available — auto-advance after estimated duration
          const words = s.narration.split(/\s+/).length;
          const ms = (words / 150) * 60 * 1000;
          if (isPlaying && index < slides.length - 1) {
            setTimeout(() => setCurrentIndex(index + 1), ms);
          }
        }
      } catch {
        // TTS failed — subtitle-only mode
      } finally {
        setIsLoadingAudio(false);
      }
    },
    [isMuted, isPlaying],
  );

  useEffect(() => {
    stopAudio();
    if (isPlaying) {
      void playSlideAudio(currentIndex);
    } else {
      setSubtitle(slides[currentIndex]!.narration);
    }
  }, [currentIndex, isPlaying, stopAudio, playSlideAudio]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        if (currentIndex < slides.length - 1) {
          stopAudio();
          setCurrentIndex((i) => i + 1);
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIndex > 0) {
          stopAudio();
          setCurrentIndex((i) => i - 1);
        }
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === "m") {
        setIsMuted((m) => !m);
      } else if (e.key === "f") {
        containerRef.current?.requestFullscreen?.();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, stopAudio]);

  const goTo = (index: number) => {
    stopAudio();
    setCurrentIndex(index);
  };

  const bgClass = bgColorMap[slide.bgColor ?? "background"] ?? "bg-background";

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-[calc(100vh-4rem)] border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      {/* Slide area */}
      <div className={`flex-grow relative overflow-hidden ${bgClass}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 overflow-y-auto"
          >
            {getSlideComponent(slide.componentId)}
          </motion.div>
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoadingAudio && (
          <div className="absolute top-4 right-4 text-xs font-black uppercase text-muted-foreground animate-pulse">
            Loading audio...
          </div>
        )}
      </div>

      {/* Subtitle bar */}
      <div className="border-t-4 border-primary bg-foreground px-6 py-3 min-h-[4rem]">
        <p className="text-sm font-bold text-background leading-relaxed line-clamp-2">
          {subtitle}
        </p>
      </div>

      {/* Controls */}
      <DemoControls
        current={currentIndex}
        total={slides.length}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onPrev={() => goTo(Math.max(0, currentIndex - 1))}
        onNext={() => goTo(Math.min(slides.length - 1, currentIndex + 1))}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onToggleMute={() => setIsMuted((m) => !m)}
        onGoTo={goTo}
        onFullscreen={() => containerRef.current?.requestFullscreen?.()}
      />
    </div>
  );
}
