import type { Profile } from "@/lib/types";
import { EmptySlotCard } from "./EmptySlotCard";
import { CreatorCard } from "./CreatorCard";
import { categoryNameL, resolveVisitL } from "@/lib/localized-data";
import { EmptyState } from "./States";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

/**
 * Reusable profile grid. Resolves localized category name and visit link
 * per card so every listing page (category, direction, directory) looks
 * the same in every language.
 */
export function ProfileGrid({
  lang,
  dict,
  profiles,
  emptyTitle,
  emptyMessage,
  showSlotCard,
  slotCategoryName,
  slotCategorySlug,
}: {
  lang: Locale;
  dict: Dictionary;
  profiles: Profile[];
  emptyTitle?: string;
  emptyMessage?: string;
  /** Category pages show the invitation card when nobody is listed yet. */
  showSlotCard?: boolean;
  slotCategoryName?: string;
  slotCategorySlug?: string;
}) {
  if (profiles.length === 0) {
    // A category with nobody in it gets the billboard card instead of a
    // plain "nothing here" notice: the spot is free, and saying so is
    // more use to the first person who lands on it.
    if (showSlotCard && slotCategoryName && slotCategorySlug) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <EmptySlotCard
            lang={lang}
            dict={dict}
            categoryName={slotCategoryName}
            categorySlug={slotCategorySlug}
          />
        </div>
      );
    }
    return (
      <EmptyState
        lang={lang}
        title={emptyTitle ?? dict.states.emptyTitle}
        message={emptyMessage ?? dict.states.emptyMessage}
        actionHref="/join"
        actionLabel={dict.common.addProfile}
      />
    );
  }

  const visitLabels = {
    portfolio: dict.profile.visitPortfolio,
    website: dict.profile.visitWebsite,
    visit: dict.profile.visit,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {profiles.map((p) => {
        const visit = resolveVisitL(p, visitLabels);
        return (
          <CreatorCard
            key={p.id}
            lang={lang}
            dict={dict}
            profile={p}
            categoryName={categoryNameL(p.mainCategory, lang)}
            visitLabel={visit.label}
            visitHref={visit.href}
          />
        );
      })}
    </div>
  );
}
