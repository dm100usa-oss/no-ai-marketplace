/**
 * A country's name in the language of the page.
 *
 * The country is the one fact on a profile that the author does not write
 * but chooses from a list, which makes it the one fact we can honestly
 * show in either language. Everything else they typed stays as they typed
 * it, or is machine translated and marked as such; the country needs
 * neither, because "Канада" and "Canada" are the same entry in the same
 * list and always were.
 *
 * Until now the form's wording was printed as it arrived, so an English
 * page carried "Канада" next to an English address and an English intro.
 *
 * No table of names is kept here. Every browser and every server already
 * ships the full set, in every language, as part of the standard date and
 * number machinery — the same source a phone uses for its own settings
 * screen. We only supply the list of country codes to ask about.
 */

/** ISO 3166-1 alpha-2, the codes the standard machinery answers to. */
const CODES = [
  "AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AX","AZ",
  "BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS",
  "BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN",
  "CO","CR","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE",
  "EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF",
  "GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY","HK","HM",
  "HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM",
  "JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC",
  "LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MF","MG","MH","MK",
  "ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA",
  "NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG",
  "PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW",
  "SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS",
  "ST","SV","SX","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO",
  "TR","TT","TV","TW","TZ","UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI",
  "VN","VU","WF","WS","YE","YT","ZA","ZM","ZW",
] as const;

/** The languages the catalog speaks, for both reading and showing. */
const LANGS = ["en", "ru"] as const;
type Lang = (typeof LANGS)[number];

/**
 * What people actually write, next to the code it means.
 *
 * The standard names are correct and sometimes nobody uses them: in
 * Russian the United States is officially "Соединенные Штаты" and every
 * living person writes "США". Forms also carry old habits and short
 * forms. These are read in addition to the standard names, never instead
 * of them.
 */
const ALIASES: Record<string, string> = {
  "сша": "US",
  "штаты": "US",
  "соединенные штаты америки": "US",
  "usa": "US",
  "u.s.": "US",
  "u.s.a.": "US",
  "united states of america": "US",
  "uk": "GB",
  "u.k.": "GB",
  "англия": "GB",
  "великобритания": "GB",
  "англия (великобритания)": "GB",
  "эмираты": "AE",
  "оаэ": "AE",
  "uae": "AE",
  "чехия": "CZ",
  "южная корея": "KR",
  "северная корея": "KP",
  "молдова": "MD",
  "молдавия": "MD",
  "беларусь": "BY",
  "белоруссия": "BY",
  "нидерланды": "NL",
  "голландия": "NL",
  "holland": "NL",
};

/**
 * Names we show instead of the standard one.
 *
 * Same reason as the aliases, the other way round: a Russian page that
 * says "Соединенные Штаты" reads like a document, not like a person.
 */
const PREFERRED: Partial<Record<Lang, Record<string, string>>> = {
  ru: {
    US: "США",
    GB: "Великобритания",
    AE: "ОАЭ",
  },
};

/** Comparable form: case, spacing and the Russian ё all levelled out. */
function key(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function displayNames(lang: Lang): Intl.DisplayNames | undefined {
  try {
    return new Intl.DisplayNames([lang], { type: "region" });
  } catch {
    return undefined;
  }
}

/** name (in any of our languages) → code. Built once, on first use. */
let lookup: Map<string, string> | undefined;

function buildLookup(): Map<string, string> {
  const map = new Map<string, string>();

  for (const lang of LANGS) {
    const names = displayNames(lang);
    if (!names) continue;
    for (const code of CODES) {
      let name: string | undefined;
      try {
        name = names.of(code);
      } catch {
        name = undefined;
      }
      if (name && name !== code) map.set(key(name), code);
    }
  }

  // Aliases last, so a short form always wins over a formal one.
  for (const [alias, code] of Object.entries(ALIASES)) map.set(key(alias), code);

  // The codes themselves, in case a form ever sends one.
  for (const code of CODES) map.set(key(code), code);

  return map;
}

/**
 * The country code behind whatever the form sent, or undefined when the
 * text matches nothing. Undefined is not a failure: an author may have
 * typed a region, a city or a joke, and none of those should be silently
 * turned into a country.
 */
export function countryCode(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (!lookup) lookup = buildLookup();
  return lookup.get(key(value));
}

/**
 * The country as this page should say it.
 *
 * Falls back to the original text whenever the country is not recognised,
 * so nothing is ever lost: an unfamiliar wording keeps showing exactly
 * what the author chose.
 */
export function countryNameL(
  value: string | undefined,
  lang: string,
): string | undefined {
  if (!value) return value;
  const code = countryCode(value);
  if (!code) return value;

  const l: Lang = lang === "ru" ? "ru" : "en";
  const preferred = PREFERRED[l]?.[code];
  if (preferred) return preferred;

  const names = displayNames(l);
  try {
    return names?.of(code) ?? value;
  } catch {
    return value;
  }
}
