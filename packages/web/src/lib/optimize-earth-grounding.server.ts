import type { TaskTreeNode } from "@optimitron/agent";
import { retrieveManualContext, type ManualSearchCitation } from "./manual-search.server";

export interface ManualGroundingRetriever {
  (
    query: string,
    options?: { forceRefresh?: boolean; maxChars?: number; maxResults?: number },
  ): Promise<{ citations: ManualSearchCitation[]; context: string }>;
}

function dedupeUrls(urls: string[]) {
  return Array.from(new Set(urls.map((url) => url.trim()).filter(Boolean)));
}

function buildGroundingQuery(node: TaskTreeNode) {
  return [node.title, node.description ?? "", ...(node.sourceUrls ?? [])]
    .filter(Boolean)
    .join(" ");
}

async function enrichNodeWithManualGrounding(
  node: TaskTreeNode,
  retrieve: ManualGroundingRetriever,
): Promise<TaskTreeNode> {
  const manual = await retrieve(buildGroundingQuery(node), {
    maxResults: 3,
  });
  const manualUrls = manual.citations.map((citation) => citation.url);
  const children = await Promise.all(
    (node.children ?? []).map((child) => enrichNodeWithManualGrounding(child, retrieve)),
  );

  return {
    ...node,
    children,
    sourceUrls: dedupeUrls([...(node.sourceUrls ?? []), ...manualUrls]),
  };
}

export async function enrichTaskTreeWithManualGrounding(
  roots: TaskTreeNode[],
  options?: {
    retrieve?: ManualGroundingRetriever;
  },
) {
  const retrieve = options?.retrieve ?? retrieveManualContext;
  return Promise.all(roots.map((root) => enrichNodeWithManualGrounding(root, retrieve)));
}
