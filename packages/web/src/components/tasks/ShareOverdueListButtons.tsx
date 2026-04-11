"use client";

import { ShareLinkButtons } from "@/components/shared/ShareLinkButtons";

interface ShareOverdueListButtonsProps {
  overdueCount: number;
  economicLoss: string;
  livesLost: string;
  tasksUrl: string;
}

export function ShareOverdueListButtons({
  overdueCount,
  economicLoss,
  livesLost,
  tasksUrl,
}: ShareOverdueListButtonsProps) {
  const shareText = `${overdueCount} world leaders are overdue on signing the 1% Treaty. Estimated cost of their delay: ${livesLost} lives and ${economicLoss}. See who's stalling:`;

  return (
    <ShareLinkButtons
      emailSubject={`${overdueCount} leaders are stalling the 1% Treaty`}
      label="Share The Whole List"
      shareText={shareText}
      url={tasksUrl}
    />
  );
}
