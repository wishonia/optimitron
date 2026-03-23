"use client";

import { ChevronLeft, ChevronRight, Play, Pause, Maximize, Volume2, VolumeX } from "lucide-react";

interface DemoControlsProps {
  current: number;
  total: number;
  isPlaying: boolean;
  isMuted: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onGoTo: (index: number) => void;
  onFullscreen: () => void;
}

export function DemoControls({
  current,
  total,
  isPlaying,
  isMuted,
  onPrev,
  onNext,
  onTogglePlay,
  onToggleMute,
  onGoTo,
  onFullscreen,
}: DemoControlsProps) {
  return (
    <div className="border-t-4 border-primary bg-background px-4 py-3">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-3">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            className={`w-3 h-3 border-2 border-primary transition-all ${
              i === current
                ? "bg-brutal-pink scale-125"
                : i < current
                  ? "bg-foreground"
                  : "bg-muted"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className="p-2 border-4 border-primary bg-brutal-cyan shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-foreground" />
            ) : (
              <Play className="w-5 h-5 text-foreground" />
            )}
          </button>
          <button
            onClick={onToggleMute}
            className="p-2 border-4 border-primary bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        <span className="text-sm font-black text-muted-foreground uppercase">
          {current + 1} / {total}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={current === 0}
            className="p-2 border-4 border-primary bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={onNext}
            disabled={current === total - 1}
            className="p-2 border-4 border-primary bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={onFullscreen}
            className="p-2 border-4 border-primary bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            aria-label="Fullscreen"
          >
            <Maximize className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
