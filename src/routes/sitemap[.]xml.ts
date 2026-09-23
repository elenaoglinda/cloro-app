import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BLOG_POSTS, getAllTags, getPostsByTag } from "@/lib/blog/posts";

const BASE_URL = "https://cloro.app";

const newest = (dates: string[]) => [...dates].sort().at(-1);

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: Array<{
          path: string;
          changefreq: string;
          priority: string;
          lastmod?: string;
        }> = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/contacto", changefreq: "monthly", priority: "0.6" },
          { path: "/comparativa/autocontrolpiscinas", changefreq: "monthly", priority: "0.7" },
          { path: "/comparativa/evisane", changefreq: "monthly", priority: "0.7" },
          { path: "/comparativa/eisi-hotel", changefreq: "monthly", priority: "0.7" },
          { path: "/preguntas-frecuentes", changefreq: "weekly", priority: "0.8" },
          {
            path: "/blog",
            changefreq: "weekly",
            priority: "0.8",
            lastmod: newest(BLOG_POSTS.map((p) => p.updated)),
          },
          ...BLOG_POSTS.map((p) => ({
            path: `/blog/${p.slug}`,
            changefreq: "monthly",
            priority: "0.7",
            lastmod: p.updated,
          })),
          ...getAllTags().map((t) => ({
            path: `/blog/tag/${t.slug}`,
            changefreq: "weekly",
            priority: "0.4",
            lastmod: newest(getPostsByTag(t.slug).map((p) => p.updated)),
          })),
        ];
        const urls = entries.map(
          (e) =>
            `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n${e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : ""}    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
