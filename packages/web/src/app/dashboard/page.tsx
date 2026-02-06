import Link from "next/link";
import { Card, CardHeader, StatCard } from "@/components/Card";

const mockVariables = [
  { name: "Sleep Quality", value: "7.2/10", trend: "+0.4", type: "positive" as const },
  { name: "Magnesium (mg)", value: "450 mg", trend: "steady", type: "neutral" as const },
  { name: "Steps", value: "8,234", trend: "-512", type: "negative" as const },
  { name: "Mood", value: "6.8/10", trend: "+0.2", type: "positive" as const },
  { name: "Caffeine (mg)", value: "180 mg", trend: "-20", type: "positive" as const },
  { name: "Heart Rate (resting)", value: "62 bpm", trend: "-2", type: "positive" as const },
];

const mockMeasurements = [
  { variable: "Sleep Quality", value: "7.5", unit: "/10", time: "2 hours ago", source: "Oura Ring" },
  { variable: "Steps", value: "3,421", unit: "steps", time: "5 hours ago", source: "Apple Health" },
  { variable: "Magnesium", value: "450", unit: "mg", time: "8 hours ago", source: "Manual" },
  { variable: "Mood", value: "7.0", unit: "/10", time: "12 hours ago", source: "Manual" },
  { variable: "Heart Rate", value: "58", unit: "bpm", time: "1 day ago", source: "Fitbit" },
];

const mockInsights = [
  {
    treatment: "Magnesium",
    outcome: "Sleep Quality",
    effect: "+18%",
    optimalValue: "450 mg/day",
    grade: "B",
    pis: 0.34,
  },
  {
    treatment: "Exercise (Steps)",
    outcome: "Mood",
    effect: "+12%",
    optimalValue: "9,500 steps/day",
    grade: "B",
    pis: 0.31,
  },
  {
    treatment: "Caffeine",
    outcome: "Sleep Quality",
    effect: "-8%",
    optimalValue: "< 200 mg before 2pm",
    grade: "C",
    pis: 0.15,
  },
];

const mockReminders = [
  { variable: "Mood", message: "Rate your mood for today", overdue: true },
  { variable: "Supplements", message: "Log evening supplements", overdue: false },
  { variable: "Sleep", message: "Sleep data syncs tonight at 10pm", overdue: false },
];

function gradeColor(grade: string): string {
  switch (grade) {
    case "A": return "text-green-500 bg-green-500/10";
    case "B": return "text-blue-500 bg-blue-500/10";
    case "C": return "text-amber-500 bg-amber-500/10";
    case "D": return "text-orange-500 bg-orange-500/10";
    default: return "text-red-500 bg-red-500/10";
  }
}

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your personal health optimization overview. All data stays on your device.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon="📊" label="Variables Tracked" value="14" change="+2 this week" changeType="positive" />
        <StatCard icon="📏" label="Measurements" value="1,247" change="+23 today" changeType="positive" />
        <StatCard icon="🧠" label="Causal Insights" value="6" change="3 grade B+" changeType="neutral" />
        <StatCard icon="⏰" label="Tracking Streak" value="12 days" change="Best: 28" changeType="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader
            icon="📊"
            title="My Variables"
            description="Your tracked health variables and current values"
          />
          <div className="space-y-3">
            {mockVariables.map((v) => (
              <div
                key={v.name}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div>
                  <div className="font-medium text-sm">{v.name}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium">{v.value}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      v.type === "positive"
                        ? "text-green-500 bg-green-500/10"
                        : v.type === "negative"
                          ? "text-red-500 bg-red-500/10"
                          : "text-gray-400 bg-gray-400/10"
                    }`}
                  >
                    {v.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/import"
            className="mt-4 inline-flex items-center text-sm text-primary-500 hover:text-primary-400 transition-colors"
          >
            + Add variable &rarr;
          </Link>
        </Card>

        <Card>
          <CardHeader
            icon="📏"
            title="Recent Measurements"
            description="Latest data points from your connected sources"
          />
          <div className="space-y-3">
            {mockMeasurements.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
              >
                <div>
                  <div className="font-medium text-sm">{m.variable}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {m.source} &middot; {m.time}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-medium">{m.value}</span>
                  <span className="text-xs text-gray-400 ml-1">{m.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            icon="🧠"
            title="Insights"
            description="Causal relationships discovered from your data (Bradford Hill scoring)"
          />
          <div className="space-y-4">
            {mockInsights.map((insight, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm font-medium">
                    {insight.treatment} &rarr; {insight.outcome}
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gradeColor(insight.grade)}`}>
                    Grade {insight.grade}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Effect:</span>{" "}
                    <span className={`font-medium ${insight.effect.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                      {insight.effect}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Optimal:</span>{" "}
                    <span className="font-medium">{insight.optimalValue}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">PIS:</span>{" "}
                    <span className="font-mono font-medium">{insight.pis.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Predictor Impact Score (PIS) uses temporal alignment + Bradford Hill criteria.
            Grades: A (&ge;0.5) &middot; B (&ge;0.3) &middot; C (&ge;0.1) &middot; D (&ge;0.05) &middot; F (&lt;0.05)
          </p>
        </Card>

        <Card>
          <CardHeader
            icon="⏰"
            title="Tracking Reminders"
            description="Keep your data complete for better causal inference"
          />
          <div className="space-y-3">
            {mockReminders.map((reminder, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  reminder.overdue
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30"
                }`}
              >
                <div>
                  <div className="text-sm font-medium flex items-center gap-2">
                    {reminder.overdue && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                    {reminder.variable}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {reminder.message}
                  </div>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shrink-0">
                  Log Now
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-400">
              The causal engine needs &ge;30 aligned data points and &ge;5 predictor changes
              to generate reliable insights. Keep tracking!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
