"use client";

import { useState } from "react";
import { LocaleLink } from "./LocaleLink";
import { socialLinks } from "@/lib/config";
import { ChevronDown } from "./icons";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { footerNav, type NavGroup } from "@/i18n/nav";

/**
 * Footer: logo, description, link groups, social, copyright.
 * On mobile each group is an accordion (same device as the mobile menu).
 * On desktop all groups are open columns.
 */
export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const groups = footerNav(dict);

  return (
    <footer className="section-dark mt-auto">
      <div className="container-page py-12">
        {/* Top: brand + groups */}
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-[1.6fr_repeat(5,1fr)]">
          {/* Brand block */}
          <div className="max-w-xs">
            <div className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="grid h-6 w-6 place-items-center rounded-md text-[13px] font-extrabold"
                style={{ background: "#fff", color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
              >
                No
              </span>
              <span className="text-[1.1rem] font-extrabold text-white" style={{ fontFamily: "var(--font-display)" }}>
                AI Directory
              </span>
            </div>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-white/70">
              {dict.site.description}
            </p>
            <p className="mt-3 text-[0.92rem] font-semibold text-white/90" style={{ fontFamily: "var(--font-display)" }}>
              {dict.site.slogan}
            </p>
          </div>

          {/* Link groups — desktop columns */}
          <div className="hidden md:contents">
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-[0.78rem] font-semibold uppercase tracking-wide text-white/50">
                  {group.title}
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <LocaleLink lang={lang} href={l.href} className="text-[0.92rem] text-white/75 transition-colors hover:text-white">
                        {l.label}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Link groups — mobile accordion */}
          <div className="md:hidden">
            {groups.map((group) => (
              <FooterAccordion key={group.title} lang={lang} group={group} />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.85rem] text-white/55">
            © {year} {dict.site.name}. {dict.site.footerNote}
          </p>
          <ul className="flex gap-4">
            {socialLinks.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="text-[0.85rem] text-white/70 transition-colors hover:text-white"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterAccordion({ lang, group }: { lang: Locale; group: NavGroup }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-white/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3.5 text-left"
      >
        <span className="text-[0.82rem] font-semibold uppercase tracking-wide text-white/70">{group.title}</span>
        <ChevronDown className={`text-white/60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="pb-3 space-y-2.5">
          {group.links.map((l) => (
            <li key={l.href}>
              <LocaleLink lang={lang} href={l.href} className="text-[0.92rem] text-white/75">
                {l.label}
              </LocaleLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
