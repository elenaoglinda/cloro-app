import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { PostCard } from "@/components/blog/PostCard";
import { getPostsByTag, getTagBySlug } from "@/lib/blog/posts";
import { tagHead } from "@/lib/blog/seo";

export const Route = createFileRoute("/blog/tag/$tag")({
  loader: ({ params }) => {
    const tag = getTagBySlug(params.tag);
    if (!tag) throw notFound();
    return { tag, posts: getPostsByTag(tag.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Tema no encontrado | Cloro" }, { name: "robots", content: "noindex" }],
      };
    }
    return tagHead(loaderData.tag, loaderData.posts);
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl">Tema no encontrado</h1>
        <Link to="/blog" className="mt-6 inline-flex text-primary hover:underline">
          Volver al blog
        </Link>
      </main>
      <SiteFooter />
    </div>
  ),
  component: TagPage,
});

function TagPage() {
  const { tag, posts } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <Breadcrumbs
          items={[
            { label: "Inicio", to: "/" },
            { label: "Blog", to: "/blog" },
            { label: tag.name },
          ]}
        />
        <header className="mt-8 max-w-2xl">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Tema</p>
          <h1 className="mt-2 text-4xl lg:text-5xl">{tag.name}</h1>
          <p className="mt-4 text-muted-foreground">
            {posts.length === 1 ? "1 artículo" : `${posts.length} artículos`} sobre{" "}
            {tag.name.toLowerCase()} para empresas de mantenimiento de piscinas.
          </p>
        </header>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
