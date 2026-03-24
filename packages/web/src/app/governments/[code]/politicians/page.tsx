import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGovernment, GOVERNMENTS } from "@optimitron/data";
import { getLatestAggregateScores } from "@/lib/aggregate-alignment.server";
import { ScoreboardDashboard } from "@/components/scoreboard/ScoreboardDashboard";
import { ROUTES } from "@/lib/routes";

interface PageProps {
  params: Promise<{ code: string }>;
}

export function generateStaticParams() {
  return GOVERNMENTS.map((g) => ({ code: g.code }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const gov = getGovernment(code.toUpperCase());
  return {
    title: `${gov?.name ?? code} Politician Alignment | The Earth Optimization Game`,
    description: `How ${gov?.name ?? code}'s politicians actually vote vs what citizens want. The receipts.`,
  };
}

export default async function GovernmentPoliticiansPage({ params }: PageProps) {
  const { code } = await params;
  const upperCode = code.toUpperCase();
  const gov = getGovernment(upperCode);
  if (!gov) notFound();

  const data = await getLatestAggregateScores(upperCode);

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href={`/governments/${gov.code}`}
          className="text-sm font-black uppercase text-muted-foreground hover:text-brutal-pink transition-colors"
        >
          &larr; {gov.name}
        </Link>
        <div className="mt-4 border-4 border-primary bg-background p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
            {gov.flag} {gov.name} — No Alignment Data Yet
          </h1>
          <p className="mt-4 text-base font-bold text-foreground">
            No aggregate scores computed yet for {gov.name}. Run pairwise
            comparisons on{" "}
            <Link
              href={ROUTES.wishocracy}
              className="font-black text-brutal-pink underline hover:text-foreground"
            >
              Wishocracy
            </Link>{" "}
            to generate data.
          </p>
          <p className="mt-3 text-sm font-bold text-muted-foreground">
            Not enough humans have voted yet. Tell your friends. Or your
            enemies. Both count.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href={`/governments/${gov.code}`}
          className="text-sm font-black uppercase text-muted-foreground hover:text-brutal-pink transition-colors"
        >
          &larr; {gov.name}
        </Link>
      </div>
      <ScoreboardDashboard data={data} />
    </div>
  );
}
