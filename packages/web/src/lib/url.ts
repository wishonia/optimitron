import { getUsernameOrReferralCode } from "@/lib/referral.client";
import { clientEnv } from "@/lib/env";

export function getBaseUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  if (clientEnv.NEXT_PUBLIC_BASE_URL) {
    return clientEnv.NEXT_PUBLIC_BASE_URL;
  }

  return "http://localhost:3001";
}

export function buildReferralUrl(identifier?: string | null, baseUrl: string = getBaseUrl()): string {
  return identifier ? `${baseUrl}/wishocracy/${identifier}` : `${baseUrl}/wishocracy`;
}

export function buildUserReferralUrl(
  user: { username?: string | null; referralCode?: string | null } | null | undefined,
  baseUrl: string = getBaseUrl(),
): string {
  return buildReferralUrl(getUsernameOrReferralCode(user), baseUrl);
}

export function buildAlignmentUrl(
  identifier?: string | null,
  baseUrl: string = getBaseUrl(),
): string {
  return identifier ? `${baseUrl}/alignment/${identifier}` : `${baseUrl}/alignment`;
}

export function buildUserAlignmentUrl(
  user: { username?: string | null; referralCode?: string | null } | null | undefined,
  baseUrl: string = getBaseUrl(),
): string {
  return buildAlignmentUrl(getUsernameOrReferralCode(user), baseUrl);
}

export function buildCivicVoteUrl(
  shareIdentifier?: string | null,
  baseUrl: string = getBaseUrl(),
): string {
  return shareIdentifier
    ? `${baseUrl}/civic/wishocracys/${shareIdentifier}`
    : `${baseUrl}/civic/wishocracys`;
}

export function buildReferendumReferralUrl(
  slug: string,
  identifier?: string | null,
  baseUrl: string = getBaseUrl(),
): string {
  const base = `${baseUrl}/referendum/${slug}`;
  return identifier ? `${base}?ref=${identifier}` : base;
}

export function buildPrizeReferralUrl(
  identifier?: string | null,
  baseUrl: string = getBaseUrl(),
): string {
  return identifier ? `${baseUrl}/prize?ref=${identifier}` : `${baseUrl}/prize`;
}
