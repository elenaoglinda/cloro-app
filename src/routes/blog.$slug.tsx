import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BLOG_POSTS, getPostBySlug, type BlogPost } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [{ title: "Artículo no encontrado | Cloro" }],
      };
    }
    const url = `https://cloro.app/blog/${post.slug}`;
    const ld = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@type": "Organization", name: post.author },
      publisher: {
        "@type": "Organization",
        name: "Cloro",
        url: "https://cloro.app/",
      },
      mainEntityOfPage: url,
    };
    return {
      meta: [
        { title: `${post.title} | Cloro` },
        { name: "description", content: post.description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "article:published_time", content: post.date },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(ld) }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl">Artículo no encontrado</h1>
        <p className="mt-3 text-muted-foreground">Puede que el enlace haya cambiado.</p>
        <Link to="/blog" className="mt-6 inline-flex text-primary hover:underline">
          Volver al blog
        </Link>
      </main>
      <SiteFooter />
    </div>
  ),
  component: BlogPostPage,
});

function renderContent(content: string) {
  const blocks = content.trim().split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-10 text-2xl">
          {block.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (block.startsWith("# ")) {
      return (
        <h1 key={i} className="mt-10 text-3xl">
          {block.replace(/^#\s+/, "")}
        </h1>
      );
    }
    return (
      <p key={i} className="mt-4 text-muted-foreground leading-relaxed">
        {block}
      </p>
    );
  });
}

function BlogPostPage() {
  const { post } = Route.useLoaderData() as { post: BlogPost };
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="size-4" /> Volver al blog
          </Link>
        </div>
        <article>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.readingMinutes} min lectura</span>
            {post.tags.map((t) => (
              <span
                key={t}
                className="ml-1 rounded-full border border-border px-2 py-0.5 text-[11px]"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="mt-3 text-4xl lg:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
          <div className="mt-8">{renderContent(post.content)}</div>
        </article>

        {related.length > 0 && (
          <aside className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl">Sigue leyendo</h2>
            <ul className="mt-4 space-y-4">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: r.slug }}
                    className="font-medium hover:underline"
                  >
                    {r.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
