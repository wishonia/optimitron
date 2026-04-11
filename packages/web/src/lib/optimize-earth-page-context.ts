import type { TaskTreeNode } from "@optimitron/agent";
import { ROUTES } from "./routes";

const SITE_BASE_URL = "https://optimitron.earth";

interface PageContext {
  filePath: string;
  purpose: string;
  route: string;
  title: string;
}

function absoluteUrl(route: string) {
  return `${SITE_BASE_URL}${route}`;
}

function scaleImpact(
  impact: TaskTreeNode["impact"],
  multiplier: number,
): TaskTreeNode["impact"] {
  if (!impact) {
    return impact ?? null;
  }

  return {
    delayDalysLostPerDay:
      impact.delayDalysLostPerDay == null
        ? null
        : impact.delayDalysLostPerDay * multiplier,
    delayEconomicValueUsdLostPerDay:
      impact.delayEconomicValueUsdLostPerDay == null
        ? null
        : impact.delayEconomicValueUsdLostPerDay * multiplier,
    expectedValuePerHourDalys:
      impact.expectedValuePerHourDalys == null
        ? null
        : impact.expectedValuePerHourDalys * multiplier,
    expectedValuePerHourUsd:
      impact.expectedValuePerHourUsd == null
        ? null
        : impact.expectedValuePerHourUsd * multiplier,
  };
}

const CORE_PAGE_CONTEXT: Record<string, PageContext> = {
  demo: {
    filePath: "packages/web/src/app/demo/page.tsx",
    purpose: "Long-form persuasion and onboarding flow.",
    route: ROUTES.demo,
    title: "Demo",
  },
  governments: {
    filePath: "packages/web/src/app/governments/page.tsx",
    purpose: "Public comparative government report card and scatterplot.",
    route: ROUTES.governments,
    title: "Government Report Cards",
  },
  politicians: {
    filePath: "packages/web/src/app/governments/[code]/politicians/page.tsx",
    purpose: "Country politician leaderboard and accountability rankings.",
    route: "/governments/US/politicians",
    title: "Politician Leaderboard",
  },
  scoreboard: {
    filePath: "packages/web/src/app/scoreboard/page.tsx",
    purpose: "Two-number humanity scoreboard and macro proof.",
    route: ROUTES.scoreboard,
    title: "Humanity's Scoreboard",
  },
  tasks: {
    filePath: "packages/web/src/app/tasks/page.tsx",
    purpose: "Highest-value overdue tasks, including leader signatures.",
    route: ROUTES.tasks,
    title: "Tasks",
  },
  taskDetail: {
    filePath: "packages/web/src/app/tasks/[id]/page.tsx",
    purpose: "Task-level evidence, delay math, milestones, and action hooks.",
    route: `${ROUTES.tasks}/[id]`,
    title: "Task Detail",
  },
  video: {
    filePath: "packages/web/src/app/video/page.tsx",
    purpose: "High-compression treaty pitch for sharing.",
    route: ROUTES.video,
    title: "Video",
  },
  wishonia: {
    filePath: "packages/web/src/app/wishonia/page.tsx",
    purpose: "Concrete north-star civilization and institutional endpoint.",
    route: ROUTES.wishonia,
    title: "Wishonia",
  },
};

function growthChildren(parent: TaskTreeNode): TaskTreeNode[] {
  return [
    {
      description:
        `Turn the existing ${CORE_PAGE_CONTEXT.tasks.route} overdue-leader list into a memetic pressure surface with sharper share hooks, politician deep-links, and obvious next actions. Use the actual page instead of inventing new funnel pages.`,
      estimatedEffortHours: 3,
      id: "system_weaponize_overdue_task_list",
      impact: scaleImpact(parent.impact, 0.55),
      isPublic: true,
      roleTitle: "Growth Operator",
      sourceUrls: [
        absoluteUrl(CORE_PAGE_CONTEXT.tasks.route),
        absoluteUrl(CORE_PAGE_CONTEXT.taskDetail.route.replace("[id]", "")),
        absoluteUrl(CORE_PAGE_CONTEXT.politicians.route),
      ],
      status: "DRAFT",
      taskKey: "system:optimize-earth:weaponize-overdue-task-list",
      title: "Turn the overdue leader task list into a memetic share-and-pressure machine",
    },
    {
      description:
        `Exploit the existing ${CORE_PAGE_CONTEXT.governments.route}, ${CORE_PAGE_CONTEXT.politicians.route}, and ${CORE_PAGE_CONTEXT.scoreboard.route} pages as proof assets. Add direct cross-links from leader tasks into politician and scoreboard pages so the outrage has somewhere concrete to go.`,
      estimatedEffortHours: 2,
      id: "system_crosslink_accountability_pages",
      impact: scaleImpact(parent.impact, 0.45),
      isPublic: true,
      roleTitle: "Growth Operator",
      sourceUrls: [
        absoluteUrl(CORE_PAGE_CONTEXT.tasks.route),
        absoluteUrl(CORE_PAGE_CONTEXT.governments.route),
        absoluteUrl(CORE_PAGE_CONTEXT.politicians.route),
        absoluteUrl(CORE_PAGE_CONTEXT.scoreboard.route),
      ],
      status: "DRAFT",
      taskKey: "system:optimize-earth:crosslink-task-government-politician-pages",
      title: "Cross-link task, government, politician, and scoreboard pages into one accountability funnel",
    },
    {
      description:
        `Use the existing ${CORE_PAGE_CONTEXT.video.route}, ${CORE_PAGE_CONTEXT.demo.route}, and ${CORE_PAGE_CONTEXT.wishonia.route} assets as conversion rails. Make the pitch pages feed directly into overdue leader tasks, politician pages, and share actions instead of leaving visitors in explanation land.`,
      estimatedEffortHours: 2,
      id: "system_convert_pitch_pages",
      impact: scaleImpact(parent.impact, 0.4),
      isPublic: true,
      roleTitle: "Growth Operator",
      sourceUrls: [
        absoluteUrl(CORE_PAGE_CONTEXT.video.route),
        absoluteUrl(CORE_PAGE_CONTEXT.demo.route),
        absoluteUrl(CORE_PAGE_CONTEXT.wishonia.route),
        absoluteUrl(CORE_PAGE_CONTEXT.tasks.route),
      ],
      status: "DRAFT",
      taskKey: "system:optimize-earth:convert-pitch-pages-into-task-traffic",
      title: "Turn existing pitch pages into direct traffic for overdue leader and politician tasks",
    },
  ];
}

