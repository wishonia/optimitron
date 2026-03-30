import { describe, expect, it } from "vitest";
import {
  getCharacterHeadSpriteNames,
  getCharacterSpriteNames,
} from "./sprite-loader";

describe("getCharacterHeadSpriteNames", () => {
  it("includes every neutral talking viseme plus blink", () => {
    const spriteNames = getCharacterHeadSpriteNames("neutral");

    expect(spriteNames).toEqual(expect.arrayContaining([
      "blink-smile",
      "neutral-smile",
      "neutral-open",
      "neutral-oh",
      "neutral-ee",
      "neutral-closed",
      "neutral-small",
      "neutral-frown",
    ]));
    expect(new Set(spriteNames).size).toBe(spriteNames.length);
  });
});

describe("getCharacterSpriteNames", () => {
  it("includes the requested body pose alongside the active expression set", () => {
    expect(getCharacterSpriteNames("thinking", "presenting")).toEqual([
      "blink-smile",
      "thinking-oh",
      "thinking-closed",
      "thinking-small",
      "body-presenting",
    ]);
  });
});
