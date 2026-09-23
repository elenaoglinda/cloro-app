// Meta tags and JSON-LD for the blog pages.
import type { JSX } from "react";
import type { BlogPost, BlogTag } from "./posts";
import { stripInlineMarkdown } from "./markdown";

export const SITE_URL = "https://cloro.app";
export const SITE_NAME = "Cloro";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BLOG_ID = `${SITE_URL}/blog#blog`;
export const BLOG_NAME = "Blog de Cloro";
export const BLOG_DESCRIPTION =
  "Insights, novedades de producto y guías prácticas para empresas de mantenimiento de piscinas en España: RD 742/2013, SILOÉ, rutas optimizadas y WhatsApp.";
export const RSS_PATH = "/blog/rss.xml";

type MetaTag = Record<string, string>;
type HeadMeta = JSX.IntrinsicElements["meta"];
type HeadLink = JSX.IntrinsicElements["link"];

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[;,:.]$/, "")}…`;
}

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path}`;

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  type: "website" | "article";
  keywords?: string[];
  image?: { url: string; alt: string; width?: number; height?: number };
  jsonLd?: object;
  extra?: MetaTag[];
};

/** Full set of meta tags, canonical and alternate links for a page. */
export function pageHead({
  title,
  description,
  path,
  type,
  keywords,
  image,
  jsonLd,
  extra = [],
}: PageMetaInput) {
  const url = absoluteUrl(path);
  const meta: HeadMeta[] = [
    { title },
    { name: "description", content: description },
    {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "es_ES" },
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (keywords?.length) meta.push({ name: "keywords", content: keywords.join(", ") });
  if (image) {
    const imageUrl = absoluteUrl(image.url);
    meta.push(
      { property: "og:image", content: imageUrl },
      { property: "og:image:alt", content: image.alt },
      { name: "twitter:image", content: imageUrl },
      { name: "twitter:image:alt", content: image.alt },
    );
    if (image.width && image.height) {
      meta.push(
        { property: "og:image:width", content: String(image.width) },
        { property: "og:image:height", content: String(image.height) },
      );
    }
  }
  meta.push(...extra);
  // TanStack renders { "script:ld+json": … } as an escaped <script type="application/ld+json">.
  if (jsonLd) meta.push({ "script:ld+json": jsonLd } as HeadMeta);

  const links: HeadLink[] = [
    { rel: "canonical", href: url },
    { rel: "alternate", hrefLang: "es-ES", href: url },
    {
      rel: "alternate",
      type: "application/rss+xml",
      title: BLOG_NAME,
      href: absoluteUrl(RSS_PATH),
    },
  ];
  return { meta, links };
}

export const postPath = (slug: string) => `/blog/${slug}`;
export const tagPath = (slug: string) => `/blog/tag/${slug}`;

export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function authorLd(post: BlogPost) {
  const a = post.authorInfo;
  // The house author is the company itself: point at the site-wide Organization node.
  if (a.id === "equipo-cloro") {
    return {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    };
  }
  return {
    "@type": a.type,
    name: a.name,
    ...(a.url ? { url: a.url } : {}),
    ...(a.jobTitle ? { jobTitle: a.jobTitle } : {}),
    ...(a.sameAs?.length ? { sameAs: a.sameAs } : {}),
    description: a.bio,
  };
}

const publisherLd = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
};

function coverLd(post: BlogPost) {
  return {
    "@type": "ImageObject",
    url: absoluteUrl(post.cover),
    caption: post.coverAlt,
    ...(post.coverSize ? { width: post.coverSize.width, height: post.coverSize.height } : {}),
  };
}

