"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { primaryNav, footerNav } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";
import { SearchIcon, MenuIcon, CloseIcon, ChevronDown } from "./icons";

/**
 * Header (TZ Etap 1 + 5.5 home layout):
 * hamburger left, logo centred, highlighted Add profile right,
 * full-width search below. On mobile the menu opens as an accordion
 * from the top; on desktop the primary nav is inline.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur" style={{ borderColor: "var(--color-line)" }}>
      <div className="container-page">
        {/* Top row */}
        <div className="flex items-center justify-between gap-3 py-3">
          {/* Left cluster */}
          <div className="flex items-center gap-2">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-lg md:hidden"
              style={{ color: "var(--color-ink)" }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {/* Logo — desktop only in left cluster */}
            <div className="hidden md:block md:mr-3">
              <Logo />
            </div>

            {/* Primary nav — desktop only */}
            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-[0.95rem] font-medium transition-colors hover:bg-[var(--color-brand-soft)]"
                  style={{ color: "var(--color-muted)" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Centre: logo — mobile only */}
          <div className="md:hidden">
            <Logo />
          </div>

          {/* Right: Add profile (highlighted) */}
          <Link
            href="/join"
            onClick={() => trackEvent("join_click", { source: "header" })}
            className="btn btn-ink shrink-0 !px-4 !py-2.5 text-[0.95rem]"
          >
            Add profile
          </Link>
        </div>

        {/* Full-width search row */}
        <div className="pb-3">
          <form action="/directory" className="flex items-stretch gap-2" role="search">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted-soft)" }}>
                <SearchIcon size={18} />
              </span>
              <input
                type="search"
                name="q"
                placeholder="Search creators, categories, products…"
                aria-label="Search"
                className="h-11 w-full rounded-xl border pl-10 pr-3 text-[0.95rem] outline-none transition-colors focus:border-[var(--color-accent)]"
                style={{ borderColor: "var(--color-line)", background: "#fff" }}
              />
            </div>
            <button type="submit" className="btn btn-accent !px-5" aria-label="Search">
              <SearchIcon size={18} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* Mobile accordion menu */}
      {menuOpen && (
        <div className="border-t md:hidden" style={{ borderColor: "var(--color-line)" }}>
          <MobileMenu onNavigate={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}

function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="container-page py-2">
      {/* Flat primary links */}
      <ul className="py-1">
        {primaryNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block rounded-lg px-2 py-3 text-[1.05rem] font-semibold"
              style={{ color: "var(--color-ink)" }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Grouped accordion sections (mirrors footer groups) */}
      <div className="border-t pt-1" style={{ borderColor: "var(--color-line)" }}>
        {footerNav.map((group) => (
          <AccordionGroup key={group.title} title={group.title} links={group.links} onNavigate={onNavigate} />
        ))}
      </div>

      <div className="py-3">
        <Link
          href="/join"
          onClick={() => {
            trackEvent("join_click", { source: "mobile-menu" });
            onNavigate();
          }}
          className="btn btn-ink btn-full"
        >
          Add your profile — first 100 free
        </Link>
      </div>
    </div>
  );
}

function AccordionGroup({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t" style={{ borderColor: "var(--color-line)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-2 py-3 text-left"
      >
        <span className="text-[0.8rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted-soft)" }}>
          {title}
        </span>
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="pb-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={onNavigate}
                className="block rounded-lg px-2 py-2.5 text-[0.98rem]"
                style={{ color: "var(--color-muted)" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
