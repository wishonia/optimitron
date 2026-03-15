"use client";

import { useEffect, useState } from "react";
import type { LeaderboardEntry } from "@/lib/verified-votes.server";
import { CopyLinkButton } from "@/components/sharing/copy-link-button";
import { SocialShareButtons } from "@/components/sharing/social-share-buttons";
import { ShareTemplatesCard } from "@/components/prize/ShareTemplatesCard";
import { Progress } from "@/components/ui/progress";
import { buildPrizeReferralUrl } from "@/lib/url";

interface DashboardData {
  stats: {
    totalReferrals: number;
    verifiedVotes: number;
    pendingVerification: number;
    rank: number | null;
  } | null;
  leaderboard: LeaderboardEntry[];
  globalProgress: { verifiedVotes: number };
}

const MILESTONES = [3, 10, 50, 100];

function getNextMilestone(current: number): number {
  for (const m of MILESTONES) {
    if (current < m) return m;
  }
  return current;
}

export function BondholderDashboard() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }
    fetch("/api/referrals/stats")
      .then((res) => (res.ok ? (res.json() as Promise<DashboardData>) : null))
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [status]);

  const user = session?.user as
    | { username?: string; referralCode?: string }
    | undefined;
  const username = user?.username ?? user?.referralCode ?? null;

  const referralUrl = buildPrizeReferralUrl(username);

  if (status === "loading" || loading) {
    return (
      <div className="border-4 border-black bg-white p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-black/10 w-1/3" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-black/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data?.stats) {
    return (
      <div className="border-4 border-black bg-brutal-yellow p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-black uppercase text-black mb-2">
          Your Bondholder Dashboard
        </h3>
        <p className="text-sm font-medium text-black/70 mb-4">
          Sign in to track your verified votes, see your leaderboard rank,
          and get your referral link.
        </p>
        <a
          href="/api/auth/signin"
          className="inline-flex items-center justify-center border-4 border-black bg-black px-6 py-2 text-sm font-black uppercase text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
        >
          Sign In
        </a>
      </div>
    );
  }

  const { stats, leaderboard, globalProgress } = data;
  const totalGlobal = globalProgress.verifiedVotes;
  const sharePercent =
    totalGlobal > 0
      ? ((stats.verifiedVotes / totalGlobal) * 100).toFixed(2)
      : "0.00";
  const nextMilestone = getNextMilestone(stats.verifiedVotes);
  const milestoneProgress = Math.min(
    (stats.verifiedVotes / nextMilestone) * 100,
    100,
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black uppercase tracking-tight text-black">
        Your Bondholder Dashboard
      </h2>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Verified Votes"
          value={stats.verifiedVotes.toString()}
          detail={`${stats.pendingVerification} pending verification`}
          color="bg-brutal-cyan"
        />
        <StatCard
          label="Total Referrals"
          value={stats.totalReferrals.toString()}
          detail="Votes from your link"
          color="bg-brutal-yellow"
        />
        <StatCard
          label="Est. Share"
          value={`${sharePercent}%`}
          detail="Of success pool"
          color="bg-brutal-pink"
          textWhite
        />
        <StatCard
          label="Global Rank"
          value={stats.rank ? `#${stats.rank}` : "—"}
          detail="By verified votes"
          color="bg-white"
        />
      </div>

      {/* Referral goal */}
      <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-black uppercase text-black">
            Next Milestone
          </h3>
          <span className="text-sm font-black text-brutal-pink">
            {stats.verifiedVotes} / {nextMilestone}
          </span>
        </div>
        <Progress value={milestoneProgress} className="h-4 border-2 border-black" />
        <div className="flex justify-between mt-2">
          {MILESTONES.map((m) => (
            <span
              key={m}
              className={`text-xs font-bold ${
                stats.verifiedVotes >= m ? "text-brutal-pink" : "text-black/30"
              }`}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Referral link */}
      <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-black uppercase text-black mb-3">
          Your Referral Link
        </h3>
        <CopyLinkButton url={referralUrl} variant="landing" />
        <div className="mt-4 flex justify-center">
          <SocialShareButtons
            url={referralUrl}
            text="Buy Incentive Alignment Bonds. Fund what works. Get paid when it does. The math is embarrassingly simple."
          />
        </div>
      </div>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-lg font-black uppercase text-black mb-4">
            Top Referrers
          </h3>
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.userId}
                className="flex items-center gap-3 border-b border-black/10 pb-2 last:border-0"
              >
                <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-black shrink-0">
                  {entry.rank}
                </span>
                <span className="flex-1 text-sm font-bold text-black truncate">
                  {entry.name}
                </span>
                <span className="text-sm font-black text-brutal-pink">
                  {entry.verifiedVotes}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global progress */}
      <div className="border-4 border-black bg-brutal-cyan p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-sm font-black uppercase text-black mb-2">
          Global Verified Votes
        </h3>
        <div className="text-3xl font-black text-black">
          {totalGlobal.toLocaleString()}
        </div>
        <p className="text-xs font-medium text-black/60 mt-1">
          Every verified vote makes pluralistic ignorance harder to maintain.
        </p>
      </div>

      {/* Share templates */}
      <ShareTemplatesCard referralUrl={referralUrl} />
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  color,
  textWhite = false,
}: {
  label: string;
  value: string;
  detail: string;
  color: string;
  textWhite?: boolean;
}) {
  return (
    <div
      className={`border-4 border-black ${color} p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
    >
      <div
        className={`text-xs font-black uppercase ${textWhite ? "text-white/60" : "text-black/50"}`}
      >
        {label}
      </div>
      <div
        className={`text-2xl font-black mt-1 ${textWhite ? "text-white" : "text-black"}`}
      >
        {value}
      </div>
      <div
        className={`text-[10px] font-bold mt-1 ${textWhite ? "text-white/40" : "text-black/40"}`}
      >
        {detail}
      </div>
    </div>
  );
}
