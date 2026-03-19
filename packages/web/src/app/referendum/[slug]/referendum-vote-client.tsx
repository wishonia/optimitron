"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { CopyLinkButton } from "@/components/sharing/copy-link-button";
import { SocialShareButtons } from "@/components/sharing/social-share-buttons";
import { getBaseUrl } from "@/lib/url";

interface Props {
  referendumSlug: string;
  referendumId: string;
  isActive: boolean;
  referralCode: string | null;
}

type VoteAnswer = "YES" | "NO" | null;

export function ReferendumVoteClient({
  referendumSlug,
  referendumId,
  isActive,
  referralCode,
}: Props) {
  const { data: session, status } = useSession();
  const [vote, setVote] = useState<VoteAnswer>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store referral code in localStorage for attribution at signup
  useEffect(() => {
    if (referralCode) {
      localStorage.setItem("referendum_ref", referralCode);
    }
  }, [referralCode]);

  const castVote = useCallback(
    async (answer: "YES" | "NO") => {
      setVote(answer);
      setSubmitting(true);
      setError(null);

      try {
        const storedRef =
          referralCode ?? localStorage.getItem("referendum_ref");
        const res = await fetch(`/api/referendums/${referendumSlug}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer, ref: storedRef }),
        });

        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error ?? "Failed to cast vote");
        }

        setSubmitted(true);
        localStorage.removeItem("referendum_ref");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setVote(null);
      } finally {
        setSubmitting(false);
      }
    },
    [referendumSlug, referralCode],
  );

  if (!isActive) {
    return (
      <div className="border-4 border-primary bg-muted p-8 text-center">
        <p className="text-lg font-black uppercase text-muted-foreground">
          This referendum is closed
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="border-4 border-primary bg-background p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
        <p className="text-sm font-bold text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="border-4 border-primary bg-brutal-yellow p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
        <h3 className="text-xl font-black uppercase text-foreground mb-2">
          Sign In to Vote
        </h3>
        <p className="text-sm font-bold text-muted-foreground mb-4">
          Your vote is verified with World ID to prevent duplicates.
          One human, one vote.
        </p>
        <a
          href={`/auth/signin?callbackUrl=/referendum/${referendumSlug}${referralCode ? `&ref=${referralCode}` : ""}`}
          className="inline-flex items-center justify-center border-4 border-primary bg-foreground px-8 py-3 text-sm font-black uppercase text-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
        >
          Sign In
        </a>
      </div>
    );
  }

  if (submitted) {
    const user = session?.user as
      | { username?: string; referralCode?: string }
      | undefined;
    const identifier = user?.username ?? user?.referralCode ?? "";
    const shareUrl = `${getBaseUrl()}/referendum/${referendumSlug}?ref=${identifier}`;

    return (
      <div className="space-y-6">
        <div className="border-4 border-primary bg-brutal-cyan p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
          <h3 className="text-2xl font-black uppercase text-foreground mb-2">
            Vote Cast: {vote}
          </h3>
          <p className="text-sm font-bold text-muted-foreground">
            Every verified vote you bring in via your referral link increases
            your share of the success pool.
          </p>
        </div>
        <div className="border-4 border-primary bg-background p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-lg font-black uppercase text-foreground text-center mb-2">
            Your Referral Link
          </h3>
          <p className="text-sm text-muted-foreground font-bold text-center mb-4">
            Share this link. Every person who votes through it is attributed to you.
          </p>
          <CopyLinkButton url={shareUrl} variant="landing" />
          <div className="mt-4 flex justify-center">
            <SocialShareButtons
              url={shareUrl}
              text={`I just voted on "${referendumSlug}". Cast yours and help prove what humanity actually wants.`}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="border-4 border-primary bg-background p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase text-foreground text-center mb-6">
          Cast Your Vote
        </h3>
        {error && (
          <div className="border-2 border-red-600 bg-red-50 p-3 mb-4 text-center">
            <p className="text-sm font-bold text-red-700">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => castVote("YES")}
            disabled={submitting}
            className="border-4 border-primary bg-brutal-cyan p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          >
            <div className="text-3xl font-black text-foreground">YES</div>
          </button>
          <button
            onClick={() => castVote("NO")}
            disabled={submitting}
            className="border-4 border-primary bg-brutal-pink p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          >
            <div className="text-3xl font-black text-brutal-pink-foreground">NO</div>
          </button>
        </div>
        <p className="text-xs text-muted-foreground font-bold text-center mt-4">
          Verify with World ID after voting to make your vote count as &ldquo;verified.&rdquo;
          Verified votes are the ones that matter for allocation.
        </p>
      </div>
    </section>
  );
}
