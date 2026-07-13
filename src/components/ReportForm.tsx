"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/types";

/**
 * Report form. Kept intentionally simple: no backend — the details go
 * through a mailto so the owner can act on them. When wiring to a real
 * endpoint later, only the submit handler changes.
 */
export function ReportForm({
  dict,
  profileName,
  profileSlug,
}: {
  dict: Dictionary;
  profileName: string;
  profileSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("misuse-of-ai");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Report: ${profileName}`);
    const body = encodeURIComponent(
      `Reported profile: ${profileName}\nProfile URL: ${profileSlug}\n\nReason: ${reason}\n\nDetails:\n${details.trim() || "(none)"}\n`,
    );
    window.location.href = `mailto:hello@no-ai-marketplace.example?subject=${subject}&body=${body}`;
    setStatus("sent");
  };

  if (!open) {
    return (
      <div
        className="rounded-xl border p-4 text-[0.9rem]"
        style={{ borderColor: "var(--color-line)", color: "var(--color-muted)" }}
      >
        {dict.report.prompt}{" "}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-semibold"
          style={{ color: "var(--color-accent)" }}
        >
          {dict.report.reportProblem}
        </button>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div
        className="rounded-xl border p-4 text-[0.95rem]"
        style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)", color: "var(--color-muted)" }}
      >
        {dict.report.sentThanks}
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border p-5"
      style={{ borderColor: "var(--color-line)" }}
    >
      <h3 className="text-[1.05rem]">{dict.report.title}</h3>
      <p className="mt-1 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
        {dict.report.subtitle}
      </p>

      <label className="mt-4 block text-[0.85rem] font-semibold" style={{ color: "var(--color-muted)" }}>
        {dict.report.reason}
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="select mt-1.5"
        >
          <option value="misuse-of-ai">{dict.report.reasonMisuse}</option>
          <option value="wrong-info">{dict.report.reasonWrongInfo}</option>
          <option value="impersonation">{dict.report.reasonImpersonation}</option>
          <option value="broken-links">{dict.report.reasonBrokenLinks}</option>
          <option value="copyright">{dict.report.reasonCopyright}</option>
          <option value="other">{dict.report.reasonOther}</option>
        </select>
      </label>

      <label className="mt-4 block text-[0.85rem] font-semibold" style={{ color: "var(--color-muted)" }}>
        {dict.report.details}
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          placeholder={dict.report.detailsPlaceholder}
          className="mt-1.5 w-full rounded-lg border px-3 py-2 text-[0.95rem] outline-none focus:border-[var(--color-accent)]"
          style={{ borderColor: "var(--color-line)" }}
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="submit" className="btn btn-ink">
          {dict.report.sendReport}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn btn-quiet"
        >
          {dict.report.cancel}
        </button>
      </div>
      <p className="mt-3 text-[0.8rem]" style={{ color: "var(--color-muted-soft)" }}>
        {dict.report.footNote}
      </p>
    </form>
  );
}
