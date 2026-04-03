import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { ArcadeTag } from "@/components/ui/arcade-tag";
import { GameCTA } from "@/components/ui/game-cta";
import { agenciesLink, ROUTES } from "@/lib/routes";
import { getRouteMetadata } from "@/lib/metadata";
import { AGENCIES } from "@optimitron/data";

export const metadata = getRouteMetadata(agenciesLink);

interface AgencyCard {
  emoji: string;
  name: string;
  description: string;
  href: string;
  earthEquivalent: string;
  color: "pink" | "cyan" | "yellow" | "background";
}

const departments: { label: string; agencies: AgencyCard[] }[] = [
  {
    label: "Democracy",
    agencies: [
      {
        emoji: "🏛️",
        name: AGENCIES.dcongress.dName,
        description: AGENCIES.dcongress.tagline,
        href: ROUTES.dcongress,
        earthEquivalent: AGENCIES.dcongress.replacesAgencyName,
        color: "yellow",
      },
    ],
  },
  {
    label: "Finance",
    agencies: [
      {
        emoji: "💸",
        name: AGENCIES.dtreasury.dName,
        description: AGENCIES.dtreasury.tagline,
        href: ROUTES.dtreasury,
        earthEquivalent: AGENCIES.dtreasury.replacesAgencyName,
        color: "pink",
      },
      {
        emoji: "🤝",
        name: AGENCIES.dfec.dName,
        description: AGENCIES.dfec.tagline,
        href: ROUTES.dfec,
        earthEquivalent: AGENCIES.dfec.replacesAgencyName,
        color: "cyan",
      },
    ],
  },
  {
    label: "Analysis",
    agencies: [
      {
        emoji: "📋",
        name: AGENCIES.dcbo.dName,
        description: AGENCIES.dcbo.tagline,
        href: ROUTES.opg,
        earthEquivalent: AGENCIES.dcbo.replacesAgencyName,
        color: "cyan",
      },
      {
        emoji: "💰",
        name: AGENCIES.domb.dName,
        description: AGENCIES.domb.tagline,
        href: ROUTES.obg,
        earthEquivalent: AGENCIES.domb.replacesAgencyName,
        color: "yellow",
      },
      {
        emoji: "🔍",
        name: AGENCIES.dgao.dName,
        description: AGENCIES.dgao.tagline,
        href: ROUTES.dgao,
        earthEquivalent: AGENCIES.dgao.replacesAgencyName,
        color: "background",
      },
    ],
  },
  {
    label: "Services",
    agencies: [
      {
        emoji: "🧬",
        name: AGENCIES.dih.dName,
        description: AGENCIES.dih.tagline,
        href: ROUTES.dih,
        earthEquivalent: AGENCIES.dih.replacesAgencyName,
        color: "pink",
      },
      {
        emoji: "💀",
        name: AGENCIES.ddod.dName,
        description: AGENCIES.ddod.tagline,
        href: ROUTES.ddod,
        earthEquivalent: AGENCIES.ddod.replacesAgencyName,
        color: "background",
      },
      {
        emoji: "🌐",
        name: AGENCIES.dcensus.dName,
        description: AGENCIES.dcensus.tagline,
        href: ROUTES.dcensus,
        earthEquivalent: AGENCIES.dcensus.replacesAgencyName,
        color: "cyan",
      },
    ],
  },
];

const totalAgencies = departments.reduce((sum, d) => sum + d.agencies.length, 0);

export default function AgenciesIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-16">
        <div className="max-w-3xl space-y-5">
          <ArcadeTag>{totalAgencies} Agencies</ArcadeTag>
          <h1 className="text-3xl font-black uppercase tracking-tight text-foreground md:text-5xl">
            Optimized Governance
          </h1>
          <p className="text-lg font-bold leading-relaxed text-foreground">
            On my planet, governance takes about four minutes a week. Nine
            agencies run everything. No bureaucracy, no lobbying, no
            seventy-four-thousand-page tax code. Just code that does what it
            says.
          </p>
          <p className="text-muted-foreground font-bold leading-relaxed">
            Your species has 440 federal agencies. Most of them exist to manage
            the failures of other agencies. Here is what a working government
            looks like.
          </p>
        </div>
      </section>

      {/* Departments */}
      {departments.map((dept) => (
        <section key={dept.label} className="mb-12">
          <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">
            {dept.label}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {dept.agencies.map((agency) => (
              <Link key={agency.name} href={agency.href} className="block">
                <BrutalCard
                  bgColor={agency.color}
                  hover
                  padding="lg"
                  className="h-full"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{agency.emoji}</span>
                    <span className="inline-block border-2 border-primary bg-background px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-foreground">
                      Active
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-black uppercase text-foreground">
                    {agency.name}
                  </h3>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-foreground">
                    {agency.description}
                  </p>
                  <p className="mt-3 text-xs font-black uppercase text-muted-foreground">
                    On Earth: {agency.earthEquivalent}
                  </p>
                </BrutalCard>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="border-4 border-primary bg-foreground text-background p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-3 text-2xl font-black uppercase">
          See How Earth Does It
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-lg font-bold opacity-80">
          Every Earth government graded on spending vs outcomes. We publish
          the results the same way you publish restaurant hygiene ratings.
          Except you actually read those.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <GameCTA href="/governments" variant="primary" size="lg">
            Government Report Cards
          </GameCTA>
          <GameCTA href={ROUTES.wishocracy} variant="yellow" size="lg">
            Play the Game
          </GameCTA>
        </div>
      </section>
    </div>
  );
}
