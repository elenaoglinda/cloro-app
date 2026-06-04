import { createFileRoute } from "@tanstack/react-router";
import {
  Waves, MapPin, Beaker, FileCheck2, MessageCircle, CreditCard,
  Wifi, ShieldCheck, Calendar, BellRing, Building2, Check, X,
  Sparkles, ArrowRight, Clock, Euro, Smartphone, FileSpreadsheet,
} from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import heroPool from "@/assets/hero-pool.jpg";
import technicianApp from "@/assets/technician-app.jpg";

const FAQS = [
  {
    q: "¿Cuál es el mejor software para empresas de mantenimiento de piscinas en España?",
    a: "Depende del tamaño y de si trabajas con piscinas de uso público (hoteles, comunidades, campings) o sólo residenciales. Cloro está diseñado específicamente para el mercado español: cumple RD 742/2013, genera SILOÉ, factura con VeriFactu y funciona offline en chalets sin cobertura. Skimmer, Pool Office o ServiceTitan son potentes pero están pensados para EE. UU. y no cubren la normativa sanitaria ni la facturación electrónica española.",
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
    a: "Skimmer y Pool Office son excelentes apps de campo pensadas para el mercado norteamericano: no cubren SILOÉ, RD 742/2013, VeriFactu, comunidades de propietarios ni facturación en euros con IVA. ServiceTitan es un ERP para grandes empresas multi-oficio con un coste muy superior. Cloro es vertical para piscinas y para España, con un precio pensado para autónomos y empresas familiares.",
  },
  {
    q: "¿Sirve también para una sola persona con 30-60 piscinas?",
    a: "Sí, es nuestro perfil Solo (autónomo). Por 19 €/mes + 0,99 € por piscina tienes rutas optimizadas con Google Routes, parte diario con foto y firma, facturación VeriFactu y portal de cliente. La mayoría de autónomos recupera 4-6 horas a la semana sólo eliminando el Excel y los WhatsApp sueltos.",
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
    q: "¿Puedo facturar a una comunidad de propietarios con VeriFactu?",
    a: "Sí. Soporta NIF de la comunidad, varios contactos (administrador, presidente, conserje), facturación recurrente y emisión VeriFactu firmada y enviada a la AEAT en tiempo real. El administrador y los vecinos pueden acceder al portal para ver informes, analíticas y facturas de su piscina.",
  },
  {
    q: "¿Cuánto cuesta un software de gestión de piscinas?",
    a: "El rango habitual en el mercado español va de 0 € (Excel + WhatsApp, con coste oculto en horas) a 300-600 €/mes en suites de cumplimiento sanitario como EviSane o AutocontrolPiscinas. Cloro arranca en 19 €/mes (Solo) e incluye rutas, parte, SILOÉ, VeriFactu y portal de cliente sin módulos extra. Para una empresa con 150 piscinas, el coste real ronda los 168 €/mes.",
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
    a: "Importamos tu Excel de clientes, vasos y rutas en una sesión guiada de 30 minutos. La mayoría de autónomos están operativos al día siguiente; empresas con 5 técnicos y 200+ piscinas, en menos de una semana. Si vienes de EviSane, AutocontrolPiscinas o EISI Hotel, tenemos plantillas de importación específicas.",
  },
  {
    q: "¿Funciona para hoteles con varias piscinas y SLA estrictos?",
    a: "Sí, es nuestro plan Pro. Soporta multi-establecimiento, multi-vaso, SLA por contrato, auditorías hoteleras (Booking, Riu, Meliá), partes firmados por el jefe de mantenimiento del hotel y exportación directa para el responsable de calidad. Pensado para operadores con +500 vasos y presencia multi-provincia.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cloro — Gestión de mantenimiento de piscinas" },
      {
        name: "description",
        content:
          "Sistema operativo para empresas de mantenimiento de piscinas. Gestiona rutas, SILOÉ, VeriFactu y agenda clientes por WhatsApp.",
      },
      { property: "og:title", content: "Cloro — Gestión de mantenimiento de piscinas" },
      {
        property: "og:description",
        content:
          "Sistema operativo para empresas de mantenimiento de piscinas. Gestiona rutas, SILOÉ, VeriFactu y agenda clientes por WhatsApp.",
      },
      { property: "og:url", content: "https://cloro.app/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://cloro.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Cloro",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web, iOS, Android",
          offers: { "@type": "Offer", priceCurrency: "EUR" },
        }),
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <Hero />
        <LogosStrip />
        <Problem />
        <Features />
        <WhatsAppAgent />
        <Compliance />
        <Comparison />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-sky">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
            <Sparkles className="size-3.5" /> Diseñado para el mercado español
          </span>
          <h1 className="mt-6 text-5xl lg:text-7xl font-display leading-[1.02] text-balance">
            El sistema operativo de tu empresa de <em className="text-primary not-italic">mantenimiento de piscinas</em>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl text-balance">
            Gestiona rutas, parámetros químicos, facturación VeriFactu e informes SILOÉ desde un único
            lugar. Con un agente de WhatsApp que capta y agenda nuevos clientes mientras atiendes los actuales.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#cta"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-foreground text-background font-medium shadow-soft hover:opacity-90 transition"
            >
              Empezar gratis 7 días <ArrowRight className="size-4" />
            </a>
            <a
              href="#whatsapp"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-card border border-border font-medium hover:bg-muted transition"
            >
              <MessageCircle className="size-4" /> Ver el agente WhatsApp
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-primary" /> Sin tarjeta</span>
            <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-primary" /> En castellano</span>
            <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-primary" /> Datos en la UE</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-pool opacity-10 blur-3xl rounded-3xl" />
          <div className="relative rounded-3xl overflow-hidden shadow-glow ring-1 ring-border">
            <img
              src={heroPool}
              alt="Piscina mediterránea cristalina lista para el mantenimiento"
              width={1600}
              height={1100}
              className="w-full h-auto object-cover aspect-[16/11]"
            />
          </div>
          <FloatingMetric
            className="absolute -bottom-6 -left-6"
            icon={<Beaker className="size-4 text-primary" />}
            label="Cloro libre"
            value="1,4 ppm"
            sub="dentro de rango"
          />
          <FloatingMetric
            className="absolute -top-6 -right-6"
            icon={<FileCheck2 className="size-4 text-primary" />}
            label="Informe SILOÉ"
            value="98% listo"
            sub="3 lecturas pendientes"
          />
        </div>
      </div>
    </section>
  );
}

