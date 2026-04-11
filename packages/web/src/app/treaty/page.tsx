import Link from "next/link";
import { TaskMilestoneStatus } from "@optimitron/db";
import { shareableSnippets } from "@optimitron/data/parameters";
import { getServerSession } from "next-auth";
import { LegislationMarkdown } from "@/components/legislation/LegislationMarkdown";
import { Button } from "@/components/retroui/Button";
import { ArcadeTag } from "@/components/ui/arcade-tag";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { GameCTA } from "@/components/ui/game-cta";
import { authOptions } from "@/lib/auth";
import { getRouteMetadata } from "@/lib/metadata";
import { treatyLink, getSignInPath, ROUTES } from "@/lib/routes";
import { prisma } from "@/lib/prisma";
import {
  TREATY_SIGNER_TASK_KEY_PREFIX,
} from "@/lib/tasks/treaty-signer-network";

export const metadata = getRouteMetadata(treatyLink);

interface SignerStatus {
  countryCode: string;
  highestMilestone: string | null;
  status: "unsigned" | "in-progress" | "signed";
  taskId: string;
  title: string;
}

async function getTreatySignerStatuses(): Promise<SignerStatus[]> {
  const tasks = await prisma.task.findMany({
    where: {
      deletedAt: null,
      AND: [
        { taskKey: { startsWith: `${TREATY_SIGNER_TASK_KEY_PREFIX}:` } },
        { NOT: { taskKey: { contains: ":support:" } } },
      ],
    },
    select: {
      id: true,
      taskKey: true,
      title: true,
      milestones: {
        where: { deletedAt: null },
        select: { key: true, status: true, sortOrder: true },
        orderBy: { sortOrder: "desc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return tasks.map((task) => {
    const countryCode = task.taskKey
      ?.replace(`${TREATY_SIGNER_TASK_KEY_PREFIX}:`, "")
      .split(":")[0]
      ?.toUpperCase() ?? "??";

    const completedMilestones = task.milestones.filter(
      (m) => m.status === TaskMilestoneStatus.COMPLETED || m.status === TaskMilestoneStatus.VERIFIED,
    );
    const highestCompleted = completedMilestones.sort((a, b) => b.sortOrder - a.sortOrder)[0];
    const isSigned = task.milestones.some(
      (m) => m.key === "m6-signed" && (m.status === TaskMilestoneStatus.COMPLETED || m.status === TaskMilestoneStatus.VERIFIED),
    );

    return {
      countryCode,
      highestMilestone: highestCompleted?.key ?? null,
      status: isSigned ? "signed" : completedMilestones.length > 0 ? "in-progress" : "unsigned",
      taskId: task.id,
      title: task.title.replace("Sign the 1% Treaty", "").replace("—", "").trim() || task.title,
    };
  });
}

function getStatusColor(status: SignerStatus["status"]) {
  switch (status) {
    case "signed":
      return "green";
    case "in-progress":
      return "yellow";
    case "unsigned":
      return "background";
  }
}

function getStatusLabel(status: SignerStatus["status"]) {
  switch (status) {
    case "signed":
      return "SIGNED";
    case "in-progress":
      return "IN PROGRESS";
    case "unsigned":
      return "UNSIGNED";
  }
}

export default async function TreatyPage() {
  const session = await getServerSession(authOptions);
  const signers = await getTreatySignerStatuses();
  const signedCount = signers.filter((s) => s.status === "signed").length;
  const inProgressCount = signers.filter((s) => s.status === "in-progress").length;
  const signInHref = getSignInPath(ROUTES.treaty);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <SectionContainer bgColor="pink" padding="lg">
        <div className="mx-auto max-w-4xl text-center">
          <ArcadeTag>The Treaty</ArcadeTag>
          <h1 className="mt-4 text-4xl font-black uppercase leading-none sm:text-5xl md:text-6xl">
            The 1% Treaty
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-bold leading-8">
            Every signatory nation redirects 1% of its military budget to pragmatic clinical trials.
            The balance of power stays identical. Nobody gets weaker. You just stop spending quite so
            much on the capacity to destroy a planet you are still living on.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <GameCTA href="#treaty-text" variant="secondary">Read The Treaty</GameCTA>
            <GameCTA href="#signers" variant="outline">View Signers</GameCTA>
            {!session ? (
              <GameCTA href={signInHref} variant="yellow">Sign In To Sign</GameCTA>
            ) : (
              <GameCTA href="#sign" variant="yellow">Sign The Treaty</GameCTA>
            )}
          </div>
        </div>
      </SectionContainer>

      {/* Status bar */}
      <SectionContainer bgColor="foreground" padding="sm">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 text-center">
          <div>
            <p className="text-3xl font-black text-brutal-green">{signedCount}</p>
            <p className="text-xs font-black uppercase text-background">Signed</p>
          </div>
          <div>
            <p className="text-3xl font-black text-brutal-yellow">{inProgressCount}</p>
            <p className="text-xs font-black uppercase text-background">In Progress</p>
          </div>
          <div>
            <p className="text-3xl font-black text-background">{signers.length}</p>
            <p className="text-xs font-black uppercase text-background">Total Nations</p>
          </div>
          <div>
            <p className="text-3xl font-black text-brutal-pink">2</p>
            <p className="text-xs font-black uppercase text-background">Required To Start</p>
          </div>
        </div>
      </SectionContainer>

      {/* Treaty text */}
      <div className="mx-auto max-w-4xl px-4 py-16" id="treaty-text">
        <SectionHeader title="Full Treaty Text" subtitle="Ten articles. One signature line. Thirty seconds." />
        <LegislationMarkdown markdown={shareableSnippets.onePercentTreatyText.markdown} />
      </div>

      {/* The pitch — why this exists */}
      <SectionContainer bgColor="cyan" padding="lg">
        <div className="mx-auto max-w-4xl">
          <SectionHeader title="Why This Treaty" />
          <LegislationMarkdown markdown={shareableSnippets.onePercentTreatyPitch.markdown} />
        </div>
      </SectionContainer>

      {/* Sign CTA */}
      <SectionContainer bgColor="yellow" padding="lg" id="sign">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeader
            title="Sign The Treaty"
            subtitle={session
              ? "You are signed in. If you are a head of state or their authorized representative, sign below and share from your official social media account to verify."
              : "Sign in with your official email, then share from your verified social media account. That is the verification."}
          />
          {!session ? (
            <div className="flex flex-col items-center gap-4">
              <Button asChild className="font-black uppercase">
                <Link href={signInHref}>Sign In With Official Email</Link>
              </Button>
              <p className="text-sm font-bold">
                Use your government email address. Magic link — no password required.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm font-bold">
                Signed in as {session.user.email ?? session.user.name ?? "unknown"}.
              </p>
              <p className="text-sm font-bold">
                Treaty signing flow coming soon. For now, share the treaty page from your official social media account
                to signal your support.
              </p>
              <GameCTA href={ROUTES.tasks}>View Overdue Leaders</GameCTA>
            </div>
          )}
        </div>
      </SectionContainer>

      {/* Signer grid */}
      <div className="mx-auto max-w-7xl px-4 py-16" id="signers">
        <SectionHeader
          title="Signing Status"
          subtitle={`${signers.length} nations tracked. ${signedCount} signed. ${signers.length - signedCount} outstanding.`}
        />
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {signers.map((signer) => (
            <Link key={signer.taskId} href={`/tasks/${signer.taskId}`}>
              <BrutalCard
                bgColor={getStatusColor(signer.status) as "green" | "yellow" | "background"}
                padding="sm"
                hover
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getFlagEmoji(signer.countryCode)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black uppercase">{signer.title}</p>
                    <p className="text-xs font-bold uppercase">{getStatusLabel(signer.status)}</p>
                  </div>
                </div>
              </BrutalCard>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <SectionContainer bgColor="pink" padding="lg">
        <SectionHeader
          title="Two Countries Is All It Takes"
          subtitle="Article X: Entry into force upon signature by two states. You only need two countries brave enough to go first."
        />
        <div className="flex flex-wrap justify-center gap-4">
          <GameCTA href={ROUTES.tasks}>Push Overdue Leaders</GameCTA>
          <GameCTA href={ROUTES.prize} variant="secondary">Fund The Campaign</GameCTA>
          <GameCTA href={ROUTES.governments} variant="outline">Government Scorecards</GameCTA>
        </div>
      </SectionContainer>
    </div>
  );
}

/** Convert ISO 3166-1 alpha-2 to flag emoji. Falls back to alpha-2 code. */
function getFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (code.length !== 2) return code;

  const offset = 0x1F1E6 - 65; // 'A' = 65
  const first = code.charCodeAt(0);
  const second = code.charCodeAt(1);

  if (first < 65 || first > 90 || second < 65 || second > 90) return code;

  return String.fromCodePoint(first + offset, second + offset);
}
