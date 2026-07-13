import type { Profile } from "@/lib/types";
import { CreatorCard } from "./CreatorCard";
import { categoryName, resolveVisit } from "@/lib/data";
import { EmptyState } from "./States";

/**
 * Reusable profile grid. Resolves category name and visit link per card
 * so every listing page (category, direction, directory) looks the same.
 */
export function ProfileGrid({
  profiles,
  emptyTitle = "Nothing here yet",
  emptyMessage = "No profiles in this section yet. Check back soon, or add yours.",
}: {
  profiles: Profile[];
  emptyTitle?: string;
  emptyMessage?: string;
}) {
  if (profiles.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionHref="/join"
        actionLabel="Add your profile"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {profiles.map((p) => {
        const visit = resolveVisit(p);
        return (
          <CreatorCard
            key={p.id}
            profile={p}
            categoryName={categoryName(p.mainCategory)}
            visitLabel={visit.label}
            visitHref={visit.href}
          />
        );
      })}
    </div>
  );
}
