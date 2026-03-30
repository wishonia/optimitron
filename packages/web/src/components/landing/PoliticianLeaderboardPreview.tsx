"use client";

import Link from "next/link";
import { SectionContainer } from "@/components/ui/section-container";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { GameCTA } from "@/components/ui/game-cta";
import { POLITICIAN_SCORECARDS } from "@optimitron/data/datasets/us-politician-scorecards";

const TOP_5 = POLITICIAN_SCORECARDS.slice(0, 5);

function formatBillions(val: number): string {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(0)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  return `$${val.toLocaleString()}`;
}

function getGradeColor(ratio: number): string {
  if (ratio <= 1) return "text-brutal-cyan";
  if (ratio <= 10) return "text-brutal-yellow";
  return "text-brutal-red";
}

function getGrade(ratio: number): string {
  if (ratio <= 1) return "A";
  if (ratio <= 5) return "B";
  if (ratio <= 50) return "C";
  if (ratio <= 200) return "D";
  return "F";
}

export function PoliticianLeaderboardPreview() {
  return (
    <SectionContainer bgColor="foreground" borderPosition="top" padding="lg">
      <Container>
        <SectionHeader
          title="Politician Leaderboard"
          subtitle="How your representatives actually vote vs what you actually wanted. The receipts."
          size="lg"
        />
        <div className="border-4 border-primary bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-2 px-4 py-3 bg-muted border-b-4 border-primary font-black text-sm uppercase">
            <div>Name</div>
            <div className="text-right">Military $</div>
            <div className="text-right">Trials $</div>
            <div className="text-right">Ratio</div>
            <div className="text-center">Grade</div>
          </div>
          {/* Rows */}
          {TOP_5.map((pol) => (
            <Link
              key={pol.id}
              href={`/governments/US/politicians/${pol.id}`}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-2 px-4 py-3 border-b-2 border-primary hover:bg-muted transition-colors items-center"
            >
              <div>
                <span className="font-black text-foreground">{pol.name}</span>
                <span className={`ml-2 text-sm font-bold ${
                  pol.party === "Democrat" ? "text-blue-400" : pol.party === "Republican" ? "text-brutal-red" : "text-brutal-yellow"
                }`}>
                  ({pol.party === "Democrat" ? "D" : pol.party === "Republican" ? "R" : "I"})
                </span>
              </div>
              <div className="text-right font-bold text-brutal-red">
                {formatBillions(pol.destructiveDollarsVotedFor)}
              </div>
              <div className="text-right font-bold text-brutal-cyan">
                {formatBillions(pol.clinicalTrialDollarsVotedFor)}
              </div>
              <div className={`text-right font-black ${getGradeColor(pol.militaryToTrialsRatio)}`}>
                {pol.militaryToTrialsRatio.toLocaleString()}:1
              </div>
              <div className={`text-center font-black text-2xl ${getGradeColor(pol.militaryToTrialsRatio)}`}>
                {getGrade(pol.militaryToTrialsRatio)}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <GameCTA href="/governments/US/politicians" variant="cyan">
            🏛️ See All Politicians
          </GameCTA>
        </div>
      </Container>
    </SectionContainer>
  );
}
