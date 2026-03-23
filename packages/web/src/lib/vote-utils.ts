"use client";

import { storage } from "./storage";
import type { Session } from "next-auth";
import { getUsernameOrReferralCode } from "./referral.client";
import { API_ROUTES } from "./api-routes";
import { getTreatyWishocraticComparison } from "./treaty-vote";

const DEFAULT_REFERENDUM_SLUG = "one-percent-treaty";

async function syncTreatyWishocracyComparison(): Promise<boolean> {
  const pendingComparison = getTreatyWishocraticComparison(storage.getPendingVote());
  if (!pendingComparison) {
    return true;
  }

  try {
    const response = await fetch(API_ROUTES.wishocracy.allocations, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pendingComparison),
    });

    if (response.ok) {
      return true;
    }

    const errorData = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    console.error(
      "Failed to sync treaty allocation:",
      errorData.error || "Unknown error",
    );
    return false;
  } catch (error) {
    console.error("Failed to sync treaty allocation:", error);
    return false;
  }
}

async function syncReferendumVote(
  pendingAnswer: string,
  referredBy: string | null,
  session?: Session | null,
): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/referendums/${DEFAULT_REFERENDUM_SLUG}/vote`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: pendingAnswer,
          ref: referredBy,
        }),
      },
    );

    if (response.ok) {
      const referralIdentifier = getUsernameOrReferralCode(session?.user);
      if (referralIdentifier) {
        storage.setVoteStatusCache({
          hasVoted: true,
          voteAnswer: pendingAnswer,
          referralCode: referralIdentifier,
        });
      }

      return true;
    }

    const errorData = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    console.error(
      "Failed to sync vote:",
      errorData.error || "Unknown error",
    );
    return false;
  } catch (error) {
    console.error("Failed to sync vote:", error);
    return false;
  }
}

/**
 * Sync any staged landing-funnel data from localStorage:
 * - referendum vote via the referendum vote API
 * - treaty slider allocation via the Wishocracy allocation API
 */
export async function syncPendingVote(
  session?: Session | null,
  onSuccess?: () => void,
): Promise<boolean> {
  const pendingVote = storage.getPendingVote();
  const hasPendingVote = Boolean(pendingVote?.answer);
  const hasPendingComparison = Boolean(getTreatyWishocraticComparison(pendingVote));

  if (!pendingVote || (!hasPendingVote && !hasPendingComparison)) {
    return false;
  }

  const comparisonSynced = hasPendingComparison
    ? await syncTreatyWishocracyComparison()
    : true;
  const voteSynced = hasPendingVote
    ? await syncReferendumVote(pendingVote.answer, pendingVote.referredBy, session)
    : true;

  if (hasPendingVote && comparisonSynced && voteSynced) {
    storage.removePendingVote();
  }

  if (comparisonSynced && voteSynced) {
    onSuccess?.();
    return true;
  }

  return false;
}
