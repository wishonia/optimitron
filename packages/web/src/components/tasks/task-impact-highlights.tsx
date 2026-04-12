"use client";

import {
  DFDA_DIRECT_FUNDING_COST_PER_DALY,
  DFDA_DIRECT_FUNDING_QUEUE_CLEARANCE_NPV,
  DFDA_TRIAL_CAPACITY_MULTIPLIER,
  DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_DALYS,
  DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_ECONOMIC_VALUE,
  DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_LIVES_SAVED,
  DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_YEARS,
  EVENTUALLY_AVOIDABLE_DALY_PCT,
  GLOBAL_ANNUAL_DALY_BURDEN,
  TREATY_ANNUAL_FUNDING,
  type Parameter,
} from "@optimitron/data/parameters";
import { ParameterValue } from "@/components/shared/ParameterValue";

interface HighlightRow {
  label: string;
  param: Parameter;
  display?: "auto" | "integer" | "withUnit";
}

const TREATY_HIGHLIGHTS: HighlightRow[] = [
  { label: "Annual funding redirected", param: TREATY_ANNUAL_FUNDING, display: "withUnit" },
  { label: "Disease cure acceleration", param: DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_YEARS, display: "withUnit" },
  { label: "Trial capacity multiplier", param: DFDA_TRIAL_CAPACITY_MULTIPLIER, display: "withUnit" },
  { label: "Total DALYs averted", param: DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_DALYS, display: "withUnit" },
  { label: "Total lives saved", param: DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_LIVES_SAVED, display: "withUnit" },
  { label: "Total economic value", param: DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_ECONOMIC_VALUE, display: "withUnit" },
  { label: "Global annual DALY burden", param: GLOBAL_ANNUAL_DALY_BURDEN, display: "withUnit" },
  { label: "Eventually avoidable share", param: EVENTUALLY_AVOIDABLE_DALY_PCT, display: "withUnit" },
];

const DFDA_HIGHLIGHTS: HighlightRow[] = [
  { label: "Direct funding required (NPV)", param: DFDA_DIRECT_FUNDING_QUEUE_CLEARANCE_NPV, display: "withUnit" },
  { label: "Cost per DALY", param: DFDA_DIRECT_FUNDING_COST_PER_DALY, display: "withUnit" },
  { label: "Disease cure acceleration", param: DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_YEARS, display: "withUnit" },
  { label: "Trial capacity multiplier", param: DFDA_TRIAL_CAPACITY_MULTIPLIER, display: "withUnit" },
  { label: "Total DALYs averted", param: DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_DALYS, display: "withUnit" },
  { label: "Total lives saved", param: DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_LIVES_SAVED, display: "withUnit" },
  { label: "Total economic value", param: DFDA_TRIAL_CAPACITY_PLUS_EFFICACY_LAG_ECONOMIC_VALUE, display: "withUnit" },
];

function getHighlights(taskKey: string | null | undefined): HighlightRow[] | null {
  if (!taskKey) return null;
  if (taskKey === "program:one-percent-treaty:ratify") return TREATY_HIGHLIGHTS;
  if (taskKey === "program:dfda:create") return DFDA_HIGHLIGHTS;
  if (taskKey.startsWith("program:one-percent-treaty:signer:")) return TREATY_HIGHLIGHTS;
  return null;
}

export function TaskImpactHighlights({ taskKey }: { taskKey: string | null | undefined }) {
  const highlights = getHighlights(taskKey);
  if (!highlights) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-brutal-pink">
        Key Impact Parameters
      </h3>
      <p className="text-xs font-bold text-muted-foreground">
        Click any value for the full calculation, formula, confidence interval, and sources.
      </p>
      <dl className="grid gap-2 sm:grid-cols-2">
        {highlights.map((row) => (
          <div
            key={row.param.parameterName}
            className="flex items-baseline justify-between gap-3 border-2 border-foreground bg-muted/20 px-3 py-2"
          >
            <dt className="text-xs font-bold uppercase text-muted-foreground">{row.label}</dt>
            <dd className="text-sm font-black">
              <ParameterValue param={row.param} display={row.display ?? "withUnit"} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
