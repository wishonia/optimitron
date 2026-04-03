import { SectionContainer } from "@/components/ui/section-container";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { ParameterValue } from "@/components/shared/ParameterValue";
import { HumanityScoreboard } from "@/components/shared/HumanityScoreboard";
import { GovernmentLeaderboard } from "@/components/shared/GovernmentLeaderboard";
import { NavItemLink } from "@/components/navigation/NavItemLink";
import { governmentsLink } from "@/lib/routes";
import { TAGLINES, POINT, PRIZE_OUTCOMES } from "@/lib/messaging";
import { TwoOutcomes } from "@/components/prize/TwoOutcomes";
import {
  PRIZE_POOL_HORIZON_MULTIPLE,
  GLOBAL_COORDINATION_TARGET_SUPPORTERS,
} from "@optimitron/data/parameters";

export function HowToWinSection() {
  return (
    <SectionContainer bgColor="cyan" borderPosition="both" padding="lg">
      <Container>
        <SectionHeader
          title="How to Win"
          subtitle="Make humanity healthier and wealthier. Increase 2 numbers That's the whole game!"
          size="lg"
        />

        {/* Humanity's Scoreboard — reusable component */}
        <div className="mb-8">
          <HumanityScoreboard />
        </div>

        {/* Country leaderboard preview */}
        <div className="mb-6">
          <p className="text-lg sm:text-xl font-black uppercase mb-4 text-center">
            Most Misaligned Governments
          </p>
          <GovernmentLeaderboard limit={10} compact />
          <div className="mt-3 text-center">
            <NavItemLink
              item={governmentsLink}
              variant="custom"
              className="text-base font-black uppercase hover:text-brutal-pink transition-colors"
            >
              See all government scoreboards &rarr;
            </NavItemLink>
          </div>
        </div>

        {/* The awareness insight */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <p className="text-xl sm:text-2xl font-black">
            {TAGLINES.pluralisticIgnorance} Get <ParameterValue param={GLOBAL_COORDINATION_TARGET_SUPPORTERS} figures={1} /> to show they want
            this and it becomes unstoppable.
          </p>
        </div>

        {/* Win/Lose outcomes */}
        <div className="mb-8">
          <TwoOutcomes
            fail={{
              title: PRIZE_OUTCOMES.failTitle,
              metric: <><ParameterValue param={PRIZE_POOL_HORIZON_MULTIPLE} />x RETURN</>,
              description: "Depositors split the pool. Still beats a retirement account.",
            }}
            success={{
              title: PRIZE_OUTCOMES.successTitle,
              metric: "PRIZE POOL SPLIT",
              description: <>{POINT} holders get paid from the prize pool. Plus: everyone lives in a world with diseases cured.</>,
            }}
          />
        </div>

        {/* Punchline */}
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-black">
            {TAGLINES.everyPlayerWins}
          </p>
        </div>
      </Container>
    </SectionContainer>
  );
}
