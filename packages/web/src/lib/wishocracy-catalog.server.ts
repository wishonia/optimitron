import { prisma } from "@/lib/prisma";
import {
  DEFAULT_WISHOCRACY_JURISDICTION,
  DEFAULT_WISHOCRACY_JURISDICTION_CODE,
  WISHOCRATIC_ITEMS,
  buildWishocraticCatalogRecord,
  type WishocraticItemId,
} from "@/lib/wishocracy-data";

const ALL_WISHOCRATIC_ITEM_IDS = Object.keys(WISHOCRATIC_ITEMS) as WishocraticItemId[];

export { buildWishocraticCatalogRecord };

export async function ensureWishocraticItemsExist(
  itemIds: WishocraticItemId[] = ALL_WISHOCRATIC_ITEM_IDS,
): Promise<void> {
  const uniqueIds = Array.from(new Set(itemIds));
  if (!uniqueIds.length) {
    return;
  }

  const jurisdiction = await prisma.jurisdiction.upsert({
    where: { code: DEFAULT_WISHOCRACY_JURISDICTION_CODE },
    update: {},
    create: {
      name: DEFAULT_WISHOCRACY_JURISDICTION.name,
      type: DEFAULT_WISHOCRACY_JURISDICTION.type,
      code: DEFAULT_WISHOCRACY_JURISDICTION_CODE,
    },
    select: { id: true },
  });

  await Promise.all(
    uniqueIds.map((itemId) => {
      const record = buildWishocraticCatalogRecord(itemId);

      return prisma.wishocraticItem.upsert({
        where: { id: itemId },
        create: {
          id: record.id,
          name: record.name,
          description: record.description,
          currentAllocationUsd: record.currentAllocationUsd,
          currentAllocationPct: record.currentAllocationPct,
          sourceUrl: record.sourceUrl,
          jurisdictionId: jurisdiction.id,
          active: true,
        },
        update: {
          name: record.name,
          description: record.description,
          currentAllocationUsd: record.currentAllocationUsd,
          currentAllocationPct: record.currentAllocationPct,
          sourceUrl: record.sourceUrl,
          active: true,
          deletedAt: null,
        },
      });
    }),
  );
}
