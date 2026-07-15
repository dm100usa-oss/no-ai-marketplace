import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // The former "Human-Made standards" page was folded into "Our method".
  // Redirect the old URLs (both languages) so old links and search engines
  // land on the new page instead of a 404.
  async redirects() {
    return [
      { source: "/human-made-standards", destination: "/method", permanent: true },
      { source: "/ru/human-made-standards", destination: "/ru/method", permanent: true },
    ];
  },
  // Cache headers for files served straight out of /public.
  //
  // Next only fingerprints what it builds itself (/_next/static), and gives
  // everything in /public a max-age of 0. That means a returning visitor
  // re-validates every image on the page: the bytes come back as a 304, but
  // the round trip still happens, once per file. On the home page that is 61
  // requests for nothing.
  //
  // Images here are content, not code: the file at a given name never changes,
  // a new photo gets a new name. So they can be cached hard. Anything whose
  // contents can change under a fixed name (llms.txt, the manifest, favicons)
  // gets a short max-age plus stale-while-revalidate instead: served instantly
  // from cache, refreshed in the background.
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:file(llms.txt|site.webmanifest|favicon.ico|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|android-chrome-192x192.png|android-chrome-512x512.png)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
