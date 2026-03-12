import { fetchers } from "@optomitron/data";
import { prisma } from "@/lib/prisma";
import { createLogger } from "@/lib/logger";
import {
  ALIGNMENT_BENCHMARKS,
  type AlignmentBenchmarkProfile,
} from "@/lib/alignment-benchmarks";
import { BUDGET_CATEGORIES, type BudgetCategoryId } from "@/lib/wishocracy-data";

const logger = createLogger("alignment-politicians");
const ALIGNMENT_CATEGORY_IDS = Object.keys(BUDGET_CATEGORIES) as BudgetCategoryId[];

interface SyncablePoliticianRow {
  chamber: string | null;
  district: string | null;
  externalId: string | null;
  name: string;
  party: string | null;
  title: string | null;
  updatedAt: Date;
  votes: Array<{
    allocationPct: number;
    itemCategory: string;
    updatedAt: Date;
    voteDate: Date | null;
  }>;
}

export interface AlignmentPoliticianSyncResult {
  skipped: boolean;
  reason?: string;
  syncedPoliticians: number;
  syncedVotes: number;
  updatedExternalIds: string[];
}

function normalizeMemberChamber(chamber: string | undefined): string | null {
  if (!chamber) {
    return null;
  }

  const value = chamber.toLowerCase();
  if (value.includes("senate")) {
    return "senate";
  }
  if (value.includes("house")) {
    return "house";
  }

  return value;
}

function defaultTitleForChamber(chamber: string | undefined): string {
  return normalizeMemberChamber(chamber) === "house" ? "Representative" : "Senator";
}

function buildAllocationRecordFromVotes(
  votes: SyncablePoliticianRow["votes"],
): Record<BudgetCategoryId, number> | null {
  const latestByCategory = new Map<BudgetCategoryId, { allocationPct: number; timestamp: number }>();

  for (const vote of votes) {
    if (!ALIGNMENT_CATEGORY_IDS.includes(vote.itemCategory as BudgetCategoryId)) {
      continue;
    }

    const categoryId = vote.itemCategory as BudgetCategoryId;
    const timestamp = vote.voteDate?.getTime() ?? vote.updatedAt.getTime();
    const existing = latestByCategory.get(categoryId);

    if (!existing || timestamp >= existing.timestamp) {
      latestByCategory.set(categoryId, {
        allocationPct: vote.allocationPct,
        timestamp,
      });
    }
  }

  if (latestByCategory.size !== ALIGNMENT_CATEGORY_IDS.length) {
    return null;
  }

  return ALIGNMENT_CATEGORY_IDS.reduce(
    (record, categoryId) => {
      record[categoryId] = Number(
        (latestByCategory.get(categoryId)?.allocationPct ?? 0).toFixed(1),
      );
      return record;
    },
    {} as Record<BudgetCategoryId, number>,
  );
}

function mergeSyncedPoliticianProfile(
  benchmark: AlignmentBenchmarkProfile,
  row: SyncablePoliticianRow,
): AlignmentBenchmarkProfile {
  const allocations = buildAllocationRecordFromVotes(row.votes);
  if (!allocations) {
    return benchmark;
  }

  return {
    ...benchmark,
    name: row.name || benchmark.name,
    party: row.party ?? benchmark.party,
    title: row.title ?? benchmark.title,
    district: row.district ?? benchmark.district,
    chamber: row.chamber ?? benchmark.chamber,
    sourceType: "congress_sync",
    sourceLabel: "Congress-synced current member",
    sourceNote:
      "Current member identity synced from Congress.gov. Category allocations are stored in the Optomitron database and can be refreshed by the alignment sync job.",
    lastSyncedAt: row.updatedAt.toISOString(),
    allocations,
  };
}

