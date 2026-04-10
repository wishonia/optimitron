import {
  TaskClaimPolicy,
  TaskDifficulty,
  TaskStatus,
} from "@optimitron/db";
import {
  deriveImpactRatios,
  getNormalizedImpactComponents,
  scoreImpactFrame,
  type TaskImpactFrameSummary,
} from "@/lib/tasks/impact";

export interface RankableTask {
  activeClaimCount?: number;
  claimPolicy: TaskClaimPolicy;
  difficulty: TaskDifficulty;
  estimatedEffortHours: number | null;
  interestTags: string[];
  maxClaims?: number | null;
  selectedImpactFrame?: TaskImpactFrameSummary | null;
  skillTags: string[];
  status: TaskStatus;
}

export interface RankableUser {
  availableHoursPerWeek: number | null;
  interestTags: string[];
  maxTaskDifficulty: TaskDifficulty | null;
  skillTags: string[];
}

const DIFFICULTY_ORDER: TaskDifficulty[] = [
  TaskDifficulty.TRIVIAL,
  TaskDifficulty.BEGINNER,
  TaskDifficulty.INTERMEDIATE,
  TaskDifficulty.ADVANCED,
  TaskDifficulty.EXPERT,
];

function normalizeTags(tags: string[]) {
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

function jaccardScore(left: string[], right: string[]) {
  const leftSet = new Set(normalizeTags(left));
  const rightSet = new Set(normalizeTags(right));

  if (!leftSet.size && !rightSet.size) {
    return 0.5;
  }

  const union = new Set([...leftSet, ...rightSet]);
  let intersectionCount = 0;

  for (const value of leftSet) {
    if (rightSet.has(value)) {
      intersectionCount += 1;
    }
  }

  return union.size === 0 ? 0 : intersectionCount / union.size;
}

export function difficultyFitScore(
  taskDifficulty: TaskDifficulty,
  maxTaskDifficulty: TaskDifficulty | null,
) {
  if (!maxTaskDifficulty) {
    return 0.5;
  }

  const taskIndex = DIFFICULTY_ORDER.indexOf(taskDifficulty);
  const userIndex = DIFFICULTY_ORDER.indexOf(maxTaskDifficulty);

  if (taskIndex <= userIndex) {
    return 1 - Math.max(0, userIndex - taskIndex) * 0.1;
  }

  const overshoot = taskIndex - userIndex;
  return Math.max(0, 0.4 - overshoot * 0.2);
}

export function hoursFitScore(
  estimatedEffortHours: number | null,
  availableHoursPerWeek: number | null,
) {
  if (estimatedEffortHours == null || availableHoursPerWeek == null) {
    return 0.5;
  }

  if (estimatedEffortHours <= availableHoursPerWeek) {
    return 1;
  }

  return Math.max(0, 1 - (estimatedEffortHours - availableHoursPerWeek) / Math.max(availableHoursPerWeek, 1));
}

export function isTaskClaimable(task: Pick<RankableTask, "claimPolicy" | "status">) {
  return (
    task.claimPolicy !== TaskClaimPolicy.ASSIGNED_ONLY &&
    task.status === TaskStatus.ACTIVE
  );
}

export function canTaskAcceptMoreClaims(task: RankableTask) {
  if (!isTaskClaimable(task)) {
    return false;
  }

  const activeClaimCount = task.activeClaimCount ?? 0;

  if (task.claimPolicy === TaskClaimPolicy.OPEN_SINGLE) {
    return activeClaimCount === 0;
  }

  if (task.claimPolicy === TaskClaimPolicy.OPEN_MANY && task.maxClaims != null) {
    return activeClaimCount < task.maxClaims;
  }

  return true;
}

export function scoreTaskForUser(task: RankableTask, user: RankableUser) {
  const skillScore = jaccardScore(task.skillTags, user.skillTags);
  const interestScore = jaccardScore(task.interestTags, user.interestTags);
  const difficultyScore = difficultyFitScore(task.difficulty, user.maxTaskDifficulty);
  const effortScore = hoursFitScore(task.estimatedEffortHours, user.availableHoursPerWeek);
  const fitScore =
    0.5 * skillScore +
    0.3 * interestScore +
    0.15 * difficultyScore +
    0.05 * effortScore;
  const impactScore = scoreImpactFrame(task.selectedImpactFrame);

  return fitScore * impactScore;
}

export function scoreTaskForAccountability(task: RankableTask) {
  const frame = task.selectedImpactFrame;
  if (!frame) {
    return 0;
  }

  const ratios = deriveImpactRatios(frame);
  const { actorHourComponent, delayComponent } = getNormalizedImpactComponents(frame);
  const valuePerDollarComponent =
    ratios.expectedValuePerDollar == null
      ? 0
      : Math.min(1, Math.log10(ratios.expectedValuePerDollar + 1) / 8);

  return actorHourComponent * 0.45 + delayComponent * 0.45 + valuePerDollarComponent * 0.1;
}

export function rankTasksForUser<T extends RankableTask>(
  tasks: T[],
  user: RankableUser,
  limit = 20,
) {
  return tasks
    .filter((task) => canTaskAcceptMoreClaims(task))
    .map((task) => ({
      score: scoreTaskForUser(task, user),
      task,
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
