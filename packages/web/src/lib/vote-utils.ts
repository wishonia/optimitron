"use client";

import { storage } from "./storage";
import type { Session } from "next-auth";
import { getUsernameOrReferralCode } from "./referral.client";

const DEFAULT_REFERENDUM_SLUG = "one-percent-treaty";

/**
 * Sync a pending vote from localStorage to the database via the referendum vote API.
 * Call this after the user authenticates to persist their pre-auth vote.
 */
export async function syncPendingVote(
  session?: Session | null,
  onSuccess?: () => void,
): Promise<boolean> {
  const pendingVote = storage.getPendingVote();
  if (!pendingVote || !pendingVote.answer) return false;

  try {
    const response = await fetch(
      `/api/referendums/${DEFAULT_REFERENDUM_SLUG}/vote`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: pendingVote.answer,
          ref: pendingVote.referredBy,
        }),
      },
    );

    if (response.ok) {
      storage.removePendingVote();

      const referralIdentifier = getUsernameOrReferralCode(session?.user);
      if (referralIdentifier) {
        storage.setVoteStatusCache({
          hasVoted: true,
          voteAnswer: pendingVote.answer,
          referralCode: referralIdentifier,
        });
      }

      onSuccess?.();
      return true;
    } else {
      const errorData = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      console.error(
        "Failed to sync vote:",
        errorData.error || "Unknown error",
      );
      return false;
    }
  } catch (error) {
    console.error("Failed to sync vote:", error);
    return false;
  }
}
