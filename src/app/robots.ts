import type { MetadataRoute } from "next";
import { site } from "@/lib/config";

/**
 * robots.txt (TZ 5.3 / stage 6). The growth strategy is ranking inside
 * AI answers, so the major AI crawlers are named explicitly and allowed,
 * alongside a permissive default rule. Payment and status pages are
 * disallowed from crawling (they are also noindex at the page level).
 */
export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");

  const noindexPaths = [
    "/payment-success",
    "/payment-cancelled",
    "/thank-you",
    "/profile-submitted",
    "/profile-suspended",
    "/profile-not-available",
    // Owner-only. The API behind it checks the password on every call;
    // this just keeps the page out of the index.
    "/admin",
  ];

  // Outbound links go through /api/go/... so the professionals' own
  // addresses are not printed into the pages. Disallowing the path keeps
  // well-behaved crawlers from simply following each one to collect what
  // the page no longer states.
  const disallowAlways = ["/api/"];

  // Disallow both the English (clean) and Russian (/ru) variants.
  const disallow = [
    ...noindexPaths,
    ...noindexPaths.map((p) => `/ru${p}`),
    ...disallowAlways,
  ];

  // Major AI answer engines and their crawlers (TZ 1.5: ChatGPT, Claude,
  // Perplexity, Gemini) plus classic search bots.
  const aiAndSearchBots = [
    "GPTBot", // OpenAI training
    "OAI-SearchBot", // OpenAI / ChatGPT search
    "ChatGPT-User", // ChatGPT browsing on user request
    "ClaudeBot", // Anthropic
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot", // Perplexity
    "Perplexity-User",
    "Google-Extended", // Gemini / Bard data
    "Googlebot",
    "Bingbot",
    "Applebot",
    "Applebot-Extended",
    "DuckDuckBot",
    "Amazonbot",
    "Bytespider",
    "CCBot", // Common Crawl (feeds many models)
    "cohere-ai",
    "Meta-ExternalAgent",
    "YandexBot",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...aiAndSearchBots.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
