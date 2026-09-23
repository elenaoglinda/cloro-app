# Blog content

Every blog post is a Markdown file in `src/content/blog/`. The file name is the URL slug:

```
src/content/blog/cloro-combinado-piscina.md  ->  https://cloro.app/blog/cloro-combinado-piscina
```

To write a new post, copy `src/content/blog/_plantilla.md` (it shows every field) and add the cover image to `src/assets/blog/`. Files starting with `_` are never published.

## Frontmatter

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | H1 and headline, 20–110 chars |
| `seoTitle` | no | Shorter `<title>` for Google, max 60 chars |
| `description` | yes | Meta description, 70–160 chars |
| `date` | yes | `YYYY-MM-DD` publication date |
| `updated` | no | Last meaningful update; drives `dateModified`, sitemap `lastmod` and "Actualizado el" |
| `author` | yes | Key from `src/lib/blog/authors.ts` |
| `tags` | yes | 1–5; each tag gets a page at `/blog/tag/<tag>` |
| `keywords` | yes | 2–12 search phrases |
| `cover` / `coverAlt` | yes | File name in `src/assets/blog/` and its alt text |
| `tldr` | yes | Summary box at the top of the post |
| `faqs` | yes | 2–10 `question`/`answer` pairs, rendered as an accordion + `FAQPage` JSON-LD |
| `draft` | no | `true` = visible only in `vite dev` |

The schema lives in `src/lib/blog/schema.ts`. A post that breaks it stops the dev server and the build with a list of the fields to fix.

## What is generated automatically

- Meta tags: title, description, canonical, robots, Open Graph (incl. image size/alt), Twitter card, `article:*`.
- JSON-LD: `BlogPosting`, `FAQPage` and `BreadcrumbList` per post; `Blog`, `CollectionPage` and `ItemList` on `/blog` and tag pages.
- Reading time, word count and a table of contents (from `##` headings, shown when there are 3+).
- Related posts (by shared tags), `/sitemap.xml` entries with `lastmod`, `/blog/rss.xml` and `/llms.txt`.

## How it works

`vite-plugins/blog-content.ts` reads the Markdown files at build time and exposes them as the virtual module `virtual:blog-posts` (metadata) plus one lazily loaded chunk per post body. Pages use the helpers in `src/lib/blog/posts.ts` and `src/lib/blog/seo.ts`.
