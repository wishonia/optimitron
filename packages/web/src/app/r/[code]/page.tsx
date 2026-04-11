import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { findUserByUsernameOrReferralCode } from "@/lib/referral.server";

interface PageProps {
  params: Promise<{ code: string }>;
}

/**
 * Referral landing route: /r/jane or /r/REF123
 *
 * Captures the HTTP Referer header and user-agent into ReferralClick
 * so we can trace where shares originated (e.g. official social accounts).
 * Then redirects to the homepage with ?ref= for the vote flow.
 */
export default async function ReferralRedirectPage({ params }: PageProps) {
  const { code } = await params;
  const headerStore = await headers();
  const refererUrl = headerStore.get("referer") ?? null;
  const userAgent = headerStore.get("user-agent") ?? null;

  // Fire-and-forget: log the click without blocking the redirect.
  void logReferralClick(code, refererUrl, userAgent);

  redirect(`/?ref=${encodeURIComponent(code)}#vote`);
}

async function logReferralClick(
  code: string,
  refererUrl: string | null,
  userAgent: string | null,
) {
  try {
    const referrer = await findUserByUsernameOrReferralCode(code);

    await prisma.referralClick.create({
      data: {
        code,
        referrerUserId: referrer?.id ?? null,
        refererUrl,
        userAgent,
      },
    });
  } catch {
    // Click logging is best-effort — never block the redirect or throw.
  }
}
