import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Element, Root, RootContent } from "hast";
import { createHeadingIdFactory } from "@/lib/blog/markdown";

function textOf(node: RootContent | Root): string {
  if (node.type === "text") return node.value;
  if ("children" in node) return node.children.map((c) => textOf(c as RootContent)).join("");
  return "";
}

/** Adds ids to h2–h6 using the same algorithm as the table of contents (extractHeadings). */
function rehypeHeadingIds() {
  return (tree: Root) => {
    const nextId = createHeadingIdFactory();
    const walk = (node: Root | Element) => {
      for (const child of node.children) {
        if (child.type !== "element") continue;
        if (/^h[2-6]$/.test(child.tagName)) {
          child.properties = { ...child.properties, id: nextId(textOf(child).trim()) };
        } else {
          walk(child);
        }
      }
    };
    walk(tree);
  };
}

const isExternal = (href?: string) =>
  !!href && /^https?:\/\//.test(href) && !href.startsWith("https://cloro.app");

export function PostBody({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHeadingIds]}
      components={{
        a: ({ node, href, ...props }) => (
          <a
            href={href}
            className="text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition"
            {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            {...props}
          />
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-semibold text-foreground" {...props} />
        ),
        em: ({ node, ...props }) => <em className="italic text-foreground/90" {...props} />,
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
            <code className="px-1.5 py-0.5 bg-muted text-[0.9em] font-mono rounded" {...props}>
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
            decoding="async"
            {...props}
          />
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
