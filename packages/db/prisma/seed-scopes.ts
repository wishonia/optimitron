export const SEED_SCOPES = ["reference", "bootstrap", "demo", "tasks"] as const;

export type SeedScope = (typeof SEED_SCOPES)[number];

const SEED_SCOPE_SET = new Set<SeedScope>(SEED_SCOPES);

export function normalizeSeedScopes(scopes?: Iterable<SeedScope>): SeedScope[] {
  if (!scopes) {
    return [...SEED_SCOPES];
  }

  const normalized = Array.from(new Set(scopes));
  if (!normalized.length) {
    return [...SEED_SCOPES];
  }

  return normalized;
}

export function parseSeedScopes(args: string[]): SeedScope[] {
  const requestedScopes = new Set<SeedScope>();

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg !== "--scope") {
      continue;
    }

    const rawValue = args[index + 1];
    if (!rawValue) {
      throw new Error("Missing value after --scope. Expected one of: all, reference, bootstrap, demo, tasks.");
    }

    index += 1;

    for (const token of rawValue.split(",")) {
      const value = token.trim();
      if (!value) {
        continue;
      }

      if (value === "all") {
        return [...SEED_SCOPES];
      }

      if (!SEED_SCOPE_SET.has(value as SeedScope)) {
        throw new Error(
          `Invalid seed scope "${value}". Expected one of: all, ${SEED_SCOPES.join(", ")}.`,
        );
      }

      requestedScopes.add(value as SeedScope);
    }
  }

  return normalizeSeedScopes(requestedScopes);
}
