"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScanLines } from "@/components/animations/GlitchText";
import { LiveDeathTicker } from "@/components/animations/LiveDeathTicker";

/** 3. Death count slide — real-time ticking death counter, fills the screen */
export default function DeathCountSlide() {
  const reduced = useReducedMotion();
  const SKULLS = 200;
  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center px-4 bg-foreground overflow-hidden">
      <ScanLines />
      {/* Real-time death ticker — ticks every 50ms */}
      <div className="w-full max-w-6xl mb-6">
        <LiveDeathTicker className="[&_div]:text-5xl [&_div]:sm:text-6xl [&_div]:md:text-7xl" />
      </div>
      {/* Skull grid — bigger, fills viewport */}
      <div className="flex flex-wrap justify-center gap-1 max-w-5xl opacity-70">
        {Array.from({ length: SKULLS }, (_, i) => (
          <motion.span
            key={i}
            initial={reduced ? false : { opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.015, duration: 0.2 }}
            className="text-xl sm:text-2xl"
          >
            💀
          </motion.span>
        ))}
      </div>
    </div>
  );
}
