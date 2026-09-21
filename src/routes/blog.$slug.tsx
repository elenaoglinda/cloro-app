import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BLOG_POSTS, getPostBySlug, type BlogPost } from "@/lib/blog-posts";
import "@/styles/blog-prose.css";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Artículo no encontrado | Cloro" }] };
    }
    const url = `https://cloro.app/blog/${post.slug}`;
    const image = `https://cloro.app${post.cover}`;
    const ld = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      keywords: post.keywords.join(", "),
      datePublished: post.date,
      dateModified: post.date,
      image,
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
        { name: "keywords", content: post.keywords.join(", ") },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "article:published_time", content: post.date },
        { property: "article:author", content: post.author },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: image },
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

function BlogPostPage() {
  const { post } = Route.useLoaderData() as { post: BlogPost };
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-12 lg:py-16">
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="size-4" /> Volver al blog
          </Link>
        </div>

        <img
          src={post.cover}
          alt={post.coverAlt}
          width={1280}
          height={720}
          className="w-full aspect-[16/9] object-cover border border-border"
        />

        <header className="mt-8">
          <h1 className="text-3xl lg:text-5xl leading-tight">{post.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.readingMinutes} min de lectura</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </header>

        <section className="mt-10 mb-8 border-l-2 border-accent bg-accent/5 px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-accent font-medium">
            TL;DR
          </p>
          <p className="mt-2 text-foreground/90 leading-relaxed">{post.tldr}</p>
        </section>

        <article className="blog-content mt-10">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a
                  className="text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition"
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold text-foreground" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic text-foreground/90" {...props} />
              ),
              code: ({ node, className, children, ...props }) => {
                const isBlock = /language-/.test(className || "");
                if (isBlock) {
                  return (
                    <code
                      className={`${className || ""} block p-4 bg-muted text-sm font-mono overflow-x-auto`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <code
                    className="px-1.5 py-0.5 bg-muted text-[0.9em] font-mono rounded"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ node, ...props }) => (
                <pre className="my-6 overflow-x-auto bg-muted border border-border" {...props} />
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto">
                  <table>{children}</table>
                </div>
              ),
              img: ({ node, ...props }) => (
                <img
                  className="my-8 w-full border border-border"
                  loading="lazy"
                  {...props}
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        <aside className="mt-14 border border-border p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Sobre el autor
          </p>
          <p className="mt-3 font-medium">{post.author}</p>
          <p className="mt-1 text-sm text-muted-foreground">{post.authorBio}</p>
        </aside>

        {related.length > 0 && (
          <section className="mt-14 border-t border-border pt-10">
            <h2 className="text-xl">Sigue leyendo</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="group border border-border hover:border-foreground/30 transition-colors block"
                >
                  <img
                    src={r.cover}
                    alt={r.coverAlt}
                    loading="lazy"
                    width={1280}
                    height={720}
                    className="w-full aspect-[16/9] object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm leading-snug group-hover:underline underline-offset-4">
                      {r.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
