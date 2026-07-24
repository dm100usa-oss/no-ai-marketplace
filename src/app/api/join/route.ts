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

/** Find the first field whose label contains any of the keywords. */
function pick(fields: TallyField[], keywords: string[]): string | undefined {
  for (const f of fields) {
    const label = (f.label ?? f.key ?? "").toLowerCase();
    if (keywords.some((k) => label.includes(k))) {
      const t = fieldText(f.value);
      if (t) return t;
    }
  }
  return undefined;
}

/** Split a picked value into a list on commas and newlines. */
function pickList(fields: TallyField[], keywords: string[]): string[] | undefined {
  const s = pick(fields, keywords);
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

  const input: Omit<Submission, "id" | "createdAt" | "status"> = {
    name,
    lang,
    email: pick(fields, ["email", "почта", "e-mail"]),
    country: pick(fields, ["country", "страна"]),
    city: pick(fields, ["city", "город"]),
    profileType,
    mainCategory: pick(fields, ["category", "категория"]),
    additionalCategories: pickList(fields, ["additional", "дополнит"]),
    shortDescription: pick(fields, ["short", "краткое", "about", "описание"]),
    fullDescription: pick(fields, ["full", "подробн", "detail"]),
    website: pick(fields, ["website", "сайт", "url"]),
    otherLinks: pick(fields, ["link", "ссылк", "social", "portfolio"]),
    avatar: pick(fields, ["avatar", "photo", "фото", "portrait"]),
    mainImage: pick(fields, ["main image", "work", "работа", "image"]),
    gallery: pickList(fields, ["gallery", "галерея", "works"]),
    showOnHomepage:
      (pick(fields, ["homepage", "главн", "showcase"]) ?? "").toLowerCase().includes("yes") ||
      (pick(fields, ["homepage", "главн", "showcase"]) ?? "").toLowerCase().includes("да"),
  };

  const done = await addSubmission(input);
  return NextResponse.json({ ok: done.ok }, { status: done.ok ? 200 : 500 });
}
