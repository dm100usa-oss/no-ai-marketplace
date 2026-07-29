import { NextRequest, NextResponse } from "next/server";
import { addSubmission, type Submission } from "@/lib/redis";

/**
 * Where a finished Tally form lands.
 *
 * Tally is set, in its own dashboard, to send each completed submission to
 * this address as a webhook (Integrations → Webhooks → this URL). The form
 * stays on Tally — pretty, spam-filtered, easy to edit — and the answer
 * quietly arrives here and joins the moderation queue, exactly like a
 * review does.
 *
 * Nothing published here goes straight to the catalog. Every arrival is
 * stored as pending and waits for a yes or no in /admin, then for the
 * author to confirm their address. This door only fills the queue.
 *
 * Tally's payload wraps the answers in data.fields[], each with a label
 * and a value. Labels are whatever the form author wrote, so we match them
 * loosely by keyword rather than by an exact string, and anything we do
 * not recognise is kept in `extra` rather than dropped.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Optional shared secret. Set TALLY_WEBHOOK_SECRET in Vercel and add the
 *  same value to the Tally webhook URL as ?secret=... to refuse anything
 *  that is not from your form. Unset: the door accepts any well-formed
 *  submission, which is fine to start with. */
function secretOk(request: NextRequest): boolean {
  const expected = process.env.TALLY_WEBHOOK_SECRET;
  if (!expected) return true;
  const given = request.nextUrl.searchParams.get("secret") ?? "";
  return given === expected;
}

interface TallyField {
  label?: string;
  key?: string;
  type?: string;
  value?: unknown;
}

/** A field's value as trimmed text, or undefined. Tally sends most values
 *  as strings; multi-selects arrive as arrays, which we join. */
function fieldText(value: unknown): string | undefined {
  if (typeof value === "string") {
    const t = value.trim();
    return t.length > 0 ? t : undefined;
  }
  if (Array.isArray(value)) {
    const parts = value
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .filter((v) => v.length > 0);
    return parts.length > 0 ? parts.join(", ") : undefined;
  }
  if (typeof value === "number") return String(value);
  return undefined;
}

/** Labels of the caption questions.
 *
 *  "description" stands alone here on purpose: the English forms number
 *  their captions "Work 1 description", so the number sits in the middle
 *  and "work description" never matches as one piece. Every caption in
 *  every form ends in this word, and no other question does, so matching
 *  it alone is both safe and the only thing that works. */
const CAPTION_WORDS = ["описание работ", "description", "caption", "подпись"];

/** Find the first field whose label contains any of the keywords.
 *
 *  `skip` exists because the caption questions sit next to the picture
 *  questions and read alike: "Work 2" and "Work 2 caption" both contain
 *  "work". Without the exclusion a caption could be read as an image link
 *  or as the short description, depending on the order the form sends. */
function pick(
  fields: TallyField[],
  keywords: string[],
  skip: string[] = [],
): string | undefined {
  for (const f of fields) {
    const label = (f.label ?? f.key ?? "").toLowerCase();
    if (skip.some((k) => label.includes(k))) continue;
    if (keywords.some((k) => label.includes(k))) {
      const t = fieldText(f.value);
      if (t) return t;
    }
  }
  return undefined;
}

/** Collect every field whose label matches, in the order the form sends
 *  them. The captions arrive as four separate questions, one per work, so
 *  they cannot be read with pick, which stops at the first answer. */
function pickEach(fields: TallyField[], keywords: string[]): string[] | undefined {
  const out: string[] = [];
  for (const f of fields) {
    const label = (f.label ?? f.key ?? "").toLowerCase();
    if (keywords.some((k) => label.includes(k))) {
      out.push(fieldText(f.value)?.trim() ?? "");
    }
  }
  while (out.length > 0 && out[out.length - 1] === "") out.pop();
  return out.length > 0 ? out : undefined;
}

/** The numbered picture questions: "Работа 1 (главная)", "Work 2" and so
 *  on, in the order the form sends them.
 *
 *  Matching the bare word was not enough. "Tell us about your company and
 *  work" also contains it, and being the earlier question it was picked as
 *  the main image, so a company's headline work became a paragraph of
 *  text. The number is what makes a work question a work question, so the
 *  number is what we match on, and the captions are excluded because they
 *  are numbered too. */
