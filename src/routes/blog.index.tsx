import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { PostCard } from "@/components/blog/PostCard";
import { BLOG_POSTS, getAllTags } from "@/lib/blog/posts";
import { blogIndexHead } from "@/lib/blog/seo";

export const Route = createFileRoute("/blog/")({
  head: () => blogIndexHead(BLOG_POSTS),
  component: BlogIndex,
});

function BlogIndex() {
  const tags = getAllTags();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Blog" }]} />
        <header className="mt-8 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl lg:text-5xl">Bienvenido al blog de Cloro</h1>
          <p className="mt-5 text-muted-foreground">
            Insights, novedades de producto y visiones prácticas sobre el mantenimiento profesional
            de piscinas.
          </p>
          <p className="mt-2 text-muted-foreground">
            Aprende cómo cumplir el RD 742/2013, ganar horas con rutas optimizadas y atender
            clientes por WhatsApp sin perder criterio.
          </p>
        </header>

        {tags.length > 0 && (
          <nav aria-label="Temas del blog" className="mt-10 flex flex-wrap justify-center gap-2">
            {tags.map((t) => (
              <Link
                key={t.slug}
                to="/blog/tag/$tag"
                params={{ tag: t.slug }}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition"
              >
                {t.name} <span className="opacity-60">({t.count})</span>
              </Link>
            ))}
          </nav>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
