import { GameCTA } from "@/components/ui/game-cta";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { Container } from "@/components/ui/container";
import { contributeLink, ROUTES } from "@/lib/routes";
import { getRouteMetadata } from "@/lib/metadata";

export const metadata = getRouteMetadata(contributeLink);

export default function ContributePage() {
  return (
    <div>
      <SectionContainer bgColor="background" borderPosition="bottom" padding="lg">
        <Container>
          <SectionHeader
            title="Contribute"
            subtitle="The bar is on the floor and your species still trips over it. Here is how to help."
            size="lg"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BrutalCard bgColor="pink" shadowSize={8} padding="lg" hover>
              <h3 className="text-2xl font-black uppercase text-foreground mb-3">
                Play the Game
              </h3>
              <p className="text-lg font-bold text-foreground mb-4">
                Vote on the 1% Treaty. Share your link. Every verified voter you bring in earns you a VOTE point. Free. Thirty seconds.
              </p>
              <GameCTA href="/#vote" variant="secondary">
                Play Now
              </GameCTA>
            </BrutalCard>
            <BrutalCard bgColor="cyan" shadowSize={8} padding="lg" hover>
              <h3 className="text-2xl font-black uppercase text-foreground mb-3">
                Deposit
              </h3>
              <p className="text-lg font-bold text-foreground mb-4">
                Put money in the prize fund. If the plan works, VOTE holders get paid. If it does not, you get 11x back. You cannot lose your principal.
              </p>
              <GameCTA href={ROUTES.prize} variant="secondary">
                Insert Coin
              </GameCTA>
            </BrutalCard>
            <BrutalCard bgColor="yellow" shadowSize={8} padding="lg" hover>
              <h3 className="text-2xl font-black uppercase text-foreground mb-3">
                Code
              </h3>
              <p className="text-lg font-bold text-foreground mb-4">
                Fifteen packages. TypeScript monorepo. All open source. Pick a task and build something that matters.
              </p>
              <GameCTA href="https://github.com/mikepsinn/optimitron" variant="secondary">
                GitHub
              </GameCTA>
            </BrutalCard>
            <BrutalCard bgColor="background" shadowSize={8} padding="lg" hover>
              <h3 className="text-2xl font-black uppercase text-foreground mb-3">
                Data
              </h3>
              <p className="text-lg font-bold text-foreground mb-4">
                Track your health, meals, mood, and habits. Every data point helps the optimizer find what actually works.
              </p>
              <GameCTA href={ROUTES.transmit} variant="secondary">
                Transmit Data
              </GameCTA>
            </BrutalCard>
          </div>
        </Container>
      </SectionContainer>
    </div>
  );
}
