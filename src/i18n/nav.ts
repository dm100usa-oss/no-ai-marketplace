import type { Dictionary } from "@/i18n/types";

/**
 * Navigation built from the dictionary. Paths are canonical and
 * unprefixed; labels come from the current language's dictionary. The
 * LocaleLink / localizeHref layer adds the /ru prefix at render time.
 *
 * This replaces the old hardcoded English nav arrays so the header and
 * footer are fully translated with no duplicated structure.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export function primaryNav(dict: Dictionary): NavLink[] {
  return [
    { label: dict.nav.directory, href: "/directory" },
    { label: dict.nav.categories, href: "/categories" },
    { label: dict.nav.verified, href: "/verified" },
    { label: dict.nav.pricing, href: "/pricing" },
    { label: dict.nav.about, href: "/about" },
  ];
}

export function footerNav(dict: Dictionary): NavGroup[] {
  return [
    {
      title: dict.footer.explore,
      links: [
        { label: dict.footer.directory, href: "/directory" },
        { label: dict.footer.allCategories, href: "/categories" },
        { label: dict.footer.directions, href: "/directions" },
        { label: dict.footer.verifiedProfiles, href: "/verified" },
      ],
    },
    {
      title: dict.footer.forCreators,
      links: [
        { label: dict.footer.addYourProfile, href: "/join" },
        { label: dict.footer.pricing, href: "/pricing" },
        { label: dict.footer.humanMadeStandards, href: "/human-made-standards" },
        { label: dict.footer.verification, href: "/verified" },
      ],
    },
    {
      title: dict.footer.project,
      links: [
        { label: dict.footer.about, href: "/about" },
        { label: dict.footer.contact, href: "/contact" },
      ],
    },
    {
      title: dict.footer.legal,
      links: [
        { label: dict.footer.privacy, href: "/privacy" },
        { label: dict.footer.terms, href: "/terms" },
        { label: dict.footer.listingPolicy, href: "/listing-policy" },
        { label: dict.footer.verificationPolicy, href: "/verification-policy" },
        { label: dict.footer.refundPolicy, href: "/refund-policy" },
        { label: dict.footer.contentRemoval, href: "/content-removal" },
        { label: dict.footer.copyrightComplaint, href: "/copyright-complaint" },
      ],
    },
  ];
}
