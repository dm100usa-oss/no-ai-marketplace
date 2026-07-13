"use client";

import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import type { Category, Direction, Profile } from "@/lib/types";
import {
  applyFilters,
  applySort,
  emptyFilters,
  filtersToQuery,
  fuseKeys,
  type FilterState,
  type SearchDoc,
} from "@/lib/search";
import { ProfileGrid } from "./ProfileGrid";
import { FilterIcon, CloseIcon, SearchIcon } from "./icons";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/config";

/**
 * Interactive directory: full-catalogue search + filters + sort in a
 * single place. Search runs client-side via Fuse.js on a prebuilt index
 * (localized), so Russian queries match Russian text. Filters open in a
 * side panel on mobile.
 */
export function DirectoryClient({
  lang,
  dict,
  profiles,
  docs,
  directions,
  categories,
  countries,
  initial,
}: {
  lang: Locale;
  dict: Dictionary;
  profiles: Profile[];
  docs: SearchDoc[];
  directions: Direction[];
  categories: Category[];
  countries: string[];
  initial: FilterState;
}) {
  const [filters, setFilters] = useState<FilterState>(initial);
  const [panelOpen, setPanelOpen] = useState(false);

  const fuse = useMemo(
    () => new Fuse(docs, { keys: fuseKeys, threshold: 0.38, ignoreLocation: true, includeScore: false }),
    [docs],
  );

  const bySlug = useMemo(() => {
    const m = new Map<string, Profile>();
    for (const p of profiles) m.set(p.slug, p);
    return m;
  }, [profiles]);

  // Keep the URL in sync (locale-aware) so results are shareable.
  useEffect(() => {
    const q = filtersToQuery(filters);
    const url = `${localizedPath(lang, "/directory")}${q}`;
    window.history.replaceState(null, "", url);
  }, [filters, lang]);

  const categoriesForFilter = useMemo(() => {
    if (!filters.direction) return categories;
    return categories.filter((c) => c.direction === filters.direction);
  }, [categories, filters.direction]);

  const results = useMemo(() => {
    let list: Profile[];
    if (filters.q.trim().length > 0) {
      const hits = fuse.search(filters.q.trim());
      list = hits.map((h) => bySlug.get(h.item.slug)).filter((x): x is Profile => !!x);
      list = applyFilters(list, filters);
      if (filters.sort !== "newest") list = applySort(list, filters.sort);
    } else {
      list = applyFilters(profiles, filters);
      list = applySort(list, filters.sort);
    }
    return list;
  }, [fuse, filters, profiles, bySlug]);

  const activeFilterCount =
    (filters.direction ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.country ? 1 : 0) +
    (filters.verified !== "any" ? 1 : 0) +
    (filters.sort !== "newest" ? 1 : 0);

  const update = <K extends keyof FilterState>(k: K, v: FilterState[K]) => {
    setFilters((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "direction" && next.category) {
        const c = categories.find((x) => x.slug === next.category);
        if (c && v && c.direction !== v) next.category = "";
      }
      return next;
    });
  };

  const clearAll = () => setFilters({ ...emptyFilters, q: filters.q });

  return (
    <div className="mt-6">
      {/* --- Search bar --- */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-muted-soft)" }}
          >
            <SearchIcon size={18} />
          </span>
          <input
            type="search"
            value={filters.q}
            onChange={(e) => update("q", e.target.value)}
            placeholder={dict.directory.searchPlaceholder}
            aria-label={dict.directory.searchAria}
            className="h-11 w-full rounded-xl border pl-10 pr-3 text-[0.95rem] outline-none transition-colors focus:border-[var(--color-accent)]"
            style={{ borderColor: "var(--color-line)", background: "#fff" }}
          />
        </div>
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="btn btn-quiet !h-11 !py-0 !px-4 md:hidden"
          aria-label={dict.directory.filters}
        >
          <FilterIcon size={18} />
          {dict.directory.filters}
          {activeFilterCount > 0 && (
            <span
              className="ml-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.7rem] font-bold text-white"
              style={{ background: "var(--color-accent)" }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* --- Two columns on desktop --- */}
      <div className="mt-5 grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block">
          <FiltersPanel
            dict={dict}
            filters={filters}
            update={update}
            clearAll={clearAll}
            directions={directions}
            categoriesForFilter={categoriesForFilter}
            countries={countries}
          />
        </aside>

        <div>
          <ResultsHeader
            dict={dict}
            count={results.length}
            filters={filters}
            update={update}
            onClearAll={clearAll}
            directions={directions}
            categories={categories}
            activeFilterCount={activeFilterCount}
          />
          <div className="mt-4">
            <ProfileGrid
              lang={lang}
              dict={dict}
              profiles={results}
              emptyTitle={
                filters.q
                  ? `${dict.directory.noMatchesFor} “${filters.q}”`
                  : dict.directory.noMatchesFilters
              }
              emptyMessage={dict.directory.noMatchesHint}
            />
          </div>
        </div>
      </div>

      {/* --- Mobile filter panel --- */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label={dict.directory.filtersTitle}>
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPanelOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-0 flex h-full w-[92%] max-w-sm flex-col bg-white shadow-xl">
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: "var(--color-line)" }}
            >
              <span className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {dict.directory.filtersTitle}
              </span>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-lg"
                aria-label={dict.header.closeMenu}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <FiltersPanel
                dict={dict}
                filters={filters}
                update={update}
                clearAll={clearAll}
                directions={directions}
                categoriesForFilter={categoriesForFilter}
                countries={countries}
              />
            </div>

            <div
              className="grid grid-cols-2 gap-2 border-t p-3"
              style={{ borderColor: "var(--color-line)" }}
            >
              <button type="button" onClick={clearAll} className="btn btn-quiet">
                {dict.directory.clearAll}
              </button>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="btn btn-ink"
              >
                {dict.directory.show} {results.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FiltersPanel({
  dict,
  filters,
  update,
  clearAll,
  directions,
  categoriesForFilter,
  countries,
}: {
  dict: Dictionary;
  filters: FilterState;
  update: <K extends keyof FilterState>(k: K, v: FilterState[K]) => void;
  clearAll: () => void;
  directions: Direction[];
  categoriesForFilter: Category[];
  countries: string[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <FilterGroup label={dict.directory.direction}>
        <select
          value={filters.direction}
          onChange={(e) => update("direction", e.target.value)}
          className="select"
        >
          <option value="">{dict.directory.allDirections}</option>
          {directions.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label={dict.directory.category}>
        <select
          value={filters.category}
          onChange={(e) => update("category", e.target.value)}
          className="select"
        >
          <option value="">{dict.directory.allCategories}</option>
          {categoriesForFilter.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label={dict.directory.country}>
        <select
          value={filters.country}
          onChange={(e) => update("country", e.target.value)}
          className="select"
        >
          <option value="">{dict.directory.anyCountry}</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label={dict.directory.verification}>
        <div className="flex gap-2">
          <ChoiceChip
            active={filters.verified === "any"}
            onClick={() => update("verified", "any")}
            label={dict.directory.any}
          />
          <ChoiceChip
            active={filters.verified === "verified"}
            onClick={() => update("verified", "verified")}
            label={dict.directory.verifiedOnly}
          />
        </div>
      </FilterGroup>

      <FilterGroup label={dict.directory.sortBy}>
        <select
          value={filters.sort}
          onChange={(e) => update("sort", e.target.value as FilterState["sort"])}
          className="select"
        >
          <option value="newest">{dict.directory.newestFirst}</option>
          <option value="featured">{dict.directory.featuredFirst}</option>
          <option value="az">{dict.directory.aToZ}</option>
        </select>
      </FilterGroup>

      <button
        type="button"
        onClick={clearAll}
        className="mt-1 text-left text-[0.9rem] font-medium"
        style={{ color: "var(--color-accent)" }}
      >
        {dict.directory.clearAllFilters}
      </button>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        className="mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide"
        style={{ color: "var(--color-muted-soft)" }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function ChoiceChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3 py-1.5 text-[0.85rem] font-medium transition-colors"
      style={{
        borderColor: active ? "var(--color-accent)" : "var(--color-line)",
        background: active ? "var(--color-brand-soft)" : "#fff",
        color: active ? "var(--color-accent)" : "var(--color-muted)",
      }}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function ResultsHeader({
  dict,
  count,
  filters,
  update,
  onClearAll,
  directions,
  categories,
  activeFilterCount,
}: {
  dict: Dictionary;
  count: number;
  filters: FilterState;
  update: <K extends keyof FilterState>(k: K, v: FilterState[K]) => void;
  onClearAll: () => void;
  directions: Direction[];
  categories: Category[];
  activeFilterCount: number;
}) {
  const dirName = (slug: string) => directions.find((d) => d.slug === slug)?.name ?? slug;
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          {count} {count === 1 ? dict.common.profile : dict.common.profiles}
          {filters.q && (
            <>
              {" "}
              {dict.directory.forQuery} <span style={{ color: "var(--color-ink)" }}>“{filters.q}”</span>
            </>
          )}
        </p>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[0.85rem] font-medium"
            style={{ color: "var(--color-accent)" }}
          >
            {dict.directory.clearAll}
          </button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filters.direction && (
            <ActiveChip dict={dict} label={dirName(filters.direction)} onRemove={() => update("direction", "")} />
          )}
          {filters.category && (
            <ActiveChip dict={dict} label={catName(filters.category)} onRemove={() => update("category", "")} />
          )}
          {filters.country && (
            <ActiveChip dict={dict} label={filters.country} onRemove={() => update("country", "")} />
          )}
          {filters.verified === "verified" && (
            <ActiveChip dict={dict} label={dict.directory.verifiedOnly} onRemove={() => update("verified", "any")} />
          )}
          {filters.sort !== "newest" && (
            <ActiveChip
              dict={dict}
              label={filters.sort === "featured" ? dict.directory.sortLabelFeatured : dict.directory.sortLabelAz}
              onRemove={() => update("sort", "newest")}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ActiveChip({ dict, label, onRemove }: { dict: Dictionary; label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.82rem]"
      style={{
        borderColor: "var(--color-accent)",
        background: "var(--color-brand-soft)",
        color: "var(--color-accent)",
      }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${dict.directory.removePrefix} ${label}`}
        className="grid h-4 w-4 place-items-center rounded-full"
      >
        <CloseIcon size={12} strokeWidth={2.6} />
      </button>
    </span>
  );
}
