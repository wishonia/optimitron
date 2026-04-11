"use client";

import { useState } from "react";
import { Button } from "@/components/retroui/Button";

interface ShareLinkButtonsProps {
  /** The full URL to share */
  url: string;
  /** The share text (appended with URL for platforms that need it inline) */
  shareText: string;
  /** Email subject line (defaults to shareText truncated) */
  emailSubject?: string;
  /** Optional callback fired when any share button is clicked */
  onShare?: () => void;
  /** Optional label above the buttons */
  label?: string;
}

function encode(value: string) {
  return encodeURIComponent(value);
}

/**
 * Shared social share buttons: X, Bluesky, LinkedIn, Reddit, Email, Copy Link.
 *
 * Used by TaskShareButtons, ShareOverdueListButtons, and any future share surface.
 * Pass custom `shareText` and `url`; the component handles encoding and platform URLs.
 */
export function ShareLinkButtons({
  url,
  shareText,
  emailSubject,
  onShare,
  label,
}: ShareLinkButtonsProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const shortShare = `${shareText} ${url}`.trim();
  const subject = emailSubject ?? shareText.slice(0, 120);

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
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encode(url)}`,
      label: "LinkedIn",
    },
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encode(url)}`,
      label: "Facebook",
    },
    {
      href: `https://www.reddit.com/submit?url=${encode(url)}&title=${encode(shareText)}`,
      label: "Reddit",
    },
    {
      href: `mailto:?subject=${encode(subject)}&body=${encode(shortShare)}`,
      label: "Email",
    },
  ];

  return (
    <div className="space-y-2">
      {label ? (
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-pink">
          {label}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <Button
            key={link.label}
            asChild
            className="font-black uppercase"
            size="sm"
            variant="outline"
          >
            <a
              href={link.href}
              rel="noreferrer"
              target="_blank"
              onClick={() => onShare?.()}
            >
              {link.label}
            </a>
          </Button>
        ))}
        <Button
          className="font-black uppercase"
          size="sm"
          type="button"
          variant="outline"
          onClick={() => {
            onShare?.();
            void navigator.clipboard
              .writeText(url)
              .then(() => {
                setCopyState("copied");
                window.setTimeout(() => setCopyState("idle"), 1500);
              })
              .catch(() => {
                setCopyState("error");
                window.setTimeout(() => setCopyState("idle"), 2000);
              });
          }}
        >
          {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy Failed" : "Copy Link"}
        </Button>
      </div>
    </div>
  );
}
