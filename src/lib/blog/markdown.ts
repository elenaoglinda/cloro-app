// Markdown helpers shared by the Vite blog plugin (Node) and the blog pages (browser/SSR).

/** "¿Qué exige el RD 742/2013?" -> "que-exige-el-rd-7422013" */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}

/** Strips inline markdown (links, emphasis, code) down to plain text. */
export function stripInlineMarkdown(input: string): string {
  return input
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/** Returns a function that gives unique ids for headings, in document order. */
export function createHeadingIdFactory() {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = slugify(text) || "seccion";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

export type BlogHeading = { depth: 2 | 3; text: string; id: string };

/** Lists the ## and ### headings of a markdown body, skipping fenced code blocks. */
export function extractHeadings(markdown: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const nextId = createHeadingIdFactory();
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const match = /^(#{2,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const depth = match[1].length;
    const text = stripInlineMarkdown(match[2]);
    // Ids are assigned to every heading level so they match the rendered page.
    const id = nextId(text);
    if (depth === 2 || depth === 3) headings.push({ depth, text, id });
  }
  return headings;
}

export function countWords(markdown: string): number {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\|/g, " ")
    .replace(/[#>*_`~-]/g, " ");
  return stripInlineMarkdown(plain).split(/\s+/).filter(Boolean).length;
}

/** Spanish reading speed, ~220 words per minute. */
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 220));
}
