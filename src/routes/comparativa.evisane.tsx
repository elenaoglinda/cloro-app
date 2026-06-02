import { createFileRoute } from "@tanstack/react-router";
import { ComparisonPage } from "@/components/site/ComparisonPage";

const COMPETITOR = "EviSane";
const URL_PATH = "/comparativa/evisane";

export const Route = createFileRoute("/comparativa/evisane")({
  head: () => ({
    meta: [
      { title: `Cloro vs ${COMPETITOR} — Comparativa de software de piscinas` },
      {
        name: "description",
        content:
          "Comparamos Cloro y EviSane: gestión sanitaria de piscinas, SILOÉ, rutas, facturación VeriFactu y atención por WhatsApp para empresas en España.",
      },
      { property: "og:title", content: `Cloro vs ${COMPETITOR}` },
      {
        property: "og:description",
        content:
          "Análisis honesto entre Cloro y EviSane para empresas de mantenimiento de piscinas en España.",
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
      competitorTagline="Plataforma de gestión higiénico-sanitaria con módulos para piscinas, agua y legionela."
      intro="EviSane es una suite de cumplimiento higiénico-sanitario amplia, usada por instalaciones que combinan piscinas con control de legionela o agua de consumo. Cloro está enfocado 100% en empresas de mantenimiento de piscinas: cubre el RD 742/2013 con la misma seriedad, y suma rutas, facturación y atención al cliente sin módulos extra."
      summary={[
        "Foco total en piscinas, sin módulos que no usarás",
        "Implantación en menos de una semana",
        "Precio plano por técnico, sin consultoría obligatoria",
        "Agente WhatsApp y portal del cliente incluidos",
      ]}
      sections={[
        {
          title: "Cumplimiento sanitario",
          rows: [
            { feature: "Generación de XML SILOÉ (Anexo IV)", cloro: true, competitor: true },
            { feature: "Plan de autocontrol y muestreo configurable", cloro: true, competitor: true },
            { feature: "Control de legionela y agua de consumo", cloro: false, competitor: true, detail: "Cloro se centra en piscinas" },
            { feature: "Alertas de analíticas pendientes y desviaciones", cloro: true, competitor: true },
            { feature: "Histórico por vaso con trazabilidad", cloro: true, competitor: true },
          ],
        },
        {
          title: "Operativa de campo",
          rows: [
            { feature: "App móvil offline para técnicos", cloro: true, competitor: "partial" },
            { feature: "Planificación visual de rutas semanales", cloro: true, competitor: "partial" },
            { feature: "Partes con foto, firma y geolocalización", cloro: true, competitor: true },
            { feature: "Inventario de productos químicos por visita", cloro: true, competitor: true },
            { feature: "Control horario y kilometraje", cloro: true, competitor: "partial" },
          ],
        },
        {
          title: "Cliente y facturación",
          rows: [
            { feature: "Facturación electrónica VeriFactu", cloro: true, competitor: "partial" },
            { feature: "Cobros con Bizum, tarjeta y SEPA", cloro: true, competitor: false },
            { feature: "Portal del cliente y comunidad de propietarios", cloro: true, competitor: "partial" },
            { feature: "Agente WhatsApp 24/7", cloro: true, competitor: false },
            { feature: "Plantillas de presupuestos y contratos", cloro: true, competitor: "partial" },
          ],
        },
        {
          title: "Implantación y precio",
          rows: [
            { feature: "Implantación guiada sin consultoría obligatoria", cloro: true, competitor: false },
            { feature: "Precio plano por técnico", cloro: true, competitor: "partial", detail: "EviSane suele cotizar por proyecto" },
            { feature: "Migración desde Excel en 30 minutos", cloro: true, competitor: false },
            { feature: "Soporte en castellano", cloro: true, competitor: true },
          ],
        },
      ]}
      bestFor={{
        cloro:
          "Eres una empresa de mantenimiento de piscinas y quieres una herramienta lista para usar, con precio claro y todo lo necesario para operar y facturar incluido.",
        competitor:
          "Gestionas múltiples riesgos higiénico-sanitarios (legionela, agua de consumo, piscinas) en un mismo grupo y necesitas una suite transversal con consultoría a medida.",
      }}
      verdict="EviSane brilla cuando necesitas una plataforma sanitaria amplia para varios riesgos. Si tu negocio principal es el mantenimiento de piscinas, Cloro te da el mismo cumplimiento con menos complejidad y, sobre todo, integra la operativa diaria (rutas, facturas, cobros, WhatsApp) en el mismo lugar."
    />
  );
}
