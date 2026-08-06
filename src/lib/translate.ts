/**
 * Translating what the author wrote, once, at publishing time.
 *
 * The directory is international, and the two halves of a page come from
 * different places. Everything the platform says — headings, buttons, the
 * introduction, the working-process list — is written by hand in both
 * languages and always has been. What the author says — their story, their
 * services, the captions under their works and stages — arrives in one
 * language only, whichever form they filled in.
 *
 * Until now that half was simply printed as it came, so an English visitor
 * met a Russian paragraph in the middle of an English page. Hiding it
 * instead would have been worse: a directory whose whole promise is that
 * anyone can be found by anyone cannot answer half its visitors with less
 * of the page.
 *
 * So it is translated. This is what the large marketplaces do — Airbnb has
 * its own words translated by people and its hosts' words by machine — and
 * it is the only arrangement that costs neither the owner nor the author
 * anything.
 *
 * Two rules shape the code below, and both come from the same worry: a
 * translation service is somebody else's machine.
 *
 * - It is called once, when a submission is approved, and the result is
 *   kept with the submission. Pages read what is stored. If the service
 *   disappears tomorrow, every profile already published is untouched.
 *
 * - It can never break anything. A failure, a timeout, an exhausted daily
 *   allowance all end the same way: no translation is stored, and the page
 *   falls back to the original text. A profile that reads oddly in one
 *   language is a small thing; an approval that fails because a translator
 *   was busy is not.
 */

/** The languages the catalog speaks. Adding one here is most of the work
 *  of adding it to this file. */
export type TextLocale = "en" | "ru";

/** The author's own words, the fields worth translating. Everything else
 *  on a profile is either a name, a link, a picture, or a word the site
 *  already knows in both languages. */
export interface TranslatableText {
  shortDescription?: string;
  fullDescription?: string;
  services?: string[];
  galleryCaptions?: string[];
  stageCaptions?: string[];
}

/** MyMemory refuses anything longer than 500 bytes in one go, so long
 *  answers are cut into pieces and put back together. The limit is on
 *  bytes, not letters, and Russian spends two bytes per letter, so the
 *  cut is measured the way the service measures it. */
const MAX_BYTES = 450;

function byteLength(s: string): number {
  return new TextEncoder().encode(s).length;
}

/** Split on sentence ends, keeping the punctuation, then group the pieces
 *  into chunks that fit. Sentences are the right seam: cutting mid-phrase
 *  gives the translator half a thought and it answers with half a
 *  sentence. A single sentence too long to fit is cut on spaces, which is
 *  rare and still better than a refusal. */
function chunk(text: string): string[] {
  const sentences = text.match(/[^.!?\n]+[.!?]*\s*|\n+/g) ?? [text];
  const out: string[] = [];
  let current = "";

  const pushWordwise = (long: string) => {
    let part = "";
    for (const word of long.split(/(\s+)/)) {
      if (byteLength(part + word) > MAX_BYTES && part) {
        out.push(part);
        part = "";
      }
      part += word;
    }
    if (part.trim()) out.push(part);
  };

  for (const s of sentences) {
    if (byteLength(s) > MAX_BYTES) {
      if (current.trim()) out.push(current);
      current = "";
      pushWordwise(s);
      continue;
    }
    if (byteLength(current + s) > MAX_BYTES && current) {
      out.push(current);
      current = "";
    }
    current += s;
  }
  if (current.trim()) out.push(current);
  return out.filter((c) => c.trim().length > 0);
}

interface MyMemoryReply {
  responseStatus?: number | string;
  responseData?: { translatedText?: string };
}

/**
 * One piece of text, translated, or undefined if anything went wrong.
 *
 * MYMEMORY_EMAIL is optional and raises the daily allowance from five
 * thousand words to fifty thousand. No account, no key, no card: the
 * address is simply passed along with the request.
 */
async function translateChunk(
  text: string,
  from: TextLocale,
  to: TextLocale,
): Promise<string | undefined> {
  const params = new URLSearchParams({
    q: text,
    langpair: `${from}|${to}`,
  });
  const email = process.env.MYMEMORY_EMAIL;
  if (email) params.set("de", email);

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?${params.toString()}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return undefined;
    const data = (await res.json()) as MyMemoryReply;
    if (Number(data.responseStatus) !== 200) return undefined;
    const out = data.responseData?.translatedText;
    if (typeof out !== "string" || out.trim() === "") return undefined;
    // The service answers its own error messages in the translation field
    // rather than in the status, and they arrive shouting in capitals.
    if (/^[A-Z ':.,]+$/.test(out) && out.length > 30) return undefined;
    return out;
  } catch {
    return undefined;
  }
}

/** A whole field, however long. Undefined if any piece failed, because
 *  half a translated paragraph is worse than none. */
async function translateText(
  text: string | undefined,
  from: TextLocale,
  to: TextLocale,
): Promise<string | undefined> {
  const source = (text ?? "").trim();
  if (!source) return undefined;

  const pieces = chunk(source);
  const out: string[] = [];
  for (const piece of pieces) {
    const done = await translateChunk(piece, from, to);
    if (done === undefined) return undefined;
    out.push(done);
  }
  return out.join("").trim() || undefined;
}

/** A list of short lines — services, captions. Each line is translated on
 *  its own so the order and the count stay exactly as the author left
 *  them: caption three has to remain caption three. A line that fails
 *  keeps its original, which is the least bad outcome for a caption. */
async function translateList(
  list: string[] | undefined,
  from: TextLocale,
  to: TextLocale,
): Promise<string[] | undefined> {
  if (!list || list.length === 0) return undefined;
  const out: string[] = [];
  for (const line of list) {
    if (!line.trim()) {
      out.push(line);
      continue;
    }
    out.push((await translateText(line, from, to)) ?? line);
  }
  return out;
}

/**
 * Everything the author wrote, in the other language.
 *
 * Returns undefined when there was nothing to translate or when the
 * description — the one field a profile really needs — could not be
 * done. Partial results are kept otherwise: captions are decoration,
 * the story is not.
 */
export async function translateAuthorText(
  text: TranslatableText,
  from: TextLocale,
  to: TextLocale,
): Promise<TranslatableText | undefined> {
  if (from === to) return undefined;

  const shortDescription = await translateText(text.shortDescription, from, to);
  if (text.shortDescription && !shortDescription) return undefined;

  const [fullDescription, services, galleryCaptions, stageCaptions] = [
    await translateText(text.fullDescription, from, to),
    await translateList(text.services, from, to),
    await translateList(text.galleryCaptions, from, to),
    await translateList(text.stageCaptions, from, to),
  ];

  const result: TranslatableText = {
    shortDescription,
    fullDescription,
    services,
    galleryCaptions,
    stageCaptions,
  };

  const anything = Object.values(result).some(
    (v) => v !== undefined && (Array.isArray(v) ? v.length > 0 : v !== ""),
  );
  return anything ? result : undefined;
}
