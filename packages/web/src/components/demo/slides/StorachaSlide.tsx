"use client";

import { useReducedMotion, motion } from "framer-motion";

const ARCADE = "font-[family-name:var(--font-arcade)]";

const DOCUMENTS = [
  { label: "FDA DELAY: 102M DEATHS", cid: "bafy...k7qR3" },
  { label: "BUDGET: $2.72T MILITARY", cid: "bafy...xW9m2" },
  { label: "TRIAL #4,847: MALARIA", cid: "bafy...pN4d8" },
  { label: "WELFARE: 83 PROGRAMS", cid: "bafy...vT6j1" },
] as const;

/** Storacha slide — immutable evidence vault */
export default function StorachaSlide() {
  const reduced = useReducedMotion();

  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center px-4 sm:px-8 overflow-hidden">
      {/* Title */}
      <motion.h2
        initial={reduced ? false : { y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`${ARCADE} text-xl sm:text-2xl md:text-3xl text-foreground uppercase mb-8`}
      >
        STORACHA: IMMUTABLE EVIDENCE
      </motion.h2>

      {/* Vault container */}
      <motion.div
        initial={reduced ? false : { scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
        className="border-4 border-primary bg-foreground w-full max-w-xl p-4 sm:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6"
      >
        {/* Vault header */}
        <div className="border-4 border-background/30 bg-background/10 p-2 mb-4">
          <p className={`${ARCADE} text-xs sm:text-sm text-background uppercase tracking-wider`}>
            IPFS VAULT &mdash; CONTENT-ADDRESSED STORAGE
          </p>
        </div>

        {/* Document rows */}
        <div className="space-y-3">
          {DOCUMENTS.map((doc, i) => (
            <motion.div
              key={doc.cid}
              initial={reduced ? false : { x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.3 }}
              className="border-4 border-background/30 bg-background/5 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
            >
              <span className={`${ARCADE} text-[10px] sm:text-xs text-background uppercase`}>
                {doc.label}
              </span>
              <span className="font-mono text-[10px] text-brutal-cyan">
                {doc.cid}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ACCESS DENIED badge */}
        <motion.div
          initial={reduced ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
          className="mt-4 inline-block border-4 border-brutal-red bg-brutal-red px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          style={{ animation: "access-denied-pulse 1.5s step-end infinite" }}
        >
          <p className={`${ARCADE} text-sm sm:text-base text-brutal-red-foreground uppercase`}>
            &#x1F6AB; ACCESS DENIED
          </p>
        </motion.div>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
        className={`${ARCADE} text-xs sm:text-sm text-foreground leading-relaxed max-w-lg`}
      >
        Content-addressed. Immutable. Permanent.
        <br />
        No government can delete it.
      </motion.p>

      {/* Footer */}
      <motion.p
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.3 }}
        className={`${ARCADE} text-[10px] text-muted-foreground mt-4`}
      >
        POWERED BY STORACHA &middot; IPFS &middot; FILECOIN
      </motion.p>

      <style>{`
        @keyframes access-denied-pulse {
          from, to { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
