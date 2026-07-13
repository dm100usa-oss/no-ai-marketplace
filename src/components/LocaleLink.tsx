import Link from "next/link";
import type { ComponentProps } from "react";
import { localizedPath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/**
 * A Link that automatically prefixes internal paths with the current
 * locale (clean paths for the default language, /ru/... for Russian).
 *
 * Pass canonical, unprefixed hrefs like "/pricing" or "/creators/x" and
 * the current `lang`; external links and in-page anchors (#form) are left
 * as-is. This keeps every page's link code locale-agnostic.
 */
export function LocaleLink({
  lang,
  href,
  ...rest
}: { lang: Locale; href: string } & Omit<ComponentProps<typeof Link>, "href">) {
  return <Link href={localizeHref(lang, href)} {...rest} />;
}

/** Resolve a canonical href to a locale-aware href. */
export function localizeHref(lang: Locale, href: string): string {
  if (
    href.startsWith("http") ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }
  // Split off a hash so "/join#form" localizes the path part only.
  const [path, hash] = href.split("#");
  const localized = localizedPath(lang, path || "/");
  return hash ? `${localized}#${hash}` : localized;
}
