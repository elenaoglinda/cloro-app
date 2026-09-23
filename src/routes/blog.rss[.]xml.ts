import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BLOG_POSTS } from "@/lib/blog/posts";
import {
  BLOG_DESCRIPTION,
  BLOG_NAME,
  RSS_PATH,
  SITE_URL,
  absoluteUrl,
  postPath,
} from "@/lib/blog/seo";

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const rfc822 = (date: string) => new Date(`${date}T08:00:00Z`).toUTCString();

export const Route = createFileRoute("/blog/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const items = BLOG_POSTS.map((p) => {
          const url = absoluteUrl(postPath(p.slug));
          return [
            "    <item>",
            `      <title>${escapeXml(p.title)}</title>`,
            `      <link>${url}</link>`,
            `      <guid isPermaLink="true">${url}</guid>`,
            `      <pubDate>${rfc822(p.date)}</pubDate>`,
            `      <dc:creator>${escapeXml(p.authorInfo.name)}</dc:creator>`,
            ...p.tags.map((t) => `      <category>${escapeXml(t)}</category>`),
            `      <description>${escapeXml(p.description)}</description>`,
            `      <content:encoded>${escapeXml(
              `<p><img src="${absoluteUrl(p.cover)}" alt="${escapeXml(p.coverAlt)}" /></p><p>${escapeXml(p.tldr)}</p>`,
            )}</content:encoded>`,
            "    </item>",
          ].join("\n");
        });
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">`,
          "  <channel>",
          `    <title>${escapeXml(BLOG_NAME)}</title>`,
          `    <link>${SITE_URL}/blog</link>`,
          `    <description>${escapeXml(BLOG_DESCRIPTION)}</description>`,
          "    <language>es-ES</language>",
          `    <atom:link href="${absoluteUrl(RSS_PATH)}" rel="self" type="application/rss+xml" />`,
          ...(BLOG_POSTS[0]
            ? [`    <lastBuildDate>${rfc822(BLOG_POSTS[0].updated)}</lastBuildDate>`]
            : []),
          ...items,
          "  </channel>",
          "</rss>",
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
