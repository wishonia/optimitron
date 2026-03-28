"use client";

import { useEffect, useState } from "react";
import { useDemoStore } from "@/lib/demo/store";
import { SFX } from "@/lib/demo/audio";
import { cn } from "@/lib/utils";

interface NarratorBoxProps {
  text?: string;
  characterSpeed?: number;
  onComplete?: () => void;
}

/**
 * Typewriter Text - Character by character reveal
 */
function TypewriterText({
  displayText,
  speed = 30,
  onComplete
}: {
  displayText: string;
  speed?: number;
  onComplete?: () => void;
}) {
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);
  const { isMuted, setTyping, setTypewriterComplete } = useDemoStore();

  useEffect(() => {
    // Reset state
    setOutput("");
    setDone(false);

    // If empty or undefined, complete immediately
    if (!displayText || displayText.length === 0) {
      setDone(true);
      setTypewriterComplete(true);
      return;
    }

    setTyping(true);
    setTypewriterComplete(false);

    let charIndex = 0;
    const totalChars = displayText.length;

    const timer = setInterval(() => {
      if (charIndex < totalChars) {
        setOutput(displayText.slice(0, charIndex + 1));

        if (!isMuted && charIndex % 3 === 0) {
          try { SFX.typewriter(); } catch { /* ignore */ }
        }

        charIndex++;
      } else {
        clearInterval(timer);
        setDone(true);
        setTyping(false);
        setTypewriterComplete(true);
        if (onComplete) onComplete();
      }
    }, 1000 / speed);

    return () => {
      clearInterval(timer);
      setTyping(false);
    };
  }, [displayText, speed, onComplete, isMuted, setTyping, setTypewriterComplete]);

  return (
    <span className="narrator-text">
      {output}
      {!done && <span className="typewriter-cursor" />}
    </span>
  );
}

/**
 * Main Narrator Box Component — text only (character is in WishoniaPresenter)
 */
export function NarratorBox({
  text = "",
  characterSpeed = 30,
  onComplete,
}: NarratorBoxProps) {
  const { palette, isRecordingMode } = useDemoStore();
  const [key, setKey] = useState(0);

  const safeText = text ?? "";

  useEffect(() => {
    setKey((k) => k + 1);
  }, [safeText]);

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-40",
      `palette-${palette}`,
      isRecordingMode && "bottom-4 left-4 right-4"
    )}>
      <div className={cn(
        "narrator-box",
        "mx-2 mb-2 md:mx-4 md:mb-4",
        "p-3 md:p-4",
        "min-h-[80px] md:min-h-[100px]",
        "flex items-center"
      )}>
        <TypewriterText
          key={key}
          displayText={safeText}
          speed={characterSpeed}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
}

export function VerbResponse({ verb, response }: { verb: string; response: string }) {
  return (
    <div className={cn(
      "fixed top-20 left-1/2 -translate-x-1/2 z-50",
      "sierra-dialog max-w-md",
      "animate-slide-up"
    )}>
      <div className="text-pixel-xs text-[var(--sierra-accent)] mb-2">
        {">"} {verb}
      </div>
      <div className="font-terminal text-base text-[var(--sierra-fg)]">
        {response}
      </div>
    </div>
  );
}

export default NarratorBox;
