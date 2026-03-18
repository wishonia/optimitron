"use client";

interface PriorityItem {
  itemId: string;
  itemName: string;
  weight: number;
  rank: number;
  ciLow?: number | null;
  ciHigh?: number | null;
}

interface CitizenPrioritiesChartProps {
  priorities: PriorityItem[];
}

const BAR_COLORS = [
  "bg-brutal-pink",
  "bg-brutal-cyan",
  "bg-brutal-yellow",
  "bg-green-400",
  "bg-purple-400",
  "bg-orange-400",
  "bg-blue-400",
  "bg-rose-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-violet-400",
  "bg-teal-400",
  "bg-indigo-400",
  "bg-lime-400",
  "bg-fuchsia-400",
];

export function CitizenPrioritiesChart({
  priorities,
}: CitizenPrioritiesChartProps) {
  if (priorities.length === 0) {
    return (
      <p className="text-sm font-bold text-muted-foreground">
        No preference data available yet.
      </p>
    );
  }

  const sorted = [...priorities].sort((a, b) => b.weight - a.weight);
  const maxWeight = sorted[0]?.weight ?? 1;

  return (
    <div className="space-y-3">
      {sorted.map((item, index) => {
        const pct = (item.weight * 100).toFixed(1);
        const barWidth = Math.max((item.weight / maxWeight) * 100, 2);
        const color = BAR_COLORS[index % BAR_COLORS.length]!;

        return (
          <div key={item.itemId} className="group">
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-[0.1em] text-foreground">
                {item.itemName}
              </span>
              <span className="text-xs font-bold text-muted-foreground">{pct}%</span>
            </div>
            <div className="h-6 w-full overflow-hidden border border-primary bg-muted">
              <div
                className={`h-full ${color} border-r border-primary transition-all duration-300`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
