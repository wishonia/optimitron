"use client";

import { useMemo, useState } from "react";
import {
  TaskRow,
  TaskTableHeader,
  getTaskSortValue,
  type TaskSortKey,
} from "./task-row";
import type { TaskCardTask } from "./task-card";

const SORT_OPTIONS: { key: TaskSortKey; label: string }[] = [
  { key: "expectedValue", label: "Economic Value" },
  { key: "delayCost", label: "Delay Cost/Day" },
  { key: "costPerDaly", label: "Cost/DALY" },
  { key: "title", label: "Task Name" },
  { key: "assignee", label: "Assignee" },
  { key: "status", label: "Due Date" },
];

export function SortableTaskList({
  tasks,
  defaultSortKey = "expectedValue",
  defaultSortDir = "desc",
}: {
  tasks: TaskCardTask[];
  defaultSortKey?: TaskSortKey;
  defaultSortDir?: "asc" | "desc";
}) {
  const [sortKey, setSortKey] = useState<TaskSortKey>(defaultSortKey);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);

  const sorted = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const valA = getTaskSortValue(a, sortKey);
      const valB = getTaskSortValue(b, sortKey);
      if (typeof valA === "string" && typeof valB === "string") {
        return sortDir === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDir === "asc"
        ? Number(valA) - Number(valB)
        : Number(valB) - Number(valA);
    });
  }, [tasks, sortKey, sortDir]);

  function handleHeaderSort(key: TaskSortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "title" || key === "assignee" || key === "costPerDaly" ? "asc" : "desc");
    }
  }

  if (tasks.length === 0) return null;

  return (
    <div className="overflow-hidden border-2 border-primary bg-background">
      {/* Mobile sort controls */}
      <div className="flex items-center gap-2 border-b border-foreground/10 px-4 py-2 lg:hidden">
        <label htmlFor="task-sort" className="text-xs font-bold uppercase text-muted-foreground">
          Sort by
        </label>
        <select
          id="task-sort"
          className="border-2 border-foreground bg-background px-2 py-1 text-xs font-bold"
          value={sortKey}
          onChange={(e) => {
            const key = e.target.value as TaskSortKey;
            setSortKey(key);
            setSortDir(key === "title" || key === "assignee" || key === "costPerDaly" ? "asc" : "desc");
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="border-2 border-foreground bg-background px-2 py-1 text-xs font-bold"
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
        >
          {sortDir === "asc" ? "\u2191 Asc" : "\u2193 Desc"}
        </button>
      </div>

      <TaskTableHeader sortKey={sortKey} sortDir={sortDir} onSort={handleHeaderSort} />
      <div className="divide-y divide-foreground/10">
        {sorted.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
