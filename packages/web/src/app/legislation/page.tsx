import Link from "next/link";
import type { Metadata } from "next";
import { getLegislationEntries } from "@/lib/legislation";
import { getLegislationPath, ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Model Legislation",
  description: "Evidence-based draft legislation generated from the Optimitron analysis pipeline.",
};

export default function LegislationPage() {
  const entries = getLegislationEntries();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brutal-pink">
          Model Legislation
        </p>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-foreground md:text-4xl">
          Drafted bills built from the analysis, not vibes
        </h1>
        <p className="mt-3 max-w-3xl text-sm font-bold text-muted-foreground">
          These drafts turn the OBG and OPG outputs into concrete bill text. They are still drafts, but they are no longer buried as loose markdown files in the repo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={getLegislationPath(entry.slug)}
            className="border-4 border-primary bg-background p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <p className="text-xl font-black uppercase text-foreground">{entry.title}</p>
            <p className="mt-3 text-sm font-bold text-muted-foreground">{entry.summary}</p>
            <p className="mt-4 text-xs font-black uppercase tracking-wide text-brutal-pink">
              Open draft →
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <ShortcutCard href={ROUTES.obg} title="Budget analysis" description="See the spending diagnosis behind the drafts." />
        <ShortcutCard href={ROUTES.opg} title="Policy rankings" description="See the evidence-ranked policy interventions." />
        <ShortcutCard href={ROUTES.dividend} title="Optimization Dividend" description="See what the savings would return to households." />
      </section>
    </div>
  );
}

function ShortcutCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="border-4 border-primary bg-background p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <p className="text-lg font-black uppercase text-foreground">{title}</p>
      <p className="mt-2 text-sm font-bold text-muted-foreground">{description}</p>
    </Link>
  );
}
