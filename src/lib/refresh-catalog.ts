import { revalidatePath } from "next/cache";

/**
 * Rebuild the pages a new profile shows up on.
 *
 * Catalog pages are generated ahead of time, which is why they are fast
 * and why, left alone, they would keep serving yesterday's list. A newly
 * published profile touches more places than it looks: the home page, the
 * directory, its category and direction, the sitemap, and the team page of
 * anyone it now links to. Naming them one by one would mean remembering to
 * add to this list every time a page starts showing profiles — and the day
 * somebody forgets, an author pays for a listing that is invisible on one
 * screen.
 *
 * So the whole tree is refreshed instead. It costs a rebuild of pages that
 * did not need one, on an event that happens a few times a day at most.
 *
 * Called after approval and after the applicant confirms their address,
 * because either one can be the moment a profile becomes publishable.
 */
export function refreshCatalog(): void {
  try {
    revalidatePath("/", "layout");
  } catch {
    // Outside a request (a script, a test) there is nothing to refresh.
    // Never worth failing the action that called this.
  }
}
