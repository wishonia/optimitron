import type { Metadata } from "next";

import type { NavItem } from "./routes";

const SITE_NAME = "Optimitron";

/**
 * Generate Next.js Metadata from a NavItem definition.
 * Single source of truth — routes.ts descriptions drive both nav UI and page <head>.
 */
export function getRouteMetadata(
  item: NavItem,
  overrides?: Partial<Metadata>,
): Metadata {
  const title = `${item.label} | ${SITE_NAME}`;
  const description = item.description ?? "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    ...overrides,
  };
}
