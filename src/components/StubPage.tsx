import Link from "next/link";

/** Simple placeholder page used on stage 1 so nav links are never broken.
 *  Real content arrives on later stages. */
export function StubPage({
  title,
  intro,
  note,
}: {
  title: string;
  intro: string;
  note?: string;
}) {
  return (
    <div className="container-page section">
      <div className="mx-auto max-w-2xl">
        <p className="text-[0.85rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-accent)" }}>
          No AI Marketplace
        </p>
        <h1 className="mt-2">{title}</h1>
        <p className="lead mt-4">{intro}</p>
        {note && (
          <div className="mt-6 rounded-xl border p-4 text-[0.9rem]" style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)", color: "var(--color-muted)" }}>
            {note}
          </div>
        )}
        <div className="mt-8">
          <Link href="/" className="btn btn-quiet">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
