import type { ProfileType } from "@/lib/types";

/**
 * Section a profile lives in. One place, so cards, profile pages and the
 * sitemap can never drift apart.
 */
export function profileBasePath(type: ProfileType): string {
  if (type === "company") return "/companies";
  if (type === "team") return "/teams";
  return "/creators";
}
