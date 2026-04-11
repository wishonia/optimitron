import Link from "next/link";
import { getServerSession } from "next-auth";
import { Search } from "lucide-react";
import { Input } from "@/components/retroui/Input";
import { ArcadeTag } from "@/components/ui/arcade-tag";
import { BrutalCard } from "@/components/ui/brutal-card";
import { authOptions } from "@/lib/auth";
import { getRouteMetadata } from "@/lib/metadata";
import { ROUTES, searchLink } from "@/lib/routes";
import { searchSiteContent } from "@/lib/site-search.server";

export const dynamic = "force-dynamic";
export const metadata = getRouteMetadata(searchLink);

const sampleQueries = [
  "treaty",
  "clinical trials",
  "politician alignment",
  "task signer",
  "government waste",
  "MCP",
];

function formatEnumLabel(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ResultCard({
  accent = "background",
  description,
  external = false,
  href,
  meta,
  title,
}: {
  accent?: "background" | "cyan" | "pink" | "yellow";
  description: string;
  external?: boolean;
  href: string;
  meta?: string | null;
  title: string;
}) {
  const content = (
    <BrutalCard bgColor={accent} hover padding="md" className="h-full">
      <div className="flex h-full flex-col gap-3">
        {meta ? (
          <span className="text-[11px] font-black uppercase tracking-[0.18em] opacity-70">
            {meta}
          </span>
        ) : null}
        <h2 className="text-lg font-black uppercase text-foreground">{title}</h2>
        <p className="text-sm font-bold leading-6 text-foreground/80">{description}</p>
        <span className="mt-auto text-xs font-black uppercase tracking-[0.14em] text-foreground">
          Open Result
        </span>
      </div>
    </BrutalCard>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const session = await getServerSession(authOptions);
  const userId = session?.user.id ?? null;
  const results = await searchSiteContent(query, { userId });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <ArcadeTag>Site Search</ArcadeTag>
          <div className="space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tight text-foreground md:text-6xl">
              Search The Machine
            </h1>
            <p className="max-w-3xl text-lg font-bold text-muted-foreground">
              Search public pages, searchable tasks, and the manual index from one place.
              Because hiding important information under vague menu buckets is amateur hour.
            </p>
          </div>

          <form action={ROUTES.search} className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search the site"
                autoFocus
                className="h-14 border-4 border-primary bg-background pl-12 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                defaultValue={query}
                name="q"
                placeholder="Search pages, tasks, treaty docs, policy analysis..."
                type="search"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-14 items-center justify-center border-4 border-primary bg-brutal-pink px-6 text-sm font-black uppercase tracking-[0.14em] text-brutal-pink-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sampleQuery) => (
              <Link
                key={sampleQuery}
                href={`${ROUTES.search}?q=${encodeURIComponent(sampleQuery)}`}
                className="border-2 border-primary bg-brutal-yellow px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-brutal-yellow-foreground transition-colors hover:bg-brutal-cyan hover:text-brutal-cyan-foreground"
              >
                {sampleQuery}
              </Link>
            ))}
          </div>
        </section>

        {query ? (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <BrutalCard bgColor="yellow" padding="md" className="h-full">
                <p className="text-xs font-black uppercase tracking-[0.16em] opacity-70">Site Pages</p>
                <p className="mt-2 text-4xl font-black">{results.pages.length}</p>
              </BrutalCard>
              <BrutalCard bgColor="cyan" padding="md" className="h-full">
                <p className="text-xs font-black uppercase tracking-[0.16em] opacity-70">Tasks</p>
                <p className="mt-2 text-4xl font-black">{results.tasks.length}</p>
              </BrutalCard>
              <BrutalCard bgColor="background" padding="md" className="h-full">
                <p className="text-xs font-black uppercase tracking-[0.16em] opacity-70">Manual Index</p>
                <p className="mt-2 text-4xl font-black">{results.manual.length}</p>
              </BrutalCard>
            </section>

            <section className="space-y-2">
              <p className="text-sm font-bold text-muted-foreground">
                {results.totalResults.toLocaleString()} results for{" "}
                <span className="text-foreground">&quot;{results.query}&quot;</span>
              </p>
              {results.manualError ? (
                <div className="border-4 border-primary bg-brutal-yellow px-4 py-3 text-sm font-bold text-brutal-yellow-foreground">
                  {results.manualError}
                </div>
              ) : null}
            </section>

            {results.totalResults === 0 ? (
              <BrutalCard bgColor="background" padding="lg">
                <h2 className="text-2xl font-black uppercase text-foreground">No Matches</h2>
                <p className="mt-3 text-sm font-bold leading-6 text-muted-foreground">
                  Try a broader term, a person name, a system name, or a concrete phrase like
                  &quot;clinical trials&quot; or &quot;fund optimization&quot;.
                </p>
              </BrutalCard>
            ) : null}

            {results.pages.length > 0 ? (
              <section className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase text-foreground">Site Pages</h2>
                  <p className="text-sm font-bold text-muted-foreground">
                    Core pages inside the Optimitron site.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {results.pages.map((page) => (
                    <ResultCard
                      key={page.href}
                      accent="yellow"
                      description={page.description}
                      external={page.external}
                      href={page.href}
                      meta={page.section}
                      title={page.title}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {results.tasks.length > 0 ? (
              <section className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase text-foreground">Tasks</h2>
                  <p className="text-sm font-bold text-muted-foreground">
                    Public tasks and any additional tasks visible to you when signed in.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {results.tasks.map((task) => (
                    <ResultCard
                      key={task.id}
                      accent="cyan"
                      description={task.snippet ?? "Task result"}
                      href={task.href}
                      meta={[
                        formatEnumLabel(task.status),
                        formatEnumLabel(task.category),
                        task.assigneeLabel ? `Assignee: ${task.assigneeLabel}` : null,
                      ]
                        .filter(Boolean)
                        .join(" / ")}
                      title={task.title}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {results.manual.length > 0 ? (
              <section className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase text-foreground">Manual Index</h2>
                  <p className="text-sm font-bold text-muted-foreground">
                    Hits from the external search index used for retrieval and long-form reference.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {results.manual.map((entry) => (
                    <ResultCard
                      key={entry.href}
                      accent="background"
                      description={entry.description}
                      external
                      href={entry.href}
                      meta={entry.section ? `Manual / ${entry.section}` : "Manual"}
                      title={entry.title}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : (
          <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <BrutalCard bgColor="background" padding="lg" className="h-full">
              <h2 className="text-2xl font-black uppercase text-foreground">What It Searches</h2>
              <div className="mt-4 space-y-3 text-sm font-bold leading-6 text-muted-foreground">
                <p>Internal site pages from the shared route registry.</p>
                <p>Tasks, including your accessible tasks when you are signed in.</p>
                <p>The published manual `search-index.json` used for retrieval.</p>
              </div>
            </BrutalCard>

            <BrutalCard bgColor="pink" padding="lg" className="h-full">
              <h2 className="text-2xl font-black uppercase text-brutal-pink-foreground">Fast Paths</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href={ROUTES.tasks}
                  className="border-2 border-primary bg-background px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  Browse Tasks
                </Link>
                <Link
                  href={ROUTES.tools}
                  className="border-2 border-primary bg-background px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  Open Tools
                </Link>
                <Link
                  href={ROUTES.treaty}
                  className="border-2 border-primary bg-background px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  Read The Treaty
                </Link>
              </div>
            </BrutalCard>
          </section>
        )}
      </div>
    </div>
  );
}
