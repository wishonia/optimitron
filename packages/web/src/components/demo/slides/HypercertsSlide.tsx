"use client";

import { useReducedMotion, motion } from "framer-motion";

const ARCADE = "font-[family-name:var(--font-arcade)]";

const CERTS = [
  {
    trial: "TRIAL #4,847",
    name: "Malaria vaccine",
    patients: "12,000 patients",
    outcome: "94% efficacy",
  },
  {
    trial: "TRIAL #2,193",
    name: "TB rapid diagnostic",
    patients: "8,400 patients",
    outcome: "89% accuracy",
  },
  {
    trial: "TRIAL #6,011",
    name: "Depression CBT protocol",
    patients: "31,000 patients",
    outcome: "67% remission",
  },
] as const;

/** The minting cert — fields appear one at a time */
const MINTING_CERT = {
  trial: "TRIAL #9,204",
  name: "Cancer immunotherapy",
  patients: "5,600 patients",
  outcome: "71% response",
};

const MINTING_FIELDS = [
  MINTING_CERT.trial,
  MINTING_CERT.name,
  MINTING_CERT.patients,
  MINTING_CERT.outcome,
  "\u2713 VERIFIED ON-CHAIN",
] as const;

/** Hypercerts slide — verifiable impact attestations */
export default function HypercertsSlide() {
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
        HYPERCERTS: VERIFIABLE IMPACT
      </motion.h2>

      {/* Badge grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full mb-6">
        {/* Pre-verified certs */}
        {CERTS.map((cert, i) => (
          <motion.div
            key={cert.trial}
            initial={reduced ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.3, type: "spring" }}
            className="border-4 border-primary bg-brutal-pink p-3 sm:p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left"
          >
            <p className={`${ARCADE} text-[10px] sm:text-xs text-foreground uppercase mb-1`}>
              {cert.trial}
            </p>
            <p className={`${ARCADE} text-xs sm:text-sm text-foreground font-bold mb-1`}>
              {cert.name}
            </p>
            <p className={`${ARCADE} text-[10px] text-foreground`}>
              {cert.patients} &middot; {cert.outcome}
            </p>
            <p className={`${ARCADE} text-[10px] text-brutal-cyan mt-2 uppercase`}>
              &#x2713; VERIFIED ON-CHAIN
            </p>
          </motion.div>
        ))}

        {/* Minting cert — fields fill in one at a time */}
        <motion.div
          initial={reduced ? false : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.3, type: "spring" }}
          className="border-4 border-primary bg-brutal-pink p-3 sm:p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left relative"
        >
          {/* MINTING label */}
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1] }}
            transition={{ delay: 0.8, duration: 2, repeat: 1 }}
            className="absolute top-2 right-2"
          >
            <span className={`${ARCADE} text-[8px] text-brutal-yellow uppercase`}>
              MINTING...
            </span>
          </motion.div>

          {MINTING_FIELDS.map((field, i) => (
            <motion.p
              key={field}
              initial={reduced ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.4, duration: 0.3 }}
              className={`${ARCADE} text-[10px] sm:text-xs ${
                i === MINTING_FIELDS.length - 1
                  ? "text-brutal-cyan mt-2 uppercase"
                  : i === 0
                    ? "text-foreground uppercase mb-1"
                    : "text-foreground mb-0.5"
              }`}
            >
              {field}
            </motion.p>
          ))}
        </motion.div>
      </div>

      {/* Description */}
      <motion.p
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 0.4 }}
        className={`${ARCADE} text-xs sm:text-sm text-foreground leading-relaxed max-w-lg`}
      >
        If they don&apos;t have a Hypercert,
        <br />
        they didn&apos;t save those lives.
      </motion.p>
    </div>
  );
}
