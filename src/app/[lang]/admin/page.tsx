import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { AdminClient } from "@/components/AdminClient";

/**
 * Moderation.
 *
 * The page itself is public and holds nothing: every list and every
 * decision is fetched from /api/admin/reviews with the password attached,
 * and that route checks it server-side each time. Reaching this URL
 * without the password shows an empty login box and nothing else.
 *
 * noindex here and disallowed in robots. Not a security measure — the API
 * is what protects the data — but there is no reason for it to sit in a
 * search index.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <AdminClient />;
}
