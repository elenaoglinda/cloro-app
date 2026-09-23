import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BLOG_POSTS } from "@/lib/blog-posts";

const blogLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog de Cloro",
  url: "https://cloro.app/blog",
  description:
    "Insights, novedades de producto y guías prácticas sobre mantenimiento de piscinas, cumplimiento SILOÉ y rutas optimizadas en España.",
  blogPost: BLOG_POSTS.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    author: { "@type": "Organization", name: p.author },
    image: `https://cloro.app${p.cover}`,
    url: `https://cloro.app/blog/${p.slug}`,
  })),
};

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog de Cloro — Mantenimiento de piscinas, SILOÉ y operaciones" },
      {
        name: "description",
        content:
          "Insights, novedades de producto y guías prácticas para empresas de mantenimiento de piscinas en España: RD 742/2013, SILOÉ, rutas optimizadas y WhatsApp.",
      },
      { name: "keywords", content: "blog mantenimiento piscinas, RD 742/2013, SILOÉ, rutas piscinas, WhatsApp piscinas" },
      { property: "og:title", content: "Blog de Cloro" },
      {
        property: "og:description",
        content:
          "Insights, novedades de producto y guías prácticas para empresas de mantenimiento de piscinas en España.",
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
      <main className="max-w-6xl mx-auto px-6 py-20">
        <header className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl lg:text-5xl">Bienvenido al blog de Cloro</h1>
          <p className="mt-5 text-muted-foreground">
            Insights, novedades de producto y visiones prácticas sobre el mantenimiento
            profesional de piscinas.
          </p>
          <p className="mt-2 text-muted-foreground">
            Aprende cómo cumplir el RD 742/2013, ganar horas con rutas optimizadas y
            atender clientes por WhatsApp sin perder criterio.
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <article
              key={p.slug}
              className="group border border-border hover:border-foreground/30 transition-colors flex flex-col"
            >
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="block overflow-hidden"
              >
                <img
                  src={p.cover}
                  alt={p.coverAlt}
                  loading="lazy"
                  width={1280}
                  height={720}
                  className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl leading-snug">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="hover:underline underline-offset-4"
                  >
                    {p.title}
                  </Link>
                </h2>
                <div className="mt-auto pt-6 text-sm text-muted-foreground">
                  <div>{p.author}</div>
                  <time dateTime={p.date}>
                    {new Date(p.date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
