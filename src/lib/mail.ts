/**
 * The one place that sends email.
 *
 * Four letters, each in English and Russian:
 *   welcome  — approved, please confirm your address (carries the link)
 *   rejected — we cannot list your materials at this time
 *   verified — your profile now carries the Verified badge
 *   (confirmation itself is a page, not a letter — see /[lang]/confirm)
 *
 * HOW IT STAYS SILENT UNTIL YOU ARE READY
 *
 * Nothing is sent unless two environment variables are set in Vercel:
 *
 *   RESEND_API_KEY   — the key from resend.com (starts with "re_")
 *   MAIL_FROM        — the from-address on your own domain, e.g.
 *                      "No AI Directory <hello@your-domain.com>"
 *
 * With either one missing, every send here quietly does nothing and
 * reports success, so the admin screen and the site behave exactly as they
 * do today. Fill both in once the domain and Resend are connected and the
 * letters start going out on their own — no code change needed.
 *
 * A send never throws. A mail that fails to leave is logged and swallowed:
 * a letter is worth a retry, never a broken admin action or a 500 for the
 * visitor who just confirmed their address.
 */

import { site } from "./config";

type Locale = "en" | "ru";

/** en for anything that is not explicitly ru. */
function lang(locale: string | undefined): Locale {
  return locale === "ru" ? "ru" : "en";
}

/** The public base the confirmation link is built on. Prefers an explicit
 *  SITE_URL (set this to the live domain in Vercel), falls back to the URL
 *  in config so links are never broken, only pointed at the temp address. */
function baseUrl(): string {
  return (process.env.SITE_URL || site.url).replace(/\/$/, "");
}

/** The path a Russian visitor's links carry; English lives at the root. */
function localePrefix(locale: Locale): string {
  return locale === "ru" ? "/ru" : "";
}

interface Letter {
  subject: string;
  /** Plain text — kept simple and universally deliverable. */
  text: string;
  /** A light HTML version of the same words, for clients that show it. */
  html: string;
}

/* ------------------------------------------------------------------ */
/* The letters                                                         */
/* ------------------------------------------------------------------ */

function welcomeLetter(locale: Locale, confirmUrl: string): Letter {
  if (locale === "ru") {
    const lines = [
      "Здравствуйте!",
      "",
      "Благодарим вас за заявку. Ваша работа прошла проверку, и мы рады пригласить вас в No AI Directory — каталог специалистов, создающих работы без использования генеративного ИИ.",
      "",
      "Чтобы завершить размещение, подтвердите адрес электронной почты по ссылке ниже. Сразу после этого ваш профиль появится в каталоге.",
      "",
      confirmUrl,
      "",
      "Вы среди первых участников платформы. Для первых пятидесяти профилей размещение бесплатно до конца 2026 года. После этого для вас сохранится сниженная цена как для одного из первых участников. Пока действует бесплатный период, ваш профиль отмечен значком «Первый в категории».",
      "",
      "Вы также можете получить значок «Проверенный автор» или «Проверенный бизнес». Для этого пришлите дополнительные материалы о своей работе — мы рассмотрим их и вернемся с ответом.",
      "",
      "С уважением,",
      "Команда No AI Directory",
    ];
    return {
      subject: "Добро пожаловать в No AI Directory",
      text: lines.join("\n"),
      html: paragraphsToHtml(lines, confirmUrl, "Подтвердить адрес"),
    };
  }
  const lines = [
    "Hello,",
    "",
    "Thank you for your application. Your work has passed our review, and we are glad to invite you to No AI Directory — a catalog of professionals who create their work without the use of generative AI.",
    "",
    "To complete your listing, please confirm your email address using the link below. Your profile will appear in the directory right after that.",
    "",
    confirmUrl,
    "",
    "You are among the first members of the platform. For the first fifty profiles, listing is free until the end of 2026. After that, a reduced price is kept for you as one of our earliest members. While the free period lasts, your profile carries the \"First in category\" badge.",
    "",
    "You can also receive the \"Verified creator\" or \"Verified business\" badge. To do so, send additional materials about your work — we will review them and get back to you.",
    "",
    "Kind regards,",
    "The No AI Directory Team",
  ];
  return {
    subject: "Welcome to No AI Directory",
    text: lines.join("\n"),
    html: paragraphsToHtml(lines, confirmUrl, "Confirm address"),
  };
}

