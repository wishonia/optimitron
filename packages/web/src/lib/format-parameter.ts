import type { Parameter } from "./parameters-calculations-citations";

const SUFFIXES: [number, string][] = [
  [1e15, "quadrillion"],
  [1e12, "trillion"],
  [1e9, "billion"],
  [1e6, "million"],
];

/** Round to N significant figures. */
function sig(value: number, n: number): number {
  if (value === 0) return 0;
  const d = Math.ceil(Math.log10(Math.abs(value)));
  const mag = 10 ** (n - d);
  return Math.round(value * mag) / mag;
}

/** Stringify a number with exactly N significant figures (trailing zeros). */
function toSigStr(value: number, n: number): string {
  if (value === 0) return "0";
  const r = sig(Math.abs(value), n);
  if (r >= 1) {
    const intDig = Math.max(1, Math.floor(Math.log10(r)) + 1);
    return r.toFixed(Math.max(0, n - intDig));
  }
  return r.toPrecision(n);
}

/**
 * Universal parameter formatter. Pass a Parameter, get a human-readable string.
 *
 * Reads the `unit` field to decide formatting:
 *
 *  USD / USD/year / USD/patient → "$2.72 trillion", "$929/patient"
 *  percentage / rate / percent  → "86.1%"
 *  ratio / x / multiplier      → "604x"
 *  deaths / deaths/year / years → "97.0 million deaths"
 *  (no unit)                    → "2.72 trillion"
 *
 * All values are shown to 3 significant figures by default.
 */
export function fmtParam(param: Parameter, figures = 3): string {
  const { value, unit } = param;
  const u = (unit ?? "").toLowerCase();

  // Percentages & rates → value is 0-1, display as 0-100%
  if (u === "percentage" || u === "rate" || u === "percent") {
    return `${toSigStr(sig(value * 100, figures), figures)}%`;
  }

  // Ratios / multipliers → "604x"
  if (u === "ratio" || u === "x" || u === "multiplier") {
    return `${fmtRaw(value, figures)}x`;
  }

  // Currency — "USD", "USD/year", "USD/patient"
  if (u === "usd" || u.startsWith("usd/")) {
    const perUnit = u.includes("/") ? `/${u.split("/").slice(1).join("/")}` : "";
    return `$${fmtRaw(value, figures)}${perUnit}`;
  }

  // Dimensionless
  if (!unit || u === "weight") return fmtRaw(value, figures);

  // Everything else — number + unit
  return `${fmtRaw(value, figures)} ${unit}`;
}

/**
 * Format a raw number with 3 sig figs and a human-readable suffix.
 *
 *   fmtRaw(2720000000000) → "2.72 trillion"
 *   fmtRaw(97000000)      → "97.0 million"
 *   fmtRaw(604.44)        → "604"
 *   fmtRaw(0.861)         → "0.861"
 */
export function fmtRaw(value: number, figures = 3): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  for (const [threshold, label] of SUFFIXES) {
    if (abs >= threshold) {
      return `${sign}${toSigStr(sig(abs / threshold, figures), figures)} ${label}`;
    }
  }

  // Below 1 million — use commas for thousands
  const rounded = sig(abs, figures);
  if (rounded >= 1000) {
    return `${sign}${rounded.toLocaleString("en-US")}`;
  }

  return `${sign}${toSigStr(abs, figures)}`;
}
