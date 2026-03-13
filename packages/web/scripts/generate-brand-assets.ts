#!/usr/bin/env tsx
/**
 * generate-brand-assets.ts
 *
 * Generates all missing image assets for the Optomitron website using
 * the shared image generator (DALL-E 3) and sharp (resizing + ICO).
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... pnpm --filter @optomitron/web run generate:assets
 *
 * What it creates:
 *   public/
 *   ├── favicon.ico              (multi-size ICO: 16, 32, 48)
 *   ├── apple-touch-icon.png     (180x180)
 *   ├── og-image.png             (1200x630 — social sharing)
 *   ├── twitter-image.png        (copy of og-image)
 *   └── icons/
 *       ├── icon-72.png          (notification badge)
 *       ├── icon-192.png         (PWA manifest)
 *       ├── icon-512.png         (PWA manifest / splash)
 *       ├── icon-16.png          (favicon fallback)
 *       ├── icon-32.png          (favicon fallback)
 *       └── icon-maskable-512.png (PWA maskable icon)
 *
 * Also patches layout.tsx and manifest.json to reference the new assets.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, statSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  createImageGenerator,
  BRAND,
  ICON_PROMPT,
  OG_IMAGE_PROMPT,
} from "./lib/image-generator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = resolve(__dirname, "../public");
const ICONS_DIR = join(PUBLIC_DIR, "icons");
const SRC_DIR = resolve(__dirname, "../src");

const BG_RGBA = BRAND.bgDarkRgba;

const ICON_VARIANTS = [
  { name: "icon-16.png", size: 16, maskable: false },
  { name: "icon-32.png", size: 32, maskable: false },
  { name: "icon-72.png", size: 72, maskable: false },
  { name: "icon-192.png", size: 192, maskable: false },
  { name: "icon-512.png", size: 512, maskable: false },
  { name: "icon-maskable-512.png", size: 512, maskable: true },
];

// ─── Icon Processing ─────────────────────────────────────────────

async function processIconVariants(sourceBuffer: Buffer) {
  const sharp = (await import("sharp")).default;
  console.log("\nResizing icon variants...");

  for (const variant of ICON_VARIANTS) {
    const outPath = join(ICONS_DIR, variant.name);

    if (variant.maskable) {
      const iconSize = Math.round(variant.size * 0.6);
      const offset = Math.round((variant.size - iconSize) / 2);

      const resizedIcon = await sharp(sourceBuffer)
        .resize(iconSize, iconSize, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      await sharp({
        create: {
          width: variant.size,
          height: variant.size,
          channels: 4 as const,
          background: BG_RGBA,
        },
      })
        .png()
        .composite([{ input: resizedIcon, left: offset, top: offset }])
        .toFile(outPath);
    } else {
      await sharp(sourceBuffer)
        .resize(variant.size, variant.size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(outPath);
    }

    console.log(`  ${variant.name} (${variant.size}x${variant.size})`);
  }
}

async function generateFavicon() {
  const sharp = (await import("sharp")).default;
  const pngToIco = (await import("png-to-ico")).default;
  console.log("\nGenerating favicon.ico...");

  const sizes = [16, 32, 48];
  const pngBuffers: Buffer[] = [];

  for (const size of sizes) {
    const pngPath = join(ICONS_DIR, `icon-${size}.png`);
    if (existsSync(pngPath)) {
      pngBuffers.push(readFileSync(pngPath));
    } else {
      const source = join(ICONS_DIR, "icon-72.png");
      const buf = await sharp(source)
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
      pngBuffers.push(buf);
    }
  }

  const icoBuffer = await pngToIco(pngBuffers);
  writeFileSync(join(PUBLIC_DIR, "favicon.ico"), icoBuffer);
  console.log(`  favicon.ico (${sizes.join(", ")}px multi-size)`);
}

async function generateAppleTouchIcon(sourceBuffer: Buffer) {
  const sharp = (await import("sharp")).default;
  console.log("\nGenerating apple-touch-icon.png...");

  const totalSize = 180;
  const iconSize = Math.round(totalSize * 0.75);
  const offset = Math.round((totalSize - iconSize) / 2);

  const resizedIcon = await sharp(sourceBuffer)
    .resize(iconSize, iconSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: totalSize,
      height: totalSize,
      channels: 4 as const,
      background: BG_RGBA,
    },
  })
    .png()
    .composite([{ input: resizedIcon, left: offset, top: offset }])
    .toFile(join(PUBLIC_DIR, "apple-touch-icon.png"));

  console.log("  apple-touch-icon.png (180x180)");
}

async function processOgImage(sourceBuffer: Buffer) {
  const sharp = (await import("sharp")).default;
  console.log("\nProcessing OG image...");

  const ogPath = join(PUBLIC_DIR, "og-image.png");
  await sharp(sourceBuffer)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .png()
    .toFile(ogPath);
  console.log("  og-image.png (1200x630)");

  copyFileSync(ogPath, join(PUBLIC_DIR, "twitter-image.png"));
  console.log("  twitter-image.png (copy of og-image)");
}

// ─── Auto-patch layout.tsx and manifest.json ─────────────────────

function patchLayoutMetadata() {
  console.log("\nPatching layout.tsx metadata...");
  const layoutPath = join(SRC_DIR, "app/layout.tsx");
  let content = readFileSync(layoutPath, "utf-8");
  let patched = false;

  if (!content.includes("icons:")) {
    content = content.replace(
      /manifest: "\/manifest\.json",/,
      `icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",`,
    );
    patched = true;
    console.log("  Added icons config");
  }

  if (!content.includes("og-image.png")) {
    content = content.replace(
      /type: "website",\s*\}/,
      `type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Optomitron — The Evidence-Based Earth Optimization Machine",
      },
    ],
  }`,
    );
    patched = true;
    console.log("  Added openGraph.images");
  }

  if (!content.includes("twitter-image.png")) {
    // Find the twitter block's closing and insert images before it
    content = content.replace(
      /(twitter:\s*\{[\s\S]*?description:\s*\n?\s*"[^"]*",)\s*\}/,
      `$1\n    images: ["/twitter-image.png"],\n  }`,
    );
    patched = true;
    console.log("  Added twitter.images");
  }

  if (patched) {
    writeFileSync(layoutPath, content);
  } else {
    console.log("  Already up to date");
  }
}

function patchManifest() {
  console.log("\nPatching manifest.json...");
  const manifestPath = join(PUBLIC_DIR, "manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

  const hasMaskable = manifest.icons?.some(
    (icon: { purpose?: string }) => icon.purpose === "maskable",
  );

  if (!hasMaskable) {
    manifest.icons.push({
      src: "/icons/icon-maskable-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    });
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
    console.log("  Added maskable icon entry");
  } else {
    console.log("  Already up to date");
  }
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  console.log("============================================");
  console.log("  OPTOMITRON BRAND ASSET GENERATOR");
  console.log("  Planetary debugging software needs a logo.");
  console.log("============================================");

  const gen = await createImageGenerator();

  // Ensure output directories
  if (!existsSync(ICONS_DIR)) mkdirSync(ICONS_DIR, { recursive: true });

  // Step 1: Generate base icon (1024x1024 square)
  const iconBuffer = await gen.generate({
    prompt: ICON_PROMPT,
    size: "1024x1024",
    label: "icon",
    outputDir: ICONS_DIR,
  });

  // Step 2: Generate OG/social image (1792x1024 landscape)
  const ogBuffer = await gen.generate({
    prompt: OG_IMAGE_PROMPT,
    size: "1792x1024",
    label: "og",
    outputDir: ICONS_DIR,
  });

  // Step 3: Resize icon into all variants
  await processIconVariants(iconBuffer);

  // Step 4: Generate favicon.ico
  await generateFavicon();

  // Step 5: Apple touch icon
  await generateAppleTouchIcon(iconBuffer);

  // Step 6: OG image processing
  await processOgImage(ogBuffer);

  // Step 7: Patch metadata files
  patchLayoutMetadata();
  patchManifest();

  // Summary
  console.log("\n============================================");
  console.log("  All assets generated.");
  console.log("============================================\n");

  const allFiles = [
    "public/favicon.ico",
    "public/apple-touch-icon.png",
    "public/og-image.png",
    "public/twitter-image.png",
    ...ICON_VARIANTS.map((v) => `public/icons/${v.name}`),
  ];
  for (const f of allFiles) {
    const fullPath = join(resolve(__dirname, ".."), f);
    if (existsSync(fullPath)) {
      const stat = statSync(fullPath);
      console.log(`  + ${f} (${(stat.size / 1024).toFixed(1)}KB)`);
    } else {
      console.log(`  - ${f} (missing)`);
    }
  }

  console.log("\nRun 'pnpm dev' and check the results.");
}

main().catch((err) => {
  console.error("\nAsset generation failed:", err);
  process.exit(1);
});
