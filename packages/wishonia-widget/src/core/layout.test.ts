import { describe, expect, it } from "vitest";
import {
  getWishoniaBodyHeight,
  getWishoniaBodyOffsetX,
} from "./layout";

describe("wishonia layout helpers", () => {
  it("derives body height from character size", () => {
    expect(getWishoniaBodyHeight(140)).toBe(80);
    expect(getWishoniaBodyHeight(200)).toBe(114);
  });

  it("nudges the body left by a small size-scaled offset", () => {
    expect(getWishoniaBodyOffsetX(80)).toBe(2);
    expect(getWishoniaBodyOffsetX(140)).toBe(4);
    expect(getWishoniaBodyOffsetX(280)).toBe(8);
  });
});