function FloatingMetric({
  className, icon, label, value, sub,
}: { className?: string; icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className={`bg-card rounded-2xl shadow-card border border-border p-4 w-56 ${className ?? ""}`}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-1 text-2xl font-display">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

/* ---------------- LOGOS / METRICS STRIP ---------------- */
function LogosStrip() {
  const stats = [
    { v: "1,34 M", l: "piscinas registradas en España" },
    { v: "≈ 2.000", l: "empresas de mantenimiento activas" },
    { v: "30 abr", l: "fecha tope informe SILOÉ anual" },
    { v: "93 %", l: "uso de WhatsApp entre adultos" },
  ];
  return (
    <section className="border-y border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.l}>
            <div className="font-display text-3xl">{s.v}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- PROBLEM ---------------- */
function Problem() {
  const items = [
    { t: "Lecturas en libreta", d: "El cloro y el pH se anotan a mano en una libreta en la furgoneta — y se reconstruye el SILOÉ a final de año." },
    { t: "Rutas a ojo los lunes", d: "Mapa de Google, una pizarra y mucho café. Más kilómetros, más combustible, técnicos quemados." },
    { t: "Cobros perseguidos por WhatsApp", d: "Notas de voz pidiendo recibos. Bizum suelto. El Excel de impagados crece cada mes." },
  ];
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-accent">El sector hoy</p>
        <h2 className="mt-2 text-4xl lg:text-5xl">El 90 % del sector opera como hace 20 años. El otro 10 % ya usa Cloro.</h2>
        <p className="mt-4 text-muted-foreground">
          Las empresas que crecen no lo hacen contratando más técnicos: lo hacen optimizando
          sus procesos. Cloro centraliza rutas, química, cobros y cumplimiento en una sola plataforma.
        </p>
      </div>
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {items.map((i) => (
          <div key={i.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="size-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
              <X className="size-5" />
            </div>
            <h3 className="mt-4 text-xl">{i.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{i.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */
function Features() {
  const features = [
    { icon: MapPin, t: "Rutas optimizadas en un toque", d: "Arrastra piscinas al calendario semanal y deja que Google Routes minimice tu ruta. Menos kilómetros, más visitas." },
    { icon: Beaker, t: "Parte químico digital", d: "Cloro, pH, ORP, turbidez, isocianurato y temperatura. Alertas si las lecturas se salen del rango RD 742/2013." },
    { icon: FileCheck2, t: "Informes SILOÉ automáticos", d: "Genera el Anexo IV completo (XML + Excel por vaso) listo para subir al portal del Ministerio." },
    { icon: MessageCircle, t: "WhatsApp Business nativo", d: "Notificaciones, informes de servicio y recordatorios por el canal que el cliente sí abre." },
    { icon: CreditCard, t: "Cobros y VeriFactu", d: "Bizum, SEPA y Stripe en autopiloto, con recordatorios automáticos y facturación VeriFactu integrada." },
    { icon: Building2, t: "Comunidades de propietarios", d: "Factura al NIF de la comunidad con varios contactos (administrador, presidente, conserje) y acceso para vecinos." },
  ];

  return (
    <section id="caracteristicas" className="bg-surface py-24">
      <div className="max-w-7xl mx-auto px-6">
      <div className="max-w-2xl">
          <p className="text-sm font-medium text-accent">La plataforma</p>
          <h2 className="mt-2 text-4xl lg:text-5xl">Una sola plataforma para operar, cumplir y crecer.</h2>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.t} className="rounded-2xl bg-card border border-border p-6 shadow-soft hover:shadow-card transition">
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-lg font-medium">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-3xl overflow-hidden border border-border bg-card shadow-card grid lg:grid-cols-2">
          <div className="p-10 lg:p-14 flex flex-col justify-center">
            <p className="text-sm font-medium text-accent">App de campo</p>
            <h3 className="mt-2 text-3xl lg:text-4xl">Diseñada para una furgoneta con el sol de cara.</h3>
            <p className="mt-4 text-muted-foreground">
              Botones grandes, fuente legible, modo offline real. El técnico no puede cerrar una visita
              sin las lecturas obligatorias — adiós a las inspecciones reconstruidas la noche antes.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Foto antes/después con sello GPS y hora",
                "Stock de químicos por furgoneta y aviso de reposición",
                "Firma del cliente en pantalla o por enlace WhatsApp",
                "Sincronización en menos de 10 segundos al recuperar señal",
              ].map((x) => (
                <li key={x} className="flex gap-2"><Check className="size-4 text-primary mt-0.5" /> {x}</li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[360px] bg-gradient-pool">
            <img
              src={technicianApp}
              alt="Técnico de piscinas usando la app Cloro en el móvil"
              loading="lazy"
              width={1200}
              height={900}
              className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHATSAPP AGENT ---------------- */
function WhatsAppAgent() {
  return (
    <section id="whatsapp" className="py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--whatsapp)]/15 text-[color:var(--whatsapp)] text-xs font-medium">
            <MessageCircle className="size-3.5" /> Nuevo · Agente IA en WhatsApp
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl">El cliente escribe a WhatsApp. Cloro reserva la visita.</h2>
          <p className="mt-4 text-muted-foreground">
            En España todo se hace por WhatsApp. Nuestro agente conversacional atiende a tus clientes
            24/7, entiende lo que necesitan, propone huecos reales en tu calendario y reserva la visita
            con un brief completo para el técnico.
          </p>
          <ul className="mt-6 space-y-4">
            {[
              { icon: Calendar, t: "Conectado a tu calendario", d: "Sincroniza con Google Calendar y la planificación de Cloro. Solo propone huecos compatibles con la ruta del día." },
              { icon: Clock, t: "Atención 24/7 en castellano", d: "Resuelve dudas frecuentes (precios orientativos, qué incluye una visita, urgencias) sin que tú tengas que cogerlo a las 22:00." },
              { icon: FileSpreadsheet, t: "Brief completo al técnico", d: "Tipo de piscina, volumen, último análisis, fotos enviadas por el cliente y dirección con coordenadas." },
              { icon: BellRing, t: "Recordatorios y confirmaciones", d: "Recordatorio 24h antes, confirmación de llegada y envío del informe al terminar." },
            ].map((i) => (
              <li key={i.t} className="flex gap-4">
                <div className="size-10 shrink-0 rounded-lg bg-[color:var(--whatsapp)]/15 text-[color:var(--whatsapp)] flex items-center justify-center">
                  <i.icon className="size-5" />
                </div>
                <div>
                  <div className="font-medium">{i.t}</div>
                  <div className="text-sm text-muted-foreground">{i.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 bg-[color:var(--whatsapp)] opacity-10 blur-3xl rounded-3xl" />
          <div className="relative rounded-[2rem] bg-[#0b141a] p-3 shadow-glow max-w-md mx-auto">
            <div className="rounded-[1.5rem] bg-[#0b141a] overflow-hidden">
              <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3">
                <div className="size-9 rounded-full bg-gradient-pool flex items-center justify-center">
                  <Waves className="size-4 text-white" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Cloro · Reservas</div>
                  <div className="text-[10px] text-emerald-400">en línea</div>
                </div>
              </div>
              <div className="bg-[#0b141a] p-4 space-y-2 min-h-[420px]">
                <Bubble from="client">Hola, mi piscina tiene el agua verde 😅 ¿Podéis pasar mañana?</Bubble>
                <Bubble from="bot">¡Hola Marta! Lamentamos lo del agua verde 🌿 Para enviarte a un técnico necesito un par de datos rápidos.</Bubble>
                <Bubble from="bot">¿Es la piscina de la Calle Mayor 14, Sitges, ~40 m³, vaso descubierto?</Bubble>
                <Bubble from="client">Sí, esa misma</Bubble>
                <Bubble from="bot">Perfecto ✅ Tengo estos huecos en la ruta de mañana:<br />
                  • <b>09:30 – 10:15</b><br />
                  • <b>12:00 – 12:45</b><br />
                  ¿Cuál te va mejor?</Bubble>
                <Bubble from="client">12:00 perfecto</Bubble>
                <Bubble from="bot">Reservado 📅 Visita el martes 12:00 con Javier. Te enviaré recordatorio 24h antes y el informe en cuanto termine. ¡Gracias, Marta!</Bubble>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bubble({ from, children }: { from: "client" | "bot"; children: React.ReactNode }) {
  const isBot = from === "bot";
  return (
    <div className={`flex ${isBot ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] text-[13px] leading-snug px-3 py-2 rounded-lg ${
          isBot
            ? "bg-[#005c4b] text-white rounded-br-sm"
            : "bg-[#202c33] text-white/95 rounded-bl-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------- COMPLIANCE / SILOÉ ---------------- */
function Compliance() {
  return (
    <section id="cumplimiento" className="bg-gradient-pool text-primary-foreground py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-medium">
            <ShieldCheck className="size-3.5" /> RD 742/2013 · Anexo IV · SILOÉ
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl text-white">El informe SILOÉ deja de ser un fin de semana de marzo.</h2>
          <p className="mt-4 text-white/80 max-w-xl">
            Cada lectura del técnico alimenta directamente el motor de cumplimiento. El 1 de abril
            haces clic y Cloro te entrega el XML listo para subir al portal del Ministerio
            y el Excel por vaso para tu archivo.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Validación automática: huecos de días sin parte, lecturas fuera de rango sin incidencia, analíticas mensuales pendientes",
              "Exportación XML (formato SILOÉ) + Excel por vaso, listos para Sanidad",
              "Histórico de 5 años inmutable y firmado, con sello temporal",
              "Panel de cumplimiento por piscina: % de lecturas completas en tiempo real",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-white/90">
                <Check className="size-5 mt-0.5 shrink-0" /> <span className="text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl bg-card text-card-foreground p-8 shadow-glow border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Informe SILOÉ — Temporada 2026</div>
              <div className="font-display text-3xl mt-1">Piscina Hotel Mar Blau</div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs bg-primary/10 text-primary font-medium">Listo para enviar</span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            {[
              { k: "Días con parte", v: "184/184" },
              { k: "Analíticas mensuales", v: "6/6" },
              { k: "Incidencias", v: "2 cerradas" },
            ].map((s) => (
              <div key={s.k} className="rounded-xl bg-muted p-4">
                <div className="font-display text-2xl">{s.v}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{s.k}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            {[
              { l: "Cloro libre (rango 0,5–2,0 ppm)", v: "98%", ok: true },
              { l: "pH (rango 7,2–8,0)", v: "100%", ok: true },
              { l: "Turbidez (< 5 UNF)", v: "96%", ok: true },
              { l: "Isocianurato (< 75 mg/L)", v: "100%", ok: true },
            ].map((r) => (
              <div key={r.l} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                <span className="text-muted-foreground">{r.l}</span>
                <span className="font-medium text-primary">{r.v}</span>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full h-11 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition inline-flex items-center justify-center gap-2">
            <FileSpreadsheet className="size-4" /> Descargar XML + Excel
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- COMPARISON ---------------- */
function Comparison() {
  const rows: Array<{ feature: string; cloro: boolean | string; autocontrol: boolean | string; evisane: boolean | string; eisi: boolean | string }> = [
    { feature: "Informe SILOÉ (XML + Excel)", cloro: true, autocontrol: true, evisane: true, eisi: true },
    { feature: "Optimización de rutas con IA", cloro: true, autocontrol: false, evisane: false, eisi: false },
    { feature: "App offline para técnicos", cloro: true, autocontrol: "Parcial", evisane: false, eisi: "Parcial" },
    { feature: "Agente WhatsApp con calendario", cloro: true, autocontrol: false, evisane: false, eisi: false },
    { feature: "Bizum + SEPA + VeriFactu", cloro: true, autocontrol: false, evisane: false, eisi: false },
    { feature: "Portal cliente y comunidades", cloro: true, autocontrol: false, evisane: false, eisi: "Hoteles" },
    { feature: "Cobros recurrentes automáticos", cloro: true, autocontrol: false, evisane: false, eisi: false },
    { feature: "En castellano nativo + soporte ES", cloro: true, autocontrol: true, evisane: true, eisi: true },
  ];

  const Cell = ({ v }: { v: boolean | string }) =>
    typeof v === "boolean" ? (
      v ? <Check className="size-5 text-primary mx-auto" /> : <X className="size-5 text-muted-foreground/40 mx-auto" />
    ) : (
      <span className="text-xs text-muted-foreground">{v}</span>
    );

  return (
    <section id="comparativa" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-accent">Comparativa</p>
          <h2 className="mt-2 text-4xl lg:text-5xl">El único que cubre el día completo del piscinero.</h2>
          <p className="mt-4 text-muted-foreground">
            Otras herramientas resuelven solo el informe SILOÉ. Cloro gestiona también la ruta, el
            cobro y la comunicación con el cliente.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left p-4 font-medium">Función</th>
                <th className="p-4 font-display text-lg text-primary">Cloro</th>
                <th className="p-4 font-medium text-muted-foreground">Autocontrol Piscinas</th>
                <th className="p-4 font-medium text-muted-foreground">EviSane</th>
                <th className="p-4 font-medium text-muted-foreground">EISI HOTEL</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.feature} className="border-b border-border last:border-0">
                  <td className="p-4">{r.feature}</td>
                  <td className="p-4 text-center bg-primary/5"><Cell v={r.cloro} /></td>
                  <td className="p-4 text-center"><Cell v={r.autocontrol} /></td>
                  <td className="p-4 text-center"><Cell v={r.evisane} /></td>
                  <td className="p-4 text-center"><Cell v={r.eisi} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRICING ---------------- */
function Pricing() {
  const tiers = [
    {
      name: "Solo",
      price: "19",
      perPool: "0,99",
      desc: "Para el piscinero autónomo: 20–60 piscinas, sin equipo, sin tiempo para papeleo.",
      features: ["Rutas y parte químico digital", "Informe SILOÉ en un clic", "WhatsApp con tus clientes", "Bizum + transferencia", "App de campo offline"],
      featured: false,
    },
    {
      name: "Equipo",
      price: "49",
      perPool: "0,79",
      desc: "Empresas familiares de 2–5 técnicos con comunidades y residencial recurrente (20–200 piscinas).",
      features: ["Todo lo del plan Solo", "Agente WhatsApp con IA 24/7", "VeriFactu + SEPA + Stripe", "Portal cliente y comunidades", "Optimización de rutas con Google Routes"],
      featured: true,
    },
    {
      name: "Pro",
      price: "129",
      perPool: "0,59",
      desc: "Operadores con +500 vasos, hoteles y contratos multi-provincia.",
      features: ["Todo lo del plan Equipo", "Multi-sede y multi-NIF", "API y exportaciones a ERP", "SLA y auditorías hoteleras", "Gestor de cuenta dedicado"],
      featured: false,
    },
  ];
  return (
    <section id="precios" className="bg-surface py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-accent">Precios</p>
          <h2 className="mt-2 text-4xl lg:text-5xl">Pagas por piscina. Sin permanencia.</h2>
          <p className="mt-4 text-muted-foreground">
            7 días de prueba gratis. Sin tarjeta. Cancela cuando quieras.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl p-8 border ${t.featured ? "bg-foreground text-background border-foreground shadow-glow" : "bg-card border-border shadow-soft"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-medium ${t.featured ? "text-background" : ""}`}>{t.name}</h3>
                {t.featured && <span className="text-xs px-2 py-0.5 rounded bg-accent text-accent-foreground">Más popular</span>}
              </div>
              <p className={`mt-1 text-sm ${t.featured ? "text-background/70" : "text-muted-foreground"}`}>{t.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl">{t.price}€</span>
                <span className={`text-sm ${t.featured ? "text-background/70" : "text-muted-foreground"}`}>/mes base</span>
              </div>
              <div className={`text-sm mt-1 ${t.featured ? "text-background/70" : "text-muted-foreground"}`}>
                + {t.perPool}€ por piscina / mes
              </div>
              <a
                href="#cta"
                className={`mt-6 inline-flex w-full items-center justify-center h-11 rounded-lg font-medium transition ${
                  t.featured ? "bg-background text-foreground hover:opacity-90" : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                Empezar gratis
              </a>
              <ul className="mt-6 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className={`size-4 mt-0.5 shrink-0 ${t.featured ? "text-accent" : "text-primary"}`} />
                    <span className={t.featured ? "text-background/90" : ""}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          <Euro className="size-3.5 inline -mt-0.5 mr-1" />
          Precios sin IVA. Facturación mensual o anual (–15% con pago anual).
        </p>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const faqs = FAQS;
  return (
    <section className="max-w-3xl mx-auto px-6 py-24">
      <div className="text-center">
        <p className="text-sm font-medium text-accent">Preguntas frecuentes</p>
        <h2 className="mt-2 text-4xl lg:text-5xl">Lo que nos preguntan los piscineros.</h2>
      </div>
      <div className="mt-10 divide-y divide-border border-y border-border">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex justify-between items-start gap-4 cursor-pointer list-none">
              <span className="font-medium">{f.q}</span>
              <span className="size-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-open:rotate-45 transition">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CTA() {
  return (
    <section id="cta" className="px-6 pb-24">
      <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-pool text-primary-foreground p-10 lg:p-16 shadow-glow relative overflow-hidden">
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl text-white text-balance">
              Opera como una empresa de 20 técnicos. Aunque seas tres.
            </h2>
            <p className="mt-4 text-white/85 max-w-xl">
              Prueba Cloro gratis durante 7 días. Sin tarjeta, sin permanencia y con migración
              de tu cartera incluida. En menos de una semana estarás operativo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-background text-foreground font-medium hover:opacity-90 transition"
              >
                Empezar gratis <ArrowRight className="size-4" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-lg border border-white/30 text-white hover:bg-white/10 transition"
              >
                <Smartphone className="size-4" /> Pedir una demo
              </a>
            </div>
          </div>
          <ul className="space-y-3 text-white/90">
            {[
              "Migración guiada de tu Excel actual",
              "Soporte humano en castellano y catalán",
              "Cumplimiento SILOÉ desde el primer día",
              "Integración con tu WhatsApp Business",
            ].map((x) => (
              <li key={x} className="flex gap-2"><Check className="size-5 shrink-0" /> {x}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
