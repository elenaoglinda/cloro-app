import { createFileRoute } from "@tanstack/react-router";
import { ComparisonPage } from "@/components/site/ComparisonPage";

const COMPETITOR = "AutocontrolPiscinas";
const URL_PATH = "/comparativa/autocontrolpiscinas";

export const Route = createFileRoute("/comparativa/autocontrolpiscinas")({
  head: () => ({
    meta: [
      { title: `Flipper vs ${COMPETITOR} — Comparativa de software de piscinas` },
      {
        name: "description",
        content:
          "Comparamos Flipper y AutocontrolPiscinas: SILOÉ, rutas, facturación VeriFactu, agente WhatsApp y precios para empresas de mantenimiento en España.",
      },
      { property: "og:title", content: `Flipper vs ${COMPETITOR}` },
      {
        property: "og:description",
        content:
          "Análisis honesto entre Flipper y AutocontrolPiscinas para empresas de mantenimiento de piscinas en España.",
      },
      { property: "og:url", content: `https://flipper-app.lovable.app${URL_PATH}` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `https://flipper-app.lovable.app${URL_PATH}` }],
  }),
  component: Page,
});

function Page() {
  return (
    <ComparisonPage
      competitorName={COMPETITOR}
      competitorTagline="Software de autocontrol sanitario centrado en parámetros de agua y cumplimiento SILOÉ."
      intro="AutocontrolPiscinas es una herramienta especializada en el autocontrol sanitario: registra parámetros, calcula dosificaciones y ayuda a cumplir el RD 742/2013. Flipper cubre eso, y además gestiona rutas, técnicos, facturación VeriFactu, cobros y la atención de clientes por WhatsApp."
      summary={[
        "Mismo cumplimiento SILOÉ y XML del Anexo IV",
        "Flipper añade rutas, partes y firma digital del técnico",
        "Facturación VeriFactu, Bizum y SEPA integrados",
        "Agente WhatsApp 24/7 para responder a clientes",
      ]}
      sections={[
        {
          title: "Cumplimiento sanitario",
          rows: [
            { feature: "Generación de XML SILOÉ (Anexo IV)", flipper: true, competitor: true },
            { feature: "Validación en tiempo real de lecturas fuera de rango", flipper: true, competitor: true },
            { feature: "Calculadora de dosificación química", flipper: true, competitor: true },
            { feature: "Histórico por vaso y exportación a Excel", flipper: true, competitor: true },
            { feature: "Plantillas de analíticas mensuales y anuales", flipper: true, competitor: true },
          ],
        },
        {
          title: "Operativa de campo",
          rows: [
            { feature: "App móvil offline para técnicos", flipper: true, competitor: "partial" },
            { feature: "Planificación de rutas y optimización geográfica", flipper: true, competitor: false },
            { feature: "Partes de trabajo con foto y firma del cliente", flipper: true, competitor: false },
            { feature: "Control horario y kilometraje de la flota", flipper: true, competitor: false },
            { feature: "Inventario y consumo de productos por visita", flipper: true, competitor: "partial" },
          ],
        },
        {
          title: "Cliente y facturación",
          rows: [
            { feature: "Facturación electrónica VeriFactu", flipper: true, competitor: false },
            { feature: "Cobros con Bizum, tarjeta y SEPA", flipper: true, competitor: false },
            { feature: "Portal del cliente y comunidad de propietarios", flipper: true, competitor: false },
            { feature: "Agente WhatsApp 24/7", flipper: true, competitor: false },
            { feature: "Recordatorios automáticos y avisos de visita", flipper: true, competitor: "partial" },
          ],
        },
        {
          title: "Plataforma y datos",
          rows: [
            { feature: "Datos alojados en la UE (RGPD)", flipper: true, competitor: true },
            { feature: "API abierta e integraciones", flipper: true, competitor: false },
            { feature: "Soporte en castellano y catalán", flipper: true, competitor: true },
            { feature: "Migración guiada desde Excel", flipper: true, competitor: "partial" },
          ],
        },
      ]}
      bestFor={{
        flipper:
          "Tu empresa hace mantenimiento de piscinas y quieres unificar cumplimiento sanitario, rutas, facturación y atención al cliente en una sola herramienta.",
        competitor:
          "Solo necesitas registrar parámetros de agua y generar el XML de SILOÉ, y el resto de la operativa (rutas, facturación, cobros) la llevas con otras herramientas.",
      }}
      verdict="Si tu negocio es operar piscinas — con técnicos, rutas, clientes y facturas — Flipper te cubre de extremo a extremo. AutocontrolPiscinas es una buena pieza única para el autocontrol, pero te obliga a sumar otras herramientas para facturar, planificar y comunicarte con clientes."
    />
  );
}
