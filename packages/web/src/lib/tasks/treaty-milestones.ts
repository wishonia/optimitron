import type { TaskMilestoneDraft } from "@/lib/tasks/milestones.server";

export function buildTreatySignerMilestones(): TaskMilestoneDraft[] {
  return [
    {
      description: "Public support has been generated for this signer task.",
      key: "m1-citizens-voting",
      sortOrder: 0,
      title: "Citizens voting",
    },
    {
      description: "Citizens are actively contacting the assignee’s office or public channels.",
      key: "m2-citizens-contacting",
      sortOrder: 1,
      title: "Citizens contacting leader",
    },
    {
      description: "The leader’s office has acknowledged the treaty publicly or directly.",
      key: "m3-office-acknowledged",
      sortOrder: 2,
      title: "Office acknowledges treaty",
    },
    {
      description: "The assignee has made a public statement about the treaty.",
      key: "m4-public-statement",
      sortOrder: 3,
      title: "Public statement",
    },
    {
      description: "The assignee introduces legislation or signs a conditional commitment.",
      key: "m5-commitment",
      sortOrder: 4,
      title: "Conditional commitment",
    },
    {
      description: "The assignee signs and executes the treaty task.",
      key: "m6-signed",
      sortOrder: 5,
      title: "Treaty signed",
    },
  ];
}