export function postHead(post: BlogPost) {
  const url = absoluteUrl(postPath(post.slug));
  const title = `${post.seoTitle ?? post.title} | ${SITE_NAME}`;
  const graph = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.description,
      abstract: post.tldr,
      image: coverLd(post),
      datePublished: post.date,
      dateModified: post.updated,
      author: authorLd(post),
      publisher: publisherLd,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      isPartOf: { "@id": BLOG_ID },
      inLanguage: "es-ES",
      keywords: post.keywords.join(", "),
      articleSection: post.tags[0],
      about: post.tags.map((t) => ({ "@type": "Thing", name: t })),
      wordCount: post.wordCount,
      timeRequired: `PT${post.readingMinutes}M`,
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: post.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: stripInlineMarkdown(f.answer) },
      })),
    },
    {
      ...breadcrumbLd([
        { name: "Inicio", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: postPath(post.slug) },
      ]),
      "@id": `${url}#breadcrumb`,
    },
  ];

  return pageHead({
    title,
    description: post.description,
    path: postPath(post.slug),
    type: "article",
    keywords: post.keywords,
    image: {
      url: post.cover,
      alt: post.coverAlt,
      width: post.coverSize?.width,
      height: post.coverSize?.height,
    },
    jsonLd: { "@context": "https://schema.org", "@graph": graph },
    extra: [
      { property: "article:published_time", content: post.date },
      { property: "article:modified_time", content: post.updated },
      { property: "article:author", content: post.authorInfo.name },
      { property: "article:section", content: post.tags[0] },
      // Head tags are de-duplicated by property, so only one article:tag survives.
      { property: "article:tag", content: post.tags.join(", ") },
    ],
  });
}

function postListLd(posts: BlogPost[]) {
  return {
    "@type": "ItemList",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(postPath(p.slug)),
      name: p.title,
    })),
  };
}

export function blogIndexHead(posts: BlogPost[]) {
  const url = absoluteUrl("/blog");
  const latest = posts[0];
  return pageHead({
    title: `${BLOG_NAME} — Mantenimiento de piscinas, SILOÉ y operaciones`,
    description: BLOG_DESCRIPTION,
    path: "/blog",
    type: "website",
    keywords: [
      "blog mantenimiento piscinas",
      "RD 742/2013",
      "SILOÉ",
      "rutas piscinas",
      "WhatsApp piscinas",
    ],
    image: latest ? { url: latest.cover, alt: latest.coverAlt, ...latest.coverSize } : undefined,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Blog",
          "@id": BLOG_ID,
          name: BLOG_NAME,
          url,
          description: BLOG_DESCRIPTION,
          inLanguage: "es-ES",
          publisher: publisherLd,
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            "@id": `${absoluteUrl(postPath(p.slug))}#article`,
            headline: p.title,
            description: p.description,
            datePublished: p.date,
            dateModified: p.updated,
            image: absoluteUrl(p.cover),
            url: absoluteUrl(postPath(p.slug)),
            author: authorLd(p),
          })),
        },
        {
          "@type": "CollectionPage",
          "@id": `${url}#webpage`,
          url,
          name: BLOG_NAME,
          isPartOf: { "@id": WEBSITE_ID },
          mainEntity: postListLd(posts),
        },
        breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
        ]),
      ],
    },
  });
}

export function tagHead(tag: BlogTag, posts: BlogPost[]) {
  const path = tagPath(tag.slug);
  const url = absoluteUrl(path);
  const description = truncate(
    `Artículos sobre ${tag.name.toLowerCase()} para empresas de mantenimiento de piscinas en España: ${posts
      .slice(0, 3)
      .map((p) => p.title)
      .join("; ")}.`,
    160,
  );
  return pageHead({
    title: `${tag.name} — ${BLOG_NAME}`,
    description,
    path,
    type: "website",
    image: posts[0]
      ? { url: posts[0].cover, alt: posts[0].coverAlt, ...posts[0].coverSize }
      : undefined,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${url}#webpage`,
          url,
          name: `${tag.name} — ${BLOG_NAME}`,
          description,
          isPartOf: { "@id": WEBSITE_ID },
          about: { "@type": "Thing", name: tag.name },
          mainEntity: postListLd(posts),
        },
        breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: tag.name, path },
        ]),
      ],
    },
  });
}
