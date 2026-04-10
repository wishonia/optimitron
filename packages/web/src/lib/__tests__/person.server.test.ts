import { describe, expect, it, vi } from "vitest";
import { derivePersonSourceRef, findOrCreatePerson } from "../person.server";

describe("person server", () => {
  it("derives stable public-figure source refs from name, office, and affiliation", () => {
    expect(
      derivePersonSourceRef({
        currentAffiliation: "United States Government",
        displayName: "Donald Trump",
        isPublicFigure: true,
        roleTitle: "President",
      }),
    ).toBe("public-figure:donald-trump:president:united-states-government");
  });

  it("reuses existing imported public figures by derived source ref", async () => {
    const existingPerson = {
      countryCode: null,
      currentAffiliation: "United States Government",
      displayName: "Donald Trump",
      email: null,
      id: "person_1",
      image: null,
      isPublicFigure: true,
      sourceRef: "public-figure:donald-trump:president:united-states-government",
      sourceUrl: "https://manual.example/president",
    };
    const db = {
      person: {
        create: vi.fn(),
        findFirst: vi.fn().mockResolvedValue(existingPerson),
        findUnique: vi.fn().mockResolvedValue(existingPerson),
        update: vi.fn().mockResolvedValue(existingPerson),
      },
    } as const;

    const result = await findOrCreatePerson(
      {
        currentAffiliation: "United States Government",
        displayName: "Donald Trump",
        isPublicFigure: true,
        roleTitle: "President",
        sourceUrl: "https://manual.example/president",
      },
      db as never,
    );

    expect(db.person.findUnique).toHaveBeenCalledWith({
      where: {
        sourceRef: "public-figure:donald-trump:president:united-states-government",
      },
    });
    expect(db.person.update).toHaveBeenCalledWith({
      data: {
        countryCode: null,
        currentAffiliation: "United States Government",
        displayName: "Donald Trump",
        email: null,
        image: null,
        isPublicFigure: true,
        sourceRef: "public-figure:donald-trump:president:united-states-government",
        sourceUrl: "https://manual.example/president",
      },
      where: { id: "person_1" },
    });
    expect(db.person.create).not.toHaveBeenCalled();
    expect(result.id).toBe("person_1");
  });
});
