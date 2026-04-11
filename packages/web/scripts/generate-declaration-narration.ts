/**
 * Offline narration generator for the Declaration of Optimization page.
 *
 * Usage:
 *   npx tsx scripts/generate-declaration-narration.ts
 *
 * - Reads paragraphs from shareableSnippets (same source as the page)
 * - Hashes each paragraph (SHA-256, first 16 hex chars)
 * - Only regenerates when text changes
 * - Generates WAV via Gemini TTS, converts to MP3 via ffmpeg
 * - Saves to public/audio/declaration/{slideId}.mp3
 * - Writes manifest.json for client-side lookup
 */
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../../.env") });
config({ path: resolve(__dirname, "../.env"), override: true });
import { createHash } from "crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
} from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { shareableSnippets } from "@optimitron/data/parameters";

// ---------------------------------------------------------------------------
// Gemini TTS
// ---------------------------------------------------------------------------

import { GoogleGenAI } from "@google/genai";

let VOICE = "Kore";
let INSTRUCTIONS =
  "Speak in a patient, warm, slightly quick tone. You are an alien governance AI reading a declaration aloud.";
let MODEL = "gemini-2.5-flash-preview-tts";

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const w = require("@optimitron/wishonia-widget");
  VOICE = w.WISHONIA_VOICE ?? VOICE;
  INSTRUCTIONS = w.WISHONIA_SPEAKING_INSTRUCTIONS ?? INSTRUCTIONS;
  MODEL = w.WISHONIA_TTS_MODEL ?? MODEL;
} catch {
  // defaults are fine
}

// ---------------------------------------------------------------------------
// Slide generation (mirrors DeclarationStepper.tsx logic exactly)
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

interface SlideEntry {
  id: string;
  text: string;
}

const INTRO_TEXT =
  "Please quickly skim and sign the Declaration of Optimization.";

const slides: SlideEntry[] = [
  { id: "intro", text: INTRO_TEXT },
  ...WHY_SLIDES.map((text, i) => ({ id: `why-${i}`, text })),
  ...DECLARATION_SLIDES.map((text, i) => ({ id: `decl-${i}`, text })),
];

