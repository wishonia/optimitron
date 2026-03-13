/**
 * Shared image generation utilities for Optomitron.
 *
 * Provides a consistent visual style across all generated images:
 * neobrutalist, flat, thick black outlines, brand colours, Wishonia's
 * deadpan alien aesthetic.
 *
 * Usage:
 *   import { createImageGenerator, BRAND, buildPrompt } from "./lib/image-generator";
 *
 *   const gen = await createImageGenerator();
 *   const buffer = await gen.generate({
 *     subject: "A bar chart showing healthcare spending vs outcomes",
 *     size: "1792x1024",
 *     label: "health-comparison",
 *   });
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, relative } from "path";

// ─── Brand Constants ─────────────────────────────────────────────

/** Optomitron brand colours — from globals.css / tailwind.config.ts */
export const BRAND = {
  pink: "#EC4699",
  cyan: "#7BDDEA",
  yellow: "#FFDD57",
  black: "#000000",
  white: "#FFFFFF",
  bgDark: "#0f172a",
  bgDarkRgba: { r: 15, g: 23, b: 42, alpha: 255 },
} as const;

// ─── Style System ────────────────────────────────────────────────

/**
 * The master style directive prepended to every image generation prompt.
 * This ensures visual consistency across icons, OG images, blog headers,
 * chart illustrations, etc.
 */
const STYLE_DIRECTIVE = [
  "STYLE REQUIREMENTS (apply to the entire image):",
  "- Neobrutalist graphic design: thick black outlines (3-6px), flat colour",
  "  fills, hard drop shadows, sharp corners, zero gradients, zero rounded",
  "  corners, zero 3D effects, zero photorealism",
  `- Primary colour palette: hot pink (${BRAND.pink}), cyan (${BRAND.cyan}),`,
  `  yellow (${BRAND.yellow}), white (${BRAND.white}), black (${BRAND.black})`,
  `- Background: dark navy (${BRAND.bgDark}) unless otherwise specified`,
  "- Typography (if text is needed): bold, blocky, sans-serif, all caps,",
  "  white or cyan text with black outline/shadow",
  "- Overall aesthetic: confident data dashboard designed by a slightly",
  "  disappointed alien who has been running a planet for 4,237 years",
  "- Clean composition with generous negative space — no clutter",
  "- If charts or data visualisations appear, they should look hand-drawn",
  "  in the neobrutalist style, not like Excel output",
].join("\n");

/**
 * Build a complete prompt by combining the shared style directive
 * with a subject-specific description.
 *
 * @param subject - What the image should depict (the unique part)
 * @param extras  - Optional additional constraints
 */
export function buildPrompt(subject: string, extras?: string): string {
  const parts = [STYLE_DIRECTIVE, "", "SUBJECT:", subject];
  if (extras) {
    parts.push("", "ADDITIONAL CONSTRAINTS:", extras);
  }
  return parts.join("\n");
}

// ─── Pre-built Prompts ───────────────────────────────────────────

/**
 * Icon prompt — must be recognisable at 16x16.
 *
 * Concept: a stylised globe with a targeting reticle/crosshair overlay
 * and a small upward-trending line — "planetary debugging software"
 * in one symbol. Simple enough for a favicon.
 */
export const ICON_PROMPT = buildPrompt(
  [
    "A bold, minimal app icon for 'Optomitron' — planetary debugging software.",
    "",
    "The icon is a stylised globe (simple circle with 1-2 latitude/longitude",
    "lines) overlaid with a targeting reticle/crosshair and a small upward-",
    "trending arrow or chart line breaking out of the top-right of the globe.",
    "The globe fill is hot pink, the crosshair and trend line are cyan, thick",
    "black outlines on everything.",
    "",
    "The overall message: 'we have the planet in our sights and the line is",
    "going up.' Think: a mission control target lock, not a geography textbook.",
  ].join("\n"),
  [
    "- Square canvas, centred, ~10% padding from edges",
    "- NO text, NO letters, NO words — pure symbol only",
    "- Must be recognisable at 16x16 pixels — max 2-3 shapes",
    `- Background: solid dark navy (${BRAND.bgDark})`,
    "- Think: simplicity of the Figma or Notion icon, brutalist edges",
  ].join("\n"),
);

/**
 * OG / social sharing image — the billboard for Twitter/LinkedIn/iMessage.
 */
export const OG_IMAGE_PROMPT = buildPrompt(
  [
    "A wide social-sharing banner (1200x630px landscape) for",
    "'Optomitron — The Evidence-Based Earth Optimization Machine'.",
    "",
    "Left third: the Optomitron icon — a stylised globe with crosshair",
    "and upward-trending line, in hot pink with cyan accents, large and bold.",
    "",
    "Right two-thirds: bold uppercase text 'OPTOMITRON' in white, with",
    "'PLANETARY DEBUGGING SOFTWARE' in cyan below it, smaller.",
    "",
    "A thin horizontal accent stripe in yellow near the bottom edge.",
    "The overall feel: mission control dashboard, confident, data-driven.",
  ].join("\n"),
  [
    "- Text must be spelled exactly: OPTOMITRON (10 letters)",
    "- Keep it clean — lots of negative space",
    `- Background: dark navy (${BRAND.bgDark})`,
  ].join("\n"),
);

// ─── Generator ───────────────────────────────────────────────────

type ImageSize = "1024x1024" | "1792x1024" | "1024x1792";

interface GenerateOptions {
  /** The full prompt (use buildPrompt() to construct) */
  prompt: string;
  /** DALL-E 3 canvas size */
  size: ImageSize;
  /** Short label for logging and raw file naming */
  label: string;
  /** Directory to save the raw generation to (optional) */
  outputDir?: string;
}

interface ImageGenerator {
  /** Generate a single image and return the PNG buffer */
  generate(options: GenerateOptions): Promise<Buffer>;
}

/**
 * Create a reusable image generator backed by OpenAI DALL-E 3.
 *
 * @param apiKey - OpenAI API key (defaults to OPENAI_API_KEY env var)
 */
export async function createImageGenerator(apiKey?: string): Promise<ImageGenerator> {
  const key = apiKey ?? process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error(
      "OPENAI_API_KEY not set. Pass it as an argument or export it:\n" +
      "  export OPENAI_API_KEY=sk-...",
    );
  }

  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({ apiKey: key });

  return {
    async generate({ prompt, size, label, outputDir }: GenerateOptions): Promise<Buffer> {
      console.log(`\nGenerating "${label}" (${size})...`);
      console.log(`  Prompt preview: ${prompt.slice(0, 100).replace(/\n/g, " ")}...`);

      const response = await client.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size,
        quality: "hd",
        response_format: "url",
      });

      const url = response.data[0]?.url;
      if (!url) throw new Error(`No image URL returned for "${label}"`);

      console.log("  Downloading...");
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      console.log(`  Got ${(buffer.length / 1024).toFixed(0)}KB`);

      if (outputDir) {
        if (!existsSync(outputDir)) {
          mkdirSync(outputDir, { recursive: true });
        }
        const rawPath = join(outputDir, `_raw-${label}.png`);
        writeFileSync(rawPath, buffer);
        console.log(`  Saved raw: ${relative(process.cwd(), rawPath)}`);
      }

      return buffer;
    },
  };
}
