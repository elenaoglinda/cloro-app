# Cloro

Marketing site + app for Cloro (pool-maintenance software for Spain), built with TanStack Start on Lovable. Site copy and blog posts are in Spanish (Spain).

## Blog

- Posts are Markdown files in `src/content/blog/<slug>.md`. Read `src/content/README.md` and copy `src/content/blog/_plantilla.md` before writing one.
- Every post needs a TL;DR, 2–10 FAQs and SEO fields; the schema in `src/lib/blog/schema.ts` is enforced at build time.
- Don't put a "Preguntas frecuentes" section in the body — FAQs come from frontmatter.
- Cover images go in `src/assets/blog/`.
- Check a new post with `npm run build` (fails with the list of invalid fields).
