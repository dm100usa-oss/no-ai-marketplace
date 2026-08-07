"use client";

import { useState } from "react";
import type { Review, Submission } from "@/lib/redis";
import { categories } from "@/data/categories";
import { categoriesRu } from "@/i18n/data/categories.ru";
import { categorySlugFromName } from "@/lib/category-lookup";
import { countryNameL } from "@/lib/country-name";

/**
 * The moderation screen.
 *
 * Interface text is hardcoded English on purpose: this page is for the
 * owner, not for visitors, and putting forty admin strings into both
 * dictionaries would mean maintaining translations nobody reads.
 *
 * The password is held in component state and sent as a header with each
 * call. It is not written to localStorage: closing the tab logs out, which
 * for a page opened a few times a month is the right trade.
 */

type Status = "approved" | "rejected" | "pending";

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={14} height={14} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.35l-5.8 3.05 1.1-6.47-4.7-4.58 6.5-.95z"
            fill={i <= n ? "#e8a33d" : "transparent"}
            stroke={i <= n ? "#c9832a" : "var(--color-line)"}
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

const STATUS_COLOR: Record<Status, string> = {
  pending: "#8a6d1f",
  approved: "#2f6b45",
  rejected: "#8a3a32",
};

export function AdminClient() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  /** What the converter said about each submission, keyed by id. Filled by
   *  the server so the screen can warn before a decision, not after. */
  const [readiness, setReadiness] = useState<
    Record<string, { problem?: string; missingMembers?: string[] }>
  >({});
  const [tab, setTab] = useState<"profiles" | "reviews">("profiles");
  const [busy, setBusy] = useState(false);
  /**
   * Which single button is working right now, as "id:action".
   *
   * Everything used to hang on one flag, so one slow call — the
   * translator can take ten seconds — greyed out every button on the
   * screen at once, with nothing to say why. The owner read that as the
   * page having frozen, and pressed other buttons that could not respond.
   */
  const [running, setRunning] = useState<string | null>(null);
  /** The result of the last action, shown on the card it belongs to.
   *  The message used to appear at the top of the page, out of sight of
   *  whoever had just pressed a button halfway down it. */
  const [cardNote, setCardNote] = useState<{ id: string; text: string; ok: boolean } | null>(
    null,
  );
  /** Show the author's own words, or their translation.
   *
   *  A card shows the language the form was filled in, which is the one
   *  language the owner does not need to check: the question at review
   *  time is always whether the other one reads properly. */
  const [showTranslated, setShowTranslated] = useState(false);
  /** The submission whose delete button is waiting for a second click.
   *  Deletion is final, so one stray tap must not wipe an application. */
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load(pw: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reviews", {
        headers: { "x-admin-password": pw },
      });
      if (res.status === 401) {
        setError("Wrong password, or ADMIN_PASSWORD is not set in Vercel.");
        setBusy(false);
        return;
      }
      const data = await res.json();
      setReviews(data.reviews ?? []);

      // The join queue rides on the same password. A failure here must not
      // lock the reviews screen: an empty list is better than no page.
      try {
        const sres = await fetch("/api/admin/submissions", {
          headers: { "x-admin-password": pw },
        });
        if (sres.ok) {
          const sdata = await sres.json();
          setSubmissions(sdata.submissions ?? []);
          setReadiness(sdata.readiness ?? {});
        }
      } catch {
        /* leave submissions as they were */
      }

      setAuthed(true);
    } catch {
      setError("Не удалось связаться с сервером.");
    }
    setBusy(false);
  }

  /** Publish or reject one join request. */
  async function decideSubmission(id: string, status: "published" | "rejected") {
    setRunning(`${id}:${status}`);
    setCardNote(null);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        await load(password);
        setCardNote({
          id,
          ok: true,
          text: status === "published" ? "Заявка одобрена, письмо отправлено." : "Заявка отклонена.",
        });
      } else {
        setCardNote({ id, ok: false, text: "Не удалось сохранить решение." });
      }
    } catch {
      setCardNote({ id, ok: false, text: "Не удалось связаться с сервером." });
    }
    setRunning(null);
  }

  /** Remove a submission for good. No letter is sent. */
  async function removeSubmission(id: string) {
    setRunning(`${id}:delete`);
    setCardNote(null);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, action: "delete" }),
      });
      if (res.ok) {
        setConfirmDelete(null);
        await load(password);
      } else {
        setCardNote({ id, ok: false, text: "Не удалось удалить заявку." });
      }
    } catch {
      setCardNote({ id, ok: false, text: "Не удалось связаться с сервером." });
    }
    setRunning(null);
  }

  /** Grant a verification badge and notify the author. */
  async function verifySubmission(
    id: string,
    verification: "verified-creator" | "verified-business",
  ) {
    setRunning(`${id}:${verification}`);
    setCardNote(null);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, verification }),
      });
      if (res.ok) {
        await load(password);
        setCardNote({ id, ok: true, text: "Знак выдан, письмо автору отправлено." });
      } else {
        setCardNote({ id, ok: false, text: "Не удалось выдать знак." });
      }
    } catch {
      setCardNote({ id, ok: false, text: "Не удалось связаться с сервером." });
    }
    setRunning(null);
  }

  /** Translate the author's words again.
   *
   *  The translation is normally made once, at approval, and that one
   *  attempt can fail without anybody noticing: the free service has a
   *  daily ceiling and the profile then sits in one language on both
   *  sites. This is the way back. Says plainly whether it worked, because
   *  the alternative is opening the other language's page and guessing. */
  async function retranslate(id: string) {
    setRunning(`${id}:translate`);
    setCardNote(null);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, action: "translate" }),
      });
      const out = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (res.ok && out?.ok) {
        await load(password);
        setCardNote({ id, ok: true, text: "Перевод готов." });
      } else {
        setCardNote({
          id,
          ok: false,
          text: "Переводчик не ответил. Попробуйте через несколько минут.",
        });
      }
    } catch {
      setCardNote({ id, ok: false, text: "Не удалось связаться с сервером." });
    }
    setRunning(null);
  }

  /** Work out the field colour again for one profile. */
  async function recolor(id: string) {
    setRunning(`${id}:cover`);
    setCardNote(null);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, action: "cover" }),
      });
      const out = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (res.ok && out?.ok) {
        await load(password);
        setCardNote({ id, ok: true, text: "Цвет фона обновлен." });
      } else {
        setCardNote({ id, ok: false, text: "Не удалось прочитать картинку." });
      }
    } catch {
      setCardNote({ id, ok: false, text: "Не удалось связаться с сервером." });
    }
    setRunning(null);
  }

  async function decide(id: string, status: "approved" | "rejected") {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        // Reload rather than patch in place: the list is short and this
        // guarantees the screen matches what is actually stored.
        await load(password);
        return;
      }
      setError("Не удалось сохранить решение.");
    } catch {
      setError("Не удалось связаться с сервером.");
    }
    setBusy(false);
  }

  if (!authed) {
    return (
      <div className="section">
        <div className="container-page max-w-sm">
          <h1
            className="text-[1.5rem] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            Модерация
          </h1>
          <div className="mt-5 space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") load(password);
              }}
              placeholder="Пароль"
              className="w-full rounded-xl border px-4 py-3 text-[0.95rem]"
              style={{ borderColor: "var(--color-line)", background: "#fff" }}
            />
            <button
              type="button"
              onClick={() => load(password)}
              disabled={busy || password.length === 0}
              className="btn btn-accent btn-full disabled:opacity-60"
            >
              {busy ? "Проверяю..." : "Войти"}
            </button>
            {error && (
              <p className="text-[0.9rem]" style={{ color: "#b4342a" }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const pending = reviews.filter((r) => r.status === "pending");
  const decided = reviews.filter((r) => r.status !== "pending");

  const fmt = new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  function Card({ review, actions }: { review: Review; actions: boolean }) {
    return (
      <li
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--color-line)", background: "#fff" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2.5">
            <span className="font-semibold" style={{ color: "var(--color-ink)" }}>
              {review.name}
            </span>
            <Stars n={review.rating} />
            <span
              className="rounded-full px-2 py-0.5 text-[0.7rem] font-semibold uppercase"
              style={{
                background: "var(--color-brand-soft)",
                color: STATUS_COLOR[review.status],
              }}
            >
              {review.status}
            </span>
          </span>
          <span className="text-[0.75rem]" style={{ color: "var(--color-muted-soft)" }}>
            {review.lang.toUpperCase()} · {fmt.format(new Date(review.createdAt))}
          </span>
        </div>

        <p
          className="mt-2 whitespace-pre-line text-[0.95rem] leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          {review.text}
        </p>

        {actions && (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => decide(review.id, "approved")}
              disabled={busy}
              className="btn btn-accent disabled:opacity-60"
            >
              Одобрить
            </button>
            <button
              type="button"
              onClick={() => decide(review.id, "rejected")}
              disabled={busy}
              className="btn btn-quiet disabled:opacity-60"
            >
              Отклонить
            </button>
          </div>
        )}
      </li>
    );
  }

  /** One join request, with everything the author filled in. */
  /** Two taps to delete: the first arms the button, the second removes the
   *  submission. A single misplaced tap should never lose an application,
   *  and a browser confirm box on a phone is easy to dismiss by accident. */
  function DeleteButton({ id }: { id: string }) {
    const armed = confirmDelete === id;
    const working = running === `${id}:delete`;
    return (
      <button
        type="button"
        onClick={() => (armed ? removeSubmission(id) : setConfirmDelete(id))}
        disabled={working}
        className="btn btn-quiet disabled:opacity-60"
        style={armed && !working ? { color: "#b4342a", borderColor: "#b4342a" } : undefined}
      >
        {working ? "Удаляю..." : armed ? "Точно удалить?" : "Удалить"}
      </button>
    );
  }

  /**
   * A plain-Russian warning for a submission that will not turn into a
   * profile as it stands. Silence means it is fine.
   */
  function readinessNote(s: Submission): string | null {
    const r = readiness[s.id];
    if (!r) return null;

    if (r.problem === "unknown-category") {
      return `Категория «${s.mainCategory ?? ""}» не найдена в каталоге. Профиль не создастся, пока категория не будет исправлена.`;
    }
    if (r.problem === "team-too-small") {
      const who = r.missingMembers?.length
        ? ` Нет профилей у: ${r.missingMembers.join(", ")}.`
        : "";
      return `В команде пока только контактное лицо. Команда появится в каталоге, когда хотя бы у одного участника будет свой профиль.${who}`;
    }
    if (r.missingMembers?.length) {
      return `Участники без профиля: ${r.missingMembers.join(", ")}. В списке команды они будут показаны без ссылки и не попадут в счет участников.`;
    }
    return null;
  }

  function SubmissionCard({ s, actions }: { s: Submission; actions: boolean }) {
    const note = readinessNote(s);
    // Which language this card is showing. The translation exists only on
    // published submissions and only when the translator answered, so the
    // switch quietly falls back to the original rather than emptying the
    // card.
    const other = s.lang === "ru" ? "en" : "ru";
    const t = showTranslated ? s.translations?.[other] : undefined;

    /**
     * A category as it is written in the language being shown.
     *
     * The form sends the category as a word, in the applicant's own
     * language. The catalog knows both spellings already, so the card can
     * simply look the other one up: showing "Children's Writers" next to
     * an English description instead of leaving a Russian word stranded
     * in the middle of an otherwise translated card.
     */
    const categoryIn = (name: string | undefined, lang: "en" | "ru") => {
      if (!name) return name;
      const slug = categorySlugFromName(name);
      if (!slug) return name;
      const hit =
        lang === "ru"
          ? categoriesRu[slug]?.name
          : categories.find((c) => c.slug === slug)?.name;
      return hit ?? name;
    };

    const lang = showTranslated ? other : s.lang === "ru" ? "ru" : "en";
    const shown = {
      shortDescription: t?.shortDescription ?? s.shortDescription,
      fullDescription: t?.fullDescription ?? s.fullDescription,
      services: t?.services ?? s.services,
      // These three are not translated by a machine and do not depend on
      // the translation existing: the category is looked up, the country
      // is a code underneath, and the town is whatever the author typed
      // into the second-language field.
      mainCategory: categoryIn(s.mainCategory, lang),
      additionalCategories: s.additionalCategories?.map((c) => categoryIn(c, lang) ?? c),
      city: showTranslated ? s.cityAlt || s.city : s.city,
      country: countryNameL(s.country, lang) ?? s.country,
      name: showTranslated ? s.nameAlt || s.name : s.name,
    };
    const missingTranslation = showTranslated && !s.translations?.[other];
    // Work 1 now stays inside the gallery rather than being lifted out of
    // it, so listing it separately as well would show it twice and put
    // every following number one off the form the author filled in.
    const works = s.gallery?.length
      ? s.gallery
      : s.mainImage
        ? [s.mainImage]
        : [];
    const pics = [
      ...(s.avatar ? [{ label: "Фото", url: s.avatar }] : []),
      ...works.map((u, i) => ({ label: `Работа ${i + 1}`, url: u })),
    ];

    return (
      <li
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--color-line)", background: "#fff" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex flex-wrap items-center gap-2.5">
            <span className="font-semibold" style={{ color: "var(--color-ink)" }}>
              {shown.name}
            </span>
            {s.profileType && s.profileType !== "creator" && (
              <span
                className="rounded-full px-2 py-0.5 text-[0.7rem] font-semibold uppercase"
                style={{ background: "var(--color-brand-soft)", color: "var(--color-ink)" }}
              >
                {s.profileType === "team" ? "команда" : "компания"}
              </span>
            )}
            <span
              className="rounded-full px-2 py-0.5 text-[0.7rem] font-semibold uppercase"
              style={{
                background: "var(--color-brand-soft)",
                color:
                  s.status === "published"
                    ? "#2f6b45"
                    : s.status === "rejected"
                      ? "#b4342a"
                      : "var(--color-muted)",
              }}
            >
              {s.status === "published" ? "опубликован" : s.status === "rejected" ? "отклонен" : "ожидает"}
            </span>
            {s.showOnHomepage && (
              <span className="text-[0.75rem]" style={{ color: "#2f6b45" }}>
                можно на главную
              </span>
            )}
            {s.status === "published" && (
              <span
                className="text-[0.75rem]"
                style={{ color: s.emailConfirmed ? "#2f6b45" : "#8a6d1f" }}
              >
                {s.emailConfirmed ? "почта подтверждена" : "почта не подтверждена"}
              </span>
            )}
            {/* Whether the author's own words exist in the other
                language. Only meaningful once published, since that is
                when the translation is made. */}
            {s.status === "published" &&
              (() => {
                const to = s.lang === "ru" ? "en" : "ru";
                const has = !!s.translations?.[to];
                return (
                  <span
                    className="text-[0.75rem]"
                    style={{ color: has ? "#2f6b45" : "#8a6d1f" }}
                  >
                    {has ? "перевод есть" : "перевода нет"}
                  </span>
                );
              })()}
            {s.verification && s.verification !== "none" && (
              <span
                className="rounded-full px-2 py-0.5 text-[0.7rem] font-semibold uppercase"
                style={{ background: "#dff1e9", color: "#157a58" }}
              >
                {s.verification === "verified-business"
                  ? "проверенный бизнес"
                  : "проверенный автор"}
              </span>
            )}
          </span>
          <span className="text-[0.75rem]" style={{ color: "var(--color-muted-soft)" }}>
            {fmt.format(new Date(s.createdAt))}
          </span>
        </div>

        {note && (
          <p
            className="mt-3 rounded-xl border px-3 py-2 text-[0.82rem]"
            style={{
              borderColor: "var(--color-line)",
              background: "var(--color-surface-soft, #fff8e6)",
              color: "var(--color-ink)",
            }}
          >
            {note}
          </p>
        )}

        <p className="mt-2 text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
          {[shown.mainCategory, [shown.city, shown.country].filter(Boolean).join(", ")]
            .filter(Boolean)
            .join(" · ")}
        </p>

        {shown.additionalCategories?.length ? (
          <p className="mt-1 text-[0.8rem]" style={{ color: "var(--color-muted-soft)" }}>
            {showTranslated && other === "en" ? "also" : "также"}: {shown.additionalCategories.join(", ")}
          </p>
        ) : null}

        {(shown.services?.length || s.foundedYear) && (
          <p className="mt-1 text-[0.8rem]" style={{ color: "var(--color-muted-soft)" }}>
            {[
              s.foundedYear ? `с ${s.foundedYear} года` : "",
              shown.services?.length ? shown.services.join(" · ") : "",
            ]
              .filter(Boolean)
              .join(" — ")}
          </p>
        )}

        {(shown.shortDescription || shown.fullDescription) && (
          <p
            className="mt-2 whitespace-pre-line text-[0.95rem] leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            {shown.shortDescription ?? shown.fullDescription}
          </p>
        )}

        {missingTranslation && (
          <p className="mt-2 text-[0.8rem]" style={{ color: "#8a6d1f" }}>
            Перевода нет, показан текст автора.
          </p>
        )}

        {(s.members?.length || s.contactPerson) && (
          <div className="mt-2 text-[0.85rem]" style={{ color: "var(--color-muted)" }}>
            {s.members?.length ? (
              <ul className="list-inside list-disc">
                {s.members.map((m, i) => (
                  <li key={i} className="break-all">
                    {m}
                  </li>
                ))}
              </ul>
            ) : null}
            {s.contactPerson ? (
              <p className="mt-1" style={{ color: "var(--color-muted-soft)" }}>
                Контактное лицо: {s.contactPerson}
              </p>
            ) : null}
          </div>
        )}

        {(s.email || s.website || s.otherLinks) && (
          <p
            className="mt-2 break-all text-[0.8rem]"
            style={{ color: "var(--color-muted-soft)" }}
          >
            {[s.email, s.website, s.otherLinks].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* The photo and the works, shown rather than linked.
            A decision to publish is a decision about the pictures, and it
            cannot be made from a row of words that each need a new tab.
            Each thumbnail still opens the full size in one. */}
        {pics.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {pics.map((p) => (
              <a
                key={p.url}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl border"
                style={{ borderColor: "var(--color-line)" }}
                title={p.label}
              >
                <span
                  className="block aspect-[4/3]"
                  style={{
                    backgroundColor: "var(--color-brand-soft)",
                    backgroundImage: `url("${p.url}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <span
                  className="block px-2 py-1 text-[0.72rem]"
                  style={{ color: "var(--color-muted)" }}
                >
                  {p.label}
                </span>
              </a>
            ))}
          </div>
        )}

        {actions && (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => decideSubmission(s.id, "published")}
              disabled={running === `${s.id}:published`}
              className="btn btn-accent disabled:opacity-60"
            >
              {running === `${s.id}:published` ? "Публикую..." : "Опубликовать"}
            </button>
            <button
              type="button"
              onClick={() => decideSubmission(s.id, "rejected")}
              disabled={running === `${s.id}:rejected`}
              className="btn btn-quiet disabled:opacity-60"
            >
              {running === `${s.id}:rejected` ? "Отклоняю..." : "Отклонить"}
            </button>
            <DeleteButton id={s.id} />
          </div>
        )}

        {/* Verification is granted after publishing, once the author has
            sent extra materials. Shown on decided (published) profiles that
            do not already carry a badge. */}
        {/* Everything that can be done to a submission already decided.
            Verification is granted after publishing, once the author has
            sent extra materials, so those two are offered only on a
            published profile without a badge. Translating again is
            offered on any published profile, whether or not one exists:
            a bad translation is as much a reason to run it as a missing
            one. */}
        {!actions && (
          <div className="mt-4 flex flex-wrap gap-2">
            {s.status === "published" &&
              (!s.verification || s.verification === "none") && (
                <>
                  <button
                    type="button"
                    onClick={() => verifySubmission(s.id, "verified-creator")}
                    disabled={running === `${s.id}:verified-creator`}
                    className="btn btn-quiet disabled:opacity-60"
                  >
                    {running === `${s.id}:verified-creator`
                      ? "Выдаю знак..."
                      : "Выдать знак «Проверенный автор»"}
                  </button>
                  <button
                    type="button"
                    onClick={() => verifySubmission(s.id, "verified-business")}
                    disabled={running === `${s.id}:verified-business`}
                    className="btn btn-quiet disabled:opacity-60"
                  >
                    {running === `${s.id}:verified-business`
                      ? "Выдаю знак..."
                      : "Выдать знак «Проверенный бизнес»"}
                  </button>
                </>
              )}
            {s.status === "published" && (
              <button
                type="button"
                onClick={() => recolor(s.id)}
                disabled={running === `${s.id}:cover`}
                className="btn btn-quiet disabled:opacity-60"
              >
                {running === `${s.id}:cover` ? "Считаю цвет..." : "Обновить цвет фона"}
              </button>
            )}
            {s.status === "published" && (
              <button
                type="button"
                onClick={() => retranslate(s.id)}
                disabled={running === `${s.id}:translate`}
                className="btn btn-quiet disabled:opacity-60"
              >
                {running === `${s.id}:translate` ? "Перевожу..." : "Перевести заново"}
              </button>
            )}
            <DeleteButton id={s.id} />
          </div>
        )}

        {cardNote?.id === s.id && (
          <p
            className="mt-3 text-[0.85rem]"
            style={{ color: cardNote.ok ? "#2f6b45" : "#b4342a" }}
          >
            {cardNote.text}
          </p>
        )}
      </li>
    );
  }

  const subPending = submissions.filter((s) => s.status === "pending");
  const subDecided = submissions.filter((s) => s.status !== "pending");

  return (
    <div className="section">
      <div className="container-page max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <h1
            className="text-[1.5rem] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            Модерация
          </h1>
          <button
            type="button"
            onClick={() => load(password)}
            disabled={busy}
            className="btn btn-quiet disabled:opacity-60"
          >
            Обновить
          </button>
        </div>

        {error && (
          <p className="mt-3 text-[0.9rem]" style={{ color: "#b4342a" }}>
            {error}
          </p>
        )}

        {/* Two queues, one screen. Profiles first: a waiting author is
            more urgent than a waiting review. */}
        <div className="mt-5 flex gap-2">
          {(["profiles", "reviews"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="rounded-full px-4 py-1.5 text-[0.85rem] font-semibold capitalize"
              style={
                tab === t
                  ? { background: "var(--color-ink)", color: "#fff" }
                  : { background: "var(--color-brand-soft)", color: "var(--color-ink)" }
              }
            >
              {t === "profiles" ? "Профили" : "Отзывы"} ({t === "profiles" ? subPending.length : pending.length})
            </button>
          ))}
        </div>

        {tab === "profiles" ? (
          <>
            {/* Which language the cards are read in. The form's own
                language is the one the owner already trusts; the question
                at review time is whether the other one reads properly. */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
                Показывать тексты:
              </span>
              {([false, true] as const).map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => setShowTranslated(v)}
                  className="rounded-full px-3 py-1 text-[0.8rem] font-semibold"
                  style={
                    showTranslated === v
                      ? { background: "var(--color-ink)", color: "#fff" }
                      : {
                          background: "var(--color-brand-soft)",
                          color: "var(--color-ink)",
                        }
                  }
                >
                  {v ? "перевод" : "как заполнено"}
                </button>
              ))}
            </div>

            <h2 className="mt-7 font-semibold" style={{ color: "var(--color-ink)" }}>
              Ожидают ({subPending.length})
            </h2>
            {subPending.length === 0 ? (
              <p className="mt-2 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
                Новых профилей нет.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {subPending.map((s) => (
                  <SubmissionCard key={s.id} s={s} actions />
                ))}
              </ul>
            )}

            {subDecided.length > 0 && (
              <>
                <h2 className="mt-9 font-semibold" style={{ color: "var(--color-ink)" }}>
                  Рассмотрены ({subDecided.length})
                </h2>
                <ul className="mt-3 space-y-3">
                  {subDecided.map((s) => (
                    <SubmissionCard key={s.id} s={s} actions={false} />
                  ))}
                </ul>
              </>
            )}
          </>
        ) : (
          <>
            <h2 className="mt-7 font-semibold" style={{ color: "var(--color-ink)" }}>
              Ожидают ({pending.length})
            </h2>
            {pending.length === 0 ? (
              <p className="mt-2 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
                Новых отзывов нет.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {pending.map((r) => (
                  <Card key={r.id} review={r} actions />
                ))}
              </ul>
            )}

            {decided.length > 0 && (
              <>
                <h2 className="mt-9 font-semibold" style={{ color: "var(--color-ink)" }}>
                  Рассмотрены ({decided.length})
                </h2>
                <ul className="mt-3 space-y-3">
                  {decided.map((r) => (
                    <Card key={r.id} review={r} actions={false} />
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
