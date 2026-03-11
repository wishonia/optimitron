import { ACTIVITY_COLLECTION } from './types.js';

const DEFAULT_HYPERSCAN_BASE_URL = 'https://www.hyperscan.dev';

export function buildHyperscanLexiconUrl(
  nsid: string,
  baseUrl: string = DEFAULT_HYPERSCAN_BASE_URL,
): string {
  return `${baseUrl}/agents/lexicon/${nsid}`;
}

export function buildHyperscanGuideUrl(
  slug: string,
  baseUrl: string = DEFAULT_HYPERSCAN_BASE_URL,
): string {
  return `${baseUrl}/agents/guides/${slug}`;
}

export function buildHyperscanDataUrl(
  did: string,
  collection: string = ACTIVITY_COLLECTION,
  rkey?: string,
  baseUrl: string = DEFAULT_HYPERSCAN_BASE_URL,
): string {
  const params = new URLSearchParams({ did, collection });
  if (rkey) {
    params.set('rkey', rkey);
  }
  return `${baseUrl}/data?${params.toString()}`;
}

export async function readHyperscanMarkdown(
  url: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  const response = await fetchImpl(url, {
    headers: { accept: 'text/markdown' },
  });
  if (!response.ok) {
    throw new Error(`Hyperscan request failed with ${response.status}`);
  }
  return response.text();
}
