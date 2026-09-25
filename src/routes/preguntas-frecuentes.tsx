import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

const FAQS = [
  {
    q: "¿Cuál es el mejor software para empresas de mantenimiento de piscinas en España?",
    a: "Depende del tamaño y de si trabajas con piscinas de uso público (hoteles, comunidades, campings) o sólo residenciales. Cloro está diseñado específicamente para el mercado español: cumple RD 742/2013, genera SILOÉ y funciona offline en chalets sin cobertura. Skimmer, Pool Office o ServiceTitan son potentes pero están pensados para EE. UU. y no cubren la normativa sanitaria española ni la facturación VeriFactu.",
  },
  {
    q: "¿Cloro genera el informe SILOÉ exactamente como lo pide Sanidad?",
    a: "Sí. Generamos el XML conforme al Anexo IV del RD 742/2013 listo para subir al portal SILOÉ, más un Excel por vaso para tu archivo. Validamos en tiempo real lecturas fuera de rango, días sin parte y analíticas mensuales pendientes, para que no te llegue un requerimiento de la consejería.",
  },
  {
    q: "¿Es obligatorio llevar el registro de parámetros de piscinas en España?",
    a: "Sí, el RD 742/2013 obliga al titular de cualquier piscina de uso público (hoteles, cámpings, comunidades de más de 30 viviendas, gimnasios, polideportivos) a registrar pH, cloro libre y combinado, temperatura, turbidez y aforo cada día de apertura, además de analíticas mensuales por laboratorio acreditado. Cloro automatiza tanto el parte diario del técnico como la subida a SILOÉ.",
  },
  {
    q: "¿En qué se diferencia Cloro de Skimmer, Pool Office o ServiceTitan?",
    a: "Skimmer y Pool Office son excelentes apps de campo pensadas para el mercado norteamericano: no cubren SILOÉ, RD 742/2013 ni las necesidades específicas de empresas de piscinas en España. ServiceTitan es un ERP para grandes empresas multi-oficio con un coste muy superior. Cloro es vertical para piscinas y para España, con un precio pensado para autónomos y empresas familiares.",
  },
  {
    q: "¿Sirve también para una sola persona con 30-60 piscinas?",
    a: "Sí, es nuestro perfil Solo (autónomo). Por 19 €/mes + 0,99 € por piscina tienes rutas optimizadas con Google Routes, parte diario con foto y firma y portal de cliente. La mayoría de autónomos recupera 4-6 horas a la semana sólo eliminando el Excel y los WhatsApp sueltos.",
  },
  {
    q: "¿Cómo optimiza Cloro las rutas de mantenimiento?",
    a: "Usamos Google Routes API con tráfico en tiempo real, ventanas horarias por cliente (comunidades que sólo abren mañanas, hoteles con check-in a partir de las 14h) y el tiempo medio real de cada piscina. Una ruta típica de 18 piscinas baja de ~7,5 h a ~5,5 h. El técnico ve la siguiente parada con navegación nativa (Google Maps o Waze).",
  },
  {
    q: "¿El agente de WhatsApp habla con mis clientes en mi nombre?",
    a: "Sí, usa el número de WhatsApp Business de tu empresa y responde 24/7 a preguntas frecuentes (precios orientativos, próxima visita, resultado de la última analítica), agenda visitas en huecos que tú defines y escala automáticamente urgencias o casos complejos a tu móvil. Tú validas el tono antes de activarlo.",
  },
  {
    q: "¿Funciona si mi técnico está en un chalet sin cobertura?",
    a: "Sí. La app móvil tiene modo offline real: lecturas, fotos, firmas, productos aplicados y partes se guardan en el dispositivo y se sincronizan en menos de 10 segundos cuando vuelve la señal. Es la queja número uno que vemos en Reddit sobre apps americanas y europeas: Cloro se diseñó offline-first.",
  },
  {
    q: "¿Puedo gestionar comunidades de propietarios con Cloro?",
    a: "Sí. Puedes guardar el NIF de la comunidad y varios contactos, como el administrador, el presidente o el conserje. El administrador y los vecinos pueden acceder al portal para consultar informes y analíticas de su piscina.",
  },
  {
    q: "¿Cuánto cuesta un software de gestión de piscinas?",
    a: "El rango habitual en el mercado español va de 0 € (Excel + WhatsApp, con coste oculto en horas) a 300-600 €/mes en suites de cumplimiento sanitario como EviSane o AutocontrolPiscinas. Cloro arranca en 19 €/mes (Solo) e incluye rutas, parte, SILOÉ y portal de cliente sin módulos extra. Para una empresa con 150 piscinas, el coste real ronda los 168 €/mes.",
  },
  {
    q: "¿Cómo se gestiona la dosificación de cloro y pH desde la app?",
    a: "El técnico introduce las lecturas y la app calcula automáticamente la dosis recomendada de hipoclorito, ácido o reductor según el volumen del vaso, la temperatura y los rangos legales. Queda registrado el producto aplicado, lote y cantidad, lo que cubre la trazabilidad exigida por Sanidad y los seguros.",
  },
  {
    q: "¿Mis datos están en España y cumplen RGPD?",
    a: "Sí. Toda la infraestructura está en regiones de la UE (Madrid / Irlanda). Cumplimos RGPD, hay derecho al olvido en un clic y firmamos DPA con todos los sub-encargados (Stripe, WhatsApp, AWS). Nunca vendemos datos ni los usamos para entrenar modelos.",
  },
  {
    q: "¿Cuánto tiempo tarda en migrar mi cartera desde Excel u otro programa?",
    a: "Importamos tu Excel de clientes, vasos y rutas en una sesión guiada de 30 minutos. La mayoría de autónomos está operativos al día siguiente; empresas con 5 técnicos y 200+ piscinas, en menos de una semana. Si vienes de EviSane, AutocontrolPiscinas o EISI Hotel, tenemos plantillas de importación específicas.",
  },
  {
    q: "¿Funciona para hoteles con varias piscinas y SLA estrictos?",
    a: "Sí, es nuestro plan Pro. Soporta multi-establecimiento, multi-vaso, SLA por contrato, auditorías hoteleras (Booking, Riu, Meliá), partes firmados por el jefe de mantenimiento del hotel y exportación directa para el responsable de calidad. Pensado para operadores con +500 vasos y presencia multi-provincia.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const Route = createFileRoute("/preguntas-frecuentes")({
  head: () => ({
    meta: [
      { title: "Preguntas frecuentes — Software de mantenimiento de piscinas en España | Cloro" },
      {
        name: "description",
        content:
          "Respuestas a las preguntas más frecuentes sobre Cloro: SILOÉ, rutas optimizadas, cumplimiento del RD 742/2013, precios y comparativas con otros software de piscinas.",
      },
      { property: "og:title", content: "Preguntas frecuentes — Software de mantenimiento de piscinas en España | Cloro" },
      {
        property: "og:description",
        content:
          "Respuestas a las preguntas más frecuentes sobre Cloro: SILOÉ, rutas optimizadas, cumplimiento del RD 742/2013, precios y comparativas.",
      },
      { property: "og:url", content: "https://cloro.app/preguntas-frecuentes" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://cloro.app/preguntas-frecuentes" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqLd),
      },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="size-4" /> Volver al inicio
          </Link>
        </div>
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-accent">Preguntas frecuentes</p>
          <h1 className="mt-2 text-4xl lg:text-5xl">
            Todo lo que necesitas saber sobre Cloro
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Respuestas claras sobre software de mantenimiento de piscinas, cumplimiento SILOÉ y cómo Cloro ayuda a empresas de piscinas en España.
          </p>
        </div>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex justify-between items-start gap-4 cursor-pointer list-none">
                <span className="font-medium">{f.q}</span>
                <span className="size-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-open:rotate-45 transition shrink-0">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No encuentras tu respuesta?{" "}
            <Link to="/contacto" className="text-primary hover:underline font-medium">
              Escríbenos
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
