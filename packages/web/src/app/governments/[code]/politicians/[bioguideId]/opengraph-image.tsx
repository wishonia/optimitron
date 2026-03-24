import { ImageResponse } from "next/og";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function loadScorecardData(): { scorecards: Array<{ bioguideId: string; name: string; party: string; state: string; chamber: string; militaryDollarsVotedFor: number; clinicalTrialDollarsVotedFor: number; ratio: number }>, systemWideRatio: number } | null {
  try {
    const p = join(process.cwd(), "..", "data", "src", "datasets", "generated", "politician-scorecards.json");
    if (existsSync(p)) return JSON.parse(readFileSync(p, "utf8"));
    return null;
  } catch { return null; }
}

function fmt(v: number): string {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(1)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(0)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
  if (v === 0) return "$0";
  return `$${v.toLocaleString()}`;
}

export default async function OGImage({ params }: { params: Promise<{ code: string; bioguideId: string }> }) {
  const { bioguideId } = await params;
  const data = loadScorecardData();
  const p = data?.scorecards.find((s) => s.bioguideId === bioguideId);

  if (!p) {
    return new ImageResponse(
      <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: "#000", color: "#fff", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 900 }}>
        Politician Not Found
      </div>,
      { ...size },
    );
  }

  const total = p.militaryDollarsVotedFor + p.clinicalTrialDollarsVotedFor;
  const milPct = total > 0 ? ((p.militaryDollarsVotedFor / total) * 100).toFixed(1) : "0";
  const trialsPct = total > 0 ? ((p.clinicalTrialDollarsVotedFor / total) * 100).toFixed(2) : "0";
  const ratioText = p.ratio >= 999_999 ? "∞" : `${p.ratio.toLocaleString()}:1`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        color: "#fff",
        padding: 60,
        fontFamily: "sans-serif",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 52, fontWeight: 900, textTransform: "uppercase", letterSpacing: -2 }}>
            {p.name}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#888", marginTop: 8 }}>
            {p.party} · {p.chamber} · {p.state}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#ef4444",
            padding: "16px 24px",
            border: "4px solid #fff",
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 900, color: "#fff" }}>{ratioText}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", textTransform: "uppercase" }}>Mil:Trials</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#ef4444", textTransform: "uppercase" }}>Explosions</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#ef4444" }}>{fmt(p.militaryDollarsVotedFor)}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#ef4444" }}>{milPct}%</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#00D9FF", textTransform: "uppercase" }}>Testing Medicines</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#00D9FF" }}>{fmt(p.clinicalTrialDollarsVotedFor)}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#00D9FF" }}>{trialsPct}%</div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#666" }}>
          System average: {data?.systemWideRatio.toLocaleString() ?? "1,094"}:1 · optimitron.earth
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#FF6B9D", textTransform: "uppercase" }}>
          The Earth Optimization Game
        </div>
      </div>
    </div>,
    { ...size },
  );
}
