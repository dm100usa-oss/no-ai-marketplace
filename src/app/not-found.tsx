import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page section">
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-[3.5rem] font-extrabold leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--color-brand)" }}>
          404
        </p>
        <h1 className="mt-2 text-[1.5rem]">Page not found</h1>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          This page doesn&apos;t exist or was moved. Try the directory or search from the top.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href="/" className="btn btn-ink">Go home</Link>
          <Link href="/directory" className="btn btn-quiet">Browse directory</Link>
        </div>
      </div>
    </div>
  );
}
