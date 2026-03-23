import type { Metadata } from "next";
import { OnePercentTreatySection } from "@/components/landing/OnePercentTreatySection";
import { TwoFuturesSection } from "@/components/landing/TwoFuturesSection";
import { LandingProblemSection } from "@/components/landing/LandingProblemSection";
import { LandingFAQSection } from "@/components/landing/LandingFAQSection";
import TreatyVoteSection from "@/components/landing/TreatyVoteSection";
import VoteImpactSection from "@/components/landing/VoteImpactSection";
import { VoteValueReveal } from "@/components/landing/VoteValueReveal";
import { NavItemLink } from "@/components/navigation/NavItemLink";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { Container } from "@/components/ui/container";
import { CTASection } from "@/components/ui/cta-section";
import {
  alignmentLink,
  prizeLink,
  profileLink,
  studiesLink,
  trackLink,
  wishocracyLink,
  misconceptionsLink,
  scoreboardLink,
} from "@/lib/routes";
import { GameCTA } from "@/components/ui/game-cta";
import { CTA } from "@/lib/messaging";
import { fmtParam } from "@/lib/format-parameter";
import {
  POLITICAL_DYSFUNCTION_GLOBAL_OPPORTUNITY_COST_TOTAL,
  GLOBAL_DISEASE_DEATHS_DAILY,
} from "@/lib/parameters-calculations-citations";

export const metadata: Metadata = {
  title: "Optimitron — The Earth Optimization Machine",
  description:
    "Your governments cost $101 trillion a year in dysfunction and let 150,000 people die daily from treatable diseases. This is the spreadsheet that proves it and the plan that fixes it.",
  openGraph: {
    title: "Optimitron — The Earth Optimization Machine",
    description:
      "Your governments cost $101 trillion a year in dysfunction. This is the spreadsheet that proves it.",
    type: "website",
  },
};

const productWorkflows = [
  {
    item: prizeLink,
    label: "Game",
    title: "Play the Earth Optimization Game",
    description:
      "Deposit USDC. Recruit verified voters. Earn VOTE points. The only way to lose is to not play.",
    cta: "Play the Game",
    color: "bg-brutal-pink",
  },
  {
    item: scoreboardLink,
    label: "Scoreboard",
    title: "Humanity's Scoreboard",
    description:
      "Live game metrics: health, income, pool size, verified participants. The coalition size, visible to everyone.",
    cta: "View Scoreboard",
    color: "bg-brutal-cyan",
  },
  {
    item: wishocracyLink,
    label: "Wishocracy",
    title: "Build your ideal budget",
    description:
      "Pick between two things. Then two more. Before you know it, you've designed a coherent budget. Sneaky, isn't it?",
    cta: "Start Voting",
    color: "bg-brutal-yellow",
  },
  {
    item: alignmentLink,
    label: "Alignment",
    title: "Who actually agrees with you?",
    description:
      "Compare your priorities against real politician voting records. Spoiler: it's not who you think.",
    cta: "Check Alignment",
    color: "bg-brutal-cyan",
  },
  {
    item: trackLink,
    label: "Wishonia",
    title: "Chat with an alien",
    description:
      "Track health, meals, mood, and habits with an alien who's been running a planet for 4,237 years.",
    cta: "Open Chat",
    color: "bg-brutal-cyan",
  },
  {
    item: studiesLink,
    label: "Studies",
    title: "Look at the actual numbers",
    description:
      "Outcome hubs, pair studies, policy rankings, country comparisons. All evidence, no vibes.",
    cta: "Browse Studies",
    color: "bg-brutal-yellow",
  },
  {
    item: misconceptionsLink,
    label: "Myth vs Data",
    title: "Things your government got wrong",
    description:
      "War on Drugs, healthcare spending, abstinence education — graded against real data.",
    cta: "See the Myths",
    color: "bg-brutal-pink",
  },
];