function rejectedLetter(locale: Locale): Letter {
  if (locale === "ru") {
    const lines = [
      "Здравствуйте!",
      "",
      "Благодарим вас за интерес к No AI Directory и за время, которое вы уделили заявке.",
      "",
      "К сожалению, в настоящий момент мы не имеем возможности разместить ваши материалы на платформе. Это не является оценкой вашей работы.",
      "",
      "Будем рады, если вы обратитесь к нам снова по мере развития платформы.",
      "",
      "С уважением,",
      "Команда No AI Directory",
    ];
    return {
      subject: "Ваша заявка в No AI Directory",
      text: lines.join("\n"),
      html: paragraphsToHtml(lines),
    };
  }
  const lines = [
    "Hello,",
    "",
    "Thank you for your interest in No AI Directory and for the time you put into your application.",
    "",
    "Unfortunately, at this time we are not able to list your materials on the platform. This is not a judgment of your work.",
    "",
    "We would be glad to hear from you again as the platform grows.",
    "",
    "Kind regards,",
    "The No AI Directory Team",
  ];
  return {
    subject: "Your application to No AI Directory",
    text: lines.join("\n"),
    html: paragraphsToHtml(lines),
  };
}

function verifiedLetter(
  locale: Locale,
  kind: "verified-creator" | "verified-business",
): Letter {
  if (locale === "ru") {
    const badge = kind === "verified-business" ? "Проверенный бизнес" : "Проверенный автор";
    const lines = [
      "Здравствуйте!",
      "",
      `Мы рассмотрели присланные вами материалы. Ваш профиль в No AI Directory отмечен значком «${badge}».`,
      "",
      "Спасибо за доверие к платформе.",
      "",
      "С уважением,",
      "Команда No AI Directory",
    ];
    return {
      subject: "Ваш профиль получил значок «Проверенный»",
      text: lines.join("\n"),
      html: paragraphsToHtml(lines),
    };
  }
  const badge = kind === "verified-business" ? "Verified business" : "Verified creator";
  const lines = [
    "Hello,",
    "",
    `We have reviewed the materials you sent. Your profile in No AI Directory now carries the "${badge}" badge.`,
    "",
    "Thank you for your trust in the platform.",
    "",
    "Kind regards,",
    "The No AI Directory Team",
  ];
  return {
    subject: 'Your profile now has the "Verified" badge',
    text: lines.join("\n"),
    html: paragraphsToHtml(lines),
  };
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

/** Escape the few characters that would break out of HTML text. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Turn the plain-text lines into a simple, safe HTML letter. Blank lines
 * separate paragraphs. If a button label is given, the line equal to the
 * link URL is rendered as a button instead of a bare address.
 */
function paragraphsToHtml(
  lines: string[],
  linkUrl?: string,
  buttonLabel?: string,
): string {
  const blocks: string[] = [];
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length === 0) return;
    blocks.push(
      `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#2b2b2b;">${buffer
        .map(esc)
        .join("<br>")}</p>`,
    );
    buffer = [];
  };

  for (const line of lines) {
    if (linkUrl && buttonLabel && line === linkUrl) {
      flush();
      blocks.push(
        `<p style="margin:0 0 16px;"><a href="${esc(linkUrl)}" style="display:inline-block;background:#1f1f1f;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-size:15px;">${esc(
          buttonLabel,
        )}</a></p>`,
      );
      continue;
    }
    if (line === "") {
      flush();
    } else {
      buffer.push(line);
    }
  }
  flush();

  return `<div style="max-width:520px;margin:0 auto;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">${blocks.join(
    "",
  )}</div>`;
}

