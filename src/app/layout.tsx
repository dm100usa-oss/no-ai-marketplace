import type { Metadata } from "next";
import { site } from "@/lib/config";

/**
 * Root layout is a thin pass-through. The real <html>/<body> shell lives
 * in [lang]/layout.tsx so the lang attribute is a static route value and
 * every page can be prerendered per language (no dynamic headers() call).
 *
 * metadataBase and the default icons live here so they apply site-wide,
 * including the framework 404.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
