"use client";

import { useMemo } from "react";
import { ShareLinkButtons } from "@/components/shared/ShareLinkButtons";
import { buildTaskUrl, getBaseUrl } from "@/lib/url";

export function TaskRowShare({
  shareText,
  taskId,
}: {
  shareText: string;
  taskId: string;
}) {
  const taskUrl = useMemo(() => buildTaskUrl(taskId, getBaseUrl()), [taskId]);

  return (
    <ShareLinkButtons
      shareText={shareText}
      url={taskUrl}
      variant="icon"
    />
  );
}
