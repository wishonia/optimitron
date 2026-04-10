"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/retroui/Button";
import { buildTaskUrl, getBaseUrl } from "@/lib/url";

interface TaskShareButtonsProps {
  taskId: string;
  shareText: string;
  taskTitle: string;
}

function encode(value: string) {
  return encodeURIComponent(value);
}

export function TaskShareButtons({
  taskId,
  shareText,
  taskTitle,
}: TaskShareButtonsProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const taskUrl = useMemo(() => buildTaskUrl(taskId, getBaseUrl()), [taskId]);
  const shortShareText = `${shareText} ${taskUrl}`.trim();

  async function trackShare() {
    try {
      await fetch("/api/share/track", {
        body: JSON.stringify({
          taskId,
          templateLabel: "task-share",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    } catch {
      // Share tracking is best-effort only.
    }
  }

  const shareLinks = [
    {
      href: `https://twitter.com/intent/tweet?text=${encode(shortShareText)}`,
      label: "X",
    },
    {
      href: `https://bsky.app/intent/compose?text=${encode(shortShareText)}`,
      label: "Bluesky",
    },
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encode(taskUrl)}`,
      label: "LinkedIn",
    },
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encode(taskUrl)}`,
      label: "Facebook",
    },
    {
      href: `https://www.reddit.com/submit?url=${encode(taskUrl)}&title=${encode(taskTitle)}`,
      label: "Reddit",
    },
    {
      href: `mailto:?subject=${encode(taskTitle)}&body=${encode(shortShareText)}`,
      label: "Email",
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brutal-pink">
        Share This Task
      </p>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((shareLink) => (
          <Button
            key={shareLink.label}
            asChild
            className="font-black uppercase"
            size="sm"
            variant="outline"
          >
            <a
              href={shareLink.href}
              rel="noreferrer"
              target="_blank"
              onClick={() => {
                void trackShare();
              }}
            >
              {shareLink.label}
            </a>
          </Button>
        ))}
        <Button
          className="font-black uppercase"
          size="sm"
          type="button"
          variant="outline"
          onClick={() => {
            void trackShare();
            void navigator.clipboard
              .writeText(taskUrl)
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
