import Link from "next/link";
import { notFound } from "next/navigation";

import { ProvenanceBlock } from "@/components/analysis/provenance-block";
import {
  getExplorerFreshness,
  getExplorerPrecomputeIndex,
  getPairStudy,
  getPairSummary,
  listPairSubjectDrilldowns,
} from "@/lib/analysis-explorer-data";
import { buildPairStudyQualityBadges } from "@/lib/analysis-explorer-badges";
import {
  getJurisdictionStudyPath,
  getJurisdictionsPath,
  getOutcomeHubPath,
  getPairRouteParams,
} from "@/lib/analysis-explorer-routes";

function fmt(value: number | null | undefined, digits: number = 2): string {
  if (value == null || !Number.isFinite(value)) return "N/A";
  return value.toFixed(digits);
}

export function generateStaticParams() {
  return getPairRouteParams();
}

function badgeClass(tone: "neutral" | "info" | "warning" | "danger"): string {
  if (tone === "info") return "bg-brutal-cyan border-primary";
  if (tone === "warning") return "bg-brutal-yellow border-primary";
  if (tone === "danger") return "bg-brutal-red border-primary";
  return "bg-muted border-primary";
}

export default async function PairStudyPage({
  params,
}: {
  params: Promise<{ outcomeId: string; predictorId: string }>;
}) {
  const { outcomeId, predictorId } = await params;
  const summary = getPairSummary(outcomeId, predictorId);
  const study = getPairStudy(outcomeId, predictorId);
  const subjectDrilldowns = listPairSubjectDrilldowns(outcomeId, predictorId);
  const freshness = getExplorerFreshness();
  const precomputeIndex = getExplorerPrecomputeIndex();

  if (!summary || !study) {
    notFound();
  }

  const topSubjects = subjectDrilldowns.slice(0, 8);
  const qualityBadges = buildPairStudyQualityBadges(study);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <Link
          href={getOutcomeHubPath(outcomeId)}
          className="inline-block text-xs font-bold uppercase text-muted-foreground hover:text-foreground mb-3"
        >
          ← Back to Outcome Hub
        </Link>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-2">
          {summary.predictorLabel} → {summary.outcomeLabel}
        </h1>
        <p className="text-muted-foreground font-bold">
          Aggregate n-of-1 pair study with adaptive bins, optimal value estimates, and subject-level diagnostics.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {qualityBadges.map(badge => (
            <span
              key={badge.key}
              className={`inline-block border px-2 py-1 text-[10px] font-black uppercase ${badgeClass(badge.tone)}`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="border-4 border-primary bg-brutal-cyan p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black uppercase text-muted-foreground">Evidence Grade</div>
          <div className="text-3xl font-black text-foreground">{study.evidence.evidenceGrade}</div>
        </div>
        <div className="border-4 border-primary bg-brutal-yellow p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black uppercase text-muted-foreground">Subjects</div>
          <div className="text-3xl font-black text-foreground">{study.coverage.includedSubjects}</div>
        </div>
        <div className="border-4 border-primary bg-brutal-pink p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black uppercase text-muted-foreground">Aligned Pairs</div>
          <div className="text-3xl font-black text-foreground">{study.coverage.alignedPairs}</div>
        </div>
        <div className="border-4 border-primary bg-brutal-cyan p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black uppercase text-muted-foreground">Predictive Pearson</div>
          <div className="text-3xl font-black text-foreground">{fmt(study.evidence.predictivePearson, 3)}</div>
        </div>
      </section>

      {study.optimalValue && (
        <section className="border-4 border-primary bg-background p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
          <h2 className="text-lg font-black uppercase text-foreground mb-3">Optimal Value</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-bold uppercase text-muted-foreground">Central</div>
              <div className="text-2xl font-black text-foreground">
                {fmt(study.optimalValue.centralValue)} {study.optimalValue.predictorUnit || study.predictor.unit}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-muted-foreground">Lower / Upper</div>
              <div className="text-2xl font-black text-foreground">
                {fmt(study.optimalValue.lowerValue)} - {fmt(study.optimalValue.upperValue)}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-muted-foreground">Support</div>
              <div className="text-2xl font-black text-foreground">
                {study.optimalValue.supportSubjects} subjects
              </div>
            </div>
          </div>
        </section>
      )}

      {study.adaptiveBinTables.map(table => (
        <section
          key={table.tableId}
          className="border-4 border-primary bg-background overflow-x-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8"
        >
          <div className="px-4 py-3 border-b-2 border-primary bg-muted">
            <h2 className="text-sm font-black uppercase text-foreground">{table.tableLabel}</h2>
            <p className="text-xs text-muted-foreground">
              {table.binning.method} • target bins {table.binning.targetBinCount} • min size {table.binning.minBinSize}
            </p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary bg-brutal-yellow">
                <th className="text-left px-3 py-2 font-black uppercase">Bin</th>
                <th className="text-right px-3 py-2 font-black uppercase">Obs</th>
                <th className="text-right px-3 py-2 font-black uppercase">Subjects</th>
                {table.metricDefinitions.map(metric => (
                  <th key={metric.id} className="text-right px-3 py-2 font-black uppercase">
                    {metric.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map(row => (
                <tr key={row.binIndex} className="border-b border-primary hover:bg-brutal-cyan">
                  <td className="px-3 py-2 font-bold text-foreground">{row.label}</td>
                  <td className="px-3 py-2 text-right text-foreground">{row.observations}</td>
                  <td className="px-3 py-2 text-right text-foreground">{row.subjects}</td>
                  {table.metricDefinitions.map(metric => (
                    <td key={metric.id} className="px-3 py-2 text-right text-foreground">
                      {fmt(row.metrics[metric.id] ?? null, metric.unit === "%" ? 2 : 3)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <section className="border-4 border-primary bg-background p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black uppercase text-foreground">Subject Drilldowns</h2>
          <Link
            href={getJurisdictionsPath(outcomeId, predictorId)}
            className="text-xs font-black uppercase px-2 py-1 border-4 border-primary bg-background hover:bg-brutal-pink"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topSubjects.map(subject => (
            <Link
              key={subject.summary.subjectId}
              href={getJurisdictionStudyPath(outcomeId, predictorId, subject.summary.subjectId)}
              className="border-4 border-primary bg-muted p-3 hover:bg-brutal-cyan"
            >
              <div className="text-sm font-black text-foreground">{subject.summary.subjectName}</div>
              <div className="text-xs text-muted-foreground">r={fmt(subject.summary.forwardPearson, 3)}</div>
              <div className="text-xs text-muted-foreground">Δ={fmt(subject.summary.percentChangeFromBaseline, 2)}%</div>
              <div className="text-xs text-muted-foreground">
                Score {(subject.ranking.score * 100).toFixed(1)} • {subject.qualityGate.passed ? "pass" : "flagged"}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-4 border-primary bg-background p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
        <h2 className="text-lg font-black uppercase text-foreground mb-3">Data Flow</h2>
        <div className="space-y-2">
          {study.dataFlow.map(step => (
            <div key={step.stepId} className="border border-primary p-3 bg-muted">
              <div className="text-sm font-black text-foreground">{step.label}</div>
              <div className="text-xs text-foreground">
                {step.inputCount} input • {step.outputCount} output • {step.droppedCount} dropped
              </div>
              {step.note && <div className="text-xs text-muted-foreground">{step.note}</div>}
            </div>
          ))}
        </div>
      </section>

      <ProvenanceBlock
        generatedAt={freshness.generatedAt}
        sources={freshness.sources}
        precomputeIndex={precomputeIndex}
      />
    </div>
  );
}