function pickWorks(fields: TallyField[]): string[] {
  const out: string[] = [];
  for (const f of fields) {
    const label = (f.label ?? f.key ?? "").toLowerCase();
    if (CAPTION_WORDS.some((k) => label.includes(k))) continue;
    if (!/(работа|work)\s*\d/.test(label)) continue;
    out.push(fieldText(f.value)?.trim() ?? "");
  }
  return out;
}

/** Split a picked value into a list on commas and newlines. */
function pickList(
  fields: TallyField[],
  keywords: string[],
  skip: string[] = [],
): string[] | undefined {
  const s = pick(fields, keywords, skip);
  if (!s) return undefined;
  const out = s
    .split(/[\n,]+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
  return out.length > 0 ? out : undefined;
}

export async function POST(request: NextRequest) {
  if (!secretOk(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Tally nests the answers under data.fields; accept a flat fields[] too.
  const root = (body ?? {}) as Record<string, unknown>;
  const dataObj = (root.data ?? root) as Record<string, unknown>;
  const fields: TallyField[] = Array.isArray(dataObj.fields)
    ? (dataObj.fields as TallyField[])
    : [];

  if (fields.length === 0) {
    return NextResponse.json({ ok: false, error: "no fields" }, { status: 400 });
  }

  // Hidden fields we pass through the form: type and lang. They arrive as
  // ordinary fields, matched by their exact key first, then by label.
  const typeRaw =
    pick(fields, ["type", "тип"]) ?? pick(fields, ["creator", "team", "company"]);
  const profileType =
    typeRaw === "team" || typeRaw === "company"
      ? typeRaw
      : typeRaw === "creator"
        ? "creator"
        : "creator";

  const langRaw = pick(fields, ["lang", "язык", "language"]);
  const lang = langRaw === "ru" ? "ru" : "en";

  const name = pick(fields, ["name", "имя", "название"]);
  if (!name) {
    return NextResponse.json({ ok: false, error: "name required" }, { status: 400 });
  }

  const works = pickWorks(fields);

  const input: Omit<Submission, "id" | "createdAt" | "status"> = {
    name,
    lang,
    email: pick(fields, ["email", "почта", "e-mail"]),
    country: pick(fields, ["country", "страна"]),
    city: pick(fields, ["city", "город"]),
    profileType,
    mainCategory: pick(fields, ["category", "категория"]),
    additionalCategories: pickList(fields, ["additional", "дополнит"]),
    // "Расскажите о компании и вашей работе" / "Tell us about the team and
    // your work" is the one story field in every form, so it is matched by
    // its opening words as well. Without them the whole self-description
    // arrived empty and had to be copied over by hand.
    shortDescription: pick(
      fields,
      ["short", "краткое", "about", "описание", "расскажите", "tell us"],
      CAPTION_WORDS,
    ),
    /** Year the company started working. Company forms only. */
    foundedYear: pick(fields, ["год начала", "in business since", "founded", "established"]),
    /** What they offer, one per line. The profile introduction is assembled
     *  from these, so an empty list makes a profile open thin. */
    services: pickList(fields, ["услуг", "services"]),
    fullDescription: pick(fields, ["full", "подробн", "detail"], CAPTION_WORDS),
    website: pick(fields, ["website", "сайт", "url"]),
    otherLinks: pick(fields, ["link", "ссылк", "social", "portfolio"]),
    // "Логотип компании" and "Company Logo" carry neither the word photo
    // nor avatar, so without these two the logo never arrived at all.
    avatar: pick(fields, ["avatar", "photo", "фото", "portrait", "logo", "логотип"]),
    // Work 1 is the headline picture, the rest form the gallery, in the
    // order the author put them in.
    mainImage: works[0] || undefined,
    gallery: works.slice(1).filter((w) => w !== "").length
      ? works.slice(1)
      : undefined,
    galleryCaptions: pickEach(fields, CAPTION_WORDS),
    members: pickEach(fields, ["участник", "team member", "member "]),
    contactPerson: pick(fields, ["контактное лицо", "contact person"]),
    showOnHomepage:
      (pick(fields, ["homepage", "главн", "showcase"]) ?? "").toLowerCase().includes("yes") ||
      (pick(fields, ["homepage", "главн", "showcase"]) ?? "").toLowerCase().includes("да"),
  };

  const done = await addSubmission(input);
  return NextResponse.json({ ok: done.ok }, { status: done.ok ? 200 : 500 });
}
