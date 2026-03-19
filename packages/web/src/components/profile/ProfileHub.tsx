"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckInHistoryCard } from "@/components/profile/CheckInHistoryCard";
import { DailyCheckInCard } from "@/components/profile/DailyCheckInCard";
import { PushNotificationPrompt } from "@/components/notifications/PushNotificationPrompt";
import { ProfileSnapshotForm } from "@/components/profile/ProfileSnapshotForm";
import { VoteTokenBalanceCard } from "@/components/prize/VoteTokenBalanceCard";
import type { ProfilePageData } from "@/lib/profile";
import { ROUTES } from "@/lib/routes";

interface ProfileHubProps {
  initialData: ProfilePageData;
}

export function ProfileHub({ initialData }: ProfileHubProps) {
  const [data, setData] = useState(initialData);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brutal-pink">
          Your Data
        </p>
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
          Census + Daily Check-In
        </h1>
        <p className="max-w-3xl text-base font-bold text-foreground">
          Save your location and census snapshot, then rate your health and happiness over
          time.
        </p>
      </section>

      {/* Get Started CTAs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProfileCTA
          href={ROUTES.wishocracy}
          label="Wishocracy"
          description="Set your ideal budget priorities via pairwise comparisons"
          color="bg-brutal-cyan"
        />
        <ProfileCTA
          href={ROUTES.alignment}
          label="Alignment"
          description="See which politicians match your priorities"
          color="bg-brutal-pink"
        />
        <ProfileCTA
          href={ROUTES.referendum}
          label="Referendums"
          description="Vote on active proposals and earn referral rewards"
          color="bg-brutal-yellow"
        />
        <ProfileCTA
          href={ROUTES.contribute}
          label="Earth Prize"
          description="Contribute to the Earth Optimization Prize"
          color="bg-green-200"
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <ProfileSnapshotForm profile={data.profile} onSaved={setData} />
        <DailyCheckInCard currentCheckIn={data.currentCheckIn} onSaved={setData} />
      </div>

      <CheckInHistoryCard history={data.history} />

      <VoteTokenBalanceCard />

      <PushNotificationPrompt />
    </div>
  );
}

function ProfileCTA({
  href,
  label,
  description,
  color,
}: {
  href: string;
  label: string;
  description: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className={`block border-4 border-primary ${color} p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`}
    >
      <h3 className="text-sm font-black uppercase text-foreground">{label}</h3>
      <p className="mt-1 text-xs font-bold text-foreground">{description}</p>
    </Link>
  );
}
