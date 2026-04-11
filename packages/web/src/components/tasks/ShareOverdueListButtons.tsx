"use client";

import { useState } from "react";
import { Button } from "@/components/retroui/Button";

interface ShareOverdueListButtonsProps {
  overdueCount: number;
  economicLoss: string;
  livesLost: string;
  tasksUrl: string;
}

function encode(value: string) {
  return encodeURIComponent(value);
}

export function ShareOverdueListButtons({
  overdueCount,
  economicLoss,
  livesLost,
  tasksUrl,
}: ShareOverdueListButtonsProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const shareText = `${overdueCount} world leaders are overdue on signing the 1% Treaty. Estimated cost of their delay: ${livesLost} lives and ${economicLoss}. See who's stalling:`;
  const shortShare = `${shareText} ${tasksUrl}`;

  const shareLinks = [
    {
      href: `https://twitter.com/intent/tweet?text=${encode(shortShare)}`,
      label: "X",
    },
    {
      href: `https://bsky.app/intent/compose?text=${encode(shortShare)}`,
      label: "Bluesky",
    },
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encode(tasksUrl)}`,
      label: "LinkedIn",
    },
    {
      href: `https://www.reddit.com/submit?url=${encode(tasksUrl)}&title=${encode(shareText)}`,
      label: "Reddit",
    },
    {
      href: `mailto:?subject=${encode(`${overdueCount} leaders are stalling the 1% Treaty`)}&body=${encode(shortShare)}`,
      label: "Email",
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs font-black uppercase tracking-[0.18em]">
        Share The Whole List
      </p>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <Button
            key={link.label}
            asChild
            className="font-black uppercase"
            size="sm"
          >
            <a href={link.href} rel="noreferrer" target="_blank">
              {link.label}
            </a>
          </Button>
        ))}
        <Button
          className="font-black uppercase"
          size="sm"
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(tasksUrl).then(() => {
              setCopyState("copied");
              window.setTimeout(() => setCopyState("idle"), 1500);
            });
          }}
        >
          {copyState === "copied" ? "Copied" : "Copy Link"}
        </Button>
      </div>
    </div>
  );
}
