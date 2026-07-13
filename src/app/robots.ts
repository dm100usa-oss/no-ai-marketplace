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

  const disallow = [
    "/payment-success",
    "/payment-cancelled",
    "/thank-you",
    "/profile-submitted",
    "/profile-suspended",
    "/profile-not-available",
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