export async function loadAlignmentBenchmarkProfiles(): Promise<AlignmentBenchmarkProfile[]> {
  const externalIds = ALIGNMENT_BENCHMARKS.map((profile) => profile.externalId).filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );

  if (externalIds.length === 0) {
    return ALIGNMENT_BENCHMARKS;
  }

  const politicians = await prisma.politician.findMany({
    where: {
      deletedAt: null,
      externalId: { in: externalIds },
      jurisdiction: {
        code: "US",
      },
      votes: {
        some: {
          deletedAt: null,
        },
      },
    },
    select: {
      chamber: true,
      district: true,
      externalId: true,
      name: true,
      party: true,
      title: true,
      updatedAt: true,
      votes: {
        where: {
          deletedAt: null,
        },
        orderBy: [{ voteDate: "desc" }, { updatedAt: "desc" }],
        select: {
          allocationPct: true,
          itemCategory: true,
          updatedAt: true,
          voteDate: true,
        },
      },
    },
  });

  if (politicians.length === 0) {
    return ALIGNMENT_BENCHMARKS;
  }

  const byExternalId = new Map(
    politicians
      .filter((politician) => politician.externalId)
      .map((politician) => [politician.externalId as string, politician]),
  );

  return ALIGNMENT_BENCHMARKS.map((benchmark) => {
    if (!benchmark.externalId) {
      return benchmark;
    }

    const row = byExternalId.get(benchmark.externalId);
    return row ? mergeSyncedPoliticianProfile(benchmark, row) : benchmark;
  });
}

export async function syncAlignmentBenchmarkPoliticians(): Promise<AlignmentPoliticianSyncResult> {
  if (!fetchers.getCongressApiKey()) {
    return {
      skipped: true,
      reason: "CONGRESS_API_KEY is required to sync politician identities from Congress.gov.",
      syncedPoliticians: 0,
      syncedVotes: 0,
      updatedExternalIds: [],
    };
  }

  const usJurisdiction = await prisma.jurisdiction.findUnique({
    where: { code: "US" },
    select: { id: true },
  });

  if (!usJurisdiction) {
    throw new Error("US jurisdiction not found. Run the database seed before syncing politicians.");
  }

  let syncedPoliticians = 0;
  let syncedVotes = 0;
  const updatedExternalIds: string[] = [];

  for (const benchmark of ALIGNMENT_BENCHMARKS) {
    if (!benchmark.externalId) {
      continue;
    }

    const member = await fetchers.fetchMemberDetails(benchmark.externalId);
    if (!member) {
      logger.warn("Skipping politician with missing Congress member data:", benchmark.externalId);
      continue;
    }

    const politician = await prisma.politician.upsert({
      where: {
        externalId: benchmark.externalId,
      },
      update: {
        chamber: normalizeMemberChamber(member.chamber),
        deletedAt: null,
        district: member.state,
        jurisdictionId: usJurisdiction.id,
        name: member.name,
        party: member.party,
        title: defaultTitleForChamber(member.chamber),
      },
      create: {
        chamber: normalizeMemberChamber(member.chamber),
        district: member.state,
        externalId: benchmark.externalId,
        jurisdictionId: usJurisdiction.id,
        name: member.name,
        party: member.party,
        title: defaultTitleForChamber(member.chamber),
      },
    });

    await prisma.politicianVote.deleteMany({
      where: {
        politicianId: politician.id,
        itemCategory: {
          in: ALIGNMENT_CATEGORY_IDS,
        },
      },
    });

    const createdVotes = await prisma.politicianVote.createMany({
      data: ALIGNMENT_CATEGORY_IDS.map((categoryId) => ({
        politicianId: politician.id,
        itemCategory: categoryId,
        allocationPct: benchmark.allocations[categoryId],
        billId: `alignment-benchmark:${benchmark.politicianId}`,
        voteDate: new Date(),
      })),
    });

    syncedPoliticians += 1;
    syncedVotes += createdVotes.count;
    updatedExternalIds.push(benchmark.externalId);
  }

  return {
    skipped: false,
    syncedPoliticians,
    syncedVotes,
    updatedExternalIds,
  };
}
