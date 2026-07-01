import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BLOG_POSTS } from "@/lib/blog-posts";

const blogLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog de Cloro",
  url: "https://cloro.app/blog",
  description:
    "Artículos sobre gestión de piscinas, cumplimiento SILOÉ, rutas optimizadas y facturación VeriFactu en España.",
  blogPost: BLOG_POSTS.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    author: { "@type": "Organization", name: p.author },
    url: `https://cloro.app/blog/${p.slug}`,
  })),
};

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Gestión de piscinas, SILOÉ y VeriFactu | Cloro" },
      {
        name: "description",
        content:
          "Artículos prácticos sobre mantenimiento de piscinas en España: cumplimiento del RD 742/2013, SILOÉ, rutas optimizadas, WhatsApp y facturación VeriFactu.",
      },
      { property: "og:title", content: "Blog — Gestión de piscinas, SILOÉ y VeriFactu | Cloro" },
      {
        property: "og:description",
        content:
          "Artículos prácticos sobre mantenimiento de piscinas en España: cumplimiento, rutas, WhatsApp y facturación.",
      },
      { property: "og:url", content: "https://cloro.app/blog" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://cloro.app/blog" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(blogLd) }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="size-4" /> Volver al inicio
          </Link>
        </div>
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-accent">Blog</p>
          <h1 className="mt-2 text-4xl lg:text-5xl">Ideas para gestionar mejor tus piscinas</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Artículos prácticos sobre cumplimiento sanitario, operaciones de campo, facturación y
            atención al cliente para empresas de mantenimiento de piscinas en España.
          </p>
        </div>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {posts.map((p) => (
            <article key={p.slug} className="py-8">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <time dateTime={p.date}>
                  {new Date(p.date).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>{p.readingMinutes} min lectura</span>
                {p.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="ml-1 rounded-full border border-border px-2 py-0.5 text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="mt-3 text-2xl">
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="hover:underline underline-offset-4"
                >
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 text-muted-foreground">{p.description}</p>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Leer artículo <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
