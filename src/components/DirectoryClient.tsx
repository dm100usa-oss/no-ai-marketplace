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

/**
 * Interactive directory (TZ 3.1 + 3.5): full-catalogue search + filters +
 * sort in a single place. Search runs client-side via Fuse.js on a
 * prebuilt index (TZ 5.2). Filters open in a side panel on mobile
 * (TZ 5.4 mobile filters as separate panel).
 */
export function DirectoryClient({
  profiles,
  docs,
  directions,
  categories,
  countries,
  initial,
}: {
  profiles: Profile[];
  docs: SearchDoc[];
  directions: Direction[];
  categories: Category[];
  countries: string[];
  initial: FilterState;
}) {
  const [filters, setFilters] = useState<FilterState>(initial);
  const [panelOpen, setPanelOpen] = useState(false);

  // Fuse index is stable across renders — rebuild only if docs identity changes.
  const fuse = useMemo(
    () => new Fuse(docs, { keys: fuseKeys, threshold: 0.38, ignoreLocation: true, includeScore: false }),
    [docs],
  );

  // Fast lookup slug -> profile so a Fuse hit maps back to the full Profile.
  const bySlug = useMemo(() => {
    const m = new Map<string, Profile>();
    for (const p of profiles) m.set(p.slug, p);
    return m;
  }, [profiles]);

  // Keep the URL in sync so results are shareable and browser back works.
  useEffect(() => {
    const q = filtersToQuery(filters);
    const url = `/directory${q}`;
    window.history.replaceState(null, "", url);
  }, [filters]);

  // Categories dependent on the selected direction (empty = all).
  const categoriesForFilter = useMemo(() => {
    if (!filters.direction) return categories;
    return categories.filter((c) => c.direction === filters.direction);
  }, [categories, filters.direction]);

  // Compute the visible list: search → filter → sort.
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
      // Clear category if direction changed and category no longer belongs to it.
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
      {/* --- Search bar (works on top of any active filters) --- */}
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
            placeholder="Search creators, categories, products…"
            aria-label="Search creators"
            className="h-11 w-full rounded-xl border pl-10 pr-3 text-[0.95rem] outline-none transition-colors focus:border-[var(--color-accent)]"
            style={{ borderColor: "var(--color-line)", background: "#fff" }}
          />
        </div>
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="btn btn-quiet !h-11 !py-0 !px-4 md:hidden"
          aria-label="Open filters"
        >
          <FilterIcon size={18} />
          Filters
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

      {/* --- Two columns on desktop: sidebar filters + results --- */}
      <div className="mt-5 grid gap-6 md:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden md:block">
          <FiltersPanel
            filters={filters}
            update={update}
            clearAll={clearAll}
            directions={directions}
            categoriesForFilter={categoriesForFilter}
            countries={countries}
          />
        </aside>

        {/* Results column */}
        <div>
          <ResultsHeader
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
              profiles={results}
              emptyTitle={filters.q ? `No matches for “${filters.q}”` : "No profiles match these filters"}
              emptyMessage="Try a broader search or clear a filter."
            />
          </div>
        </div>
      </div>

      {/* --- Mobile filter panel (slides in from the right) --- */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Filters">
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
                Filters
              </span>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-lg"
                aria-label="Close filters"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <FiltersPanel
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
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="btn btn-ink"
              >
                Show {results.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Filters panel (shared: sidebar + mobile) ---------------- */

function FiltersPanel({
  filters,
  update,
  clearAll,
  directions,
  categoriesForFilter,
  countries,
}: {
  filters: FilterState;
  update: <K extends keyof FilterState>(k: K, v: FilterState[K]) => void;
  clearAll: () => void;
  directions: Direction[];
  categoriesForFilter: Category[];
  countries: string[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <FilterGroup label="Direction">
        <select
          value={filters.direction}
          onChange={(e) => update("direction", e.target.value)}
          className="select"
        >
          <option value="">All directions</option>
          {directions.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="Category">
        <select
          value={filters.category}
          onChange={(e) => update("category", e.target.value)}
          className="select"
        >
          <option value="">All categories</option>
          {categoriesForFilter.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="Country">
        <select
          value={filters.country}
          onChange={(e) => update("country", e.target.value)}
          className="select"
        >
          <option value="">Any country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="Verification">
        <div className="flex gap-2">
          <ChoiceChip
            active={filters.verified === "any"}
            onClick={() => update("verified", "any")}
            label="Any"
          />
          <ChoiceChip
            active={filters.verified === "verified"}
            onClick={() => update("verified", "verified")}
            label="Verified only"
          />
        </div>
      </FilterGroup>

      <FilterGroup label="Sort by">
        <select
          value={filters.sort}
          onChange={(e) => update("sort", e.target.value as FilterState["sort"])}
          className="select"
        >
          <option value="newest">Newest first</option>
          <option value="featured">Featured first</option>
          <option value="az">A to Z</option>
        </select>
      </FilterGroup>

      <button
        type="button"
        onClick={clearAll}
        className="mt-1 text-left text-[0.9rem] font-medium"
        style={{ color: "var(--color-accent)" }}
      >
        Clear all filters
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

/* ---------------- Results header: count + active chips ---------------- */

function ResultsHeader({
  count,
  filters,
  update,
  onClearAll,
  directions,
  categories,
  activeFilterCount,
}: {
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
          {count} {count === 1 ? "profile" : "profiles"}
          {filters.q && (
            <>
              {" "}
              for <span style={{ color: "var(--color-ink)" }}>“{filters.q}”</span>
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
            Clear all
          </button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filters.direction && (
            <ActiveChip label={dirName(filters.direction)} onRemove={() => update("direction", "")} />
          )}
          {filters.category && (
            <ActiveChip label={catName(filters.category)} onRemove={() => update("category", "")} />
          )}
          {filters.country && (
            <ActiveChip label={filters.country} onRemove={() => update("country", "")} />
          )}
          {filters.verified === "verified" && (
            <ActiveChip label="Verified only" onRemove={() => update("verified", "any")} />
          )}
          {filters.sort !== "newest" && (
            <ActiveChip
              label={`Sort: ${filters.sort === "featured" ? "featured first" : "A→Z"}`}
              onRemove={() => update("sort", "newest")}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
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
        aria-label={`Remove ${label}`}
        className="grid h-4 w-4 place-items-center rounded-full"
      >
        <CloseIcon size={12} strokeWidth={2.6} />
      </button>
    </span>
  );
}
