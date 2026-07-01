export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readingMinutes: number;
  author: string;
  tags: string[];
  content: string; // markdown-ish plain text with paragraphs separated by \n\n
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "cumplir-rd-742-2013-sin-morir-en-el-intento",
    title: "Cómo cumplir el RD 742/2013 sin morir en el intento",
    description:
      "Guía práctica para técnicos y empresas de mantenimiento de piscinas: parámetros obligatorios, frecuencias, analíticas y errores que provocan requerimientos de Sanidad.",
    date: "2026-06-24",
    readingMinutes: 8,
    author: "Equipo Cloro",
    tags: ["Cumplimiento", "SILOÉ", "RD 742/2013"],
    content: `El Real Decreto 742/2013 es la norma que regula los criterios técnico-sanitarios de las piscinas de uso público en España. Si mantienes piscinas de hoteles, comunidades, cámpings o polideportivos, es tu marco legal de referencia.

## Qué parámetros hay que registrar cada día

pH, cloro libre, cloro combinado, temperatura del agua y del aire, turbidez y aforo. El técnico tiene que anotarlos en cada visita, y el titular de la instalación debe conservarlos durante al menos un año.

## Analíticas mensuales

Además del parte diario, un laboratorio acreditado ENAC debe analizar mensualmente parámetros microbiológicos y físico-químicos. El resultado se archiva junto al parte diario y se sube a SILOÉ.

## Errores frecuentes que provocan requerimientos

Días sin parte, lecturas fuera de rango sin acción correctiva registrada, y analíticas mensuales cargadas fuera de plazo. Un buen software te avisa antes de que Sanidad lo detecte.
`,
  },
  {
    slug: "rutas-optimizadas-mantenimiento-piscinas",
    title: "Rutas optimizadas: cómo ahorrar 2 horas al día en mantenimiento",
    description:
      "Cómo diseñar rutas de mantenimiento de piscinas usando tráfico en tiempo real, ventanas horarias y tiempos medios reales por instalación.",
    date: "2026-06-10",
    readingMinutes: 6,
    author: "Equipo Cloro",
    tags: ["Operaciones", "Rutas"],
    content: `La mayor pérdida de tiempo en una empresa de mantenimiento de piscinas no está en el trabajo técnico: está entre parada y parada.

## Tres variables que casi nadie cruza

Tráfico en tiempo real, ventanas horarias del cliente (comunidades que sólo abren mañanas, hoteles con check-in a las 14h) y tiempo medio real por piscina (no el estimado). Cruzarlas reduce una ruta típica de 18 piscinas de ~7,5 h a ~5,5 h.

## Navegación nativa

El técnico no quiere una app más: quiere que al pulsar "siguiente parada" se abra Google Maps o Waze con la dirección ya cargada. Todo lo demás sobra.
`,
  },
  {
    slug: "whatsapp-clientes-piscinas",
    title: "WhatsApp con clientes de piscinas: dónde automatizar y dónde no",
    description:
      "Qué mensajes puede responder un agente de WhatsApp por ti, qué debe escalar siempre a una persona, y cómo evitar sonar a bot.",
    date: "2026-05-28",
    readingMinutes: 5,
    author: "Equipo Cloro",
    tags: ["WhatsApp", "Atención al cliente"],
    content: `WhatsApp es el canal preferido de administradores de fincas y propietarios de chalets. También es donde más tiempo se pierde.

## Automatiza lo repetitivo

Confirmaciones de visita, resultado de la última analítica, próxima visita programada y preguntas frecuentes de precios. Son mensajes con respuesta objetiva.

## Escala siempre lo sensible

Reclamaciones, incidencias de agua turbia, quejas de olor, cualquier mención a niños o accidentes. Un bot que responde a esto es un cliente perdido.
`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