/** Strip markdown links and formatting to plain text for TTS */
function stripMarkdown(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) → text
    .replace(/#{1,6}\s+/g, "") // headings
    .replace(/[*_`~]/g, "") // bold, italic, code, strikethrough
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// WAV conversion
// ---------------------------------------------------------------------------

function convertToWav(audioData: Uint8Array, mimeType: string): Uint8Array {
  let bitsPerSample = 16;
  let rate = 24000;
  for (const param of mimeType.split(";")) {
    const t = param.trim();
    if (t.toLowerCase().startsWith("rate=")) {
      const v = parseInt(t.split("=")[1]!, 10);
      if (!isNaN(v)) rate = v;
    } else if (t.startsWith("audio/L")) {
      const v = parseInt(t.split("L")[1]!, 10);
      if (!isNaN(v)) bitsPerSample = v;
    }
  }
  const numChannels = 1;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = rate * blockAlign;
  const dataSize = audioData.length;
  const header = new ArrayBuffer(44);
  const dv = new DataView(header);
  const w = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) dv.setUint8(off + i, s.charCodeAt(i));
  };
  w(0, "RIFF");
  dv.setUint32(4, 36 + dataSize, true);
  w(8, "WAVE");
  w(12, "fmt ");
  dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true);
  dv.setUint16(22, numChannels, true);
  dv.setUint32(24, rate, true);
  dv.setUint32(28, byteRate, true);
  dv.setUint16(32, blockAlign, true);
  dv.setUint16(34, bitsPerSample, true);
  w(36, "data");
  dv.setUint32(40, dataSize, true);
  const result = new Uint8Array(44 + dataSize);
  result.set(new Uint8Array(header), 0);
  result.set(audioData, 44);
  return result;
}

async function generateSpeech(
  text: string,
  apiKey: string,
): Promise<Uint8Array> {
  const client = new GoogleGenAI({ apiKey });
  const plainText = stripMarkdown(text);
  const result = await client.models.generateContent({
    model: MODEL,
    contents: [
      { role: "user", parts: [{ text: `${INSTRUCTIONS}\n\n${plainText}` }] },
    ],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
      },
    },
  });
  const part = result.candidates?.[0]?.content?.parts?.[0];
  if (!part?.inlineData?.data) {
    throw new Error("No audio data received from Gemini TTS");
  }
  const audioData = new Uint8Array(
    Buffer.from(part.inlineData.data, "base64"),
  );
  const mime = part.inlineData.mimeType || "audio/L16;rate=24000";
  return convertToWav(audioData, mime);
}

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------

interface ManifestEntry {
  hash: string;
  file: string;
  generatedAt: string;
}
type Manifest = Record<string, ManifestEntry>;

const OUTPUT_DIR = join(__dirname, "..", "public", "audio", "declaration");
const MANIFEST_PATH = join(OUTPUT_DIR, "manifest.json");
const TEMP_WAV = join(OUTPUT_DIR, "_temp.wav");

function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

function loadManifest(): Manifest {
  if (existsSync(MANIFEST_PATH)) {
    return JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
  }
  return {};
}

function saveManifest(manifest: Manifest) {
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
}

function wavToMp3(wavPath: string, mp3Path: string) {
  execSync(
    `ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -b:a 128k -ar 24000 "${mp3Path}"`,
    { stdio: "pipe" },
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error(
      "ERROR: GOOGLE_GENERATIVE_AI_API_KEY not set. Add it to .env or export it.",
    );
    process.exit(1);
  }

  try {
    execSync("ffmpeg -version", { stdio: "pipe" });
  } catch {
    console.error("ERROR: ffmpeg not found. Install it: choco install ffmpeg");
    process.exit(1);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const manifest = loadManifest();
  let generated = 0;
  let cached = 0;
  let errors = 0;

  console.log(
    `\n🎙️  Declaration Narration Generator — ${slides.length} slides\n`,
  );

  // Pre-scan
  const toGenerate: SlideEntry[] = [];
  for (const slide of slides) {
    const hash = hashText(slide.text);
    const mp3Path = join(OUTPUT_DIR, `${slide.id}.mp3`);
    if (manifest[slide.id]?.hash === hash && existsSync(mp3Path)) {
      cached++;
    } else {
      toGenerate.push(slide);
    }
  }

  console.log(`  ✓  ${cached} cached (up to date)`);
  console.log(`  🔄 ${toGenerate.length} need regeneration`);

  if (toGenerate.length > 0) {
    const est = toGenerate.length * 15;
    console.log(
      `  ⏱️  Estimated time: ~${Math.ceil(est / 60)} min ${est % 60}s\n`,
    );
  } else {
    console.log("\n  Nothing to do — all audio is up to date!\n");
    return;
  }

  for (const slide of toGenerate) {
    const hash = hashText(slide.text);
    const mp3File = `${slide.id}.mp3`;
    const mp3Path = join(OUTPUT_DIR, mp3File);

    console.log(`  🔄 ${slide.id} — generating...`);

    try {
      const wavBytes = await generateSpeech(slide.text, apiKey);
      writeFileSync(TEMP_WAV, wavBytes);
      wavToMp3(TEMP_WAV, mp3Path);
      if (existsSync(TEMP_WAV)) unlinkSync(TEMP_WAV);

      manifest[slide.id] = {
        hash,
        file: mp3File,
        generatedAt: new Date().toISOString(),
      };
      generated++;
      console.log(`  ✅ ${slide.id} — done`);
    } catch (err: unknown) {
      errors++;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ ${slide.id} — ${message}`);
    }

    // Rate-limit: pause every 5 generations
    if (generated > 0 && generated % 5 === 0) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // Prune manifest entries for slides that no longer exist
  const validIds = new Set(slides.map((s) => s.id));
  for (const key of Object.keys(manifest)) {
    if (!validIds.has(key)) {
      const entry = manifest[key];
      if (entry) {
        const staleFile = join(OUTPUT_DIR, entry.file);
        if (existsSync(staleFile)) unlinkSync(staleFile);
        console.log(`  🧹 Removed stale: ${key}`);
      }
      delete manifest[key];
    }
  }

  saveManifest(manifest);
  if (existsSync(TEMP_WAV)) unlinkSync(TEMP_WAV);

  console.log(
    `\n📊 Summary: ${generated} generated, ${cached} cached, ${errors} errors`,
  );
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);

  if (generated > 0) {
    console.log(
      `💡 ${generated} audio file(s) updated. Commit public/audio/declaration/ to persist.\n`,
    );
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
