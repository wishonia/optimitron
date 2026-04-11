import { describe, expect, it } from "vitest";
import { enrichTaskTreeWithManualGrounding } from "./optimize-earth-grounding.server";

describe("enrichTaskTreeWithManualGrounding", () => {
  it("preserves existing refs and appends retrieved manual citations recursively", async () => {
    const roots = await enrichTaskTreeWithManualGrounding(
      [
        {
          description: "Make the overdue task list more memetic.",
          id: "root_growth",
          sourceUrls: ["https://optimitron.earth/tasks"],
          title: "Weaponize the overdue task list",
          children: [
            {
              description: "Use the politician pages as pressure surfaces.",
              id: "child_growth",
              sourceUrls: ["https://optimitron.earth/governments/US/politicians"],
              title: "Cross-link politician pages",
            },
          ],
        },
      ],
      {
        retrieve: async (query) => ({
          citations: [
            {
              score: 0.9,
              title: "Earth Optimization Prize",
              url: query.includes("politician")
                ? "https://manual.warondisease.org/knowledge/appendix/incentive-alignment-bonds-paper.html"
                : "https://manual.warondisease.org/knowledge/strategy/earth-optimization-prize.html",
            },
          ],
          context: "",
        }),
      },
    );

    expect(roots[0]?.sourceUrls).toEqual(
      expect.arrayContaining([
        "https://optimitron.earth/tasks",
        "https://manual.warondisease.org/knowledge/strategy/earth-optimization-prize.html",
      ]),
    );
    expect(roots[0]?.children?.[0]?.sourceUrls).toEqual(
      expect.arrayContaining([
        "https://optimitron.earth/governments/US/politicians",
        "https://manual.warondisease.org/knowledge/appendix/incentive-alignment-bonds-paper.html",
      ]),
    );
  });
});
