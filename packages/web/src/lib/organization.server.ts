import { OrgStatus, OrgType, type Prisma } from "@optimitron/db";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

type DbClient = Prisma.TransactionClient | typeof prisma;

interface OrganizationDraftInput {
  contactEmail?: string | null;
  description?: string | null;
  logo?: string | null;
  name: string;
  sourceRef?: string | null;
  sourceUrl?: string | null;
  type?: OrgType | null;
  website?: string | null;
}

async function getAvailableSlug(
  db: DbClient,
  baseSlug: string,
  excludeId?: string,
) {
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await db.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function findOrCreateOrganization(
  input: OrganizationDraftInput,
  db: DbClient = prisma,
) {
  const name = input.name.trim();

  if (!name) {
    throw new Error("Organization name is required");
  }

  const normalizedSourceRef = input.sourceRef?.trim() || null;
  const desiredType = input.type ?? OrgType.OTHER;

  if (normalizedSourceRef) {
    const existingBySourceRef = await db.organization.findUnique({
      where: { sourceRef: normalizedSourceRef },
    });

    if (existingBySourceRef && existingBySourceRef.deletedAt == null) {
      const nextSlug = await getAvailableSlug(
        db,
        slugify(name),
        existingBySourceRef.id,
      );

      return db.organization.update({
        where: { id: existingBySourceRef.id },
        data: {
          contactEmail: input.contactEmail ?? existingBySourceRef.contactEmail,
          deletedAt: null,
          description: input.description ?? existingBySourceRef.description,
          logo: input.logo ?? existingBySourceRef.logo,
          name,
          slug: nextSlug,
          sourceRef: normalizedSourceRef,
          sourceUrl: input.sourceUrl ?? existingBySourceRef.sourceUrl,
          status: OrgStatus.APPROVED,
          type: desiredType,
          website: input.website ?? existingBySourceRef.website,
        },
      });
    }
  }

  const existingByName = await db.organization.findFirst({
    where: {
      deletedAt: null,
      name,
    },
    orderBy: { createdAt: "asc" },
  });

  if (existingByName) {
    const nextSlug = await getAvailableSlug(db, slugify(name), existingByName.id);

    return db.organization.update({
      where: { id: existingByName.id },
      data: {
        contactEmail: input.contactEmail ?? existingByName.contactEmail,
        deletedAt: null,
        description: input.description ?? existingByName.description,
        logo: input.logo ?? existingByName.logo,
        slug: nextSlug,
        sourceRef: normalizedSourceRef ?? existingByName.sourceRef,
        sourceUrl: input.sourceUrl ?? existingByName.sourceUrl,
        status: OrgStatus.APPROVED,
        type: input.type ?? existingByName.type,
        website: input.website ?? existingByName.website,
      },
    });
  }

  const nextSlug = await getAvailableSlug(db, slugify(name));

  return db.organization.create({
    data: {
      contactEmail: input.contactEmail ?? null,
      description: input.description ?? null,
      logo: input.logo ?? null,
      name,
      slug: nextSlug,
      sourceRef: normalizedSourceRef,
      sourceUrl: input.sourceUrl ?? null,
      status: OrgStatus.APPROVED,
      type: desiredType,
      website: input.website ?? null,
    },
  });
}
