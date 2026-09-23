import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { PostBody } from "@/components/blog/PostBody";
import {
  formatPostDate,
  getPostBody,
  getPostBySlug,
  getRelatedPosts,
  tagSlug,
  type BlogPost,
} from "@/lib/blog/posts";
import { postHead } from "@/lib/blog/seo";
import "@/styles/blog-prose.css";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post, body: await getPostBody(post.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.post) {
      return {
        meta: [{ title: "Artículo no encontrado | Cloro" }, { name: "robots", content: "noindex" }],
      };
    }
    return postHead(loaderData.post);
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
  const { post, body } = Route.useLoaderData() as { post: BlogPost; body: string };
  const related = getRelatedPosts(post);
  const toc = post.headings.filter((h) => h.depth === 2);
  const wasUpdated = post.updated !== post.date;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-12 lg:py-16">
        <Breadcrumbs
          items={[
            { label: "Inicio", to: "/" },
            { label: "Blog", to: "/blog" },
            { label: post.title },
          ]}
        />

        <article className="mt-8">
          <img
            src={post.cover}
            alt={post.coverAlt}
            width={post.coverSize?.width ?? 1280}
            height={post.coverSize?.height ?? 720}
            fetchPriority="high"
            className="w-full aspect-[16/9] object-cover border border-border"
          />

          <header className="mt-8">
            <h1 className="text-3xl lg:text-5xl leading-tight">{post.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              {wasUpdated && (
                <>
                  <span>·</span>
                  <span>
                    Actualizado el{" "}
                    <time dateTime={post.updated}>{formatPostDate(post.updated)}</time>
                  </span>
                </>
              )}
              <span>·</span>
              <span>{post.authorInfo.name}</span>
              <span>·</span>
              <span>{post.readingMinutes} min de lectura</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  to="/blog/tag/$tag"
                  params={{ tag: tagSlug(t) }}
                  className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition"
                >
                  {t}
                </Link>
              ))}
            </div>
          </header>

          <section
            aria-label="Resumen"
            className="mt-10 mb-8 border-l-2 border-accent bg-accent/5 px-5 py-4"
          >
            <p className="text-xs uppercase tracking-wider text-accent font-medium">TL;DR</p>
            <p className="mt-2 text-foreground/90 leading-relaxed">{post.tldr}</p>
          </section>

          {toc.length >= 3 && (
            <nav aria-label="Índice del artículo" className="mb-10 border border-border p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                En este artículo
              </p>
              <ol className="mt-3 space-y-1.5 text-sm list-decimal list-inside marker:text-muted-foreground">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="hover:text-primary hover:underline underline-offset-4"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="blog-content">
            <PostBody markdown={body} />
          </div>

          <section id="preguntas-frecuentes" className="mt-14" aria-labelledby="faq-title">
            <h2 id="faq-title" className="text-2xl">
              Preguntas frecuentes
            </h2>
            <Accordion type="multiple" className="mt-4 border-t border-border">
              {post.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                  <AccordionTrigger className="text-left text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="blog-content text-[15px]">
                    <PostBody markdown={faq.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <aside className="mt-14 border border-border p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Sobre el autor</p>
            <p className="mt-3 font-medium">
              {post.authorInfo.url ? (
                <a
                  href={post.authorInfo.url}
                  className="hover:underline underline-offset-4"
                  rel="author"
                >
                  {post.authorInfo.name}
                </a>
              ) : (
                post.authorInfo.name
              )}
              {post.authorInfo.jobTitle && (
                <span className="text-muted-foreground font-normal">
                  {" "}
                  · {post.authorInfo.jobTitle}
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{post.authorInfo.bio}</p>
          </aside>
        </article>

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
                    decoding="async"
                    width={r.coverSize?.width ?? 1280}
                    height={r.coverSize?.height ?? 720}
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
