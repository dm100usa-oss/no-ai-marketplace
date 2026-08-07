/**
 * The colour of the field a work sits in.
 *
 * A catalog needs one frame for every card, or the rows stop lining up.
 * But a work that does not fill that frame leaves a band of empty space,
 * and empty white bands are the single thing that made the page look
 * twenty years old. Cropping fixes the bands and cuts the work instead,
 * which is the one thing a directory built on respect for makers should
 * not do.
 *
 * So the band is not empty. It is painted in the work's own colour, a
 * pale version of it, and the name underneath sits on the same colour.
 * A blue cover gets a blue field, a red one a red field: the card reads
 * as one object with the work resting inside it, and nothing is cut.
 *
 * Worked out once, when the application is approved, and kept with the
 * profile. Nothing is computed while anybody is looking at a page.
 */

/** What the field is set to, whatever the work is like.
 *
 *  The first attempt simply mixed the average colour towards white by a
 *  fixed amount. That works for a dark picture and fails for a light
 *  one: a pale blue cover averaged to something a shade off white, and
 *  the field became the empty band this whole idea exists to avoid. So
 *  the hue is kept and the lightness is set outright, which gives every
 *  card a field of the same weight no matter whose work is in it. */
const FIELD_LIGHTNESS = 0.9;
/** A grey picture should still give a grey field, but a colourful one
 *  must not give a washed-out grey: below the floor the tint stops
 *  reading as a colour at all, above the ceiling it starts competing
 *  with the work. */
const MIN_SATURATION = 0.12;
const MAX_SATURATION = 0.4;

/** Anything larger is not worth downloading to read one pixel out of. */
const MAX_BYTES = 12 * 1024 * 1024;

function toHsl(r: number, g: number, b: number): [number, number, number] {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === R) h = ((G - B) / d + (G < B ? 6 : 0)) / 6;
  else if (max === G) h = ((B - R) / d + 2) / 6;
  else h = ((R - G) / d + 4) / 6;
  return [h, s, l];
}

function toRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t: number) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [
    Math.round(channel(h + 1 / 3) * 255),
    Math.round(channel(h) * 255),
    Math.round(channel(h - 1 / 3) * 255),
  ];
}

/** Below this there is no colour to speak of, and forcing one on gives a
 *  black and white drawing a faintly pink field for no reason. */
const ACHROMATIC = 0.05;

function fieldHex(r: number, g: number, b: number): string {
  const [h, s] = toHsl(r, g, b);
  if (s < ACHROMATIC) return "#e9e9ec";
  const sat = Math.max(MIN_SATURATION, Math.min(MAX_SATURATION, s));
  const [R, G, B] = toRgb(h, sat, FIELD_LIGHTNESS);
  return `#${[R, G, B]
    .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
    .join("")}`;
}

/**
 * The pale field colour for one work, as `#rrggbb`.
 *
 * Returns undefined rather than throwing, on every possible failure: a
 * missing address, a picture that will not download, a format the
 * resizer does not know, or an environment without the resizer at all.
 * A profile with no colour simply gets the site's neutral field, which
 * is what every profile had before this existed.
 */
export async function coverColor(url: string | undefined): Promise<string | undefined> {
  if (!url || !/^https?:\/\//i.test(url)) return undefined;

  try {
    // Loaded on demand. The resizer ships with the framework rather than
    // with this project, so a build without it must degrade to a neutral
    // field instead of failing.
    const sharp = (await import("sharp")).default;

    const res = await fetch(url);
    if (!res.ok) return undefined;

    const length = Number(res.headers.get("content-length") ?? 0);
    if (length > MAX_BYTES) return undefined;

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > MAX_BYTES) return undefined;

    // One pixel is the whole point: resizing to 1x1 averages the picture,
    // which is a better field colour than any single sampled point.
    // Flattened onto white first, so a transparent PNG does not average
    // its own emptiness into the result.
    const { data } = await sharp(buf)
      .flatten({ background: "#ffffff" })
      .resize(1, 1, { fit: "cover" })
      .raw()
      .toBuffer({ resolveWithObject: true });

    if (data.length < 3) return undefined;
    return fieldHex(data[0], data[1], data[2]);
  } catch {
    return undefined;
  }
}
