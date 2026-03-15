"use client";

import { useState } from "react";
import { CopyLinkButton } from "@/components/sharing/copy-link-button";
import { SocialShareButtons } from "@/components/sharing/social-share-buttons";
import { buildReferendumReferralUrl } from "@/lib/url";

interface ReferendumVoteSectionProps {
  referendumSlug: string;
  isActive: boolean;
  isAuthenticated: boolean;
  existingAnswer: string | null;
  referralCode: string | null;
  userId: string | null;
  username: string | null;
}

export function ReferendumVoteSection({
  referendumSlug,
  isActive,
  isAuthenticated,
  existingAnswer,
  referralCode,
  username,
}: ReferendumVoteSectionProps) {
  const [answer, setAnswer] = useState<string | null>(existingAnswer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store referral code in localStorage for attribution at signup
  if (typeof window !== "undefined" && referralCode) {
    localStorage.setItem("ref", referralCode);
  }

  const castVote = async (position: "YES" | "NO") => {
    setIsSubmitting(true);
    setError(null);

    try {
      const storedRef =
        referralCode ??
        (typeof window !== "undefined"
          ? localStorage.getItem("ref")
          : null);

      const res = await fetch(`/api/referendums/${referendumSlug}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: position, ref: storedRef }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to cast vote");
      }

      setAnswer(position);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isActive) {
    return (
      <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-sm font-black uppercase text-black/60">
          This referendum is no longer accepting votes.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="border-4 border-black bg-brutal-yellow p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-black uppercase text-black mb-2">
          Sign In to Vote
        </h3>
        <p className="text-sm font-medium text-black/70">
          You need an account to cast your vote. Verify with World ID
          afterwards to make it count as a verified vote.
        </p>
        <a
          href="/api/auth/signin"
          className="mt-4 inline-flex items-center justify-center border-4 border-black bg-black px-6 py-2 text-sm font-black uppercase text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
        >
          Sign In
        </a>
      </div>
    );
  }

  if (answer) {
    const shareUrl = buildReferendumReferralUrl(referendumSlug, username);

    return (
      <div className="space-y-6">
        <div className="border-4 border-black bg-green-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-lg font-black uppercase text-black mb-2">
            Vote Recorded: {answer}
          </h3>
          <p className="text-sm font-medium text-black/70">
            Verify with World ID to make your vote count as verified.
            Then share your link below to bring in more verified votes.
          </p>
        </div>

        <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-lg font-black uppercase text-black mb-3">
            Your Referral Link
          </h3>
          <p className="text-sm font-medium text-black/60 mb-4">
            Every verified vote through your link increases your share of the
            success pool. Share it everywhere.
          </p>
          <CopyLinkButton url={shareUrl} variant="landing" />
          <div className="mt-4 flex justify-center">
            <SocialShareButtons
              url={shareUrl}
              text="I voted on this referendum. Add your voice — every verified vote counts."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-lg font-black uppercase text-black mb-4">
        Cast Your Vote
      </h3>
      {error && (
        <div className="mb-4 border-2 border-red-600 bg-red-50 p-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}
      <div className="flex gap-4">
        <button
          onClick={() => void castVote("YES")}
          disabled={isSubmitting}
          className="flex-1 border-4 border-black bg-green-500 py-4 text-xl font-black uppercase text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
        >
          Yes
        </button>
        <button
          onClick={() => void castVote("NO")}
          disabled={isSubmitting}
          className="flex-1 border-4 border-black bg-red-500 py-4 text-xl font-black uppercase text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
        >
          No
        </button>
      </div>
    </div>
  );
}
