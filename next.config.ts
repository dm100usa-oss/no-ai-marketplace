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
};

export default nextConfig;
