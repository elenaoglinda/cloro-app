// Frontmatter schema for posts in src/content/blog/*.md.
// Validated by the Vite blog plugin: an invalid post fails the dev server and the build.
// Keep this file importable from Node (no `@/` aliases, no asset imports).
import { z } from "zod";
import { BLOG_AUTHOR_IDS } from "./authors";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Usa el formato AAAA-MM-DD (ej. 2026-09-23)")
  .refine((s) => !Number.isNaN(Date.parse(s)), "Fecha no válida");

const text = (min: number, max: number) =>
  z.string().trim().min(min, `Mínimo ${min} caracteres`).max(max, `Máximo ${max} caracteres`);

export const faqSchema = z.object({
  question: text(10, 200),
  answer: text(20, 1200),
});

export const frontmatterSchema = z
  .object({
    title: text(20, 110),
    /** Shorter title for <title> and search results. Defaults to `title`. */
    seoTitle: text(20, 60).optional(),
    /** Meta description: shown in Google results and social cards. */
    description: text(70, 160),
    date: isoDate,
    /** Last meaningful content update. Defaults to `date`. */
    updated: isoDate.optional(),
    author: z.enum(BLOG_AUTHOR_IDS),
    tags: z.array(text(2, 40)).min(1).max(5),
    keywords: z.array(text(2, 80)).min(2).max(12),
    /** File name inside src/assets/blog/. */
    cover: z
      .string()
      .regex(/^[\w.-]+\.(jpe?g|png|webp|avif)$/i, "Nombre de archivo de imagen no válido"),
    coverAlt: text(10, 180),
    /** Short summary shown at the top of the post and used as the AI/featured snippet. */
    tldr: text(80, 700),
    faqs: z.array(faqSchema).min(2, "Añade al menos 2 preguntas frecuentes").max(10),
    /** Drafts are visible with `vite dev` but excluded from production builds. */
    draft: z.boolean().default(false),
  })
  .strict()
  .refine((d) => !d.updated || d.updated >= d.date, {
    message: "`updated` no puede ser anterior a `date`",
    path: ["updated"],
  });

export type BlogFrontmatter = z.infer<typeof frontmatterSchema>;
export type BlogFaq = z.infer<typeof faqSchema>;
