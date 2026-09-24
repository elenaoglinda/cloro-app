import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { absoluteUrl, postPath } from "@/lib/blog/seo";

// llms.txt (https://llmstxt.org): a map of the site for AI assistants.
// Blog posts are added automatically from src/content/blog.
const INTRO = `# Cloro

> Sistema operativo para empresas de mantenimiento de piscinas en España: rutas, parte químico digital, informes SILOÉ (RD 742/2013), portal del cliente y un agente de WhatsApp que capta y agenda clientes 24/7.

Cloro digitaliza la operación diaria de empresas de mantenimiento de piscinas (comunidades, hoteles, chalets): planifica rutas, registra parámetros químicos con firma en obra, genera el XML SILOÉ listo para subir a Sanidad, comparte los partes firmados con cada cliente y atiende a los clientes por WhatsApp con un agente que reserva visitas en el calendario del equipo.

## Pages

- [Inicio](/): Resumen del producto, beneficios, precios y FAQ.
- [Preguntas frecuentes](/preguntas-frecuentes): Dudas habituales sobre Cloro, SILOÉ y el RD 742/2013.
- [Contacto](/contacto): Solicitar una demo o hablar con el equipo.
- [Blog](/blog): Guías sobre mantenimiento de piscinas, normativa y operaciones.`;

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const posts = BLOG_POSTS.map(
          (p) => `- [${p.title}](${absoluteUrl(postPath(p.slug))}): ${p.description}`,
        );
        const body = [INTRO, "", "## Blog", "", ...posts, ""].join("\n");
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
