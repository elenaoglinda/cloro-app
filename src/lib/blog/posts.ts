import rawPosts, { bodies, type RawBlogPost } from "virtual:blog-posts";
import { BLOG_AUTHORS, type BlogAuthor, type BlogAuthorId } from "./authors";
import { slugify } from "./markdown";

export type BlogPost = RawBlogPost & {
  authorInfo: BlogAuthor & { id: BlogAuthorId };
};

export type BlogTag = { name: string; slug: string; count: number };

/** All published posts, newest first. */
export const BLOG_POSTS: BlogPost[] = rawPosts
  .map((p) => ({ ...p, authorInfo: { id: p.author, ...BLOG_AUTHORS[p.author] } }))
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** Loads the markdown body of a post (split into its own chunk). */
export async function getPostBody(slug: string): Promise<string> {
  const load = bodies[slug];
  if (!load) throw new Error(`No body for blog post "${slug}"`);
  return (await load()).default;
}

export function tagSlug(tag: string): string {
  return slugify(tag);
}

export function getAllTags(): BlogTag[] {
  const tags = new Map<string, BlogTag>();
  for (const post of BLOG_POSTS) {
    for (const name of post.tags) {
      const slug = tagSlug(name);
      const tag = tags.get(slug) ?? { name, slug, count: 0 };
      tag.count += 1;
      tags.set(slug, tag);
    }
  }
  return [...tags.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getTagBySlug(slug: string): BlogTag | undefined {
  return getAllTags().find((t) => t.slug === slug);
}

export function getPostsByTag(slug: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.tags.some((t) => tagSlug(t) === slug));
}

/** Posts sharing the most tags with `post`, then the most recent ones. */
export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const own = new Set(post.tags.map(tagSlug));
  return BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .map((p, index) => ({ p, index, score: p.tags.filter((t) => own.has(tagSlug(t))).length }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ p }) => p);
}

export function formatPostDate(date: string): string {
  // Parse as UTC midnight so the day never shifts with the viewer's timezone.
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