export default function Home() {
  return (
    <div>
      {/* ── 1. Hero ── */}
      <SectionContainer bgColor="background" borderPosition="bottom" className="overflow-hidden">
        <Container className="py-24 sm:py-32">
          <div className="text-center">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
              Built by Wishonia // Alien // 4,237 years of field testing
            </p>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none text-foreground">
              The{" "}
              <span className="bg-brutal-cyan px-2">Earth</span>{" "}
              Optimization{" "}
              <span className="bg-brutal-yellow px-2">Machine</span>
            </h1>
            <p className="mt-6 text-xl sm:text-2xl font-black text-foreground max-w-2xl mx-auto">
              Your species has the{" "}
              <span className="text-brutal-cyan">data</span>. It has the{" "}
              <span className="text-brutal-yellow">solutions</span>.
              It simply refuses to use them.
            </p>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-bold">
              Your governments cost you{" "}
              <span className="font-black text-brutal-red">
                {fmtParam({...POLITICAL_DYSFUNCTION_GLOBAL_OPPORTUNITY_COST_TOTAL, unit: "USD"})} a year
              </span>{" "}
              in dysfunction and let{" "}
              <span className="font-black text-brutal-pink">
                {fmtParam({...GLOBAL_DISEASE_DEATHS_DAILY, unit: ""})} people die daily
              </span>{" "}
              from treatable diseases. I made a spreadsheet. You&apos;re welcome.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <GameCTA href="#vote" variant="primary" size="lg">
                {CTA.answerTheQuestion}
              </GameCTA>
              <GameCTA href="#evidence" variant="yellow" size="lg">
                {CTA.convinceMe}
              </GameCTA>
            </div>
            <p className="mt-6 text-sm font-bold text-muted-foreground max-w-2xl mx-auto">
              Everything saves to your{" "}
              <NavItemLink
                item={profileLink}
                variant="custom"
                className="font-black text-foreground hover:text-brutal-pink"
              >
                {profileLink.label}
              </NavItemLink>
              . Budget allocations, alignment reports, daily check-ins. Evidence
              that you tried.
            </p>
          </div>
        </Container>
      </SectionContainer>

      {/* ── 2. Vote — First conversion point (fast converters) ── */}
      <TreatyVoteSection />

      {/* ── 3. The Cost of Doing Nothing ── */}
      <div id="evidence">
        <LandingProblemSection />
      </div>

      {/* ── 4. The 1% Treaty ── */}
      <OnePercentTreatySection />

      {/* ── 5. Two Futures ── */}
      <TwoFuturesSection />

      {/* ── 6. Vote — Second conversion point (convinced skeptics) ── */}
      <TreatyVoteSection />

      {/* ── 7. Your Vote's Impact ── */}
      <VoteImpactSection />

      {/* ── 8. What Your Vote Could Be Worth ── */}
      <VoteValueReveal />

      {/* ── 9. Frequently Asked Objections ── */}
      <LandingFAQSection />

      {/* ── 10. Select Mode ── */}
      <SectionContainer bgColor="background" borderPosition="none" padding="lg">
        <Container>
          <SectionHeader
            title="Select Mode"
            subtitle="On my planet, governance takes four minutes a week. Pick a mode."
            size="lg"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {productWorkflows.map((workflow) => (
              <div
                key={workflow.title}
                className={`p-6 border-4 border-primary ${workflow.color} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all`}
              >
                <div className="text-xs font-black px-2.5 py-1 bg-foreground text-background inline-block self-start mb-4 uppercase">
                  {workflow.label}
                </div>
                <h3 className="text-xl font-black text-foreground mb-3">{workflow.title}</h3>
                <p className="text-sm text-foreground leading-relaxed font-bold flex-grow">
                  {workflow.description}
                </p>
                <NavItemLink
                  item={workflow.item}
                  variant="custom"
                  className="mt-6 inline-flex items-center text-sm font-black text-foreground uppercase hover:text-brutal-pink transition-colors"
                >
                  {workflow.cta} &rarr;
                </NavItemLink>
              </div>
            ))}
          </div>
        </Container>
      </SectionContainer>

      {/* ── 11. Final CTA ── */}
      <CTASection
        heading="Right Then. Shall We Get On With It?"
        description="I've done the research. I've built the tools. I've written you a manual. At this point I genuinely cannot make it easier."
        bgColor="yellow"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <GameCTA href="#vote" variant="primary">
            {CTA.answerTheQuestion}
          </GameCTA>
          <GameCTA href="/prize" variant="secondary">
            {CTA.seeTheMath}
          </GameCTA>
          <GameCTA href="/wishocracy" variant="cyan">
            {CTA.expressPreferences}
          </GameCTA>
        </div>
      </CTASection>
    </div>
  );
}
