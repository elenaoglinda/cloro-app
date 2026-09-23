import { createFileRoute } from "@tanstack/react-router";
import { ComparisonPage } from "@/components/site/ComparisonPage";

const COMPETITOR = "AutocontrolPiscinas";
const URL_PATH = "/comparativa/autocontrolpiscinas";

export const Route = createFileRoute("/comparativa/autocontrolpiscinas")({
  head: () => ({
    meta: [
      { title: `Cloro vs ${COMPETITOR} — Comparativa de software de piscinas` },
      {
        name: "description",
        content:
          "Comparamos Cloro y AutocontrolPiscinas: SILOÉ, rutas, partes digitales y agente WhatsApp y precios para empresas de mantenimiento en España.",
      },
      { property: "og:title", content: `Cloro vs ${COMPETITOR}` },
      {
        property: "og:description",
        content:
          "Análisis honesto entre Cloro y AutocontrolPiscinas para empresas de mantenimiento de piscinas en España.",
      },
      { property: "og:url", content: `https://cloro.app${URL_PATH}` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `https://cloro.app${URL_PATH}` }],
  }),
  component: Page,
});

function Page() {
  return (
    <ComparisonPage
      competitorName={COMPETITOR}
      competitorTagline="Software de autocontrol sanitario centrado en parámetros de agua y cumplimiento SILOÉ."
      intro="AutocontrolPiscinas es una herramienta especializada en el autocontrol sanitario: registra parámetros, calcula dosificaciones y ayuda a cumplir el RD 742/2013. Cloro cubre eso, y además gestiona rutas, técnicos, cobros y la atención de clientes por WhatsApp."
      summary={[
        "Mismo cumplimiento SILOÉ y XML del Anexo IV",
        "Cloro añade rutas, partes y firma digital del técnico",
        "Cobros con Bizum y SEPA integrados",
        "Agente WhatsApp 24/7 para responder a clientes",
      ]}
      sections={[
        {
          title: "Cumplimiento sanitario",
          rows: [
            { feature: "Generación de XML SILOÉ (Anexo IV)", cloro: true, competitor: true },
            { feature: "Validación en tiempo real de lecturas fuera de rango", cloro: true, competitor: true },
            { feature: "Calculadora de dosificación química", cloro: true, competitor: true },
            { feature: "Histórico por vaso y exportación a Excel", cloro: true, competitor: true },
            { feature: "Plantillas de analíticas mensuales y anuales", cloro: true, competitor: true },
          ],
        },
        {
          title: "Operativa de campo",
          rows: [
            { feature: "App móvil offline para técnicos", cloro: true, competitor: "partial" },
            { feature: "Planificación de rutas y optimización geográfica", cloro: true, competitor: false },
            { feature: "Partes de trabajo con foto y firma del cliente", cloro: true, competitor: false },
            { feature: "Control horario y kilometraje de la flota", cloro: true, competitor: false },
            { feature: "Inventario y consumo de productos por visita", cloro: true, competitor: "partial" },
          ],
        },
        {
          title: "Cliente y facturación",
          rows: [
                        { feature: "Cobros con Bizum, tarjeta y SEPA", cloro: true, competitor: false },
            { feature: "Portal del cliente y comunidad de propietarios", cloro: true, competitor: false },
            { feature: "Agente WhatsApp 24/7", cloro: true, competitor: false },
            { feature: "Recordatorios automáticos y avisos de visita", cloro: true, competitor: "partial" },
          ],
        },
        {
          title: "Plataforma y datos",
          rows: [
            { feature: "Datos alojados en la UE (RGPD)", cloro: true, competitor: true },
            { feature: "API abierta e integraciones", cloro: true, competitor: false },
            { feature: "Soporte en castellano y catalán", cloro: true, competitor: true },
            { feature: "Migración guiada desde Excel", cloro: true, competitor: "partial" },
          ],
        },
      ]}
      bestFor={{
        cloro:
          "Tu empresa hace mantenimiento de piscinas y quieres unificar cumplimiento sanitario, rutas, facturación y atención al cliente en una sola herramienta.",
        competitor:
          "Solo necesitas registrar parámetros de agua y generar el XML de SILOÉ, y el resto de la operativa (rutas, facturación, cobros) la llevas con otras herramientas.",
      }}
      verdict="Si tu negocio es operar piscinas — con técnicos, rutas, clientes y facturas — Cloro te cubre de extremo a extremo. AutocontrolPiscinas es una buena pieza única para el autocontrol, pero te obliga a sumar otras herramientas para facturar, planificar y comunicarte con clientes."
    />
  );
}
