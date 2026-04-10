"use client";

import { useState } from "react";
import { TaskMilestoneStatus } from "@optimitron/db";
import { Button } from "@/components/retroui/Button";

interface TaskMilestoneEditorProps {
  defaultEvidenceNote?: string | null;
  defaultEvidenceUrl?: string | null;
  defaultStatus: TaskMilestoneStatus;
  milestoneId: string;
  taskId: string;
}

export function TaskMilestoneEditor({
  defaultEvidenceNote,
  defaultEvidenceUrl,
  defaultStatus,
  milestoneId,
  taskId,
}: TaskMilestoneEditorProps) {
  const [status, setStatus] = useState<TaskMilestoneStatus>(defaultStatus);
  const [evidenceUrl, setEvidenceUrl] = useState(defaultEvidenceUrl ?? "");
  const [evidenceNote, setEvidenceNote] = useState(defaultEvidenceNote ?? "");
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("saving");

    try {
      const response = await fetch(
        `/api/tasks/${taskId}/milestones/${milestoneId}`,
        {
          body: JSON.stringify({
            evidenceNote,
            evidenceUrl,
            status,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
        },
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setSubmitState("saved");
      window.setTimeout(() => window.location.reload(), 400);
    } catch {
      setSubmitState("error");
      window.setTimeout(() => setSubmitState("idle"), 2000);
    }
  }

  return (
    <form className="space-y-3 border-t-2 border-foreground/20 pt-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-1 text-xs font-black uppercase">
          <span>Status</span>
          <select
            className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-bold"
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskMilestoneStatus)}
          >
            {Object.values(TaskMilestoneStatus).map((value) => (
              <option key={value} value={value}>
                {value.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-xs font-black uppercase md:col-span-2">
          <span>Evidence URL</span>
          <input
            className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-bold"
            placeholder="https://example.com/proof"
            type="url"
            value={evidenceUrl}
            onChange={(event) => setEvidenceUrl(event.target.value)}
          />
        </label>
      </div>
      <label className="block space-y-1 text-xs font-black uppercase">
        <span>Evidence Note</span>
        <textarea
          className="min-h-24 w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-bold"
          placeholder="What moved this milestone forward?"
          value={evidenceNote}
          onChange={(event) => setEvidenceNote(event.target.value)}
        />
      </label>
      <Button className="font-black uppercase" size="sm" type="submit" variant="outline">
        {submitState === "saving"
          ? "Saving"
          : submitState === "saved"
            ? "Saved"
            : submitState === "error"
              ? "Save Failed"
              : "Update Milestone"}
      </Button>
    </form>
  );
}
