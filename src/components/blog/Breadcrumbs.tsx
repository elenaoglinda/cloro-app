import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

// Plain paths only ("/", "/blog", "/blog/tag/x"): no route params needed.
type Crumb = { label: string; to?: string };

/** Visible breadcrumb trail. The matching BreadcrumbList JSON-LD is emitted in the page head. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="inline-flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight className="size-3.5 shrink-0" aria-hidden />}
            {item.to ? (
              <Link to={item.to as "/"} className="hover:text-foreground transition">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground/80 truncate max-w-[40ch]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
