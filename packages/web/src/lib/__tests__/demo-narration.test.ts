import { describe, expect, it } from "vitest";

import {
  getCanonicalNarrationManifestKey,
  getLegacyNarrationManifestKeys,
  getNarrationManifestLookupKeys,
  type NarrationManifest,
} from "../demo-narration";

describe("demo narration manifest helpers", () => {
  it("prefers the canonical manifest key before legacy aliases", () => {
    expect(getNarrationManifestLookupKeys("pl-fund")).toEqual([
      "three-scenarios-all-win",
      "protocol-labs--three-scenarios-all-win",
      "pl-fund",
    ]);
  });

  it("falls back to the raw segment id when no alias exists", () => {
    expect(getCanonicalNarrationManifestKey("custom-slide")).toBe("custom-slide");
    expect(getNarrationManifestLookupKeys("custom-slide")).toEqual(["custom-slide"]);
  });

  it("identifies legacy raw manifest entries that should be pruned", () => {
    const manifest: NarrationManifest = {
      "three-scenarios-all-win": {
        hash: "new",
        file: "three-scenarios-all-win.mp3",
        generatedAt: "2026-03-31T03:20:45.971Z",
      },
      "pl-fund": {
        hash: "old",
        file: "pl-fund.mp3",
        generatedAt: "2026-03-30T07:14:33.860Z",
      },
      "custom-slide": {
        hash: "custom",
        file: "custom-slide.mp3",
        generatedAt: "2026-03-31T03:20:45.971Z",
      },
    };

    expect(getLegacyNarrationManifestKeys(manifest)).toEqual(["pl-fund"]);
  });
});
