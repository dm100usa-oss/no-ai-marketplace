import { LocaleLink } from "@/components/LocaleLink";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/config";

/**
 * Localized 404. A not-found component cannot receive route params, and
 * reading request headers here would opt the whole tree into dynamic
 * rendering. So this renders in the default language (English, the site's
 * primary language at the root domain). Russian visitors who hit a bad URL
 * still get working navigation back into the localized site.
 */
export default function NotFound() {
  const dict = getDictionary(DEFAULT_LOCALE);

  return (
    <div className="container-page section">
      <div className="mx-auto max-w-md py-16 text-center">
        <p
          className="text-[3.5rem] font-extrabold leading-none"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-brand)" }}
        >
          404
        </p>
        <h1 className="mt-2 text-[1.5rem]">{dict.notFound.title}</h1>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          {dict.notFound.text}
        </p>
        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <LocaleLink lang={DEFAULT_LOCALE} href="/" className="btn btn-ink">
            {dict.notFound.goHome}
          </LocaleLink>
          <LocaleLink lang={DEFAULT_LOCALE} href="/directory" className="btn btn-quiet">
            {dict.notFound.browseDirectory}
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}
