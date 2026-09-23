// Vite plugin that turns src/content/blog/*.md into typed, validated data.
//
//   import posts, { bodies } from "virtual:blog-posts";
//     posts  -> metadata of every post (no bodies)
//     bodies -> { [slug]: () => import("virtual:blog-body/<slug>") }, the markdown of one post
//
// Frontmatter is validated with src/lib/blog/schema.ts. Any error stops the dev
// server/build with the file name and the fields to fix.
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { Plugin, ViteDevServer } from "vite";
import { frontmatterSchema, SLUG_PATTERN } from "../src/lib/blog/schema";
import { countWords, extractHeadings, readingMinutes } from "../src/lib/blog/markdown";

const POSTS_ID = "virtual:blog-posts";
const BODY_PREFIX = "virtual:blog-body/";
const RESOLVED_POSTS_ID = "\0" + POSTS_ID;
const RESOLVED_BODY_PREFIX = "\0" + BODY_PREFIX;

type ParsedPost = {
  slug: string;
  file: string;
  data: ReturnType<typeof frontmatterSchema.parse>;
  body: string;
};

/** Reads width/height from a JPEG or PNG header (used for og:image and JSON-LD). */
function imageSize(file: string): { width: number; height: number } | undefined {
  const buf = fs.readFileSync(file);
  if (buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) return undefined;
      const marker = buf[i + 1];
      const length = buf.readUInt16BE(i + 2);
      // SOF0–SOF15, excluding DHT (C4), JPG (C8) and DAC (CC).
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + length;
    }
  }
  return undefined;
}

export function blogContent(): Plugin {
  let root = process.cwd();
  let isDev = false;
  const contentDir = () => path.join(root, "src/content/blog");
  const coverDir = () => path.join(root, "src/assets/blog");

  function readPosts(): ParsedPost[] {
    const dir = contentDir();
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
      .sort();
    const errors: string[] = [];
    const posts: ParsedPost[] = [];

    for (const file of files) {
      const rel = path.relative(root, path.join(dir, file));
      const slug = file.replace(/\.md$/, "");
      const source = fs.readFileSync(path.join(dir, file), "utf8").replace(/\r\n/g, "\n");
      const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(source);
      if (!match) {
        errors.push(`${rel}: falta el bloque de frontmatter (--- … ---) al principio`);
        continue;
      }
      if (!SLUG_PATTERN.test(slug)) {
        errors.push(`${rel}: el nombre de archivo debe ser un slug en minúsculas con guiones`);
      }

      let raw: unknown;
      try {
        // CORE_SCHEMA keeps dates like 2026-09-23 as strings.
        raw = yaml.load(match[1], { schema: yaml.CORE_SCHEMA });
      } catch (err) {
        errors.push(`${rel}: YAML no válido — ${(err as Error).message}`);
        continue;
      }

      const result = frontmatterSchema.safeParse(raw);
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push(`${rel}: ${issue.path.join(".") || "(frontmatter)"} — ${issue.message}`);
        }
        continue;
      }
      if (!fs.existsSync(path.join(coverDir(), result.data.cover))) {
        errors.push(`${rel}: cover — no existe src/assets/blog/${result.data.cover}`);
      }
      const body = match[2].trim();
      if (body.length < 300)
        errors.push(`${rel}: el cuerpo del artículo está vacío o es muy corto`);

      posts.push({ slug, file: rel, data: result.data, body });
    }

    if (errors.length > 0) {
      throw new Error(`Errores en los artículos del blog:\n  - ${errors.join("\n  - ")}`);
    }
    return isDev ? posts : posts.filter((p) => !p.data.draft);
  }

  function postsModule(): string {
    const posts = readPosts();
    const imports = posts.map(
      (p, i) => `import cover${i} from ${JSON.stringify(`/src/assets/blog/${p.data.cover}`)};`,
    );
    const entries = posts.map((p, i) => {
      const words = countWords(p.body);
      const meta = {
        ...p.data,
        slug: p.slug,
        updated: p.data.updated ?? p.data.date,
        coverFile: p.data.cover,
        coverSize: imageSize(path.join(coverDir(), p.data.cover)) ?? null,
        wordCount: words,
        readingMinutes: readingMinutes(words),
        headings: extractHeadings(p.body),
      };
      return `{ ...${JSON.stringify(meta)}, cover: cover${i} }`;
    });
    // Bodies are split into their own chunks so listing pages don't ship every article.
    const bodies = posts.map(
      (p) => `  ${JSON.stringify(p.slug)}: () => import(${JSON.stringify(BODY_PREFIX + p.slug)}),`,
    );
    return [
      ...imports,
      `export default [\n${entries.join(",\n")}\n];`,
      `export const bodies = {\n${bodies.join("\n")}\n};`,
      "",
    ].join("\n");
  }

  function invalidate(server: ViteDevServer) {
    for (const mod of server.moduleGraph.idToModuleMap.values()) {
      if (mod.id === RESOLVED_POSTS_ID || mod.id?.startsWith(RESOLVED_BODY_PREFIX)) {
        server.moduleGraph.invalidateModule(mod);
      }
    }
    server.ws.send({ type: "full-reload" });
  }

  return {
    name: "cloro-blog-content",
    enforce: "pre",
    configResolved(config) {
      root = config.root;
      isDev = config.command === "serve";
    },
    resolveId(id) {
      if (id === POSTS_ID) return RESOLVED_POSTS_ID;
      if (id.startsWith(BODY_PREFIX)) return "\0" + id;
    },
    load(id) {
      if (id === RESOLVED_POSTS_ID) {
        this.addWatchFile(contentDir());
        return postsModule();
      }
      if (id.startsWith(RESOLVED_BODY_PREFIX)) {
        const slug = id.slice(RESOLVED_BODY_PREFIX.length);
        const post = readPosts().find((p) => p.slug === slug);
        if (!post) throw new Error(`No existe el artículo "${slug}"`);
        this.addWatchFile(path.join(root, post.file));
        return `export default ${JSON.stringify(post.body)};`;
      }
    },
    configureServer(server) {
      server.watcher.add(contentDir());
      const onChange = (file: string) => {
        if (file.startsWith(contentDir()) && file.endsWith(".md")) invalidate(server);
      };
      server.watcher.on("change", onChange);
      server.watcher.on("add", onChange);
      server.watcher.on("unlink", onChange);
    },
  };
}
