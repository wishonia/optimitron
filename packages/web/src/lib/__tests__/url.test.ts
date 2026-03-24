import { describe, expect, it } from "vitest";
import {
  buildAlignmentUrl,
  buildReferralUrl,
  buildUserAlignmentUrl,
  buildUserReferralUrl,
  buildPrizeReferralUrl,
  buildReferendumReferralUrl,
} from "@/lib/url";
import { ROUTES } from "@/lib/routes";

describe("url helpers", () => {
  it("builds referral links with ?ref= query param", () => {
    expect(
      buildUserReferralUrl({ username: "jane", referralCode: "REF123" }, "https://example.com"),
    ).toBe(`https://example.com${ROUTES.wishocracy}?ref=jane`);
    expect(buildReferralUrl("REF123", "https://example.com")).toBe(
      `https://example.com${ROUTES.wishocracy}?ref=REF123`,
    );
    expect(buildReferralUrl(null, "https://example.com")).toBe(
      `https://example.com${ROUTES.wishocracy}`,
    );
  });

  it("builds alignment sharing links with path segment", () => {
    expect(
      buildUserAlignmentUrl(
        { username: "jane", referralCode: "REF123" },
        "https://example.com",
      ),
    ).toBe(`https://example.com${ROUTES.alignment}/jane`);
    expect(buildAlignmentUrl("REF123", "https://example.com")).toBe(
      `https://example.com${ROUTES.alignment}/REF123`,
    );
  });

  it("builds prize referral links with ?ref=", () => {
    expect(buildPrizeReferralUrl("friend-123", "https://example.com")).toBe(
      `https://example.com${ROUTES.prize}?ref=friend-123`,
    );
  });

  it("builds referendum referral links with ?ref=", () => {
    expect(
      buildReferendumReferralUrl("one-percent-treaty", "friend-123", "https://example.com"),
    ).toBe(`https://example.com${ROUTES.referendum}/one-percent-treaty?ref=friend-123`);
  });
});