/* ------------------------------------------------------------------ */
/* Sending                                                             */
/* ------------------------------------------------------------------ */

/**
 * Hand one letter to Resend. Returns true when it was accepted (or when
 * mail is intentionally switched off — an unset key is not a failure the
 * caller should react to). Never throws.
 */
async function send(to: string, letter: Letter): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;

  // Not configured yet: do nothing, report success. The site runs exactly
  // as it does today until both values are in place.
  if (!key || !from) return true;
  if (!to) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: letter.subject,
        text: letter.text,
        html: letter.html,
      }),
    });
    if (!res.ok) {
      console.error("mail: resend rejected", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("mail: send failed", err);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Public API — one call per moment                                    */
/* ------------------------------------------------------------------ */

/** Approved: welcome + confirmation link built from the token. */
export async function sendWelcomeEmail(input: {
  to: string | undefined;
  locale: string | undefined;
  token: string;
}): Promise<boolean> {
  if (!input.to) return true;
  const l = lang(input.locale);
  const confirmUrl = `${baseUrl()}${localePrefix(l)}/confirm?token=${encodeURIComponent(
    input.token,
  )}`;
  return send(input.to, welcomeLetter(l, confirmUrl));
}

/** Rejected: the careful, non-committal note. */
export async function sendRejectionEmail(input: {
  to: string | undefined;
  locale: string | undefined;
}): Promise<boolean> {
  if (!input.to) return true;
  return send(input.to, rejectedLetter(lang(input.locale)));
}

/** Verified: the badge is now on the profile. */
export async function sendVerifiedEmail(input: {
  to: string | undefined;
  locale: string | undefined;
  kind: "verified-creator" | "verified-business";
}): Promise<boolean> {
  if (!input.to) return true;
  return send(input.to, verifiedLetter(lang(input.locale), input.kind));
}

/* ------------------------------------------------------------------ */
/* The owner's notice                                                  */
/* ------------------------------------------------------------------ */

/**
 * The one letter that does not go to an applicant. It goes to whoever
 * runs the directory, the moment a form is submitted, so a new
 * submission does not sit unseen in the queue until someone thinks to
 * look. Always in Russian: it is read by the owner, not by the public.
 *
 * Sent to ADMIN_EMAIL. With that unset, nothing is sent and nothing
 * breaks — the submission is stored either way.
 */
function newSubmissionLetter(input: {
  name: string;
  profileType: "creator" | "team" | "company";
  category?: string;
  country?: string;
  city?: string;
}): Letter {
  const typeWord =
    input.profileType === "team"
      ? "команда"
      : input.profileType === "company"
        ? "компания"
        : "автор";

  const where = [input.city, input.country].filter(Boolean).join(", ");
  const adminUrl = `${baseUrl()}/admin`;

  const rows: [string, string][] = [
    ["Имя", input.name],
    ["Тип", typeWord],
    ["Категория", input.category || "не указана"],
    ["Откуда", where || "не указано"],
  ];

  const text = [
    "Пришла новая заявка в каталог.",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    `Посмотреть и решить: ${adminUrl}`,
  ].join("\n");

  const html = `<div style="max-width:520px;margin:0 auto;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#1a1a1a;">
<p>Пришла новая заявка в каталог.</p>
<table style="border-collapse:collapse;margin:16px 0;">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666;">${k}</td><td style="padding:4px 0;">${v}</td></tr>`,
    )
    .join("")}</table>
<p><a href="${adminUrl}" style="display:inline-block;padding:10px 18px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:6px;">Посмотреть и решить</a></p>
</div>`;

  return {
    subject: `Новая заявка: ${input.name}, ${typeWord}`,
    text,
    html,
  };
}

/** A form was just submitted: tell the owner. */
export async function sendNewSubmissionNotice(input: {
  name: string;
  profileType: "creator" | "team" | "company";
  category?: string;
  country?: string;
  city?: string;
}): Promise<boolean> {
  const to = process.env.ADMIN_EMAIL;
  if (!to) return true;
  return send(to, newSubmissionLetter(input));
}
