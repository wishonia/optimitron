import { DeclarationBody, DeclarationWhyPageSection } from "@/components/declaration/DeclarationContent";
import { DeclarationSignatureActions } from "@/components/declaration/DeclarationSignatureActions";
import { GameCTA } from "@/components/ui/game-cta";
import { SectionContainer } from "@/components/ui/section-container";
import { getRouteMetadata } from "@/lib/metadata";
import { declarationLink, ROUTES } from "@/lib/routes";

export const metadata = getRouteMetadata(declarationLink);

export default function DeclarationPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionContainer bgColor="background" padding="lg">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
          <p className="font-pixel text-sm font-bold uppercase tracking-[0.3em] text-brutal-pink">
            Declaration
          </p>
          <h1 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Declaration of Optimization
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-bold leading-8 text-foreground">
            The canonical statement of why optimization is necessary, what it
            requires, and how to publicly endorse it.
          </p>
        </div>
      </SectionContainer>

      <DeclarationWhyPageSection />

      <div className="mx-auto max-w-3xl px-6 py-8 sm:px-8">
        <hr className="border-t-4 border-primary" />
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-8 sm:px-8">
        <DeclarationBody />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
        <DeclarationSignatureActions />
      </div>

      <SectionContainer bgColor="pink" padding="lg">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="max-w-2xl text-base font-bold text-brutal-pink-foreground">
            Signing the declaration is the public commitment. The actual work is
            still in the task queue.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <GameCTA href={ROUTES.tasks} variant="secondary">
              Open Top Tasks
            </GameCTA>
            <GameCTA href={ROUTES.home} variant="outline">
              Return Home
            </GameCTA>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