function contactDiscoveryChildren(parent: TaskTreeNode): TaskTreeNode[] {
  return [
    {
      description:
        "Build missing office-channel discovery tasks for the full signer roster first, especially countries that only have generic government pages or no direct contact URL yet.",
      estimatedEffortHours: 3,
      id: "system_fill_missing_office_channels",
      impact: scaleImpact(parent.impact, 0.55),
      isPublic: true,
      roleTitle: "Outreach Operator",
      sourceUrls: [
        absoluteUrl(CORE_PAGE_CONTEXT.tasks.route),
        absoluteUrl(CORE_PAGE_CONTEXT.governments.route),
      ],
      status: "DRAFT",
      taskKey: "system:optimize-earth:discover-missing-signer-office-channels",
      title: "Discover missing office contact channels for the full signer roster",
    },
    {
      description:
        "Create targeted journalist and coalition contact-discovery tasks using the countries already exposed on the public task and politician surfaces, not generic global PR lists.",
      estimatedEffortHours: 2,
      id: "system_targeted_press_and_coalitions",
      impact: scaleImpact(parent.impact, 0.4),
      isPublic: true,
      roleTitle: "Outreach Operator",
      sourceUrls: [
        absoluteUrl(CORE_PAGE_CONTEXT.tasks.route),
        absoluteUrl(CORE_PAGE_CONTEXT.politicians.route),
        absoluteUrl(CORE_PAGE_CONTEXT.scoreboard.route),
      ],
      status: "DRAFT",
      taskKey: "system:optimize-earth:discover-country-journalist-and-coalition-targets",
      title: "Discover country-specific journalists and coalition targets from the actual treaty queue",
    },
  ];
}

function systemChildren(parent: TaskTreeNode): TaskTreeNode[] {
  return [
    {
      description:
        "Ground future queue generation in existing public pages, task pages, politician pages, and manual sources so the system proposes leverageable work instead of generic consultant sludge.",
      estimatedEffortHours: 2,
      id: "system_ground_generator_in_existing_assets",
      impact: scaleImpact(parent.impact, 0.5),
      isPublic: true,
      roleTitle: "System Operator",
      sourceUrls: [
        absoluteUrl(CORE_PAGE_CONTEXT.tasks.route),
        absoluteUrl(CORE_PAGE_CONTEXT.governments.route),
        absoluteUrl(CORE_PAGE_CONTEXT.politicians.route),
        absoluteUrl(CORE_PAGE_CONTEXT.video.route),
        absoluteUrl(CORE_PAGE_CONTEXT.wishonia.route),
        "https://manual.warondisease.org",
      ],
      status: "DRAFT",
      taskKey: "system:optimize-earth:ground-task-generation-in-existing-pages-and-manual",
      title: "Ground task generation in existing pages and the Wishonia/manual context",
    },
  ];
}

export function enrichOptimizeEarthBootstrapRoots(roots: TaskTreeNode[]) {
  return roots.map((root) => ({
    ...root,
    children: (root.children ?? []).map((child) => {
      if (child.taskKey === "system:optimize-earth:generate-growth-conversion-tasks") {
        return {
          ...child,
          children: growthChildren(child),
        };
      }

      if (child.taskKey === "system:optimize-earth:generate-contact-discovery-tasks") {
        return {
          ...child,
          children: contactDiscoveryChildren(child),
        };
      }

      if (child.taskKey === "system:optimize-earth:generate-system-improvement-tasks") {
        return {
          ...child,
          children: systemChildren(child),
        };
      }

      return child;
    }),
  }));
}
