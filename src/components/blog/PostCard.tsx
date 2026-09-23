import { Link } from "@tanstack/react-router";
import { formatPostDate, type BlogPost } from "@/lib/blog/posts";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group border border-border hover:border-foreground/30 transition-colors flex flex-col">
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="block overflow-hidden">
        <img
          src={post.cover}
          alt={post.coverAlt}
          loading="lazy"
          decoding="async"
          width={post.coverSize?.width ?? 1280}
          height={post.coverSize?.height ?? 720}
          className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{post.tags[0]}</p>
        <h2 className="mt-2 text-xl leading-snug">
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="hover:underline underline-offset-4"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{post.description}</p>
        <div className="mt-auto pt-6 text-sm text-muted-foreground flex flex-wrap gap-x-2">
          <span>{post.authorInfo.name}</span>
          <span>·</span>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingMinutes} min</span>
        </div>
      </div>
    </article>
  );
}
