// Blog authors. A post's `author` frontmatter field must be one of these keys.
// Keep this file free of imports: it is also loaded by the Vite blog plugin.

export type BlogAuthor = {
  name: string;
  /** schema.org type. Use "Person" for named writers. */
  type: "Organization" | "Person";
  bio: string;
  jobTitle?: string;
  /** Profile URL (LinkedIn, personal site…). */
  url?: string;
  /** Other profiles of the same author, used in JSON-LD `sameAs`. */
  sameAs?: string[];
};

export const BLOG_AUTHORS = {
  "equipo-cloro": {
    name: "Equipo Cloro",
    type: "Organization",
    bio: "Equipo Cloro publica sobre operaciones, cumplimiento sanitario y digitalización en empresas de mantenimiento de piscinas en España.",
    url: "https://cloro.app/",
  },
} satisfies Record<string, BlogAuthor>;

export type BlogAuthorId = keyof typeof BLOG_AUTHORS;

export const BLOG_AUTHOR_IDS = Object.keys(BLOG_AUTHORS) as [BlogAuthorId, ...BlogAuthorId[]];
