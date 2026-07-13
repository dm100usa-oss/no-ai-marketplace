"use client";

import { useState } from "react";

/**
 * Report form (TZ Etap 4). Kept intentionally simple: no backend on early
 * stages — the details go through a mailto so the owner can act on them,
 * with a graceful fallback if the browser can't open the mail client.
 * When wiring to a real endpoint later, only the submit handler changes.
 */
export function ReportForm({
  profileName,
  profileSlug,
}: {
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
    // Open the user's mail client; no data leaves the browser otherwise.
    window.location.href = `mailto:hello@no-ai-marketplace.example?subject=${subject}&body=${body}`;
    setStatus("sent");
  };

  if (!open) {
    return (
      <div
        className="rounded-xl border p-4 text-[0.9rem]"
        style={{ borderColor: "var(--color-line)", color: "var(--color-muted)" }}
      >
        Something wrong with this profile?{" "}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-semibold"
          style={{ color: "var(--color-accent)" }}
        >
          Report a problem
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
        Thanks — your mail client should have opened with the report ready to send.
        We review every report by hand.
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border p-5"
      style={{ borderColor: "var(--color-line)" }}
    >
      <h3 className="text-[1.05rem]">Report a problem</h3>
      <p className="mt-1 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
        Tell us what looks wrong. We read every report and act by hand.
      </p>

      <label className="mt-4 block text-[0.85rem] font-semibold" style={{ color: "var(--color-muted)" }}>
        Reason
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="select mt-1.5"
        >
          <option value="misuse-of-ai">Suspected misuse of AI</option>
          <option value="wrong-info">Wrong information on the profile</option>
          <option value="impersonation">Impersonation or stolen identity</option>
          <option value="broken-links">Broken or misleading links</option>
          <option value="copyright">Copyright complaint</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="mt-4 block text-[0.85rem] font-semibold" style={{ color: "var(--color-muted)" }}>
        Details
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          placeholder="What did you notice? Any evidence we should look at?"
          className="mt-1.5 w-full rounded-lg border px-3 py-2 text-[0.95rem] outline-none focus:border-[var(--color-accent)]"
          style={{ borderColor: "var(--color-line)" }}
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="submit" className="btn btn-ink">
          Send report
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn btn-quiet"
        >
          Cancel
        </button>
      </div>
      <p className="mt-3 text-[0.8rem]" style={{ color: "var(--color-muted-soft)" }}>
        Your mail client opens with the report ready to send. We do not track submissions inside this form.
      </p>
    </form>
  );
}
