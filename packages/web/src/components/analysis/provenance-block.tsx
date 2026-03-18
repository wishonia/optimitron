import type { ExplorerPrecomputeIndex, ExplorerSource } from "@/lib/analysis-explorer-types";

interface ProvenanceBlockProps {
  generatedAt: string;
  sources: ExplorerSource[];
  title?: string;
  precomputeIndex?: ExplorerPrecomputeIndex;
}

export function ProvenanceBlock({
  generatedAt,
  sources,
  title = "Data Freshness & Provenance",
  precomputeIndex,
}: ProvenanceBlockProps) {
  return (
    <section className="border-2 border-primary bg-background p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-sm font-black uppercase text-foreground mb-3">{title}</h2>
      <p className="text-xs font-bold text-muted-foreground mb-3">
        Explorer payload generated {new Date(generatedAt).toLocaleString()}.
      </p>
      <ul className="space-y-2">
        {sources.map(source => (
          <li key={source.id} className="border border-primary bg-muted px-3 py-2">
            <div className="text-xs font-black text-foreground uppercase">{source.label}</div>
            <div className="text-xs text-muted-foreground">{source.provenance}</div>
            <div className="text-xs text-muted-foreground">Generated {new Date(source.generatedAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      {precomputeIndex && (
        <div className="mt-4 border border-primary bg-brutal-yellow/20 px-3 py-2">
          <div className="text-xs font-black uppercase text-foreground">Precompute Cache Index</div>
          <div className="text-xs text-foreground">Key: {precomputeIndex.cacheKey}</div>
          <div className="text-xs text-foreground">
            {precomputeIndex.outcomeCount} outcomes • {precomputeIndex.predictorCount} predictors • {precomputeIndex.pairCount} pairs • {precomputeIndex.subjectCount} subjects
          </div>
        </div>
      )}
    </section>
  );
}
