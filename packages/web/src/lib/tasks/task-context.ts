export interface TaskAcceptanceCriteriaContext {
  acceptanceCriteria: string[];
  currentActivities: Array<{
    description: string;
    id: string | null;
    impactSummary: string | null;
    methodology: string | null;
    sourceUrl: string | null;
    updated: string | null;
  }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readTaskContextSections(contextJson: unknown): TaskAcceptanceCriteriaContext {
  if (!isRecord(contextJson)) {
    return {
      acceptanceCriteria: [],
      currentActivities: [],
    };
  }

  const acceptanceCriteria = Array.isArray(contextJson.acceptanceCriteria)
    ? contextJson.acceptanceCriteria.filter((value): value is string => typeof value === "string")
    : [];

  const currentActivities = Array.isArray(contextJson.currentActivities)
    ? contextJson.currentActivities
        .filter(isRecord)
        .map((activity) => ({
          description: typeof activity.description === "string" ? activity.description : "",
          id: typeof activity.id === "string" ? activity.id : null,
          impactSummary:
            typeof activity.impactSummary === "string" ? activity.impactSummary : null,
          methodology:
            typeof activity.methodology === "string" ? activity.methodology : null,
          sourceUrl: typeof activity.sourceUrl === "string" ? activity.sourceUrl : null,
          updated: typeof activity.updated === "string" ? activity.updated : null,
        }))
        .filter((activity) => activity.description.length > 0)
    : [];

  return {
    acceptanceCriteria,
    currentActivities,
  };
}
