"use client";

import { useMemo } from "react";
import { ShareLinkButtons } from "@/components/shared/ShareLinkButtons";
import { buildTaskUrl, getBaseUrl } from "@/lib/url";

interface TaskShareButtonsProps {
  taskId: string;
  shareText: string;
  taskTitle: string;
  variant?: "text" | "icon";
}

export function TaskShareButtons({
  taskId,
  shareText,
  taskTitle,
  variant,
}: TaskShareButtonsProps) {
  const taskUrl = useMemo(() => buildTaskUrl(taskId, getBaseUrl()), [taskId]);

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

  return (
    <ShareLinkButtons
      emailSubject={taskTitle}
      label={variant === "icon" ? undefined : "Share This Task"}
      onShare={() => { void trackShare(); }}
      shareText={shareText}
      url={taskUrl}
      variant={variant}
    />
  );
}
