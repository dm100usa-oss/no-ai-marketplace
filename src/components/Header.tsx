"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "./Logo";
import { LocaleLink } from "./LocaleLink";
import { trackEvent } from "@/lib/analytics";
import { MenuIcon, CloseIcon, ChevronDown } from "./icons";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { LOCALES, DEFAULT_LOCALE, LOCALE_NAMES, localizedPath } from "@/i18n/config";
import { primaryNav, footerNav, type NavGroup } from "@/i18n/nav";

/**
 * Header: hamburger left, logo centred, highlighted Add profile right,
 * full-width search below. On mobile the menu opens as an accordion from
 * the top and now also carries the language switcher; on desktop the
 * primary nav is inline.
 */
export function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = primaryNav(dict);

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
              aria-label={menuOpen ? dict.header.closeMenu : dict.header.openMenu}
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-lg lg:hidden"
              style={{ color: "var(--color-ink)" }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {/* Logo — desktop only in left cluster */}
            <div className="hidden lg:block lg:mr-3">
              <Logo lang={lang} ariaLabel={`${dict.site.name}: ${dict.common.home}`} />
            </div>

            {/* Primary nav — desktop only */}
            <nav className="hidden min-w-0 items-center gap-1 lg:flex" aria-label="Primary">
              {nav.map((item) => (
                <LocaleLink
                  key={item.href}
                  lang={lang}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-[0.95rem] font-medium transition-colors hover:bg-[var(--color-brand-soft)]"
                  style={{ color: "var(--color-muted)" }}
                >
                  {item.label}
                </LocaleLink>
              ))}
            </nav>
          </div>

          {/* Centre: logo — mobile only */}
          <div className="lg:hidden">
            <Logo lang={lang} ariaLabel={`${dict.site.name}: ${dict.common.home}`} />
          </div>

          {/* Right: language (desktop). Spacer on mobile keeps the centred logo aligned. */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <LanguageSwitcher lang={lang} dict={dict} />
            </div>
            <span className="h-10 w-10 lg:hidden" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Mobile accordion menu */}
      {menuOpen && (
        <div className="border-t lg:hidden" style={{ borderColor: "var(--color-line)" }}>
          <MobileMenu lang={lang} dict={dict} onNavigate={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}

/** Language switcher: links to the same page in the other language(s). */
function LanguageSwitcher({
  lang,
  dict,
  block = false,
}: {
  lang: Locale;
  dict: Dictionary;
  block?: boolean;
}) {
  const pathname = usePathname() || "/";

  // Strip the current locale prefix to get the canonical path, then
  // re-localize into each target language.
  const canonical = stripLocale(pathname);

  return (
    <div
      className={block ? "flex flex-wrap gap-2" : "flex items-center gap-1"}
      role="group"
      aria-label={dict.languageSwitcher.label}
    >
      {LOCALES.map((l) => {
        const active = l === lang;
        const href = localizedPath(l, canonical);
        return (
          <Link
            key={l}
            href={href}
            hrefLang={l}
            aria-current={active ? "true" : undefined}
            className="rounded-lg border px-3 py-1.5 text-[0.85rem] font-semibold transition-colors"
            style={{
              borderColor: active ? "var(--color-accent)" : "var(--color-line)",
              background: active ? "var(--color-brand-soft)" : "#fff",
              color: active ? "var(--color-accent)" : "var(--color-muted)",
            }}
          >
            {LOCALE_NAMES[l]}
          </Link>
        );
      })}
    </div>
  );
}

/** Remove a leading /ru (or any non-default locale) from a pathname. */
function stripLocale(pathname: string): string {
  for (const l of LOCALES) {
    if (l === DEFAULT_LOCALE) continue;
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

function MobileMenu({
  lang,
  dict,
  onNavigate,
}: {
  lang: Locale;
  dict: Dictionary;
  onNavigate: () => void;
}) {
  const nav = primaryNav(dict);
  const groups = footerNav(dict);

  return (
    <div className="container-page py-2">
      {/* Flat primary links */}
      <ul className="py-1">
        {nav.map((item) => (
          <li key={item.href}>
            <LocaleLink
              lang={lang}
              href={item.href}
              onClick={onNavigate}
              className="block rounded-lg px-2 py-3 text-[1.05rem] font-semibold"
              style={{ color: "var(--color-ink)" }}
            >
              {item.label}
            </LocaleLink>
          </li>
        ))}
      </ul>

      {/* Grouped accordion sections (mirrors footer groups) */}
      <div className="border-t pt-1" style={{ borderColor: "var(--color-line)" }}>
        {groups.map((group) => (
          <AccordionGroup key={group.title} lang={lang} group={group} onNavigate={onNavigate} />
        ))}
      </div>

      {/* Language switcher inside the menu */}
      <div className="border-t py-4" style={{ borderColor: "var(--color-line)" }}>
        <p className="mb-2 px-2 text-[0.8rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted-soft)" }}>
          {dict.languageSwitcher.label}
        </p>
        <div className="px-2">
          <LanguageSwitcher lang={lang} dict={dict} block />
        </div>
      </div>

      <div className="pb-3">
        <LocaleLink
          lang={lang}
          href="/join"
          onClick={() => {
            trackEvent("join_click", { source: "mobile-menu" });
            onNavigate();
          }}
          className="btn btn-ink btn-full"
        >
          {dict.header.addProfileFree}
        </LocaleLink>
      </div>
    </div>
  );
}

function AccordionGroup({
  lang,
  group,
  onNavigate,
}: {
  lang: Locale;
  group: NavGroup;
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
          {group.title}
        </span>
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="pb-2">
          {group.links.map((l) => (
            <li key={l.href}>
              <LocaleLink
                lang={lang}
                href={l.href}
                onClick={onNavigate}
                className="block rounded-lg px-2 py-2.5 text-[0.98rem]"
                style={{ color: "var(--color-muted)" }}
              >
                {l.label}
              </LocaleLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
