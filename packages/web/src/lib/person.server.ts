import type { Prisma } from "@optimitron/db";
import { prisma } from "@/lib/prisma";

type DbClient = Prisma.TransactionClient | typeof prisma;

interface UserPersonIdentity {
  bio: string | null;
  countryCode: string | null;
  email: string;
  id: string;
  image: string | null;
  name: string | null;
  personId: string | null;
}

interface PersonDraftInput {
  countryCode?: string | null;
  currentAffiliation?: string | null;
  displayName: string;
  email?: string | null;
  image?: string | null;
  isPublicFigure?: boolean;
  roleTitle?: string | null;
  sourceRef?: string | null;
  sourceUrl?: string | null;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function derivePersonSourceRef(input: PersonDraftInput) {
  const explicitSourceRef = input.sourceRef?.trim();
  if (explicitSourceRef) {
    return explicitSourceRef;
  }

  const normalizedEmail = input.email?.trim().toLowerCase();
  if (normalizedEmail) {
    return `email:${normalizedEmail}`;
  }

  if (!input.isPublicFigure) {
    return null;
  }

  const keyParts = [
    slugify(input.displayName),
    slugify(input.roleTitle ?? ""),
    slugify(input.currentAffiliation ?? ""),
    slugify(input.countryCode ?? ""),
  ].filter((part) => part.length > 0);

  return keyParts.length > 0 ? `public-figure:${keyParts.join(":")}` : null;
}

function getDisplayName(user: UserPersonIdentity) {
  const trimmedName = user.name?.trim();

  if (trimmedName) {
    return trimmedName;
  }

  if (user.email.trim()) {
    return user.email.trim().toLowerCase();
  }

  return `Person ${user.id.slice(0, 8)}`;
}

function buildPersonSyncData(user: UserPersonIdentity) {
  return {
    bio: user.bio,
    countryCode: user.countryCode,
    displayName: getDisplayName(user),
    email: user.email,
    image: user.image,
  };
}

async function loadUserIdentity(db: DbClient, userId: string): Promise<UserPersonIdentity> {
  return db.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      bio: true,
      countryCode: true,
      email: true,
      id: true,
      image: true,
      name: true,
      personId: true,
    },
  });
}

export async function ensurePersonForUser(
  userId: string,
  db: DbClient = prisma,
) {
  const user = await loadUserIdentity(db, userId);
  const personData = buildPersonSyncData(user);

  if (user.personId) {
    return db.person.update({
      where: { id: user.personId },
      data: personData,
    });
  }

  const existingPerson = await db.person.findUnique({
    where: { email: user.email },
    select: {
      id: true,
      user: {
        select: { id: true },
      },
    },
  });

  const person =
    existingPerson && (!existingPerson.user || existingPerson.user.id === user.id)
      ? await db.person.update({
          where: { id: existingPerson.id },
          data: personData,
        })
      : await db.person.create({
          data: personData,
        });

  await db.user.update({
    where: { id: user.id },
    data: {
      personId: person.id,
    },
  });

  return person;
}

export async function findOrCreatePerson(
  input: PersonDraftInput,
  db: DbClient = prisma,
) {
  const displayName = input.displayName.trim();

  if (!displayName) {
    throw new Error("displayName is required");
  }

  const normalizedEmail = input.email?.trim().toLowerCase() || null;
  const normalizedSourceRef = derivePersonSourceRef({
    ...input,
    displayName,
    email: normalizedEmail,
  });

  if (normalizedEmail) {
    const existingByEmail = await db.person.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingByEmail) {
      return db.person.update({
        where: { id: existingByEmail.id },
        data: {
          countryCode: input.countryCode ?? existingByEmail.countryCode,
          currentAffiliation: input.currentAffiliation ?? existingByEmail.currentAffiliation,
          displayName,
          image: input.image ?? existingByEmail.image,
          isPublicFigure: input.isPublicFigure ?? existingByEmail.isPublicFigure,
          sourceRef: normalizedSourceRef ?? existingByEmail.sourceRef,
          sourceUrl: input.sourceUrl ?? existingByEmail.sourceUrl,
        },
      });
    }
  }

  if (normalizedSourceRef) {
    const existingBySourceRef = await db.person.findUnique({
      where: {
        sourceRef: normalizedSourceRef,
      },
    });

    if (existingBySourceRef && existingBySourceRef.deletedAt == null) {
      return db.person.update({
        where: { id: existingBySourceRef.id },
        data: {
          countryCode: input.countryCode ?? existingBySourceRef.countryCode,
          currentAffiliation: input.currentAffiliation ?? existingBySourceRef.currentAffiliation,
          displayName,
          email: normalizedEmail ?? existingBySourceRef.email,
          image: input.image ?? existingBySourceRef.image,
          isPublicFigure: input.isPublicFigure ?? existingBySourceRef.isPublicFigure,
          sourceRef: normalizedSourceRef,
          sourceUrl: input.sourceUrl ?? existingBySourceRef.sourceUrl,
        },
      });
    }
  }

  if (input.isPublicFigure) {
    const existingByPublicSignature = await db.person.findFirst({
      where: {
        currentAffiliation: input.currentAffiliation ?? null,
        deletedAt: null,
        displayName,
        isPublicFigure: true,
      },
    });

    if (existingByPublicSignature) {
      return db.person.update({
        where: { id: existingByPublicSignature.id },
        data: {
          countryCode: input.countryCode ?? existingByPublicSignature.countryCode,
          currentAffiliation:
            input.currentAffiliation ?? existingByPublicSignature.currentAffiliation,
          displayName,
          email: normalizedEmail ?? existingByPublicSignature.email,
          image: input.image ?? existingByPublicSignature.image,
          isPublicFigure: true,
          sourceRef: normalizedSourceRef ?? existingByPublicSignature.sourceRef,
          sourceUrl: input.sourceUrl ?? existingByPublicSignature.sourceUrl,
        },
      });
    }
  }

  return db.person.create({
    data: {
      countryCode: input.countryCode ?? null,
      currentAffiliation: input.currentAffiliation ?? null,
      displayName,
      email: normalizedEmail,
      image: input.image ?? null,
      isPublicFigure: input.isPublicFigure ?? false,
      sourceRef: normalizedSourceRef,
      sourceUrl: input.sourceUrl ?? null,
    },
  });
}
