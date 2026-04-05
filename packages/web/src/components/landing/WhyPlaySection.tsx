"use client";

import { SectionContainer } from "@/components/ui/section-container";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { GameCTA } from "@/components/ui/game-cta";
import { ParasiticEconomyChart } from "@/components/shared/ParasiticEconomyChart";
import { LiveDeathTicker } from "@/components/animations/LiveDeathTicker";
import { CTA } from "@/lib/messaging";

export function WhyPlaySection() {
  return (
    <SectionContainer bgColor="foreground" borderPosition="both" padding="lg">
      <Container>
        <div id="stakes">
          <SectionHeader
            title="What Happens If Nobody Plays"
            size="lg"
            className="text-background [&_p]:text-background"
          />
        </div>
      </Container>

      {/* Chart breaks out of Container for full width on mobile */}
      <div className="mb-8 px-2 sm:px-4 md:px-8">
        <ParasiticEconomyChart />
      </div>

      <Container>
        {/* Real-time counters */}
        <div className="mb-8">
          <LiveDeathTicker />
        </div>

        {/* Punchline */}
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-black text-background mb-6">
            You are currently losing. You chose it by not choosing.
          </p>
          <GameCTA href="#vote" variant="primary" size="lg">
            {CTA.playNow}
          </GameCTA>
        </div>
      </Container>
    </SectionContainer>
  );
}
