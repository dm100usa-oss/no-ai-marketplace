import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProfiles, getProfile } from "@/lib/data";
import { site } from "@/lib/config";
import { ProfileView } from "@/components/ProfileView";

/** Static pages for companies only. */
export function generateStaticParams() {
  return getAllProfiles()
    .filter((p) => p.profileType === "company")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProfile(slug);
  if (!p) return {};
  const title = p.seoTitle ?? `${p.name}`;
  const description = p.seoDescription ?? p.shortDescription;
  return {
    title,
    description,
    alternates: { canonical: `/companies/${p.slug}` },
    openGraph: { title, description, url: `${site.url}/companies/${p.slug}`, type: "profile" },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProfile(slug);
  if (!p || p.profileType !== "company") notFound();
  return <ProfileView profile={p} />;
}
